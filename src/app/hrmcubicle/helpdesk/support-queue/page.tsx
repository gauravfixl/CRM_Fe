"use client"

import React, { useState, useMemo } from "react";
import {
    Inbox,
    Search,
    Filter,
    ChevronRight,
    Clock,
    AlertCircle,
    AlertTriangle,
    ArrowUpRight,
    Users,
    CheckCircle2,
    MessageSquare,
    MoreVertical,
    UserPlus,
    XCircle,
    FastForward,
    ShieldAlert,
    MoreHorizontal,
    Flag,
    Calendar,
    ArrowDownWideNarrow,
    CheckCheck,
    MailWarning,
    History,
    LayoutGrid,
    LayoutList,
    Archive,
    Trash2,
    Target,
    Zap,
    LifeBuoy
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/shared/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useHelpdeskStore, type Ticket } from "@/shared/data/helpdesk-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const SupportQueuePage = () => {
    const { tickets, agents, updateTicket, addResponse } = useHelpdeskStore();
    const { toast } = useToast();

    // UI States
    const [activeView, setActiveView] = useState<"All" | "Unassigned" | "My" | "Escalated" | "Breached">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selection, setSelection] = useState<string[]>([]);

    // Response State
    const [replyContent, setReplyContent] = useState("");
    const [isInternal, setIsInternal] = useState(false);

    // Filtering Logic
    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.requestedBy.name.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            switch (activeView) {
                case "Unassigned": return !t.assignedTo;
                case "My": return t.assignedTo?.id === "HR-ADM-01"; // Assuming current user is HR-ADM-01
                case "Escalated": return t.status === "Escalated";
                case "Breached": return t.slaStatus === "Breached";
                default: return true;
            }
        });
    }, [tickets, activeView, searchQuery]);

    const handleAssign = (ticketId: string, agentId: string) => {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
            updateTicket(ticketId, {
                assignedTo: { id: agent.id, name: agent.name },
                status: "In Progress"
            });
            toast({ title: "Agent Assigned", description: `${agent.name} is now handling this ticket.` });
        }
    };

    const handleStatusUpdate = (ticketId: string, status: Ticket["status"]) => {
        updateTicket(ticketId, { status });
        toast({ title: "Status Updated", description: `Ticket is now marked as ${status}.` });
    };

    const handleSendReply = () => {
        if (!replyContent || !selectedTicket) return;
        addResponse(selectedTicket.id, {
            author: "HR Admin",
            authorRole: "Agent",
            content: replyContent,
            isInternal: isInternal
        });
        setReplyContent("");
        toast({ title: "Response Sent", description: isInternal ? "Internal note added." : "Reply dispatched to employee." });
    };

    const getSLAColor = (status: Ticket["slaStatus"]) => {
        switch (status) {
            case "Healthy": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Warning": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Breached": return "bg-rose-50 text-rose-600 border-rose-100";
        }
    };

    const stats = {
        unassigned: tickets.filter(t => !t.assignedTo).length,
        breached: tickets.filter(t => t.slaStatus === "Breached").length,
        escalated: tickets.filter(t => t.status === "Escalated").length,
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                            <Inbox size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase">Support Queue</h1>
                            <p className="text-sm font-medium text-slate-500">Live operational command center</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-6 border-r border-slate-100 pr-6 mr-6">
                            {[
                                { label: "Unassigned", val: stats.unassigned, color: "text-indigo-600" },
                                { label: "SLA Breached", val: stats.breached, color: "text-rose-600" },
                                { label: "Escalated", val: stats.escalated, color: "text-amber-600" }
                            ].map((s, i) => (
                                <div key={i} className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{s.label}</span>
                                    <span className={`text-lg font-extrabold ${s.color} leading-none tracking-tight`}>{s.val}</span>
                                </div>
                            ))}
                        </div>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-rose-100 transition-all">
                            <Zap size={14} /> Power Filter
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
                {/* Unified Toolbar */}
                <div className="flex items-center justify-between bg-white px-2 py-2 border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1">
                        {[
                            { id: "All", label: "Global Feed", icon: Inbox },
                            { id: "Unassigned", label: "Triage", icon: Target },
                            { id: "My", label: "My Deck", icon: UserPlus },
                            { id: "Escalated", label: "Escalations", icon: ShieldAlert },
                            { id: "Breached", label: "Breached", icon: XCircle }
                        ].map((view) => (
                            <Button
                                key={view.id}
                                variant={activeView === view.id ? 'default' : 'ghost'}
                                onClick={() => setActiveView(view.id as any)}
                                className={`h-9 rounded-xl px-4 flex items-center gap-2 group transition-all duration-300 ${activeView === view.id
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'text-slate-500 hover:bg-slate-50 font-bold'
                                    }`}
                            >
                                <view.icon size={14} className={activeView === view.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">{view.label}</span>
                                {view.id === 'Unassigned' && stats.unassigned > 0 && <Badge className="bg-rose-500 text-white border-none ml-1 h-4.5 min-w-4.5 p-1 rounded-full text-[9px] font-bold">{stats.unassigned}</Badge>}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 pr-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input
                                placeholder="Ref / Subject / Employee..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="h-9 w-64 bg-slate-50 border-none rounded-xl pl-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-slate-100"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400"><Filter size={14} /></Button>
                    </div>
                </div>

                {/* Main Content Table Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="grid grid-cols-[48px_1fr_180px_160px_140px_80px] px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center justify-center"><input type="checkbox" className="rounded-sm accent-slate-900" /></div>
                        <div>Ticket Detail</div>
                        <div>Employee / Dept</div>
                        <div>Assigned To</div>
                        <div>SLA / Health</div>
                        <div className="text-right">Action</div>
                    </div>

                    <ScrollArea className="flex-1">
                        <AnimatePresence mode="popLayout">
                            {filteredTickets.map((ticket, i) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group grid grid-cols-[48px_1fr_180px_160px_140px_80px] px-6 py-5 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all items-center cursor-pointer relative"
                                    onClick={() => { setSelectedTicket(ticket); setIsDetailSheetOpen(true); }}
                                >
                                    <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" className="rounded-sm accent-indigo-600 h-3.5 w-3.5" />
                                    </div>

                                    <div className="flex flex-col gap-1.5 pr-8">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-bold border-slate-100 text-slate-400 uppercase tracking-widest px-1.5 h-4.5 shadow-none bg-white">#{ticket.id}</Badge>
                                            <Badge className={`border-none text-[9px] font-bold h-4.5 px-2 uppercase tracking-wide
                                                ${ticket.status === 'Open' ? 'bg-indigo-50 text-indigo-600' :
                                                    ticket.status === 'Escalated' ? 'bg-rose-50 text-rose-600' :
                                                        ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}
                                            `}>
                                                {ticket.status}
                                            </Badge>
                                        </div>
                                        <h3 className="text-[13px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase truncate">{ticket.subject}</h3>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                            <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[8px] h-4 uppercase">{ticket.category}</Badge>
                                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                                            <span>Raised {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 tracking-tight">{ticket.requestedBy.name}</span>
                                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">{ticket.requestedBy.department}</span>
                                    </div>

                                    <div className="flex items-center">
                                        {ticket.assignedTo ? (
                                            <div className="flex items-center gap-2 group/agent">
                                                <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                                                    {ticket.assignedTo.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-xs font-bold text-indigo-600 tracking-tight">{ticket.assignedTo.name}</span>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                className="h-8 px-3 text-[10px] font-bold text-indigo-600 uppercase border border-dashed border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 rounded-lg gap-1.5"
                                                onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); setIsAssignDialogOpen(true); }}
                                            >
                                                <UserPlus size={12} /> Assign
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Badge className={`w-fit border font-bold text-[9px] h-5 px-2 uppercase tracking-tight ${getSLAColor(ticket.slaStatus)} shadow-none`}>
                                            {ticket.slaStatus}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                            <Clock size={11} className={ticket.slaStatus === 'Breached' ? 'text-rose-400' : ''} />
                                            <span className={ticket.slaStatus === 'Breached' ? 'text-rose-400' : ''}>
                                                {ticket.slaStatus === 'Breached' ? 'Overdue' : 'Ends in 4h'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all" onClick={e => e.stopPropagation()}>
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 p-1 rounded-2xl shadow-2xl border-slate-100">
                                                <DropdownMenuLabel className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 py-2">Quick Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 text-indigo-600"><Zap size={14} /> Resolve Fast</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2"><Flag size={14} /> Change Priority</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 text-rose-500 hover:bg-rose-50"><ShieldAlert size={14} /> Escalate</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </ScrollArea>
                </div>
            </div>

            {/* Support Detail Command Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-[850px] p-0 border-l border-slate-200 shadow-3xl bg-white flex flex-col overflow-hidden outline-none">
                    {/* Compact Operational Header */}
                    <div className="bg-slate-900 text-white p-8 flex items-center justify-between shrink-0 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className="bg-rose-500 text-white border-none text-[10px] h-5 px-2 font-bold uppercase tracking-wider">#{selectedTicket?.id}</Badge>
                                <Badge variant="outline" className="border-white/20 text-white/60 text-[10px] font-bold px-2 h-5 uppercase tracking-widest">{selectedTicket?.category}</Badge>
                            </div>
                            <SheetTitle className="text-2xl font-black text-white tracking-tighter uppercase leading-none max-w-xl">
                                {selectedTicket?.subject}
                            </SheetTitle>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                                    <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">{selectedTicket?.requestedBy.name[0]}</div>
                                    <span className="text-[11px] font-bold text-slate-300">{selectedTicket?.requestedBy.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-rose-400" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">SLA Deadline: {new Date(selectedTicket?.slaDeadline || '').toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative z-10 flex flex-col items-end gap-3">
                            <Select onValueChange={(v) => handleStatusUpdate(selectedTicket?.id!, v as any)}>
                                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white font-bold text-xs h-10 rounded-xl"><SelectValue placeholder={selectedTicket?.status} /></SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100">
                                    <SelectItem value="In Progress">Move to Progress</SelectItem>
                                    <SelectItem value="Pending Employee">Wait for User</SelectItem>
                                    <SelectItem value="Escalated">Escalate Up</SelectItem>
                                    <SelectItem value="Resolved">Mark Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" className="text-white/40 hover:text-white hover:bg-white/5 h-8 text-[11px] font-bold uppercase tracking-widest px-2" onClick={() => setIsDetailSheetOpen(false)}>
                                Close Sheet
                            </Button>
                        </div>
                        {/* Background Accents */}
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Side - Communication & Thread */}
                        <div className="flex-1 border-r border-slate-100 flex flex-col bg-slate-50/30">
                            <div className="h-12 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-white">
                                <div className="flex items-center gap-4">
                                    <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-600 pb-0.5 mt-2">Activity Thread</button>
                                    <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-0.5 mt-2 hover:text-slate-600">History Log</button>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedTicket?.responses.length} Messages</span>
                            </div>

                            <ScrollArea className="flex-1 p-8">
                                <div className="space-y-8">
                                    {/* Original Issue */}
                                    <div className="flex items-start gap-4">
                                        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                            <Inbox size={18} className="text-slate-400" />
                                        </div>
                                        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm border-tl-none">
                                            <p className="text-[13px] font-medium text-slate-700 leading-relaxed italic">
                                                "{selectedTicket?.description}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Thread */}
                                    {selectedTicket?.responses.map((res, i) => (
                                        <div key={res.id} className={`flex gap-4 ${res.authorRole === 'Agent' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${res.authorRole === 'Agent' ? 'bg-slate-900 text-white' : 'bg-indigo-100 text-indigo-600'
                                                }`}>
                                                {res.author.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className={`shadow-sm rounded-3xl p-5 max-w-[85%] ${res.authorRole === 'Agent'
                                                    ? 'bg-slate-900 text-white rounded-tr-none'
                                                    : 'bg-white border border-slate-100 rounded-tl-none'
                                                }`}>
                                                {res.isInternal && <Badge className="bg-amber-400 text-slate-900 border-none text-[8px] h-3.5 px-1 font-bold mb-2 uppercase tracking-widest">INTERNAL NOTE</Badge>}
                                                <p className="text-[12px] font-medium leading-relaxed">{res.content}</p>
                                                <div className={`mt-3 pt-2 border-t text-[9px] font-bold uppercase tracking-widest ${res.authorRole === 'Agent' ? 'border-white/10 text-white/40' : 'border-slate-50 text-slate-400'
                                                    }`}>
                                                    {res.author} • {new Date(res.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Complex Response Console */}
                            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={!isInternal}
                                                onChange={() => setIsInternal(false)}
                                                className="h-3.5 w-3.5 accent-indigo-600 rounded"
                                            />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-all ${!isInternal ? 'text-indigo-600' : 'text-slate-400'}`}>Reply to User</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={isInternal}
                                                onChange={() => setIsInternal(true)}
                                                className="h-3.5 w-3.5 accent-amber-500 rounded"
                                            />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-all ${isInternal ? 'text-amber-500' : 'text-slate-400'}`}>Internal Note</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-lg bg-slate-50"><MailWarning size={14} /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Canned Reponses</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        placeholder={isInternal ? "Add a private note for other agents..." : "Type your official response to employee..."}
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        className={`min-h-[120px] rounded-2xl p-6 text-sm font-medium border-2 transition-all focus-visible:ring-0 ${isInternal ? 'bg-amber-50/30 border-amber-100 focus:border-amber-300' : 'bg-slate-50/50 border-slate-100 focus:border-indigo-300'
                                            }`}
                                    />
                                    <div className="absolute right-4 bottom-4 flex items-center gap-3">
                                        <Button variant="ghost" className="h-9 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Discard</Button>
                                        <Button
                                            onClick={handleSendReply}
                                            className={`h-11 px-8 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg gap-3 transition-all ${isInternal ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                                                }`}
                                        >
                                            <Send size={16} /> {isInternal ? 'Add Note' : 'Deploy Reply'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Operation Specs */}
                        <div className="w-[320px] shrink-0 bg-white flex flex-col p-8 space-y-10 border-l border-slate-50">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" /> Operational Specs
                                </h4>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority Matrix</label>
                                        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 rounded-lg">
                                            {["Low", "Med", "High", "Urg"].map((p, i) => (
                                                <button
                                                    key={i}
                                                    className={`h-8 rounded-md text-[9px] font-bold uppercase transition-all ${selectedTicket?.priority.startsWith(p)
                                                            ? 'bg-slate-900 text-white shadow-md'
                                                            : 'text-slate-400 hover:bg-white'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolution Health</span>
                                            <Badge className={`${getSLAColor(selectedTicket?.slaStatus || 'Healthy')} border-none text-[8px] px-1.5 h-4 font-bold`}>{selectedTicket?.slaStatus}</Badge>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[70%]" />
                                        </div>
                                        <div className="flex justify-between text-[9px] font-medium text-slate-400 uppercase tracking-tight">
                                            <span>3h Spent</span>
                                            <span>5h Remaining</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <UserPlus size={14} className="text-indigo-600" /> Agent Deck
                                </h4>
                                <div className="p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                        {selectedTicket?.assignedTo?.name.split(' ').map(n => n[0]).join('') || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[11px] font-bold text-slate-800 block truncate">{selectedTicket?.assignedTo?.name || "Unassigned"}</span>
                                        <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest leading-none">Primary Agent</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400 hover:bg-white rounded-lg"><ChevronRight size={14} /></Button>
                                </div>
                                <Button variant="outline" className="w-full h-10 rounded-xl border-dashed border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-all">
                                    Change Ownership
                                </Button>
                            </div>

                            <Card className="p-5 bg-rose-50 border border-rose-100 rounded-2xl relative overflow-hidden group">
                                <div className="relative z-10 space-y-3">
                                    <h5 className="text-[11px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldAlert size={14} /> Global Escalation
                                    </h5>
                                    <p className="text-[10px] font-medium text-rose-500 leading-relaxed italic">Directly bypass agent hierarchy to Supervisor Rao.</p>
                                    <Button className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9px] uppercase tracking-widest rounded-lg shadow-sm">Escalate Now</Button>
                                </div>
                                <ShieldAlert size={60} className="absolute -right-4 -bottom-4 text-rose-500/10 group-hover:scale-125 transition-transform" />
                            </Card>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Quick Assign Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-2xl shadow-3xl bg-white outline-none">
                    <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-slate-900 leading-none">Handover Ownership</DialogTitle>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Select agent for #{selectedTicket?.id}</p>
                        </div>
                    </div>
                    <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                onClick={() => { handleAssign(selectedTicket?.id!, agent.id); setIsAssignDialogOpen(false); }}
                                className="p-3.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                        {agent.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <span className="text-[13px] font-bold text-slate-800 block leading-none">{agent.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{agent.role} • {agent.assignedQueues[0]}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-bold uppercase h-4 shadow-none">{agent.status}</Badge>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <Button variant="ghost" onClick={() => setIsAssignDialogOpen(false)} className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-400">Cancel Handover</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SupportQueuePage;
