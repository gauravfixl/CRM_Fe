"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Receipt,
    Plane,
    Car,
    Utensils,
    Hotel,
    Package,
    CheckCircle2,
    Clock,
    XCircle,
    Upload,
    Filter,
    Wallet,
    Edit3,
    Trash2,
    Eye,
    MoreVertical,
    RotateCcw,
    FileText,
    X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { useToast } from "@/shared/components/ui/use-toast";

type Claim = {
    id: number;
    title: string;
    category: string;
    amount: number;
    date: string;
    status: string;
    receipts: number;
    description: string;
    rejectionReason?: string;
};

const initialClaims: Claim[] = [
    { id: 1, title: "Client Meeting — Bangalore", category: "Travel", amount: 8500, date: "2026-04-15", status: "Approved", receipts: 3, description: "Round-trip flight + local taxi for Acme Corp pitch." },
    { id: 2, title: "Team Lunch — Q1 Closing", category: "Food", amount: 4200, date: "2026-04-10", status: "Reimbursed", receipts: 1, description: "Celebration lunch with 8 team members." },
    { id: 3, title: "Uber — Client Site Visit", category: "Transport", amount: 1250, date: "2026-04-08", status: "Pending", receipts: 2, description: "Two trips to client office in Gurgaon." },
    { id: 4, title: "Hotel Stay — Mumbai Conf", category: "Accommodation", amount: 12500, date: "2026-04-02", status: "Approved", receipts: 1, description: "2 nights at partner hotel for HR Tech Summit." },
    { id: 5, title: "Stationery & Supplies", category: "Supplies", amount: 850, date: "2026-03-28", status: "Rejected", receipts: 1, description: "Notebooks and whiteboard markers.", rejectionReason: "Amount exceeds monthly supplies limit of ₹500. Please split or deduct from team budget." },
    { id: 6, title: "Flight — Delhi to Pune", category: "Travel", amount: 6500, date: "2026-03-22", status: "Reimbursed", receipts: 1, description: "Quarterly BR travel." },
];

const categoryIcons: Record<string, any> = {
    Travel: Plane,
    Transport: Car,
    Food: Utensils,
    Accommodation: Hotel,
    Supplies: Package,
};

const statusColors: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-blue-50 text-blue-700 border-blue-200",
    Reimbursed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const statusIcons: Record<string, any> = {
    Pending: Clock,
    Approved: CheckCircle2,
    Reimbursed: Wallet,
    Rejected: XCircle,
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function MyExpensesPage() {
    const { toast } = useToast();
    const [claims, setClaims] = useState<Claim[]>(initialClaims);
    const [formOpen, setFormOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState<Claim | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Claim | null>(null);
    const [editing, setEditing] = useState<Claim | null>(null);
    const [filter, setFilter] = useState("all");
    const [form, setForm] = useState({ title: "", category: "Travel", amount: "", date: "", description: "" });

    const filtered = filter === "all" ? claims : claims.filter(c => c.status === filter);

    const totals = {
        submitted: claims.reduce((a, c) => a + c.amount, 0),
        pending: claims.filter(c => c.status === "Pending").reduce((a, c) => a + c.amount, 0),
        approved: claims.filter(c => c.status === "Approved").reduce((a, c) => a + c.amount, 0),
        reimbursed: claims.filter(c => c.status === "Reimbursed").reduce((a, c) => a + c.amount, 0),
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ title: "", category: "Travel", amount: "", date: "", description: "" });
        setFormOpen(true);
    };

    const openEdit = (c: Claim) => {
        setEditing(c);
        setForm({ title: c.title, category: c.category, amount: String(c.amount), date: c.date, description: c.description });
        setFormOpen(true);
    };

    const openResubmit = (c: Claim) => {
        setEditing({ ...c, status: "Pending" });
        setForm({ title: c.title, category: c.category, amount: String(c.amount), date: c.date, description: c.description });
        setFormOpen(true);
    };

    const handleSave = () => {
        const title = form.title.trim();
        if (!title || !form.amount || !form.date) {
            toast({ title: "Missing fields", description: "Please fill title, amount and date.", variant: "destructive" });
            return;
        }
        if (title.length > 200) {
            toast({ title: "Title too long", description: "Title cannot exceed 200 characters.", variant: "destructive" });
            return;
        }
        const amt = Number(form.amount);
        if (Number.isNaN(amt) || amt <= 0) {
            toast({ title: "Invalid amount", description: "Amount must be greater than ₹0.", variant: "destructive" });
            return;
        }
        const MAX_PER_CLAIM = 100000;
        if (amt > MAX_PER_CLAIM) {
            toast({ title: "Amount too high", description: `Single claim cannot exceed ₹${MAX_PER_CLAIM.toLocaleString("en-IN")}. Split into multiple claims.`, variant: "destructive" });
            return;
        }
        // Date: must be within last 90 days and not in future
        const d = new Date(form.date);
        const today = new Date(); today.setHours(23, 59, 59, 999);
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90); cutoff.setHours(0, 0, 0, 0);
        if (Number.isNaN(d.getTime())) {
            toast({ title: "Invalid date", description: "Please select a valid date.", variant: "destructive" });
            return;
        }
        if (d > today) {
            toast({ title: "Future date not allowed", description: "Expense date cannot be in the future.", variant: "destructive" });
            return;
        }
        if (d < cutoff) {
            toast({ title: "Date too old", description: "Expense date cannot be older than 90 days.", variant: "destructive" });
            return;
        }
        if (form.description && form.description.trim().length > 500) {
            toast({ title: "Description too long", description: "Please keep description under 500 characters.", variant: "destructive" });
            return;
        }
        if (editing) {
            const wasRejected = editing.status === "Rejected" || claims.find(c => c.id === editing.id)?.status === "Rejected";
            setClaims(claims.map(c => c.id === editing.id ? {
                ...c,
                title: form.title,
                category: form.category,
                amount: Number(form.amount),
                date: form.date,
                description: form.description,
                status: wasRejected ? "Pending" : c.status,
                rejectionReason: wasRejected ? undefined : c.rejectionReason,
            } : c));
            toast({ title: wasRejected ? "Claim resubmitted" : "Claim updated", description: wasRejected ? "Your updated claim is back in the approval queue." : "Changes saved." });
        } else {
            const newClaim: Claim = {
                id: Math.max(0, ...claims.map(c => c.id)) + 1,
                title: form.title,
                category: form.category,
                amount: Number(form.amount),
                date: form.date,
                status: "Pending",
                receipts: 0,
                description: form.description,
            };
            setClaims([newClaim, ...claims]);
            toast({ title: "Claim submitted", description: "Your expense claim has been sent for approval." });
        }
        setFormOpen(false);
        setEditing(null);
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        setClaims(claims.filter(c => c.id !== deleteConfirm.id));
        toast({ title: "Claim deleted", description: `"${deleteConfirm.title}" has been removed.` });
        if (detailOpen?.id === deleteConfirm.id) setDetailOpen(null);
        setDeleteConfirm(null);
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Expenses</h1>
                        <p className="text-sm text-slate-500 mt-1">Submit and track your reimbursement claims</p>
                    </div>
                    <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100">
                        <Plus size={16} className="mr-2" /> New Claim
                    </Button>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Submitted", value: inr(totals.submitted), icon: Receipt, color: "indigo" },
                        { label: "Pending Approval", value: inr(totals.pending), icon: Clock, color: "amber" },
                        { label: "Approved", value: inr(totals.approved), icon: CheckCircle2, color: "blue" },
                        { label: "Reimbursed", value: inr(totals.reimbursed), icon: Wallet, color: "emerald" },
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 flex items-center justify-center`}>
                                        <s.icon className={`text-${s.color}-600`} size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                        <p className="text-lg font-bold text-slate-900 truncate">{s.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
                        <CardTitle className="text-lg">Claim History</CardTitle>
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-slate-400" />
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[160px] h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Reimbursed">Reimbursed</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {filtered.map(c => {
                                const CatIcon = categoryIcons[c.category] || Receipt;
                                const StIcon = statusIcons[c.status];
                                return (
                                    <div key={c.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => setDetailOpen(c)}>
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                                <CatIcon className="text-indigo-600" size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-all truncate">{c.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {c.category} · {new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {c.receipts} receipt{c.receipts !== 1 && "s"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-2">
                                            <p className="text-base font-bold text-slate-900">{inr(c.amount)}</p>
                                            <Badge className={`${statusColors[c.status]} border text-[10px] font-semibold`}>
                                                <StIcon size={10} className="mr-1" /> {c.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" onClick={e => e.stopPropagation()} className="h-7 w-7 p-0 rounded-lg"><MoreVertical size={14} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44" onClick={e => e.stopPropagation()}>
                                                    <DropdownMenuItem onClick={() => setDetailOpen(c)}><Eye size={13} className="mr-2" />View Details</DropdownMenuItem>
                                                    {c.status === "Rejected" && <DropdownMenuItem onClick={() => openResubmit(c)}><RotateCcw size={13} className="mr-2" />Resubmit</DropdownMenuItem>}
                                                    {c.status === "Pending" && <DropdownMenuItem onClick={() => openEdit(c)}><Edit3 size={13} className="mr-2" />Edit</DropdownMenuItem>}
                                                    {(c.status === "Pending" || c.status === "Rejected") && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => setDeleteConfirm(c)} className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"><Trash2 size={13} className="mr-2" />Delete</DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                );
                            })}
                            {filtered.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <Receipt size={40} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No claims match this filter</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            {editing ? <Edit3 className="text-indigo-600" size={24} /> : <Plus className="text-indigo-600" size={24} />}
                        </div>
                        <DialogTitle className="text-2xl font-bold">{editing?.status === "Rejected" ? "Resubmit Claim" : editing ? "Edit Claim" : "New Expense Claim"}</DialogTitle>
                        <DialogDescription>{editing?.status === "Rejected" ? "Fix the issues and resubmit for approval." : "Submit a reimbursement request with receipts."}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        {editing?.status === "Rejected" && editing.rejectionReason && (
                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                                <p className="text-xs font-bold text-rose-700 mb-1">Previous rejection reason</p>
                                <p className="text-xs text-rose-600">{editing.rejectionReason}</p>
                            </div>
                        )}
                        <div>
                            <Label className="text-xs font-semibold">Title</Label>
                            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Client dinner" className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs font-semibold">Category</Label>
                                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(categoryIcons).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs font-semibold">Amount (₹)</Label>
                                <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs font-semibold">Date (last 90 days)</Label>
                            <Input
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                                min={new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0]}
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-xs font-semibold">Description (max 500)</Label>
                            <Textarea maxLength={500} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief notes (optional)" className="mt-1" />
                            <p className="text-[10px] text-slate-400 mt-1">{form.description.length}/500 chars</p>
                        </div>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-all cursor-pointer">
                            <Upload className="mx-auto text-slate-400" size={22} />
                            <p className="text-xs text-slate-500 mt-2">Drop receipts here or click to upload</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                            {editing?.status === "Rejected" ? "Resubmit" : editing ? "Save Changes" : "Submit Claim"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!detailOpen} onOpenChange={v => !v && setDetailOpen(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-0 max-w-lg overflow-hidden">
                    {detailOpen && (() => {
                        const CatIcon = categoryIcons[detailOpen.category] || Receipt;
                        const StIcon = statusIcons[detailOpen.status];
                        return (
                            <>
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                            <CatIcon className="text-indigo-600" size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="text-xl font-bold text-slate-900">{detailOpen.title}</h2>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <Badge className="bg-slate-100 text-slate-600 border-none text-[10px]">{detailOpen.category}</Badge>
                                                <Badge className={`${statusColors[detailOpen.status]} border text-[10px] font-semibold`}>
                                                    <StIcon size={10} className="mr-1" /> {detailOpen.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => setDetailOpen(null)} className="h-8 w-8 p-0 shrink-0"><X size={16} /></Button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-indigo-900">Claim Amount</span>
                                        <span className="text-2xl font-bold text-indigo-700">{inr(detailOpen.amount)}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
                                        <p className="text-sm text-slate-700">{detailOpen.description || "No description provided."}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Expense Date</p>
                                            <p className="text-sm font-semibold text-slate-900">{new Date(detailOpen.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Receipts</p>
                                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1"><FileText size={14} /> {detailOpen.receipts} attached</p>
                                        </div>
                                    </div>
                                    {detailOpen.rejectionReason && (
                                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                                            <p className="text-xs font-bold text-rose-700 mb-1">Rejection reason</p>
                                            <p className="text-sm text-rose-600">{detailOpen.rejectionReason}</p>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                                        {detailOpen.status === "Rejected" && (
                                            <Button onClick={() => { setDetailOpen(null); openResubmit(detailOpen); }} className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                                                <RotateCcw size={14} className="mr-2" /> Resubmit
                                            </Button>
                                        )}
                                        {detailOpen.status === "Pending" && (
                                            <Button onClick={() => { setDetailOpen(null); openEdit(detailOpen); }} className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                                                <Edit3 size={14} className="mr-2" /> Edit
                                            </Button>
                                        )}
                                        {(detailOpen.status === "Pending" || detailOpen.status === "Rejected") && (
                                            <Button onClick={() => setDeleteConfirm(detailOpen)} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteConfirm} onOpenChange={v => !v && setDeleteConfirm(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-md">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center">
                            <Trash2 className="text-rose-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold">Delete Claim?</DialogTitle>
                        <DialogDescription>"{deleteConfirm?.title}" worth {deleteConfirm && inr(deleteConfirm.amount)} will be permanently removed.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-2">
                        <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                        <Button onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
