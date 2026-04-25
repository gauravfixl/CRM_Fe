"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Ticket,
    Plus,
    Clock,
    CheckCircle2,
    MessageSquare,
    User,
    Filter,
    Users,
    Laptop,
    IndianRupee,
    Settings as SettingsIcon,
    HelpCircle,
    Send,
    Trash2,
    MoreVertical,
    X,
    Paperclip,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { useToast } from "@/shared/components/ui/use-toast";

type Message = { id: number; author: string; role: "user" | "agent"; body: string; at: string };
type Ticket = {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    created: string;
    assignee: string;
    messages: Message[];
};

const initialTickets: Ticket[] = [
    { id: "TKT-0012", title: "Unable to access payroll portal", description: "Getting a 403 Forbidden when I try to log into payroll. Reset password didn't help.", category: "IT", priority: "High", status: "In Progress", created: "2026-04-18", assignee: "IT Support",
        messages: [
            { id: 1, author: "You", role: "user", body: "Getting a 403 Forbidden when I try to log into payroll. Reset password didn't help.", at: "2026-04-18 10:12" },
            { id: 2, author: "IT Support", role: "agent", body: "Thanks for reaching out. Can you share a screenshot of the error?", at: "2026-04-18 10:40" },
            { id: 3, author: "You", role: "user", body: "Attached. It happens right after login.", at: "2026-04-18 11:05" },
        ]
    },
    { id: "TKT-0011", title: "Correction in March payslip", description: "March LTA reimbursement is showing ₹0, should be ₹8500.", category: "Payroll", priority: "High", status: "Open", created: "2026-04-17", assignee: "Payroll Team",
        messages: [{ id: 1, author: "You", role: "user", body: "March LTA reimbursement is showing ₹0, should be ₹8500 based on claim #EXP-234.", at: "2026-04-17 16:22" }]
    },
    { id: "TKT-0010", title: "Request for laptop upgrade", description: "Current machine runs out of RAM during builds. Need 32GB.", category: "IT", priority: "Medium", status: "Resolved", created: "2026-04-12", assignee: "IT Admin",
        messages: [
            { id: 1, author: "You", role: "user", body: "Current machine runs out of RAM during builds. Need 32GB.", at: "2026-04-12 09:00" },
            { id: 2, author: "IT Admin", role: "agent", body: "Approved. New MacBook Pro M3 will ship by Friday.", at: "2026-04-12 15:30" },
        ]
    },
    { id: "TKT-0009", title: "Update emergency contact", description: "Need to update emergency contact number.", category: "HR", priority: "Low", status: "Resolved", created: "2026-04-08", assignee: "HR Ops", messages: [] },
    { id: "TKT-0008", title: "Leave balance discrepancy", description: "Casual leave balance is off by 2 days.", category: "HR", priority: "Medium", status: "Closed", created: "2026-03-28", assignee: "HR Ops", messages: [] },
    { id: "TKT-0007", title: "VPN not connecting from home", description: "OpenVPN times out from home network.", category: "IT", priority: "High", status: "Resolved", created: "2026-03-22", assignee: "IT Support", messages: [] },
];

const statusColors: Record<string, string> = {
    Open: "bg-amber-50 text-amber-700 border-amber-200",
    "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const priorityColors: Record<string, string> = {
    High: "bg-rose-50 text-rose-700 border-rose-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
};

const categoryIcons: Record<string, any> = {
    HR: Users,
    IT: Laptop,
    Payroll: IndianRupee,
    Admin: SettingsIcon,
    Other: HelpCircle,
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

export default function MyHelpdeskPage() {
    const { toast } = useToast();
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [newOpen, setNewOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState<Ticket | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Ticket | null>(null);
    const [filter, setFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [form, setForm] = useState({ title: "", category: "HR", priority: "Medium", description: "" });
    const [reply, setReply] = useState("");

    const filtered = tickets.filter(t =>
        (filter === "all" || t.status === filter) &&
        (categoryFilter === "all" || t.category === categoryFilter)
    );

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === "Open" || t.status === "In Progress").length,
        resolved: tickets.filter(t => t.status === "Resolved").length,
        avgResponse: "2.4h",
    };

    const handleCreate = () => {
        const title = form.title.trim();
        const description = form.description.trim();
        if (!title || !description) {
            toast({ title: "Missing fields", description: "Title and description are required.", variant: "destructive" });
            return;
        }
        if (title.length < 5 || title.length > 200) {
            toast({ title: "Invalid title", description: "Title must be 5-200 characters.", variant: "destructive" });
            return;
        }
        if (description.length < 20 || description.length > 2000) {
            toast({ title: "Invalid description", description: "Description must be 20-2000 characters for proper support.", variant: "destructive" });
            return;
        }
        const newId = `TKT-${String(tickets.length + 13).padStart(4, "0")}`;
        const newT: Ticket = {
            id: newId,
            title: form.title,
            description: form.description,
            category: form.category,
            priority: form.priority,
            status: "Open",
            created: new Date().toISOString().split("T")[0],
            assignee: `${form.category} Team`,
            messages: [{ id: 1, author: "You", role: "user", body: form.description, at: new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) }],
        };
        setTickets([newT, ...tickets]);
        setForm({ title: "", category: "HR", priority: "Medium", description: "" });
        setNewOpen(false);
        toast({ title: "Ticket raised", description: `${newId} has been assigned to ${form.category} Team.` });
    };

    const sendReply = () => {
        if (!detailOpen) return;
        const msg = reply.trim();
        if (!msg) return;
        if (msg.length < 5) {
            toast({ title: "Reply too short", description: "Please write at least 5 characters.", variant: "destructive" });
            return;
        }
        if (msg.length > 2000) {
            toast({ title: "Reply too long", description: "Please keep reply under 2000 characters.", variant: "destructive" });
            return;
        }
        const updated: Ticket = {
            ...detailOpen,
            messages: [...detailOpen.messages, {
                id: detailOpen.messages.length + 1,
                author: "You",
                role: "user",
                body: reply,
                at: new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }),
            }],
        };
        setTickets(tickets.map(t => t.id === detailOpen.id ? updated : t));
        setDetailOpen(updated);
        setReply("");
        toast({ title: "Reply sent", description: "Your message has been posted to the ticket thread." });
    };

    const changeStatus = (newStatus: string) => {
        if (!detailOpen) return;
        const updated = { ...detailOpen, status: newStatus };
        setTickets(tickets.map(t => t.id === detailOpen.id ? updated : t));
        setDetailOpen(updated);
        toast({ title: "Status updated", description: `Ticket marked as ${newStatus}.` });
    };

    const changePriority = (newPriority: string) => {
        if (!detailOpen) return;
        const updated = { ...detailOpen, priority: newPriority };
        setTickets(tickets.map(t => t.id === detailOpen.id ? updated : t));
        setDetailOpen(updated);
        toast({ title: "Priority updated", description: `Priority set to ${newPriority}.` });
    };

    const deleteTicket = () => {
        if (!deleteConfirm) return;
        setTickets(tickets.filter(t => t.id !== deleteConfirm.id));
        toast({ title: "Ticket deleted", description: `${deleteConfirm.id} has been removed.` });
        if (detailOpen?.id === deleteConfirm.id) setDetailOpen(null);
        setDeleteConfirm(null);
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Helpdesk</h1>
                        <p className="text-sm text-slate-500 mt-1">Raise and track support tickets</p>
                    </div>
                    <Button onClick={() => setNewOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100">
                        <Plus size={16} className="mr-2" /> Raise Ticket
                    </Button>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Tickets", value: stats.total, icon: Ticket, color: "indigo" },
                        { label: "Open / In Progress", value: stats.open, icon: Clock, color: "amber" },
                        { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "emerald" },
                        { label: "Avg Response", value: stats.avgResponse, icon: MessageSquare, color: "blue" },
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 flex items-center justify-center`}>
                                        <s.icon className={`text-${s.color}-600`} size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                        <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
                        <CardTitle className="text-lg">My Tickets</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter size={14} className="text-slate-400" />
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[140px] h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.keys(categoryIcons).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[140px] h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {filtered.map(t => {
                                const CatIcon = categoryIcons[t.category] || HelpCircle;
                                return (
                                    <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => setDetailOpen(t)}>
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                                <CatIcon className="text-indigo-600" size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[11px] font-bold text-indigo-600">{t.id}</span>
                                                    <Badge className={`${priorityColors[t.priority]} border text-[9px] font-semibold`}>{t.priority}</Badge>
                                                </div>
                                                <p className="font-semibold text-slate-900 truncate mt-0.5 group-hover:text-indigo-600 transition-all">{t.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                                                    <span className="flex items-center gap-1"><User size={10} /> {t.assignee}</span>
                                                    <span className="flex items-center gap-1"><MessageSquare size={10} /> {t.messages.length} msg</span>
                                                    <span>Created {new Date(t.created).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                            <Badge className={`${statusColors[t.status]} border text-[10px] font-semibold`}>{t.status}</Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" onClick={e => e.stopPropagation()} className="h-7 w-7 p-0 rounded-lg"><MoreVertical size={14} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40" onClick={e => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => setDetailOpen(t)}><MessageSquare size={13} className="mr-2" />View Thread</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setDeleteConfirm(t)} className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"><Trash2 size={13} className="mr-2" />Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                );
                            })}
                            {filtered.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <Ticket size={40} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No tickets match this filter</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <SideFormSheet
                open={newOpen}
                onOpenChange={setNewOpen}
                title="Raise New Ticket"
                description="Describe your issue and we'll route it to the right team."
                icon={<Ticket size={20} />}
                accentColor="#4f46e5"
                width="md"
                submitLabel="Submit Ticket"
                onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
            >
                <div className="space-y-4">
                    <Field label="Subject" required hint={`${form.title.length}/200 chars · 5-200`}>
                        <Input maxLength={200} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Cannot access HR portal" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category">
                            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(categoryIcons).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Priority">
                            <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <Field label="Description" required hint={`${form.description.length}/2000 chars · 20-2000`}>
                        <Textarea rows={5} maxLength={2000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Provide as much detail as possible..." />
                    </Field>
                </div>
            </SideFormSheet>

            <Dialog open={!!detailOpen} onOpenChange={v => !v && setDetailOpen(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-0 max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                    {detailOpen && (
                        <>
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <span className="text-xs font-bold text-indigo-600">{detailOpen.id}</span>
                                            <Badge className={`${priorityColors[detailOpen.priority]} border text-[10px] font-semibold`}>{detailOpen.priority}</Badge>
                                            <Badge className={`${statusColors[detailOpen.status]} border text-[10px] font-semibold`}>{detailOpen.status}</Badge>
                                            <Badge className="bg-slate-100 text-slate-600 border-none text-[10px]">{detailOpen.category}</Badge>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900">{detailOpen.title}</h2>
                                        <p className="text-xs text-slate-500 mt-1">Assigned to {detailOpen.assignee} · Created {new Date(detailOpen.created).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => setDetailOpen(null)} className="h-8 w-8 p-0"><X size={16} /></Button>
                                </div>
                                <div className="flex items-center gap-2 mt-4 flex-wrap">
                                    <Select value={detailOpen.status} onValueChange={changeStatus}>
                                        <SelectTrigger className="w-[150px] h-8 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={detailOpen.priority} onValueChange={changePriority}>
                                        <SelectTrigger className="w-[130px] h-8 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                                {detailOpen.messages.length === 0 && (
                                    <div className="text-center py-8 text-slate-400">
                                        <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
                                        <p className="text-sm">No messages yet</p>
                                    </div>
                                )}
                                {detailOpen.messages.map(m => (
                                    <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-indigo-100" : "bg-emerald-100"}`}>
                                            <User size={15} className={m.role === "user" ? "text-indigo-700" : "text-emerald-700"} />
                                        </div>
                                        <div className={`max-w-[75%] ${m.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-slate-700">{m.author}</span>
                                                <span className="text-[10px] text-slate-400">{m.at}</span>
                                            </div>
                                            <div className={`rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-900 rounded-tl-sm"}`}>
                                                {m.body}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {detailOpen.status !== "Closed" && detailOpen.status !== "Resolved" && (
                                <div className="p-4 border-t border-slate-100 bg-white">
                                    <div className="flex items-end gap-2">
                                        <Button size="sm" variant="ghost" className="h-10 w-10 p-0 shrink-0"><Paperclip size={15} /></Button>
                                        <Textarea rows={2} value={reply} onChange={e => setReply(e.target.value)} placeholder="Type a reply..." className="flex-1 resize-none" />
                                        <Button onClick={sendReply} disabled={!reply.trim()} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-10 px-4 shrink-0"><Send size={14} className="mr-1" />Send</Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteConfirm} onOpenChange={v => !v && setDeleteConfirm(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-md">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center">
                            <Trash2 className="text-rose-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold">Delete Ticket?</DialogTitle>
                        <DialogDescription>
                            {deleteConfirm?.id} · "{deleteConfirm?.title}" will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-2">
                        <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                        <Button onClick={deleteTicket} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
