"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Rocket,
    LogOut,
    CheckCircle2,
    Clock,
    ChevronRight,
    MoreHorizontal,
    UserPlus,
    ClipboardList,
    ShieldCheck,
    Briefcase,
    Zap,
    Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Progress } from "@/shared/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

const TeamLifecyclePage = () => {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [showTransition, setShowTransition] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const onboardingList = [
        { id: 1, name: "Harsh Vardhan", role: "Junior Developer", start: "Yesterday", progress: 65, tasks: "4/6", mentor: "Viral Vora", img: "https://i.pravatar.cc/150?u=harsh", dept: "Engineering", email: "harsh.v@company.com" },
        { id: 2, name: "Ananya Panday", role: "Marketing Intern", start: "Tomorrow", progress: 10, tasks: "1/8", mentor: "Gaurav (You)", img: "https://i.pravatar.cc/150?u=ananya", dept: "Growth", email: "ananya.p@company.com" },
    ];

    const exitsList = [
        {
            id: 1, name: "Rahul Deshmukh", role: "Sr. Dev", lastDate: "Jan 30, 2026", status: "In Progress", clearance: "2/5 Depts", img: "https://i.pravatar.cc/150?u=rahul", clearanceDetails: [
                { dept: "IT & Assets", status: "cleared", remark: "MacBook & ID Returned" },
                { dept: "Finance", status: "cleared", remark: "Full & Final Settlement Done" },
                { dept: "HR & Admin", status: "pending", remark: "Exit Interview Pending" },
                { dept: "Project Manager", status: "pending", remark: "Knowledge Transfer in Progress" },
                { dept: "Library/Others", status: "pending", remark: "Internal Dues Check" }
            ]
        },
    ];

    if (!mounted) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { opacity: 1, scale: 1 }
    };

    const handleTransition = () => {
        toast({
            title: "Transition Initiated",
            description: "The request has been sent to HR for approval.",
        });
        setShowTransition(false);
    };

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your lifecycle tracker export is being prepared.",
        });
        setShowExport(false);
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start font-sans">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-start">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Lifecycle Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Tracking employee transitions from Day 0 to Exit.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl border-slate-200 h-12 px-6 font-bold text-xs uppercase tracking-widest hover:bg-slate-50" onClick={() => setShowExport(true)}>
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export Trackers
                    </Button>
                    <Button
                        className="bg-[#6366f1] hover:bg-[#4f46e5] rounded-2xl h-12 px-6 font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-100"
                        onClick={() => setShowTransition(true)}
                    >
                        Initiate Transition
                    </Button>
                </div>
            </div>

            {/* Lifecycle Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Onboarding", val: "02", color: "text-indigo-600", bg: "bg-indigo-50", icon: <Rocket /> },
                    { label: "Planned Exits", val: "01", color: "text-rose-600", bg: "bg-rose-50", icon: <LogOut /> },
                    { label: "Tasks Pending", val: "05", color: "text-amber-600", bg: "bg-amber-50", icon: <ClipboardList /> },
                    { label: "Clearance Due", val: "02", color: "text-emerald-600", bg: "bg-emerald-50", icon: <ShieldCheck /> }
                ].map((m, i) => (
                    <Card key={i} className="border-none shadow-sm group hover:shadow-xl hover:translate-y-[-2px] transition-all cursor-pointer" onClick={() => {
                        toast({ title: `Viewing ${m.label}`, description: "Navigating to filtered view..." });
                    }}>
                        <CardContent className="p-6 flex items-center gap-5">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${m.bg} ${m.color} shadow-sm transition-transform group-hover:scale-110`}>
                                {React.cloneElement(m.icon as React.ReactElement, { size: 28 })}
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{m.val}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{m.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="onboarding" className="space-y-6">
                <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-14 border border-slate-100 w-full md:w-auto">
                    <TabsTrigger value="onboarding" className="rounded-xl font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md px-10 h-full">Onboarding Hub</TabsTrigger>
                    <TabsTrigger value="offboarding" className="rounded-xl font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md px-10 h-full">Exit Clearance</TabsTrigger>
                </TabsList>

                <TabsContent value="onboarding" className="space-y-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-6 md:grid-cols-2"
                    >
                        {onboardingList.map((j) => (
                            <motion.div key={j.id} variants={itemVariants}>
                                <Card className="border-none shadow-sm hover:shadow-2xl transition-all overflow-hidden bg-white group text-start">
                                    <div className="h-2 bg-indigo-600 w-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="p-10">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="flex items-center gap-5">
                                                <Avatar className="h-20 w-20 ring-4 ring-slate-50 shadow-xl border border-white">
                                                    <AvatarImage src={j.img} />
                                                    <AvatarFallback className="bg-indigo-600 text-white font-black text-xl">{j.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{j.name}</h4>
                                                    <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1">{j.role}</p>
                                                    <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full w-fit">
                                                        <Briefcase className="h-3 w-3" /> {j.dept}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[9px] uppercase px-4 py-1.5 rounded-xl shadow-sm">Day {j.start === 'Yesterday' ? '1' : '0'}</Badge>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                                                    <span>Progression Map</span>
                                                    <span className="text-indigo-600">{j.progress}% Completed</span>
                                                </div>
                                                <Progress value={j.progress} className="h-3 bg-slate-100 rounded-full" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 group-hover:bg-white group-hover:shadow-md transition-all">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Mentor Support</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <p className="text-sm font-black text-slate-700">{j.mentor}</p>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 group-hover:bg-white group-hover:shadow-md transition-all">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Onboarding Roadmap</p>
                                                    <p className="text-sm font-black text-slate-700">{j.tasks} Milestone</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <Button
                                                    className="flex-1 h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[2rem] transition-all shadow-xl shadow-indigo-100"
                                                    onClick={() => {
                                                        toast({ title: "Module Loaded", description: `Opening ${j.name}'s onboarding workspace...` });
                                                    }}
                                                >
                                                    CONTINUE JOURNEY <ChevronRight className="h-4 w-4 ml-2" />
                                                </Button>
                                                <Button variant="outline" className="h-16 w-16 rounded-[2rem] border-slate-100 hover:bg-slate-50" onClick={() => {
                                                    setSelectedMember(j);
                                                    setShowDetails(true);
                                                }}>
                                                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </TabsContent>

                <TabsContent value="offboarding">
                    <Card className="border-none shadow-sm overflow-hidden bg-white text-start rounded-3xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                        <th className="px-10 py-6 text-left">Resigning Employee</th>
                                        <th className="px-10 py-6 text-center">Last Working Day</th>
                                        <th className="px-10 py-6 text-center">Clearance Status</th>
                                        <th className="px-10 py-6 text-center">Process State</th>
                                        <th className="px-10 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exitsList.map((e) => (
                                        <tr key={e.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-none group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-14 w-14 ring-2 ring-slate-100 shadow-sm transition-transform group-hover:scale-105">
                                                        <AvatarImage src={e.img} className="grayscale" />
                                                        <AvatarFallback>RD</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-lg font-black text-slate-800">{e.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{e.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <div className="bg-rose-50 px-4 py-2 rounded-2xl inline-block border border-rose-100/50">
                                                    <p className="text-sm font-black text-rose-600">{e.lastDate}</p>
                                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-tighter mt-0.5">Final Sunset</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center min-w-[300px]">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                                        <span>{e.clearance} Depts</span>
                                                        <span className="text-emerald-600">40% Alpha</span>
                                                    </div>
                                                    <Progress value={40} className="h-2.5 bg-slate-100 rounded-full" />
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px] uppercase tracking-widest px-5 py-2 rounded-xl shadow-sm">Clearance {e.status}</Badge>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <Button
                                                    className="bg-white border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-600 px-6 py-2 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all text-slate-500 shadow-sm"
                                                    onClick={() => {
                                                        setSelectedMember(e);
                                                        setShowDetails(true);
                                                    }}
                                                >
                                                    AUDIT CLEARANCE
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Transition Dialog */}
            <Dialog open={showTransition} onOpenChange={setShowTransition}>
                <DialogContent className="rounded-[3rem] border-none shadow-2xl p-10 bg-white max-w-xl text-start">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black">Initiate Transition</DialogTitle>
                        <p className="text-slate-500 font-medium mt-2">Change employment state or start offboarding process.</p>
                    </DialogHeader>
                    <div className="space-y-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 ml-2">Select Team Member</Label>
                            <Select>
                                <SelectTrigger className="h-16 rounded-[2rem] border-slate-100 px-8 focus:ring-indigo-600">
                                    <SelectValue placeholder="Choose a direct report..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl border-slate-100 shadow-2xl">
                                    {onboardingList.map(m => (
                                        <SelectItem key={m.id} value={m.name} className="py-4 px-6 rounded-2xl font-bold text-slate-600 focus:bg-indigo-50 focus:text-indigo-600">{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 ml-2">Transition Type</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'promo', label: 'Promotion', icon: <Rocket className="h-4 w-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { id: 'exit', label: 'Resignation', icon: <LogOut className="h-4 w-4" />, color: 'text-rose-600', bg: 'bg-rose-50' },
                                    { id: 'dept', label: 'Dept Change', icon: <Zap className="h-4 w-4" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { id: 'probation', label: 'Confirmation', icon: <ShieldCheck className="h-4 w-4" />, color: 'text-amber-600', bg: 'bg-amber-50' },
                                ].map(t => (
                                    <div key={t.id} className="flex items-center gap-3 p-5 rounded-3xl border border-slate-100 cursor-pointer hover:border-indigo-600 hover:shadow-md transition-all group">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${t.bg} ${t.color}`}>
                                            {t.icon}
                                        </div>
                                        <span className="font-black text-slate-700 group-hover:text-indigo-600 text-[10px] uppercase tracking-widest">{t.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 ml-2">Management Remarks</Label>
                            <Textarea placeholder="Context for HR & Admin..." className="rounded-[2.5rem] border-slate-100 p-8 min-h-[140px] focus-visible:ring-indigo-600" />
                        </div>
                    </div>
                    <DialogFooter className="gap-4 sm:gap-4">
                        <Button variant="ghost" className="flex-1 h-14 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-slate-400" onClick={() => setShowTransition(false)}>ABORT</Button>
                        <Button className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-100" onClick={handleTransition}>SUBMIT REQUEST</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Sheet for Onboarding/Offboarding */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="rounded-[3rem] border-none shadow-2xl p-0 bg-white max-w-2xl overflow-hidden text-start">
                    {selectedMember && (
                        <div className="relative">
                            <div className="h-32 bg-indigo-600 w-full" />
                            <div className="px-12 pb-12">
                                <div className="flex justify-between items-end -mt-16 mb-10">
                                    <Avatar className="h-32 w-32 border-8 border-white shadow-2xl">
                                        <AvatarImage src={selectedMember.img} className={selectedMember.lastDate ? 'grayscale' : ''} />
                                        <AvatarFallback className="bg-indigo-600 text-white font-black text-3xl">{selectedMember.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex gap-3 pb-2">
                                        <Button className="rounded-2xl h-11 bg-indigo-600 hover:bg-indigo-700 px-6 font-black text-[9px] uppercase tracking-widest shadow-xl shadow-indigo-100">Contact</Button>
                                        <Button variant="outline" className="rounded-2xl h-11 border-slate-100 px-6 font-black text-[9px] uppercase tracking-widest">Documents</Button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900">{selectedMember.name}</h3>
                                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px] mt-1">{selectedMember.role} • {selectedMember.dept || 'Engineering'}</p>
                                    </div>

                                    {selectedMember.lastDate ? (
                                        // Offboarding Clearances
                                        <div className="space-y-6">
                                            <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 ml-1">Clearance Checklist Audit</Label>
                                            <div className="space-y-3">
                                                {selectedMember.clearanceDetails.map((c: any, i: number) => (
                                                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${c.status === 'cleared' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                                {c.status === 'cleared' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{c.dept}</p>
                                                                <p className="text-[10px] text-slate-400 font-medium">{c.remark}</p>
                                                            </div>
                                                        </div>
                                                        <Badge className={`${c.status === 'cleared' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} border-none font-black text-[8px] uppercase px-3 py-1 rounded-full`}>{c.status}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        // Onboarding Milestones
                                        <div className="space-y-6">
                                            <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 ml-1">Onboarding Roadmap Audit</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100/50">
                                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Current Progress</p>
                                                    <h4 className="text-2xl font-black text-indigo-600">{selectedMember.progress}%</h4>
                                                </div>
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time To Value</p>
                                                    <h4 className="text-2xl font-black text-slate-700">14 Days</h4>
                                                </div>
                                            </div>
                                            <Button className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-slate-200">ACCELERATE ONBOARDING</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Export Dialog */}
            <Dialog open={showExport} onOpenChange={setShowExport}>
                <DialogContent className="rounded-[3rem] border-none shadow-2xl p-10 bg-white max-w-md text-start">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Data Intelligence Export</DialogTitle>
                        <p className="text-slate-500 font-medium mt-2">Export comprehensive lifecycle tracking data.</p>
                    </DialogHeader>
                    <div className="space-y-6 py-8">
                        <div className="space-y-4">
                            {['Current Onboarding', 'Historical Transitions', 'Offboarding Audits', 'Asset Recovery Report'].map((type, i) => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-3xl border border-slate-100 hover:border-indigo-600 hover:bg-slate-50 transition-all cursor-pointer group">
                                    <div className="h-6 w-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-600 transition-all">
                                        <div className="h-2 w-2 rounded-full bg-indigo-600 group-hover:bg-white" />
                                    </div>
                                    <span className="font-bold text-slate-600 text-[11px] uppercase tracking-widest">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="flex-col gap-4 sm:flex-col">
                        <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100" onClick={handleExport}>DOWNLOAD DATASET</Button>
                        <Button variant="ghost" className="w-full h-14 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-slate-400" onClick={() => setShowExport(false)}>CANCEL</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default TeamLifecyclePage;
