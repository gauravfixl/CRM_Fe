"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Users,
    Zap,
    CheckCircle2,
    Clock,
    Search,
    ChevronRight,
    Trophy,
    Calendar,
    Mail,
    Phone,
    MoreHorizontal,
    Star,
    Target,
    Crown,
    Plus,
    X
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Progress } from "@/shared/components/ui/progress";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore } from "@/shared/data/organisation-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";

const TeamDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { teams, employees, departments, addTeamMember, removeTeamMember } = useOrganisationStore();
    const [mounted, setMounted] = useState(false);
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const teamId = params?.id as string;
    const team = teams.find(t => t.id === teamId);

    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <Target size={64} className="text-slate-200" />
                <h2 className="text-2xl font-bold text-slate-900">Team not found</h2>
                <Button onClick={() => router.push('/hrmcubicle/organization/teams')}>Back to Teams</Button>
            </div>
        );
    }

    const lead = employees.find(e => e.id === team.leadId);
    const teamMembers = employees.filter(e => team.memberIds.includes(e.id));
    const dept = departments.find(d => d.id === team.departmentId);

    const handleAddMember = (empId: string) => {
        addTeamMember(team.id, empId);
        toast({ title: "Member Added", description: "Successfully added to the team." });
        setIsAddMemberDialogOpen(false);
    };

    const handleRemoveMember = (empId: string) => {
        if (empId === team.leadId) {
            toast({ title: "Operation Denied", description: "Cannot remove the team lead.", variant: "destructive" });
            return;
        }
        removeTeamMember(team.id, empId);
        toast({ title: "Member Removed", description: "Team roster updated." });
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start" style={{ zoom: "90%" }}>

            {/* Header & Breadcrumbs */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                    <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => router.push('/hrmcubicle/organization/teams')}>Teams</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-indigo-600">Workhub Detail</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">{team.name}</h1>
                                <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] uppercase">Active</Badge>
                            </div>
                            <p className="text-slate-500 font-medium mt-1">{dept?.name || 'General'} Department • Led by {lead?.firstName} {lead?.lastName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black text-[10px] tracking-widest h-11 px-6 shadow-lg uppercase"
                        >
                            Team Workspace
                        </Button>
                    </div>
                </div>
            </div>

            {/* Strategy Card */}
            <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative rounded-[3rem]">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap className="h-40 w-40" />
                </div>
                <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <Badge className="bg-white/20 text-white border-none py-1 px-3 italic uppercase text-[10px] font-bold tracking-widest">TEAM MISSION & STRATEGY</Badge>
                        <h2 className="text-4xl font-black leading-tight italic">"{team.mission}"</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span className="text-xs font-bold">Focusing on Q1 2024 Goals</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <Star className="h-4 w-4 text-amber-400" />
                                <span className="text-xs font-bold">Top Performing Team</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 w-full md:w-80">
                        <div className="text-center space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 leading-none">Current Velocity</p>
                            <div className="text-6xl font-black tracking-tighter leading-none">{team.stats.velocity}%</div>
                            <Progress value={team.stats.velocity} className="h-2 bg-indigo-900/50" />
                            <p className="text-[10px] font-bold text-indigo-100 font-medium italic">Exceeding benchmark by 12%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Active Members", value: team.memberIds.length, sub: "High engagement", icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Tasks Done", value: team.stats.tasksCompleted, sub: "Last 30 days", icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Avg. Uptime", value: team.stats.uptime, sub: "Service reliability", icon: <Clock />, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Win Rate", value: "92%", sub: "Project success", icon: <Trophy />, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((s, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2rem] ring-1 ring-slate-100">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${s.bg} ${s.color}`}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                                <h4 className="text-xl font-black text-slate-900">{s.value}</h4>
                                <p className="text-[10px] font-medium text-slate-500">{s.sub}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">

                {/* Team Members List */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-sm rounded-[2.5rem] ring-1 ring-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-black">Members</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setIsAddMemberDialogOpen(true)}
                            >
                                <Plus size={16} />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            {teamMembers.map((m) => (
                                <div key={m.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                <AvatarFallback className="bg-slate-900 text-white font-bold">{m.profileImage}</AvatarFallback>
                                            </Avatar>
                                            {m.id === team.leadId && (
                                                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-amber-500 flex items-center justify-center">
                                                    <Crown size={10} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{m.firstName} {m.lastName}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.id === team.leadId ? 'Team Lead' : 'Contributor'}</p>
                                        </div>
                                    </div>
                                    {m.id !== team.leadId && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500"
                                            onClick={() => handleRemoveMember(m.id)}
                                        >
                                            <X size={14} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                className="w-full bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white border-none rounded-xl h-11 font-black text-[10px] tracking-widest uppercase mt-4 shadow-sm"
                                onClick={() => setIsAddMemberDialogOpen(true)}
                            >
                                ADD TEAM MEMBER
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects & Roadmap */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm rounded-[2.5rem] ring-1 ring-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                            <div>
                                <CardTitle className="text-lg font-black">Active Team Deliverables</CardTitle>
                                <CardDescription className="text-xs font-medium italic">Tracking real-time progress of team sprints.</CardDescription>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl px-6 h-10 font-black text-[10px] uppercase shadow-lg shadow-indigo-100 tracking-widest">New Deliverable</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {[
                                    { id: 1, name: "Strategic Roadmap Q2", progress: 75, deadline: "Feb 15", priority: "High" },
                                    { id: 2, name: "Operation Execution V2", progress: 30, deadline: "Mar 01", priority: "Medium" },
                                ].map((p) => (
                                    <div key={p.id} className="p-8 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-black text-slate-900 text-base">{p.name}</h4>
                                                    <Badge className={`text-[8px] uppercase border-none py-0.5 px-2 ${p.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{p.priority}</Badge>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" /> Deadline: {p.deadline}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-slate-900">{p.progress}%</span>
                                            </div>
                                        </div>
                                        <Progress value={p.progress} className="h-2.5 bg-slate-100 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-slate-900 text-white p-10 rounded-[3rem] relative overflow-hidden group">
                        <Star className="absolute -left-4 -top-4 h-24 w-24 text-white/5 rotate-12" />
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="text-center md:text-left">
                                <h4 className="text-2xl font-black">Ready for Next Sprint?</h4>
                                <p className="text-sm text-slate-400 mt-2 font-medium">Team capacity is currently at 85%. You can safely assign 2 more high-complexity tasks.</p>
                            </div>
                            <Button className="bg-white text-slate-900 hover:bg-primary/90 rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest transition-all shadow-xl">
                                INITIATE SPRINT
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>

            {/* Add Member Dialog */}
            <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-md shadow-3xl">
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-1 shadow-inner">
                            <Users size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Add Team Member</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Select an employee to join this specialized unit.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Select Employee</Label>
                            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto p-1 scrollbar-hide">
                                {employees
                                    .filter(emp => !team.memberIds.includes(emp.id))
                                    .map(emp => (
                                        <div
                                            key={emp.id}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all group"
                                            onClick={() => handleAddMember(emp.id)}
                                        >
                                            <Avatar className="h-10 w-10 border border-white shadow-sm">
                                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-[10px]">{emp.profileImage}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{emp.firstName} {emp.lastName}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">{emp.employeeCode}</p>
                                            </div>
                                            <Badge variant="outline" className="border-slate-100 text-slate-400 text-[8px] h-5">Add</Badge>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-50">
                        <Button variant="outline" className="w-full h-11 rounded-xl font-bold text-xs" onClick={() => setIsAddMemberDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TeamDetailPage;
