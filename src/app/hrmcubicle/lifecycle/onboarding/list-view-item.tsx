"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronUp, ChevronDown, Check, Trash2, Plus, Edit, MoreHorizontal, Rocket } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu";
import { useLifecycleStore, NewHire } from "@/shared/data/lifecycle-store";
import { useToast } from "@/shared/components/ui/use-toast";

const StatusBadge = ({ status }: { status: NewHire['status'] }) => {
    const colors: Record<string, string> = {
        "Pre-boarding": "bg-blue-50 text-blue-600 border-blue-100",
        "Onboarding": "bg-purple-50 text-purple-600 border-purple-100",
        "Completed": "bg-emerald-50 text-emerald-600 border-emerald-100"
    };
    return <Badge className={`border font-bold rounded-lg px-2 text-[10px] ${colors[status] || 'bg-slate-100'}`}>{status}</Badge>;
};

export const ListViewItem = ({ hire }: { hire: NewHire }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const { updateNewHire, addTaskToHire, updateTaskStatus, completeOnboarding, deleteNewHire, deleteTaskFromHire, startOnboarding } = useLifecycleStore();
    const { toast } = useToast();

    const completedTasks = hire.tasks.filter(t => t.status === 'Completed').length;
    const totalTasks = hire.tasks.length;

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
        <>
            <tr className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${isExpanded ? 'bg-slate-50/80' : ''}`}>
                <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-400 text-[10px]">{hire.name.charAt(0)}</div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-xs">{hire.name}</span>
                            <span className="text-[9px] font-bold text-slate-400">{hire.position}</span>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2 max-w-[100px]">
                        <Progress value={hire.progress} className="h-1 flex-1" />
                        <span className="text-[9px] font-bold text-slate-900">{hire.progress}%</span>
                    </div>
                </td>
                <td className="px-4 py-2.5"><StatusBadge status={hire.status} /></td>
                <td className="px-4 py-2.5 text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`rounded-lg h-7 w-7 p-0 transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-500' : 'text-slate-300 hover:text-indigo-500'}`}
                    >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </Button>
                </td>
            </tr>
            <AnimatePresence>
                {isExpanded && (
                    <tr>
                        <td colSpan={4} className="p-0 border-b border-slate-50">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-slate-50/30"
                            >
                                <div className="p-4 flex flex-col md:flex-row gap-6">
                                    {/* Task List */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <h4 className="text-[10px] font-bold text-slate-400">Milestones Checklist</h4>
                                            <Button size="sm" variant="outline" className="h-6 text-[9px] font-bold rounded-lg border-slate-200" onClick={() => setIsTaskDialogOpen(true)}>
                                                <Plus size={10} className="mr-1" /> Add Milestone
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {hire.tasks.map((task) => (
                                                <div key={task.id} className="group flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                    <div
                                                        onClick={() => updateTaskStatus(hire.id, task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                                                        className={`h-5 w-5 rounded-lg flex items-center justify-center border cursor-pointer transition-all ${task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                                                    >
                                                        {task.status === 'Completed' && <Check className="h-3 w-3" />}
                                                    </div>
                                                    <span className={`flex-1 text-xs font-bold text-slate-700 ${task.status === 'Completed' ? 'line-through opacity-50' : ''}`}>{task.title}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                                        onClick={() => {
                                                            deleteTaskFromHire(hire.id, task.id);
                                                            toast({ title: "Task Removed", description: "Milestone deleted." });
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                            {hire.tasks.length === 0 && <p className="text-sm italic text-slate-400 text-center py-4">No tasks assigned.</p>}
                                        </div>
                                    </div>

                                    {/* Actions Panel */}
                                    <div className="w-full md:w-56 space-y-3">
                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm h-full flex flex-col justify-center">
                                            <h4 className="text-[10px] font-bold text-slate-400 mb-2.5">Lifecycle Actions</h4>

                                            <Button
                                                className={`w-full rounded-lg font-bold text-[10px] h-9 gap-2 mb-2 shadow-sm transition-all ${hire.progress === 100 ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                                disabled={hire.progress < 100}
                                                onClick={() => {
                                                    if (hire.progress === 100) {
                                                        if (hire.status === 'Pre-boarding') {
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
                                                {hire.progress === 100 ? (hire.status === 'Pre-boarding' ? 'Promote Employee' : 'Finish Journey') : 'Complete Tasks'} {hire.progress === 100 && <ChevronRight className="h-4 w-4" />}
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="w-full border-slate-200 rounded-xl font-bold text-xs h-10 text-rose-500 hover:bg-rose-50 hover:border-rose-200"
                                                onClick={() => deleteNewHire(hire.id)}
                                            >
                                                <Trash2 size={14} className="mr-2" /> Remove Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>

            {/* Sub-dialog for adding tasks */}
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-100 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">New Milestone</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">
                            Create a goal for {hire.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
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
                        <Button
                            variant="ghost"
                            onClick={() => setIsTaskDialogOpen(false)}
                            className="rounded-xl font-bold text-slate-400 h-9 px-4 text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddTask}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl px-6 font-bold shadow-md shadow-purple-50 h-9 text-xs"
                        >
                            Add Milestone
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
