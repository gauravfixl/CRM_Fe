"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    TrendingUp,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    DollarSign,
    Calculator,
    ShieldCheck,
    Filter,
    Search,
    Download,
    Plus,
    Calendar,
    ArrowRight,
    Check
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOvertimeStore, OvertimeRequest } from "@/shared/data/overtime-store";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";

const OvertimeAdminPage = () => {
    const { toast } = useToast();
    const { requests, approveRequest, bulkApprove, rejectRequest } = useOvertimeStore();

    // Filters & States
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

    const filteredRequests = useMemo(() => {
        return requests.filter(r => {
            const matchesSearch = r.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === "All" || r.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchTerm, filterStatus]);

    const stats = useMemo(() => {
        const totalPayout = requests.filter(r => r.status === 'Approved').reduce((acc, r) => acc + r.estimatedPayout, 0);
        const pendingRequests = requests.filter(r => r.status === 'Pending');
        const pendingCount = pendingRequests.length;
        const totalHours = requests.filter(r => r.status === 'Approved').reduce((acc, r) => acc + r.hours, 0);

        return {
            cards: [
                { label: "Total Approved Payout", value: `₹${totalPayout.toLocaleString()}`, color: "bg-[#CB9DF0]", icon: <DollarSign size={24} /> },
                { label: "Pending Approvals", value: pendingCount, color: "bg-[#F0C1E1]", icon: <AlertTriangle size={24} /> },
                { label: "Aggregate OT Hours", value: `${totalHours}h`, color: "bg-[#FDDBBB]", icon: <Clock size={24} /> },
            ],
            pendingIds: pendingRequests.map(r => r.id)
        };
    }, [requests]);

    const handleApprove = (id: string, name: string) => {
        approveRequest(id, "HR Admin");
        toast({ title: "Overtime Approved", description: `Payout for ${name} has been queued for payroll synchronization.` });
    };

    const handleReject = (id: string, name: string) => {
        rejectRequest(id);
        toast({ title: "Overtime Rejected", description: `Request for ${name} was declined.`, variant: "destructive" });
    };

    const handleBulkApprove = () => {
        if (stats.pendingIds.length === 0) {
            toast({ title: "No Pending Requests", description: "There are no pending OT requests to approve." });
            return;
        }
        bulkApprove(stats.pendingIds, "HR Admin");
        setIsBulkConfirmOpen(false);
        toast({ title: "Bulk Approval Success", description: `Successfully approved ${stats.pendingIds.length} overtime records.` });
    };

    const handleExport = () => {
        toast({ title: "Generating Export", description: "OT logs are being compiled into a CSV format..." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] overflow-x-hidden overflow-y-auto">
            <div style={{
                zoom: '0.75',
                width: '100%',
            }} className="p-12 space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-2 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tighter capitalize">Overtime Management</h1>
                        <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">HR Admin: Monitor expenditure and ensure compliance with labor laws.</p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-slate-200 text-slate-500 h-14 px-8 hover:bg-slate-50 transition-all" onClick={handleExport}>
                            <Download size={18} className="mr-2" /> Export OT report
                        </Button>
                        <Button
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-14 px-10 shadow-2xl shadow-purple-200"
                            onClick={() => setIsBulkConfirmOpen(true)}
                        >
                            <ShieldCheck size={18} className="mr-2" /> One-click payout approval
                        </Button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.cards.map((stat, i) => (
                        <Card key={i} className={`border-none shadow-2xl rounded-[2.5rem] ${stat.color} p-8 h-40 flex items-center justify-between overflow-hidden relative group transition-all hover:scale-[1.02]`}>
                            <div className="relative z-10">
                                <p className="text-xl font-bold text-slate-900/60 leading-tight mb-1 tracking-tight">{stat.label}</p>
                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                            </div>
                            <div className="h-20 w-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-sm relative z-10">
                                {stat.icon}
                            </div>
                            <div className="absolute top-4 right-8 opacity-10 transform rotate-12 scale-150 group-hover:rotate-[25deg] transition-transform duration-500">
                                {stat.icon}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <Input
                            className="h-14 pl-16 rounded-2xl bg-slate-50 border-none w-full font-bold text-lg placeholder:italic transition-all shadow-inner focus:bg-white focus:ring-2 focus:ring-[#CB9DF0]/20"
                            placeholder="Identify employee or Request ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-64 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 px-6">
                            <SelectValue placeholder="Status Filter" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl font-bold border-none shadow-2xl">
                            <SelectItem value="All">All Requests</SelectItem>
                            <SelectItem value="Pending">Pending Only</SelectItem>
                            <SelectItem value="Approved">Approved Only</SelectItem>
                            <SelectItem value="Rejected">Rejected Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Requests Table */}
                <Card className="border border-slate-200 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white overflow-hidden p-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400">Personnel & ID</th>
                                <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400">Date & Hours</th>
                                <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400">Reason & Priority</th>
                                <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400 text-center">Estimated Payout</th>
                                <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400 text-right text-transparent">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-6 font-bold">
                                            <Calculator size={40} />
                                        </div>
                                        <p className="text-slate-300 font-bold text-xl tracking-tight">No overtime records match your filters.</p>
                                    </td>
                                </tr>
                            ) : filteredRequests.map((r, i) => (
                                <motion.tr
                                    key={r.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="p-8">
                                        <div className="flex items-center gap-5">
                                            <Avatar className="h-12 w-12 rounded-xl bg-[#FDDBBB] text-slate-900 font-bold shadow-sm group-hover:scale-110 transition-transform">
                                                <AvatarFallback>{r.empName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg leading-tight">{r.empName}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{r.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 font-bold text-slate-700">
                                                <Calendar size={14} className="text-slate-400" /> {new Date(r.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold px-3 py-1 shadow-sm uppercase text-[9px] italic">{r.hours}h Logged</Badge>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-600 line-clamp-1 group-hover:line-clamp-none transition-all">{r.reason}</p>
                                            <Badge className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-widest border-none shadow-sm
                                                ${r.priority === 'High' ? 'bg-rose-100 text-rose-600' :
                                                    r.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {r.priority} Priority
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center text-3xl font-bold text-slate-900 tracking-tight leading-none">
                                        ₹{r.estimatedPayout.toLocaleString()}
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {r.status === 'Pending' ? (
                                                <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                                                    <Button
                                                        size="icon"
                                                        className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                                                        onClick={() => handleApprove(r.id, r.empName)}
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        className="h-10 w-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
                                                        onClick={() => handleReject(r.id, r.empName)}
                                                    >
                                                        <XCircle size={18} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Badge className={`px-6 py-2 rounded-xl font-bold italic shadow-sm border-none uppercase text-[10px] ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                    }`}>
                                                    {r.status}
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </Card>



                {/* Bulk Approval Dialog */}
                <Dialog open={isBulkConfirmOpen} onOpenChange={setIsBulkConfirmOpen}>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-md shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Mass OT approval</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-sm leading-tight">Authorize all currently pending overtime hours into the payroll cycle?</DialogDescription>
                        </DialogHeader>
                        <div className="py-8 space-y-4 font-sans">
                            <div className="bg-[#CB9DF0]/10 p-6 rounded-3xl border border-[#CB9DF0]/20">
                                <p className="text-[#9d5ccf] font-bold text-xs uppercase tracking-widest mb-1">Batch authorization</p>
                                <p className="text-slate-900 font-bold text-2xl tracking-tight leading-none">
                                    {stats.pendingIds.length} requests identified
                                </p>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 px-2 italic">Note: This action is irreversible once synced with the Finance API.</p>
                        </div>
                        <DialogFooter className="mt-4 flex flex-col gap-3">
                            <Button className="w-full h-16 bg-[#CB9DF0] text-white rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-purple-100 tracking-tight" onClick={handleBulkApprove}>Bulk approve records</Button>
                            <Button variant="ghost" className="w-full h-12 font-bold text-slate-400 hover:text-slate-600" onClick={() => setIsBulkConfirmOpen(false)}>Cancel batch action</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default OvertimeAdminPage;
