"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    UserCheck,
    UserX,
    Calendar,
    Search,
    ArrowUpRight,
    MoreVertical,
    Clock,
    History,
    Edit,
    CheckCircle2
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import { approveRegularization, rejectRegularization } from "@/modules/hrm/hooks/hrmHooks";
import { validateCorrectionForm, ValidationErrors } from "@/shared/utils/form-validation";

interface RegularizationRequest {
    id: string;
    empId: string;
    empName: string;
    date: string;
    time: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_REGULARIZATIONS: RegularizationRequest[] = [
    { id: "REG001", empId: "EMP003", empName: "Rahul Sharma", date: "Yesterday", time: "10:15 AM", reason: "Metro Delay", status: "pending" },
    { id: "REG002", empId: "EMP004", empName: "Priya Verma", date: "21 Jan", time: "09:30 AM", reason: "Bio-metric failure", status: "pending" },
];

const TeamAttendancePage = () => {
    const { members, attendance, updateAttendance, markAttendance } = useTeamStore();
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState("");
    const [regularizations, setRegularizations] = useState<RegularizationRequest[]>(INITIAL_REGULARIZATIONS);
    const [backendAvailable, setBackendAvailable] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [correctionErrors, setCorrectionErrors] = useState<ValidationErrors>({});

    // Dialog states
    const [logsOpen, setLogsOpen] = useState(false);
    const [correctionOpen, setCorrectionOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [detailRecord, setDetailRecord] = useState<any | null>(null);
    const [detailReg, setDetailReg] = useState<RegularizationRequest | null>(null);

    // Correction form state
    const [correctionStatus, setCorrectionStatus] = useState<'Present' | 'Absent' | 'On Leave'>('Present');
    const [correctionCheckIn, setCorrectionCheckIn] = useState("");
    const [correctionCheckOut, setCorrectionCheckOut] = useState("");

    const presentCount = (attendance || []).filter(a => a.status === 'Present').length;
    const leaveCount = (attendance || []).filter(a => a.status === 'On Leave').length;
    const absentCount = (attendance || []).filter(a => a.status === 'Absent').length;

    const stats = [
        { label: "Present Today", value: presentCount, color: "bg-emerald-100", icon: <UserCheck className="text-emerald-600" /> },
        { label: "Absent", value: absentCount, color: "bg-rose-100", icon: <UserX className="text-rose-600" /> },
        { label: "On Leave", value: leaveCount, color: "bg-amber-100", icon: <Calendar className="text-amber-600" /> },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return "bg-emerald-100 text-emerald-700";
            case 'Absent': return "bg-rose-100 text-rose-700";
            case 'On Leave': return "bg-amber-100 text-amber-700";
            default: return "bg-slate-100 text-slate-500";
        }
    };

    const handleApproveRegularization = async (reg: RegularizationRequest) => {
        setIsSubmitting(true);
        try {
            if (backendAvailable) {
                try { await approveRegularization(reg.id); } catch { setBackendAvailable(false); }
            }
            updateAttendance(reg.empId, { status: 'Present', checkIn: reg.time });
            setRegularizations(prev => prev.filter(r => r.id !== reg.id));
            toast({ title: "Regularization Approved", description: `Attendance fixed for ${reg.empName}.` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectRegularization = async (reg: RegularizationRequest) => {
        setIsSubmitting(true);
        try {
            if (backendAvailable) {
                try { await rejectRegularization(reg.id, "Not approved by manager"); } catch { setBackendAvailable(false); }
            }
            setRegularizations(prev => prev.filter(r => r.id !== reg.id));
            toast({ title: "Regularization Rejected", description: `Request for ${reg.empName} has been declined.`, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickMark = (empId: string, status: 'Present' | 'Absent' | 'On Leave', name?: string) => {
        markAttendance(empId, status);
        toast({ title: "Attendance Updated", description: `${name || 'Member'} marked as ${status}.` });
    };

    const handleViewLogs = (member: any) => {
        setSelectedMember(member);
        setLogsOpen(true);
    };

    const handleOpenCorrection = (member: any) => {
        const current = (attendance || []).find(a => a.empId === member.id);
        setSelectedMember(member);
        setCorrectionStatus((current?.status as any) || 'Present');
        setCorrectionCheckIn(current?.checkIn || "");
        setCorrectionCheckOut(current?.checkOut || "");
        setCorrectionOpen(true);
    };

    const handleSaveCorrection = () => {
        if (!selectedMember) return;
        const errors = validateCorrectionForm({
            status: correctionStatus,
            checkIn: correctionCheckIn,
            checkOut: correctionCheckOut,
        });
        if (Object.keys(errors).length > 0) {
            setCorrectionErrors(errors);
            toast({ title: "Invalid Time Format", description: "Use HH:MM or HH:MM AM/PM format.", variant: "destructive" });
            return;
        }
        setCorrectionErrors({});
        updateAttendance(selectedMember.id, {
            status: correctionStatus,
            checkIn: correctionCheckIn || "--:--",
            checkOut: correctionCheckOut || "--:--",
        });
        setCorrectionOpen(false);
        toast({ title: "Attendance Corrected", description: `${selectedMember.name}'s record has been updated.` });
    };

    const handleExport = () => {
        const csvHeader = "Employee ID,Name,Designation,Department,Status,Check In,Check Out\n";
        const csvRows = (attendance || []).map(a => {
            const m = (members || []).find(mem => mem.id === a.empId);
            return `"${a.empId}","${m?.name || ''}","${m?.designation || ''}","${m?.department || ''}","${a.status}","${a.checkIn || '--:--'}","${a.checkOut || '--:--'}"`;
        }).join("\n");
        const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Team_Attendance_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Report Exported", description: "Team attendance CSV has been downloaded." });
    };

    const filteredAttendance = (attendance || []).filter(record => {
        const member = (members || []).find(m => m.id === record.empId);
        return member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member?.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const pendingRegs = regularizations.filter(r => r.status === 'pending');

    // Mock historical logs for the selected member
    const getHistoricalLogs = (empId: string) => [
        { date: "2026-01-22", status: "Present", checkIn: "09:02 AM", checkOut: "06:10 PM", hours: "9h 8m" },
        { date: "2026-01-21", status: "Present", checkIn: "09:15 AM", checkOut: "06:05 PM", hours: "8h 50m" },
        { date: "2026-01-20", status: "On Leave", checkIn: "--:--", checkOut: "--:--", hours: "0h" },
        { date: "2026-01-19", status: "Present", checkIn: "09:05 AM", checkOut: "06:20 PM", hours: "9h 15m" },
        { date: "2026-01-18", status: "Present", checkIn: "09:30 AM", checkOut: "06:15 PM", hours: "8h 45m" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6" style={{ zoom: "90%" }}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Team Attendance</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Monitor daily presence and handle regularization requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-10 border-slate-200 font-bold bg-white text-xs px-5 border-none shadow-sm" onClick={handleExport}>
                        <ArrowUpRight className="mr-2 h-4 w-4" /> Export CSV
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
                                <p className={`text-[10px] font-bold tracking-widest text-slate-800 opacity-60 mb-1`}>{stat.label}</p>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{stat.value}</h3>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm rounded-[2rem] bg-indigo-50/50 p-6 border border-indigo-100 shadow-inner h-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 mt-2 ml-2">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Live Status</h2>
                            <div className="relative w-full md:w-72 mr-2">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <Input
                                    placeholder="Search by name or designation..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-12 h-11 rounded-xl bg-white border-none shadow-sm font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredAttendance.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 text-xs font-bold">No members match your search.</div>
                            ) : filteredAttendance.map((record, i) => {
                                const member = (members || []).find(m => m.id === record.empId);
                                if (!member) return null;
                                return (
                                    <motion.div key={record.empId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                        <div
                                            onClick={() => setDetailRecord({ ...record, member })}
                                            className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-lg transition-all group border border-white/50 mx-2 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4 text-start">
                                                <Avatar className="h-11 w-11 ring-2 ring-slate-50 shadow-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                                                    <AvatarFallback>{member.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-bold text-[15px] text-slate-900 leading-tight tracking-tight">{member.name}</h3>
                                                    <p className="text-[11px] text-slate-400 font-bold tracking-wider mt-1">{member.designation}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="hidden md:block text-right">
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-widest mb-1.5 opacity-60">Entry / Exit</p>
                                                    <p className="font-bold text-slate-700 text-[13px] tracking-tight">{record.checkIn || '--:--'} — {record.checkOut || '--:--'}</p>
                                                </div>
                                                <Badge className={`${getStatusColor(record.status)} border-none font-bold px-4 py-1.5 rounded-lg text-[10px] shadow-sm tracking-wider`}>
                                                    {record.status}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all border-none" onClick={(e) => e.stopPropagation()}>
                                                            <MoreVertical size={16} className="text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-none shadow-xl min-w-[180px] bg-white">
                                                        <DropdownMenuItem className="font-bold text-[11px] tracking-wider py-2.5 rounded-lg cursor-pointer focus:bg-indigo-50" onClick={() => handleViewLogs(member)}>
                                                            <History size={14} className="mr-2 text-indigo-600" /> View Full Logs
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="font-bold text-[11px] tracking-wider py-2.5 rounded-lg cursor-pointer focus:bg-amber-50" onClick={() => handleOpenCorrection(member)}>
                                                            <Edit size={14} className="mr-2 text-amber-600" /> Correct Attendance
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="font-bold text-[11px] tracking-wider py-2.5 rounded-lg cursor-pointer focus:bg-emerald-50" onClick={() => handleQuickMark(member.id, 'Present', member.name)}>
                                                            <CheckCircle2 size={14} className="mr-2 text-emerald-600" /> Mark Present
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="font-bold text-[11px] tracking-wider py-2.5 rounded-lg cursor-pointer focus:bg-rose-50 text-rose-600" onClick={() => handleQuickMark(member.id, 'Absent', member.name)}>
                                                            <UserX size={14} className="mr-2" /> Mark Absent
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm rounded-[2rem] bg-rose-50/50 p-6 border border-rose-100 shadow-inner">
                        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center justify-between ml-2">
                            Pending Fixes <Badge className="bg-rose-500 text-white border-none h-6 px-2.5 text-[10px] font-bold shadow-md rounded-lg">{pendingRegs.length}</Badge>
                        </h2>

                        <div className="space-y-4">
                            {pendingRegs.length === 0 ? (
                                <div className="text-center py-8 text-xs font-bold text-slate-400">All caught up! No pending fixes.</div>
                            ) : pendingRegs.map((req, idx) => (
                                <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                    <div
                                        onClick={() => setDetailReg(req)}
                                        className="bg-white p-5 rounded-2xl border border-white/50 text-start shadow-sm hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-[13px] leading-tight capitalize">{req.empName}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">{req.date} • {req.time}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] border-indigo-200 text-indigo-600 font-bold tracking-widest shadow-none bg-indigo-50 px-2 py-0.5">FIX</Badge>
                                        </div>
                                        <p className="text-[13px] text-slate-500 mb-5 font-bold border-l-4 border-rose-200 pl-3 leading-relaxed opacity-80">{req.reason}</p>
                                        <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-10 text-[11px] shadow-sm tracking-wide"
                                                onClick={() => handleApproveRegularization(req)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-rose-100 text-rose-500 hover:bg-rose-50 font-bold rounded-xl h-10 text-[11px] shadow-sm tracking-wide"
                                                onClick={() => handleRejectRegularization(req)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* View Full Logs Dialog */}
            <Dialog open={logsOpen} onOpenChange={setLogsOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">Attendance History</DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm mt-1">
                            Last 5 days of <span className="font-bold text-indigo-600">{selectedMember?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-3 text-slate-500 font-medium text-xs">Date</th>
                                    <th className="text-left py-3 px-3 text-slate-500 font-medium text-xs">Status</th>
                                    <th className="text-left py-3 px-3 text-slate-500 font-medium text-xs">Check In</th>
                                    <th className="text-left py-3 px-3 text-slate-500 font-medium text-xs">Check Out</th>
                                    <th className="text-right py-3 px-3 text-slate-500 font-medium text-xs">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedMember && getHistoricalLogs(selectedMember.id).map((log, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="py-3 px-3 text-slate-700 font-bold text-xs">{log.date}</td>
                                        <td className="py-3 px-3">
                                            <Badge className={`${getStatusColor(log.status)} border-none text-[10px] font-bold`}>{log.status}</Badge>
                                        </td>
                                        <td className="py-3 px-3 text-slate-600 text-xs"><Clock className="inline w-3 h-3 mr-1 text-slate-400" />{log.checkIn}</td>
                                        <td className="py-3 px-3 text-slate-600 text-xs"><Clock className="inline w-3 h-3 mr-1 text-slate-400" />{log.checkOut}</td>
                                        <td className="py-3 px-3 text-right font-bold text-slate-700 text-xs">{log.hours}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <DialogFooter className="mt-2">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold text-sm border-none" onClick={() => setLogsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Correct Attendance Dialog */}
            <SideFormSheet
                open={correctionOpen}
                onOpenChange={(o) => { setCorrectionOpen(o); if (!o) setCorrectionErrors({}); }}
                title="Correct Attendance"
                description={selectedMember?.name ? `Update today's record for ${selectedMember.name}` : undefined}
                accentColor="#4f46e5"
                width="md"
                submitLabel="Save Correction"
                onSubmit={(e) => { e.preventDefault(); handleSaveCorrection(); }}
            >
                <div className="space-y-4">
                    <Field label="Status">
                        <Select value={correctionStatus} onValueChange={(v: any) => setCorrectionStatus(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="On Leave">On Leave</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Check In" error={correctionErrors.checkIn || undefined}>
                            <Input
                                placeholder="09:00 AM or 09:00"
                                value={correctionCheckIn}
                                onChange={e => { setCorrectionCheckIn(e.target.value); if (correctionErrors.checkIn) setCorrectionErrors({ ...correctionErrors, checkIn: "" }); }}
                            />
                        </Field>
                        <Field label="Check Out" error={correctionErrors.checkOut || undefined}>
                            <Input
                                placeholder="06:00 PM or 18:00"
                                value={correctionCheckOut}
                                onChange={e => { setCorrectionCheckOut(e.target.value); if (correctionErrors.checkOut) setCorrectionErrors({ ...correctionErrors, checkOut: "" }); }}
                            />
                        </Field>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
};

export default TeamAttendancePage;
