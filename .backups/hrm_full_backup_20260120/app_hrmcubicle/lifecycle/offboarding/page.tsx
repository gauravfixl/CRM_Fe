"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    LogOut,
    FileText,
    MessageSquare,
    UserCheck,
    AlertCircle,
    Calendar,
    ArrowRight,
    Search,
    Filter,
    Plus
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const ExitManagementPage = () => {
    const { toast } = useToast();
    const { employees, initiateExit } = useLifecycleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [activeReason, setActiveReason] = useState("");

    // Filter Exiting Employees
    const exitEmployees = employees.filter(e => e.status === 'Notice Period' || e.status === 'Exited');
    const activeEmployees = employees.filter(e => e.status === 'Active');

    const stats = [
        { label: "Active Resignations", value: exitEmployees.filter(e => e.status === 'Notice Period').length, color: "bg-[#F0C1E1]", icon: <LogOut className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Pending Interviews", value: exitEmployees.filter(e => e.status === 'Notice Period').length, color: "bg-[#FDDBBB]", icon: <MessageSquare className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Exits This Month", value: exitEmployees.filter(e => e.status === 'Exited').length, color: "bg-[#CB9DF0]", icon: <UserCheck className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const handleSubmit = () => {
        if (!selectedEmpId) {
            toast({ title: "Error", description: "Select an employee" });
            return;
        }
        initiateExit(selectedEmpId); // Moves to Notice Period
        setIsDialogOpen(false);
        setSelectedEmpId("");
        toast({ title: "Exit Initiated", description: "Employee moved to Notice Period." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exit Management</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 7: Resignation, Notice Period & Separation.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#F0C1E1] text-rose-800 hover:bg-[#eab0d6] rounded-xl h-12 px-6 shadow-xl font-bold">
                            <LogOut className="mr-2 h-5 w-5" /> Initiate Exit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                        <DialogHeader>
                            <DialogTitle>Initiate Separation</DialogTitle>
                            <DialogDescription>Start the exit process for an active employee.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Select Employee</Label>
                                <Select onValueChange={setSelectedEmpId}>
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Choose Active Employee..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeEmployees.map(e => (
                                            <SelectItem key={e.id} value={e.id}>{e.name} ({e.role})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Reason for Exit</Label>
                                <Input placeholder="e.g. Better Opportunity" value={activeReason} onChange={e => setActiveReason(e.target.value)} className="rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold h-12" onClick={handleSubmit}>Confirm Resignation</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 relative overflow-hidden group`}>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className={`text-4xl font-black ${stat.textColor || 'text-white'}`}>{stat.value}</h3>
                                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${stat.textColor || 'text-white/80'}`}>{stat.label}</p>
                                </div>
                                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    {stat.icon}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Resignations List */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden p-8 min-h-[400px]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-xl text-slate-900">Resignation Requests</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <Input className="pl-10 rounded-xl bg-slate-50 border-none w-64 font-medium" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {exitEmployees.length === 0 ? (
                        <div className="text-center p-10 text-slate-400 font-medium">No active resignation requests.</div>
                    ) : exitEmployees.map((item, i) => (
                        <div key={item.id} className="p-6 rounded-[2rem] bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <Avatar className="h-16 w-16 rounded-2xl bg-[#CB9DF0] text-white font-bold text-xl border-4 border-white shadow-sm">
                                    <AvatarFallback>{item.avatar}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <h4 className="font-black text-lg text-slate-900">{item.name}</h4>
                                    <p className="text-sm font-bold text-slate-400">{item.role}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-500 mt-2">
                                        <span className="flex items-center gap-1"><FileText size={14} /> Resigned: {new Date().toISOString().split('T')[0]}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> LWD: TBD</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2 w-48">
                                    <Badge className={`border-none font-bold px-3 py-1 ${item.status === 'Exited' ? 'bg-[#FFF9BF] text-slate-700' :
                                        item.status === 'Notice Period' ? 'bg-[#CB9DF0] text-white' :
                                            'bg-[#FDDBBB] text-amber-800'
                                        }`}>
                                        {item.status}
                                    </Badge>
                                </div>

                                <Button size="icon" className="rounded-xl h-12 w-12 bg-white text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm border border-slate-100" onClick={() => toast({ title: "View Workflow", description: `Opening exit workflow for ${item.name}` })}>
                                    <ArrowRight size={20} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ExitManagementPage;
