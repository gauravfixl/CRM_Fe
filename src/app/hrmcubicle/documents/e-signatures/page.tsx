"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { useDocumentsStore, type ESignatureRequest } from "@/shared/data/documents-store";
import { toast } from "sonner";
import { required, minLength, maxLength, isEmail, isStrictPositiveInt, isFutureDate, firstError } from "@/shared/utils/validators";
import {
    PenTool,
    Plus,
    Search,
    Clock,
    FileCheck,
    Send,
    Eye,
    Bell,
    CheckCircle2,
    XCircle,
    FileText,
    Mail,
    Download,
    ArrowRight,
    Users,
    Trash2,
    MoreHorizontal,
    Pencil,
    RefreshCw,
} from "lucide-react";

type SignatureType = ESignatureRequest['type'];
type SignatureStatus = ESignatureRequest['status'];

const ESignaturesPage = () => {
    const { eSignatures, sendESignature, updateESignature, setESignatureStatus, deleteESignature, bulkDeleteESignatures } = useDocumentsStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [isSendOpen, setIsSendOpen] = useState(false);
    const [isBulkSendOpen, setIsBulkSendOpen] = useState(false);
    const [trackerDoc, setTrackerDoc] = useState<ESignatureRequest | null>(null);
    const [auditDoc, setAuditDoc] = useState<ESignatureRequest | null>(null);
    const [editingDoc, setEditingDoc] = useState<ESignatureRequest | null>(null);
    const [reminderDoc, setReminderDoc] = useState<ESignatureRequest | null>(null);
    const [downloadDoc, setDownloadDoc] = useState<ESignatureRequest | null>(null);
    const [statusChangeDoc, setStatusChangeDoc] = useState<ESignatureRequest | null>(null);
    const [pendingStatus, setPendingStatus] = useState<SignatureStatus>("Pending");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [bulkRows, setBulkRows] = useState<{ name: string; email: string }[]>([
        { name: "", email: "" },
        { name: "", email: "" },
    ]);
    const [bulkDocument, setBulkDocument] = useState<SignatureType>("Contract");
    const [bulkExpiry, setBulkExpiry] = useState("");

    const [form, setForm] = useState({
        document: "",
        type: "Contract" as SignatureType,
        signerName: "",
        signerEmail: "",
        signingOrder: "1",
        expiryDate: "",
        message: "",
    });

    const pendingCount = eSignatures.filter(d => d.status === "Pending" || d.status === "Viewed").length;
    const signedThisMonth = eSignatures.filter(d => {
        if (d.status !== "Signed" || !d.signedDate) return false;
        const now = new Date();
        const cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
        return new Date(d.signedDate) >= cutoff;
    }).length;
    const signedAll = eSignatures.filter(d => d.status === "Signed");
    const avgSigningTime = signedAll.length > 0 ? (() => {
        const totalDays = signedAll.reduce((sum, d) => {
            if (!d.signedDate) return sum;
            const diff = (new Date(d.signedDate).getTime() - new Date(d.sentDate).getTime()) / (1000 * 60 * 60 * 24);
            return sum + Math.max(0, diff);
        }, 0);
        return `${(totalDays / signedAll.length).toFixed(1)} days`;
    })() : "—";

    const filtered = eSignatures.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.sentTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "all" || d.status === statusFilter;
        const matchType = typeFilter === "all" || d.type === typeFilter;
        return matchSearch && matchStatus && matchType;
    });

    const allFilteredSelected = filtered.length > 0 && filtered.every(d => selectedIds.includes(d.id));

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedIds(prev => prev.filter(id => !filtered.some(d => d.id === id)));
        } else {
            const ids = filtered.map(d => d.id);
            setSelectedIds(prev => Array.from(new Set([...prev, ...ids])));
        }
    };

    const resetForm = () => setForm({ document: "", type: "Contract", signerName: "", signerEmail: "", signingOrder: "1", expiryDate: "", message: "" });

    const handleSend = () => {
        const trimmedEmail = form.signerEmail.trim();
        const err = firstError(
            required(form.document, "Document name"),
            minLength(form.document, 3, "Document name"),
            maxLength(form.document, 120, "Document name"),
            required(form.type, "Document type"),
            required(form.signerName, "Signer name"),
            minLength(form.signerName, 2, "Signer name"),
            maxLength(form.signerName, 80, "Signer name"),
            required(trimmedEmail, "Signer email"),
            isEmail(trimmedEmail, "Signer email"),
            maxLength(trimmedEmail, 254, "Signer email"),
            isStrictPositiveInt(form.signingOrder, "Signing order"),
            form.expiryDate ? isFutureDate(form.expiryDate, "Expiry date") : null,
            form.message ? maxLength(form.message, 500, "Message") : null,
        );
        if (err) { toast.error(err); return; }
        sendESignature({
            name: form.document.trim(),
            type: form.type,
            sentTo: form.signerName.trim(),
            sentToEmail: trimmedEmail,
            expiryDate: form.expiryDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            signingOrder: parseInt(form.signingOrder, 10),
            message: form.message?.trim() || undefined,
        });
        setIsSendOpen(false);
        resetForm();
        toast.success(`Document sent to ${form.signerName.trim()} for signature`);
    };

    const handleSaveEdit = () => {
        if (!editingDoc) return;
        const trimmedEmail = editingDoc.sentToEmail.trim();
        const err = firstError(
            required(editingDoc.name, "Document name"),
            minLength(editingDoc.name, 3, "Document name"),
            maxLength(editingDoc.name, 120, "Document name"),
            required(editingDoc.type, "Document type"),
            required(editingDoc.sentTo, "Signer name"),
            minLength(editingDoc.sentTo, 2, "Signer name"),
            maxLength(editingDoc.sentTo, 80, "Signer name"),
            required(trimmedEmail, "Signer email"),
            isEmail(trimmedEmail, "Signer email"),
            maxLength(trimmedEmail, 254, "Signer email"),
            required(editingDoc.expiryDate, "Expiry date"),
        );
        if (err) { toast.error(err); return; }
        updateESignature(editingDoc.id, {
            ...editingDoc,
            name: editingDoc.name.trim(),
            sentTo: editingDoc.sentTo.trim(),
            sentToEmail: trimmedEmail,
        });
        toast.success("Signature request updated");
        setEditingDoc(null);
    };

    const handleStatusChange = () => {
        if (!statusChangeDoc) return;
        setESignatureStatus(statusChangeDoc.id, pendingStatus);
        toast.success(`Status updated to ${pendingStatus}`);
        setStatusChangeDoc(null);
    };

    const handleSendReminder = () => {
        if (!reminderDoc) return;
        toast.success(`Reminder sent to ${reminderDoc.sentTo}`);
        setReminderDoc(null);
    };

    const handleDownload = () => {
        if (!downloadDoc) return;
        const content = `${downloadDoc.name}\n\nSigned by: ${downloadDoc.sentTo} (${downloadDoc.sentToEmail})\nSigned on: ${downloadDoc.signedDate || "—"}\nDocument ID: ${downloadDoc.id}\nType: ${downloadDoc.type}\n\n— Signature Verified —`;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${downloadDoc.id}_signed.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded "${downloadDoc.name}"`);
        setDownloadDoc(null);
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        deleteESignature(deleteId);
        setSelectedIds(prev => prev.filter(id => id !== deleteId));
        toast.success("Signature request deleted");
        setDeleteId(null);
    };

    const confirmBulkDelete = () => {
        const count = selectedIds.length;
        bulkDeleteESignatures(selectedIds);
        setSelectedIds([]);
        setBulkDeleteOpen(false);
        toast.success(`${count} signature requests deleted`);
    };

    const handleBulkSend = () => {
        if (bulkExpiry) {
            const dateErr = isFutureDate(bulkExpiry, "Expiry date");
            if (dateErr) { toast.error(dateErr); return; }
        }
        const filledRows = bulkRows.filter(r => r.name.trim() || r.email.trim());
        if (filledRows.length === 0) {
            toast.error("Add at least one signer");
            return;
        }
        if (filledRows.length > 50) {
            toast.error("Maximum 50 signers per bulk request");
            return;
        }
        const invalid: { idx: number; reason: string }[] = [];
        const valid: { name: string; email: string }[] = [];
        const seenEmails = new Set<string>();
        filledRows.forEach((r, idx) => {
            const name = r.name.trim();
            const email = r.email.trim().toLowerCase();
            const rowErr = firstError(
                required(name, "Name"),
                minLength(name, 2, "Name"),
                maxLength(name, 80, "Name"),
                required(email, "Email"),
                isEmail(email, "Email"),
                maxLength(email, 254, "Email"),
            );
            if (rowErr) {
                invalid.push({ idx: idx + 1, reason: rowErr });
                return;
            }
            if (seenEmails.has(email)) {
                invalid.push({ idx: idx + 1, reason: "Duplicate email in this batch" });
                return;
            }
            seenEmails.add(email);
            valid.push({ name, email: r.email.trim() });
        });
        if (valid.length === 0) {
            toast.error(`No valid signers. Row 1: ${invalid[0]?.reason || "invalid"}`);
            return;
        }
        valid.forEach(row => {
            sendESignature({
                name: bulkDocument,
                type: bulkDocument,
                sentTo: row.name,
                sentToEmail: row.email,
                expiryDate: bulkExpiry || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            });
        });
        if (invalid.length) {
            toast.warning(`${valid.length} sent · ${invalid.length} skipped (row ${invalid[0].idx}: ${invalid[0].reason})`);
        } else {
            toast.success(`${valid.length} signature requests sent`);
        }
        setIsBulkSendOpen(false);
        setBulkRows([{ name: "", email: "" }, { name: "", email: "" }]);
        setBulkExpiry("");
    };

    const statusBadge = (status: SignatureStatus) => {
        const styles: Record<string, string> = {
            Pending: "bg-amber-50 text-amber-600 border-amber-200",
            Viewed: "bg-blue-50 text-blue-600 border-blue-200",
            Signed: "bg-emerald-50 text-emerald-600 border-emerald-200",
            Expired: "bg-slate-50 text-slate-500 border-slate-200",
            Declined: "bg-rose-50 text-rose-600 border-rose-200",
        };
        return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-teal-600 rounded-xl flex items-center justify-center text-white">
                        <PenTool size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">E-Signatures</h1>
                        <p className="text-sm font-medium text-slate-500">Send, track, and manage digital document signatures.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {selectedIds.length > 0 && (
                        <Button variant="outline" className="font-bold border-rose-100 bg-rose-50/40 text-rose-600" onClick={() => setBulkDeleteOpen(true)}>
                            <Trash2 size={16} className="mr-2" /> Delete ({selectedIds.length})
                        </Button>
                    )}
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => setIsBulkSendOpen(true)}>
                        <Users size={16} className="mr-2 text-slate-400" /> Bulk Send
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={() => setIsSendOpen(true)}>
                        <Send size={16} className="mr-2" /> Send for Signature
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="px-8 py-6 grid grid-cols-3 gap-6">
                <Card className="rounded-none border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center"><Clock size={24} className="text-amber-600" /></div>
                        <div><p className="text-sm text-slate-500 font-medium">Pending Signature</p><p className="text-2xl font-bold text-slate-900">{pendingCount}</p></div>
                    </CardContent>
                </Card>
                <Card className="rounded-none border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center"><FileCheck size={24} className="text-emerald-600" /></div>
                        <div><p className="text-sm text-slate-500 font-medium">Signed This Month</p><p className="text-2xl font-bold text-slate-900">{signedThisMonth}</p></div>
                    </CardContent>
                </Card>
                <Card className="rounded-none border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center"><Clock size={24} className="text-blue-600" /></div>
                        <div><p className="text-sm text-slate-500 font-medium">Avg Signing Time</p><p className="text-2xl font-bold text-slate-900">{avgSigningTime}</p></div>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar */}
            <div className="bg-white px-8 py-4 border-y border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="relative w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search documents..." className="pl-9 bg-slate-50 border-slate-200" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-slate-50 font-medium"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Viewed">Viewed</SelectItem>
                        <SelectItem value="Signed">Signed</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Declined">Declined</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px] bg-slate-50 font-medium"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Policy">Policy</SelectItem>
                        <SelectItem value="NDA">NDA</SelectItem>
                        <SelectItem value="Amendment">Amendment</SelectItem>
                    </SelectContent>
                </Select>
                {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-500" onClick={() => { setSearchTerm(""); setStatusFilter("all"); setTypeFilter("all"); }}>
                        <RefreshCw size={14} className="mr-1.5" /> Reset
                    </Button>
                )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                        checked={allFilteredSelected}
                                        onChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Document</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Type</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Sent To</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Sent Date</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Signed Date</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(doc => (
                                <TableRow key={doc.id} className={`hover:bg-slate-50/50 ${selectedIds.includes(doc.id) ? 'bg-purple-50/30' : ''}`}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            className="rounded"
                                            checked={selectedIds.includes(doc.id)}
                                            onChange={() => toggleSelect(doc.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-slate-400" />
                                            <span className="font-bold text-slate-700 text-sm">{doc.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">{doc.type}</Badge></TableCell>
                                    <TableCell>
                                        <div><span className="font-medium text-slate-700 text-sm">{doc.sentTo}</span><p className="text-xs text-slate-400">{doc.sentToEmail}</p></div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">{doc.sentDate}</TableCell>
                                    <TableCell>{statusBadge(doc.status)}</TableCell>
                                    <TableCell className="text-sm text-slate-600">{doc.signedDate || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setTrackerDoc(doc)} title="Track"><Eye size={14} /></Button>
                                            {(doc.status === "Pending" || doc.status === "Viewed") && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500" onClick={() => setReminderDoc(doc)} title="Remind"><Bell size={14} /></Button>
                                            )}
                                            {doc.status === "Signed" && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="Download" onClick={() => setDownloadDoc(doc)}><Download size={14} /></Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setAuditDoc(doc)} title="Audit"><FileCheck size={14} /></Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="More"><MoreHorizontal size={14} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52">
                                                    <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase">Manage</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setEditingDoc({ ...doc })}>
                                                        <Pencil size={14} className="text-indigo-500" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setStatusChangeDoc(doc); setPendingStatus(doc.status); }}>
                                                        <RefreshCw size={14} className="text-indigo-500" /> Update Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600" onClick={() => setDeleteId(doc.id)}>
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow><TableCell colSpan={8} className="h-24 text-center text-slate-400">No documents found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Send for Signature Dialog */}
            <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
                <DialogContent className="max-w-lg border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Send size={20} className="text-[#8B5CF6]" /> Send for Signature</DialogTitle>
                        <DialogDescription>Select a document and add signers.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Document Name</Label>
                            <Input placeholder="e.g. Offer Letter — Senior Designer" value={form.document} onChange={e => setForm({ ...form, document: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Document Type</Label>
                            <Select value={form.type} onValueChange={(val: SignatureType) => setForm({ ...form, type: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="NDA">NDA</SelectItem>
                                    <SelectItem value="Policy">Policy</SelectItem>
                                    <SelectItem value="Amendment">Amendment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Signer Name</Label>
                                <Input placeholder="e.g. Amit Joshi" value={form.signerName} onChange={e => setForm({ ...form, signerName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Signer Email</Label>
                                <Input type="email" placeholder="e.g. amit@email.com" value={form.signerEmail} onChange={e => setForm({ ...form, signerEmail: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Signing Order</Label>
                                <Input type="number" min={1} value={form.signingOrder} onChange={e => setForm({ ...form, signingOrder: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Expiry Date</Label>
                                <Input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Message (Optional)</Label>
                            <Input placeholder="Add a note for the signer..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsSendOpen(false); resetForm(); }}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleSend}>Send Document</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Send Dialog */}
            <Dialog open={isBulkSendOpen} onOpenChange={setIsBulkSendOpen}>
                <DialogContent className="max-w-2xl border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Users size={20} className="text-[#8B5CF6]" /> Bulk Signature Request</DialogTitle>
                        <DialogDescription>Send the same document to multiple signers at once.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Document Type</Label>
                                <Select value={bulkDocument} onValueChange={(v: SignatureType) => setBulkDocument(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="NDA">NDA</SelectItem>
                                        <SelectItem value="Policy">Policy</SelectItem>
                                        <SelectItem value="Amendment">Amendment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Common Expiry Date</Label>
                                <Input type="date" value={bulkExpiry} onChange={e => setBulkExpiry(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Signers</Label>
                            <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
                                {bulkRows.map((row, idx) => (
                                    <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                                        <Input placeholder="Signer name" value={row.name} onChange={e => setBulkRows(r => r.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} />
                                        <Input type="email" placeholder="signer@email.com" value={row.email} onChange={e => setBulkRows(r => r.map((x, i) => i === idx ? { ...x, email: e.target.value } : x))} />
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-500" onClick={() => setBulkRows(r => r.length > 1 ? r.filter((_, i) => i !== idx) : r)} disabled={bulkRows.length <= 1}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" size="sm" className="font-bold text-xs mt-2" onClick={() => setBulkRows(r => [...r, { name: "", email: "" }])}>
                                <Plus size={14} className="mr-1" /> Add Signer
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBulkSendOpen(false)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleBulkSend}>Send to All</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingDoc} onOpenChange={(open) => !open && setEditingDoc(null)}>
                <DialogContent className="max-w-lg border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Pencil size={20} className="text-[#8B5CF6]" /> Edit Signature Request</DialogTitle>
                        <DialogDescription>Update document and signer details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Document Name</Label>
                            <Input value={editingDoc?.name || ""} onChange={e => setEditingDoc(prev => prev ? { ...prev, name: e.target.value } : null)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Type</Label>
                            <Select value={editingDoc?.type} onValueChange={(val: SignatureType) => setEditingDoc(prev => prev ? { ...prev, type: val } : null)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="NDA">NDA</SelectItem>
                                    <SelectItem value="Policy">Policy</SelectItem>
                                    <SelectItem value="Amendment">Amendment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Signer Name</Label>
                                <Input value={editingDoc?.sentTo || ""} onChange={e => setEditingDoc(prev => prev ? { ...prev, sentTo: e.target.value } : null)} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Signer Email</Label>
                                <Input type="email" value={editingDoc?.sentToEmail || ""} onChange={e => setEditingDoc(prev => prev ? { ...prev, sentToEmail: e.target.value } : null)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Expiry Date</Label>
                            <Input type="date" value={editingDoc?.expiryDate || ""} onChange={e => setEditingDoc(prev => prev ? { ...prev, expiryDate: e.target.value } : null)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingDoc(null)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={!!statusChangeDoc} onOpenChange={(open) => !open && setStatusChangeDoc(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><RefreshCw size={20} className="text-[#8B5CF6]" /> Update Signature Status</DialogTitle>
                        <DialogDescription>{statusChangeDoc?.name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                        <Label className="text-xs font-bold text-slate-500">New Status</Label>
                        <Select value={pendingStatus} onValueChange={(v: SignatureStatus) => setPendingStatus(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Viewed">Viewed</SelectItem>
                                <SelectItem value="Signed">Signed</SelectItem>
                                <SelectItem value="Expired">Expired</SelectItem>
                                <SelectItem value="Declined">Declined</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusChangeDoc(null)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleStatusChange}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reminder Dialog */}
            <Dialog open={!!reminderDoc} onOpenChange={(open) => !open && setReminderDoc(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Bell size={20} className="text-amber-500" /> Send Reminder?</DialogTitle>
                        <DialogDescription>
                            A reminder email will be sent to {reminderDoc?.sentTo} ({reminderDoc?.sentToEmail}) for "{reminderDoc?.name}".
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReminderDoc(null)}>Cancel</Button>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold" onClick={handleSendReminder}>Send Reminder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Download Confirm */}
            <Dialog open={!!downloadDoc} onOpenChange={(open) => !open && setDownloadDoc(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Download size={20} className="text-emerald-500" /> Download Signed Copy?</DialogTitle>
                        <DialogDescription>
                            A signed copy of "{downloadDoc?.name}" will be downloaded.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDownloadDoc(null)}>Cancel</Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold" onClick={handleDownload}>Download</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Trash2 size={20} className="text-rose-500" /> Delete Signature Request?</DialogTitle>
                        <DialogDescription>This action permanently removes the request and its audit trail.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white font-bold" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Confirm */}
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Trash2 size={20} className="text-rose-500" /> Delete {selectedIds.length} Requests?</DialogTitle>
                        <DialogDescription>All selected signature requests and their audit trails will be permanently removed.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white font-bold" onClick={confirmBulkDelete}>Delete All</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Signature Status Tracker */}
            <Dialog open={!!trackerDoc} onOpenChange={() => setTrackerDoc(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Signature Status</DialogTitle>
                        <DialogDescription>{trackerDoc?.name}</DialogDescription>
                    </DialogHeader>
                    {trackerDoc && (
                        <div className="py-4">
                            <div className="flex items-center justify-between">
                                {[
                                    { label: "Sent", date: trackerDoc.sentDate, done: true },
                                    { label: "Viewed", date: trackerDoc.viewedDate, done: !!trackerDoc.viewedDate },
                                    { label: "Signed", date: trackerDoc.signedDate, done: trackerDoc.status === "Signed" },
                                ].map((step, i, arr) => (
                                    <React.Fragment key={step.label}>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                                {step.done ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                            </div>
                                            <span className={`text-xs font-bold ${step.done ? "text-emerald-600" : "text-slate-400"}`}>{step.label}</span>
                                            <span className="text-[10px] text-slate-400">{step.date || "Pending"}</span>
                                        </div>
                                        {i < arr.length - 1 && <ArrowRight size={16} className="text-slate-300 mt-[-16px]" />}
                                    </React.Fragment>
                                ))}
                            </div>
                            {trackerDoc.status === "Declined" && (
                                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium flex items-center gap-2">
                                    <XCircle size={16} /> Document was declined by the signer.
                                </div>
                            )}
                            {trackerDoc.status === "Expired" && (
                                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium flex items-center gap-2">
                                    <Clock size={16} /> Document expired on {trackerDoc.expiryDate}.
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Audit Trail Dialog */}
            <Dialog open={!!auditDoc} onOpenChange={() => setAuditDoc(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Signature Audit Trail</DialogTitle>
                        <DialogDescription>{auditDoc?.name}</DialogDescription>
                    </DialogHeader>
                    {auditDoc && (
                        <div className="space-y-3 py-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <Mail size={14} className="text-blue-500" />
                                <div><p className="text-sm font-medium text-slate-700">Document sent to {auditDoc.sentTo}</p><p className="text-xs text-slate-400">{auditDoc.sentDate}</p></div>
                            </div>
                            {auditDoc.viewedDate && (
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <Eye size={14} className="text-amber-500" />
                                    <div><p className="text-sm font-medium text-slate-700">Document viewed by {auditDoc.sentTo}</p><p className="text-xs text-slate-400">{auditDoc.viewedDate}</p></div>
                                </div>
                            )}
                            {auditDoc.signedDate && (
                                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    <div><p className="text-sm font-medium text-slate-700">Document signed by {auditDoc.sentTo}</p><p className="text-xs text-slate-400">{auditDoc.signedDate}</p></div>
                                </div>
                            )}
                            {auditDoc.status === "Declined" && (
                                <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg">
                                    <XCircle size={14} className="text-rose-500" />
                                    <div><p className="text-sm font-medium text-slate-700">Document declined by {auditDoc.sentTo}</p></div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ESignaturesPage;
