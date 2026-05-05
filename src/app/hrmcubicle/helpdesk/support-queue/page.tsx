"use client"

import React, { useEffect, useState, useMemo } from "react";
import {
    Inbox,
    Search,
    Filter,
    ChevronRight,
    Clock,
    UserPlus,
    XCircle,
    ShieldAlert,
    MoreHorizontal,
    Flag,
    MailWarning,
    Target,
    Zap,
    Send,
    CheckCircle2,
    ArrowUpDown,
    Trash2,
    Edit3,
    Pencil,
    RotateCcw,
    Archive
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/shared/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { useHelpdeskStore, type Ticket } from "@/shared/data/helpdesk-store";
import { helpdeskApi } from "@/shared/data/helpdesk-api";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const CANNED_RESPONSES = [
    { label: "Acknowledge receipt", body: "Thanks for reaching out. We've received your request and are investigating. We'll update you shortly." },
    { label: "Request more info", body: "Could you share additional details (screenshots, error codes, steps to reproduce) so we can resolve this faster?" },
    { label: "Resolution confirmation", body: "We've deployed a fix. Please verify and let us know if the issue persists." },
    { label: "Escalation notice", body: "This ticket has been escalated to the relevant specialist. You'll receive an update within the next 2 hours." }
];

const CURRENT_USER_ID = "HR-ADM-01";
const CURRENT_USER_NAME = "HR Admin";

const SUBJECT_MIN = 5;
const SUBJECT_MAX = 120;
const DESC_MIN = 10;
const DESC_MAX = 2000;

const SupportQueuePage = () => {
    const {
        tickets: storeTickets,
        agents: storeAgents,
        categories,
        addResponse,
        updateTicket,
        deleteTicket,
        assignTicket,
        unassignTicket,
        escalateTicket
    } = useHelpdeskStore();
    const { toast } = useToast();

    // Backend state
    const [apiTickets, setApiTickets] = useState<Ticket[] | null>(null);
    const [apiAgents, setApiAgents] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

    const tickets = apiTickets !== null ? apiTickets : storeTickets;
    const agents = storeAgents; // always from store for richness; api agents used only for assign picker

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setIsLoading(true);
            try {
                const list = await helpdeskApi.fetchAllTickets({ limit: 100 });
                if (!cancelled) {
                    setApiTickets(list);
                    setBackendAvailable(true);
                }
            } catch {
                if (!cancelled) setBackendAvailable(false);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        // Fetch org users for assign picker (optional, graceful fail)
        helpdeskApi.fetchOrgUsers().then(u => { if (!cancelled) setApiAgents(u); }).catch(() => { });
        return () => { cancelled = true; };
    }, []);

    const refetchAll = async () => {
        try {
            const list = await helpdeskApi.fetchAllTickets({ limit: 100 });
            setApiTickets(list);
        } catch { /* ignore */ }
    };

    // UI States
    const [activeView, setActiveView] = useState<"All" | "Unassigned" | "My" | "Escalated" | "Breached">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [isChangeOwnershipOpen, setIsChangeOwnershipOpen] = useState(false);
    const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
    const [selection, setSelection] = useState<string[]>([]);

    // Advanced filters
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"recent" | "oldest" | "priority" | "sla">("recent");
    const [isPowerFilterOpen, setIsPowerFilterOpen] = useState(false);

    // Response State
    const [replyContent, setReplyContent] = useState("");
    const [isInternal, setIsInternal] = useState(false);

    // Edit ticket state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Ticket>>({});

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<Ticket | null>(null);

    // Keep sheet in sync with store updates
    const liveSelectedTicket = useMemo(() =>
        selectedTicket ? tickets.find(t => t.id === selectedTicket.id) || null : null
        , [tickets, selectedTicket]);

    // Filtering Logic
    const filteredTickets = useMemo(() => {
        const list = tickets.filter(t => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q
                || t.id.toLowerCase().includes(q)
                || t.subject.toLowerCase().includes(q)
                || t.requestedBy.name.toLowerCase().includes(q);
            if (!matchesSearch) return false;

            if (filterPriority !== "all" && t.priority !== filterPriority) return false;
            if (filterCategory !== "all" && t.category !== filterCategory) return false;

            switch (activeView) {
                case "Unassigned": return !t.assignedTo;
                case "My": return t.assignedTo?.id === CURRENT_USER_ID || t.assignedTo?.name === CURRENT_USER_NAME;
                case "Escalated": return t.status === "Escalated";
                case "Breached": return t.slaStatus === "Breached";
                default: return true;
            }
        });

        const priorityWeight: Record<Ticket["priority"], number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        const slaWeight: Record<Ticket["slaStatus"], number> = { Breached: 3, Warning: 2, Healthy: 1 };

        return [...list].sort((a, b) => {
            switch (sortBy) {
                case "recent": return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "priority": return priorityWeight[b.priority] - priorityWeight[a.priority];
                case "sla": return slaWeight[b.slaStatus] - slaWeight[a.slaStatus];
            }
        });
    }, [tickets, activeView, searchQuery, filterPriority, filterCategory, sortBy]);

    const openDetailSheet = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsDetailSheetOpen(true);
        setReplyContent("");
        setIsInternal(false);
    };

    const mirrorApi = (fn: (t: Ticket) => Ticket | null) => {
        if (apiTickets === null) return;
        setApiTickets(prev => {
            if (!prev) return prev;
            return prev.reduce<Ticket[]>((acc, t) => {
                const next = fn(t);
                if (next) acc.push(next);
                return acc;
            }, []);
        });
    };

    const handleAssign = async (ticketId: string, agentId: string, agentName?: string) => {
        // Look up name if not provided (store agents + api users)
        const name = agentName
            || agents.find(a => a.id === agentId)?.name
            || apiAgents.find(a => a.id === agentId)?.name
            || "Agent";
        // Optimistic local update
        assignTicket(ticketId, { id: agentId, name });
        mirrorApi(t => t.id === ticketId ? { ...t, assignedTo: { id: agentId, name }, status: t.status === "Open" ? "In Progress" : t.status, updatedAt: new Date().toISOString() } : t);
        if (backendAvailable !== false) {
            try {
                await helpdeskApi.assignAgent(ticketId, agentId);
                toast({ title: "Agent Assigned", description: `${name} is now handling this ticket.` });
            } catch (err: any) {
                toast({ title: "Assign Failed", description: err?.response?.data?.message || "Backend could not assign agent.", variant: "destructive" });
            }
        } else {
            toast({ title: "Agent Assigned (Offline)", description: `${name} is now handling this ticket.` });
        }
    };

    const handleStatusUpdate = async (ticketId: string, status: Ticket["status"]) => {
        updateTicket(ticketId, { status }, `Status changed to ${status}`);
        mirrorApi(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t);
        if (backendAvailable !== false) {
            try {
                await helpdeskApi.updateStatus(ticketId, status);
                toast({ title: "Status Updated", description: `Ticket marked as ${status}.` });
            } catch (err: any) {
                toast({ title: "Sync Warning", description: err?.response?.data?.message || "Local change saved; backend sync failed.", variant: "destructive" });
            }
        } else {
            toast({ title: "Status Updated (Offline)", description: `Ticket marked as ${status}.` });
        }
    };

    const handlePriorityUpdate = (ticketId: string, priority: Ticket["priority"]) => {
        // Backend does not support priority updates — local only
        updateTicket(ticketId, { priority }, `Priority changed to ${priority}`);
        mirrorApi(t => t.id === ticketId ? { ...t, priority, updatedAt: new Date().toISOString() } : t);
        toast({ title: "Priority Updated", description: `Priority set to ${priority} (local only).` });
    };

    const handleEscalate = async (ticketId: string) => {
        escalateTicket(ticketId);
        mirrorApi(t => t.id === ticketId ? { ...t, status: "Escalated", updatedAt: new Date().toISOString() } : t);
        if (backendAvailable !== false) {
            try {
                // Backend has no "escalated" status — falls back to in_progress
                await helpdeskApi.updateStatus(ticketId, "Escalated");
            } catch { /* ignore */ }
        }
        toast({ title: "Ticket Escalated", description: "Supervisor has been notified." });
    };

    const handleResolveFast = async (ticketId: string) => {
        updateTicket(ticketId, { status: "Resolved", slaStatus: "Healthy" }, "Fast-resolved");
        mirrorApi(t => t.id === ticketId ? { ...t, status: "Resolved", slaStatus: "Healthy", updatedAt: new Date().toISOString() } : t);
        if (backendAvailable !== false) {
            try { await helpdeskApi.updateStatus(ticketId, "Resolved"); } catch { /* ignore */ }
        }
        toast({ title: "Resolved", description: "Ticket closed via fast-resolve." });
    };

    const handleTakeOwnership = async (ticketId: string) => {
        await handleAssign(ticketId, CURRENT_USER_ID, CURRENT_USER_NAME);
    };

    const handleSendReply = () => {
        if (!replyContent.trim() || !liveSelectedTicket) {
            toast({ title: "Empty Message", description: "Type a message before sending.", variant: "destructive" });
            return;
        }
        addResponse(liveSelectedTicket.id, {
            author: CURRENT_USER_NAME,
            authorRole: "Agent",
            content: replyContent.trim(),
            isInternal
        });
        setReplyContent("");
        toast({ title: isInternal ? "Note Added" : "Reply Sent", description: isInternal ? "Internal note recorded." : "Response dispatched to employee." });
    };

    const openEditDialog = () => {
        if (!liveSelectedTicket) return;
        setEditForm({
            subject: liveSelectedTicket.subject,
            description: liveSelectedTicket.description,
            category: liveSelectedTicket.category,
            subCategory: liveSelectedTicket.subCategory,
            priority: liveSelectedTicket.priority
        });
        setIsEditDialogOpen(true);
    };

    const saveEdit = () => {
        if (!liveSelectedTicket) return;
        const errs: Record<string, string> = {};
        const subject = (editForm.subject || "").trim();
        const desc = (editForm.description || "").trim();
        if (!subject) errs.subject = "Subject is required.";
        else if (subject.length < SUBJECT_MIN) errs.subject = `Subject must be at least ${SUBJECT_MIN} characters.`;
        else if (subject.length > SUBJECT_MAX) errs.subject = `Subject must be under ${SUBJECT_MAX} characters.`;
        if (desc && desc.length < DESC_MIN) errs.description = `Description must be at least ${DESC_MIN} characters.`;
        else if (desc && desc.length > DESC_MAX) errs.description = `Description must be under ${DESC_MAX} characters.`;
        if (Object.keys(errs).length) {
            toast({ title: "Validation Failed", description: Object.values(errs)[0], variant: "destructive" });
            return;
        }
        updateTicket(liveSelectedTicket.id, editForm, "Ticket details edited");
        mirrorApi(t => t.id === liveSelectedTicket.id ? { ...t, ...editForm, updatedAt: new Date().toISOString() } : t);
        toast({ title: "Ticket Updated", description: "Details saved (non-status fields are local only)." });
        setIsEditDialogOpen(false);
    };

    const handleDelete = async (ticket: Ticket) => {
        deleteTicket(ticket.id);
        mirrorApi(t => t.id === ticket.id ? null : t);
        if (backendAvailable !== false) {
            try {
                await helpdeskApi.deleteTicket(ticket.id);
            } catch (err: any) {
                toast({ title: "Delete Warning", description: err?.response?.data?.message || "Removed locally but backend delete failed.", variant: "destructive" });
                return;
            }
        }
        toast({ title: "Ticket Deleted", description: `#${ticket.id} removed.` });
    };

    const handleBulkAction = async (action: "assign-me" | "close" | "delete") => {
        if (selection.length === 0) {
            toast({ title: "Nothing Selected", description: "Select tickets first.", variant: "destructive" });
            return;
        }
        const promises: Promise<any>[] = [];
        for (const id of selection) {
            if (action === "assign-me") {
                assignTicket(id, { id: CURRENT_USER_ID, name: CURRENT_USER_NAME });
                mirrorApi(t => t.id === id ? { ...t, assignedTo: { id: CURRENT_USER_ID, name: CURRENT_USER_NAME }, updatedAt: new Date().toISOString() } : t);
                if (backendAvailable !== false) promises.push(helpdeskApi.assignAgent(id, CURRENT_USER_ID).catch(() => { }));
            }
            if (action === "close") {
                updateTicket(id, { status: "Closed" }, "Bulk closed");
                mirrorApi(t => t.id === id ? { ...t, status: "Closed", updatedAt: new Date().toISOString() } : t);
                if (backendAvailable !== false) promises.push(helpdeskApi.updateStatus(id, "Closed").catch(() => { }));
            }
            if (action === "delete") {
                deleteTicket(id);
                mirrorApi(t => t.id === id ? null : t);
                if (backendAvailable !== false) promises.push(helpdeskApi.deleteTicket(id).catch(() => { }));
            }
        }
        await Promise.all(promises);
        toast({ title: "Bulk Action Complete", description: `${selection.length} ticket(s) processed.` });
        setSelection([]);
        setIsBulkActionOpen(false);
    };

    const getSLAColor = (status: Ticket["slaStatus"]) => {
        switch (status) {
            case "Healthy": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Warning": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Breached": return "bg-rose-50 text-rose-600 border-rose-100";
        }
    };

    const getRemainingTime = (deadline: string, slaStatus: Ticket["slaStatus"]) => {
        if (slaStatus === "Breached") return "Overdue";
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff < 0) return "Overdue";
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return `${Math.floor(diff / 60000)}m left`;
        if (hours < 24) return `${hours}h left`;
        return `${Math.floor(hours / 24)}d left`;
    };

    const stats = {
        unassigned: tickets.filter(t => !t.assignedTo).length,
        breached: tickets.filter(t => t.slaStatus === "Breached").length,
        escalated: tickets.filter(t => t.status === "Escalated").length,
    };

    const allSelected = filteredTickets.length > 0 && filteredTickets.every(t => selection.includes(t.id));
    const toggleSelectAll = () => {
        if (allSelected) setSelection([]);
        else setSelection(filteredTickets.map(t => t.id));
    };
    const toggleSelect = (id: string) => {
        setSelection(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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
                            <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase flex items-center gap-2">
                                Support Queue
                                {isLoading && <span className="text-[10px] font-bold text-indigo-500 animate-pulse normal-case">Syncing...</span>}
                                {backendAvailable === false && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full normal-case">Offline</span>}
                                {backendAvailable === true && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full normal-case">Live</span>}
                            </h1>
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
                        <Popover open={isPowerFilterOpen} onOpenChange={setIsPowerFilterOpen}>
                            <PopoverTrigger asChild>
                                <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-rose-100 transition-all">
                                    <Zap size={14} /> Power Filter
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-80 p-5 space-y-5 rounded-2xl">
                                <div>
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</Label>
                                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                                        <SelectTrigger className="h-10 rounded-xl mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            <SelectItem value="Urgent">Urgent</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</Label>
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger className="h-10 rounded-xl mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort By</Label>
                                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                                        <SelectTrigger className="h-10 rounded-xl mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recent">Most Recent</SelectItem>
                                            <SelectItem value="oldest">Oldest First</SelectItem>
                                            <SelectItem value="priority">Priority</SelectItem>
                                            <SelectItem value="sla">SLA Health</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="ghost" className="flex-1 h-9 text-xs" onClick={() => { setFilterPriority("all"); setFilterCategory("all"); setSortBy("recent"); toast({ title: "Filters Reset" }); }}>Reset</Button>
                                    <Button className="flex-1 h-9 text-xs bg-slate-900 text-white" onClick={() => setIsPowerFilterOpen(false)}>Apply</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
                {/* Unified Toolbar */}
                <div className="flex items-center justify-between bg-white px-2 py-2 border border-slate-200 rounded-2xl shadow-sm flex-wrap gap-2">
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
                        {selection.length > 0 && (
                            <Button onClick={() => setIsBulkActionOpen(true)} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase gap-2">
                                <CheckCircle2 size={14} /> {selection.length} Selected
                            </Button>
                        )}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input
                                placeholder="Ref / Subject / Employee..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="h-9 w-64 bg-slate-50 border border-slate-200 rounded-xl pl-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-slate-100"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400" title="Sort">
                                    <ArrowUpDown size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">Sort By</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSortBy("recent")}>Most Recent</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("priority")}>Priority</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("sla")}>SLA Health</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400"><Filter size={14} /></Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-64 p-4 rounded-2xl space-y-3">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase">Quick Filter</Label>
                                <Select value={filterPriority} onValueChange={setFilterPriority}>
                                    <SelectTrigger className="h-9 rounded-xl"><SelectValue placeholder="Priority" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                    <SelectTrigger className="h-9 rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Main Content Table Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="grid grid-cols-[48px_1fr_180px_160px_140px_80px] px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center justify-center">
                            <input type="checkbox" className="rounded-sm accent-slate-900" checked={allSelected} onChange={toggleSelectAll} />
                        </div>
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
                                    transition={{ delay: i * 0.02 }}
                                    className="group grid grid-cols-[48px_1fr_180px_160px_140px_80px] px-6 py-5 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all items-center cursor-pointer relative"
                                    onClick={() => openDetailSheet(ticket)}
                                >
                                    <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" checked={selection.includes(ticket.id)} onChange={() => toggleSelect(ticket.id)} className="rounded-sm accent-indigo-600 h-3.5 w-3.5" />
                                    </div>

                                    <div className="flex flex-col gap-1.5 pr-8">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-bold border-slate-100 text-slate-400 uppercase tracking-widest px-1.5 h-4.5 shadow-none bg-white">#{ticket.id}</Badge>
                                            <Badge className={`border-none text-[9px] font-bold h-4.5 px-2 uppercase tracking-wide
                                                ${ticket.status === 'Open' ? 'bg-indigo-50 text-indigo-600' :
                                                    ticket.status === 'Escalated' ? 'bg-rose-50 text-rose-600' :
                                                        ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-600' :
                                                            ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}
                                            `}>
                                                {ticket.status}
                                            </Badge>
                                            <Badge className={`border-none text-[9px] font-bold h-4.5 px-2 uppercase tracking-wide
                                                ${ticket.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                                                    ticket.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                                                        ticket.priority === 'Medium' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}
                                            `}>
                                                {ticket.priority}
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

                                    <div className="flex items-center" onClick={e => e.stopPropagation()}>
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
                                                onClick={() => { setSelectedTicket(ticket); setIsAssignDialogOpen(true); }}
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
                                                {getRemainingTime(ticket.slaDeadline, ticket.slaStatus)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right" onClick={e => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 p-1 rounded-2xl shadow-2xl border-slate-100">
                                                <DropdownMenuLabel className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 py-2">Quick Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 text-indigo-600 cursor-pointer" onClick={() => handleResolveFast(ticket.id)}>
                                                    <Zap size={14} /> Resolve Fast
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 cursor-pointer" onClick={() => handleTakeOwnership(ticket.id)}>
                                                    <UserPlus size={14} /> Take Ownership
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 cursor-pointer" onClick={() => { setSelectedTicket(ticket); setIsAssignDialogOpen(true); }}>
                                                    <Edit3 size={14} /> Reassign
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 py-2">Change Priority</DropdownMenuLabel>
                                                {(["Urgent", "High", "Medium", "Low"] as const).map(p => (
                                                    <DropdownMenuItem key={p} className="rounded-xl text-[11px] font-bold h-8 uppercase gap-2 cursor-pointer" onClick={() => handlePriorityUpdate(ticket.id, p)}>
                                                        <Flag size={12} /> {p}
                                                    </DropdownMenuItem>
                                                ))}
                                                <DropdownMenuSeparator />
                                                {ticket.status === "Closed" ? (
                                                    <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 cursor-pointer" onClick={() => handleStatusUpdate(ticket.id, "Reopened")}>
                                                        <RotateCcw size={14} /> Reopen
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 cursor-pointer" onClick={() => handleStatusUpdate(ticket.id, "Closed")}>
                                                        <Archive size={14} /> Close Ticket
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 text-rose-500 hover:bg-rose-50 cursor-pointer" onClick={() => handleEscalate(ticket.id)}>
                                                    <ShieldAlert size={14} /> Escalate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl text-[11px] font-bold h-9 uppercase gap-2 text-rose-500 hover:bg-rose-50 cursor-pointer" onClick={() => setDeleteTarget(ticket)}>
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredTickets.length === 0 && (
                            <div className="p-16 text-center text-slate-400">
                                <Inbox size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold italic">No tickets match the current view.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>

            {/* Support Detail Command Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-[850px] p-0 border-l border-slate-200 shadow-3xl bg-white flex flex-col overflow-hidden outline-none">
                    <div className="bg-slate-900 text-white p-8 flex items-center justify-between shrink-0 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className="bg-rose-500 text-white border-none text-[10px] h-5 px-2 font-bold uppercase tracking-wider">#{liveSelectedTicket?.id}</Badge>
                                <Badge variant="outline" className="border-white/20 text-white/60 text-[10px] font-bold px-2 h-5 uppercase tracking-widest">{liveSelectedTicket?.category}</Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10 rounded-lg" onClick={openEditDialog}>
                                    <Pencil size={12} />
                                </Button>
                            </div>
                            <SheetTitle className="text-2xl font-black text-white tracking-tighter uppercase leading-none max-w-xl">
                                {liveSelectedTicket?.subject}
                            </SheetTitle>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                                    <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">{liveSelectedTicket?.requestedBy.name[0]}</div>
                                    <span className="text-[11px] font-bold text-slate-300">{liveSelectedTicket?.requestedBy.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-rose-400" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">
                                        {liveSelectedTicket && getRemainingTime(liveSelectedTicket.slaDeadline, liveSelectedTicket.slaStatus)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="relative z-10 flex flex-col items-end gap-3">
                            <Select value={liveSelectedTicket?.status} onValueChange={(v) => liveSelectedTicket && handleStatusUpdate(liveSelectedTicket.id, v as Ticket["status"])}>
                                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white font-bold text-xs h-10 rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100">
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Pending Employee">Pending Employee</SelectItem>
                                    <SelectItem value="Escalated">Escalated</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                    <SelectItem value="Reopened">Reopened</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" className="text-white/40 hover:text-white hover:bg-white/5 h-8 text-[11px] font-bold uppercase tracking-widest px-2" onClick={() => setIsDetailSheetOpen(false)}>
                                Close Sheet
                            </Button>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Side - Communication & Thread */}
                        <div className="flex-1 border-r border-slate-100 flex flex-col bg-slate-50/30">
                            <div className="h-12 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-white">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-600 pb-0.5 mt-2">Activity Thread</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{liveSelectedTicket?.responses.length || 0} Messages</span>
                            </div>

                            <ScrollArea className="flex-1 p-8">
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                            <Inbox size={18} className="text-slate-400" />
                                        </div>
                                        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                                            <p className="text-[13px] font-medium text-slate-700 leading-relaxed italic">
                                                "{liveSelectedTicket?.description}"
                                            </p>
                                        </div>
                                    </div>

                                    {liveSelectedTicket?.responses.map((res) => (
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
                                                <p className="text-[12px] font-medium leading-relaxed whitespace-pre-wrap">{res.content}</p>
                                                <div className={`mt-3 pt-2 border-t text-[9px] font-bold uppercase tracking-widest ${res.authorRole === 'Agent' ? 'border-white/10 text-white/40' : 'border-slate-50 text-slate-400'
                                                    }`}>
                                                    {res.author} • {new Date(res.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" checked={!isInternal} onChange={() => setIsInternal(false)} className="h-3.5 w-3.5 accent-indigo-600 rounded" />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-all ${!isInternal ? 'text-indigo-600' : 'text-slate-400'}`}>Reply to User</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" checked={isInternal} onChange={() => setIsInternal(true)} className="h-3.5 w-3.5 accent-amber-500 rounded" />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-all ${isInternal ? 'text-amber-500' : 'text-slate-400'}`}>Internal Note</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-lg bg-slate-50">
                                                                <MailWarning size={14} />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Canned Responses</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </PopoverTrigger>
                                            <PopoverContent align="end" className="w-80 p-2 rounded-2xl">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 block">Canned Responses</Label>
                                                {CANNED_RESPONSES.map((c, i) => (
                                                    <button
                                                        key={i}
                                                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-all block"
                                                        onClick={() => { setReplyContent(c.body); toast({ title: "Inserted", description: c.label }); }}
                                                    >
                                                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tight block">{c.label}</span>
                                                        <span className="text-[10px] text-slate-500 line-clamp-2 mt-1 block">{c.body}</span>
                                                    </button>
                                                ))}
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        placeholder={isInternal ? "Add a private note for other agents..." : "Type your official response to employee..."}
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        className={`min-h-[120px] rounded-2xl p-6 text-sm font-medium border-2 transition-all focus-visible:ring-0 ${isInternal ? 'bg-amber-50/30 border-amber-100 focus:border-amber-300' : 'bg-slate-50/50 border-slate-100 focus:border-indigo-300'}`}
                                    />
                                    <div className="absolute right-4 bottom-4 flex items-center gap-3">
                                        <Button variant="ghost" className="h-9 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest" onClick={() => { setReplyContent(""); toast({ title: "Discarded", description: "Reply draft cleared." }); }}>Discard</Button>
                                        <Button
                                            onClick={handleSendReply}
                                            className={`h-11 px-8 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg gap-3 transition-all ${isInternal ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}`}
                                        >
                                            <Send size={16} /> {isInternal ? 'Add Note' : 'Deploy Reply'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Operation Specs */}
                        <div className="w-[320px] shrink-0 bg-white flex flex-col p-8 space-y-10 border-l border-slate-50 overflow-y-auto">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" /> Operational Specs
                                </h4>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority Matrix</label>
                                        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 rounded-lg">
                                            {(["Low", "Medium", "High", "Urgent"] as const).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => liveSelectedTicket && handlePriorityUpdate(liveSelectedTicket.id, p)}
                                                    className={`h-8 rounded-md text-[9px] font-bold uppercase transition-all ${liveSelectedTicket?.priority === p
                                                        ? 'bg-slate-900 text-white shadow-md'
                                                        : 'text-slate-400 hover:bg-white'
                                                        }`}
                                                >
                                                    {p.slice(0, 4)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolution Health</span>
                                            <Badge className={`${getSLAColor(liveSelectedTicket?.slaStatus || 'Healthy')} border-none text-[8px] px-1.5 h-4 font-bold`}>{liveSelectedTicket?.slaStatus}</Badge>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div className={`h-full ${liveSelectedTicket?.slaStatus === 'Breached' ? 'bg-rose-500' : liveSelectedTicket?.slaStatus === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'} w-[70%]`} />
                                        </div>
                                        <div className="flex justify-between text-[9px] font-medium text-slate-400 uppercase tracking-tight">
                                            <span>Deadline: {new Date(liveSelectedTicket?.slaDeadline || '').toLocaleDateString()}</span>
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
                                        {liveSelectedTicket?.assignedTo?.name.split(' ').map(n => n[0]).join('') || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[11px] font-bold text-slate-800 block truncate">{liveSelectedTicket?.assignedTo?.name || "Unassigned"}</span>
                                        <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest leading-none">Primary Agent</span>
                                    </div>
                                    {liveSelectedTicket?.assignedTo && (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:bg-rose-50 rounded-lg" onClick={() => { unassignTicket(liveSelectedTicket.id); toast({ title: "Unassigned", description: "Ticket returned to triage." }); }}>
                                            <XCircle size={14} />
                                        </Button>
                                    )}
                                </div>
                                <Button variant="outline" className="w-full h-10 rounded-xl border-dashed border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-all" onClick={() => setIsChangeOwnershipOpen(true)}>
                                    {liveSelectedTicket?.assignedTo ? "Change Ownership" : "Assign Agent"}
                                </Button>
                            </div>

                            <Card className="p-5 bg-rose-50 border border-rose-100 rounded-2xl relative overflow-hidden group">
                                <div className="relative z-10 space-y-3">
                                    <h5 className="text-[11px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldAlert size={14} /> Global Escalation
                                    </h5>
                                    <p className="text-[10px] font-medium text-rose-500 leading-relaxed italic">Directly bypass agent hierarchy to Supervisor.</p>
                                    <Button
                                        disabled={liveSelectedTicket?.status === "Escalated"}
                                        onClick={() => liveSelectedTicket && handleEscalate(liveSelectedTicket.id)}
                                        className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9px] uppercase tracking-widest rounded-lg shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    >
                                        {liveSelectedTicket?.status === "Escalated" ? "Already Escalated" : "Escalate Now"}
                                    </Button>
                                </div>
                                <ShieldAlert size={60} className="absolute -right-4 -bottom-4 text-rose-500/10 group-hover:scale-125 transition-transform" />
                            </Card>

                            <Button variant="outline" className="w-full h-10 rounded-xl border-rose-200 text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all gap-2" onClick={() => liveSelectedTicket && setDeleteTarget(liveSelectedTicket)}>
                                <Trash2 size={14} /> Delete Ticket
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Assign Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">Assign Ownership</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Select agent for #{selectedTicket?.id}</DialogDescription>
                    </DialogHeader>
                    <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                        {apiAgents.length > 0 && (
                            <>
                                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest px-2 pb-1">Org Users (Live)</p>
                                {apiAgents.map((u) => (
                                    <div
                                        key={`api-${u.id}`}
                                        onClick={() => { handleAssign(selectedTicket?.id!, u.id, u.name); setIsAssignDialogOpen(false); }}
                                        className="p-3.5 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-white border border-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                                                {u.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <span className="text-[13px] font-bold text-slate-800 block leading-none">{u.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{u.role} • {u.email}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-400" />
                                    </div>
                                ))}
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-3 pb-1">Local Agents</p>
                            </>
                        )}
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                onClick={() => { handleAssign(selectedTicket?.id!, agent.id, agent.name); setIsAssignDialogOpen(false); }}
                                className="p-3.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                        {agent.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <span className="text-[13px] font-bold text-slate-800 block leading-none">{agent.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{agent.role} • {agent.assignedQueues[0] || "No Queue"}</span>
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
                        <Button variant="ghost" onClick={() => setIsAssignDialogOpen(false)} className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-400">Cancel</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Change Ownership Dialog (from detail sheet) */}
            <Dialog open={isChangeOwnershipOpen} onOpenChange={setIsChangeOwnershipOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">Change Ownership</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Transfer #{liveSelectedTicket?.id} to a different agent</DialogDescription>
                    </DialogHeader>
                    <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                        {agents.filter(a => a.id !== liveSelectedTicket?.assignedTo?.id).map((agent) => (
                            <div
                                key={agent.id}
                                onClick={() => { if (liveSelectedTicket) { handleAssign(liveSelectedTicket.id, agent.id); setIsChangeOwnershipOpen(false); } }}
                                className="p-3.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-indigo-600">
                                        {agent.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <span className="text-[13px] font-bold text-slate-800 block">{agent.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{agent.role}</span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400" />
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Ticket Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">Edit Ticket</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Update subject, description, category and priority.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</Label>
                            <Input value={editForm.subject || ""} onChange={e => setEditForm({ ...editForm, subject: e.target.value })} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</Label>
                            <Textarea value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="min-h-[120px] rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</Label>
                                <Select value={editForm.category} onValueChange={v => setEditForm({ ...editForm, category: v })}>
                                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</Label>
                                <Select value={editForm.priority} onValueChange={v => setEditForm({ ...editForm, priority: v as any })}>
                                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveEdit} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Action Dialog */}
            <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">Bulk Action</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Apply an action to {selection.length} ticket(s).</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl" onClick={() => handleBulkAction("assign-me")}>
                            <UserPlus size={14} /> Assign to Me
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl" onClick={() => handleBulkAction("close")}>
                            <Archive size={14} /> Mark as Closed
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleBulkAction("delete")}>
                            <Trash2 size={14} /> Delete Selected
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete #{deleteTarget?.id}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently removes "{deleteTarget?.subject}" from the queue. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (deleteTarget) {
                                    await handleDelete(deleteTarget);
                                    setDeleteTarget(null);
                                    setIsDetailSheetOpen(false);
                                }
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SupportQueuePage;
