"use client"

import React, { useState } from "react";
import {
    Ticket,
    Plus,
    Search,
    Filter,
    ChevronRight,
    Clock,
    MessageSquare,
    Paperclip,
    ArrowUpRight,
    LayoutGrid,
    LayoutList,
    MoreHorizontal,
    Trash2,
    Calendar,
    Send,
    User,
    Tag,
    History,
    FileText,
    CheckCircle2,
    Inbox,
    AlertCircle,
    RotateCcw
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { useHelpdeskStore, type Ticket as TicketType } from "@/shared/data/helpdesk-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const MyTicketsPage = () => {
    const { tickets, addTicket, deleteTicket } = useHelpdeskStore();
    const { toast } = useToast();

    // Filters & UI State
    const [activeTab, setActiveTab] = useState<"All" | "Open" | "Resolved" | "Closed">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<TicketType>>({
        subject: "",
        content: "", // This will be mapped to description
        category: "HR Ops",
        priority: "Medium",
        requestedBy: { id: "HR-ADM-01", name: "HR Admin (You)", department: "HR Admin" }
    });

    const handleCreateTicket = () => {
        if (!formData.subject || (!formData as any).content) {
            toast({ title: "Incomplete Details", description: "Subject and description are mandatory.", variant: "destructive" });
            return;
        }
        addTicket({
            ...formData,
            description: (formData as any).content,
            subCategory: "General",
            status: "Open",
            slaDeadline: new Date(Date.now() + 86400000).toISOString(), // +24h
            slaStatus: "Healthy",
            attachments: []
        } as any);
        toast({ title: "Ticket Raised", description: "You will receive updates on resolution." });
        setIsCreateDialogOpen(false);
        setFormData({ subject: "", category: "HR Ops", priority: "Medium", requestedBy: { id: "HR-ADM-01", name: "HR Admin (You)", department: "HR Admin" } } as any);
    };

    const myRaisedTickets = tickets.filter(t => t.requestedBy.id === "HR-ADM-01" || t.requestedBy.name.includes("HR Admin"));
    const filteredTickets = myRaisedTickets.filter(t => {
        const matchesTab = activeTab === "All" || t.status === activeTab;
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status: TicketType["status"]) => {
        switch (status) {
            case "Open": return "bg-indigo-50 text-indigo-600";
            case "In Progress": return "bg-amber-50 text-amber-600";
            case "Resolved": return "bg-emerald-50 text-emerald-600";
            case "Closed": return "bg-slate-50 text-slate-500";
            default: return "bg-rose-50 text-rose-600";
        }
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
                            <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">Personal Requests</h1>
                            <p className="text-sm font-medium text-slate-500">Track and manage your raised tickets</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end border-r pr-6 border-slate-100">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tickets Raised</span>
                            <span className="text-lg font-bold text-slate-900">{myRaisedTickets.length} Total</span>
                        </div>
                        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 px-6 font-bold gap-2 shadow-sm transition-all">
                            <Plus size={16} /> New Ticket
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
                {/* Control Bar */}
                <div className="flex flex-wrap items-center justify-between bg-white p-2 border border-slate-200 rounded-xl shadow-sm gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0">
                        {["All", "Open", "Resolved", "Closed"].map((tab) => (
                            <Button
                                key={tab}
                                variant={activeTab === tab ? "default" : "ghost"}
                                className={`h-8 rounded-lg px-4 text-xs font-bold uppercase tracking-wider ${activeTab === tab ? "bg-slate-900 text-white" : "text-slate-500"}`}
                                onClick={() => setActiveTab(tab as any)}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 pr-1">
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
                                className="h-8 pl-9 pr-4 w-44 bg-slate-50 border-none rounded-lg text-xs font-medium focus-visible:ring-1 focus-visible:ring-indigo-100"
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
                                    <Card className={`group relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all border-l-4 ${ticket.priority === 'High' ? 'border-l-rose-500' : ticket.priority === 'Medium' ? 'border-l-amber-400' : 'border-l-indigo-400'
                                        }`}>
                                        <CardContent className="p-5 flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] font-bold border-slate-100 text-slate-400 uppercase tracking-tighter px-1.5 h-4.5">{ticket.id}</Badge>
                                                        <Badge className={`${getStatusColor(ticket.status)} border-none text-[9px] font-bold px-1.5 h-4.5 uppercase tracking-wider`}>{ticket.status}</Badge>
                                                    </div>
                                                    <h3 className="text-[14px] font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase mt-1.5">{ticket.subject}</h3>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-600"><MoreHorizontal size={14} /></Button>
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
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 italic text-slate-400">
                                <Inbox size={48} className="mb-4 opacity-10" />
                                <p className="text-sm font-bold">No requests found matching the criteria.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Create Ticket Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-2xl shadow-3xl bg-white">
                    <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                            <Plus size={20} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900 leading-none">Raise Support Request</DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Describe your issue for priority resolution</DialogDescription>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Subject Headline</Label>
                            <Input
                                placeholder="e.g. Printer not mapping in HR Cabin 04"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className="h-12 border-slate-200 rounded-xl px-4 font-bold text-slate-900 bg-slate-50/50 shadow-sm focus-visible:ring-indigo-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Category</Label>
                                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                                    <SelectTrigger className="h-11 border-slate-200 rounded-xl font-bold bg-white shadow-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IT Support">IT Support</SelectItem>
                                        <SelectItem value="Payroll">Payroll / Finance</SelectItem>
                                        <SelectItem value="Facility">Facility / Admin</SelectItem>
                                        <SelectItem value="HR Ops">HR Operations</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Urgency</Label>
                                <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v as any })}>
                                    <SelectTrigger className="h-11 border-slate-200 rounded-xl font-bold bg-white shadow-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low - Not Urgent</SelectItem>
                                        <SelectItem value="Medium">Medium - Regular</SelectItem>
                                        <SelectItem value="High">High - Important</SelectItem>
                                        <SelectItem value="Urgent">Urgent - Work Stopper</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Detailed Description</Label>
                            <Textarea
                                placeholder="Explain the context and steps to reproduce the issue..."
                                value={(formData as any).content}
                                onChange={e => setFormData({ ...formData, content: e.target.value } as any)}
                                className="min-h-[140px] border-slate-200 rounded-2xl p-4 font-medium text-sm leading-relaxed focus-visible:ring-indigo-600 bg-slate-50/20"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-indigo-50/30 rounded-xl border border-indigo-50">
                            <div className="h-8 w-8 rounded-lg bg-white border border-indigo-100 flex items-center justify-center text-indigo-600">
                                <Paperclip size={14} />
                            </div>
                            <div className="flex-1">
                                <span className="text-[11px] font-bold text-slate-700 block">Attach Evidence</span>
                                <span className="text-[10px] font-semibold text-slate-400">Screenshots or Log files (Max 5MB)</span>
                            </div>
                            <Button variant="ghost" className="h-8 text-[10px] font-bold text-indigo-600 uppercase border border-indigo-100 px-3 bg-white">Browse</Button>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-11 px-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Discard</Button>
                        <Button onClick={handleCreateTicket} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-10 font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 gap-2">
                            <Send size={16} /> Raise Ticket
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ticket Detail Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-[580px] p-0 border-l border-slate-200 shadow-3xl bg-white flex flex-col overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-8 flex items-center gap-6">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${selectedTicket?.status === 'Resolved' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'
                            }`}>
                            {selectedTicket?.status === 'Resolved' ? <CheckCircle2 size={28} /> : <Ticket size={28} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <SheetTitle className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{selectedTicket?.subject}</SheetTitle>
                                <Badge className={`${getStatusColor(selectedTicket?.status || 'Open')} border-none text-[9px] font-bold h-5 px-2 rounded-full uppercase tracking-wider`}>
                                    {selectedTicket?.status}
                                </Badge>
                            </div>
                            <SheetDescription className="text-xs font-semibold text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-3">
                                REF ID: #{selectedTicket?.id} • RAISED ON {new Date(selectedTicket?.createdAt || '').toLocaleDateString('en-GB')}
                                {selectedTicket?.slaStatus === 'Breached' && <span className="text-rose-600 flex items-center gap-1"><AlertCircle size={12} /> SLA Breached</span>}
                            </SheetDescription>
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
                                        <span className="text-xs font-bold text-slate-700 uppercase">{selectedTicket?.category} / {selectedTicket?.subCategory}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <User className="text-rose-400" size={16} />
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none mb-1">Assignee</span>
                                        <span className="text-xs font-bold text-slate-700">{selectedTicket?.assignedTo?.name || "Awaiting Assignment"}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Ticket Description */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} /> Request Body
                                </h4>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                    <p className="text-[13px] font-medium text-slate-700 leading-relaxed">
                                        "{selectedTicket?.description}"
                                    </p>
                                </div>
                            </div>

                            {/* Response / Thread View */}
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare size={14} /> Communication Thread
                                </h4>

                                <div className="space-y-4">
                                    {selectedTicket?.responses.map((res, i) => (
                                        <div key={res.id} className={`flex flex-col gap-2 ${res.authorRole === 'Agent' ? 'items-start' : 'items-end'}`}>
                                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-xs font-medium leading-relaxed ${res.authorRole === 'Agent'
                                                    ? 'bg-indigo-50 text-indigo-900 rounded-tl-none border border-indigo-100'
                                                    : 'bg-slate-900 text-white rounded-tr-none'
                                                }`}>
                                                {res.content}
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                                {res.author} • {new Date(res.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                    {selectedTicket?.responses.length === 0 && (
                                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase italic">No responses recorded yet.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Reply Box */}
                                <div className="pt-4 space-y-4">
                                    <Textarea
                                        placeholder="Type your follow-up message..."
                                        className="h-24 border-slate-200 rounded-xl p-4 font-medium text-xs leading-relaxed focus-visible:ring-indigo-600"
                                    />
                                    <div className="flex justify-between items-center">
                                        <Button variant="ghost" className="h-9 text-[10px] font-bold text-slate-400 uppercase gap-2">
                                            <Paperclip size={14} /> Attach Files
                                        </Button>
                                        <Button className="h-9 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest gap-2">
                                            <Send size={14} /> Send Update
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* History Timeline */}
                            <div className="space-y-6 pb-10">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <History size={14} /> Audit Trail
                                </h4>
                                <div className="space-y-6 relative ml-2">
                                    <div className="absolute left-1.5 top-0 bottom-0 w-px bg-slate-100" />
                                    {selectedTicket?.history.map((h, i) => (
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
        </div>
    );
};

export default MyTicketsPage;
