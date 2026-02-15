"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    DollarSign,
    UserCheck,
    FileText,
    Filter,
    Search,
    ChevronRight,
    ArrowRight,
    User,
    Check,
    Forward,
    TrendingUp,
    ShieldCheck,
    MoreHorizontal,
    Trash2
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
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Checkbox } from "@/shared/components/ui/checkbox";

const ApprovalsPage = () => {
    const { toast } = useToast();
    const { approvals, approveRequest, rejectRequest, bulkApprove, delegateRequest, escalateRequest } = useInboxStore();

    const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const [filterCategory, setFilterCategory] = useState<ApprovalCategory | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'All'>('Pending');
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleApprove = (approval: ApprovalItem) => {
        approveRequest(approval.id, 'HR Admin');
        toast({
            title: "Request Approved",
            description: `${approval.requestedBy.name}'s request has been approved.`
        });
    };

    const handleBulkApprove = () => {
        bulkApprove(selectedIds, 'HR Admin');
        toast({
            title: "Bulk Approval Successful",
            description: `${selectedIds.length} requests have been approved.`
        });
        setSelectedIds([]);
    };

    const handleReject = () => {
        if (!selectedApproval || !rejectionReason) {
            toast({ title: "Error", description: "Please provide a reason", variant: "destructive" });
            return;
        }
        rejectRequest(selectedApproval.id, rejectionReason);
        setIsRejectDialogOpen(false);
        setRejectionReason("");
        toast({ title: "Request Rejected" });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const filteredApprovals = approvals.filter(a => {
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
        { label: "Pending", count: approvals.filter(a => a.status === 'Pending').length, icon: <Clock className="w-5 h-5 text-white" />, bg: "bg-amber-500" },
        { label: "Delegated", count: approvals.filter(a => a.status === 'Delegated').length, icon: <Forward className="w-5 h-5 text-white" />, bg: "bg-indigo-600" },
        { label: "Escalated", count: approvals.filter(a => a.status === 'Escalated').length, icon: <TrendingUp className="w-5 h-5 text-white" />, bg: "bg-purple-600" },
        { label: "History", count: approvals.filter(a => ['Approved', 'Rejected'].includes(a.status)).length, icon: <ShieldCheck className="w-5 h-5 text-white" />, bg: "bg-emerald-600" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/30">
            <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Approval Center</h1>
                            <Badge className="bg-indigo-600 text-white border-none font-bold text-[10px] uppercase tracking-wider h-6 px-3">Admin Control</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Full governance over employee requests and module-level approvals.</p>
                    </div>

                    <div className="flex items-center gap-3">
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

            <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl text-start">
                    {stats.map((stat, i) => (
                        <Card key={i} className={`border-none shadow-md ${stat.bg} overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white uppercase tracking-widest opacity-80">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-white">{stat.count}</h3>
                                </div>
                                <div className={`h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform group-hover:rotate-12`}>
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
                                        <Button onClick={handleBulkApprove} className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold h-11">Approve Selected</Button>
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

                                        return (
                                            <motion.div
                                                key={approval.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Card className={`group border border-slate-100 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden bg-white ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/10' : ''}`}>
                                                    <CardContent className="py-3 px-5">
                                                        <div className="flex flex-col lg:flex-row gap-4">
                                                            {/* Selection & Avatar */}
                                                            <div className="flex items-start lg:items-center gap-4 lg:w-40 shrink-0">
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => toggleSelect(approval.id)}
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
                                                            <div className="flex lg:flex-col justify-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4">
                                                                {approval.status === 'Pending' ? (
                                                                    <>
                                                                        <Button
                                                                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-6 font-bold text-xs gap-2 transition-all shadow-lg shadow-indigo-100"
                                                                            onClick={() => handleApprove(approval)}
                                                                        >
                                                                            <CheckCircle2 size={16} /> Approve
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            className="text-slate-400 hover:text-rose-600 font-bold text-xs h-10 px-4 rounded-xl hover:bg-rose-50 transition-all"
                                                                            onClick={() => { setSelectedApproval(approval); setIsRejectDialogOpen(true); }}
                                                                        >
                                                                            Reject Request
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <Button variant="ghost" className="h-10 text-slate-400 font-bold text-xs gap-2">
                                                                        View Audit Trail <ArrowRight size={14} />
                                                                    </Button>
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
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-10 max-w-md shadow-2xl">
                    <DialogHeader className="space-y-4">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-2">
                            <XCircle size={28} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Reject This Request</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">Please provide a valid administrative reason for rejection.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Administrative Feedback *</Label>
                        <Textarea
                            className="rounded-2xl bg-slate-50 border-slate-200 focus:bg-white min-h-[120px] font-medium p-4"
                            placeholder="e.g. Please resubmit with supporting documents..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" className="rounded-xl h-12 font-bold px-8" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                        <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-rose-100" onClick={handleReject}>Reject Forever</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ApprovalsPage;
