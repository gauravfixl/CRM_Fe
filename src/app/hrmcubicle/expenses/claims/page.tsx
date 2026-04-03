"use client"

import React, { useMemo, useState } from "react";
import {
    Receipt,
    Plus,
    Search,
    Filter,
    Download,
    Eye,
    Edit3,
    Trash2,
    CheckCircle2,
    Upload,
    FileText,
    X,
    Send,
    Clock,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useExpenseStore, type ExpenseCategory, type ClaimStatus, type ExpenseClaim } from "@/shared/data/expense-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";

const categories: ExpenseCategory[] = ['Travel', 'Food', 'Accommodation', 'Transport', 'Communication', 'Medical', 'Other'];
const statuses: ClaimStatus[] = ['Draft', 'Submitted', 'Approved', 'Rejected', 'Paid'];

const statusConfig: Record<ClaimStatus, { color: string; bg: string }> = {
    Draft: { color: 'text-slate-600', bg: 'bg-slate-100' },
    Submitted: { color: 'text-blue-700', bg: 'bg-blue-50' },
    Approved: { color: 'text-green-700', bg: 'bg-green-50' },
    Rejected: { color: 'text-red-700', bg: 'bg-red-50' },
    Paid: { color: 'text-purple-700', bg: 'bg-purple-50' },
};

const ExpenseClaimsPage = () => {
    const { toast } = useToast();
    const { claims, addClaim, updateClaim, deleteClaim } = useExpenseStore();
    const [activeTab, setActiveTab] = useState<'my' | 'all' | 'drafts'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [claimForm, setClaimForm] = useState({
        category: '' as ExpenseCategory | '',
        amount: '',
        date: '',
        description: '',
        project: '',
        receiptUrl: '',
    });

    const currentUserId = 'E001';

    const filteredClaims = useMemo(() => {
        let result = [...claims];
        if (activeTab === 'my') result = result.filter(c => c.employeeId === currentUserId);
        if (activeTab === 'drafts') result = result.filter(c => c.status === 'Draft');
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.employeeName.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q) ||
                c.project.toLowerCase().includes(q) ||
                c.id.toLowerCase().includes(q)
            );
        }
        if (filterCategory !== 'all') result = result.filter(c => c.category === filterCategory);
        if (filterStatus !== 'all') result = result.filter(c => c.status === filterStatus);
        return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [claims, activeTab, searchQuery, filterCategory, filterStatus]);

    const handleCreateClaim = (asDraft: boolean) => {
        if (!claimForm.category || !claimForm.amount || !claimForm.date) {
            toast({ title: "Validation Error", description: "Category, amount, and date are required.", variant: "destructive" });
            return;
        }
        const newClaim: ExpenseClaim = {
            id: `EC${String(claims.length + 1).padStart(3, '0')}`,
            employeeId: currentUserId,
            employeeName: 'Rahul Sharma',
            category: claimForm.category as ExpenseCategory,
            amount: parseFloat(claimForm.amount),
            currency: 'INR',
            date: claimForm.date,
            description: claimForm.description,
            receiptUrl: claimForm.receiptUrl || '',
            status: asDraft ? 'Draft' : 'Submitted',
            approvedBy: '',
            approvedDate: '',
            paidDate: '',
            project: claimForm.project,
        };
        addClaim(newClaim);
        setIsNewClaimOpen(false);
        setClaimForm({ category: '', amount: '', date: '', description: '', project: '', receiptUrl: '' });
        toast({ title: asDraft ? "Draft Saved" : "Claim Submitted", description: `Expense claim ${newClaim.id} has been ${asDraft ? 'saved as draft' : 'submitted for approval'}.` });
    };

    const handleBulkSubmit = () => {
        const draftIds = selectedIds.filter(id => claims.find(c => c.id === id)?.status === 'Draft');
        draftIds.forEach(id => updateClaim(id, { status: 'Submitted' }));
        setSelectedIds([]);
        toast({ title: "Claims Submitted", description: `${draftIds.length} claims submitted for approval.` });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredClaims.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredClaims.map(c => c.id));
        }
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Employee', 'Category', 'Amount', 'Date', 'Description', 'Project', 'Status'];
        const rows = filteredClaims.map(c => [c.id, c.employeeName, c.category, c.amount, c.date, c.description, c.project, c.status]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expense_claims.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Export Complete", description: "CSV file downloaded successfully." });
    };

    const tabs = [
        { key: 'my', label: 'My Claims', count: claims.filter(c => c.employeeId === currentUserId).length },
        { key: 'all', label: 'All Claims', count: claims.length },
        { key: 'drafts', label: 'Drafts', count: claims.filter(c => c.status === 'Draft').length },
    ] as const;

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                        <Receipt className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Claims</h1>
                        <p className="text-sm text-slate-500">Submit and track your expense reimbursements</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportCSV}>
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                    <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => setIsNewClaimOpen(true)}>
                        <Plus className="h-4 w-4" /> New Claim
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeTab === tab.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {tab.label} <span className="ml-1 text-xs text-slate-400">({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search claims by name, description, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {selectedIds.length > 0 && (
                            <Button size="sm" variant="outline" className="gap-1.5 text-purple-600 border-purple-200" onClick={handleBulkSubmit}>
                                <Send className="h-3.5 w-3.5" /> Submit Selected ({selectedIds.length})
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Claims Table */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10 pl-4">
                                    <Checkbox
                                        checked={filteredClaims.length > 0 && selectedIds.length === filteredClaims.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="text-xs font-bold text-slate-500">ID</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500">Employee</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500">Date</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500">Category</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500">Amount</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500">Project</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500">Status</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500">Receipt</TableHead>
                                <TableHead className="text-xs font-bold text-slate-500 text-right pr-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClaims.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-12 text-slate-400">
                                        No claims found. Create a new claim to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClaims.map((claim) => (
                                    <TableRow key={claim.id} className="hover:bg-slate-50/50">
                                        <TableCell className="pl-4">
                                            <Checkbox
                                                checked={selectedIds.includes(claim.id)}
                                                onCheckedChange={() => toggleSelect(claim.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-slate-700">{claim.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{claim.employeeName}</p>
                                                <p className="text-xs text-slate-400">{claim.employeeId}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">{claim.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                                {claim.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm font-semibold text-slate-900">₹{claim.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm text-purple-600">{claim.project || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={cn("text-xs", statusConfig[claim.status].bg, statusConfig[claim.status].color)}>
                                                {claim.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {claim.receiptUrl ? (
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-600" onClick={() => { setSelectedClaim(claim); setIsReceiptOpen(true); }}>
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-slate-400">None</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {claim.status === 'Draft' && (
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-600" onClick={() => { updateClaim(claim.id, { status: 'Submitted' }); toast({ title: "Claim Submitted", description: `${claim.id} submitted for approval.` }); }}>
                                                        <Send className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                {(claim.status === 'Draft' || claim.status === 'Rejected') && (
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => { deleteClaim(claim.id); toast({ title: "Claim Deleted", description: `${claim.id} has been deleted.` }); }}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New Claim Dialog */}
            <Dialog open={isNewClaimOpen} onOpenChange={setIsNewClaimOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>New Expense Claim</DialogTitle>
                        <DialogDescription>Submit an expense for reimbursement. Fill in the details below.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Category *</Label>
                                <Select value={claimForm.category} onValueChange={(v) => setClaimForm({ ...claimForm, category: v as ExpenseCategory })}>
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Amount (INR) *</Label>
                                <Input type="number" placeholder="0.00" value={claimForm.amount} onChange={(e) => setClaimForm({ ...claimForm, amount: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Date *</Label>
                                <Input type="date" value={claimForm.date} onChange={(e) => setClaimForm({ ...claimForm, date: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Project</Label>
                                <Input placeholder="Project name" value={claimForm.project} onChange={(e) => setClaimForm({ ...claimForm, project: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Description</Label>
                            <Textarea placeholder="Describe the expense..." value={claimForm.description} onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })} rows={3} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Receipt Upload</Label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-purple-300 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => handleCreateClaim(true)} className="gap-1.5">
                            <FileText className="h-4 w-4" /> Save Draft
                        </Button>
                        <Button onClick={() => handleCreateClaim(false)} className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]">
                            <Send className="h-4 w-4" /> Submit Claim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Receipt Preview Dialog */}
            <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Receipt Preview</DialogTitle>
                        <DialogDescription>{selectedClaim?.id} - {selectedClaim?.description}</DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 rounded-xl p-8 text-center">
                        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-600 font-medium">{selectedClaim?.receiptUrl}</p>
                        <p className="text-xs text-slate-400 mt-1">Receipt file attached</p>
                        <div className="mt-4 space-y-2 text-left bg-white rounded-lg p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Category</span>
                                <span className="font-medium text-slate-900">{selectedClaim?.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Amount</span>
                                <span className="font-medium text-slate-900">₹{selectedClaim?.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Date</span>
                                <span className="font-medium text-slate-900">{selectedClaim?.date}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Status</span>
                                <Badge variant="secondary" className={cn("text-xs", selectedClaim ? statusConfig[selectedClaim.status].bg : '', selectedClaim ? statusConfig[selectedClaim.status].color : '')}>
                                    {selectedClaim?.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExpenseClaimsPage;
