"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    DollarSign,
    UserCheck,
    FileText,
    Filter,
    Search
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useInboxStore, type ApprovalItem, type ApprovalCategory } from "@/shared/data/inbox-store";
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

const ApprovalsPage = () => {
    const { toast } = useToast();
    const { approvals, approveRequest, rejectRequest } = useInboxStore();
    const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [filterCategory, setFilterCategory] = useState<ApprovalCategory | 'All'>('All');

    const handleApprove = (approval: ApprovalItem) => {
        approveRequest(approval.id, 'Drashi Garg');
        toast({
            title: "Request Approved",
            description: `${approval.requestedBy.name}'s ${approval.category.toLowerCase()} request has been approved.`
        });
    };

    const handleReject = () => {
        if (!selectedApproval || !rejectionReason) {
            toast({ title: "Error", description: "Please provide a reason", variant: "destructive" });
            return;
        }

        rejectRequest(selectedApproval.id, rejectionReason);
        setIsRejectDialogOpen(false);
        setRejectionReason("");
        toast({
            title: "Request Rejected",
            description: `${selectedApproval.requestedBy.name}'s request has been rejected.`
        });
    };

    const pendingApprovals = approvals.filter(a => a.status === 'Pending');
    const processedApprovals = approvals.filter(a => a.status !== 'Pending');

    const filteredPending = filterCategory === 'All'
        ? pendingApprovals
        : pendingApprovals.filter(a => a.category === filterCategory);

    const getCategoryIcon = (category: ApprovalCategory) => {
        const icons = {
            'Leave': Calendar,
            'Attendance': UserCheck,
            'Expense': DollarSign,
            'Asset': FileText,
            'Timesheet': Clock
        };
        return icons[category];
    };

    const getCategoryColor = (category: ApprovalCategory) => {
        const colors = {
            'Leave': 'bg-blue-100 text-blue-700',
            'Attendance': 'bg-purple-100 text-purple-700',
            'Expense': 'bg-emerald-100 text-emerald-700',
            'Asset': 'bg-amber-100 text-amber-700',
            'Timesheet': 'bg-indigo-100 text-indigo-700'
        };
        return colors[category];
    };

    const stats = [
        { label: "Pending", value: pendingApprovals.length, color: "bg-[#FFF9BF]", icon: <Clock className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Approved Today", value: processedApprovals.filter(a => a.status === 'Approved').length, color: "bg-emerald-100", icon: <CheckCircle2 className="text-emerald-600" />, textColor: "text-emerald-900" },
        { label: "Rejected", value: processedApprovals.filter(a => a.status === 'Rejected').length, color: "bg-rose-100", icon: <XCircle className="text-rose-600" />, textColor: "text-rose-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Approvals</h1>
                    <p className="text-slate-500 font-medium">Review and approve team requests.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">
                        Pending ({pendingApprovals.length})
                    </TabsTrigger>
                    <TabsTrigger value="processed" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">
                        Processed ({processedApprovals.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-6 mt-6">
                    {/* Filter */}
                    <div className="flex gap-3">
                        <Button
                            variant={filterCategory === 'All' ? 'default' : 'outline'}
                            className="rounded-xl font-bold"
                            onClick={() => setFilterCategory('All')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filterCategory === 'Leave' ? 'default' : 'outline'}
                            className="rounded-xl font-bold"
                            onClick={() => setFilterCategory('Leave')}
                        >
                            Leave
                        </Button>
                        <Button
                            variant={filterCategory === 'Expense' ? 'default' : 'outline'}
                            className="rounded-xl font-bold"
                            onClick={() => setFilterCategory('Expense')}
                        >
                            Expense
                        </Button>
                        <Button
                            variant={filterCategory === 'Attendance' ? 'default' : 'outline'}
                            className="rounded-xl font-bold"
                            onClick={() => setFilterCategory('Attendance')}
                        >
                            Attendance
                        </Button>
                    </div>

                    {filteredPending.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm">
                            <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
                            <p className="text-slate-400 font-bold">All caught up! No pending approvals.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPending.map((approval) => {
                                const Icon = getCategoryIcon(approval.category);
                                return (
                                    <Card key={approval.id} className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Left: User Info */}
                                            <div className="flex items-start gap-4 flex-1">
                                                <Avatar className="h-14 w-14 bg-indigo-100 text-indigo-700 font-bold text-lg">
                                                    <AvatarFallback>{approval.requestedBy.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-black text-lg text-slate-900">{approval.requestedBy.name}</h3>
                                                        <Badge className={`${getCategoryColor(approval.category)} border-none font-bold text-xs`}>
                                                            {approval.category}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-500 font-medium mb-1">{approval.requestedBy.department}</p>
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        {new Date(approval.requestedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Middle: Details */}
                                            <div className="flex-1 bg-slate-50 p-5 rounded-2xl">
                                                <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                                                    <Icon size={18} className="text-slate-600" />
                                                    {approval.details.title}
                                                </h4>
                                                <p className="text-sm text-slate-600 font-medium mb-3">{approval.details.description}</p>
                                                <div className="space-y-2">
                                                    {approval.details.startDate && (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Calendar size={14} className="text-slate-400" />
                                                            <span className="font-bold text-slate-700">
                                                                {new Date(approval.details.startDate).toLocaleDateString()}
                                                                {approval.details.endDate && ` - ${new Date(approval.details.endDate).toLocaleDateString()}`}
                                                            </span>
                                                            {approval.details.days && (
                                                                <Badge className="bg-blue-100 text-blue-700 border-none text-[10px] font-bold ml-2">
                                                                    {approval.details.days} days
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                    {approval.details.amount && (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <DollarSign size={14} className="text-slate-400" />
                                                            <span className="font-black text-emerald-600 text-lg">₹{approval.details.amount.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {approval.details.reason && (
                                                        <div className="mt-2 p-3 bg-white rounded-xl border border-slate-100">
                                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Reason</p>
                                                            <p className="text-sm text-slate-700 font-medium">{approval.details.reason}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex lg:flex-col gap-3 justify-end">
                                                <Button
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-12 px-6"
                                                    onClick={() => handleApprove(approval)}
                                                >
                                                    <CheckCircle2 className="mr-2 h-5 w-5" /> Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold h-12 px-6"
                                                    onClick={() => {
                                                        setSelectedApproval(approval);
                                                        setIsRejectDialogOpen(true);
                                                    }}
                                                >
                                                    <XCircle className="mr-2 h-5 w-5" /> Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="processed" className="space-y-4 mt-6">
                    {processedApprovals.map((approval) => (
                        <Card key={approval.id} className="border-none shadow-lg rounded-[2rem] bg-white p-6 opacity-70">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 bg-slate-100 text-slate-600 font-bold">
                                        <AvatarFallback>{approval.requestedBy.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{approval.requestedBy.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{approval.details.title}</p>
                                    </div>
                                </div>
                                <Badge className={`${approval.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} border-none font-bold`}>
                                    {approval.status}
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                    <DialogHeader>
                        <DialogTitle>Reject Request</DialogTitle>
                        <DialogDescription>Please provide a reason for rejection.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Reason for Rejection *</Label>
                        <Textarea
                            placeholder="e.g. Insufficient leave balance, Invalid expense category..."
                            className="mt-2 bg-slate-50 border-none rounded-xl min-h-[100px]"
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 font-bold" onClick={handleReject}>
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ApprovalsPage;
