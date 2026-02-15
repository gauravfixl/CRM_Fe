"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    UserPlus,
    MoreHorizontal,
    Rocket,
    CheckCircle2,
    Clock,
    ChevronRight,
    Plus,
    Trash2,
    Edit,
    Search,
    User,
    Calendar,
    LayoutGrid,
    List,
    AlertCircle
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, type NewHire, type OnboardingTask } from "@/shared/data/lifecycle-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Progress } from "@/shared/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const OnboardingPage = () => {
    const { newHires, addNewHire, updateNewHire, deleteNewHire, addTaskToHire, updateTaskStatus } = useLifecycleStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        position: "",
        department: "Engineering",
        startDate: "",
        mentor: ""
    });

    const resetForm = () => {
        setFormData({ name: "", position: "", department: "Engineering", startDate: "", mentor: "" });
    };

    const handleSaveHire = () => {
        if (!formData.name || !formData.startDate) {
            toast({ title: "Error", description: "Name and Start Date are required.", variant: "destructive" });
            return;
        }
        addNewHire(formData);
        toast({ title: "New Hire Registered", description: `Onboarding journey started for ${formData.name}.` });
        setIsDialogOpen(false);
        resetForm();
    };

    const StatusBadge = ({ status }: { status: NewHire['status'] }) => {
        const colors: Record<string, string> = {
            "Pre-boarding": "bg-blue-50 text-blue-600 border-blue-100",
            "Onboarding": "bg-purple-50 text-purple-600 border-purple-100",
            "Completed": "bg-emerald-50 text-emerald-600 border-emerald-100"
        };
        return <Badge className={`border font-black rounded-lg px-3 ${colors[status]}`}>{status}</Badge>;
    };

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Onboarding Hub</h1>
                    <p className="text-slate-500 font-medium italic">"The first 90 days define the next 9 years."</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center bg-slate-100 p-1 rounded-2xl h-12 shadow-inner">
                        <Button
                            variant={viewMode === "kanban" ? "white" : "ghost"}
                            onClick={() => setViewMode("kanban")}
                            className={`rounded-xl px-4 h-10 font-black flex gap-2 ${viewMode === 'kanban' ? 'shadow-sm' : 'text-slate-400'}`}
                        >
                            <LayoutGrid className="h-4 w-4" /> Kanban
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "white" : "ghost"}
                            onClick={() => setViewMode("list")}
                            className={`rounded-xl px-4 h-10 font-black flex gap-2 ${viewMode === 'list' ? 'shadow-sm' : 'text-slate-400'}`}
                        >
                            <List className="h-4 w-4" /> List
                        </Button>
                    </div>
                    <Button
                        onClick={() => { resetForm(); setIsDialogOpen(true); }}
                        className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-black border-none transition-all hover:scale-105"
                    >
                        <UserPlus className="mr-2 h-5 w-5" /> Register New Hire
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Onboarding", value: newHires.filter(h => h.status === 'Onboarding').length, color: "text-purple-600", bg: "bg-purple-50", icon: Rocket },
                    { label: "Pre-boarding", value: newHires.filter(h => h.status === 'Pre-boarding').length, color: "text-blue-600", bg: "bg-blue-50", icon: Clock },
                    { label: "Completed This Month", value: newHires.filter(h => h.status === 'Completed').length, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
                    { label: "Critical Tasks", value: 12, color: "text-red-500", bg: "bg-red-50", icon: AlertCircle }
                ].map((stat, i) => (
                    <Card key={i} className="rounded-[2rem] border-none shadow-sm bg-white p-6 group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-all group-hover:scale-110`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0">
                <Tabs defaultValue="all" className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                            <TabsTrigger value="all" className="rounded-xl px-8 font-bold">All Members</TabsTrigger>
                            <TabsTrigger value="action" className="rounded-xl px-8 font-bold">Action Required</TabsTrigger>
                            <TabsTrigger value="ready" className="rounded-xl px-8 font-bold">Ready to Launch</TabsTrigger>
                        </TabsList>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <Input placeholder="Search hires..." className="rounded-2xl h-11 w-64 bg-white border-none shadow-sm pl-11 font-medium" />
                        </div>
                    </div>

                    <TabsContent value="all" className="flex-1 m-0">
                        {viewMode === 'kanban' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {newHires.map((hire, i) => (
                                        <motion.div
                                            key={hire.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white hover:shadow-xl hover:shadow-purple-50 transition-all group overflow-hidden border-t-8 border-transparent hover:border-[#CB9DF0]">
                                                <CardContent className="p-8">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-14 w-14 rounded-[1.25rem] bg-slate-50 flex items-center justify-center font-black text-slate-400 text-xl border-2 border-dashed border-slate-100">
                                                                {hire.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{hire.name}</h3>
                                                                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{hire.position}</p>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 text-slate-300">
                                                                    <MoreHorizontal className="h-5 w-5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 font-bold w-48">
                                                                <DropdownMenuItem className="rounded-xl h-11 px-3"><Edit className="h-4 w-4 mr-2" /> Edit Journey</DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-xl h-11 px-3"><User className="h-4 w-4 mr-2" /> View Profile</DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                                <DropdownMenuItem onClick={() => deleteNewHire(hire.id)} className="rounded-xl h-11 px-3 text-red-600 focus:bg-red-50 focus:text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Cancel Onboarding</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black uppercase text-slate-400">Department</span>
                                                                <span className="text-xs font-bold text-slate-700">{hire.department}</span>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] font-black uppercase text-slate-400">Start Date</span>
                                                                <span className="text-xs font-bold text-slate-700">{hire.startDate}</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-end">
                                                                <StatusBadge status={hire.status} />
                                                                <span className="text-lg font-black text-slate-900">{hire.progress}%</span>
                                                            </div>
                                                            <Progress value={hire.progress} className="h-2 rounded-full bg-slate-100" />
                                                        </div>

                                                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex -space-x-3">
                                                                    {[1, 2].map(i => (
                                                                        <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                                                                    ))}
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-300 uppercase italic">Mentor: {hire.mentor}</span>
                                                            </div>
                                                            <Button variant="ghost" className="rounded-xl font-black text-[#CB9DF0] hover:bg-purple-50 tracking-tight gap-2">
                                                                Manage Tasks <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                                <th className="px-8 py-5 font-black text-xs uppercase text-slate-400 tracking-widest">Employee</th>
                                                <th className="px-6 py-5 font-black text-xs uppercase text-slate-400 tracking-widest">Department</th>
                                                <th className="px-6 py-5 font-black text-xs uppercase text-slate-400 tracking-widest">Journey Progress</th>
                                                <th className="px-6 py-5 font-black text-xs uppercase text-slate-400 tracking-widest">Status</th>
                                                <th className="px-8 py-5 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newHires.map((hire) => (
                                                <tr key={hire.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-sm italic">
                                                                {hire.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-slate-900">{hire.name}</span>
                                                                <span className="text-[10px] font-bold text-slate-400 italic">{hire.position}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 font-bold text-slate-600 text-sm">{hire.department}</td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3 max-w-[150px]">
                                                            <Progress value={hire.progress} className="h-1.5 flex-1" />
                                                            <span className="text-[10px] font-black text-slate-900">{hire.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5"><StatusBadge status={hire.status} /></td>
                                                    <td className="px-8 py-5 text-right">
                                                        <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 text-slate-300">
                                                            <ChevronRight className="h-5 w-5" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Register Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter tracking-tight">Initiate Journey</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Welcome your newest team members with excellence.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">New Hire Name</Label>
                            <Input
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Designation</Label>
                                <Input
                                    placeholder="e.g. Senior Architect"
                                    value={formData.position}
                                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Assigned Mentor</Label>
                                <Input
                                    placeholder="Who will guide them?"
                                    value={formData.mentor}
                                    onChange={e => setFormData({ ...formData, mentor: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Joining Date</Label>
                                <Input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Department</Label>
                                <select
                                    value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6 focus:ring-2 focus:ring-purple-100 outline-none"
                                >
                                    <option>Engineering</option>
                                    <option>Design</option>
                                    <option>Sales</option>
                                    <option>Human Resources</option>
                                    <option>Marketing</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSaveHire}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            Launch Onboarding
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

export default OnboardingPage;
