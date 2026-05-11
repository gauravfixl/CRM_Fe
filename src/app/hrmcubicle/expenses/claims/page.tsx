"use client"

import React, { useMemo, useRef, useState } from "react";
import {
    Receipt,
    Plus,
    Search,
    Download,
    Eye,
    Edit3,
    Trash2,
    Upload,
    FileText,
    X,
    Send,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
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
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
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

const emptyForm = { category: '' as ExpenseCategory | '', amount: '', date: '', description: '', project: '', receiptUrl: '', receiptName: '' };

const ExpenseClaimsPage = () => {
    const { toast } = useToast();
    const { claims, addClaim, updateClaim, deleteClaim } = useExpenseStore();
    const [activeTab, setActiveTab] = useState<'my' | 'all' | 'drafts'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<{ ids: string[] } | null>(null);
    const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
    const [editingClaim, setEditingClaim] = useState<ExpenseClaim | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [claimForm, setClaimForm] = useState<typeof emptyForm>(emptyForm);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentUserId = 'E001';
    const currentUserName = 'Rahul Sharma';

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

    const openNewClaim = () => {
        setEditingClaim(null);
        setClaimForm(emptyForm);
        setIsClaimDialogOpen(true);
    };

    const openEditClaim = (claim: ExpenseClaim) => {
        setEditingClaim(claim);
        setClaimForm({
            category: claim.category,
            amount: String(claim.amount),
            date: claim.date,
            description: claim.description,
            project: claim.project,
            receiptUrl: claim.receiptUrl,
            receiptName: claim.receiptName || (claim.receiptUrl ? claim.receiptUrl.split('/').pop() || '' : ''),
        });
        setIsClaimDialogOpen(true);
    };

    const handleFilePick = (file: File | null) => {
        if (!file) return;
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
        if (!allowedTypes.includes(file.type)) {
            toast({ title: "Invalid file type", description: "Only PDF, PNG, or JPG files are allowed.", variant: "destructive" });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" });
            return;
        }
        const url = URL.createObjectURL(file);
        setClaimForm(f => ({ ...f, receiptUrl: url, receiptName: file.name }));
        toast({ title: "Receipt attached", description: file.name });
    };

    const clearReceipt = () => {
        setClaimForm(f => ({ ...f, receiptUrl: '', receiptName: '' }));
    };

    const handleSaveClaim = (asDraft: boolean) => {
        if (!claimForm.category || !claimForm.amount || !claimForm.date) {
            toast({ title: "Validation Error", description: "Category, amount, and date are required.", variant: "destructive" });
            return;
        }
        const amount = parseFloat(claimForm.amount);
        if (isNaN(amount) || amount <= 0) {
            toast({ title: "Validation Error", description: "Amount must be greater than zero.", variant: "destructive" });
            return;
        }
        if (amount > 10_000_000) {
            toast({ title: "Amount too high", description: "Amount exceeds the maximum allowed (₹1,00,00,000).", variant: "destructive" });
            return;
        }
        const today = new Date(); today.setHours(23, 59, 59, 999);
        const claimDate = new Date(claimForm.date);
        if (isNaN(claimDate.getTime())) {
            toast({ title: "Invalid Date", description: "Please enter a valid date.", variant: "destructive" });
            return;
        }
        if (claimDate > today) {
            toast({ title: "Future Date", description: "Expense date cannot be in the future.", variant: "destructive" });
            return;
        }
        if (!asDraft && claimForm.description.trim().length < 5) {
            toast({ title: "Description too short", description: "Please provide at least 5 characters describing the expense.", variant: "destructive" });
            return;
        }

        if (editingClaim) {
            updateClaim(editingClaim.id, {
                category: claimForm.category as ExpenseCategory,
                amount,
                date: claimForm.date,
                description: claimForm.description,
                project: claimForm.project,
                receiptUrl: claimForm.receiptUrl,
                receiptName: claimForm.receiptName,
                status: asDraft ? 'Draft' : 'Submitted',
            });
            toast({ title: asDraft ? "Draft Updated" : "Claim Submitted", description: `${editingClaim.id} ${asDraft ? 'saved as draft' : 'submitted for approval'}.` });
        } else {
            const newClaim: ExpenseClaim = {
                id: `EC${String(Date.now()).slice(-4)}`,
                employeeId: currentUserId,
                employeeName: currentUserName,
                category: claimForm.category as ExpenseCategory,
                amount,
                currency: 'INR',
                date: claimForm.date,
                description: claimForm.description,
                receiptUrl: claimForm.receiptUrl,
                receiptName: claimForm.receiptName,
                status: asDraft ? 'Draft' : 'Submitted',
                approvedBy: '',
                approvedDate: '',
                paidDate: '',
                project: claimForm.project,
            };
            addClaim(newClaim);
            toast({ title: asDraft ? "Draft Saved" : "Claim Submitted", description: `Expense claim ${newClaim.id} has been ${asDraft ? 'saved as draft' : 'submitted for approval'}.` });
        }
        setIsClaimDialogOpen(false);
        setEditingClaim(null);
        setClaimForm(emptyForm);
    };

    const handleBulkSubmit = () => {
        const draftIds = selectedIds.filter(id => claims.find(c => c.id === id)?.status === 'Draft');
        if (draftIds.length === 0) {
            toast({ title: "No drafts selected", description: "Only Draft claims can be submitted.", variant: "destructive" });
            return;
        }
        draftIds.forEach(id => updateClaim(id, { status: 'Submitted' }));
        setSelectedIds([]);
        toast({ title: "Claims Submitted", description: `${draftIds.length} claim(s) submitted for approval.` });
    };

    const handleBulkDelete = () => {
        const deletable = selectedIds.filter(id => {
            const c = claims.find(x => x.id === id);
            return c && (c.status === 'Draft' || c.status === 'Rejected');
        });
        if (deletable.length === 0) {
            toast({ title: "Nothing to delete", description: "Only Draft or Rejected claims can be deleted.", variant: "destructive" });
            return;
        }
        setPendingDelete({ ids: deletable });
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        pendingDelete.ids.forEach(id => deleteClaim(id));
        setSelectedIds([]);
        toast({ title: "Deleted", description: `${pendingDelete.ids.length} claim(s) deleted.` });
        setPendingDelete(null);
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
        if (filteredClaims.length === 0) {
            toast({ title: "No data", description: "Nothing to export.", variant: "destructive" });
            return;
        }
        const headers = ['ID', 'Employee', 'Category', 'Amount', 'Date', 'Description', 'Project', 'Status'];
        const rows = filteredClaims.map(c => [c.id, c.employeeName, c.category, c.amount, c.date, c.description, c.project, c.status]);
        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
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

    const canDelete = (s: ClaimStatus) => s === 'Draft' || s === 'Rejected';
    const canEdit = (s: ClaimStatus) => s === 'Draft' || s === 'Rejected';

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
                    <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={openNewClaim}>
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
                        {(searchQuery || filterCategory !== 'all' || filterStatus !== 'all') && (
                            <Button size="sm" variant="ghost" className="gap-1 text-slate-500" onClick={() => { setSearchQuery(''); setFilterCategory('all'); setFilterStatus('all'); }}>
                                <X className="h-3 w-3" /> Clear
                            </Button>
                        )}
                        {selectedIds.length > 0 && (
                            <>
                                <Button size="sm" variant="outline" className="gap-1.5 text-purple-600 border-purple-200" onClick={handleBulkSubmit}>
                                    <Send className="h-3.5 w-3.5" /> Submit Selected ({selectedIds.length})
                                </Button>
                                <Button size="sm" variant="outline" className="gap-1.5 text-red-600 border-red-200" onClick={handleBulkDelete}>
                                    <Trash2 className="h-3.5 w-3.5" /> Delete Selected
                                </Button>
                            </>
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
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-600" title="View" onClick={() => { setSelectedClaim(claim); setIsViewOpen(true); }}>
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                                {canEdit(claim.status) && (
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-600" title="Edit" onClick={() => openEditClaim(claim)}>
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                {claim.status === 'Draft' && (
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-purple-600" title="Submit" onClick={() => { updateClaim(claim.id, { status: 'Submitted' }); toast({ title: "Claim Submitted", description: `${claim.id} submitted for approval.` }); }}>
                                                        <Send className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                {canDelete(claim.status) && (
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" title="Delete" onClick={() => setPendingDelete({ ids: [claim.id] })}>
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

            {/* New / Edit Claim Sheet */}
            <SideFormSheet
                open={isClaimDialogOpen}
                onOpenChange={(o) => { setIsClaimDialogOpen(o); if (!o) { setEditingClaim(null); setClaimForm(emptyForm); } }}
                title={editingClaim ? `Edit Claim ${editingClaim.id}` : 'New Expense Claim'}
                description={editingClaim ? 'Update the claim details below.' : 'Submit an expense for reimbursement. Fill in the details below.'}
                icon={editingClaim ? <Edit3 size={20} /> : <Plus size={20} />}
                accentColor={editingClaim ? "#7c3aed" : "#4f46e5"}
                width="md"
                footer={
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleSaveClaim(true)}
                            className="h-10 px-5 rounded-lg gap-1.5"
                        >
                            <FileText className="h-4 w-4" /> Save Draft
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleSaveClaim(false)}
                            className="h-10 px-5 rounded-lg gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                        >
                            <Send className="h-4 w-4" /> {editingClaim ? 'Update & Submit' : 'Submit Claim'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category" required>
                            <Select value={claimForm.category || undefined} onValueChange={(v) => setClaimForm({ ...claimForm, category: v as ExpenseCategory })}>
                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Amount (INR)" required>
                            <Input type="number" min="0" step="0.01" placeholder="0.00" value={claimForm.amount} onChange={(e) => setClaimForm({ ...claimForm, amount: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date" required>
                            <Input type="date" max={new Date().toISOString().split('T')[0]} value={claimForm.date} onChange={(e) => setClaimForm({ ...claimForm, date: e.target.value })} />
                        </Field>
                        <Field label="Project">
                            <Input placeholder="Project name" value={claimForm.project} onChange={(e) => setClaimForm({ ...claimForm, project: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Description" hint={`${claimForm.description.length}/500`}>
                        <Textarea placeholder="Describe the expense (min 5 chars when submitting)..." value={claimForm.description} onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })} rows={3} maxLength={500} />
                    </Field>
                    <Field label="Receipt">
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={(e) => handleFilePick(e.target.files?.[0] || null)}
                            />
                            {claimForm.receiptUrl ? (
                                <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 bg-slate-50">
                                    <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 truncate flex-1">{claimForm.receiptName || 'Receipt attached'}</span>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={clearReceipt}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-purple-300 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG up to 5MB</p>
                                </div>
                            )}
                        </>
                    </Field>
                </div>
            </SideFormSheet>

            {/* View Details Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Claim Details</DialogTitle>
                        <DialogDescription>{selectedClaim?.id}</DialogDescription>
                    </DialogHeader>
                    {selectedClaim && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Employee</p>
                                    <p className="text-sm font-medium text-slate-900">{selectedClaim.employeeName}</p>
                                </div>
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
                                    <p className="text-[10px] text-slate-400 uppercase">Project</p>
                                    <p className="text-sm font-medium text-slate-900">{selectedClaim.project || '-'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Status</p>
                                    <Badge variant="secondary" className={cn("text-xs mt-0.5", statusConfig[selectedClaim.status].bg, statusConfig[selectedClaim.status].color)}>
                                        {selectedClaim.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-[10px] text-slate-400 uppercase">Description</p>
                                <p className="text-sm text-slate-700 mt-1">{selectedClaim.description || '-'}</p>
                            </div>
                            {selectedClaim.approvedBy && (
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">{selectedClaim.status === 'Rejected' ? 'Rejected by' : 'Approved by'}</p>
                                    <p className="text-sm font-medium text-slate-900">{selectedClaim.approvedBy} <span className="text-xs text-slate-400">on {selectedClaim.approvedDate}</span></p>
                                    {selectedClaim.reviewNotes && <p className="text-xs text-slate-600 mt-1.5 italic">"{selectedClaim.reviewNotes}"</p>}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Receipt Preview Dialog */}
            <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Receipt Preview</DialogTitle>
                        <DialogDescription>{selectedClaim?.id} - {selectedClaim?.description}</DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 rounded-xl p-6 text-center">
                        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-600 font-medium">{selectedClaim?.receiptName || selectedClaim?.receiptUrl}</p>
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
                        {selectedClaim?.receiptUrl && selectedClaim.receiptUrl.startsWith('blob:') && (
                            <Button variant="outline" size="sm" className="mt-4 gap-1.5" onClick={() => window.open(selectedClaim.receiptUrl, '_blank')}>
                                <Eye className="h-3.5 w-3.5" /> Open File
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!pendingDelete} onOpenChange={(o) => { if (!o) setPendingDelete(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete claim{(pendingDelete?.ids.length || 0) > 1 ? 's' : ''}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove {pendingDelete?.ids.length} claim{(pendingDelete?.ids.length || 0) > 1 ? 's' : ''}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ExpenseClaimsPage;
