"use client"

import React, { useMemo, useState } from "react";
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Eye,
    FileText,
    MessageSquare,
    ChevronRight,
    Receipt,
    Check,
    X,
    Filter,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { useExpenseStore, type ExpenseClaim, type ClaimStatus } from "@/shared/data/expense-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";

const statusConfig: Record<ClaimStatus, { color: string; bg: string }> = {
    Draft: { color: 'text-slate-600', bg: 'bg-slate-100' },
    Submitted: { color: 'text-blue-700', bg: 'bg-blue-50' },
    Approved: { color: 'text-green-700', bg: 'bg-green-50' },
    Rejected: { color: 'text-red-700', bg: 'bg-red-50' },
    Paid: { color: 'text-purple-700', bg: 'bg-purple-50' },
};

const ExpenseApprovalsPage = () => {
    const { toast } = useToast();
    const { claims, policies, updateClaim } = useExpenseStore();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const pendingClaims = useMemo(() =>
        claims.filter(c => c.status === 'Submitted').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [claims]
    );

    const approvalHistory = useMemo(() =>
        claims.filter(c => c.status === 'Approved' || c.status === 'Rejected' || c.status === 'Paid')
            .sort((a, b) => new Date(b.approvedDate || b.date).getTime() - new Date(a.approvedDate || a.date).getTime()),
        [claims]
    );

    const checkPolicyViolation = (claim: ExpenseClaim): string[] => {
        const violations: string[] = [];
        const policy = policies.find(p => p.category === claim.category && p.isActive);
        if (policy) {
            if (claim.amount > policy.maxAmount) {
                violations.push(`Amount ₹${claim.amount.toLocaleString()} exceeds limit of ₹${policy.maxAmount.toLocaleString()} for ${claim.category}`);
            }
            if (policy.requiresReceipt && !claim.receiptUrl) {
                violations.push(`Receipt is required for ${claim.category} expenses`);
            }
        }
        return violations;
    };

    const handleApprove = (claim: ExpenseClaim) => {
        updateClaim(claim.id, {
            status: 'Approved',
            approvedBy: 'Current Admin',
            approvedDate: new Date().toISOString().split('T')[0],
        });
        setIsReviewOpen(false);
        setReviewNotes('');
        toast({ title: "Claim Approved", description: `${claim.id} has been approved for ₹${claim.amount.toLocaleString()}.` });
    };

    const handleReject = (claim: ExpenseClaim) => {
        if (!reviewNotes.trim()) {
            toast({ title: "Notes Required", description: "Please provide a reason for rejection.", variant: "destructive" });
            return;
        }
        updateClaim(claim.id, {
            status: 'Rejected',
            approvedBy: 'Current Admin',
            approvedDate: new Date().toISOString().split('T')[0],
        });
        setIsReviewOpen(false);
        setReviewNotes('');
        toast({ title: "Claim Rejected", description: `${claim.id} has been rejected.` });
    };

    const handleBulkApprove = () => {
        selectedIds.forEach(id => {
            updateClaim(id, {
                status: 'Approved',
                approvedBy: 'Current Admin',
                approvedDate: new Date().toISOString().split('T')[0],
            });
        });
        toast({ title: "Claims Approved", description: `${selectedIds.length} claims have been approved.` });
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        selectedIds.forEach(id => {
            updateClaim(id, {
                status: 'Rejected',
                approvedBy: 'Current Admin',
                approvedDate: new Date().toISOString().split('T')[0],
            });
        });
        toast({ title: "Claims Rejected", description: `${selectedIds.length} claims have been rejected.` });
        setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const openReview = (claim: ExpenseClaim) => {
        setSelectedClaim(claim);
        setReviewNotes('');
        setIsReviewOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                        <ShieldCheck className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Approvals</h1>
                        <p className="text-sm text-slate-500">Review and approve submitted expense claims</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <>
                            <Button size="sm" variant="outline" className="gap-1.5 text-green-600 border-green-200" onClick={handleBulkApprove}>
                                <Check className="h-3.5 w-3.5" /> Approve ({selectedIds.length})
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1.5 text-red-600 border-red-200" onClick={handleBulkReject}>
                                <X className="h-3.5 w-3.5" /> Reject ({selectedIds.length})
                            </Button>
                        </>
                    )}
                    <Button variant={showHistory ? "default" : "outline"} size="sm" className={cn("gap-1.5", showHistory && "bg-[#8B5CF6] hover:bg-[#7C3AED]")} onClick={() => setShowHistory(!showHistory)}>
                        <Clock className="h-4 w-4" /> {showHistory ? 'Show Pending' : 'View History'}
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">Pending</p>
                            <p className="text-xl font-bold text-slate-900">{pendingClaims.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">Approved</p>
                            <p className="text-xl font-bold text-slate-900">{claims.filter(c => c.status === 'Approved').length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">Rejected</p>
                            <p className="text-xl font-bold text-slate-900">{claims.filter(c => c.status === 'Rejected').length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">Policy Violations</p>
                            <p className="text-xl font-bold text-slate-900">{pendingClaims.filter(c => checkPolicyViolation(c).length > 0).length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Approvals Queue */}
            {!showHistory && (
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Pending Approval Queue</h3>
                        {pendingClaims.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-200" />
                                <p className="text-sm">All caught up! No pending approvals.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pendingClaims.map((claim) => {
                                    const violations = checkPolicyViolation(claim);
                                    return (
                                        <div key={claim.id} className={cn("flex items-center gap-4 p-4 rounded-xl border transition-colors", violations.length > 0 ? "border-orange-200 bg-orange-50/50" : "border-slate-100 hover:bg-slate-50")}>
                                            <Checkbox
                                                checked={selectedIds.includes(claim.id)}
                                                onCheckedChange={() => toggleSelect(claim.id)}
                                            />
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 flex-shrink-0">
                                                <Receipt className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-900">{claim.employeeName}</span>
                                                    <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">{claim.category}</Badge>
                                                    {violations.length > 0 && (
                                                        <Badge variant="secondary" className="text-[10px] bg-orange-100 text-orange-700 gap-1">
                                                            <AlertTriangle className="h-2.5 w-2.5" /> Policy Violation
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">{claim.description}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-slate-400">{claim.date}</span>
                                                    {claim.project && <span className="text-xs text-purple-500">{claim.project}</span>}
                                                    {claim.receiptUrl ? (
                                                        <span className="text-xs text-green-600 flex items-center gap-0.5"><FileText className="h-2.5 w-2.5" /> Receipt</span>
                                                    ) : (
                                                        <span className="text-xs text-red-400 flex items-center gap-0.5"><AlertCircle className="h-2.5 w-2.5" /> No receipt</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-base font-bold text-slate-900 whitespace-nowrap">₹{claim.amount.toLocaleString()}</span>
                                            <div className="flex items-center gap-1">
                                                <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleApprove(claim)}>
                                                    <Check className="h-3 w-3" /> Approve
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-slate-500" onClick={() => openReview(claim)}>
                                                    <Eye className="h-3 w-3" /> Review
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Approval History */}
            {showHistory && (
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Approval History</h3>
                        <div className="space-y-3">
                            {approvalHistory.map((claim) => (
                                <div key={claim.id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-full",
                                        claim.status === 'Approved' || claim.status === 'Paid' ? 'bg-green-100' : 'bg-red-100'
                                    )}>
                                        {claim.status === 'Approved' || claim.status === 'Paid' ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-900">{claim.employeeName}</span>
                                            <span className="text-xs text-slate-400">-</span>
                                            <span className="text-xs text-slate-500">{claim.description}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-slate-400">{claim.status === 'Approved' || claim.status === 'Paid' ? 'Approved' : 'Rejected'} by {claim.approvedBy}</span>
                                            <span className="text-xs text-slate-300">|</span>
                                            <span className="text-xs text-slate-400">{claim.approvedDate}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">₹{claim.amount.toLocaleString()}</span>
                                    <Badge variant="secondary" className={cn("text-xs", statusConfig[claim.status].bg, statusConfig[claim.status].color)}>
                                        {claim.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Review Dialog */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Review Expense Claim</DialogTitle>
                        <DialogDescription>{selectedClaim?.id} - {selectedClaim?.employeeName}</DialogDescription>
                    </DialogHeader>
                    {selectedClaim && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Category</p>
                                    <p className="text-sm font-medium text-slate-900">{selectedClaim.category}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Amount</p>
                                    <p className="text-sm font-bold text-slate-900">₹{selectedClaim.amount.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Date</p>
                                    <p className="text-sm font-medium text-slate-900">{selectedClaim.date}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Receipt</p>
                                    <p className="text-sm font-medium text-slate-900">{selectedClaim.receiptUrl ? 'Attached' : 'Not attached'}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-[10px] text-slate-400 uppercase">Description</p>
                                <p className="text-sm text-slate-700 mt-1">{selectedClaim.description}</p>
                            </div>

                            {/* Policy Compliance */}
                            {(() => {
                                const violations = checkPolicyViolation(selectedClaim);
                                if (violations.length > 0) {
                                    return (
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                                <p className="text-xs font-bold text-orange-700">Policy Violations</p>
                                            </div>
                                            <ul className="space-y-1">
                                                {violations.map((v, i) => (
                                                    <li key={i} className="text-xs text-orange-600 flex items-start gap-1.5">
                                                        <span className="mt-0.5">-</span> {v}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }
                                return (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <p className="text-xs font-medium text-green-700">Compliant with expense policies</p>
                                    </div>
                                );
                            })()}

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Review Notes</Label>
                                <Textarea
                                    placeholder="Add notes (required for rejection)..."
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50" onClick={() => selectedClaim && handleReject(selectedClaim)}>
                            <XCircle className="h-4 w-4" /> Reject
                        </Button>
                        <Button className="gap-1.5 bg-green-600 hover:bg-green-700" onClick={() => selectedClaim && handleApprove(selectedClaim)}>
                            <CheckCircle2 className="h-4 w-4" /> Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExpenseApprovalsPage;
