"use client";

import React, { useState } from 'react';
import {
    Plus,
    Search,
    Bell,
    CheckCircle2,
    Clock,
    AlertTriangle,
    UserCheck,
    Mail,
    MoreHorizontal,
    FileText,
    User,
    Calendar,
    Filter,
    ArrowUpRight,
    Download,
    History,
    RefreshCw,
    PieChart,
    ChevronDown,
    Zap,
    Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import { useDocumentsStore, type Acknowledgement } from "@/shared/data/documents-store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { required, minLength, maxLength, isEmployeeId, isFutureDate, firstError } from "@/shared/utils/validators";

const AcknowledgementsPage = () => {
    const { acknowledgements, policies, requestAcknowledgement, updateAcknowledgement, updateAcknowledgementDetails, deleteAcknowledgement } = useDocumentsStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [selectedAckIds, setSelectedAckIds] = useState<string[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [historyAck, setHistoryAck] = useState<Acknowledgement | null>(null);
    const [editingAck, setEditingAck] = useState<Acknowledgement | null>(null);
    const [priorityAck, setPriorityAck] = useState<Acknowledgement | null>(null);
    const [deleteAckId, setDeleteAckId] = useState<string | null>(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [remindersSent, setRemindersSent] = useState(false);

    const [newRequest, setNewRequest] = useState({
        documentId: "",
        documentTitle: "",
        employeeId: "",
        employeeName: "",
        dueDate: ""
    });

    const filteredAcks = acknowledgements.filter(ack => {
        const matchesSearch = ack.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ack.documentTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || ack.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: acknowledgements.length,
        signed: acknowledgements.filter(a => a.status === "Signed").length,
        pending: acknowledgements.filter(a => a.status === "Pending").length,
        completionRate: acknowledgements.length > 0 ? Math.round((acknowledgements.filter(a => a.status === "Signed").length / acknowledgements.length) * 100) : 0
    };

    const validateRequest = (r: { documentId: string; employeeName: string; employeeId: string; dueDate?: string }): string | null => {
        const docExists = !r.documentId || policies.some(p => p.id === r.documentId);
        return firstError(
            required(r.documentId, "Document"),
            docExists ? null : "Selected document no longer exists",
            required(r.employeeName, "Employee name"),
            minLength(r.employeeName, 2, "Employee name"),
            maxLength(r.employeeName, 80, "Employee name"),
            required(r.employeeId, "Employee ID"),
            isEmployeeId(r.employeeId, "Employee ID"),
            r.dueDate ? isFutureDate(r.dueDate, "Due date") : null,
        );
    };

    const handleRequest = () => {
        const err = validateRequest(newRequest);
        if (err) { toast.error(err); return; }
        const dupe = acknowledgements.some(a => a.documentId === newRequest.documentId && a.employeeId.trim().toLowerCase() === newRequest.employeeId.trim().toLowerCase() && a.status !== "Signed");
        if (dupe) {
            toast.error("An open acknowledgement request already exists for this employee + document");
            return;
        }
        const doc = policies.find(p => p.id === newRequest.documentId);
        requestAcknowledgement({
            documentId: newRequest.documentId,
            documentTitle: doc?.title || "Document",
            employeeId: newRequest.employeeId.trim(),
            employeeName: newRequest.employeeName.trim(),
            dueDate: newRequest.dueDate || undefined,
        });
        setIsRequestOpen(false);
        setNewRequest({ documentId: "", documentTitle: "", employeeId: "", employeeName: "", dueDate: "" });
        toast.success("Acknowledgement request sent");
    };

    const toggleSelect = (id: string) => {
        setSelectedAckIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSaveEdit = () => {
        if (!editingAck) return;
        const err = firstError(
            required(editingAck.documentId, "Document"),
            required(editingAck.employeeName, "Employee name"),
            minLength(editingAck.employeeName, 2, "Employee name"),
            maxLength(editingAck.employeeName, 80, "Employee name"),
            required(editingAck.employeeId, "Employee ID"),
            isEmployeeId(editingAck.employeeId, "Employee ID"),
            editingAck.comments ? maxLength(editingAck.comments, 500, "Comments") : null,
        );
        if (err) { toast.error(err); return; }
        updateAcknowledgementDetails(editingAck.id, {
            ...editingAck,
            employeeName: editingAck.employeeName.trim(),
            employeeId: editingAck.employeeId.trim(),
            comments: editingAck.comments?.trim() || undefined,
        });
        toast.success("Acknowledgement updated");
        setEditingAck(null);
    };

    const handlePriorityRemind = () => {
        if (!priorityAck) return;
        updateAcknowledgementDetails(priorityAck.id, { priority: true });
        toast.success(`High-priority ping sent to ${priorityAck.employeeName}`);
        setPriorityAck(null);
    };

    const confirmDelete = () => {
        if (!deleteAckId) return;
        deleteAcknowledgement(deleteAckId);
        toast.success("Request cancelled");
        setDeleteAckId(null);
    };

    const confirmBulkDelete = () => {
        const count = selectedAckIds.length;
        selectedAckIds.forEach(id => deleteAcknowledgement(id));
        setSelectedAckIds([]);
        setBulkDeleteOpen(false);
        toast.success(`${count} requests terminated`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Signed":
                return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 font-bold px-3 py-1">Signed</Badge>;
            case "Viewed":
                return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 font-bold px-3 py-1">Viewed</Badge>;
            case "Pending":
                return <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20 font-bold px-3 py-1">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans relative" style={{ zoom: "80%" }}>
            {/* Header section */}
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-start">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Acknowledgements</h1>
                        <p className="text-slate-500 font-semibold text-sm mt-1">Track document compliance and employee signatures across the organization.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className={`h-11 border-slate-200 rounded-xl font-bold text-[10px] tracking-wide px-6 hover:bg-slate-50 transition-all ${remindersSent ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : ''}`} onClick={() => {
                            const pendingCount = acknowledgements.filter(a => a.status === "Pending").length;
                            if (pendingCount === 0) {
                                toast.info("No pending acknowledgements to remind");
                                return;
                            }
                            setRemindersSent(true);
                            toast.success(`Reminders sent to ${pendingCount} pending employee(s)`);
                            setTimeout(() => setRemindersSent(false), 3000);
                        }}>
                            <Mail className="w-4 h-4 mr-2" /> {remindersSent ? "Reminders Sent" : "Send Reminders"}
                        </Button>
                        <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-wide border-none">
                                    <Plus className="w-4 h-4" /> New Request
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Request Acknowledgement</DialogTitle>
                                    <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-tight mt-2">
                                        Compliance Monitoring Portal v2.1
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-8">
                                    <div className="space-y-3 text-start">
                                        <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Select Document</label>
                                        <Select
                                            value={newRequest.documentId}
                                            onValueChange={(val) => setNewRequest({ ...newRequest, documentId: val })}
                                        >
                                            <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                                <SelectValue placeholder="Identify Policy/Document" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border border-slate-200 shadow-2xl p-2 font-bold text-xs font-sans">
                                                {policies.map(p => (
                                                    <SelectItem key={p.id} value={p.id} className="rounded-xl h-10">{p.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3 text-start">
                                            <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Employee Name</label>
                                            <Input
                                                placeholder="Jane Doe"
                                                value={newRequest.employeeName}
                                                onChange={(e) => setNewRequest({ ...newRequest, employeeName: e.target.value })}
                                                className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-3 text-start">
                                            <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Employee Id</label>
                                            <Input
                                                placeholder="EMP-102"
                                                value={newRequest.employeeId}
                                                onChange={(e) => setNewRequest({ ...newRequest, employeeId: e.target.value })}
                                                className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-start">
                                        <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Due Date (Optional, defaults to +7 days)</label>
                                        <Input
                                            type="date"
                                            value={newRequest.dueDate}
                                            onChange={(e) => setNewRequest({ ...newRequest, dueDate: e.target.value })}
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="col-span-2 p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex items-start gap-4 mt-2">
                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                            <Bell size={20} className="text-indigo-600" />
                                        </div>
                                        <div className="text-start">
                                            <p className="text-[11px] font-bold tracking-wide text-indigo-900 mb-1 leading-tight">Priority Notification</p>
                                            <p className="text-[10px] font-medium text-indigo-600/70 leading-relaxed tracking-tight">This will send a priority notification and email to the employee. They will be required to provide an e-signature or confirmation.</p>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="gap-3">
                                    <Button variant="ghost" onClick={() => setIsRequestOpen(false)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6">Cancel</Button>
                                    <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-indigo-100 transition-all text-[10px] tracking-wide border-none" onClick={handleRequest}>Send Request</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8 text-start">
                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border border-slate-100 shadow-sm rounded-none bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <CardHeader className="p-7 pb-2 flex flex-row items-center justify-between">
                            <div className="text-[10px] font-bold tracking-tight text-slate-400">Overall Compliance</div>
                            <div className="bg-indigo-50 text-indigo-600 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm">
                                <PieChart size={18} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-7">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.completionRate}%</span>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[9px] font-black py-0 h-5 px-2">+4.2%</Badge>
                            </div>
                            <div className="w-full bg-slate-50 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.completionRate}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="bg-indigo-600 h-full rounded-full shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-100 shadow-sm rounded-none bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <CardHeader className="p-7 pb-2 flex flex-row items-center justify-between">
                            <div className="text-[10px] font-bold tracking-tight text-slate-400">Total Signed</div>
                            <div className="bg-emerald-50 text-emerald-600 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm">
                                <UserCheck size={18} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-7">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.signed}</div>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wide mt-1">Confirmed Acknowledgements</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-100 shadow-sm rounded-none bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <CardHeader className="p-7 pb-2 flex flex-row items-center justify-between">
                            <div className="text-[10px] font-bold tracking-tight text-slate-400">Pending Actions</div>
                            <div className="bg-amber-50 text-amber-600 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm">
                                <Clock size={18} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-7">
                            <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.pending}</div>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wide mt-1">Requiring Hr Follow-Up</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-indigo-100 shadow-sm rounded-none bg-indigo-50/50 p-7 relative overflow-hidden group cursor-pointer hover:bg-white transition-all duration-500" onClick={() => {
                            const pendingCount = acknowledgements.filter(a => a.status === "Pending").length;
                            if (pendingCount === 0) {
                                toast.info("No pending acknowledgements to auto-nudge");
                                return;
                            }
                            toast.success(`Auto-Nudge activated: ${pendingCount} pending employee(s) will receive smart reminders every 48 hours`);
                        }}>
                        <div className="absolute top-[-10px] right-[-10px] h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CardHeader className="p-0 pb-4 text-start">
                            <div className="bg-white text-indigo-600 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100">
                                <Zap size={18} className="text-amber-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 text-start">
                            <h4 className="font-bold text-xl leading-tight mb-1 tracking-tight text-indigo-900">Auto-Nudge</h4>
                            <p className="text-[10px] font-medium text-indigo-600/60 leading-relaxed tracking-wide">Smart reminders every 48 hours for pending signatures.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Compliance Table */}
                <Card className="border border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6 flex-1 max-w-md">
                                {selectedAckIds.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-12 rounded-xl text-rose-600 font-bold border-rose-100 bg-rose-50/50"
                                        onClick={() => setBulkDeleteOpen(true)}
                                    >
                                        Delete ({selectedAckIds.length})
                                    </Button>
                                )}
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by employee or document..."
                                        className="h-12 pl-12 bg-white border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px] h-12 bg-white border-slate-200 rounded-xl font-bold text-xs px-5">
                                        <div className="flex items-center gap-2">
                                            <Filter size={16} className="text-slate-400" />
                                            <span>Status</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-2 font-bold text-xs">
                                        <SelectItem value="all" className="rounded-lg h-10">All Status</SelectItem>
                                        <SelectItem value="Pending" className="rounded-lg h-10 text-slate-500">Pending</SelectItem>
                                        <SelectItem value="Viewed" className="rounded-lg h-10 text-amber-500">Viewed</SelectItem>
                                        <SelectItem value="Signed" className="rounded-lg h-10 text-emerald-500">Signed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-[10px] tracking-wide px-6 hover:bg-slate-50 transition-all" onClick={() => {
                                    const csvHeader = "Employee Name,Employee ID,Document Title,Status,Due Date,Sent On,Resolved On\n";
                                    const csvRows = filteredAcks.map(ack =>
                                        `"${ack.employeeName}","${ack.employeeId}","${ack.documentTitle}","${ack.status}","${ack.dueDate || '-'}","${ack.notifiedAt || '-'}","${ack.signedAt || '-'}"`
                                    ).join("\n");
                                    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = `acknowledgements_report_${new Date().toISOString().split("T")[0]}.csv`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                    toast.success("Report exported as CSV");
                                }}>
                                    <Download size={16} className="mr-2" /> Export Report
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto" key={refreshKey}>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                                        <TableHead className="w-10 px-8 py-5">
                                            <input
                                                type="checkbox"
                                                className="rounded-lg border-slate-300 text-indigo-600 cursor-pointer w-4 h-4"
                                                checked={selectedAckIds.length === filteredAcks.length && filteredAcks.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedAckIds(filteredAcks.map(a => a.id));
                                                    else setSelectedAckIds([]);
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead className="px-4 py-5 text-[10px] font-bold tracking-wide text-slate-400 w-[20%]">Employee</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400 w-[25%]">Document Title</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Status</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Due Date</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Sent On</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Resolved On</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {filteredAcks.map((ack) => (
                                            <TableRow
                                                key={ack.id}
                                                className={`group hover:bg-indigo-50/20 transition-all border-b border-slate-50 last:border-0 ${selectedAckIds.includes(ack.id) ? 'bg-indigo-50/30' : ''}`}
                                            >
                                                <TableCell className="px-8 py-6 w-10">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded-lg border-slate-300 text-indigo-600 cursor-pointer w-4 h-4"
                                                        checked={selectedAckIds.includes(ack.id)}
                                                        onChange={() => toggleSelect(ack.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="px-4 py-6 text-start">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-slate-500 group-hover:scale-110 transition-transform shadow-inner border border-slate-100">
                                                            {ack.employeeName.charAt(0)}
                                                        </div>
                                                        <div className="text-start">
                                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">{ack.employeeName}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 tracking-wide mt-0.5 opacity-60">ID: {ack.employeeId}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex items-center gap-2.5 max-w-[280px]">
                                                        <FileText size={16} className="text-slate-300 shrink-0" />
                                                        <span className="text-xs font-bold text-slate-700 tracking-tight truncate">{ack.documentTitle}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(ack.status)}
                                                        {ack.priority && (
                                                            <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 font-bold text-[9px] px-2 py-0.5 gap-1">
                                                                <Bell size={10} /> Priority
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex flex-col text-start">
                                                        <span className={`text-xs font-bold ${ack.status === 'Pending' && new Date(ack.dueDate || '') < new Date() ? 'text-rose-500' : 'text-slate-600'}`}>
                                                            {ack.dueDate || '-'}
                                                        </span>
                                                        {ack.status === 'Pending' && new Date(ack.dueDate || '') < new Date() && (
                                                            <span className="text-[9px] text-rose-400 font-bold tracking-wide mt-0.5">Overdue</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6 text-xs font-bold text-slate-400">
                                                    {ack.notifiedAt}
                                                </TableCell>
                                                <TableCell className="px-8 py-6 text-xs font-black text-emerald-500 bg-emerald-50/20">
                                                    {ack.signedAt || '-'}
                                                </TableCell>
                                                <TableCell className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => setHistoryAck(ack)}>
                                                            <History size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => {
                                                            setRefreshKey(prev => prev + 1);
                                                            setSearchQuery("");
                                                            setStatusFilter("all");
                                                            toast.success(`Compliance status refreshed for ${ack.employeeName}`);
                                                        }}>
                                                            <RefreshCw size={16} />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white hover:shadow-sm rounded-xl border-none">
                                                                    <MoreHorizontal size={16} className="text-slate-400" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border border-slate-200 shadow-2xl bg-white font-sans">
                                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wide">Compliance Control</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => setEditingAck(ack)}>
                                                                    <FileText className="w-4 h-4 text-indigo-500" /> Edit Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => setPriorityAck(ack)} disabled={ack.status === 'Signed'}>
                                                                    <Bell className="w-4 h-4 text-indigo-500" /> Priority Remind
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => {
                                                                    updateAcknowledgement(ack.id, "Signed", "Manually marked as signed by HR");
                                                                    toast.success(`${ack.employeeName}'s acknowledgement force-marked as Signed`);
                                                                }}>
                                                                    <UserCheck className="w-4 h-4 text-indigo-500" /> Force Mark Signed
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50 text-start" onClick={() => setDeleteAckId(ack.id)}>
                                                                    <Trash2 className="w-4 h-4" /> Cancel Request
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                        {filteredAcks.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                                    <CheckCircle2 size={32} className="text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">System is fully compliant</h3>
                                <p className="text-slate-400 font-bold text-xs mt-2 tracking-wide max-w-[320px] mx-auto">No pending acknowledgement requests found for current filters.</p>
                                <Button className="mt-8 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-8 font-black text-[10px] tracking-wide shadow-lg transition-all" onClick={() => setIsRequestOpen(true)}>
                                    Issue New Request
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>

            {/* History Dialog */}
            <Dialog open={!!historyAck} onOpenChange={(open) => !open && setHistoryAck(null)}>
                <DialogContent className="max-w-lg bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="text-start">
                        <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 border border-indigo-100">
                            <History size={22} className="text-indigo-600" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Acknowledgement History</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                            Event log for {historyAck?.employeeName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4 text-start">
                        <div className="space-y-4">
                            {[
                                { event: "Request Created", date: historyAck?.notifiedAt || "N/A", detail: `Document: ${historyAck?.documentTitle}` },
                                { event: "Notification Sent", date: historyAck?.notifiedAt || "N/A", detail: "Email dispatched to employee" },
                                ...(historyAck?.status === "Viewed" || historyAck?.status === "Signed" ? [{ event: "Document Viewed", date: historyAck?.signedAt || "Recently", detail: "Employee opened the document" }] : []),
                                ...(historyAck?.status === "Signed" ? [{ event: "Document Signed", date: historyAck?.signedAt || "N/A", detail: "E-signature confirmed" }] : []),
                            ].map((entry, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="w-0.5 bg-slate-100 group-hover:bg-indigo-300 transition-colors relative">
                                        <div className="absolute top-0 -left-[3px] h-2 w-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                                    </div>
                                    <div className="min-w-0 pb-4">
                                        <p className="text-xs font-bold text-slate-900 tracking-tight">{entry.event}</p>
                                        <p className="text-[9px] text-slate-400 font-bold tracking-tighter">{entry.date}</p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{entry.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6" onClick={() => setHistoryAck(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Acknowledgement Dialog */}
            <Dialog open={!!editingAck} onOpenChange={(open) => !open && setEditingAck(null)}>
                <DialogContent className="max-w-xl bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Edit Acknowledgement</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-tight mt-2">
                            Update acknowledgement request details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-6">
                        <div className="space-y-3 text-start">
                            <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Document</label>
                            <Select
                                value={editingAck?.documentId}
                                onValueChange={(val) => {
                                    const doc = policies.find(p => p.id === val);
                                    setEditingAck(prev => prev ? { ...prev, documentId: val, documentTitle: doc?.title || prev.documentTitle } : null);
                                }}
                            >
                                <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-slate-200 shadow-2xl p-2 font-bold text-xs font-sans">
                                    {policies.map(p => (
                                        <SelectItem key={p.id} value={p.id} className="rounded-xl h-10">{p.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3 text-start">
                                <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Employee Name</label>
                                <Input
                                    value={editingAck?.employeeName || ""}
                                    onChange={(e) => setEditingAck(prev => prev ? { ...prev, employeeName: e.target.value } : null)}
                                    className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-3 text-start">
                                <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Employee Id</label>
                                <Input
                                    value={editingAck?.employeeId || ""}
                                    onChange={(e) => setEditingAck(prev => prev ? { ...prev, employeeId: e.target.value } : null)}
                                    className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3 text-start">
                                <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Status</label>
                                <Select
                                    value={editingAck?.status}
                                    onValueChange={(val: Acknowledgement['status']) => setEditingAck(prev => prev ? { ...prev, status: val, signedAt: val === 'Signed' ? (prev.signedAt || new Date().toISOString().split('T')[0]) : prev.signedAt } : null)}
                                >
                                    <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border border-slate-200 shadow-2xl p-2 font-bold text-xs font-sans">
                                        <SelectItem value="Pending" className="rounded-xl h-10">Pending</SelectItem>
                                        <SelectItem value="Viewed" className="rounded-xl h-10">Viewed</SelectItem>
                                        <SelectItem value="Signed" className="rounded-xl h-10">Signed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3 text-start">
                                <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Due Date</label>
                                <Input
                                    type="date"
                                    value={editingAck?.dueDate || ""}
                                    onChange={(e) => setEditingAck(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                                    className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-3 text-start">
                            <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Comments</label>
                            <Input
                                placeholder="Optional notes"
                                value={editingAck?.comments || ""}
                                onChange={(e) => setEditingAck(prev => prev ? { ...prev, comments: e.target.value } : null)}
                                className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setEditingAck(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Cancel</Button>
                        <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Priority Remind Confirm */}
            <Dialog open={!!priorityAck} onOpenChange={(open) => !open && setPriorityAck(null)}>
                <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="text-start">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 border border-rose-100">
                            <Bell size={22} className="text-rose-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Send Priority Reminder?</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                            A high-priority push notification and email will be sent to <span className="text-slate-700">{priorityAck?.employeeName}</span>. The request will be marked as priority.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setPriorityAck(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={handlePriorityRemind}>Send Priority</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Single */}
            <Dialog open={!!deleteAckId} onOpenChange={(open) => !open && setDeleteAckId(null)}>
                <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="text-start">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 border border-rose-100">
                            <Trash2 size={22} className="text-rose-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Cancel Request?</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                            This acknowledgement request will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setDeleteAckId(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Keep Request</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={confirmDelete}>Cancel Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete */}
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="text-start">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 border border-rose-100">
                            <Trash2 size={22} className="text-rose-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Cancel {selectedAckIds.length} Requests?</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                            All selected acknowledgement requests will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setBulkDeleteOpen(false)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={confirmBulkDelete}>Delete All</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AcknowledgementsPage;
