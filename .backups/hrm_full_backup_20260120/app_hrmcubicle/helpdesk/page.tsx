"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Ticket,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Monitor,
    Users,
    Building2,
    Wallet,
    ChevronRight,
    Send
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useHelpdeskStore } from "@/shared/data/helpdesk-store";
import { useSearchParams } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const HelpdeskPage = () => {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'dashboard';

    const { toast } = useToast();
    const { tickets, createTicket, updateStatus, addComment } = useHelpdeskStore();

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Sync Tab with URL
    React.useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    // Form State
    const [newTicket, setNewTicket] = useState({
        subject: "",
        category: "",
        priority: "",
        description: ""
    });

    // Mock "Me" -> In real app, get from Auth
    const MY_ID = "EMP001";
    const MY_NAME = "Drashi Garg";

    // Filtering
    const myTickets = useMemo(() => tickets.filter(t => t.requesterId === MY_ID), [tickets]);
    const queueTickets = tickets; // Admin sees all

    // Stats
    const openCount = tickets.filter(t => t.status === 'Open').length;
    const pendingCount = tickets.filter(t => t.status === 'In Progress').length;
    const closedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

    const stats = [
        { label: "Open Tickets", value: openCount, color: "bg-[#CB9DF0]", icon: <AlertCircle className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "In Progress", value: pendingCount, color: "bg-[#F0C1E1]", icon: <Clock className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Resolved", value: closedCount, color: "bg-[#FFF9BF]", icon: <CheckCircle2 className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const handleSubmit = () => {
        if (!newTicket.subject || !newTicket.category || !newTicket.priority) {
            toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }

        createTicket({
            subject: newTicket.subject,
            category: newTicket.category as any,
            priority: newTicket.priority as any,
            description: newTicket.description,
            requesterId: MY_ID,
            requesterName: MY_NAME
        });

        setIsCreateOpen(false);
        setNewTicket({ subject: "", category: "", priority: "", description: "" });
        toast({ title: "Ticket Raised", description: "Support team has been notified." });
        setActiveTab("my_tickets");
    };

    const getCategoryIcon = (cat: string) => {
        if (cat.includes("IT")) return <Monitor size={16} />;
        if (cat.includes("HR")) return <Users size={16} />;
        if (cat.includes("Finance")) return <Wallet size={16} />;
        return <Building2 size={16} />;
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'Critical': return "text-rose-600 bg-rose-50 border-rose-100";
            case 'High': return "text-orange-600 bg-orange-50 border-orange-100";
            case 'Medium': return "text-amber-600 bg-amber-50 border-amber-100";
            default: return "text-emerald-600 bg-emerald-50 border-emerald-100";
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Helpdesk Support</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Raise tickets and track resolutions.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-xl shadow-[#CB9DF0]/30 font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Raise Ticket
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Ticket</DialogTitle>
                            <DialogDescription>Describe your issue for the respective department.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6 py-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Subject</Label>
                                <Input placeholder="Brief title of the issue" value={newTicket.subject} onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })} className="rounded-xl bg-slate-50 border-none h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select onValueChange={v => setNewTicket({ ...newTicket, category: v })}>
                                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                                        <SelectValue placeholder="Select Dept" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IT Support">IT Support</SelectItem>
                                        <SelectItem value="HR Query">HR Query</SelectItem>
                                        <SelectItem value="Admin & Facilities">Admin & Facilities</SelectItem>
                                        <SelectItem value="Finance/Payroll">Finance/Payroll</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select onValueChange={v => setNewTicket({ ...newTicket, priority: v })}>
                                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                                        <SelectValue placeholder="Select Urgency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low (General)</SelectItem>
                                        <SelectItem value="Medium">Medium (Affects Work)</SelectItem>
                                        <SelectItem value="High">High (Urgent)</SelectItem>
                                        <SelectItem value="Critical">Critical (Blocker)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Description</Label>
                                <Textarea placeholder="Detailed explanation..." value={newTicket.description} onChange={e => setNewTicket({ ...newTicket, description: e.target.value })} className="rounded-xl bg-slate-50 border-none min-h-[100px]" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] font-bold h-12 rounded-xl text-white" onClick={handleSubmit}>Submit Request</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4 relative overflow-hidden`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm relative z-10">
                                {stat.icon}
                            </div>
                            <div className="relative z-10">
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                <TabsList className="bg-transparent p-0 gap-6">
                    {["Dashboard", "My Tickets", "Queue"].map((tab) => {
                        const val = tab.toLowerCase().replace(' ', '_');
                        const isActive = activeTab === val;
                        return (
                            <TabsTrigger
                                key={val}
                                value={val}
                                className={`rounded-xl px-6 py-3 font-bold text-sm transition-all shadow-sm ${isActive ? 'bg-[#CB9DF0] text-slate-900 shadow-lg scale-105' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                                {tab}
                            </TabsTrigger>
                        )
                    })}
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-12 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="h-24 w-24 bg-[#F0C1E1] rounded-3xl mx-auto flex items-center justify-center text-white">
                                <MessageSquare size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Welcome to Helpdesk</h2>
                            <p className="text-slate-500 font-medium">
                                Raise tickets for IT, HR, or Admin support. Track status in real-time.
                            </p>
                            <Button className="bg-slate-900 text-white rounded-xl font-bold px-8 h-12" onClick={() => setActiveTab('my_tickets')}>
                                View My Tickets
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="my_tickets" className="space-y-4">
                    {myTickets.length === 0 ? (
                        <div className="text-center p-20 bg-white rounded-[2.5rem] shadow-sm">
                            <p className="text-slate-400 font-bold">You haven't raised any tickets yet.</p>
                        </div>
                    ) : (
                        myTickets.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} readonly={true} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="queue" className="space-y-4">
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                placeholder="Search all tickets..."
                                className="pl-12 h-12 rounded-xl bg-white border-none shadow-sm font-medium"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {queueTickets.filter(t => t.subject.toLowerCase().includes(searchTerm.toLowerCase())).map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} readonly={false} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );

    function TicketCard({ ticket, readonly }: { ticket: any, readonly: boolean }) {
        const priorityColor = getPriorityColor(ticket.priority);
        const [isExpanded, setIsExpanded] = useState(false);
        const [comment, setComment] = useState("");

        const handleAddComment = () => {
            if (!comment) return;
            addComment(ticket.id, comment, readonly ? MY_NAME : "Admin Support"); // Helper logic
            setComment("");
            toast({ title: "Comment Added" });
        };

        const handleStatus = (newStatus: any) => {
            updateStatus(ticket.id, newStatus);
            toast({ title: "Status Updated", description: `Changed to ${newStatus}` });
        }

        return (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${ticket.category.includes('IT') ? 'bg-blue-50 text-blue-500' : 'bg-violet-50 text-violet-500'}`}>
                        {getCategoryIcon(ticket.category)}
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                            <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{ticket.subject}</h3>
                            <Badge className="bg-slate-100 text-slate-500 border-none font-bold uppercase tracking-wider text-[10px]">{ticket.ticketId}</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">{ticket.description}</p>

                        <div className="flex flex-wrap gap-3 mt-4">
                            <Badge variant="outline" className={`border font-bold ${priorityColor}`}>
                                {ticket.priority} Priority
                            </Badge>
                            <Badge variant="outline" className="border-slate-100 text-slate-500 font-bold bg-slate-50">
                                {ticket.category}
                            </Badge>
                            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                <Clock size={12} /> {ticket.createdAt} by {ticket.requesterName}
                            </span>
                        </div>
                    </div>

                    <div className="min-w-[150px] flex flex-col gap-2 items-end">
                        {!readonly ? (
                            <Select defaultValue={ticket.status} onValueChange={handleStatus}>
                                <SelectTrigger className={`h-10 w-40 font-bold border-none rounded-xl ${ticket.status === 'Open' ? 'bg-rose-100 text-rose-700' : ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Badge className={`px-4 py-2 text-sm rounded-xl font-bold ${ticket.status === 'Open' ? 'bg-rose-100 text-rose-700' : ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {ticket.status}
                            </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900" onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? "Hide Details" : "View Details"}
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Discussion Log</h4>
                                {ticket.comments.length === 0 && <p className="text-sm text-slate-400 italic">No comments yet.</p>}
                                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                    {ticket.comments.map((c: any) => (
                                        <div key={c.id} className="bg-slate-50 p-4 rounded-xl text-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-slate-900">{c.authorName}</span>
                                                <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-slate-600">{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Type a response..." className="rounded-xl border-none bg-slate-50 h-10 font-medium" value={comment} onChange={e => setComment(e.target.value)} />
                                    <Button size="icon" className="rounded-xl bg-slate-900 text-white" onClick={handleAddComment}>
                                        <Send size={16} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }
};

export default HelpdeskPage;
