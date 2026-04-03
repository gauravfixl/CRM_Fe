"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    ArrowRightLeft,
    Plus,
    Search,
    Users,
    Clock,
    ShieldCheck,
    RotateCcw,
    Eye,
    AlertTriangle,
    CalendarDays,
    FileText,
    XCircle
} from "lucide-react";

type Delegation = {
    id: string;
    delegator: string;
    delegate: string;
    module: "Leave" | "Expense" | "Payroll" | "All";
    startDate: string;
    endDate: string;
    status: "Active" | "Expired" | "Revoked";
    reason: string;
    createdAt: string;
};

type AuditEntry = {
    id: string;
    delegationId: string;
    action: string;
    performedBy: string;
    date: string;
    details: string;
};

const mockDelegations: Delegation[] = [
    { id: "DEL-001", delegator: "Rajesh Kumar", delegate: "Priya Sharma", module: "Leave", startDate: "2026-03-25", endDate: "2026-04-10", status: "Active", reason: "Vacation - Family trip", createdAt: "2026-03-20" },
    { id: "DEL-002", delegator: "Anita Desai", delegate: "Vikram Singh", module: "All", startDate: "2026-03-15", endDate: "2026-04-05", status: "Active", reason: "Medical leave - Surgery recovery", createdAt: "2026-03-12" },
    { id: "DEL-003", delegator: "Suresh Mehta", delegate: "Kavita Patel", module: "Expense", startDate: "2026-02-01", endDate: "2026-02-28", status: "Expired", reason: "Business travel overseas", createdAt: "2026-01-28" },
    { id: "DEL-004", delegator: "Neha Gupta", delegate: "Arjun Reddy", module: "Payroll", startDate: "2026-03-01", endDate: "2026-03-31", status: "Revoked", reason: "Maternity leave", createdAt: "2026-02-25" },
    { id: "DEL-005", delegator: "Amit Joshi", delegate: "Sneha Rao", module: "Leave", startDate: "2026-04-01", endDate: "2026-04-07", status: "Active", reason: "Short vacation", createdAt: "2026-03-28" },
    { id: "DEL-006", delegator: "Deepak Nair", delegate: "Rahul Verma", module: "Expense", startDate: "2026-03-28", endDate: "2026-04-03", status: "Active", reason: "Conference attendance", createdAt: "2026-03-25" },
];

const mockAuditLog: AuditEntry[] = [
    { id: "AUD-001", delegationId: "DEL-001", action: "Leave Approved", performedBy: "Priya Sharma (as delegate)", date: "2026-03-28", details: "Approved 2-day leave for Ravi Teja" },
    { id: "AUD-002", delegationId: "DEL-002", action: "Expense Approved", performedBy: "Vikram Singh (as delegate)", date: "2026-03-26", details: "Approved travel expense INR 15,000 for Meera" },
    { id: "AUD-003", delegationId: "DEL-004", action: "Delegation Revoked", performedBy: "HR Admin", date: "2026-03-15", details: "Revoked due to early return from leave" },
    { id: "AUD-004", delegationId: "DEL-002", action: "Leave Rejected", performedBy: "Vikram Singh (as delegate)", date: "2026-03-22", details: "Rejected leave request due to project deadline" },
    { id: "AUD-005", delegationId: "DEL-006", action: "Expense Approved", performedBy: "Rahul Verma (as delegate)", date: "2026-03-30", details: "Approved client dinner expense INR 8,500" },
];

const DelegationPage = () => {
    const { toast } = useToast();
    const [delegations, setDelegations] = useState<Delegation[]>(mockDelegations);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [revokeId, setRevokeId] = useState<string | null>(null);

    const [form, setForm] = useState({
        delegator: "",
        delegate: "",
        module: "Leave" as Delegation["module"],
        startDate: "",
        endDate: "",
        reason: "",
    });

    const activeDelegations = delegations.filter(d => d.status === "Active").length;
    const expiringSoon = delegations.filter(d => {
        if (d.status !== "Active") return false;
        const end = new Date(d.endDate);
        const now = new Date();
        const diff = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 3 && diff >= 0;
    }).length;
    const totalActions = mockAuditLog.filter(a => a.action !== "Delegation Revoked").length;

    const filtered = delegations.filter(d => {
        const matchSearch = d.delegator.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.delegate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "all" || d.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleCreate = () => {
        if (!form.delegator || !form.delegate || !form.startDate || !form.endDate) {
            toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        const newDelegation: Delegation = {
            id: `DEL-${String(delegations.length + 1).padStart(3, "0")}`,
            ...form,
            status: "Active",
            createdAt: new Date().toISOString().split("T")[0],
        };
        setDelegations([newDelegation, ...delegations]);
        setIsCreateOpen(false);
        setForm({ delegator: "", delegate: "", module: "Leave", startDate: "", endDate: "", reason: "" });
        toast({ title: "Delegation Created", description: `${form.delegator}'s authority delegated to ${form.delegate}.` });
    };

    const handleRevoke = (id: string) => {
        setDelegations(delegations.map(d => d.id === id ? { ...d, status: "Revoked" as const } : d));
        setRevokeId(null);
        toast({ title: "Delegation Revoked", description: `Delegation ${id} has been revoked.` });
    };

    const statusBadge = (status: Delegation["status"]) => {
        const styles = {
            Active: "bg-emerald-50 text-emerald-600 border-emerald-200",
            Expired: "bg-slate-50 text-slate-500 border-slate-200",
            Revoked: "bg-rose-50 text-rose-600 border-rose-200",
        };
        return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
    };

    const moduleBadge = (mod: Delegation["module"]) => {
        const styles = {
            Leave: "bg-blue-50 text-blue-600 border-blue-200",
            Expense: "bg-amber-50 text-amber-600 border-amber-200",
            Payroll: "bg-purple-50 text-purple-600 border-purple-200",
            All: "bg-indigo-50 text-indigo-600 border-indigo-200",
        };
        return <Badge variant="outline" className={styles[mod]}>{mod}</Badge>;
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-violet-600 rounded-xl flex items-center justify-center text-white">
                        <ArrowRightLeft size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approval Delegation</h1>
                        <p className="text-sm font-medium text-slate-500">Manage temporary approval authority transfers between employees.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => setIsAuditOpen(true)}>
                        <FileText size={16} className="mr-2 text-slate-400" /> Audit Log
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={() => setIsCreateOpen(true)}>
                        <Plus size={16} className="mr-2" /> Create Delegation
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="px-8 py-6 grid grid-cols-3 gap-6">
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={24} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Active Delegations</p>
                            <p className="text-2xl font-bold text-slate-900">{activeDelegations}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Expiring Soon</p>
                            <p className="text-2xl font-bold text-slate-900">{expiringSoon}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <RotateCcw size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Delegated Actions</p>
                            <p className="text-2xl font-bold text-slate-900">{totalActions}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar */}
            <div className="bg-white px-8 py-4 border-y border-slate-200 flex gap-4 items-center">
                <div className="relative w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search delegations..." className="pl-9 bg-slate-50 border-slate-200" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px] bg-slate-50 font-medium"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Revoked">Revoked</SelectItem>
                    </SelectContent>
                </Select>
                <div className="ml-auto text-xs text-slate-400 font-medium">Max delegation: 30 days | Allowed: Manager+ roles</div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">ID</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Delegator</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Delegate</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Module</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Start Date</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">End Date</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(d => (
                                <TableRow key={d.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-mono text-xs text-slate-500">{d.id}</TableCell>
                                    <TableCell className="font-bold text-slate-700">{d.delegator}</TableCell>
                                    <TableCell className="font-bold text-slate-700">{d.delegate}</TableCell>
                                    <TableCell>{moduleBadge(d.module)}</TableCell>
                                    <TableCell className="text-sm text-slate-600">{d.startDate}</TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        {d.endDate}
                                        {d.status === "Active" && (() => {
                                            const diff = Math.ceil((new Date(d.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                            return diff <= 3 && diff >= 0 ? (
                                                <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 text-[10px]">Expires in {diff}d</Badge>
                                            ) : null;
                                        })()}
                                    </TableCell>
                                    <TableCell>{statusBadge(d.status)}</TableCell>
                                    <TableCell className="text-right">
                                        {d.status === "Active" && (
                                            <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold text-xs" onClick={() => setRevokeId(d.id)}>
                                                <XCircle size={14} className="mr-1" /> Revoke
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow><TableCell colSpan={8} className="h-24 text-center text-slate-400">No delegations found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><ArrowRightLeft size={20} className="text-[#8B5CF6]" /> Create Delegation</DialogTitle>
                        <DialogDescription>Transfer approval authority temporarily to another employee.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Delegator (Assigning Person)</Label>
                            <Input placeholder="e.g. Rajesh Kumar" value={form.delegator} onChange={e => setForm({ ...form, delegator: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Delegate (Acting Person)</Label>
                            <Input placeholder="e.g. Priya Sharma" value={form.delegate} onChange={e => setForm({ ...form, delegate: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Module to Delegate</Label>
                            <Select value={form.module} onValueChange={v => setForm({ ...form, module: v as Delegation["module"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Leave">Leave</SelectItem>
                                    <SelectItem value="Expense">Expense</SelectItem>
                                    <SelectItem value="Payroll">Payroll</SelectItem>
                                    <SelectItem value="All">All Modules</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Start Date</Label>
                                <Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">End Date</Label>
                                <Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Reason</Label>
                            <Input placeholder="e.g. Vacation, Medical leave" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-medium">
                            Both parties will be notified via email and in-app notification. Max delegation period is 30 days.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleCreate}>Create Delegation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Confirmation */}
            <Dialog open={!!revokeId} onOpenChange={() => setRevokeId(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-rose-600">Revoke Delegation?</DialogTitle>
                        <DialogDescription>This will immediately revoke the delegation. The delegate will lose all delegated approval authority.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRevokeId(null)}>Cancel</Button>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold" onClick={() => revokeId && handleRevoke(revokeId)}>Revoke</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Audit Log Dialog */}
            <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><FileText size={20} className="text-slate-600" /> Delegation Audit Log</DialogTitle>
                        <DialogDescription>Actions performed under delegated authority.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Date</TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Delegation</TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Action</TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Performed By</TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockAuditLog.map(a => (
                                    <TableRow key={a.id}>
                                        <TableCell className="text-xs text-slate-500">{a.date}</TableCell>
                                        <TableCell className="font-mono text-xs">{a.delegationId}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{a.action}</Badge></TableCell>
                                        <TableCell className="text-sm font-medium text-slate-700">{a.performedBy}</TableCell>
                                        <TableCell className="text-sm text-slate-600">{a.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DelegationPage;
