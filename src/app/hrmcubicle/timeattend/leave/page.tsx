"use client"

import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Plus, Search, FileText, Download, Filter, TrendingUp, AlertCircle, Info, ChevronRight, User, BookOpen, Clock, ShieldAlert, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const LeavePage = () => {
    const { toast } = useToast();
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Dynamic Lists
    const [leaveRequests, setLeaveRequests] = useState([
        { id: "LV-001", employee: "Rajesh Kumar", dept: "Engineering", type: "Casual Leave", from: "2024-01-22", to: "2024-01-23", days: 2, status: "Pending", reason: "Family Function", appliedOn: "2024-01-15" },
        { id: "LV-002", employee: "Priya Sharma", dept: "Product", type: "Sick Leave", from: "2024-01-20", to: "2024-01-20", days: 1, status: "Approved", reason: "Viral Fever", appliedOn: "2024-01-18" },
        { id: "LV-003", employee: "Vikram Singh", dept: "Engineering", type: "Casual Leave", from: "2024-01-25", to: "2024-01-26", days: 2, status: "Pending", reason: "Personal work", appliedOn: "2024-01-20" }
    ]);

    const [balances, setBalances] = useState({ casual: 8, sick: 10, earned: 15 });

    // New Request State
    const [newLeave, setNewLeave] = useState({ type: "Casual Leave", from: "", to: "", reason: "" });
    const [editingId, setEditingId] = useState<string | null>(null);

    // Computed: Check for overlaps in the same department
    const overlaps = useMemo(() => {
        if (!newLeave.from) return [];
        return leaveRequests.filter(r =>
            r.dept === "Engineering" &&
            r.status === "Approved" &&
            r.from === newLeave.from
        );
    }, [newLeave.from, leaveRequests]);

    // Handle Approval
    const handleAction = (id: string, newStatus: "Approved" | "Rejected") => {
        setLeaveRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        ));

        if (newStatus === "Approved") {
            const req = leaveRequests.find(r => r.id === id);
            toast({ title: "Request Approved", description: `Leave for ${req?.employee} has been confirmed.` });
        } else {
            toast({ title: "Request Rejected", description: "The leave request has been denied.", variant: "destructive" });
        }
    };

    // Export to CSV
    const handleExport = () => {
        const headers = ["ID", "Employee", "Type", "From", "To", "Days", "Status", "Reason"];
        const csvContent = [
            headers.join(","),
            ...leaveRequests.map(r => [r.id, r.employee, r.type, r.from, r.to, r.days, r.status, r.reason].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leave_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast({ title: "Export Success", description: "Leave report has been downloaded." });
    };

    const handleApply = () => {
        if (!newLeave.from || !newLeave.to || !newLeave.reason) {
            toast({ title: "Incomplete Data", description: "Please provide all necessary details.", variant: "destructive" });
            return;
        }

        if (editingId) {
            setLeaveRequests(prev => prev.map(req =>
                req.id === editingId
                    ? { ...req, ...newLeave, employee: req.employee, dept: req.dept, status: "Pending" }
                    : req
            ));
            toast({ title: "Request Updated", description: "Leave details have been modified." });
            setEditingId(null);
        } else {
            const request = {
                id: `LV-00${leaveRequests.length + 1}`,
                employee: "Self (Admin)",
                dept: "Engineering",
                type: newLeave.type,
                from: newLeave.from,
                to: newLeave.to,
                days: 1, // Simplified day calculation logic can be added here
                status: "Pending",
                reason: newLeave.reason,
                appliedOn: new Date().toISOString().split('T')[0]
            };
            setLeaveRequests([request, ...leaveRequests]);
            toast({ title: "Success", description: "Your leave application is pending review." });
        }
        setIsApplyModalOpen(false);
        setNewLeave({ type: "Casual Leave", from: "", to: "", reason: "" });
    };

    const handleEdit = (req: any) => {
        setNewLeave({ type: req.type, from: req.from, to: req.to, reason: req.reason });
        setEditingId(req.id);
        setIsApplyModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setLeaveRequests(prev => prev.filter(r => r.id !== id));
        toast({ title: "Request Deleted", description: "The leave request has been removed.", variant: "destructive" });
    };

    const openDetails = (req: any) => {
        setSelectedRequest(req);
        setIsDetailsOpen(true);
    };

    const filteredRequests = leaveRequests.filter(req => {
        const matchesSearch = req.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            "Pending": "bg-amber-100/80 text-amber-700 border-amber-200",
            "Approved": "bg-emerald-100/80 text-emerald-700 border-emerald-200",
            "Rejected": "bg-rose-100/80 text-rose-700 border-rose-200"
        };
        return <Badge variant="outline" className={`border font-bold px-3 py-1 rounded-lg ${styles[status]}`}>{status}</Badge>;
    };

    return (
        <div className="flex-1 bg-[#fcfdff] overflow-x-hidden overflow-y-auto min-h-screen">
            <div style={{ zoom: '0.6' }} className="p-12 space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900">Leave Management</h2>
                        <p className="text-slate-500 font-bold text-lg mt-2">Oversee team availability and policy compliance.</p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 shadow-sm" onClick={handleExport}>
                            <Download size={20} className="mr-2" /> Export CSV
                        </Button>
                        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#6366f1] hover:bg-[#5558e6] h-14 px-8 rounded-2xl font-bold shadow-xl shadow-indigo-100">
                                    <Plus className="mr-2 h-5 w-5" /> Apply for leave
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl rounded-[3rem] border-2 border-slate-200 p-12 bg-white shadow-3xl" style={{ zoom: '0.75' }}>
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-bold tracking-tight">{editingId ? "Edit Leave Request" : "New Leave Request"}</DialogTitle>
                                    <DialogDescription className="font-bold text-slate-400 text-lg">Define your leave duration and reasoning.</DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 font-sans">
                                    <div className="grid gap-3">
                                        <Label className="font-bold ml-2 text-slate-600">Leave category</Label>
                                        <Select value={newLeave.type} onValueChange={(v) => setNewLeave({ ...newLeave, type: v })}>
                                            <SelectTrigger className="h-16 rounded-2xl bg-white border-2 border-slate-300 px-6 font-bold text-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                                <SelectItem value="Casual Leave" className="rounded-xl p-3">Casual leave</SelectItem>
                                                <SelectItem value="Sick Leave" className="rounded-xl p-3">Sick leave</SelectItem>
                                                <SelectItem value="Earned Leave" className="rounded-xl p-3">Earned leave</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label className="font-bold ml-2 text-slate-600">Start date</Label>
                                        <Input type="date" className="h-16 rounded-2xl bg-white border-2 border-slate-300 px-6 font-bold text-xl" value={newLeave.from} onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })} />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label className="font-bold ml-2 text-slate-600">End date</Label>
                                        <Input type="date" className="h-16 rounded-2xl bg-white border-2 border-slate-300 px-6 font-bold text-xl" value={newLeave.to} onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })} />
                                    </div>

                                    {/* Overlap Alert Mockup */}
                                    <div className="col-span-full">
                                        <AnimatePresence>
                                            {overlaps.length > 0 && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4"
                                                >
                                                    <AlertCircle className="text-amber-500 shrink-0" size={24} />
                                                    <div>
                                                        <p className="font-bold text-amber-900 leading-tight">Team Overlap Warning</p>
                                                        <p className="text-sm font-bold text-amber-700/80 mt-1">{overlaps.length} members from Engineering are already off on this date.</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="grid gap-3 col-span-full">
                                        <Label className="font-bold ml-2 text-slate-600">Justification</Label>
                                        <Input className="h-16 rounded-2xl bg-white border-2 border-slate-300 px-6 font-bold text-xl" value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })} placeholder="Briefly explain the reason..." />
                                    </div>
                                </div>
                                <DialogFooter className="mt-4 flex gap-4">
                                    <Button variant="ghost" className="rounded-2xl font-bold text-slate-400 h-16 flex-1 text-lg" onClick={() => { setIsApplyModalOpen(false); setEditingId(null); setNewLeave({ type: "Casual Leave", from: "", to: "", reason: "" }); }}>Cancel</Button>
                                    <Button className="bg-[#6366f1] h-16 rounded-2xl font-bold text-white shadow-xl shadow-indigo-100 flex-1 text-lg" onClick={handleApply}>{editingId ? "Update Request" : "Submit Request"}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="grid gap-8 md:grid-cols-4">
                    {[
                        { label: "Casual leave", val: balances.casual, bg: "bg-indigo-100/80", border: "border-indigo-200", text: "text-indigo-800", trend: "+2% usage" },
                        { label: "Sick leave", val: balances.sick, bg: "bg-emerald-100/80", border: "border-emerald-200", text: "text-emerald-800", trend: "Balanced" },
                        { label: "Earned leave", val: balances.earned, bg: "bg-purple-100/80", border: "border-purple-200", text: "text-purple-800", trend: "15d Accrued" },
                        { label: "Total balance", val: balances.casual + balances.sick + balances.earned, bg: "bg-slate-100/80", border: "border-slate-300", text: "text-slate-800", trend: "Avg 33d/y" }
                    ].map((stat, i) => (
                        <Card key={i} className={`shadow-2xl shadow-slate-200/50 border ${stat.border} ${stat.bg} rounded-[3rem] p-10 group hover:scale-[1.02] transition-transform overflow-hidden relative`}>
                            <CardHeader className="p-0 pb-6 relative z-10">
                                <CardTitle className={`text-sm font-bold ${stat.text} tracking-wider font-sans`}>{stat.label}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 relative z-10">
                                <div className="text-5xl font-bold text-slate-900 tracking-tighter">{stat.val}</div>
                                <div className="flex items-center gap-2 mt-4">
                                    <TrendingUp size={14} className={`${stat.text} opacity-50`} />
                                    <p className={`text-xs font-bold ${stat.text} opacity-70`}>{stat.trend}</p>
                                </div>
                            </CardContent>
                            <div className={`absolute -bottom-10 -right-10 h-32 w-32 rounded-full ${stat.bg.replace('/80', '')} opacity-30 blur-3xl transition-all group-hover:scale-150`} />
                        </Card>
                    ))}
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="leave-requests" className="space-y-10">
                    <TabsList className="bg-slate-100/50 p-2 rounded-3xl gap-2 h-auto flex justify-start items-center max-w-fit border border-slate-200/50">
                        {["Leave requests", "Leave calendar", "Policies"].map((tab) => (
                            <TabsTrigger
                                key={tab.toLowerCase().replace(" ", "-")}
                                value={tab.toLowerCase().replace(" ", "-")}
                                className="px-10 py-4 rounded-2xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-[#6366f1] data-[state=active]:shadow-lg transition-all"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="leave-requests" className="space-y-8 pt-2">
                        {/* Search and Filters */}
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
                                <Input
                                    className="h-16 pl-16 rounded-[2rem] bg-white border-slate-100 font-bold text-lg shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all"
                                    placeholder="Identify employee name or request identifier..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-64 h-16 rounded-[2rem] bg-white border-slate-100 font-bold px-8 text-lg shadow-sm">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="All" className="rounded-xl">Current: All</SelectItem>
                                    <SelectItem value="Pending" className="rounded-xl">Filter: Pending</SelectItem>
                                    <SelectItem value="Approved" className="rounded-xl">Filter: Approved</SelectItem>
                                    <SelectItem value="Rejected" className="rounded-xl">Filter: Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[3.5rem] bg-white overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-slate-100">
                                        <TableHead className="p-10 font-bold text-xs tracking-wider text-slate-400">Personnel & ID</TableHead>
                                        <TableHead className="p-10 font-bold text-xs tracking-wider text-slate-400">Category</TableHead>
                                        <TableHead className="p-10 font-bold text-xs tracking-wider text-slate-400">Duration</TableHead>
                                        <TableHead className="p-10 font-bold text-xs tracking-wider text-slate-400">Status</TableHead>
                                        <TableHead className="p-10 font-bold text-xs tracking-wider text-slate-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {filteredRequests.map((req) => (
                                            <motion.tr
                                                key={req.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="border-slate-50 group hover:bg-slate-50/30 transition-colors"
                                            >
                                                <TableCell className="p-10">
                                                    <div className="font-bold text-slate-900 text-xl tracking-tight">{req.employee}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.id}</span>
                                                        <div className="h-1 w-1 bg-slate-300 rounded-full" />
                                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{req.dept}</span>
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-400 mt-4 max-w-xs line-clamp-1 italic group-hover:line-clamp-none transition-all">Reason: &ldquo;{req.reason}&rdquo;</div>
                                                </TableCell>
                                                <TableCell className="p-10">
                                                    <Badge className="bg-slate-100 text-slate-600 border-none font-bold px-5 py-2 rounded-xl text-[10px] tracking-widest uppercase">{req.type}</Badge>
                                                </TableCell>
                                                <TableCell className="p-10">
                                                    <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                                        <CalendarIcon size={18} className="text-slate-300" />
                                                        {new Date(req.from).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} &ndash; {new Date(req.to).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                    <div className="text-xs font-bold text-indigo-500 mt-2 bg-indigo-50 w-fit px-3 py-1 rounded-full">{req.days} Day(s) cycle</div>
                                                </TableCell>
                                                <TableCell className="p-10"><StatusBadge status={req.status} /></TableCell>
                                                <TableCell className="p-10 text-right">
                                                    <div className="flex justify-end items-center gap-4">
                                                        {req.status === "Pending" ? (
                                                            <>
                                                                <Button size="sm" className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:scale-105 transition-all" onClick={() => handleAction(req.id, "Approved")}>
                                                                    Approve
                                                                </Button>
                                                                <Button size="sm" className="h-12 px-8 bg-rose-500 hover:bg-rose-600 rounded-2xl font-bold shadow-xl shadow-rose-100 hover:scale-105 transition-all" onClick={() => handleAction(req.id, "Rejected")}>
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-slate-300 font-bold hover:text-[#6366f1] transition-colors cursor-pointer" onClick={() => openDetails(req)}>
                                                                <Info size={16} /> <span className="text-sm">Log details</span>
                                                            </div>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-10 w-10 rounded-xl text-slate-400 hover:bg-slate-100">
                                                                    <MoreHorizontal size={20} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-xl p-2 font-bold min-w-40">
                                                                {req.status === "Pending" && (
                                                                    <DropdownMenuItem className="rounded-xl p-3 cursor-pointer hover:bg-indigo-50 text-indigo-600" onClick={() => handleEdit(req)}>
                                                                        <Pencil size={16} className="mr-2" /> Edit Request
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem className="rounded-xl p-3 cursor-pointer hover:bg-rose-50 text-rose-500" onClick={() => handleDelete(req.id)}>
                                                                    <Trash2 size={16} className="mr-2" /> {req.status === "Pending" ? "Cancel Request" : "Delete Log"}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>

                    <TabsContent value="leave-calendar" className="pt-4">
                        <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[3.5rem] bg-white p-12 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Attendance Calendar View</h3>
                                    <p className="text-slate-500 font-bold">January 2026 Operational Window</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="rounded-xl h-12 font-bold border-slate-100">Today</Button>
                                    <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-lg"> <ChevronRight className="rotate-180" size={18} /> </Button>
                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-lg"> <ChevronRight size={18} /> </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-4 mb-4">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                    <div key={day} className="text-center font-bold text-slate-300 uppercase tracking-widest text-xs">{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-4">
                                {Array.from({ length: 31 }).map((_, i) => {
                                    const day = i + 1;
                                    const activeLeave = leaveRequests.find(r => {
                                        const d = new Date(r.from).getDate();
                                        return d === day && r.status === 'Approved';
                                    });

                                    return (
                                        <div key={i} className={`h-32 rounded-3xl border border-slate-50 p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/30 group ${activeLeave ? 'bg-amber-50/50 border-amber-100' : ''}`}>
                                            <p className="font-bold text-slate-400 group-hover:text-indigo-500">{day}</p>
                                            {activeLeave && (
                                                <div className="mt-2 p-2 bg-white rounded-xl shadow-sm border border-amber-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                        <p className="text-[10px] font-bold text-slate-600 line-clamp-1">{activeLeave.employee.split(' ')[0]} ({activeLeave.type.split(' ')[0]})</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="policies" className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: "Standard Annual Leave", desc: "15 days per calendar year. Carrying forward allowed up to 10 days.", icon: <BookOpen className="text-indigo-500" />, rules: ["Probation completion required", "Manager approval needed"] },
                                { title: "Medical Leave Policy", desc: "10 days paid sick leave. Medical certificate required for > 2 days.", icon: <AlertCircle className="text-emerald-500" />, rules: ["Immediate notification", "Document upload required"] },
                                { title: "Emergency Response", desc: "Special leave for unpredictable personal emergencies.", icon: <ShieldAlert size={20} className="text-rose-500" />, rules: ["24h prior or immediate", "HR post-facto verification"] }
                            ].map((policy, i) => (
                                <Card key={i} className="shadow-2xl shadow-slate-200/50 border-none rounded-[3.5rem] bg-white p-10 group hover:shadow-indigo-100 transition-all">
                                    <div className="h-14 w-14 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                                        {policy.icon}
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 mb-2">{policy.title}</h4>
                                    <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">{policy.desc}</p>
                                    <div className="space-y-3 pt-6 border-t border-slate-50">
                                        {policy.rules.map((rule, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="h-1.5 w-1.5 rounded-full bg-[#6366f1]" />
                                                <p className="text-xs font-bold text-slate-600">{rule}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full mt-8 rounded-xl font-bold text-indigo-500 hover:bg-indigo-50">Read full document</Button>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Log Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-2xl rounded-[3rem] border-none p-12 bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                    <User />
                                </div>
                                Request Insight: {selectedRequest?.id}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-10 py-10">
                            {/* Summary Card */}
                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Personnel Name</p>
                                    <p className="text-xl font-bold text-slate-900">{selectedRequest?.employee}</p>
                                    <p className="text-sm font-bold text-indigo-400">{selectedRequest?.dept} Department</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Application Status</p>
                                    <StatusBadge status={selectedRequest?.status || ""} />
                                    <p className="text-sm font-bold text-slate-400 mt-2">Applied on {selectedRequest?.appliedOn}</p>
                                </div>
                            </div>

                            {/* Details Table */}
                            <div className="space-y-6">
                                <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <FileText size={20} className="text-slate-400" /> Justification & Narrative
                                </p>
                                <div className="bg-white/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner italic text-slate-600 font-bold leading-relaxed">
                                    &ldquo;{selectedRequest?.reason}&rdquo;
                                </div>
                            </div>

                            {/* Timeline Mock */}
                            <div className="space-y-6">
                                <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Clock size={20} className="text-slate-400" /> Life Cycle History
                                </p>
                                <div className="space-y-6 pl-2">
                                    <div className="flex gap-4 items-start">
                                        <div className="h-3 w-3 rounded-full bg-indigo-400 mt-1.5 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                        <div>
                                            <p className="font-bold text-slate-800">Request submitted by staff</p>
                                            <p className="text-xs font-bold text-slate-400">January 20, 2026 | 02:30 PM IST</p>
                                        </div>
                                    </div>
                                    {selectedRequest?.status === "Approved" && (
                                        <div className="flex gap-4 items-start">
                                            <div className="h-3 w-3 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            <div>
                                                <p className="font-bold text-slate-800">Final authorization granted</p>
                                                <p className="text-xs font-bold text-slate-400">January 21, 2026 | 10:15 AM IST (via HR Admin)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-xl transition-all active:scale-95" onClick={() => setIsDetailsOpen(false)}>
                                Close insight view
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
};

export default LeavePage;
