"use client"

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Ticket,
    Plus,
    Search,
    ChevronRight,
    Clock,
    MessageSquare,
    Paperclip,
    LayoutGrid,
    LayoutList,
    Trash2,
    Send,
    User,
    Tag,
    History,
    FileText,
    CheckCircle2,
    Inbox,
    AlertCircle,
    Pencil,
    X,
    Save,
    RotateCcw,
    Filter,
    MoreHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useHelpdeskStore, type Ticket as TicketType } from "@/shared/data/helpdesk-store";
import { helpdeskApi } from "@/shared/data/helpdesk-api";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const CURRENT_USER = { id: "HR-ADM-01", name: "HR Admin", department: "HR Admin" };
const SUBJECT_MIN = 5;
const SUBJECT_MAX = 120;
const DESC_MIN = 10;
const DESC_MAX = 2000;

interface TicketFormData {
    subject: string;
    description: string;
    category: string;
    priority: TicketType["priority"];
    status?: TicketType["status"];
    attachments: string[];
}

const defaultForm: TicketFormData = {
    subject: "",
    description: "",
    category: "HR Ops",
    priority: "Medium",
    attachments: []
};

const MyTicketsPage = () => {
    const {
        tickets,
        categories,
        addTicket,
        updateTicket,
        deleteTicket,
        addResponse
    } = useHelpdeskStore();
    const { toast } = useToast();

    // UI State
    const [activeTab, setActiveTab] = useState<"All" | "Open" | "In Progress" | "Resolved" | "Closed" | "Draft">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<TicketType | null>(null);
    const [filterPriority, setFilterPriority] = useState<string>("all");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachFileInputRef = useRef<HTMLInputElement>(null);

    // Backend state
    const [apiTickets, setApiTickets] = useState<TicketType[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

    // Form state for create
    const [createForm, setCreateForm] = useState<TicketFormData>(defaultForm);
    const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
    // Form state for edit
    const [editForm, setEditForm] = useState<TicketFormData & { id?: string }>(defaultForm);
    const [editErrors, setEditErrors] = useState<Record<string, string>>({});

    // Load my tickets from backend on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setIsLoading(true);
            try {
                const list = await helpdeskApi.fetchMyTickets();
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
        return () => { cancelled = true; };
    }, []);

    const refetchMyTickets = async () => {
        try {
            const list = await helpdeskApi.fetchMyTickets();
            setApiTickets(list);
        } catch { /* ignore */ }
    };

    // Source: backend if available (non-null), else store
    const sourceTickets = apiTickets !== null ? apiTickets : tickets.filter(t =>
        t.requestedBy.id === CURRENT_USER.id ||
        t.requestedBy.name.toLowerCase().includes("hr admin")
    );

    // Live selected ticket (auto-refreshes as source updates)
    const liveSelectedTicket = useMemo(() =>
        selectedTicket ? sourceTickets.find(t => t.id === selectedTicket.id) || selectedTicket : null
        , [sourceTickets, selectedTicket]);

    const myRaisedTickets = sourceTickets;

    // For display Draft status we treat as custom — since store type doesn't include Draft, we persist drafts as "Open" with a flag in subject? Instead, we reserve Draft status properly.
    const filteredTickets = useMemo(() => {
        return myRaisedTickets.filter(t => {
            const matchesTab = activeTab === "All" || t.status === activeTab;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
            const matchesPrio = filterPriority === "all" || t.priority === filterPriority;
            return matchesTab && matchesSearch && matchesPrio;
        });
    }, [myRaisedTickets, activeTab, searchQuery, filterPriority]);

    const validateForm = (f: TicketFormData): Record<string, string> => {
        const errs: Record<string, string> = {};
        const subject = f.subject.trim();
        const desc = f.description.trim();
        if (!subject) errs.subject = "Subject is required.";
        else if (subject.length < SUBJECT_MIN) errs.subject = `Subject must be at least ${SUBJECT_MIN} characters.`;
        else if (subject.length > SUBJECT_MAX) errs.subject = `Subject must be under ${SUBJECT_MAX} characters.`;
        if (!desc) errs.description = "Description is required.";
        else if (desc.length < DESC_MIN) errs.description = `Description must be at least ${DESC_MIN} characters.`;
        else if (desc.length > DESC_MAX) errs.description = `Description must be under ${DESC_MAX} characters.`;
        if (!f.category) errs.category = "Select a category.";
        if (!["Low", "Medium", "High", "Urgent"].includes(f.priority)) errs.priority = "Invalid priority.";
        return errs;
    };

    const handleCreateTicket = async (asDraft: boolean) => {
        if (asDraft) {
            if (!createForm.subject.trim() || createForm.subject.trim().length < SUBJECT_MIN) {
                setCreateErrors({ subject: `Drafts need a subject of at least ${SUBJECT_MIN} characters.` });
                return;
            }
            // Drafts are local only (backend doesn't support draft status on creation)
            addTicket({
                subject: createForm.subject.trim(),
                description: createForm.description.trim(),
                category: createForm.category,
                subCategory: "General",
                priority: createForm.priority,
                status: "Pending Employee",
                requestedBy: CURRENT_USER,
                slaDeadline: new Date(Date.now() + 96 * 3600000).toISOString(),
                slaStatus: "Healthy",
                attachments: createForm.attachments
            });
            toast({ title: "Draft Saved", description: "Draft stored locally. Submit when ready." });
            setIsCreateDialogOpen(false);
            setCreateForm(defaultForm);
            setCreateErrors({});
            return;
        }

        const errs = validateForm(createForm);
        setCreateErrors(errs);
        if (Object.keys(errs).length) {
            toast({ title: "Please fix the errors", description: Object.values(errs)[0], variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            if (backendAvailable !== false) {
                await helpdeskApi.createTicket({
                    subject: createForm.subject.trim(),
                    description: createForm.description.trim(),
                    category: createForm.category,
                    priority: createForm.priority,
                    tags: []
                });
                await refetchMyTickets();
                toast({ title: "Ticket Raised", description: "Submitted successfully." });
            } else {
                throw new Error("Backend unavailable");
            }
        } catch (err: any) {
            // Fallback to local store
            const slaHours = createForm.priority === "Urgent" ? 4 : createForm.priority === "High" ? 24 : createForm.priority === "Medium" ? 48 : 96;
            addTicket({
                subject: createForm.subject.trim(),
                description: createForm.description.trim(),
                category: createForm.category,
                subCategory: "General",
                priority: createForm.priority,
                status: "Open",
                requestedBy: CURRENT_USER,
                slaDeadline: new Date(Date.now() + slaHours * 3600000).toISOString(),
                slaStatus: "Healthy",
                attachments: createForm.attachments
            });
            toast({ title: "Ticket Raised (Offline)", description: err?.response?.data?.message || "Saved locally — backend unavailable.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
            setIsCreateDialogOpen(false);
            setCreateForm(defaultForm);
            setCreateErrors({});
        }
    };

    const openEditDialog = (ticket: TicketType) => {
        setEditForm({
            id: ticket.id,
            subject: ticket.subject,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
            status: ticket.status,
            attachments: [...ticket.attachments]
        });
        setEditErrors({});
        setIsEditDialogOpen(true);
    };

    const handleUpdateTicket = () => {
        if (!editForm.id) return;
        const errs = validateForm(editForm);
        setEditErrors(errs);
        if (Object.keys(errs).length) {
            toast({ title: "Please fix the errors", description: Object.values(errs)[0], variant: "destructive" });
            return;
        }
        // Backend update only supports status, so non-status edits are local only
        updateTicket(editForm.id, {
            subject: editForm.subject.trim(),
            description: editForm.description.trim(),
            category: editForm.category,
            priority: editForm.priority,
            attachments: editForm.attachments
        }, "Ticket details edited");
        // Mirror into apiTickets if present
        if (apiTickets !== null) {
            setApiTickets(prev => prev ? prev.map(t => t.id === editForm.id ? {
                ...t,
                subject: editForm.subject.trim(),
                description: editForm.description.trim(),
                category: editForm.category,
                priority: editForm.priority,
                attachments: editForm.attachments,
                updatedAt: new Date().toISOString()
            } : t) : prev);
        }
        toast({ title: "Ticket Updated", description: "Changes saved (backend currently syncs status only)." });
        setIsEditDialogOpen(false);
    };

    const syncStatusChange = async (id: string, newStatus: TicketType["status"], actionLabel: string) => {
        updateTicket(id, { status: newStatus }, actionLabel);
        if (apiTickets !== null) {
            setApiTickets(prev => prev ? prev.map(t => t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t) : prev);
        }
        if (backendAvailable !== false) {
            try {
                await helpdeskApi.updateStatus(id, newStatus);
            } catch (err: any) {
                toast({ title: "Sync Warning", description: err?.response?.data?.message || "Status saved locally but backend sync failed.", variant: "destructive" });
            }
        }
    };

    const handleDeleteTicket = async (ticket: TicketType) => {
        deleteTicket(ticket.id);
        if (apiTickets !== null) setApiTickets(prev => prev ? prev.filter(t => t.id !== ticket.id) : prev);
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

    const handleSendReply = () => {
        if (!replyMessage.trim() || !liveSelectedTicket) {
            toast({ title: "Empty Message", description: "Type a message before sending.", variant: "destructive" });
            return;
        }
        addResponse(liveSelectedTicket.id, {
            author: CURRENT_USER.name,
            authorRole: "Employee",
            content: replyMessage.trim(),
            isInternal: false
        });
        setReplyMessage("");
        toast({ title: "Update Sent", description: "Your message has been added to the thread." });
    };

    const handleReopenTicket = async () => {
        if (!liveSelectedTicket) return;
        await syncStatusChange(liveSelectedTicket.id, "Reopened", "Ticket reopened by employee");
        toast({ title: "Ticket Reopened", description: "Your ticket is active again." });
    };

    const handleMarkResolved = async () => {
        if (!liveSelectedTicket) return;
        await syncStatusChange(liveSelectedTicket.id, "Resolved", "Marked as resolved");
        toast({ title: "Marked Resolved", description: "Thank you for confirming." });
    };

    const handleCreateFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCreateForm(prev => ({ ...prev, attachments: [...prev.attachments, file.name] }));
            toast({ title: "File Attached", description: `${file.name} ready to upload.` });
        }
        e.target.value = "";
    };

    const handleReplyFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && liveSelectedTicket) {
            updateTicket(liveSelectedTicket.id, {
                attachments: [...liveSelectedTicket.attachments, file.name]
            }, `Attached ${file.name}`);
            toast({ title: "File Attached", description: `${file.name} added to ticket.` });
        }
        e.target.value = "";
    };

    const getStatusColor = (status: TicketType["status"]) => {
        switch (status) {
            case "Open": return "bg-indigo-50 text-indigo-600";
            case "In Progress": return "bg-amber-50 text-amber-600";
            case "Pending Employee": return "bg-slate-100 text-slate-600";
            case "Escalated": return "bg-rose-50 text-rose-600";
            case "Resolved": return "bg-emerald-50 text-emerald-600";
            case "Closed": return "bg-slate-50 text-slate-500";
            case "Reopened": return "bg-indigo-100 text-indigo-700";
            default: return "bg-rose-50 text-rose-600";
        }
    };

    const stats = {
        total: myRaisedTickets.length,
        open: myRaisedTickets.filter(t => t.status === "Open" || t.status === "In Progress").length,
        resolved: myRaisedTickets.filter(t => t.status === "Resolved" || t.status === "Closed").length
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Ticket size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-2">
                                Personal Requests
                                {isLoading && <span className="text-[10px] font-bold text-indigo-500 animate-pulse">Syncing...</span>}
                                {backendAvailable === false && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Offline</span>}
                                {backendAvailable === true && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>}
                            </h1>
                            <p className="text-sm font-medium text-slate-500">Track and manage your raised tickets</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-5 border-r pr-6 border-slate-100">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</span>
                                <span className="text-lg font-bold text-slate-900 leading-none">{stats.total}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active</span>
                                <span className="text-lg font-bold text-amber-600 leading-none">{stats.open}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Closed</span>
                                <span className="text-lg font-bold text-emerald-600 leading-none">{stats.resolved}</span>
                            </div>
                        </div>
                        <Button onClick={() => { setCreateForm(defaultForm); setIsCreateDialogOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 px-6 font-bold gap-2 shadow-sm transition-all">
                            <Plus size={16} /> New Ticket
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
                {/* Control Bar */}
                <div className="flex flex-wrap items-center justify-between bg-white p-2 border border-slate-200 rounded-xl shadow-sm gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0">
                        {(["All", "Open", "In Progress", "Resolved", "Closed"] as const).map((tab) => (
                            <Button
                                key={tab}
                                variant={activeTab === tab ? "default" : "ghost"}
                                className={`h-8 rounded-lg px-4 text-xs font-bold uppercase tracking-wider ${activeTab === tab ? "bg-slate-900 text-white" : "text-slate-500"}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 pr-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-slate-400 border-slate-200">
                                    <Filter size={13} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-60 p-4 rounded-2xl space-y-3">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</Label>
                                <Select value={filterPriority} onValueChange={setFilterPriority}>
                                    <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" className="w-full h-8 text-xs" onClick={() => { setFilterPriority("all"); toast({ title: "Reset" }); }}>Reset</Button>
                            </PopoverContent>
                        </Popover>
                        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} className="h-7 w-7 rounded-md"><LayoutGrid size={13} /></Button>
                            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')} className="h-7 w-7 rounded-md"><LayoutList size={13} /></Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                            <Input
                                placeholder="Search my tickets..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="h-8 pl-9 pr-4 w-44 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus-visible:ring-1 focus-visible:ring-indigo-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Tickets Grid/List */}
                <ScrollArea className="flex-1">
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8" : "flex flex-col gap-3 pb-8"}>
                        <AnimatePresence mode="popLayout">
                            {filteredTickets.map((ticket) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => { setSelectedTicket(ticket); setIsDetailSheetOpen(true); }}
                                    className="cursor-pointer"
                                >
                                    <Card className={`group relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all border-l-4 ${ticket.priority === 'Urgent' ? 'border-l-rose-600' :
                                        ticket.priority === 'High' ? 'border-l-rose-500' :
                                            ticket.priority === 'Medium' ? 'border-l-amber-400' : 'border-l-indigo-400'}`}>
                                        <CardContent className="p-5 flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] font-bold border-slate-100 text-slate-400 uppercase tracking-tighter px-1.5 h-4.5">{ticket.id}</Badge>
                                                        <Badge className={`${getStatusColor(ticket.status)} border-none text-[9px] font-bold px-1.5 h-4.5 uppercase tracking-wider`}>{ticket.status}</Badge>
                                                    </div>
                                                    <h3 className="text-[14px] font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase mt-1.5">{ticket.subject}</h3>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-600">
                                                            <MoreHorizontal size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => openEditDialog(ticket)}>
                                                            <Pencil size={13} /> Edit
                                                        </DropdownMenuItem>
                                                        {ticket.status === "Closed" && (
                                                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={async () => { await syncStatusChange(ticket.id, "Reopened", "Reopened"); toast({ title: "Reopened" }); }}>
                                                                <RotateCcw size={13} /> Reopen
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer gap-2 text-rose-500" onClick={() => setDeleteTarget(ticket)}>
                                                            <Trash2 size={13} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <p className="text-[12px] font-medium text-slate-500 line-clamp-2 leading-relaxed">{ticket.description}</p>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <div className="flex items-center gap-4 text-slate-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Tag size={12} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{ticket.category}</span>
                                                    </div>
                                                    {ticket.responses.length > 0 && (
                                                        <div className="flex items-center gap-1.5 text-indigo-500">
                                                            <MessageSquare size={12} />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">{ticket.responses.length}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                                                    View Details <ChevronRight size={12} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredTickets.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 italic text-slate-400 col-span-full">
                                <Inbox size={48} className="mb-4 opacity-10" />
                                <p className="text-sm font-bold">No requests found matching the criteria.</p>
                                <Button variant="ghost" size="sm" className="mt-4 text-indigo-600" onClick={() => { setCreateForm(defaultForm); setIsCreateDialogOpen(true); }}>Raise a new ticket</Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Create Ticket Side Sheet */}
            <SideFormSheet
                open={isCreateDialogOpen}
                onOpenChange={(o) => { setIsCreateDialogOpen(o); if (!o) { setCreateForm(defaultForm); setCreateErrors({}); } }}
                title="Raise Support Request"
                description="Describe your issue for priority resolution"
                icon={<Plus size={20} />}
                accentColor="#4f46e5"
                width="lg"
                loading={isSubmitting}
                onSubmit={(e) => { e.preventDefault(); handleCreateTicket(false); }}
                footer={
                    <>
                        <Button type="button" variant="ghost" disabled={isSubmitting} onClick={() => { setIsCreateDialogOpen(false); setCreateForm(defaultForm); setCreateErrors({}); }} className="h-10 px-5 font-bold text-slate-400 text-xs uppercase tracking-widest">Discard</Button>
                        <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => handleCreateTicket(true)} className="h-10 px-5 font-bold text-xs uppercase tracking-widest gap-2"><Save size={14} /> Save Draft</Button>
                        <Button type="button" disabled={isSubmitting} onClick={() => handleCreateTicket(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 px-6 font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 gap-2 disabled:opacity-50">
                            <Send size={14} /> {isSubmitting ? "Raising..." : "Raise Ticket"}
                        </Button>
                    </>
                }
            >
                <div className="space-y-5">
                    {backendAvailable === false && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-700">
                            Offline mode — backend unavailable. Ticket will be saved locally.
                        </div>
                    )}
                    <Field
                        label="Subject Headline"
                        required
                        error={createErrors.subject || undefined}
                        hint={`${createForm.subject.length}/${SUBJECT_MAX}`}
                    >
                        <Input
                            placeholder="e.g. Printer not mapping in HR Cabin 04"
                            value={createForm.subject}
                            onChange={e => { setCreateForm({ ...createForm, subject: e.target.value }); if (createErrors.subject) setCreateErrors({ ...createErrors, subject: "" }); }}
                            maxLength={SUBJECT_MAX + 20}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category">
                            <Select value={createForm.category} onValueChange={v => setCreateForm({ ...createForm, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Urgency">
                            <Select value={createForm.priority} onValueChange={v => setCreateForm({ ...createForm, priority: v as any })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low - Not Urgent</SelectItem>
                                    <SelectItem value="Medium">Medium - Regular</SelectItem>
                                    <SelectItem value="High">High - Important</SelectItem>
                                    <SelectItem value="Urgent">Urgent - Work Stopper</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field
                        label="Detailed Description"
                        required
                        error={createErrors.description || undefined}
                        hint={`${createForm.description.length}/${DESC_MAX}`}
                    >
                        <Textarea
                            placeholder="Explain the context and steps to reproduce the issue..."
                            value={createForm.description}
                            onChange={e => { setCreateForm({ ...createForm, description: e.target.value }); if (createErrors.description) setCreateErrors({ ...createErrors, description: "" }); }}
                            maxLength={DESC_MAX + 100}
                            className="min-h-[140px]"
                        />
                    </Field>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-4 bg-indigo-50/30 rounded-xl border border-indigo-50">
                            <div className="h-8 w-8 rounded-lg bg-white border border-indigo-100 flex items-center justify-center text-indigo-600">
                                <Paperclip size={14} />
                            </div>
                            <div className="flex-1">
                                <span className="text-[11px] font-bold text-slate-700 block">Attach Evidence</span>
                                <span className="text-[10px] font-semibold text-slate-400">Screenshots or Log files</span>
                            </div>
                            <Button type="button" variant="ghost" className="h-8 text-[10px] font-bold text-indigo-600 uppercase border border-indigo-100 px-3 bg-white" onClick={() => fileInputRef.current?.click()}>Browse</Button>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".png,.jpg,.jpeg,.pdf,.log,.txt" onChange={handleCreateFileAttach} />
                        </div>
                        {createForm.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {createForm.attachments.map((name, i) => (
                                    <Badge key={i} className="bg-slate-100 text-slate-600 border-slate-200 font-bold text-[10px] h-6 px-2 gap-1.5">
                                        <Paperclip size={10} />
                                        {name}
                                        <X size={11} className="cursor-pointer hover:text-rose-500" onClick={() => setCreateForm({ ...createForm, attachments: createForm.attachments.filter((_, idx) => idx !== i) })} />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SideFormSheet>

            {/* Edit Ticket Side Sheet */}
            <SideFormSheet
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                title="Edit Ticket"
                description="Update your request details"
                icon={<Pencil size={20} />}
                accentColor="#7c3aed"
                width="lg"
                submitLabel="Save Changes"
                onSubmit={(e) => { e.preventDefault(); handleUpdateTicket(); }}
            >
                <div className="space-y-5">
                    <Field
                        label="Subject"
                        required
                        error={editErrors.subject || undefined}
                        hint={`${editForm.subject.length}/${SUBJECT_MAX}`}
                    >
                        <Input
                            value={editForm.subject}
                            onChange={e => { setEditForm({ ...editForm, subject: e.target.value }); if (editErrors.subject) setEditErrors({ ...editErrors, subject: "" }); }}
                            maxLength={SUBJECT_MAX + 20}
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category">
                            <Select value={editForm.category} onValueChange={v => setEditForm({ ...editForm, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Priority">
                            <Select value={editForm.priority} onValueChange={v => setEditForm({ ...editForm, priority: v as any })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <Field
                        label="Description"
                        required
                        error={editErrors.description || undefined}
                        hint={`${editForm.description.length}/${DESC_MAX}`}
                    >
                        <Textarea
                            value={editForm.description}
                            onChange={e => { setEditForm({ ...editForm, description: e.target.value }); if (editErrors.description) setEditErrors({ ...editErrors, description: "" }); }}
                            maxLength={DESC_MAX + 100}
                            className="min-h-[140px]"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Ticket Detail Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-[580px] p-0 border-l border-slate-200 shadow-3xl bg-white flex flex-col overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-8 flex items-center gap-6">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${liveSelectedTicket?.status === 'Resolved' || liveSelectedTicket?.status === 'Closed'
                            ? 'bg-emerald-500 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
                            {liveSelectedTicket?.status === 'Resolved' || liveSelectedTicket?.status === 'Closed' ? <CheckCircle2 size={28} /> : <Ticket size={28} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <SheetTitle className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{liveSelectedTicket?.subject}</SheetTitle>
                                <Badge className={`${getStatusColor(liveSelectedTicket?.status || 'Open')} border-none text-[9px] font-bold h-5 px-2 rounded-full uppercase tracking-wider`}>
                                    {liveSelectedTicket?.status}
                                </Badge>
                            </div>
                            <SheetDescription className="text-xs font-semibold text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-3">
                                REF: #{liveSelectedTicket?.id} • {new Date(liveSelectedTicket?.createdAt || '').toLocaleDateString('en-GB')}
                                {liveSelectedTicket?.slaStatus === 'Breached' && <span className="text-rose-600 flex items-center gap-1"><AlertCircle size={12} /> SLA Breached</span>}
                            </SheetDescription>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-xl" onClick={() => liveSelectedTicket && openEditDialog(liveSelectedTicket)}>
                                <Pencil size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-500 rounded-xl" onClick={() => liveSelectedTicket && setDeleteTarget(liveSelectedTicket)}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-8 space-y-10">
                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <Tag className="text-indigo-400" size={16} />
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">Category</span>
                                        <span className="text-xs font-bold text-slate-700 uppercase">{liveSelectedTicket?.category} / {liveSelectedTicket?.subCategory}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <User className="text-rose-400" size={16} />
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">Assignee</span>
                                        <span className="text-xs font-bold text-slate-700">{liveSelectedTicket?.assignedTo?.name || "Awaiting Assignment"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Bar for employee actions */}
                            {liveSelectedTicket && (liveSelectedTicket.status === "Closed" || liveSelectedTicket.status === "Resolved") && (
                                <div className="flex gap-3">
                                    {liveSelectedTicket.status === "Closed" && (
                                        <Button variant="outline" onClick={handleReopenTicket} className="flex-1 gap-2 h-10 rounded-xl"><RotateCcw size={14} /> Reopen</Button>
                                    )}
                                    {liveSelectedTicket.status === "Resolved" && (
                                        <Button variant="outline" onClick={async () => { if (liveSelectedTicket) { await syncStatusChange(liveSelectedTicket.id, "Closed", "Closed by employee"); toast({ title: "Closed", description: "Ticket marked as closed." }); } }} className="flex-1 gap-2 h-10 rounded-xl bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 size={14} /> Confirm & Close</Button>
                                    )}
                                </div>
                            )}

                            {liveSelectedTicket && liveSelectedTicket.status === "In Progress" && (
                                <Button variant="outline" onClick={handleMarkResolved} className="w-full gap-2 h-10 rounded-xl bg-emerald-50 text-emerald-700 border-emerald-200">
                                    <CheckCircle2 size={14} /> Mark as Resolved
                                </Button>
                            )}

                            <Separator className="opacity-50" />

                            {/* Ticket Description */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} /> Request Body
                                </h4>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                    <p className="text-[13px] font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        "{liveSelectedTicket?.description}"
                                    </p>
                                </div>
                                {liveSelectedTicket && liveSelectedTicket.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {liveSelectedTicket.attachments.map((name, i) => (
                                            <Badge key={i} className="bg-white text-slate-600 border-slate-200 font-bold text-[10px] h-7 px-3 gap-1.5">
                                                <Paperclip size={11} /> {name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Response / Thread View */}
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare size={14} /> Communication Thread
                                </h4>

                                <div className="space-y-4">
                                    {liveSelectedTicket?.responses.filter(r => !r.isInternal).map((res) => (
                                        <div key={res.id} className={`flex flex-col gap-2 ${res.authorRole === 'Agent' ? 'items-start' : 'items-end'}`}>
                                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-xs font-medium leading-relaxed whitespace-pre-wrap ${res.authorRole === 'Agent'
                                                ? 'bg-indigo-50 text-indigo-900 rounded-tl-none border border-indigo-100'
                                                : 'bg-slate-900 text-white rounded-tr-none'
                                                }`}>
                                                {res.content}
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                                {res.author} • {new Date(res.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    ))}
                                    {liveSelectedTicket && liveSelectedTicket.responses.filter(r => !r.isInternal).length === 0 && (
                                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase italic">No responses recorded yet.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Reply Box */}
                                {liveSelectedTicket && liveSelectedTicket.status !== "Closed" && (
                                    <div className="pt-4 space-y-4">
                                        <Textarea
                                            placeholder="Type your follow-up message..."
                                            className="h-24 border-slate-200 rounded-xl p-4 font-medium text-xs leading-relaxed focus-visible:ring-indigo-600"
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                        />
                                        <div className="flex justify-between items-center">
                                            <Button variant="ghost" className="h-9 text-[10px] font-bold text-slate-400 uppercase gap-2" onClick={() => attachFileInputRef.current?.click()}>
                                                <Paperclip size={14} /> Attach Files
                                            </Button>
                                            <input type="file" ref={attachFileInputRef} className="hidden" accept=".png,.jpg,.jpeg,.pdf,.log,.txt" onChange={handleReplyFileAttach} />
                                            <Button
                                                className="h-9 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest gap-2"
                                                onClick={handleSendReply}
                                            >
                                                <Send size={14} /> Send Update
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator className="opacity-50" />

                            {/* History Timeline */}
                            <div className="space-y-6 pb-10">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <History size={14} /> Audit Trail
                                </h4>
                                <div className="space-y-6 relative ml-2">
                                    <div className="absolute left-1.5 top-0 bottom-0 w-px bg-slate-100" />
                                    {liveSelectedTicket?.history.map((h) => (
                                        <div key={h.id} className="relative pl-8">
                                            <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-white border-2 border-slate-200 z-10" />
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-800 leading-none">{h.action}</span>
                                                <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">{h.performedBy} • {new Date(h.timestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete #{deleteTarget?.id}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently removes "{deleteTarget?.subject}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (deleteTarget) {
                                    await handleDeleteTicket(deleteTarget);
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

export default MyTicketsPage;
