"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    CheckCircle2,
    Clock,
    Check,
    X,
    MessageSquare,
    MoreHorizontal,
    Plus,
    FileText,
    Download,
    Eye
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/components/ui/use-toast";
import { useTeamStore } from "@/shared/data/team-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import {
    createLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    getPendingLeaveRequests,
    getActiveLeaveTypes,
} from "@/modules/hrm/hooks/hrmHooks";
import { validateLeaveForm, ValidationErrors } from "@/shared/utils/form-validation";

const TeamLeavePage = () => {
    const { leaves, members, approveLeave, rejectLeave, cancelLeave, addLeave } = useTeamStore();
    const { toast } = useToast();

    const [view, setView] = useState<'pending' | 'history'>('pending');
    const [selectedLeave, setSelectedLeave] = useState<any>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [backendAvailable, setBackendAvailable] = useState(true);
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<ValidationErrors>({});

    // Sync with backend on mount
    React.useEffect(() => {
        const syncBackend = async () => {
            try {
                const [pendingRes, typesRes] = await Promise.all([
                    getPendingLeaveRequests().catch(() => null),
                    getActiveLeaveTypes().catch(() => null),
                ]);
                const pending = pendingRes?.data?.data ?? pendingRes?.data ?? [];
                const types = typesRes?.data?.data ?? typesRes?.data ?? [];
                if (Array.isArray(types) && types.length > 0) setLeaveTypes(types);

                if (Array.isArray(pending) && pending.length > 0) {
                    const store = useTeamStore.getState();
                    const existingIds = new Set(store.leaves.map(l => l.id));
                    pending.forEach((p: any) => {
                        const id = String(p._id || p.id);
                        if (!existingIds.has(id)) {
                            store.addLeave({
                                empId: String(p.employee?._id || p.employee || ""),
                                empName: `${p.employee?.firstName || ''} ${p.employee?.lastName || ''}`.trim() || "Unknown",
                                type: p.leaveType?.name || "Leave",
                                startDate: p.startDate ? new Date(p.startDate).toISOString().slice(0, 10) : "",
                                endDate: p.endDate ? new Date(p.endDate).toISOString().slice(0, 10) : "",
                                days: p.totalDays || 1,
                                reason: p.reason || "",
                            });
                        }
                    });
                }
                setBackendAvailable(true);
            } catch {
                setBackendAvailable(false);
            }
        };
        syncBackend();
    }, []);

    // Add Leave form state
    const [leaveForm, setLeaveForm] = useState({
        empId: "",
        type: "Casual Leave",
        startDate: "",
        endDate: "",
        reason: "",
    });

    const pendingLeaves = (leaves || []).filter(l => l.status === 'Pending');
    const processedLeaves = (leaves || []).filter(l => l.status !== 'Pending');

    const stats = [
        { label: "Pending Actions", value: pendingLeaves.length, color: "bg-amber-100", icon: <Clock className="text-amber-600" />, textColor: "text-amber-900" },
        {
            label: "On Leave Today",
            value: (leaves || []).filter(l => l.status === 'Approved' && new Date(l.startDate) <= new Date() && new Date(l.endDate) >= new Date()).length,
            color: "bg-emerald-100",
            icon: <Calendar className="text-emerald-600" />,
            textColor: "text-emerald-900"
        },
        {
            label: "Upcoming Leaves",
            value: (leaves || []).filter(l => l.status === 'Approved' && new Date(l.startDate) > new Date()).length,
            color: "bg-indigo-100",
            icon: <Calendar className="text-indigo-600" />,
            textColor: "text-indigo-900"
        },
    ];

    const handleAction = async (id: string, action: 'Approve' | 'Reject') => {
        setIsSubmitting(true);
        try {
            if (backendAvailable) {
                if (action === 'Approve') await approveLeaveRequest(id);
                else await rejectLeaveRequest(id, "Not approved");
            }
            if (action === 'Approve') approveLeave(id);
            else rejectLeave(id);
            toast({
                title: `Application ${action}d`,
                description: `The leave request has been ${action.toLowerCase()}ed successfully.`,
                variant: action === 'Approve' ? 'default' : 'destructive'
            });
        } catch (err) {
            if (action === 'Approve') approveLeave(id);
            else rejectLeave(id);
            toast({ title: "Saved Locally", description: "Backend unavailable — updated local state.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewApplication = (leave: any) => {
        setSelectedLeave(leave);
        setViewOpen(true);
    };

    const handleDownloadCertificate = (leave: any) => {
        const content = `LEAVE CERTIFICATE\n\nEmployee: ${leave.empName}\nEmployee ID: ${leave.empId}\nLeave Type: ${leave.type}\nFrom: ${leave.startDate}\nTo: ${leave.endDate}\nDuration: ${leave.days} day(s)\nReason: ${leave.reason}\nStatus: ${leave.status}\n\nGenerated on: ${new Date().toLocaleDateString()}\n\n--- End of Certificate ---`;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Leave_Certificate_${leave.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Certificate Downloaded", description: `Certificate for ${leave.empName} has been saved.` });
    };

    const handleCancelLeave = (leave: any) => {
        cancelLeave(leave.id);
        toast({ title: "Leave Cancelled", description: `Record removed from history.`, variant: "destructive" });
    };

    const calculateDays = (start: string, end: string) => {
        if (!start || !end) return 0;
        const s = new Date(start);
        const e = new Date(end);
        return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    };

    const handleAddLeave = async () => {
        const errors = validateLeaveForm(leaveForm);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast({ title: "Please fix form errors", description: "Some fields are invalid.", variant: "destructive" });
            return;
        }
        setFormErrors({});
        setIsSubmitting(true);

        const member = (members || []).find(m => m.id === leaveForm.empId);

        try {
            if (backendAvailable) {
                const matchedType = leaveTypes.find((lt: any) =>
                    (lt.name || "").toLowerCase() === leaveForm.type.toLowerCase()
                );
                if (matchedType?._id) {
                    await createLeaveRequest({
                        leaveType: matchedType._id,
                        startDate: leaveForm.startDate,
                        endDate: leaveForm.endDate,
                        reason: leaveForm.reason,
                    });
                }
            }
            addLeave({
                empId: leaveForm.empId,
                empName: member?.name || "Unknown",
                type: leaveForm.type,
                startDate: leaveForm.startDate,
                endDate: leaveForm.endDate,
                days: calculateDays(leaveForm.startDate, leaveForm.endDate),
                reason: leaveForm.reason,
            });
            toast({ title: "Leave Applied", description: `Request added to pending queue for ${member?.name}.` });
            setAddOpen(false);
            setLeaveForm({ empId: "", type: "Casual Leave", startDate: "", endDate: "", reason: "" });
        } catch (err) {
            addLeave({
                empId: leaveForm.empId,
                empName: member?.name || "Unknown",
                type: leaveForm.type,
                startDate: leaveForm.startDate,
                endDate: leaveForm.endDate,
                days: calculateDays(leaveForm.startDate, leaveForm.endDate),
                reason: leaveForm.reason,
            });
            toast({ title: "Saved Locally", description: "Backend unavailable — leave added locally.", variant: "destructive" });
            setAddOpen(false);
            setLeaveForm({ empId: "", type: "Casual Leave", startDate: "", endDate: "", reason: "" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 text-start" style={{ zoom: "90%" }}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Team Leave Requests</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Review and manage leave applications from your direct reports.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 bg-slate-100/50 p-1 rounded-xl">
                        <Button
                            variant={view === 'pending' ? 'default' : 'ghost'}
                            className={`rounded-lg h-9 font-bold text-[10px] tracking-widest transition-all ${view === 'pending' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            onClick={() => setView('pending')}
                        >
                            Pending ({pendingLeaves.length})
                        </Button>
                        <Button
                            variant={view === 'history' ? 'default' : 'ghost'}
                            className={`rounded-lg h-9 font-bold text-[10px] tracking-widest transition-all ${view === 'history' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            onClick={() => setView('history')}
                        >
                            History
                        </Button>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-10 px-5 text-[10px] tracking-widest border-none shadow-md" onClick={() => setAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Apply Leave
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-5">
                {stats.map((stat, i) => (
                    <motion.div key={i} className="min-w-[200px] flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} p-4 flex items-center gap-3 border border-white/20 h-full`}>
                            <div className="h-10 w-10 bg-white/40 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm ring-1 ring-white/30">
                                {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
                            </div>
                            <div>
                                <p className={`text-[10px] font-bold tracking-widest ${stat.textColor} opacity-60 mb-1`}>{stat.label}</p>
                                <h3 className={`text-xl font-bold ${stat.textColor} tracking-tight leading-none`}>{stat.value}</h3>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {view === 'pending' ? (
                    <motion.div
                        key="pending"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-5"
                    >
                        <div className="bg-amber-100 p-6 rounded-[2rem] border border-amber-200 shadow-inner">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 ml-2">Inbox ({pendingLeaves.length})</h2>
                            {pendingLeaves.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {pendingLeaves.map((leave) => {
                                        const member = (members || []).find(m => m.id === leave.empId);
                                        return (
                                            <Card key={leave.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white p-6 group overflow-hidden relative border border-white/50">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                                <div className="flex items-start justify-between mb-6 relative z-10">
                                                    <div className="flex items-center gap-4 text-start">
                                                        <Avatar className="h-11 w-11 ring-2 ring-slate-50 shadow-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                                                            <AvatarFallback>{member?.avatar || leave.empName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="font-bold text-lg text-slate-900 leading-tight tracking-tight">{leave.empName}</h3>
                                                            <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[10px] tracking-widest px-3 py-1 mt-1.5 shadow-none rounded-lg">
                                                                {leave.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-2xl text-slate-900 leading-none">{leave.days}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1.5 opacity-60">Days</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-5 relative z-10">
                                                    <div className="p-4 bg-slate-50/50 rounded-2xl space-y-3 border border-slate-100/30 text-start cursor-pointer" onClick={() => handleViewApplication(leave)}>
                                                        <div className="flex items-center gap-3 text-slate-700 font-bold text-[13px]">
                                                            <Calendar size={14} className="text-indigo-500" />
                                                            <span>{new Date(leave.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(leave.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <MessageSquare size={14} className="text-slate-400 mt-1 shrink-0" />
                                                            <p className="text-[13px] text-slate-500 font-bold leading-relaxed opacity-80 line-clamp-2">{leave.reason}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3 mt-2">
                                                        <Button
                                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-11 text-xs shadow-md border-none transition-all tracking-wide"
                                                            onClick={() => handleAction(leave.id, 'Approve')}
                                                        >
                                                            <Check className="mr-2 h-4 w-4" /> Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="px-5 border-rose-100 text-rose-500 hover:bg-rose-50 font-bold rounded-xl h-11 border-none shadow-sm bg-rose-50/50"
                                                            onClick={() => handleAction(leave.id, 'Reject')}
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="px-5 border-slate-100 text-slate-500 hover:bg-slate-50 font-bold rounded-xl h-11 border-none shadow-sm bg-slate-50/50"
                                                            onClick={() => handleViewApplication(leave)}
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Card className="border-none shadow-sm rounded-3xl bg-white p-12 text-center border border-white/50">
                                    <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <CheckCircle2 className="text-emerald-500" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">All Caught Up!</h3>
                                    <p className="text-slate-400 font-medium text-xs mt-2">No pending leave requests to review.</p>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <div className="bg-indigo-100 p-6 rounded-[2rem] border border-indigo-200 shadow-inner">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 ml-2">Processed Requests ({processedLeaves.length})</h2>
                            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden border border-white/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-indigo-100/50">
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500">Employee</th>
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500">Type</th>
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500">Dates</th>
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 text-center">Days</th>
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 text-center">Status</th>
                                                <th className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100/50">
                                            {processedLeaves.length === 0 ? (
                                                <tr><td colSpan={6} className="text-center py-12 text-xs text-slate-400 font-bold">No processed leaves yet.</td></tr>
                                            ) : processedLeaves.map((leave) => (
                                                <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9 ring-2 ring-slate-50 shadow-sm bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                                                                <AvatarFallback>{leave.empName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-bold text-slate-900 text-sm tracking-tight">{leave.empName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] px-2 py-0.5 rounded-md shadow-none">
                                                            {leave.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-slate-700 text-xs">{new Date(leave.startDate).toLocaleDateString()}</span>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">to {new Date(leave.endDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className="font-bold text-slate-900 text-lg">{leave.days}</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <Badge className={`${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} border-none font-bold px-3 py-1.5 rounded-lg text-[9px] tracking-widest shadow-none`}>
                                                            {leave.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none">
                                                                    <MoreHorizontal size={14} className="text-slate-400" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-none shadow-xl bg-white min-w-[180px]">
                                                                <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2.5 rounded-lg cursor-pointer focus:bg-indigo-50" onClick={() => handleViewApplication(leave)}>
                                                                    <Eye className="h-3.5 w-3.5 mr-2 text-indigo-600" /> View Application
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2.5 rounded-lg cursor-pointer focus:bg-emerald-50" onClick={() => handleDownloadCertificate(leave)}>
                                                                    <Download className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Download Certificate
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2.5 rounded-lg cursor-pointer focus:bg-rose-50 text-rose-600" onClick={() => handleCancelLeave(leave)}>
                                                                    <X className="h-3.5 w-3.5 mr-2" /> Remove Record
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Application Dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-600" /> Leave Application
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm">ID: {selectedLeave?.id}</DialogDescription>
                    </DialogHeader>
                    {selectedLeave && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <Avatar className="h-12 w-12 ring-2 ring-white shadow-md bg-indigo-50 text-indigo-700 font-bold">
                                    <AvatarFallback>{selectedLeave.empName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">{selectedLeave.empName}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{selectedLeave.empId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Type</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedLeave.type}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Days</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedLeave.days}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Start</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{new Date(selectedLeave.startDate).toLocaleDateString()}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">End</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase mb-2">Reason</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{selectedLeave.reason}</p>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Status</p>
                                <Badge className={`${selectedLeave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : selectedLeave.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'} border-none font-bold`}>
                                    {selectedLeave.status}
                                </Badge>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        {selectedLeave?.status === 'Pending' && (
                            <>
                                <Button variant="outline" className="border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl h-10 font-bold" onClick={() => { handleAction(selectedLeave.id, 'Reject'); setViewOpen(false); }}>
                                    Reject
                                </Button>
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-10 font-bold border-none" onClick={() => { handleAction(selectedLeave.id, 'Approve'); setViewOpen(false); }}>
                                    Approve
                                </Button>
                            </>
                        )}
                        {selectedLeave?.status !== 'Pending' && (
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold border-none" onClick={() => handleDownloadCertificate(selectedLeave)}>
                                <Download className="mr-2 h-4 w-4" /> Download Certificate
                            </Button>
                        )}
                        <Button variant="outline" className="rounded-xl h-10 font-bold" onClick={() => setViewOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Leave Dialog */}
            <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) setFormErrors({}); }}>
                <DialogContent className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">Apply Leave on Behalf</DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm mt-1">
                            Submit a leave application for a team member.
                            {!backendAvailable && <span className="text-amber-600"> (Offline — local only)</span>}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1">
                            <Label className="font-bold text-slate-700 text-xs">Employee *</Label>
                            <Select value={leaveForm.empId} onValueChange={v => { setLeaveForm({ ...leaveForm, empId: v }); if (formErrors.empId) setFormErrors({ ...formErrors, empId: "" }); }}>
                                <SelectTrigger className={`rounded-xl bg-slate-50 border h-11 font-bold text-sm ${formErrors.empId ? 'border-rose-400' : 'border-slate-200'}`}>
                                    <SelectValue placeholder="Select team member" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                                    {(members || []).map(m => (
                                        <SelectItem key={m.id} value={m.id} className="font-bold text-xs">{m.name} • {m.designation}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.empId && <p className="text-[11px] font-medium text-rose-500">{formErrors.empId}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label className="font-bold text-slate-700 text-xs">Leave Type *</Label>
                            <Select value={leaveForm.type} onValueChange={v => setLeaveForm({ ...leaveForm, type: v })}>
                                <SelectTrigger className="rounded-xl bg-slate-50 border border-slate-200 h-11 font-bold text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                                    {leaveTypes.length > 0
                                        ? leaveTypes.map((lt: any) => (
                                            <SelectItem key={lt._id || lt.name} value={lt.name} className="font-bold text-xs">{lt.name}</SelectItem>
                                        ))
                                        : [
                                            "Casual Leave", "Sick Leave", "Earned Leave", "Maternity Leave", "Paternity Leave"
                                        ].map(t => (
                                            <SelectItem key={t} value={t} className="font-bold text-xs">{t}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="font-bold text-slate-700 text-xs">Start Date *</Label>
                                <Input type="date" value={leaveForm.startDate} onChange={e => { setLeaveForm({ ...leaveForm, startDate: e.target.value }); if (formErrors.startDate) setFormErrors({ ...formErrors, startDate: "" }); }} className={`rounded-xl bg-slate-50 border h-11 font-bold text-sm ${formErrors.startDate ? 'border-rose-400' : 'border-slate-200'}`} />
                                {formErrors.startDate && <p className="text-[11px] font-medium text-rose-500">{formErrors.startDate}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label className="font-bold text-slate-700 text-xs">End Date *</Label>
                                <Input type="date" value={leaveForm.endDate} onChange={e => { setLeaveForm({ ...leaveForm, endDate: e.target.value }); if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: "" }); }} className={`rounded-xl bg-slate-50 border h-11 font-bold text-sm ${formErrors.endDate ? 'border-rose-400' : 'border-slate-200'}`} />
                                {formErrors.endDate && <p className="text-[11px] font-medium text-rose-500">{formErrors.endDate}</p>}
                            </div>
                        </div>
                        {leaveForm.startDate && leaveForm.endDate && !formErrors.endDate && (
                            <div className="text-xs font-bold text-indigo-600">Total: {calculateDays(leaveForm.startDate, leaveForm.endDate)} day(s)</div>
                        )}
                        <div className="space-y-1">
                            <Label className="font-bold text-slate-700 text-xs">Reason * (min 10 chars)</Label>
                            <Textarea value={leaveForm.reason} onChange={e => { setLeaveForm({ ...leaveForm, reason: e.target.value }); if (formErrors.reason) setFormErrors({ ...formErrors, reason: "" }); }} rows={3} placeholder="Purpose of the leave..." className={`rounded-xl bg-slate-50 border font-medium text-sm ${formErrors.reason ? 'border-rose-400' : 'border-slate-200'}`} />
                            {formErrors.reason && <p className="text-[11px] font-medium text-rose-500">{formErrors.reason}</p>}
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl h-10 font-bold" onClick={() => { setAddOpen(false); setFormErrors({}); }}>Cancel</Button>
                        <Button disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold border-none disabled:opacity-50" onClick={handleAddLeave}>
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TeamLeavePage;
