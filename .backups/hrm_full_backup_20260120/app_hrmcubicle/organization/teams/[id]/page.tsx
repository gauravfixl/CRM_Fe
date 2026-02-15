"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Users,
    Briefcase,
    Zap,
    CheckCircle2,
    Clock,
    Search,
    ChevronRight,
    Trophy,
    LayoutGrid,
    Calendar,
    Mail,
    Phone,
    MessageCircle,
    MoreHorizontal,
    Star,
    Target
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Progress } from "@/shared/components/ui/progress";
import { useToast } from "@/shared/components/ui/use-toast";

const TeamDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const teamId = params?.id as string;

    // Mock Data for specific teams
    const allTeamsData: Record<string, any> = {
        "T-501": {
            name: "Talent Acquisition",
            dept: "HR",
            lead: "Kriti Sanon",
            leadImg: "https://i.pravatar.cc/150?u=female4",
            mission: "Scaling our workforce with top-tier global talent while ensuring cultural alignment.",
            stats: { velocity: 88, tasksCompleted: 142, activeMembers: 8, uptime: "99.2%" },
            members: [
                { id: 1, name: "Kriti Sanon", role: "Team Lead", status: "Focus Mode", email: "kriti@company.com", img: "https://i.pravatar.cc/150?u=female4" },
                { id: 2, name: "Amit Shah", role: "Technical Recruiter", status: "Interviewing", email: "amit@company.com", img: "https://i.pravatar.cc/150?u=male5" },
                { id: 3, name: "Sana Khan", role: "Sourcer", status: "Available", email: "sana@company.com", img: "https://i.pravatar.cc/150?u=female6" },
            ],
            projects: [
                { id: 1, name: "Engineering Spring Hiring", progress: 75, deadline: "Feb 15", priority: "High" },
                { id: 2, name: "Internal Mobility Policy", progress: 30, deadline: "Mar 01", priority: "Medium" },
            ]
        },
        "T-001": {
            name: "Frontend Platform",
            dept: "Engineering",
            lead: "Sneha Reddy",
            leadImg: "https://i.pravatar.cc/150?u=female5",
            mission: "Building the world's most intuitive and high-performance user interfaces.",
            stats: { velocity: 94, tasksCompleted: 450, activeMembers: 12, uptime: "99.9%" },
            members: [
                { id: 1, name: "Sneha Reddy", role: "Lead Architect", status: "Reviewing Code", email: "sneha@company.com", img: "https://i.pravatar.cc/150?u=female5" },
                { id: 2, name: "Rohan Das", role: "UI Engineer", status: "Coding", email: "rohan@company.com", img: "https://i.pravatar.cc/150?u=male6" },
            ],
            projects: [
                { id: 1, name: "Design System 2.0", progress: 92, deadline: "Jan 30", priority: "Critical" },
                { id: 2, name: "Next.js Migration", progress: 45, deadline: "Mar 20", priority: "High" },
            ]
        }
    };

    const team = allTeamsData[teamId] || {
        name: "Operational Team",
        dept: "General",
        lead: "Lead Manager",
        leadImg: "https://i.pravatar.cc/150?u=admin",
        mission: "Executing functional operations with precision and excellence.",
        stats: { velocity: 80, tasksCompleted: 50, activeMembers: 5, uptime: "95%" },
        members: [],
        projects: []
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start">

            {/* Header & Breadcrumbs */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => router.push('/hrmcubicle/organization/departments')}>Departments</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-indigo-600">Team Workhub</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">{team.name}</h1>
                                <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] uppercase">Workhub Active</Badge>
                            </div>
                            <p className="text-slate-500 font-medium mt-1">{team.dept} Department • Led by {team.lead}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl border-slate-200">
                            <Target className="h-4 w-4 mr-2" /> Key Results
                        </Button>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black text-[10px] tracking-widest h-11 px-6 shadow-lg uppercase">
                            Team Chat
                        </Button>
                    </div>
                </div>
            </div>

            {/* Strategy Card */}
            <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap className="h-40 w-40" />
                </div>
                <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <Badge className="bg-white/20 text-white border-none py-1 px-3">TEAM MISSION & STRATEGY</Badge>
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
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 w-full md:w-80">
                        <div className="text-center space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Current Velocity</p>
                            <div className="text-6xl font-black tracking-tighter">{team.stats.velocity}%</div>
                            <Progress value={team.stats.velocity} className="h-2 bg-indigo-900/50" />
                            <p className="text-[10px] font-bold text-indigo-100">Exceeding benchmark by 12%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { label: "Active Members", value: team.stats.activeMembers, sub: "High engagement", icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Tasks Done", value: team.stats.tasksCompleted, sub: "Last 30 days", icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Avg. Uptime", value: team.stats.uptime, sub: "Service reliability", icon: <Clock />, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Win Rate", value: "92%", sub: "Project success", icon: <Trophy />, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((s, i) => (
                    <Card key={i} className="border-none shadow-sm">
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
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-black">Members</CardTitle>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {team.members.map((m: any) => (
                                <div key={m.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm">
                                                <AvatarImage src={m.img} />
                                                <AvatarFallback>{m.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{m.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-slate-50 text-slate-400 border-none group-hover:bg-indigo-50 group-hover:text-indigo-600 text-[8px] uppercase">{m.status}</Badge>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border-none rounded-xl h-10 font-black text-[10px] tracking-widest uppercase mt-4">
                                ADD TEAM MEMBER
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects & Roadmap */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                            <div>
                                <CardTitle className="text-lg font-black">Current Sprint / Tasks</CardTitle>
                                <CardDescription>Tracking real-time progress of team deliverables.</CardDescription>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-4 h-9 font-bold text-[10px] uppercase shadow-lg shadow-indigo-100">New Task</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {team.projects.map((p: any) => (
                                    <div key={p.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-black text-slate-900">{p.name}</h4>
                                                    <Badge className={`text-[8px] uppercase border-none ${p.priority === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{p.priority}</Badge>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" /> Deadline: {p.deadline}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-slate-900">{p.progress}%</span>
                                            </div>
                                        </div>
                                        <Progress value={p.progress} className="h-2 bg-slate-100 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-slate-900 text-white p-8">
                        <div className="flex items-center justify-between gap-8">
                            <div>
                                <h4 className="text-xl font-black">Ready for Next Sprint?</h4>
                                <p className="text-sm text-slate-400 mt-2">Team capacity is currently at 85%. You can safely assign 2 more high-complexity tasks.</p>
                            </div>
                            <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl h-11 px-6 font-black uppercase text-[10px] tracking-widest transition-all">
                                PLAN SPRINT
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    );
};

export default TeamDetailPage;
