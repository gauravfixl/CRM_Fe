"use client"

import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Search, Filter, ArrowUpDown, MoreHorizontal, Check, Download, Trash2, ShieldAlert, History, User } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useAttendanceStore } from "@/shared/data/attendance-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const AttendanceApprovalsPage = () => {
    const { logs, approveRegularization, rejectRegularization, approveBulkRegularization, rejectBulkRegularization } = useAttendanceStore();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);

    // Filter logs with Pending Regularization and search term
    const pendingRequests = logs.filter(l =>
        l.regularizationStatus === 'Pending' &&
        (l.empName.toLowerCase().includes(searchTerm.toLowerCase()) || (l.remark?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
    );

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        if (selectedIds.length === pendingRequests.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pendingRequests.map(r => r.id));
        }
    };

    const handleApprove = (id: string) => {
        approveRegularization(id);
        toast({ title: "Approved", description: "Attendance record updated successfully." });
    };

    const handleReject = (id: string) => {
        rejectRegularization(id);
        toast({ title: "Rejected", description: "Correction request has been denied.", variant: "destructive" });
    };

    const handleBulkApprove = () => {
        approveBulkRegularization(selectedIds);
        toast({ title: "Bulk Approved", description: `${selectedIds.length} records have been successfully updated.` });
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        rejectBulkRegularization(selectedIds);
        toast({ title: "Bulk Rejected", description: `${selectedIds.length} requests have been rejected.`, variant: "destructive" });
        setSelectedIds([]);
    };

    const handleExport = () => {
        const headers = ["Log ID", "Employee", "Date", "Original Status", "Remark", "Proposed In", "Proposed Out"];
        const csvContent = [
            headers.join(","),
            ...pendingRequests.map(r => [r.id, r.empName, r.date, r.status, r.remark, r.checkIn || 'N/A', r.checkOut || 'N/A'].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_pending_approvals_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast({ title: "Export Success", description: "Current pending list exported to CSV." });
    }

    const openAuditTrail = (log: any) => {
        setSelectedLog(log);
        setIsAuditOpen(true);
    };

    const flagRequest = (name: string) => {
        toast({
            title: "Security Flag Raised",
            description: `Request from ${name} has been flagged for administrative investigation.`,
            variant: "destructive"
        });
    }

    return (
        <div className="flex-1 bg-[#fcfdff] overflow-x-hidden overflow-y-auto min-h-screen">
            <div style={{ zoom: '0.6' }} className="p-12 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-3 border-b border-slate-100">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Attendance Approvals</h1>
                        <p className="text-slate-500 font-bold text-lg mt-2">Manage and review employee time correction requests.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6366f1] transition-colors" size={20} />
                            <Input
                                placeholder="Search by name or reason..."
                                className="h-12 pl-12 rounded-2xl bg-white border-slate-200 focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/5 font-bold transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 shadow-sm" onClick={handleExport}>
                            <Download size={20} className="mr-2" /> Export
                        </Button>
                    </div>
                </div>

                {/* Bulk Action Bar */}
                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-slate-900 text-white p-6 rounded-[2rem] flex items-center justify-between shadow-2xl sticky top-4 z-30"
                        >
                            <div className="flex items-center gap-6 ml-4">
                                <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold">
                                    {selectedIds.length}
                                </div>
                                <p className="font-bold text-lg">Requests selected for batch processing</p>
                            </div>
                            <div className="flex gap-3">
                                <Button className="bg-emerald-500 hover:bg-emerald-600 h-12 px-8 rounded-xl font-bold shadow-lg shadow-emerald-900/20" onClick={handleBulkApprove}>
                                    <Check size={20} className="mr-2" /> Approve selected
                                </Button>
                                <Button className="bg-rose-500 hover:bg-rose-600 h-12 px-8 rounded-xl font-bold shadow-lg shadow-rose-900/20" onClick={handleBulkReject}>
                                    <XCircle size={20} className="mr-2" /> Reject selected
                                </Button>
                                <Button variant="ghost" className="text-slate-400 hover:text-white h-12 px-6 rounded-xl font-bold" onClick={() => setSelectedIds([])}>
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Card */}
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden p-0 relative">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Checkbox
                                checked={selectedIds.length === pendingRequests.length && pendingRequests.length > 0}
                                onCheckedChange={toggleAll}
                                className="h-6 w-6 rounded-lg border-slate-300 data-[state=checked]:bg-[#6366f1] data-[state=checked]:border-[#6366f1]"
                            />
                            <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-bold text-2xl text-slate-900 tracking-tight">Active requests ({pendingRequests.length})</h3>
                        </div>
                        <p className="text-slate-400 font-bold text-sm">Select requests for bulk authorization</p>
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className="text-center p-32">
                            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-8 font-bold shadow-sm border border-slate-100">
                                <Clock size={48} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-300 tracking-tight mb-2">Workspace clear!</h4>
                            <p className="text-slate-400 font-bold">No pending attendance correction requests found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {pendingRequests.map((req, i) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`p-6 hover:bg-slate-50/50 transition-all group flex items-start gap-8 ${selectedIds.includes(req.id) ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <Checkbox
                                        checked={selectedIds.includes(req.id)}
                                        onCheckedChange={() => toggleSelection(req.id)}
                                        className="mt-1 h-6 w-6 rounded-lg border-slate-300 data-[state=checked]:bg-[#6366f1] data-[state=checked]:border-[#6366f1]"
                                    />

                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <Badge className="bg-slate-900 text-white border-none font-bold px-5 py-2 rounded-xl text-xs tracking-wide shadow-sm">{req.empName}</Badge>
                                            <div className="h-1.5 w-1.5 bg-slate-200 rounded-full" />
                                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{new Date(req.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <Badge variant="outline" className="ml-auto bg-white text-indigo-500 border-indigo-100 font-bold rounded-lg px-3">{req.department}</Badge>
                                        </div>

                                        <div className="bg-white/50 p-4 rounded-[1.5rem] border border-slate-100/50 shadow-inner">
                                            <p className="text-slate-500 font-bold text-xs tracking-wider mb-2">Correction context:</p>
                                            <p className="text-slate-800 font-bold text-lg leading-relaxed">&ldquo;{req.remark}&rdquo;</p>
                                        </div>

                                        <div className="flex flex-wrap gap-8 items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100/30">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">Proposed log-in</p>
                                                <p className="font-bold text-slate-900 text-base flex items-center gap-2">
                                                    <Clock size={16} className="text-indigo-400" /> {req.checkIn || '--:--'}
                                                </p>
                                            </div>
                                            <div className="h-8 w-px bg-slate-200" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">Proposed log-out</p>
                                                <p className="font-bold text-slate-900 text-base flex items-center gap-2">
                                                    <Clock size={16} className="text-rose-400" /> {req.checkOut || '--:--'}
                                                </p>
                                            </div>
                                            <div className="h-8 w-px bg-slate-200" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">Status change</p>
                                                <Badge className="bg-amber-100 text-amber-700 border-none font-bold">Regularization</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 min-w-[150px]">
                                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-10 shadow-lg shadow-emerald-100 hover:scale-[1.02] transition-all text-sm" onClick={() => handleApprove(req.id)}>
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button variant="outline" className="w-full text-rose-500 border-rose-100 hover:bg-rose-50 rounded-xl font-bold h-10 hover:scale-[1.02] transition-all shadow-sm text-sm" onClick={() => handleReject(req.id)}>
                                            <XCircle className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="w-full h-10 rounded-xl text-slate-400 font-bold hover:bg-slate-50">
                                                    <MoreHorizontal className="h-5 w-5 mr-2" /> More options
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-48 font-bold">
                                                <DropdownMenuItem className="rounded-xl p-3 cursor-pointer" onClick={() => openAuditTrail(req)}>
                                                    <History size={16} className="mr-2" /> View full audit trail
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl p-3 cursor-pointer hover:bg-slate-50" onClick={() => toast({ title: "Profile Access", description: `Redirecting to ${req.empName}'s personnel file...` })}>
                                                    <User size={16} className="mr-2" /> View detailed profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl p-3 cursor-pointer text-rose-500" onClick={() => flagRequest(req.empName)}>
                                                    <ShieldAlert size={16} className="mr-2" /> Flag for investigation
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Audit Trail Dialog */}
                <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                    <DialogContent className="max-w-2xl rounded-[2.5rem] border-none p-10 bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                <History className="text-indigo-500" /> Full Audit Trail: {selectedLog?.empName}
                            </DialogTitle>
                            <DialogDescription className="font-bold text-slate-400">
                                Complete sequence of events for correction ID: {selectedLog?.id}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-8 py-8">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    <div className="w-0.5 h-16 bg-slate-100" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">Original Log Generated</p>
                                    <p className="text-sm font-bold text-slate-400">Date: {selectedLog?.date} | Status: {selectedLog?.status}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                                    <div className="w-0.5 h-16 bg-slate-100" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">Correction Request Submitted</p>
                                    <p className="text-sm font-bold text-slate-400">Reason provided: &ldquo;{selectedLog?.remark}&rdquo;</p>
                                    <p className="text-xs font-bold text-indigo-400 mt-1">By Employee via Self-Service Portal</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="h-3 w-3 border-2 border-slate-200 rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-400">Pending Admin Approval</p>
                                    <p className="text-sm font-bold text-slate-300">Awaiting final authorization by HR Management Team.</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-lg" onClick={() => setIsAuditOpen(false)}>
                                Close trail
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
};

export default AttendanceApprovalsPage;
