"use client"

import React, { useEffect, useMemo, useState } from "react";
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
    TrendingUp,
    Zap,
    BarChart3,
    PieChart,
    Activity,
    X,
    Settings2,
    Download,
    Pencil,
    Copy,
    FileBarChart,
    Power
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useHelpdeskStore, type HelpdeskAgent } from "@/shared/data/helpdesk-store";
import { helpdeskApi } from "@/shared/data/helpdesk-api";
import { useToast } from "@/shared/components/ui/use-toast";

const NAME_MIN = 2;
const NAME_MAX = 80;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import { motion, AnimatePresence } from "framer-motion";

const defaultForm: Partial<HelpdeskAgent> = {
    name: "",
    email: "",
    role: "Agent",
    status: "Active",
    assignedQueues: [],
    ticketsResolved: 0,
    avgResolutionTime: "0h",
    csatScore: 5.0,
    canDeleteTickets: false,
    autoInvite: true
};

const AgentManagementPage = () => {
    const { agents, addAgent, updateAgent, deleteAgent, categories, tickets } = useHelpdeskStore();
    const { toast } = useToast();

    // Backend org users
    const [orgUsers, setOrgUsers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
    const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const users = await helpdeskApi.fetchOrgUsers();
                if (!cancelled) {
                    setOrgUsers(users);
                    setBackendAvailable(users.length > 0);
                }
            } catch {
                if (!cancelled) setBackendAvailable(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // UI State
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<HelpdeskAgent | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [isAddQueueDialogOpen, setIsAddQueueDialogOpen] = useState(false);
    const [newQueueName, setNewQueueName] = useState("");
    const [isAdvancedConfigOpen, setIsAdvancedConfigOpen] = useState(false);
    const [isComplianceOpen, setIsComplianceOpen] = useState(false);

    // Filters
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState<"name" | "csat" | "resolved">("csat");

    // Form
    const [formData, setFormData] = useState<Partial<HelpdeskAgent>>(defaultForm);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<HelpdeskAgent | null>(null);

    // Advanced config form (edited live inside modal)
    const [advConfig, setAdvConfig] = useState<Partial<HelpdeskAgent>>({});

    const liveSelectedAgent = useMemo(() =>
        selectedAgent ? agents.find(a => a.id === selectedAgent.id) || null : null
        , [agents, selectedAgent]);

    const filteredAgents = useMemo(() => {
        const list = agents.filter(agent => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q
                || agent.name.toLowerCase().includes(q)
                || agent.email.toLowerCase().includes(q)
                || agent.role.toLowerCase().includes(q);
            const matchesRole = filterRole === "all" || agent.role === filterRole;
            const matchesStatus = filterStatus === "all" || agent.status === filterStatus;
            return matchesSearch && matchesRole && matchesStatus;
        });
        return [...list].sort((a, b) => {
            switch (sortBy) {
                case "name": return a.name.localeCompare(b.name);
                case "csat": return b.csatScore - a.csatScore;
                case "resolved": return b.ticketsResolved - a.ticketsResolved;
            }
        });
    }, [agents, searchQuery, filterRole, filterStatus, sortBy]);

    const resetForm = () => {
        setFormData({ ...defaultForm, assignedQueues: [] });
        setEditingId(null);
    };

    const openNewDialog = () => {
        resetForm();
        setIsCreateDialogOpen(true);
    };

    const openEditDialog = (agent: HelpdeskAgent) => {
        setFormData({ ...agent });
        setEditingId(agent.id);
        setIsCreateDialogOpen(true);
    };

    const validateAgentForm = (f: Partial<HelpdeskAgent>): Record<string, string> => {
        const errs: Record<string, string> = {};
        const name = (f.name || "").trim();
        const email = (f.email || "").trim();
        if (!name) errs.name = "Name is required.";
        else if (name.length < NAME_MIN) errs.name = `Name must be at least ${NAME_MIN} characters.`;
        else if (name.length > NAME_MAX) errs.name = `Name must be under ${NAME_MAX} characters.`;
        if (!email) errs.email = "Email is required.";
        else if (!EMAIL_PATTERN.test(email)) errs.email = "Please enter a valid email address.";
        // Duplicate email check
        if (email && EMAIL_PATTERN.test(email)) {
            const dupe = agents.find(a => a.email.toLowerCase() === email.toLowerCase() && a.id !== editingId);
            if (dupe) errs.email = "An agent with this email already exists.";
        }
        if (!f.role || !["Agent", "Supervisor", "Admin"].includes(f.role)) errs.role = "Select a valid role.";
        if (!f.status || !["Active", "Away", "Offline"].includes(f.status)) errs.status = "Select a valid status.";
        if (typeof f.csatScore === "number" && (f.csatScore < 0 || f.csatScore > 5)) errs.csatScore = "CSAT must be between 0 and 5.";
        return errs;
    };

    const handleSave = () => {
        const errs = validateAgentForm(formData);
        setFormErrors(errs);
        if (Object.keys(errs).length) {
            toast({ title: "Please fix the errors", description: Object.values(errs)[0], variant: "destructive" });
            return;
        }

        if (editingId) {
            updateAgent(editingId, formData);
            toast({ title: "Agent Updated", description: `${formData.name}'s profile synced.` });
        } else {
            addAgent(formData as any);
            toast({ title: "Agent Onboarded", description: `${formData.name} added to the roster.` });
        }
        setIsCreateDialogOpen(false);
        resetForm();
        setFormErrors({});
    };

    const importOrgUser = (u: { id: string; name: string; email: string; role: string }) => {
        // Create a helpdesk agent from an org user if not already present
        const exists = agents.find(a => a.email.toLowerCase() === u.email.toLowerCase());
        if (exists) {
            toast({ title: "Already Imported", description: `${u.name} is already in the roster.`, variant: "destructive" });
            return;
        }
        addAgent({
            name: u.name,
            email: u.email,
            role: (["Admin", "Supervisor"].includes(u.role) ? u.role : "Agent") as HelpdeskAgent["role"],
            status: "Active",
            assignedQueues: [],
            ticketsResolved: 0,
            avgResolutionTime: "0h",
            csatScore: 5.0,
            canDeleteTickets: false,
            autoInvite: false
        });
        toast({ title: "Imported", description: `${u.name} added from org directory.` });
    };

    const toggleQueue = (queue: string) => {
        const current = formData.assignedQueues || [];
        const next = current.includes(queue) ? current.filter(c => c !== queue) : [...current, queue];
        setFormData({ ...formData, assignedQueues: next });
    };

    const handleAddQueue = () => {
        if (!newQueueName || !liveSelectedAgent) {
            toast({ title: "Select Queue", description: "Choose a queue to add.", variant: "destructive" });
            return;
        }
        updateAgent(liveSelectedAgent.id, {
            assignedQueues: [...liveSelectedAgent.assignedQueues, newQueueName]
        });
        toast({ title: "Queue Added", description: `${newQueueName} assigned to ${liveSelectedAgent.name}.` });
        setNewQueueName("");
        setIsAddQueueDialogOpen(false);
    };

    const handleRemoveQueue = (queue: string) => {
        if (!liveSelectedAgent) return;
        updateAgent(liveSelectedAgent.id, {
            assignedQueues: liveSelectedAgent.assignedQueues.filter(q => q !== queue)
        });
        toast({ title: "Queue Removed", description: `${queue} unassigned.` });
    };

    const openAdvancedConfig = () => {
        if (!liveSelectedAgent) return;
        setAdvConfig({ ...liveSelectedAgent });
        setIsAdvancedConfigOpen(true);
    };

    const saveAdvancedConfig = () => {
        if (!liveSelectedAgent) return;
        updateAgent(liveSelectedAgent.id, advConfig);
        toast({ title: "Configuration Saved", description: "Advanced settings applied." });
        setIsAdvancedConfigOpen(false);
    };

    const handleStatusUpdate = (id: string, status: HelpdeskAgent["status"]) => {
        updateAgent(id, { status });
        toast({ title: "Status Updated", description: `Agent marked as ${status}.` });
    };

    const downloadComplianceReport = () => {
        const csvRows = [
            ["ID", "Name", "Email", "Role", "Status", "Queues", "Resolved", "Avg Time", "CSAT", "Can Delete", "Auto Invite"]
        ];
        agents.forEach(a => {
            csvRows.push([
                a.id,
                a.name,
                a.email,
                a.role,
                a.status,
                a.assignedQueues.join("|"),
                String(a.ticketsResolved),
                a.avgResolutionTime,
                String(a.csatScore),
                String(a.canDeleteTickets ?? false),
                String(a.autoInvite ?? false)
            ]);
        });
        const csv = csvRows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `agent-compliance-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast({ title: "Report Downloaded", description: "CSV generated with roster data." });
    };

    const getStatusColor = (status: HelpdeskAgent["status"]) => {
        switch (status) {
            case "Active": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Away": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Offline": return "bg-slate-50 text-slate-400 border-slate-100";
        }
    };

    const agentTicketCounts = useMemo(() => {
        const counts: Record<string, { active: number; resolved: number }> = {};
        agents.forEach(a => { counts[a.id] = { active: 0, resolved: 0 }; });
        tickets.forEach(t => {
            if (t.assignedTo && counts[t.assignedTo.id]) {
                if (t.status === "Resolved" || t.status === "Closed") counts[t.assignedTo.id].resolved++;
                else counts[t.assignedTo.id].active++;
            }
        });
        return counts;
    }, [agents, tickets]);

    const avgCsat = agents.length ? (agents.reduce((s, a) => s + a.csatScore, 0) / agents.length).toFixed(1) : "0";

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Users2 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase flex items-center gap-2">
                            Support Specialist Roster
                            {backendAvailable === false && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full normal-case">Local Only</span>}
                            {backendAvailable === true && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full normal-case">Org Linked</span>}
                        </h1>
                        <p className="text-sm font-medium text-slate-500">Manage support agents and workload distribution</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end border-r pr-6 border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Avg CSAT</span>
                        <span className="text-lg font-black text-rose-600 leading-none tracking-tighter">{avgCsat} / 5.0</span>
                    </div>
                    <Button onClick={openNewDialog} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-slate-200 transition-all">
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
                                    className="h-9 w-52 bg-slate-50 border border-slate-200 rounded-xl pl-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-indigo-100"
                                />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400"><Filter size={14} /></Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-64 p-4 rounded-2xl space-y-3">
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</Label>
                                        <Select value={filterRole} onValueChange={setFilterRole}>
                                            <SelectTrigger className="h-9 rounded-xl mt-1"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Roles</SelectItem>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                                <SelectItem value="Supervisor">Supervisor</SelectItem>
                                                <SelectItem value="Agent">Agent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</Label>
                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                            <SelectTrigger className="h-9 rounded-xl mt-1"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Away">Away</SelectItem>
                                                <SelectItem value="Offline">Offline</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort By</Label>
                                        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                                            <SelectTrigger className="h-9 rounded-xl mt-1"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="csat">CSAT Score</SelectItem>
                                                <SelectItem value="resolved">Resolved Count</SelectItem>
                                                <SelectItem value="name">Name</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="ghost" className="w-full h-8 text-xs" onClick={() => { setFilterRole("all"); setFilterStatus("all"); setSortBy("csat"); toast({ title: "Reset" }); }}>Reset</Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                            <AnimatePresence mode="popLayout">
                                {filteredAgents.map((agent, i) => {
                                    const counts = agentTicketCounts[agent.id] || { active: 0, resolved: 0 };
                                    const eff = counts.active + counts.resolved > 0 ? Math.round((counts.resolved / (counts.active + counts.resolved)) * 100) : 0;
                                    return (
                                        <motion.div
                                            key={agent.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            onClick={() => { setSelectedAgent(agent); setIsDetailSheetOpen(true); }}
                                            className="group cursor-pointer"
                                        >
                                            <Card className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:bg-slate-50 hover:shadow-xl hover:-translate-y-1 relative">
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/90 backdrop-blur rounded-lg shadow border border-slate-100 text-slate-400 hover:text-indigo-600">
                                                                <MoreHorizontal size={14} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openEditDialog(agent)}>
                                                                <Pencil size={13} /> Edit Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { navigator.clipboard.writeText(agent.email); toast({ title: "Copied", description: "Email copied to clipboard." }); }}>
                                                                <Copy size={13} /> Copy Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(agent.id, agent.status === "Active" ? "Offline" : "Active")}>
                                                                <Power size={13} /> Set {agent.status === "Active" ? "Offline" : "Active"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 text-rose-500 cursor-pointer" onClick={() => setDeleteTarget(agent)}>
                                                                <Trash2 size={13} /> Offboard
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
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
                                                            <span className="text-[10px] font-black text-indigo-600">{eff}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all duration-1000" style={{ width: `${eff}%` }} />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                                        <div className="flex -space-x-1.5">
                                                            {agent.assignedQueues.slice(0, 4).map((q, i) => (
                                                                <div key={i} className="h-6 w-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase shadow-sm group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all" title={q}>
                                                                    {q[0]}
                                                                </div>
                                                            ))}
                                                            {agent.assignedQueues.length === 0 && <span className="text-[9px] text-slate-400 italic font-bold">No queues</span>}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 group-hover:gap-2 transition-all">
                                                            Profile <ChevronRight size={12} />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            {filteredAgents.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 italic text-slate-400">
                                    <Users2 size={48} className="mb-4 opacity-10" />
                                    <p className="text-sm font-bold">No agents match your criteria.</p>
                                    <Button variant="ghost" size="sm" className="mt-4 text-indigo-600" onClick={openNewDialog}>Onboard an agent</Button>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Performance Analytics Sidebar */}
                <div className="w-[320px] bg-white border-l border-slate-200 p-8 space-y-10 shrink-0 overflow-y-auto">
                    <div className="space-y-4 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center bg-rose-50 rounded-2xl text-rose-500 mb-2">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Roster Health</h2>
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed px-4 italic">Track live availability and performance efficiency.</p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={14} className="text-emerald-500" /> Live Pulse
                        </h4>
                        <div className="space-y-3">
                            {[
                                { label: "Total Roster", val: agents.length, color: "text-slate-900", bg: "bg-slate-50" },
                                { label: "Active Now", val: agents.filter(a => a.status === "Active").length, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { label: "Away", val: agents.filter(a => a.status === "Away").length, color: "text-amber-500", bg: "bg-amber-50" },
                                { label: "Offline", val: agents.filter(a => a.status === "Offline").length, color: "text-slate-400", bg: "bg-slate-50" }
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
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg CSAT</span>
                                    <span className="text-xs font-black text-emerald-400">{avgCsat} / 5.0</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400" style={{ width: `${(Number(avgCsat) / 5) * 100}%` }} />
                                </div>
                                <Button variant="outline" className="w-full h-9 bg-white/5 border-white/10 text-white font-bold text-[9px] uppercase rounded-xl hover:bg-white/10" onClick={() => setIsComplianceOpen(true)}>
                                    Compliance Report
                                </Button>
                            </div>
                            <PieChart size={100} className="absolute -right-6 -top-6 text-white/10 group-hover:rotate-12 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboard / Edit Agent Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={(v) => { if (!v) resetForm(); setIsCreateDialogOpen(v); }}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-2 border-slate-200 rounded-3xl shadow-3xl bg-white outline-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">{editingId ? "Edit Agent Profile" : "Agent Provisioning"}</DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Grant access and map support responsibilities</DialogDescription>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                        {!editingId && orgUsers.length > 0 && (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Import from Organization</span>
                                    <span className="text-[9px] font-bold text-emerald-600">{orgUsers.length} users available</span>
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                                    {orgUsers.slice(0, 12).map(u => (
                                        <Badge
                                            key={u.id}
                                            onClick={() => importOrgUser(u)}
                                            className="bg-white text-emerald-700 border-emerald-200 font-bold text-[10px] h-7 px-3 cursor-pointer hover:bg-emerald-100"
                                        >
                                            + {u.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name *</Label>
                                <Input placeholder="Full legal name" value={formData.name || ""} maxLength={NAME_MAX + 10} onChange={e => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }} className={`h-12 border-slate-200 rounded-xl px-4 font-bold text-slate-900 bg-slate-50/50 ${formErrors.name ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`} />
                                {formErrors.name && <p className="text-[11px] text-rose-500 font-bold px-1">{formErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Work Email *</Label>
                                <Input placeholder="agent@firm.com" value={formData.email || ""} type="email" onChange={e => { setFormData({ ...formData, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }} className={`h-12 border-slate-200 rounded-xl px-4 font-bold text-slate-900 bg-slate-50/50 ${formErrors.email ? 'border-rose-300 focus-visible:ring-rose-500' : ''}`} />
                                {formErrors.email && <p className="text-[11px] text-rose-500 font-bold px-1">{formErrors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Role</Label>
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
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as any })}>
                                    <SelectTrigger className="h-12 border-slate-200 rounded-xl font-bold shadow-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Away">Away</SelectItem>
                                        <SelectItem value="Offline">Offline</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Queue Ownership</Label>
                            <div className="flex flex-wrap gap-2 p-5 border border-slate-100 rounded-2xl bg-slate-50/50 min-h-[100px]">
                                {categories.map(cat => {
                                    const picked = formData.assignedQueues?.includes(cat.name);
                                    return (
                                        <Badge
                                            key={cat.id}
                                            onClick={() => toggleQueue(cat.name)}
                                            className={`cursor-pointer h-7 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${picked ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-400'}`}
                                        >
                                            {cat.name}
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
                                    <span className="text-[11px] font-bold text-white block leading-none">Delete Privileges</span>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Can delete tickets</span>
                                </div>
                                <Switch checked={!!formData.canDeleteTickets} onCheckedChange={(v) => setFormData({ ...formData, canDeleteTickets: v })} />
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-indigo-600 rounded-2xl border border-indigo-500 shadow-xl">
                                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                    <Mail size={20} />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[11px] font-bold text-white block leading-none">Auto Invite</span>
                                    <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Send access email</span>
                                </div>
                                <Switch checked={!!formData.autoInvite} onCheckedChange={(v) => setFormData({ ...formData, autoInvite: v })} />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-12 px-8 font-bold text-slate-400 text-xs uppercase tracking-widest">Abort</Button>
                        <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-10 font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 gap-2">
                            <CheckCircle2 size={16} /> {editingId ? "Save Changes" : "Deploy Agent"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Agent Detail Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-[600px] p-0 border-l border-slate-200 shadow-3xl bg-white flex flex-col overflow-hidden outline-none">
                    <div className="bg-slate-900 text-white p-8 shrink-0 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-6 mb-8 mt-2">
                                <div className="h-20 w-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-black shadow-2xl">
                                    {liveSelectedAgent?.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <SheetTitle className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{liveSelectedAgent?.name}</SheetTitle>
                                        <Badge className={`${getStatusColor(liveSelectedAgent?.status || 'Offline')} border-none text-[9px] h-5 px-3 font-bold rounded-full uppercase`}>{liveSelectedAgent?.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>{liveSelectedAgent?.role}</span>
                                        <div className="h-1 w-1 rounded-full bg-white/20" />
                                        <span>{liveSelectedAgent?.email}</span>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9" onClick={() => liveSelectedAgent && openEditDialog(liveSelectedAgent)}>
                                    <Pencil size={16} />
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Ticket Yield", val: liveSelectedAgent?.ticketsResolved, sub: "RESOLVED", icon: CheckCircle2, color: "text-emerald-400" },
                                    { label: "Avg Speed", val: liveSelectedAgent?.avgResolutionTime, sub: "PER TICKET", icon: Clock, color: "text-indigo-400" },
                                    { label: "Star Rating", val: liveSelectedAgent?.csatScore, sub: "CSAT SCORE", icon: Star, color: "text-rose-400" }
                                ].map((m, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <m.icon size={16} className={`${m.color} mb-3`} />
                                        <span className="text-[18px] font-black tracking-tight">{m.val}</span>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{m.sub}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Users2 size={120} className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none" />
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-10 space-y-12 pb-24">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} className="text-emerald-500" /> Operational Ownership
                                </h4>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-wrap gap-2 items-center">
                                    {liveSelectedAgent?.assignedQueues.map(q => (
                                        <Badge key={q} className="bg-white border-slate-200 text-slate-600 font-bold text-[10px] h-8 px-4 rounded-xl shadow-sm uppercase tracking-wider gap-2 group">
                                            {q} Desk
                                            <X size={10} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-rose-500" onClick={() => handleRemoveQueue(q)} />
                                        </Badge>
                                    ))}
                                    <Button variant="ghost" className="h-8 w-8 rounded-xl border-2 border-dashed border-slate-200 text-slate-300 p-0" onClick={() => setIsAddQueueDialogOpen(true)}>+</Button>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="space-y-8">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    <div className="flex items-center gap-2"><BarChart3 size={14} className="text-indigo-500" /> Resolution Velocity</div>
                                    <div className="text-indigo-600">{liveSelectedAgent ? agentTicketCounts[liveSelectedAgent.id]?.resolved || 0 : 0} Tickets</div>
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
                                <Button variant="outline" className="h-14 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest gap-2 hover:bg-slate-900 hover:text-white transition-all" onClick={openAdvancedConfig}>
                                    <Settings2 size={16} /> Advanced Config
                                </Button>
                                <Button onClick={() => liveSelectedAgent && setDeleteTarget(liveSelectedAgent)} variant="outline" className="h-14 rounded-2xl border-rose-100 text-rose-500 font-bold text-xs uppercase tracking-widest gap-2 hover:bg-rose-500 hover:text-white transition-all">
                                    <Trash2 size={16} /> Offboard Agent
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* Add Queue Dialog */}
            <Dialog open={isAddQueueDialogOpen} onOpenChange={setIsAddQueueDialogOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-2 border-slate-200 rounded-3xl shadow-3xl bg-white outline-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <Plus size={20} />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">Add Queue</DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Assign a new support queue</DialogDescription>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Queue Name</Label>
                            <Select value={newQueueName} onValueChange={setNewQueueName}>
                                <SelectTrigger className="h-12 border-slate-200 rounded-xl font-bold shadow-sm"><SelectValue placeholder="Select a queue" /></SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100">
                                    {categories.filter(c => !liveSelectedAgent?.assignedQueues.includes(c.name)).map(cat => (
                                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                        <Button variant="ghost" onClick={() => { setIsAddQueueDialogOpen(false); setNewQueueName(""); }} className="h-12 px-8 font-bold text-slate-400 text-xs uppercase tracking-widest">Cancel</Button>
                        <Button onClick={handleAddQueue} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-10 font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 gap-2">
                            <CheckCircle2 size={16} /> Assign
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Advanced Config Modal */}
            <Dialog open={isAdvancedConfigOpen} onOpenChange={setIsAdvancedConfigOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle>Advanced Configuration</DialogTitle>
                        <DialogDescription>Fine-tune permissions and quotas for {advConfig.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-5">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <Label className="text-xs font-bold text-slate-800">Delete Privilege</Label>
                                <p className="text-[10px] text-slate-400">Can permanently remove tickets</p>
                            </div>
                            <Switch checked={!!advConfig.canDeleteTickets} onCheckedChange={(v) => setAdvConfig({ ...advConfig, canDeleteTickets: v })} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <Label className="text-xs font-bold text-slate-800">Auto Invite</Label>
                                <p className="text-[10px] text-slate-400">Send access email on changes</p>
                            </div>
                            <Switch checked={!!advConfig.autoInvite} onCheckedChange={(v) => setAdvConfig({ ...advConfig, autoInvite: v })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</Label>
                            <Select value={advConfig.role} onValueChange={(v) => setAdvConfig({ ...advConfig, role: v as any })}>
                                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Agent">Support Agent</SelectItem>
                                    <SelectItem value="Supervisor">Team Supervisor</SelectItem>
                                    <SelectItem value="Admin">System Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Time</Label>
                                <Input value={advConfig.avgResolutionTime || ""} onChange={e => setAdvConfig({ ...advConfig, avgResolutionTime: e.target.value })} className="h-10 rounded-xl" placeholder="e.g. 3.5h" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CSAT (0-5)</Label>
                                <Input type="number" step={0.1} min={0} max={5} value={advConfig.csatScore ?? 0} onChange={e => setAdvConfig({ ...advConfig, csatScore: Number(e.target.value) })} className="h-10 rounded-xl" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsAdvancedConfigOpen(false)}>Cancel</Button>
                        <Button onClick={saveAdvancedConfig} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Config</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Compliance Report Modal */}
            <Dialog open={isComplianceOpen} onOpenChange={setIsComplianceOpen}>
                <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="flex items-center gap-2"><FileBarChart size={18} /> Compliance Report</DialogTitle>
                        <DialogDescription>Summary of roster health and performance.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Roster Size</span>
                                <div className="text-2xl font-black text-emerald-800 mt-1">{agents.length}</div>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Avg CSAT</span>
                                <div className="text-2xl font-black text-indigo-800 mt-1">{avgCsat}</div>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Total Resolved</span>
                                <div className="text-2xl font-black text-amber-800 mt-1">{agents.reduce((s, a) => s + a.ticketsResolved, 0)}</div>
                            </div>
                            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">Active Now</span>
                                <div className="text-2xl font-black text-rose-800 mt-1">{agents.filter(a => a.status === "Active").length}</div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Top 3 Performers</h5>
                            {[...agents].sort((a, b) => b.csatScore - a.csatScore).slice(0, 3).map(a => (
                                <div key={a.id} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800">{a.name}</span>
                                    <span className="text-xs font-black text-emerald-600">{a.csatScore} ★</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsComplianceOpen(false)}>Close</Button>
                        <Button onClick={downloadComplianceReport} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            <Download size={14} /> Download CSV
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete / Offboard Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Offboard {deleteTarget?.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This removes the agent from the roster. Their assigned tickets may need reassignment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    deleteAgent(deleteTarget.id);
                                    toast({ title: "Agent Offboarded", description: `${deleteTarget.name} removed.` });
                                    setDeleteTarget(null);
                                    setIsDetailSheetOpen(false);
                                }
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            Offboard
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AgentManagementPage;
