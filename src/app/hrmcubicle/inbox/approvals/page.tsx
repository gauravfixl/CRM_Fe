"use client"

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    DollarSign,
    UserCheck,
    FileText,
    Search,
    ArrowRight,
    Forward,
    TrendingUp,
    ShieldCheck,
    Trash2,
    AlertTriangle,
    RefreshCw,
    Wifi,
    WifiOff
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useInboxStore, type ApprovalItem, type ApprovalCategory, type ApprovalStatus } from "@/shared/data/inbox-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    fetchPendingLeaveApprovals,
    approveLeaveApproval,
    rejectLeaveApproval
} from "@/shared/api/inbox-api";

const ApprovalsPage = () => {
    const { toast } = useToast();
    const { approvals, approveRequest, rejectRequest, bulkApprove, delegateRequest, escalateRequest, deleteApproval } = useInboxStore();

    const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isDelegateDialogOpen, setIsDelegateDialogOpen] = useState(false);
    const [isEscalateDialogOpen, setIsEscalateDialogOpen] = useState(false);
    const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
    const [auditApproval, setAuditApproval] = useState<ApprovalItem | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [delegateTo, setDelegateTo] = useState("");
    const [escalateTo, setEscalateTo] = useState("");

    const [filterCategory, setFilterCategory] = useState<ApprovalCategory | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'All'>('Pending');
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [detailApproval, setDetailApproval] = useState<ApprovalItem | null>(null);

    /* ----- Backend-backed Leave approvals (live) ----- */
    const [liveLeaveApprovals, setLiveLeaveApprovals] = useState<ApprovalItem[]>([]);
    const [isLoadingLive, setIsLoadingLive] = useState(false);
    const [liveError, setLiveError] = useState<string | null>(null);
    const [isActing, setIsActing] = useState(false);

    const loadLiveLeaveApprovals = async () => {
        setIsLoadingLive(true);
        setLiveError(null);
        try {
            const items = await fetchPendingLeaveApprovals();
            setLiveLeaveApprovals(items);
        } catch (e: any) {
            setLiveError(e?.response?.data?.message || e?.message || "Unable to reach leave approval service.");
        } finally {
            setIsLoadingLive(false);
        }
    };

    useEffect(() => {
        loadLiveLeaveApprovals();
    }, []);

    const liveLeaveIds = useMemo(() => new Set(liveLeaveApprovals.map(a => a.id)), [liveLeaveApprovals]);
    const isLiveItem = (id: string) => liveLeaveIds.has(id);

    // Merge: live Leave items (authoritative) + all non-Leave items from the mock store.
    // Any mock "Leave" records are hidden so we don't show stale seed data alongside live server data.
    const combinedApprovals = useMemo<ApprovalItem[]>(() => {
        const mockNonLeave = approvals.filter(a => a.category !== 'Leave');
        return [...liveLeaveApprovals, ...mockNonLeave];
    }, [approvals, liveLeaveApprovals]);

    /* ----- Validation ----- */
    const rejectionReasonTrimmed = rejectionReason.trim();
    const rejectionReasonError = rejectionReason.length > 0
        ? rejectionReasonTrimmed.length < 5
            ? "Please provide at least 5 characters."
            : rejectionReasonTrimmed.length > 500
                ? "Rejection reason cannot exceed 500 characters."
                : ""
        : "";
    const isRejectValid = rejectionReasonTrimmed.length >= 5 && rejectionReasonTrimmed.length <= 500;

    const delegateToTrimmed = delegateTo.trim();
    const delegateToError = delegateTo.length > 0
        ? delegateToTrimmed.length < 2
            ? "Name must be at least 2 characters."
            : delegateToTrimmed.length > 60
                ? "Name cannot exceed 60 characters."
                : !/^[A-Za-z][A-Za-z\s.'\-]*$/.test(delegateToTrimmed)
                    ? "Use letters, spaces, apostrophes, dots or hyphens only."
                    : ""
        : "";
    const isDelegateValid = delegateToTrimmed.length >= 2 && delegateToTrimmed.length <= 60 && /^[A-Za-z][A-Za-z\s.'\-]*$/.test(delegateToTrimmed);

    const escalateToTrimmed = escalateTo.trim();
    const escalateToError = escalateTo.length > 0
        ? escalateToTrimmed.length < 2
            ? "Name must be at least 2 characters."
            : escalateToTrimmed.length > 60
                ? "Name cannot exceed 60 characters."
                : !/^[A-Za-z][A-Za-z\s.'\-]*$/.test(escalateToTrimmed)
                    ? "Use letters, spaces, apostrophes, dots or hyphens only."
                    : ""
        : "";
    const isEscalateValid = escalateToTrimmed.length >= 2 && escalateToTrimmed.length <= 60 && /^[A-Za-z][A-Za-z\s.'\-]*$/.test(escalateToTrimmed);

    /* ----- Action handlers ----- */

    const handleApprove = async (approval: ApprovalItem) => {
        if (isLiveItem(approval.id)) {
            setIsActing(true);
            try {
                await approveLeaveApproval(approval.id);
                setLiveLeaveApprovals(prev => prev.filter(a => a.id !== approval.id));
                setSelectedIds(prev => prev.filter(id => id !== approval.id));
                toast({
                    title: "Leave Approved",
                    description: `${approval.requestedBy.name}'s leave has been approved.`
                });
            } catch (e: any) {
                toast({
                    title: "Approval Failed",
                    description: e?.response?.data?.message || "Server rejected the request. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setIsActing(false);
            }
            return;
        }
        approveRequest(approval.id, 'HR Admin');
        toast({
            title: "Request Approved",
            description: `${approval.requestedBy.name}'s request has been approved.`
        });
    };

    const handleBulkApprove = async () => {
        const liveIds = selectedIds.filter(isLiveItem);
        const mockIds = selectedIds.filter(id => !isLiveItem(id));

        let liveOk = 0;
        let liveFail = 0;

        if (liveIds.length > 0) {
            setIsActing(true);
            const results = await Promise.allSettled(liveIds.map(id => approveLeaveApproval(id)));
            results.forEach(r => {
                if (r.status === 'fulfilled') liveOk += 1;
                else liveFail += 1;
            });
            const approvedSet = new Set(liveIds.filter((_, i) => results[i].status === 'fulfilled'));
            setLiveLeaveApprovals(prev => prev.filter(a => !approvedSet.has(a.id)));
            setIsActing(false);
        }

        if (mockIds.length > 0) {
            bulkApprove(mockIds, 'HR Admin');
        }

        if (liveFail > 0) {
            toast({
                title: "Bulk Approval Partial",
                description: `${liveOk + mockIds.length} approved, ${liveFail} failed on server.`,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Bulk Approval Successful",
                description: `${liveOk + mockIds.length} request(s) have been approved.`
            });
        }
        setSelectedIds([]);
    };

    const handleReject = async () => {
        if (!selectedApproval || !isRejectValid) {
            toast({ title: "Please fix the errors", description: "Rejection reason must be between 5 and 500 characters.", variant: "destructive" });
            return;
        }
        if (isLiveItem(selectedApproval.id)) {
            setIsActing(true);
            try {
                await rejectLeaveApproval(selectedApproval.id, rejectionReasonTrimmed);
                setLiveLeaveApprovals(prev => prev.filter(a => a.id !== selectedApproval.id));
                setSelectedIds(prev => prev.filter(id => id !== selectedApproval.id));
                setIsRejectDialogOpen(false);
                setRejectionReason("");
                toast({ title: "Leave Rejected", description: `${selectedApproval.requestedBy.name}'s leave was rejected.` });
            } catch (e: any) {
                toast({
                    title: "Rejection Failed",
                    description: e?.response?.data?.message || "Server rejected the request. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setIsActing(false);
            }
            return;
        }
        rejectRequest(selectedApproval.id, rejectionReasonTrimmed);
        setIsRejectDialogOpen(false);
        setRejectionReason("");
        toast({ title: "Request Rejected" });
    };

    const handleDelegate = () => {
        if (!selectedApproval || !delegateTo) {
            toast({ title: "Error", description: "Please specify who to delegate to", variant: "destructive" });
            return;
        }
        delegateRequest(selectedApproval.id, delegateTo);
        setIsDelegateDialogOpen(false);
        setDelegateTo("");
        toast({ title: "Request Delegated", description: `Delegated to ${delegateTo}` });
    };

    const handleEscalate = () => {
        if (!selectedApproval || !escalateTo) {
            toast({ title: "Error", description: "Please specify who to escalate to", variant: "destructive" });
            return;
        }
        escalateRequest(selectedApproval.id, escalateTo);
        setIsEscalateDialogOpen(false);
        setEscalateTo("");
        toast({ title: "Request Escalated", description: `Escalated to ${escalateTo}` });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const filteredApprovals = combinedApprovals.filter(a => {
        const matchesCategory = filterCategory === 'All' || a.category === filterCategory;
        const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
        const matchesSearch = a.requestedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.details.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesStatus && matchesSearch;
    });

    const getStatusStyles = (status: ApprovalStatus) => {
        const styles = {
            'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
            'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
            'Delegated': 'bg-indigo-50 text-indigo-600 border-indigo-100',
            'Escalated': 'bg-purple-50 text-purple-600 border-purple-100'
        };
        return styles[status] || 'bg-slate-50 text-slate-600';
    };

    const getCategoryIcon = (category: ApprovalCategory) => {
        const icons = {
            'Leave': Calendar,
            'Attendance': UserCheck,
            'Expense': DollarSign,
            'Asset': FileText,
            'Timesheet': Clock
        };
        return icons[category] || FileText;
    };

    const stats = [
        { label: "Pending", count: approvals.filter(a => a.status === 'Pending').length, icon: <Clock className="w-5 h-5 text-orange-600" />, bg: "bg-orange-100", text: "text-orange-700", iconBg: "bg-orange-200" },
        { label: "Delegated", count: approvals.filter(a => a.status === 'Delegated').length, icon: <Forward className="w-5 h-5 text-blue-600" />, bg: "bg-blue-100", text: "text-blue-700", iconBg: "bg-blue-200" },
        { label: "Escalated", count: approvals.filter(a => a.status === 'Escalated').length, icon: <TrendingUp className="w-5 h-5 text-purple-600" />, bg: "bg-purple-100", text: "text-purple-700", iconBg: "bg-purple-200" },
        { label: "History", count: approvals.filter(a => ['Approved', 'Rejected'].includes(a.status)).length, icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-100", text: "text-emerald-700", iconBg: "bg-emerald-200" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/30" style={{ zoom: 0.9 }}>
            <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Approval Center</h1>
                            <Badge className="bg-indigo-600 text-white border-none font-bold text-[10px] uppercase tracking-wider h-6 px-3">Admin Control</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Full governance over employee requests and module-level approvals.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center gap-1.5 px-3 h-9 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${liveError ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                            title={liveError ? `Live API: ${liveError}` : 'Live API connected'}
                        >
                            {liveError ? <WifiOff size={12} /> : <Wifi size={12} />}
                            {liveError ? 'Offline' : 'Live'}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 px-3 text-slate-500 hover:text-indigo-600 gap-2 font-bold text-xs"
                            onClick={loadLiveLeaveApprovals}
                            disabled={isLoadingLive}
                            title="Refresh live leave approvals"
                        >
                            <RefreshCw size={14} className={isLoadingLive ? 'animate-spin' : ''} />
                            Refresh
                        </Button>
                        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
                            {['Pending', 'Delegated', 'Escalated', 'All'].map((status) => (
                                <Button
                                    key={status}
                                    variant="ghost"
                                    size="sm"
                                    className={`rounded-lg font-bold text-xs h-9 px-4 transition-all ${filterStatus === status ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                                    onClick={() => setFilterStatus(status as any)}
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-6 w-full space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full text-start">
                    {stats.map((stat, i) => (
                        <Card key={i} className={`border border-slate-100 shadow-sm ${stat.bg} overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className={`text-[10px] font-bold uppercase tracking-widest opacity-70 ${stat.text}`}>{stat.label}</p>
                                    <h3 className={`text-2xl font-black ${stat.text}`}>{stat.count}</h3>
                                </div>
                                <div className={`h-12 w-12 rounded-xl ${stat.iconBg} flex items-center justify-center transition-transform group-hover:rotate-12`}>
                                    {stat.icon}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Enhanced Filters */}
                    <div className="w-full lg:w-64 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Module Filter</Label>
                                <div className="space-y-1">
                                    {['All', 'Leave', 'Attendance', 'Expense', 'Asset', 'Timesheet'].map(cat => (
                                        <Button
                                            key={cat}
                                            variant="ghost"
                                            className={`w-full justify-between rounded-xl font-bold text-sm h-11 px-4 transition-all ${filterCategory === cat ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                            onClick={() => setFilterCategory(cat as any)}
                                        >
                                            {cat}
                                            {filterCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedIds.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border-none">
                                    <h4 className="text-sm font-bold mb-4">Bulk Actions ({selectedIds.length})</h4>
                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleBulkApprove}
                                            disabled={isActing}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isActing ? 'Processing…' : 'Approve Selected'}
                                        </Button>
                                        <Button
                                            onClick={() => setIsBulkDeleteDialogOpen(true)}
                                            className="w-full bg-rose-600 hover:bg-rose-500 rounded-xl font-bold h-11 gap-2"
                                        >
                                            <Trash2 size={14} /> Delete Selected
                                        </Button>
                                        <Button variant="ghost" onClick={() => setSelectedIds([])} className="w-full text-slate-400 hover:text-white rounded-xl font-bold h-11">Clear Selection</Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Detailed List */}
                    <div className="flex-1 space-y-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by employee name, ID or request title..."
                                className="pl-11 h-14 rounded-2xl bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm font-medium transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <AnimatePresence mode="popLayout">
                            {filteredApprovals.length === 0 ? (
                                <motion.div layout className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">All Clear!</h3>
                                    <p className="text-slate-500 text-sm font-medium mt-1">No requests match your current filters.</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredApprovals.map((approval) => {
                                        const Icon = getCategoryIcon(approval.category);
                                        const statusStyle = getStatusStyles(approval.status);
                                        const isSelected = selectedIds.includes(approval.id);
                                        const isLive = isLiveItem(approval.id);

                                        return (
                                            <motion.div
                                                key={approval.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Card
                                                    onClick={() => setDetailApproval(approval)}
                                                    className={`group border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all rounded-3xl overflow-hidden bg-white cursor-pointer ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/10' : ''}`}
                                                >
                                                    <CardContent className="py-3 px-5">
                                                        <div className="flex flex-col lg:flex-row gap-4">
                                                            {/* Selection & Avatar */}
                                                            <div className="flex items-start lg:items-center gap-4 lg:w-40 shrink-0">
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => toggleSelect(approval.id)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="mt-1 lg:mt-0 rounded-md border-slate-200 data-[state=checked]:bg-indigo-600"
                                                                />
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-10 w-10 border border-slate-50 shadow-sm ring-1 ring-slate-100">
                                                                        <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-xs">{approval.requestedBy.avatar}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="min-w-0">
                                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{approval.requestedBy.id}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Request Detail */}
                                                            <div className="flex-1 space-y-1.5">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <Badge variant="outline" className={`border-none font-bold text-[9px] h-5 px-2 rounded-md ${statusStyle}`}>
                                                                        {approval.status}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold text-[9px] h-5 px-2 rounded-md gap-1.5 uppercase tracking-tighter">
                                                                        <Icon className="w-2.5 h-2.5" /> {approval.category}
                                                                    </Badge>
                                                                    {approval.priority === 'High' && <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-bold h-5 px-2 uppercase shadow-none">Urgent</Badge>}
                                                                    {isLive && (
                                                                        <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold h-5 px-2 uppercase tracking-wider gap-1 shadow-none">
                                                                            <Wifi className="w-2.5 h-2.5" /> Live
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                <div className="space-y-0.5">
                                                                    <h5 className="text-base tracking-tight transition-colors">
                                                                        <span className="font-bold text-slate-900">{approval.requestedBy.name}</span>
                                                                        <span className="mx-2 text-slate-300">|</span>
                                                                        <span className="font-semibold text-indigo-600 group-hover:text-slate-900 transition-colors">{approval.details.title}</span>
                                                                    </h5>
                                                                    <p className="text-xs text-slate-500 font-medium line-clamp-1 italic">"{approval.details.description}"</p>
                                                                </div>

                                                                {/* Context Meta */}
                                                                <div className="flex flex-wrap gap-4 pt-1">
                                                                    {approval.details.startDate && (
                                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                                            <Calendar size={12} />
                                                                            <span>{new Date(approval.details.startDate).toLocaleDateString()} {approval.details.endDate ? `— ${new Date(approval.details.endDate).toLocaleDateString()}` : ''}</span>
                                                                        </div>
                                                                    )}
                                                                    {approval.details.amount && (
                                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                                            <DollarSign size={11} />
                                                                            <span>₹{approval.details.amount.toLocaleString()}</span>
                                                                        </div>
                                                                    )}
                                                                    {approval.status === 'Delegated' && <div className="text-[9px] text-indigo-400 font-bold italic">Delegated to: {approval.delegatedTo}</div>}
                                                                    {approval.status === 'Escalated' && <div className="text-[9px] text-purple-400 font-bold italic">Escalated to: {approval.escalatedTo}</div>}
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex lg:flex-col justify-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4" onClick={(e) => e.stopPropagation()}>
                                                                {approval.status === 'Pending' ? (
                                                                    <>
                                                                        <Button
                                                                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-6 font-bold text-xs gap-2 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            onClick={() => handleApprove(approval)}
                                                                            disabled={isActing}
                                                                        >
                                                                            <CheckCircle2 size={16} /> Approve
                                                                        </Button>
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                className="text-slate-400 hover:text-indigo-600 font-bold text-xs h-10 px-3 rounded-xl hover:bg-indigo-50 transition-all gap-1.5"
                                                                                onClick={() => { setSelectedApproval(approval); setIsDelegateDialogOpen(true); }}
                                                                            >
                                                                                <Forward size={14} /> Delegate
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                className="text-slate-400 hover:text-purple-600 font-bold text-xs h-10 px-3 rounded-xl hover:bg-purple-50 transition-all gap-1.5"
                                                                                onClick={() => { setSelectedApproval(approval); setIsEscalateDialogOpen(true); }}
                                                                            >
                                                                                <TrendingUp size={14} /> Escalate
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                className="text-slate-400 hover:text-rose-600 font-bold text-xs h-10 px-3 rounded-xl hover:bg-rose-50 transition-all"
                                                                                onClick={() => { setSelectedApproval(approval); setIsRejectDialogOpen(true); }}
                                                                            >
                                                                                Reject
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <Button variant="ghost" className="h-10 text-slate-400 font-bold text-xs gap-2" onClick={() => { setAuditApproval(approval); setIsAuditDialogOpen(true); }}>
                                                                            View Audit Trail <ArrowRight size={14} />
                                                                        </Button>
                                                                        {!isLive && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                                                                                onClick={() => { setSelectedApproval(approval); setIsDeleteDialogOpen(true); }}
                                                                                title="Delete record"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Rejection Dialog */}
            <SideFormSheet
                open={isRejectDialogOpen}
                onOpenChange={(open) => { setIsRejectDialogOpen(open); if (!open) setRejectionReason(""); }}
                title="Reject This Request"
                description="Please provide a valid administrative reason for rejection."
                icon={<XCircle size={20} />}
                accentColor="#e11d48"
                width="md"
                loading={isActing}
                submitLabel={isActing ? 'Rejecting…' : 'Reject Forever'}
                submitDisabled={!isRejectValid}
                onSubmit={(e) => { e.preventDefault(); handleReject(); }}
            >
                <div className="space-y-2">
                    <Field
                        label="Administrative Feedback"
                        required
                        error={rejectionReasonError || undefined}
                        hint={rejectionReasonError ? undefined : `${rejectionReasonTrimmed.length}/500`}
                    >
                        <Textarea
                            className="min-h-[140px]"
                            placeholder="e.g. Please resubmit with supporting documents..."
                            value={rejectionReason}
                            maxLength={550}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            aria-invalid={!!rejectionReasonError}
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Delegate Sheet */}
            <SideFormSheet
                open={isDelegateDialogOpen}
                onOpenChange={setIsDelegateDialogOpen}
                title="Delegate Request"
                description="Assign this request to another team lead or manager for review."
                icon={<Forward size={20} />}
                accentColor="#4f46e5"
                width="md"
                submitLabel="Delegate Now"
                onSubmit={(e) => { e.preventDefault(); handleDelegate(); }}
            >
                <Field label="Delegate To" required>
                    <Input
                        placeholder="e.g. Team Lead - Sarah, HR Manager..."
                        value={delegateTo}
                        onChange={(e) => setDelegateTo(e.target.value)}
                    />
                </Field>
            </SideFormSheet>

            {/* Escalate Sheet */}
            <SideFormSheet
                open={isEscalateDialogOpen}
                onOpenChange={setIsEscalateDialogOpen}
                title="Escalate Request"
                description="Escalate this to a higher authority for urgent attention."
                icon={<TrendingUp size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Escalate Now"
                onSubmit={(e) => { e.preventDefault(); handleEscalate(); }}
            >
                <Field label="Escalate To" required>
                    <Input
                        placeholder="e.g. Head of Operations, VP HR..."
                        value={escalateTo}
                        onChange={(e) => setEscalateTo(e.target.value)}
                    />
                </Field>
            </SideFormSheet>

            {/* Audit Trail Dialog */}
            <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-10 max-w-md shadow-2xl">
                    <DialogHeader className="space-y-4">
                        <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                            <ShieldCheck size={28} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Audit Trail</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">Complete approval history for this request.</DialogDescription>
                    </DialogHeader>
                    {auditApproval && (
                        <div className="py-6 space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-700">{auditApproval.details.title}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">Requested by {auditApproval.requestedBy.name} ({auditApproval.requestedBy.id})</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><FileText size={14} /></div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-700">Request Submitted</p>
                                        <p className="text-[10px] text-slate-400">{new Date(auditApproval.requestedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                {auditApproval.status === 'Approved' && (
                                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={14} /></div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-emerald-700">Approved by {auditApproval.approvedBy || 'HR Admin'}</p>
                                            <p className="text-[10px] text-emerald-500">{auditApproval.approvedAt ? new Date(auditApproval.approvedAt).toLocaleString() : 'Recently'}</p>
                                        </div>
                                    </div>
                                )}
                                {auditApproval.status === 'Rejected' && (
                                    <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                                        <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center"><XCircle size={14} /></div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-rose-700">Rejected</p>
                                            <p className="text-[10px] text-rose-500">{auditApproval.rejectionReason || 'No reason provided'}</p>
                                        </div>
                                    </div>
                                )}
                                {auditApproval.status === 'Delegated' && (
                                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><Forward size={14} /></div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-indigo-700">Delegated to {auditApproval.delegatedTo}</p>
                                            <p className="text-[10px] text-indigo-500">Awaiting review</p>
                                        </div>
                                    </div>
                                )}
                                {auditApproval.status === 'Escalated' && (
                                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><TrendingUp size={14} /></div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-purple-700">Escalated to {auditApproval.escalatedTo}</p>
                                            <p className="text-[10px] text-purple-500">Under higher review</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl h-12 font-bold px-8" onClick={() => setIsAuditDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-10 max-w-md shadow-2xl">
                    <DialogHeader className="space-y-4">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-2">
                            <AlertTriangle size={28} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Delete Approval Record?</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            This will permanently remove {selectedApproval?.requestedBy.name}'s "{selectedApproval?.details.title}" from the approval log. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 pt-4">
                        <Button variant="outline" className="rounded-xl h-12 font-bold px-8" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-rose-100 gap-2" onClick={() => {
                            if (selectedApproval) {
                                deleteApproval(selectedApproval.id);
                                setSelectedIds(prev => prev.filter(id => id !== selectedApproval.id));
                                toast({ title: "Record Deleted", description: `${selectedApproval.requestedBy.name}'s approval has been removed.` });
                            }
                            setIsDeleteDialogOpen(false);
                        }}>
                            <Trash2 size={16} /> Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-10 max-w-md shadow-2xl">
                    <DialogHeader className="space-y-4">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-2">
                            <AlertTriangle size={28} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Delete {selectedIds.length} Record(s)?</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            This will permanently remove the selected approval records. Live server-backed leave records will be skipped as they cannot be deleted. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 pt-4">
                        <Button variant="outline" className="rounded-xl h-12 font-bold px-8" onClick={() => setIsBulkDeleteDialogOpen(false)}>Cancel</Button>
                        <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-rose-100 gap-2" onClick={() => {
                            const mockIds = selectedIds.filter(id => !isLiveItem(id));
                            mockIds.forEach(id => deleteApproval(id));
                            setSelectedIds([]);
                            setIsBulkDeleteDialogOpen(false);
                            toast({ title: "Records Deleted", description: `${mockIds.length} approval record(s) have been removed.` });
                        }}>
                            <Trash2 size={16} /> Delete Selected
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ApprovalsPage;
