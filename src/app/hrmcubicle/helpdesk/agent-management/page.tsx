"use client"

import React, { useState } from "react";
import {
    Users2,
    Plus,
    Search,
    Filter,
    ChevronRight,
    Star,
    Clock,
    CheckCircle2,
    UserPlus,
    Mail,
    ShieldCheck,
    MoreHorizontal,
    Trash2,
    Edit,
    ArrowUpRight,
    TrendingUp,
    Zap,
    MapPin,
    Building2,
    BarChart3,
    PieChart,
    Users,
    Activity,
    X,
    Settings2
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { useHelpdeskStore, type HelpdeskAgent } from "@/shared/data/helpdesk-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const AgentManagementPage = () => {
    const { agents, addAgent, updateAgent, deleteAgent, categories } = useHelpdeskStore();
    const { toast } = useToast();

    // UI State
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<HelpdeskAgent | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<HelpdeskAgent>>({
        name: "",
        email: "",
        role: "Agent",
        status: "Active",
        assignedQueues: ["IT Support"],
        ticketsResolved: 0,
        avgResolutionTime: "0h",
        csatScore: 5.0
    });

    const handleSave = () => {
        if (!formData.name || !formData.email) {
            toast({ title: "Incomplete Form", description: "Name and email are mandatory for agents.", variant: "destructive" });
            return;
        }

        if (selectedAgent) {
            updateAgent(selectedAgent.id, formData);
            toast({ title: "Agent Updated", description: `${formData.name}'s profile has been synced.` });
        } else {
            addAgent(formData as any);
            toast({ title: "Agent Onboarded", description: "New support specialist added to the roster." });
        }
        setIsCreateDialogOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: "", email: "", role: "Agent", status: "Active", assignedQueues: ["IT Support"], ticketsResolved: 0, avgResolutionTime: "0h", csatScore: 5.0 });
        setSelectedAgent(null);
    };

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: HelpdeskAgent["status"]) => {
        switch (status) {
            case "Active": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Away": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Offline": return "bg-slate-50 text-slate-400 border-slate-100";
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Users2 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase">Support Specialist Roster</h1>
                        <p className="text-sm font-medium text-slate-500">Manage support agents and workload distribution</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end border-r pr-6 border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Avg CSAT</span>
                        <span className="text-lg font-black text-rose-600 leading-none tracking-tighter">4.8 / 5.0</span>
                    </div>
                    <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-slate-200 transition-all">
                        <UserPlus size={16} /> Onboard Agent
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between bg-white px-3 py-2 border border-slate-200 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-6 px-4">
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-black text-slate-900 leading-none">{agents.length}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Agents</span>
                                </div>
                                <div className="h-8 w-px bg-slate-100" />
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-black text-emerald-600 leading-none">{agents.filter(a => a.status === 'Active').length}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Now</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pr-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <Input
                                    placeholder="Search by name, role..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="h-9 w-52 bg-slate-50 border-none rounded-xl pl-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-indigo-100"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400"><Filter size={14} /></Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                            <AnimatePresence mode="popLayout">
                                {filteredAgents.map((agent, i) => (
                                    <motion.div
                                        key={agent.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => { setSelectedAgent(agent); setIsDetailSheetOpen(true); }}
                                        className="group cursor-pointer"
                                    >
                                        <Card className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:bg-slate-50 hover:shadow-xl hover:-translate-y-1">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm group-hover:bg-white transition-colors">
                                                            {agent.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase">{agent.name}</h3>
                                                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{agent.role}</span>
                                                        </div>
                                                    </div>
                                                    <Badge className={`${getStatusColor(agent.status)} border rounded-full text-[8px] h-4 font-black uppercase tracking-widest px-2`}>
                                                        {agent.status}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mb-6">
                                                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">CSAT Score</span>
                                                        <div className="flex items-center gap-1 text-xs font-black text-rose-500">
                                                            <Star size={10} className="fill-rose-500" /> {agent.csatScore}
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Resolved</span>
                                                        <div className="text-xs font-black text-slate-900">{agent.ticketsResolved}</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
                                                        <span className="text-[10px] font-black text-indigo-600">84%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 w-[84%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all duration-1000" />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                                    <div className="flex -space-x-1.5">
                                                        {agent.assignedQueues.map((q, i) => (
                                                            <div key={i} className="h-6 w-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase shadow-sm group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all cursor-help" title={q}>
                                                                {q[0]}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 group-hover:gap-2 transition-all">
                                                        Profiles <ChevronRight size={12} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </div>

                {/* Performance Analytics Sidebar */}
                <div className="w-[320px] bg-white border-l border-slate-200 p-8 space-y-10 shrink-0">
                    <div className="space-y-4 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center bg-rose-50 rounded-2xl text-rose-500 mb-2">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Roster Health</h2>
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed px-4 italic">Operational efficiency improved by 14.5% since adding 2 new specialists.</p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={14} className="text-emerald-500" /> Live Pulse
                        </h4>
                        <div className="space-y-3">
                            {[
                                { label: "High Workload Agents", val: 2, color: "text-rose-500", bg: "bg-rose-50" },
                                { label: "Optimal State", val: 12, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { label: "Avg Resolution", val: "3.2h", color: "text-indigo-500", bg: "bg-indigo-50" }
                            ].map((stat, i) => (
                                <div key={i} className={`p-4 rounded-2xl border border-transparent shadow-sm flex items-center justify-between ${stat.bg}`}>
                                    <span className="text-[10px] font-black text-slate-900/60 uppercase tracking-tight">{stat.label}</span>
                                    <span className={`text-[15px] font-black ${stat.color}`}>{stat.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} className="text-indigo-600" /> Compliance & CSAT
                        </h4>
                        <div className="p-5 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLA Conformity</span>
                                    <span className="text-xs font-black text-emerald-400">92%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[92%]" />
                                </div>
                                <Button variant="outline" className="w-full h-8 bg-white/5 border-white/10 text-white font-bold text-[9px] uppercase h-9 rounded-xl hover:bg-white/10">Compliance Report</Button>
                            </div>
                            <PieChart size={100} className="absolute -right-6 -top-6 text-white/10 group-hover:rotate-12 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboard Agent Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-3xl shadow-3xl bg-white outline-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">Agent Provisioning</DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-widest">Grant access and map support responsibilities</DialogDescription>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2 text-indigo-600">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Agent Full Name</Label>
                                <Input
                                    placeholder="Enter full legal name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 border-slate-200 rounded-xl px-4 font-bold text-slate-900 bg-slate-50/50 shadow-sm focus-visible:ring-indigo-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Work Email</Label>
                                <Input
                                    placeholder="agent@firm.com"
                                    value={formData.email}
                                    type="email"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 border-slate-200 rounded-xl px-4 font-bold text-slate-900 bg-slate-50/50 shadow-sm focus-visible:ring-indigo-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Functional Role</Label>
                                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v as any })}>
                                    <SelectTrigger className="h-12 border-slate-200 rounded-xl font-bold shadow-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100">
                                        <SelectItem value="Agent">Support Agent</SelectItem>
                                        <SelectItem value="Supervisor">Team Supervisor</SelectItem>
                                        <SelectItem value="Admin">System Administrator</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Current Status</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as any })}>
                                    <SelectTrigger className="h-12 border-slate-200 rounded-xl font-bold shadow-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100">
                                        <SelectItem value="Active">Available / Active</SelectItem>
                                        <SelectItem value="Away">Away / Busy</SelectItem>
                                        <SelectItem value="Offline">Offline / Logged Out</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Queue Ownership (Select Multiple)</Label>
                            <div className="flex flex-wrap gap-2 p-5 border border-slate-100 rounded-2xl bg-slate-50/50 min-h-[100px]">
                                {categories.map(cat => {
                                    const picked = formData.assignedQueues?.includes(cat);
                                    return (
                                        <Badge
                                            key={cat}
                                            onClick={() => {
                                                const current = formData.assignedQueues || [];
                                                const next = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
                                                setFormData({ ...formData, assignedQueues: next });
                                            }}
                                            className={`cursor-pointer h-7 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${picked ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-400'
                                                }`}
                                        >
                                            {cat}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex items-center gap-4 p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[11px] font-bold text-white block leading-none">Global Access</span>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Can delete tickets?</span>
                                </div>
                                <button className="h-5 w-10 rounded-full bg-slate-800 relative border border-slate-700">
                                    <div className="h-3 w-3 rounded-full bg-slate-600 absolute left-1 top-1" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-indigo-600 rounded-2xl border border-indigo-500 shadow-xl">
                                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                    <Mail size={20} />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[11px] font-bold text-white block leading-none">Auto Invite</span>
                                    <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Send access email</span>
                                </div>
                                <button className="h-5 w-10 rounded-full bg-white/20 relative border border-white/10">
                                    <div className="h-3 w-3 rounded-full bg-white absolute right-1 top-1 shadow-sm" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-12 px-8 font-bold text-slate-400 text-xs uppercase tracking-widest">Abort Process</Button>
                        <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-10 font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 gap-2">
                            <CheckCircle2 size={16} /> Deploy Agent
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Agent Detail Command Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-[600px] p-0 border-l border-slate-200 shadow-3xl bg-white flex flex-col overflow-hidden outline-none">
                    <div className="bg-slate-900 text-white p-8 shrink-0 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-6 mb-8 mt-2">
                                <div className="h-20 w-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-black shadow-2xl">
                                    {selectedAgent?.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <SheetTitle className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{selectedAgent?.name}</SheetTitle>
                                        <Badge className={`${getStatusColor(selectedAgent?.status || 'Offline')} border-none text-[9px] h-5 px-3 font-bold rounded-full uppercase`}>{selectedAgent?.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>{selectedAgent?.role}</span>
                                        <div className="h-1 w-1 rounded-full bg-white/20" />
                                        <span>{selectedAgent?.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Ticket Yield", val: selectedAgent?.ticketsResolved, sub: "RESOLVED", icon: CheckCircle2, color: "text-emerald-400" },
                                    { label: "Avg Speed", val: selectedAgent?.avgResolutionTime, sub: "PER TICKET", icon: Clock, color: "text-indigo-400" },
                                    { label: "Star Rating", val: selectedAgent?.csatScore, sub: "CSAT SCORE", icon: Star, color: "text-rose-400" }
                                ].map((m, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <m.icon size={16} className={`${m.color} mb-3`} />
                                        <span className="text-[18px] font-black tracking-tight">{m.val}</span>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{m.sub}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Background Decoration */}
                        <Users2 size={120} className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none" />
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-10 space-y-12 pb-24">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} className="text-emerald-500" /> Operational Ownership
                                </h4>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-wrap gap-2">
                                    {selectedAgent?.assignedQueues.map(q => (
                                        <Badge key={q} className="bg-white border-slate-200 text-slate-600 font-bold text-[10px] h-8 px-4 rounded-xl shadow-sm uppercase tracking-wider">{q} Desk</Badge>
                                    ))}
                                    <Button variant="ghost" className="h-8 w-8 rounded-xl border-2 border-dashed border-slate-200 text-slate-300">+</Button>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="space-y-8">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    <div className="flex items-center gap-2"><BarChart3 size={14} className="text-indigo-500" /> Resolution Velocity</div>
                                    <div className="text-indigo-600">89% Efficiency</div>
                                </h4>
                                <div className="h-[120px] flex items-end justify-between gap-1.5 px-2">
                                    {[45, 60, 35, 85, 40, 95, 55, 75, 50, 80, 45, 65, 30, 90, 70, 50, 40, 60, 85, 95].map((val, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${val}%` }}
                                            transition={{ delay: i * 0.02, duration: 1 }}
                                            className={`flex-1 rounded-t-sm transition-all ${i > 15 ? 'bg-indigo-500' : 'bg-slate-100 hover:bg-slate-200'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] pt-4">
                                    <span>Last 20 Tickets</span>
                                    <span>Real-time Velocity</span>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="grid grid-cols-2 gap-6">
                                <Button variant="outline" className="h-14 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest gap-2 hover:bg-slate-900 hover:text-white transition-all">
                                    <Settings2 size={16} /> Advanced Config
                                </Button>
                                <Button onClick={() => { deleteAgent(selectedAgent!.id); setIsDetailSheetOpen(false); }} variant="outline" className="h-14 rounded-2xl border-rose-100 text-rose-500 font-bold text-xs uppercase tracking-widest gap-2 hover:bg-rose-500 hover:text-white transition-all">
                                    <Trash2 size={16} /> Offboard Agent
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default AgentManagementPage;
