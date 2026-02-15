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

const AcknowledgementsPage = () => {
    const { acknowledgements, policies, requestAcknowledgement, deleteAcknowledgement } = useDocumentsStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [selectedAckIds, setSelectedAckIds] = useState<string[]>([]);

    const [newRequest, setNewRequest] = useState({
        documentId: "",
        documentTitle: "",
        employeeId: "",
        employeeName: ""
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

    const handleRequest = () => {
        if (!newRequest.documentId || !newRequest.employeeName) {
            toast.error("Please fill in all fields");
            return;
        }
        const doc = policies.find(p => p.id === newRequest.documentId);
        requestAcknowledgement({
            ...newRequest,
            documentTitle: doc?.title || "Document"
        });
        setIsRequestOpen(false);
        setNewRequest({ documentId: "", documentTitle: "", employeeId: "", employeeName: "" });
        toast.success("Acknowledgement request sent");
    };

    const toggleSelect = (id: string) => {
        setSelectedAckIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        selectedAckIds.forEach(id => deleteAcknowledgement(id));
        setSelectedAckIds([]);
        toast.success(`${selectedAckIds.length} requests terminated`);
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
                        <Button variant="outline" className="h-11 border-slate-200 rounded-xl font-bold text-[10px] tracking-wide px-6 hover:bg-slate-50 transition-all" onClick={() => toast.success("Dispatching sequence of automated follow-ups")}>
                            <Mail className="w-4 h-4 mr-2" /> Send Reminders
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
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs font-sans">
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
                    <Card className="border border-slate-100 shadow-sm rounded-[2rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
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

                    <Card className="border border-slate-100 shadow-sm rounded-[2rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
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

                    <Card className="border border-slate-100 shadow-sm rounded-[2rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
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

                    <Card className="border border-indigo-100 shadow-sm rounded-[2rem] bg-indigo-50/50 p-7 relative overflow-hidden group cursor-pointer hover:bg-white transition-all duration-500">
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
                                        onClick={handleBulkDelete}
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
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-xs">
                                        <SelectItem value="all" className="rounded-lg h-10">All Status</SelectItem>
                                        <SelectItem value="Pending" className="rounded-lg h-10 text-slate-500">Pending</SelectItem>
                                        <SelectItem value="Viewed" className="rounded-lg h-10 text-amber-500">Viewed</SelectItem>
                                        <SelectItem value="Signed" className="rounded-lg h-10 text-emerald-500">Signed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-[10px] tracking-wide px-6 hover:bg-slate-50 transition-all" onClick={() => toast.success("Generating compliance audit report (.XLSX)")}>
                                    <Download size={16} className="mr-2" /> Export Report
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
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
                                                    {getStatusBadge(ack.status)}
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
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => toast.success(`Viewing event log for ${ack.employeeName}`)}>
                                                            <History size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => toast.success("Synchronizing compliance status")}>
                                                            <RefreshCw size={16} />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white hover:shadow-sm rounded-xl border-none">
                                                                    <MoreHorizontal size={16} className="text-slate-400" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl bg-white font-sans">
                                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wide">Compliance Control</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => toast.success("High-priority ping relayed to employee device")}>
                                                                    <Bell className="w-4 h-4 text-indigo-500" /> Priority Remind
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => toast.success("Document state updated to 'Manually Signed'")}>
                                                                    <UserCheck className="w-4 h-4 text-indigo-500" /> Force Mark Signed
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50 text-start" onClick={() => deleteAcknowledgement(ack.id)}>
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
        </div>
    );
};

export default AcknowledgementsPage;
