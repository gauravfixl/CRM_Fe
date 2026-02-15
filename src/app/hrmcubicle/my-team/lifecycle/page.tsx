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
import { useTeamStore } from "@/shared/data/team-store";

const TeamLifecyclePage = () => {
    const { members, lifecycleEvents, initiateTransition } = useTeamStore();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [showTransition, setShowTransition] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);

    // Form states
    const [transitionMemberId, setTransitionMemberId] = useState("");
    const [transitionType, setTransitionType] = useState<'Promotion' | 'Resignation' | 'Dept Change' | 'Confirmation'>("Promotion");
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    // Local state for interactive progress (simulating real-time updates)
    const [localOnboarding, setLocalOnboarding] = useState<any[]>([]);

    useEffect(() => {
        // Initialize local onboarding data from members
        const list = members.filter(m => m.status === 'Active').slice(0, 2).map((m, i) => ({
            ...m,
            id: m.id,
            start: i === 0 ? 'Yesterday' : 'Tomorrow',
            progress: i === 0 ? 65 : 10,
            tasks: i === 0 ? "4/6" : "1/8",
            mentor: i === 0 ? "Viral Vora" : "Gaurav (You)",
            img: `https://i.pravatar.cc/150?u=${m.id}`,
            dept: m.department,
            role: m.designation
        }));
        setLocalOnboarding(list);
    }, [members]);

    // Local state for clearance status
    const [localExits, setLocalExits] = useState<any[]>([]);

    useEffect(() => {
        const list = lifecycleEvents.filter(ev => ev.type === 'Resignation').map(ev => {
            const member = members.find(m => m.id === ev.empId);
            return {
                ...ev,
                id: ev.id,
                name: member?.name || ev.empName,
                role: member?.designation || "Employee",
                dept: member?.department || "Department",
                img: `https://i.pravatar.cc/150?u=${ev.empId}`,
                lastDate: ev.date,
                status: ev.status,
                clearance: "2/5 Depts",
                clearanceDetails: [
                    { dept: "IT & Assets", status: "cleared", remark: "MacBook & ID Returned" },
                    { dept: "Finance", status: "cleared", remark: "Full & Final Settlement Done" },
                    { dept: "HR & Admin", status: "pending", remark: "Exit Interview Pending" }
                ]
            };
        });
        setLocalExits(list);
    }, [lifecycleEvents, members]);

    const [activeTab, setActiveTab] = useState("onboarding");

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
        const member = members.find(m => m.id === transitionMemberId);
        if (!member) return;

        initiateTransition({
            empId: member.id,
            empName: member.name,
            type: transitionType as any,
            date: new Date().toISOString().split('T')[0],
            remarks: remarks
        });

        toast({
            title: "Transition Initiated",
            description: `${transitionType} request for ${member.name} has been sent for approval.`,
        });
        setShowTransition(false);
        setRemarks("");
    };

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your lifecycle tracker export is being prepared.",
        });
        setShowExport(false);
    };

    const handleAccelerate = (id: string) => {
        setLocalOnboarding(prev => prev.map(m =>
            m.id === id ? { ...m, progress: Math.min(m.progress + 15, 100) } : m
        ));
        toast({
            title: "Onboarding Accelerated",
            description: "Intensive training modules have been prioritized.",
        });
    };

    const toggleClearance = (memberId: string, deptIndex: number) => {
        setLocalExits(prev => prev.map(e => {
            if (e.id === memberId) {
                const newDetails = [...e.clearanceDetails];
                const item = newDetails[deptIndex];
                item.status = item.status === 'cleared' ? 'pending' : 'cleared';
                item.remark = item.status === 'cleared' ? "Approved by Admin" : "Awaiting Review";

                // Update overall summary
                const clearedCount = newDetails.filter(d => d.status === 'cleared').length;
                return { ...e, clearanceDetails: newDetails, clearance: `${clearedCount}/${newDetails.length}` };
            }
            return e;
        }));

        // Update selected member for UI immediate feedback
        if (selectedMember && selectedMember.id === memberId) {
            setSelectedMember((prev: any) => {
                const newDetails = [...prev.clearanceDetails];
                const item = newDetails[deptIndex];
                item.status = item.status === 'cleared' ? 'pending' : 'cleared';
                item.remark = item.status === 'cleared' ? "Approved by Admin" : "Awaiting Review";
                const clearedCount = newDetails.filter(d => d.status === 'cleared').length;
                return { ...prev, clearanceDetails: newDetails, clearance: `${clearedCount}/${newDetails.length}` };
            });
        }
    };

    return (
        <div className="flex-1 space-y-6 p-6 bg-[#f8fafc] min-h-screen text-start font-sans">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-start">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Lifecycle Management</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Tracking employee transitions from Day 0 to Exit.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-none shadow-sm h-10 px-5 font-bold text-[10px] tracking-widest bg-white text-slate-600" onClick={() => setShowExport(true)}>
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-5 font-bold text-[10px] tracking-widest shadow-md border-none transition-all"
                        onClick={() => setShowTransition(true)}
                    >
                        Initiate Transition
                    </Button>
                </div>
            </div>

            {/* Lifecycle Stats Bar */}
            <div className="flex flex-wrap gap-4">
                {[
                    { label: "Active Onboarding", val: localOnboarding.length.toString().padStart(2, '0'), color: "text-indigo-600", bg: "bg-indigo-100", icon: <Rocket />, border: "border-indigo-200", target: "onboarding" },
                    { label: "Planned Exits", val: localExits.length.toString().padStart(2, '0'), color: "text-rose-600", bg: "bg-rose-100", icon: <LogOut />, border: "border-rose-200", target: "offboarding" },
                    { label: "Tasks Pending", val: "05", color: "text-amber-600", bg: "bg-amber-100", icon: <ClipboardList />, border: "border-amber-200", target: "onboarding" },
                    { label: "Clearance Due", val: localExits.filter(e => e.status !== 'Completed').length.toString().padStart(2, '0'), color: "text-emerald-600", bg: "bg-emerald-100", icon: <ShieldCheck />, border: "border-emerald-200", target: "offboarding" }
                ].map((m, i) => (
                    <motion.div key={i} className="min-w-[180px] flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm group hover:shadow-md transition-all cursor-pointer rounded-2xl ${m.bg} border ${m.border} h-full`} onClick={() => {
                            setActiveTab(m.target);
                            toast({ title: `Viewing ${m.label}`, description: `Switched to ${m.target} view.` });
                        }}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-white text-slate-900 shadow-sm transition-transform group-hover:scale-110 border border-white`}>
                                    {React.cloneElement(m.icon as React.ReactElement, { size: 18, className: m.color })}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">{m.label}</p>
                                    <h4 className={`text-xl font-bold ${m.color} tracking-tight leading-none`}>{m.val}</h4>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-slate-100/50 p-1 rounded-xl h-10 border border-slate-100/50 w-full md:w-auto">
                    <TabsTrigger value="onboarding" className="rounded-lg font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full border-none">Onboarding Hub</TabsTrigger>
                    <TabsTrigger value="offboarding" className="rounded-lg font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full border-none">Exit Clearance</TabsTrigger>
                </TabsList>

                <TabsContent value="onboarding" className="space-y-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-6 md:grid-cols-2 bg-indigo-100 p-6 rounded-[2rem] border border-indigo-200 shadow-inner"
                    >
                        {localOnboarding.map((j) => (
                            <motion.div key={j.id} variants={itemVariants}>
                                <Card className="border-none shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden bg-white group text-start rounded-2xl border border-white/50 relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-all" />
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-14 w-14 ring-2 ring-white shadow-md border border-slate-50">
                                                    <AvatarImage src={j.img} />
                                                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-lg">{j.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors tracking-tight">{j.name}</h4>
                                                    <p className="text-[10px] font-bold text-indigo-600 tracking-widest mt-1">{j.role}</p>
                                                    <div className="flex items-center gap-1.5 mt-2 text-[9px] font-bold text-slate-400 tracking-widest bg-slate-50 px-2.5 py-1 rounded-lg w-fit">
                                                        <Briefcase className="h-3 w-3" /> {j.dept}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[8px] px-3 py-1 rounded-lg shadow-none">Day {j.start === 'Yesterday' ? '1' : '0'}</Badge>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2.5">
                                                <div className="flex justify-between text-[9px] font-bold text-slate-400 tracking-widest px-1">
                                                    <span>Progression Map</span>
                                                    <span className="text-indigo-600">{j.progress}% Completed</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 relative">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all duration-1000"
                                                        style={{ width: `${j.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-indigo-50/30 transition-all cursor-pointer" onClick={() => toast({ title: "Mentor Contact", description: `Notifying ${j.mentor} for a quick synced...` })}>
                                                    <p className="text-[8px] font-bold text-slate-400 tracking-widest mb-1.5">Mentor Support</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        <p className="text-xs font-bold text-slate-700">{j.mentor}</p>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-indigo-50/30 transition-all cursor-pointer" onClick={() => {
                                                    setSelectedMember(j);
                                                    setShowDetails(true);
                                                }}>
                                                    <p className="text-[8px] font-bold text-slate-400 tracking-widest mb-1.5">Roadmap</p>
                                                    <p className="text-xs font-bold text-slate-700">{j.tasks} Milestone</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] tracking-widest rounded-xl transition-all shadow-md border-none"
                                                    onClick={() => {
                                                        const newProgress = Math.min(j.progress + 10, 100);
                                                        setLocalOnboarding(prev => prev.map(m => m.id === j.id ? { ...m, progress: newProgress } : m));
                                                        toast({ title: "Progress Recorded", description: `Updated ${j.name}'s journey to ${newProgress}%.` });
                                                    }}
                                                >
                                                    Continue Journey <ChevronRight className="h-4 w-4 ml-1" />
                                                </Button>
                                                <Button variant="ghost" className="h-11 w-11 rounded-xl border-none bg-slate-100/50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" onClick={() => {
                                                    setSelectedMember(j);
                                                    setShowDetails(true);
                                                }}>
                                                    <MoreHorizontal className="h-4 w-4" />
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
                    <Card className="border-none shadow-sm overflow-hidden bg-white text-start rounded-2xl border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr className="text-[10px] font-bold tracking-widest text-slate-400">
                                        <th className="px-6 py-4 text-left">Resigning Employee</th>
                                        <th className="px-6 py-4 text-center">Last Working Day</th>
                                        <th className="px-6 py-4 text-center">Clearance Status</th>
                                        <th className="px-6 py-4 text-center">Process State</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/30">
                                    {localExits.map((e) => (
                                        <tr key={e.id} className="hover:bg-slate-50/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 ring-1 ring-slate-100 shadow-sm transition-transform group-hover:scale-105">
                                                        <AvatarImage src={e.img} className="grayscale" />
                                                        <AvatarFallback className="text-xs">RD</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 leading-tight">{e.name}</p>
                                                        <p className="text-[9px] text-slate-400 font-bold tracking-widest mt-1">{e.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="bg-rose-50/50 px-3 py-1.5 rounded-lg inline-block border border-rose-100/30">
                                                    <p className="text-xs font-bold text-rose-600">{e.lastDate}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center min-w-[240px]">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[9px] font-bold text-slate-400 tracking-widest px-1">
                                                        <span>{e.clearance} Depts</span>
                                                        <span className="text-emerald-600">{(e.clearanceDetails.filter((d: any) => d.status === 'cleared').length / e.clearanceDetails.length * 100).toFixed(0)}% Complete</span>
                                                    </div>
                                                    <Progress value={(e.clearanceDetails.filter((d: any) => d.status === 'cleared').length / e.clearanceDetails.length * 100)} className="h-1.5 bg-slate-100 rounded-full" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge className={`${e.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'} border-none font-bold text-[8px] tracking-widest px-3 py-1.5 rounded-lg shadow-none`}>
                                                    {e.status === 'Completed' ? 'Cleared' : `Wait: ${e.status}`}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    className="bg-white border border-slate-100 hover:border-indigo-600 hover:text-indigo-600 px-4 py-1.5 h-8 rounded-lg text-[10px] font-bold tracking-widest transition-all text-slate-500 shadow-sm"
                                                    onClick={() => {
                                                        setSelectedMember(e);
                                                        setShowDetails(true);
                                                    }}
                                                >
                                                    Audit
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
                <DialogContent className="rounded-2xl border-none shadow-xl p-6 bg-white max-w-lg text-start">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Initiate Transition</DialogTitle>
                        <p className="text-slate-500 font-medium text-xs mt-1">Change employment state or start offboarding process.</p>
                    </DialogHeader>
                    <div className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1">Select Team Member</Label>
                            <Select value={transitionMemberId} onValueChange={setTransitionMemberId}>
                                <SelectTrigger className="h-11 rounded-xl border-none bg-slate-100/50 px-4 focus:bg-white shadow-inner font-bold text-sm">
                                    <SelectValue placeholder="Choose a direct report..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                                    {members.map(m => (
                                        <SelectItem key={m.id} value={m.id} className="py-2.5 px-4 rounded-lg font-bold text-slate-600 text-xs">{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1">Transition Type</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'Promotion', label: 'Promotion', icon: <Rocket className="h-4 w-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { id: 'Resignation', label: 'Resignation', icon: <LogOut className="h-4 w-4" />, color: 'text-rose-600', bg: 'bg-rose-50' },
                                    { id: 'Dept Change', label: 'Dept Change', icon: <Zap className="h-4 w-4" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { id: 'Confirmation', label: 'Confirmation', icon: <ShieldCheck className="h-4 w-4" />, color: 'text-amber-600', bg: 'bg-amber-50' },
                                ].map(t => (
                                    <div
                                        key={t.id}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all group ${transitionType === t.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100/50 hover:border-indigo-200'}`}
                                        onClick={() => setTransitionType(t.id as any)}
                                    >
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.bg} ${t.color} shadow-sm border border-white/50`}>
                                            {t.icon}
                                        </div>
                                        <span className={`font-bold group-hover:text-indigo-600 text-[10px] tracking-widest leading-none ${transitionType === t.id ? 'text-indigo-600' : 'text-slate-700'}`}>{t.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1">Management Remarks</Label>
                            <Textarea
                                placeholder="Context for HR & Admin..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="rounded-xl border-none bg-slate-100/50 p-4 min-h-[100px] text-sm font-medium focus:bg-white shadow-inner"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" className="flex-1 h-11 rounded-xl font-bold text-[10px] tracking-widest text-slate-400 border-none" onClick={() => setShowTransition(false)}>Abort</Button>
                        <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] tracking-widest shadow-md border-none transition-all" onClick={handleTransition}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Sheet for Onboarding/Offboarding */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="rounded-2xl border-none shadow-xl p-0 bg-white max-w-xl overflow-hidden text-start">
                    {selectedMember && (
                        <div className="relative">
                            <div className="h-24 bg-indigo-600 w-full" />
                            <div className="px-8 pb-8">
                                <div className="flex justify-between items-end -mt-10 mb-8">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                        <AvatarImage src={selectedMember.img} className={selectedMember.lastDate ? 'grayscale' : ''} />
                                        <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-2xl">{selectedMember.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex gap-2 pb-1">
                                        <Button className="rounded-xl h-9 bg-indigo-600 hover:bg-indigo-700 text-white px-5 font-bold text-[9px] tracking-widest shadow-md border-none" onClick={() => toast({ title: "Connecting", description: `Redirecting to chat with ${selectedMember.name}...` })}>Contact</Button>
                                        <Button variant="outline" className="rounded-xl h-9 border-slate-100 px-5 font-bold text-[9px] tracking-widest bg-white text-slate-600" onClick={() => toast({ title: "Vault Access", description: `Loading documents for ${selectedMember.name}...` })}>Files</Button>
                                    </div>
                                </div>

                                <div className="space-y-6 text-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{selectedMember.name}</h3>
                                        <p className="text-slate-400 font-bold tracking-widest text-[9px] mt-1">{selectedMember.role} • {selectedMember.dept || 'Engineering'}</p>
                                    </div>

                                    {selectedMember.lastDate ? (
                                        // Offboarding Clearances
                                        <div className="space-y-5">
                                            <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1">Checklist Audit</Label>
                                            <div className="space-y-2">
                                                {selectedMember.clearanceDetails.map((c: any, i: number) => (
                                                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group/item" onClick={() => toggleClearance(selectedMember.id, i)}>
                                                        <div className="flex items-center gap-3 text-start">
                                                            <div className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${c.status === 'cleared' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600 group-hover/item:bg-indigo-100 group-hover/item:text-indigo-600'}`}>
                                                                {c.status === 'cleared' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-700 tracking-widest">{c.dept}</p>
                                                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">{c.remark}</p>
                                                            </div>
                                                        </div>
                                                        <Badge className={`${c.status === 'cleared' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'} border-none font-bold text-[7px] tracking-widest px-2.5 py-1 rounded-md shadow-none capitalize transition-all`}>
                                                            {c.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        // Onboarding Milestones
                                        <div className="space-y-6">
                                            <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1">Roadmap Audit</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/30">
                                                    <p className="text-[8px] font-bold text-indigo-400 tracking-widest mb-1.5">Current Progress</p>
                                                    <h4 className="text-xl font-bold text-indigo-600">{selectedMember.progress}%</h4>
                                                </div>
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                    <p className="text-[8px] font-bold text-slate-400 tracking-widest mb-1.5">Time To Value</p>
                                                    <h4 className="text-xl font-bold text-slate-700">14 Days</h4>
                                                </div>
                                            </div>
                                            <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] tracking-widest rounded-xl shadow-md border-none transition-all" onClick={() => handleAccelerate(selectedMember.id)}>Accelerate Onboarding</Button>
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
                <DialogContent className="rounded-2xl border-none shadow-xl p-6 bg-white max-w-sm text-start">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold tracking-tight">Intelligence Export</DialogTitle>
                        <p className="text-slate-500 font-medium text-xs mt-1">Export comprehensive lifecycle tracking data.</p>
                    </DialogHeader>
                    <div className="space-y-3 py-6">
                        {['Current Onboarding', 'Historical Transitions', 'Offboarding Audits', 'Asset Recovery'].map((type, i) => (
                            <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all cursor-pointer group" onClick={() => toast({ title: "Selection Updated", description: `${type} selected for export.` })}>
                                <div className="h-5 w-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-600 transition-all">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 group-hover:bg-white" />
                                </div>
                                <span className="font-bold text-slate-600 text-[10px] tracking-widest leading-none">{type}</span>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="flex-col gap-3">
                        <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] tracking-widest shadow-md border-none transition-all" onClick={handleExport}>Download</Button>
                        <Button variant="ghost" className="w-full h-11 rounded-xl font-bold text-[10px] tracking-widest text-slate-400 border-none" onClick={() => setShowExport(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default TeamLifecyclePage;
