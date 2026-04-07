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
import { useToast } from "@/shared/components/ui/use-toast";
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
    Users
} from "lucide-react";

type SignatureDoc = {
    id: string;
    name: string;
    type: "Offer Letter" | "Contract" | "Policy" | "NDA" | "Amendment";
    sentTo: string;
    sentToEmail: string;
    sentDate: string;
    status: "Pending" | "Viewed" | "Signed" | "Expired" | "Declined";
    signedDate?: string;
    viewedDate?: string;
    expiryDate: string;
};

const mockDocuments: SignatureDoc[] = [
    { id: "SIG-001", name: "Offer Letter - Senior Developer", type: "Offer Letter", sentTo: "Amit Joshi", sentToEmail: "amit@email.com", sentDate: "2026-03-28", status: "Signed", signedDate: "2026-03-29", viewedDate: "2026-03-28", expiryDate: "2026-04-15" },
    { id: "SIG-002", name: "NDA - Project Phoenix", type: "NDA", sentTo: "Priya Sharma", sentToEmail: "priya@email.com", sentDate: "2026-03-30", status: "Viewed", viewedDate: "2026-03-31", expiryDate: "2026-04-10" },
    { id: "SIG-003", name: "Employment Contract - Full Time", type: "Contract", sentTo: "Rahul Verma", sentToEmail: "rahul@email.com", sentDate: "2026-03-25", status: "Pending", expiryDate: "2026-04-08" },
    { id: "SIG-004", name: "Remote Work Policy Acknowledgement", type: "Policy", sentTo: "Sneha Rao", sentToEmail: "sneha@email.com", sentDate: "2026-03-20", status: "Signed", signedDate: "2026-03-21", viewedDate: "2026-03-20", expiryDate: "2026-04-05" },
    { id: "SIG-005", name: "Salary Revision Amendment", type: "Amendment", sentTo: "Vikram Singh", sentToEmail: "vikram@email.com", sentDate: "2026-03-15", status: "Expired", expiryDate: "2026-03-30" },
    { id: "SIG-006", name: "NDA - Client Alpha", type: "NDA", sentTo: "Kavita Patel", sentToEmail: "kavita@email.com", sentDate: "2026-03-29", status: "Declined", expiryDate: "2026-04-12" },
    { id: "SIG-007", name: "Offer Letter - Product Manager", type: "Offer Letter", sentTo: "Deepak Nair", sentToEmail: "deepak@email.com", sentDate: "2026-04-01", status: "Pending", expiryDate: "2026-04-15" },
    { id: "SIG-008", name: "IP Assignment Agreement", type: "Contract", sentTo: "Arjun Reddy", sentToEmail: "arjun@email.com", sentDate: "2026-04-01", status: "Viewed", viewedDate: "2026-04-02", expiryDate: "2026-04-20" },
];

const ESignaturesPage = () => {
    const { toast } = useToast();
    const [documents, setDocuments] = useState(mockDocuments);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [isSendOpen, setIsSendOpen] = useState(false);
    const [isTrackerOpen, setIsTrackerOpen] = useState<SignatureDoc | null>(null);
    const [isAuditOpen, setIsAuditOpen] = useState<SignatureDoc | null>(null);

    const [form, setForm] = useState({
        document: "",
        signerName: "",
        signerEmail: "",
        signingOrder: "1",
        expiryDate: "",
        message: "",
    });

    const pendingCount = documents.filter(d => d.status === "Pending" || d.status === "Viewed").length;
    const signedThisMonth = documents.filter(d => d.status === "Signed" && d.signedDate?.startsWith("2026-04")).length + documents.filter(d => d.status === "Signed" && d.signedDate?.startsWith("2026-03")).length;
    const avgSigningTime = "1.2 days";

    const filtered = documents.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.sentTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "all" || d.status === statusFilter;
        const matchType = typeFilter === "all" || d.type === typeFilter;
        return matchSearch && matchStatus && matchType;
    });

    const handleSend = () => {
        if (!form.document || !form.signerName || !form.signerEmail) {
            toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }
        const newDoc: SignatureDoc = {
            id: `SIG-${String(documents.length + 1).padStart(3, "0")}`,
            name: form.document,
            type: "Contract",
            sentTo: form.signerName,
            sentToEmail: form.signerEmail,
            sentDate: new Date().toISOString().split("T")[0],
            status: "Pending",
            expiryDate: form.expiryDate || "2026-04-30",
        };
        setDocuments([newDoc, ...documents]);
        setIsSendOpen(false);
        setForm({ document: "", signerName: "", signerEmail: "", signingOrder: "1", expiryDate: "", message: "" });
        toast({ title: "Document Sent", description: `Sent to ${form.signerName} for signature.` });
    };

    const handleReminder = (doc: SignatureDoc) => {
        toast({ title: "Reminder Sent", description: `Reminder sent to ${doc.sentTo} for "${doc.name}".` });
    };

    const statusBadge = (status: SignatureDoc["status"]) => {
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
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => toast({ title: "Bulk Send", description: "Bulk signature request would be initiated for selected documents." })}>
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
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
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
                                <TableRow key={doc.id} className="hover:bg-slate-50/50">
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setIsTrackerOpen(doc)} title="Track"><Eye size={14} /></Button>
                                            {(doc.status === "Pending" || doc.status === "Viewed") && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500" onClick={() => handleReminder(doc)} title="Remind"><Bell size={14} /></Button>
                                            )}
                                            {doc.status === "Signed" && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="Download" onClick={() => toast({ title: "Downloading", description: `Signed document "${doc.title}" is being downloaded.` })}><Download size={14} /></Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setIsAuditOpen(doc)} title="Audit"><FileCheck size={14} /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow><TableCell colSpan={7} className="h-24 text-center text-slate-400">No documents found.</TableCell></TableRow>
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
                            <Label className="text-xs font-bold text-slate-500">Document / Template</Label>
                            <Select value={form.document} onValueChange={v => setForm({ ...form, document: v })}>
                                <SelectTrigger><SelectValue placeholder="Select document..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Offer Letter Template">Offer Letter Template</SelectItem>
                                    <SelectItem value="Employment Contract">Employment Contract</SelectItem>
                                    <SelectItem value="NDA Template">NDA Template</SelectItem>
                                    <SelectItem value="Policy Acknowledgement">Policy Acknowledgement</SelectItem>
                                    <SelectItem value="Amendment Template">Amendment Template</SelectItem>
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
                        <Button variant="outline" onClick={() => setIsSendOpen(false)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleSend}>Send Document</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Signature Status Tracker */}
            <Dialog open={!!isTrackerOpen} onOpenChange={() => setIsTrackerOpen(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Signature Status</DialogTitle>
                        <DialogDescription>{isTrackerOpen?.name}</DialogDescription>
                    </DialogHeader>
                    {isTrackerOpen && (
                        <div className="py-4">
                            <div className="flex items-center justify-between">
                                {[
                                    { label: "Sent", date: isTrackerOpen.sentDate, done: true },
                                    { label: "Viewed", date: isTrackerOpen.viewedDate, done: !!isTrackerOpen.viewedDate },
                                    { label: "Signed", date: isTrackerOpen.signedDate, done: isTrackerOpen.status === "Signed" },
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
                            {isTrackerOpen.status === "Declined" && (
                                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium flex items-center gap-2">
                                    <XCircle size={16} /> Document was declined by the signer.
                                </div>
                            )}
                            {isTrackerOpen.status === "Expired" && (
                                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium flex items-center gap-2">
                                    <Clock size={16} /> Document expired on {isTrackerOpen.expiryDate}.
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Audit Trail Dialog */}
            <Dialog open={!!isAuditOpen} onOpenChange={() => setIsAuditOpen(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Signature Audit Trail</DialogTitle>
                        <DialogDescription>{isAuditOpen?.name}</DialogDescription>
                    </DialogHeader>
                    {isAuditOpen && (
                        <div className="space-y-3 py-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <Mail size={14} className="text-blue-500" />
                                <div><p className="text-sm font-medium text-slate-700">Document sent to {isAuditOpen.sentTo}</p><p className="text-xs text-slate-400">{isAuditOpen.sentDate}</p></div>
                            </div>
                            {isAuditOpen.viewedDate && (
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <Eye size={14} className="text-amber-500" />
                                    <div><p className="text-sm font-medium text-slate-700">Document viewed by {isAuditOpen.sentTo}</p><p className="text-xs text-slate-400">{isAuditOpen.viewedDate}</p></div>
                                </div>
                            )}
                            {isAuditOpen.signedDate && (
                                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    <div><p className="text-sm font-medium text-slate-700">Document signed by {isAuditOpen.sentTo}</p><p className="text-xs text-slate-400">{isAuditOpen.signedDate}</p></div>
                                </div>
                            )}
                            {isAuditOpen.status === "Declined" && (
                                <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg">
                                    <XCircle size={14} className="text-rose-500" />
                                    <div><p className="text-sm font-medium text-slate-700">Document declined by {isAuditOpen.sentTo}</p></div>
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
