"use client"

import React, { useState, useRef } from "react";
import {
    FileSearch,
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign,
    Users,
    FileText,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Lock,
    Unlock,
    MoreHorizontal,
    Eye,
    Upload,
    Scale,
    ShieldCheck,
    History,
    Download,
    X,
    CheckSquare,
    Square,
    Paperclip,
    AlertCircle,
    MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { usePayrollStore } from "@/shared/data/payroll-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const ProofSubmissionPage = () => {
    const { proofs, updateProofStatus, addProof, updateProof, deleteProof } = usePayrollStore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedProof, setSelectedProof] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isApprovalCommentOpen, setIsApprovalCommentOpen] = useState(false);
    const [editingProof, setEditingProof] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [approvalComment, setApprovalComment] = useState("");
    const [currentProofForComment, setCurrentProofForComment] = useState<any>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        employeeName: "",
        employeeId: "",
        type: "HRA",
        amount: "0",
        submittedDate: new Date().toISOString().split('T')[0],
    });

    const formatINR = (amt: number) => `₹${amt.toLocaleString("en-IN")}`;

    // Validation rules per proof type
    const amountLimits: Record<string, number> = {
        "HRA": 100000,
        "LIC": 150000,
        "PPF": 150000,
        "80D": 25000,
        "Section 24": 200000,
        "Others": 50000
    };

    // Filter proofs
    const filteredProofs = proofs.filter(p => {
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        const matchesType = typeFilter === "all" || p.type === typeFilter;
        const matchesSearch = searchQuery === "" ||
            p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
    });

    const handleOpenForm = (proof?: any) => {
        if (proof) {
            setEditingProof(proof);
            setFormData({
                employeeName: proof.employeeName,
                employeeId: proof.employeeId,
                type: proof.type,
                amount: proof.amount.toString(),
                submittedDate: proof.submittedDate,
            });
        } else {
            setEditingProof(null);
            setFormData({
                employeeName: "",
                employeeId: "",
                type: "HRA",
                amount: "0",
                submittedDate: new Date().toISOString().split('T')[0],
            });
        }
        setUploadedFile(null);
        setIsFormOpen(true);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: "File too large", description: "Maximum file size is 5MB", variant: "destructive" });
                return;
            }
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                toast({ title: "Invalid file type", description: "Only PDF and images allowed", variant: "destructive" });
                return;
            }
            setUploadedFile(file);
            toast({ title: "File uploaded", description: file.name });
        }
    };

    const handleSubmit = () => {
        if (!formData.employeeName || !formData.employeeId) {
            toast({ title: "Validation error", description: "Employee identity is mandatory.", variant: "destructive" });
            return;
        }

        const amount = parseFloat(formData.amount);
        const limit = amountLimits[formData.type];

        if (amount > limit) {
            toast({
                title: "Amount exceeds limit",
                description: `Maximum for ${formData.type} is ${formatINR(limit)}`,
                variant: "destructive"
            });
            return;
        }

        if (!uploadedFile && !editingProof) {
            toast({ title: "Document required", description: "Please upload proof document", variant: "destructive" });
            return;
        }

        // Check for duplicates
        const duplicate = proofs.find(p =>
            p.employeeId === formData.employeeId &&
            p.type === formData.type &&
            p.id !== editingProof?.id
        );

        if (duplicate) {
            toast({
                title: "Duplicate submission",
                description: `${formData.type} already submitted for this employee`,
                variant: "destructive"
            });
            return;
        }

        const payload = {
            ...formData,
            amount: amount,
            status: editingProof ? editingProof.status : 'Pending' as any,
            documentUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : editingProof?.documentUrl || "/docs/default.pdf",
            documentName: uploadedFile?.name || "document.pdf",
            comments: editingProof?.comments || [],
            auditTrail: editingProof?.auditTrail || []
        };

        if (editingProof) {
            updateProof(editingProof.id, payload);
            toast({ title: "Evidence updated", description: "Proof has been updated successfully." });
        } else {
            addProof(payload);
            toast({ title: "Evidence logged", description: "New proof has been submitted for audit." });
        }
        setIsFormOpen(false);
        setUploadedFile(null);
    };

    const handleDelete = (id: string) => {
        deleteProof(id);
        toast({ title: "Proof deleted", description: "Record has been removed." });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === filteredProofs.length ? [] : filteredProofs.map(p => p.id));
    };

    const handleBulkApprove = () => {
        selectedIds.forEach(id => updateProofStatus(id, 'Approved'));
        toast({ title: "Bulk approval complete", description: `${selectedIds.length} proofs approved.` });
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        selectedIds.forEach(id => updateProofStatus(id, 'Rejected'));
        toast({ title: "Bulk rejection complete", description: `${selectedIds.length} proofs rejected.` });
        setSelectedIds([]);
    };

    const handleApproveWithComment = () => {
        if (currentProofForComment) {
            updateProofStatus(currentProofForComment.id, 'Approved');
            // In real app, save comment to proof
            toast({ title: "Approved with comment", description: "Proof approved successfully." });
            setIsApprovalCommentOpen(false);
            setApprovalComment("");
            setCurrentProofForComment(null);
        }
    };

    const handleExport = (format: string) => {
        toast({ title: `Exporting as ${format}`, description: "Download will begin shortly..." });
        setIsExportOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans" style={{ zoom: 0.8 }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#FDDBBB]/20 rounded-xl flex items-center justify-center text-[#e6b48a]">
                        <FileSearch size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Evidence repository</h1>
                        <p className="text-xs font-medium text-slate-500 italic">Investment artifact audit • FY 25-26</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => setIsExportOpen(true)} variant="outline" className="h-10 border-slate-200 rounded-lg font-semibold text-xs gap-2 px-4 hover:bg-slate-50 border-none bg-slate-50/50">
                        <Download size={14} /> Export data
                    </Button>
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-semibold text-xs gap-2 px-4 hover:bg-slate-50 border-none bg-slate-50/50">
                        <Upload size={14} /> Batch import
                    </Button>
                    <Button onClick={() => handleOpenForm()} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none transition-all hover:scale-[1.02]">
                        Inject evidence <ChevronRight size={14} className="ml-1" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-6">
                    {/* Audit Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Pending audit", val: proofs.filter(p => p.status === 'Pending').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" },
                            { label: "Validated", val: proofs.filter(p => p.status === 'Approved').length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
                            { label: "Protocol breaches", val: proofs.filter(p => p.status === 'Rejected').length, icon: XCircle, color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200" },
                            { label: "Total quantum", val: formatINR(proofs.reduce((acc, curr) => acc + curr.amount, 0)), icon: Scale, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/20", border: "border-[#8B5CF6]/30" }
                        ].map((m, i) => (
                            <Card key={i} className={`rounded-2xl border ${m.border} ${m.bg} shadow-sm overflow-hidden transition-all hover:shadow-md`}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-slate-600">{m.label}</p>
                                            <p className="text-3xl font-bold text-slate-900 tracking-tight">{m.val}</p>
                                        </div>
                                        <div className={`h-14 w-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm ${m.color}`}>
                                            <m.icon size={28} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">Audit pipeline</CardTitle>
                                    <CardDescription className="text-xs font-semibold text-slate-400 mt-1 italic">{filteredProofs.length} proofs • {selectedIds.length} selected</CardDescription>
                                </div>
                                <div className="flex gap-2 font-sans">
                                    <div className="relative w-48 font-sans">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Search employee..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 h-9 bg-slate-50 border-none rounded-lg text-xs font-medium"
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="h-9 w-32 rounded-lg border-slate-100 text-xs font-semibold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="font-sans">
                                            <SelectItem value="all">All status</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="h-9 w-32 rounded-lg border-slate-100 text-xs font-semibold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="font-sans">
                                            <SelectItem value="all">All types</SelectItem>
                                            <SelectItem value="HRA">HRA</SelectItem>
                                            <SelectItem value="LIC">LIC</SelectItem>
                                            <SelectItem value="PPF">PPF</SelectItem>
                                            <SelectItem value="80D">80D</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <AnimatePresence>
                                {selectedIds.length > 0 && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-slate-50 border-b border-slate-100 px-8 py-3 flex items-center justify-between font-sans"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-slate-500">{selectedIds.length} proofs selected</span>
                                            <div className="h-4 w-px bg-slate-200" />
                                            <Button onClick={handleBulkApprove} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-4 rounded-lg shadow-sm border-none transition-all">
                                                <CheckCircle2 size={12} className="mr-2" /> Bulk approve
                                            </Button>
                                            <Button onClick={handleBulkReject} className="h-8 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold px-4 rounded-lg shadow-sm border-none transition-all">
                                                <X size={12} className="mr-2" /> Bulk reject
                                            </Button>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-slate-400 hover:text-rose-500 font-bold text-[10px]">Clear</Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Table>
                                <TableHeader className="bg-slate-50/50 font-sans">
                                    <TableRow className="border-slate-100 h-12">
                                        <TableHead className="pl-8 w-12">
                                            <Checkbox
                                                checked={selectedIds.length > 0 && selectedIds.length === filteredProofs.length}
                                                onCheckedChange={toggleSelectAll}
                                                className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                            />
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400">Identity</TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400">Artifact type</TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400">Staged amount</TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400">Submission date</TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400">Status</TableHead>
                                        <TableHead className="text-right pr-8 text-[11px] font-bold text-slate-400">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {filteredProofs.map((sub) => (
                                            <motion.tr
                                                key={sub.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`group hover:bg-slate-50/50 border-slate-50 border-b last:border-0 ${selectedIds.includes(sub.id) ? 'bg-[#8B5CF6]/5' : ''}`}
                                            >
                                                <TableCell className="pl-8 py-3">
                                                    <Checkbox
                                                        checked={selectedIds.includes(sub.id)}
                                                        onCheckedChange={() => toggleSelect(sub.id)}
                                                        className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500">{sub.employeeId.slice(-3)}</div>
                                                        <span className="text-sm font-bold text-slate-900 block leading-tight">{sub.employeeName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="border-slate-100 text-[9px] font-bold text-slate-400 px-2">{sub.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-sm font-bold text-slate-700 tracking-tight">{formatINR(sub.amount)}</TableCell>
                                                <TableCell className="text-[10px] font-semibold text-slate-400 italic">{sub.submittedDate}</TableCell>
                                                <TableCell>
                                                    <Badge className={`bg-white border-none text-[9px] font-bold shadow-sm h-6 px-3 ${sub.status === 'Approved' ? 'text-emerald-500' : sub.status === 'Rejected' ? 'text-rose-500' : 'text-amber-500'
                                                        }`}>{sub.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-[#8B5CF6] hover:bg-slate-100" onClick={() => { setSelectedProof(sub); setIsSheetOpen(true); }}>
                                                            <Eye size={14} />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:bg-slate-100">
                                                                    <MoreHorizontal size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[180px] rounded-xl p-2 border-none shadow-2xl ring-1 ring-slate-100 bg-white font-sans">
                                                                <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 px-3 py-1.5">Audit action</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => { setCurrentProofForComment(sub); setIsApprovalCommentOpen(true); }} className="rounded-lg flex items-center gap-3 px-3 py-2 font-semibold text-[11px] text-emerald-600">
                                                                    <CheckCircle2 size={14} /> Approve with comment
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => { updateProofStatus(sub.id, 'Rejected'); toast({ title: "Rejected" }); }} className="rounded-lg flex items-center gap-3 px-3 py-2 font-semibold text-[11px] text-rose-600">
                                                                    <XCircle size={14} /> Reject proof
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                                <DropdownMenuItem onClick={() => handleOpenForm(sub)} className="rounded-lg flex items-center gap-3 px-3 py-2 font-semibold text-[11px] text-slate-700">
                                                                    <FileText size={14} /> Edit proof
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDelete(sub.id)} className="rounded-lg flex items-center gap-3 px-3 py-2 font-semibold text-[11px] text-rose-400">
                                                                    <X size={14} /> Delete proof
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>

            {/* Form Dialog with File Upload */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl overflow-hidden relative fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDDBBB]/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                    <DialogHeader className="space-y-2 relative z-10 font-sans">
                        <Badge className="bg-[#FDDBBB] text-slate-700 border-none font-bold text-[10px] px-3 py-1 w-fit shadow-md">Audit node</Badge>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{editingProof ? "Revise artifact trace" : "Manual evidence injection"}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-400 leading-none mt-2 italic">Initialize investment artifact for cycle audit</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-8 relative z-10 font-sans">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none">Employee identity</Label>
                            <Input
                                placeholder="Candidate ledger name..."
                                value={formData.employeeName}
                                onChange={e => setFormData({ ...formData, employeeName: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12 font-medium text-sm px-4"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none">Registry ID</Label>
                                <Input
                                    placeholder="EMPXXX"
                                    value={formData.employeeId}
                                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-bold text-sm px-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none">Artifact type</Label>
                                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none font-bold text-xs px-4">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-sans bg-white z-[200]">
                                        {['HRA', 'LIC', 'PPF', '80D', 'Section 24', 'Others'].map(t => (
                                            <SelectItem key={t} value={t} className="rounded-lg text-xs font-semibold text-slate-700 h-10">{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none">Quantum (₹)</Label>
                                <Input
                                    placeholder="0.00"
                                    type="number"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-bold text-base text-slate-900 px-4 tabular-nums"
                                />
                                <p className="text-[10px] font-medium text-slate-400 ml-1 italic">Max: {formatINR(amountLimits[formData.type])}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none">Staged date</Label>
                                <Input
                                    type="date"
                                    value={formData.submittedDate}
                                    onChange={e => setFormData({ ...formData, submittedDate: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-semibold text-sm px-4"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none">Upload document</Label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all"
                            >
                                {uploadedFile ? (
                                    <div className="flex items-center gap-2">
                                        <Paperclip size={16} className="text-emerald-500" />
                                        <span className="text-xs font-semibold text-slate-700">{uploadedFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={20} className="text-slate-400 mb-2" />
                                        <span className="text-xs font-medium text-slate-400">Click to upload PDF or image</span>
                                        <span className="text-[10px] font-medium text-slate-300 mt-1">Max 5MB</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="relative z-10 sm:justify-start font-sans">
                        <Button
                            className="w-full bg-slate-900 text-white rounded-2xl h-14 font-bold text-sm shadow-2xl shadow-slate-200 hover:bg-[#FDDBBB] hover:text-slate-900 transition-all border-none"
                            onClick={handleSubmit}
                        >
                            {editingProof ? "Update evidence ledger" : "Map artifact to terminal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approval Comment Dialog */}
            <Dialog open={isApprovalCommentOpen} onOpenChange={setIsApprovalCommentOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <DialogHeader className="space-y-2 font-sans">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                            <MessageSquare size={24} className="text-emerald-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-slate-900">Approve with comment</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            Add approval notes for {currentProofForComment?.employeeName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <Textarea
                            placeholder="Enter approval comments or notes..."
                            value={approvalComment}
                            onChange={(e) => setApprovalComment(e.target.value)}
                            className="min-h-32 rounded-xl bg-slate-50 border-none font-medium text-sm resize-none"
                        />
                    </div>
                    <DialogFooter className="flex gap-3 font-sans">
                        <Button variant="ghost" onClick={() => setIsApprovalCommentOpen(false)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                        <Button onClick={handleApproveWithComment} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 font-bold shadow-lg shadow-emerald-100 border-none">
                            <CheckCircle2 size={14} className="mr-2" /> Approve proof
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Export Dialog */}
            <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <DialogHeader className="space-y-2 font-sans">
                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                            <Download size={24} className="text-blue-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-slate-900">Export proof data</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            Choose export format for proof submissions
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-3">
                        <Button onClick={() => handleExport('Excel')} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold justify-start px-6 border-none">
                            <FileText size={18} className="mr-3" />
                            <div className="text-left">
                                <div className="text-sm">Excel spreadsheet</div>
                                <div className="text-[10px] font-medium opacity-80">Full data with formulas</div>
                            </div>
                        </Button>
                        <Button onClick={() => handleExport('CSV')} className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold justify-start px-6 border-none">
                            <FileText size={18} className="mr-3" />
                            <div className="text-left">
                                <div className="text-sm">CSV file</div>
                                <div className="text-[10px] font-medium opacity-80">Compatible with all systems</div>
                            </div>
                        </Button>
                        <Button onClick={() => handleExport('PDF Report')} className="w-full h-12 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-xl font-bold justify-start px-6 border-none">
                            <FileText size={18} className="mr-3" />
                            <div className="text-left">
                                <div className="text-sm">PDF summary report</div>
                                <div className="text-[10px] font-medium opacity-80">Tax computation summary</div>
                            </div>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Audit Detail Sheet with Document Preview */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden font-sans">
                    <div className="h-full flex flex-col bg-white overflow-hidden font-sans">
                        <div className="bg-slate-50 p-10 text-slate-900 border-b border-slate-100 flex flex-col items-start">
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] px-3 mb-4 leading-none h-6 shadow-sm">Artifact audit</Badge>
                            <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-0">{selectedProof?.employeeName}</SheetTitle>
                            <SheetDescription className="text-slate-400 font-medium text-[11px] mt-2 italic">{selectedProof?.type} evidence chain • Registry trace</SheetDescription>
                        </div>
                        <ScrollArea className="flex-1 p-8 font-sans">
                            <div className="space-y-8">
                                <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <span className="text-[10px] font-bold text-slate-400 block mb-2 leading-none">Staged quantum</span>
                                        <h3 className="text-3xl font-bold tracking-tight leading-none">{formatINR(selectedProof?.amount || 0)}</h3>
                                        <div className="h-px bg-white/10 my-4" />
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-emerald-400" />
                                            <span className="text-[10px] font-semibold text-slate-400 leading-none">Registry match verified</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Scale size={80} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 mb-0 leading-none">Compliance artifacts</h4>
                                    <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col items-start gap-6">
                                        <div className="flex items-center gap-4 w-full group cursor-pointer">
                                            <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-[#8B5CF6] transition-colors">
                                                <FileText size={20} className="text-slate-400 group-hover:text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-xs font-bold text-slate-900 block leading-none">Evidence_TRX_{selectedProof?.id.slice(-4)}.pdf</span>
                                                <span className="text-[10px] font-medium text-slate-400 mt-1.5 block leading-none italic">Verified digital handshake • 3.1 MB</span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="rounded-lg h-9 w-9 text-slate-300 hover:text-[#8B5CF6]">
                                                <Eye size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 mb-0 leading-none">Validation details</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-500">Amount limit</span>
                                            <span className="font-bold text-slate-900">{formatINR(amountLimits[selectedProof?.type || 'HRA'])}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-500">Compliance status</span>
                                            <Badge className="bg-emerald-50 text-emerald-600 text-[9px] font-bold">Verified</Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-500">Duplicate check</span>
                                            <Badge className="bg-emerald-50 text-emerald-600 text-[9px] font-bold">Passed</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex flex-col gap-3">
                            <Button
                                onClick={() => { updateProofStatus(selectedProof.id, 'Approved'); setIsSheetOpen(false); toast({ title: "Authorized" }); }}
                                className="w-full h-12 bg-[#8B5CF6] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#8B5CF6]/20 border-none hover:bg-[#7c4dff] transition-all"
                            >
                                Authorize artifact
                            </Button>
                            <Button variant="ghost" className="w-full h-10 text-slate-400 font-bold text-xs hover:text-rose-500 transition-all border-none" onClick={() => setIsSheetOpen(false)}>Reject protocol</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default ProofSubmissionPage;
