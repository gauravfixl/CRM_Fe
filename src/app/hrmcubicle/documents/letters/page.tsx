"use client";

import React, { useState } from 'react';
import {
    Plus,
    Search,
    Send,
    FileText,
    CheckCircle2,
    Clock,
    Mail,
    Download,
    MoreHorizontal,
    User,
    Calendar,
    Filter,
    ArrowUpRight,
    Eye,
    Trash2,
    Stamp,
    Printer,
    PenTool
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import { useDocumentsStore, type IssuedLetter } from "@/shared/data/documents-store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { required, minLength, maxLength, isEmail, isEmployeeId, firstError } from "@/shared/utils/validators";

const LettersPage = () => {
    const { issuedLetters, letterTemplates, issueLetter, updateLetter, updateLetterStatus, deleteLetter } = useDocumentsStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
    const [selectedLetterIds, setSelectedLetterIds] = useState<string[]>([]);
    const [previewLetter, setPreviewLetter] = useState<IssuedLetter | null>(null);
    const [editingLetter, setEditingLetter] = useState<IssuedLetter | null>(null);
    const [archiveLetter, setArchiveLetter] = useState<IssuedLetter | null>(null);
    const [emailLetter, setEmailLetter] = useState<IssuedLetter | null>(null);
    const [emailRecipient, setEmailRecipient] = useState("");
    const [deleteLetterId, setDeleteLetterId] = useState<string | null>(null);

    const [newLetter, setNewLetter] = useState({
        employeeId: "",
        employeeName: "",
        letterType: "Offer Letter",
        templateId: "TMP-001",
        issuedBy: "HR Admin",
        status: "Draft" as IssuedLetter['status'],
        fileUrl: "#"
    });

    const filteredLetters = issuedLetters.filter(letter => {
        const matchesSearch = letter.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            letter.letterType.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || letter.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: issuedLetters.length,
        sent: issuedLetters.filter(l => l.status === "Sent").length,
        signed: issuedLetters.filter(l => l.status === "Signed").length,
        draft: issuedLetters.filter(l => l.status === "Draft").length
    };

    const validateLetter = (l: { employeeName: string; employeeId: string; letterType: string; templateId: string; issuedBy: string }): string | null => {
        const templateExists = !l.templateId || letterTemplates.some(t => t.id === l.templateId);
        return firstError(
            required(l.employeeName, "Employee name"),
            minLength(l.employeeName, 2, "Employee name"),
            maxLength(l.employeeName, 80, "Employee name"),
            required(l.employeeId, "Employee ID"),
            isEmployeeId(l.employeeId, "Employee ID"),
            required(l.letterType, "Letter type"),
            required(l.issuedBy, "Issued by"),
            maxLength(l.issuedBy, 80, "Issued by"),
            templateExists ? null : "Selected template no longer exists",
        );
    };

    const handleIssueLetter = () => {
        const err = validateLetter(newLetter);
        if (err) { toast.error(err); return; }
        issueLetter({
            ...newLetter,
            employeeName: newLetter.employeeName.trim(),
            employeeId: newLetter.employeeId.trim(),
            issuedBy: newLetter.issuedBy.trim(),
            status: "Sent",
        });
        setIsIssueDialogOpen(false);
        setNewLetter({
            employeeId: "",
            employeeName: "",
            letterType: "Offer Letter",
            templateId: "TMP-001",
            issuedBy: "HR Admin",
            status: "Draft",
            fileUrl: "#"
        });
        toast.success("Letter issued successfully");
    };

    const toggleSelect = (id: string) => {
        setSelectedLetterIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        selectedLetterIds.forEach(id => deleteLetter(id));
        setSelectedLetterIds([]);
        toast.success(`${selectedLetterIds.length} letters deleted`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Signed":
                return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 font-bold">Signed</Badge>;
            case "Sent":
                return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 font-bold">Sent</Badge>;
            case "Draft":
                return <Badge variant="secondary" className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20 font-bold">Draft</Badge>;
            case "Archived":
                return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 font-bold">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleSaveEdit = () => {
        if (!editingLetter) return;
        const err = validateLetter(editingLetter);
        if (err) { toast.error(err); return; }
        updateLetter(editingLetter.id, {
            ...editingLetter,
            employeeName: editingLetter.employeeName.trim(),
            employeeId: editingLetter.employeeId.trim(),
            issuedBy: editingLetter.issuedBy.trim(),
        });
        toast.success("Letter updated successfully");
        setEditingLetter(null);
    };

    const handleArchive = () => {
        if (!archiveLetter) return;
        updateLetter(archiveLetter.id, { status: "Archived" });
        toast.success(`Letter for ${archiveLetter.employeeName} archived`);
        setArchiveLetter(null);
    };

    const handleEmail = () => {
        if (!emailLetter) return;
        const trimmed = emailRecipient.trim();
        const err = firstError(
            required(trimmed, "Recipient email"),
            isEmail(trimmed, "Recipient email"),
            maxLength(trimmed, 254, "Recipient email"),
        );
        if (err) { toast.error(err); return; }
        toast.success(`Encrypted PDF dispatched to ${trimmed}`);
        setEmailLetter(null);
        setEmailRecipient("");
    };

    const confirmDelete = () => {
        if (!deleteLetterId) return;
        deleteLetter(deleteLetterId);
        toast.success("Letter deleted permanently");
        setDeleteLetterId(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans relative" style={{ zoom: "80%" }}>
            {/* Header section */}
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-start">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Official Letters</h1>
                        <p className="text-slate-500 font-semibold text-sm mt-1">Issue and track official employee communications and legal documents.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-wide border-none">
                                    <Plus className="w-4 h-4" /> Issue New Letter
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Issue Document</DialogTitle>
                                    <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-tight mt-2">
                                        Employee Communication Portal v1.4
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-6 py-8">
                                    <div className="space-y-3 text-start">
                                        <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Employee Name</label>
                                        <Input
                                            placeholder="e.g., Jane Smith"
                                            value={newLetter.employeeName}
                                            onChange={(e) => setNewLetter({ ...newLetter, employeeName: e.target.value })}
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-3 text-start">
                                        <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Employee Id</label>
                                        <Input
                                            placeholder="e.g., EMP102"
                                            value={newLetter.employeeId}
                                            onChange={(e) => setNewLetter({ ...newLetter, employeeId: e.target.value })}
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-3 text-start">
                                        <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Letter Type</label>
                                        <Select
                                            value={newLetter.letterType}
                                            onValueChange={(val) => setNewLetter({ ...newLetter, letterType: val })}
                                        >
                                            <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border border-slate-200 shadow-2xl p-2 font-bold text-xs font-sans">
                                                <SelectItem value="Offer Letter" className="rounded-xl h-10">Offer Letter</SelectItem>
                                                <SelectItem value="Appointment Letter" className="rounded-xl h-10">Appointment Letter</SelectItem>
                                                <SelectItem value="Experience Letter" className="rounded-xl h-10">Experience Letter</SelectItem>
                                                <SelectItem value="Relieving Letter" className="rounded-xl h-10">Relieving Letter</SelectItem>
                                                <SelectItem value="Promotion Letter" className="rounded-xl h-10">Promotion Letter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3 text-start">
                                        <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Select Template</label>
                                        <Select
                                            value={newLetter.templateId}
                                            onValueChange={(val) => setNewLetter({ ...newLetter, templateId: val })}
                                        >
                                            <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                                <SelectValue placeholder="Choose template" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border border-slate-200 shadow-2xl p-2 font-bold text-xs font-sans">
                                                {letterTemplates.length === 0 ? (
                                                    <div className="text-[10px] text-slate-400 px-3 py-2 italic">No templates available</div>
                                                ) : letterTemplates.map(t => (
                                                    <SelectItem key={t.id} value={t.id} className="rounded-xl h-10">{t.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2 p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex items-start gap-4 mt-2">
                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                            <PenTool size={20} className="text-indigo-600" />
                                        </div>
                                        <div className="text-start">
                                            <p className="text-[11px] font-black tracking-wide text-indigo-900 mb-1 leading-tight">E-Signature Enabled</p>
                                            <p className="text-[10px] font-bold text-indigo-600/70 leading-relaxed tracking-tight">Choosing "Issue" will automatically trigger an e-signature request to the employee's registered email.</p>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="gap-3">
                                    <Button variant="ghost" onClick={() => {
                                        const err = validateLetter(newLetter);
                                        if (err) { toast.error(err); return; }
                                        issueLetter({
                                            ...newLetter,
                                            employeeName: newLetter.employeeName.trim(),
                                            employeeId: newLetter.employeeId.trim(),
                                            issuedBy: newLetter.issuedBy.trim(),
                                            status: "Draft",
                                        });
                                        setIsIssueDialogOpen(false);
                                        setNewLetter({
                                            employeeId: "",
                                            employeeName: "",
                                            letterType: "Offer Letter",
                                            templateId: "TMP-001",
                                            issuedBy: "HR Admin",
                                            status: "Draft",
                                            fileUrl: "#"
                                        });
                                        toast.success("Draft saved successfully");
                                    }} className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6">Save Draft</Button>
                                    <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-indigo-100 transition-all text-[10px] tracking-wide border-none" onClick={handleIssueLetter}>Issue Document</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8 text-start">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Letters", value: stats.total, icon: FileText, color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200" },
                        { label: "Signed / Completed", value: stats.signed, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200" },
                        { label: "Pending Signature", value: stats.sent, icon: Clock, color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200" },
                        { label: "Draft Communications", value: stats.draft, icon: Stamp, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <Card className={`border ${stat.border} shadow-sm rounded-none ${stat.bg} overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between p-7`}>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wide">{stat.label}</p>
                                        <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                                    </div>
                                    <div className={`bg-white ${stat.color} h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform group-hover:scale-110`}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Table Section */}
                <Card className="border border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6 flex-1 max-w-md">
                                {selectedLetterIds.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-12 rounded-xl text-rose-600 font-bold border-rose-100 bg-rose-50/50"
                                        onClick={handleBulkDelete}
                                    >
                                        Delete ({selectedLetterIds.length})
                                    </Button>
                                )}
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by employee or letter type..."
                                        className="h-12 pl-12 bg-white border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px] h-12 bg-white border-slate-200 rounded-xl font-bold text-xs px-5">
                                        <div className="flex items-center gap-2">
                                            <Filter size={16} className="text-slate-400" />
                                            <span>Status</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-2 font-bold text-xs">
                                        <SelectItem value="all" className="rounded-lg h-10">All Status</SelectItem>
                                        <SelectItem value="Draft" className="rounded-lg h-10 text-slate-500">Draft</SelectItem>
                                        <SelectItem value="Sent" className="rounded-lg h-10 text-indigo-500">Sent</SelectItem>
                                        <SelectItem value="Signed" className="rounded-lg h-10 text-emerald-500">Signed</SelectItem>
                                        <SelectItem value="Archived" className="rounded-lg h-10 text-amber-500">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-[10px] tracking-wide px-6 hover:bg-slate-50 transition-all" onClick={() => {
                                    if (selectedLetterIds.length === 0) {
                                        toast.info("Please select letters to print");
                                        return;
                                    }
                                    window.print();
                                }}>
                                    <Printer size={16} className="mr-2" /> Bulk Print
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                                        <TableHead className="w-10 px-8 py-5">
                                            <input
                                                type="checkbox"
                                                className="rounded-lg border-slate-300 text-indigo-600 cursor-pointer w-4 h-4"
                                                checked={selectedLetterIds.length === filteredLetters.length && filteredLetters.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedLetterIds(filteredLetters.map(l => l.id));
                                                    else setSelectedLetterIds([]);
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead className="px-4 py-5 text-[10px] font-bold tracking-wide text-slate-400 w-[25%]">Employee</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Letter Type</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Issued Date</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Issued By</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Status</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400 text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {filteredLetters.map((letter) => (
                                            <TableRow
                                                key={letter.id}
                                                onClick={() => setPreviewLetter(letter)}
                                                className={`group hover:bg-indigo-50/20 transition-all border-b border-slate-50 last:border-0 cursor-pointer ${selectedLetterIds.includes(letter.id) ? 'bg-indigo-50/30' : ''}`}
                                            >
                                                <TableCell className="px-8 py-6 w-10" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        className="rounded-lg border-slate-300 text-indigo-600 cursor-pointer w-4 h-4"
                                                        checked={selectedLetterIds.includes(letter.id)}
                                                        onChange={() => toggleSelect(letter.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="px-4 py-6 text-start">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform shadow-inner border border-slate-100">
                                                            <User size={18} />
                                                        </div>
                                                        <div className="text-start">
                                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">{letter.employeeName}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 tracking-wide mt-0.5 opacity-60">ID: {letter.employeeId}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                                                        <span className="text-xs font-bold text-slate-700 tracking-tight">{letter.letterType}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6 text-xs font-bold text-slate-600">
                                                    {letter.issuedDate}
                                                </TableCell>
                                                <TableCell className="px-8 py-6 text-xs font-bold text-indigo-900/40">
                                                    {letter.issuedBy}
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    {getStatusBadge(letter.status)}
                                                </TableCell>
                                                <TableCell className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Button variant="ghost" size="icon" title="Preview" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => setPreviewLetter(letter)}>
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Download" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => {
                                                            const content = `${letter.letterType}\n\nEmployee: ${letter.employeeName}\nEmployee ID: ${letter.employeeId}\nIssued By: ${letter.issuedBy}\nIssued Date: ${letter.issuedDate}\nStatus: ${letter.status}\n\nThis is an official ${letter.letterType} issued to ${letter.employeeName}.`;
                                                            const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
                                                            const url = URL.createObjectURL(blob);
                                                            const link = document.createElement("a");
                                                            link.href = url;
                                                            link.download = `${letter.letterType.replace(/\s+/g, "_")}_${letter.employeeName.replace(/\s+/g, "_")}.txt`;
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                            URL.revokeObjectURL(url);
                                                            toast.success(`Downloaded letter for ${letter.employeeName}`);
                                                        }}>
                                                            <Download size={16} />
                                                        </Button>
                                                        {letter.status === 'Draft' && (
                                                            <Button variant="ghost" size="icon" title="Send" className="h-9 w-9 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-none" onClick={() => {
                                                                updateLetterStatus(letter.id, "Sent");
                                                                toast.success("Letter sent to employee successfully");
                                                            }}>
                                                                <Send size={16} />
                                                            </Button>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white hover:shadow-sm rounded-xl border-none">
                                                                    <MoreHorizontal size={16} className="text-slate-400" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border border-slate-200 shadow-2xl bg-white font-sans">
                                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wide">Document Management</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => setEditingLetter(letter)}>
                                                                    <PenTool className="w-4 h-4 text-indigo-500" /> Edit Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => setArchiveLetter(letter)} disabled={letter.status === 'Archived'}>
                                                                    <Stamp className="w-4 h-4 text-indigo-500" /> Archive Record
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => { setEmailLetter(letter); setEmailRecipient(""); }}>
                                                                    <Mail className="w-4 h-4 text-indigo-500" /> Email PDF Version
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50 text-start" onClick={() => setDeleteLetterId(letter.id)}>
                                                                    <Trash2 className="w-4 h-4" /> Delete Permanently
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                        {filteredLetters.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                                    <Mail size={32} className="text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">No letters issued yet</h3>
                                <p className="text-slate-400 font-bold text-xs mt-2 tracking-wide max-w-[280px] mx-auto">Generate official communications for your employees using our verified templates.</p>
                                <Button className="mt-8 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-8 font-black text-[10px] tracking-wide shadow-lg transition-all" onClick={() => setIsIssueDialogOpen(true)}>
                                    Issue First Letter
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>

            {/* Letter Preview Dialog */}
            <Dialog open={!!previewLetter} onOpenChange={(open) => !open && setPreviewLetter(null)}>
                <DialogContent className="max-w-2xl bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">{previewLetter?.letterType}</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-tight mt-2">
                            Document Preview
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-6 text-start">
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 tracking-wide">Employee</span>
                                <span className="text-sm font-bold text-slate-900">{previewLetter?.employeeName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 tracking-wide">Employee ID</span>
                                <span className="text-sm font-bold text-slate-900">{previewLetter?.employeeId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 tracking-wide">Issued By</span>
                                <span className="text-sm font-bold text-slate-900">{previewLetter?.issuedBy}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 tracking-wide">Issued Date</span>
                                <span className="text-sm font-bold text-slate-900">{previewLetter?.issuedDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 tracking-wide">Status</span>
                                {previewLetter && getStatusBadge(previewLetter.status)}
                            </div>
                            <div className="border-t border-slate-200 pt-4 mt-4">
                                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                                    This is an official <span className="font-bold">{previewLetter?.letterType}</span> issued to <span className="font-bold">{previewLetter?.employeeName}</span> ({previewLetter?.employeeId}) by {previewLetter?.issuedBy} on {previewLetter?.issuedDate}.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setPreviewLetter(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Letter Dialog */}
            <Dialog open={!!editingLetter} onOpenChange={(open) => !open && setEditingLetter(null)}>
                <DialogContent className="max-w-3xl bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Edit Letter Details</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-tight mt-2">
                            Update issued letter information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 py-6">
                        <div className="space-y-3 text-start">
                            <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Employee Name</label>
                            <Input
                                value={editingLetter?.employeeName || ""}
                                onChange={(e) => setEditingLetter(prev => prev ? { ...prev, employeeName: e.target.value } : null)}
                                className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-3 text-start">
                            <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Employee Id</label>
                            <Input
                                value={editingLetter?.employeeId || ""}
                                onChange={(e) => setEditingLetter(prev => prev ? { ...prev, employeeId: e.target.value } : null)}
                                className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-3 text-start">
                            <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Letter Type</label>
                            <Select
                                value={editingLetter?.letterType}
                                onValueChange={(val) => setEditingLetter(prev => prev ? { ...prev, letterType: val } : null)}
                            >
                                <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-slate-200 shadow-2xl p-2 font-bold text-xs font-sans">
                                    <SelectItem value="Offer Letter" className="rounded-xl h-10">Offer Letter</SelectItem>
                                    <SelectItem value="Appointment Letter" className="rounded-xl h-10">Appointment Letter</SelectItem>
                                    <SelectItem value="Experience Letter" className="rounded-xl h-10">Experience Letter</SelectItem>
                                    <SelectItem value="Relieving Letter" className="rounded-xl h-10">Relieving Letter</SelectItem>
                                    <SelectItem value="Promotion Letter" className="rounded-xl h-10">Promotion Letter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3 text-start">
                            <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Status</label>
                            <Select
                                value={editingLetter?.status}
                                onValueChange={(val: IssuedLetter['status']) => setEditingLetter(prev => prev ? { ...prev, status: val } : null)}
                            >
                                <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-slate-200 shadow-2xl p-2 font-bold text-xs font-sans">
                                    <SelectItem value="Draft" className="rounded-xl h-10">Draft</SelectItem>
                                    <SelectItem value="Sent" className="rounded-xl h-10">Sent</SelectItem>
                                    <SelectItem value="Signed" className="rounded-xl h-10">Signed</SelectItem>
                                    <SelectItem value="Archived" className="rounded-xl h-10">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3 text-start col-span-2">
                            <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Issued By</label>
                            <Input
                                value={editingLetter?.issuedBy || ""}
                                onChange={(e) => setEditingLetter(prev => prev ? { ...prev, issuedBy: e.target.value } : null)}
                                className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setEditingLetter(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6">Cancel</Button>
                        <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-indigo-100 transition-all text-[10px] tracking-wide border-none" onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Archive Confirm Dialog */}
            <Dialog open={!!archiveLetter} onOpenChange={(open) => !open && setArchiveLetter(null)}>
                <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="text-start">
                        <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 border border-amber-100">
                            <Stamp size={22} className="text-amber-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Archive Letter?</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                            This will move the letter for <span className="text-slate-700">{archiveLetter?.employeeName}</span> to historical archives. It will remain searchable but no longer active.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setArchiveLetter(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Cancel</Button>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={handleArchive}>Archive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Email PDF Dialog */}
            <Dialog open={!!emailLetter} onOpenChange={(open) => { if (!open) { setEmailLetter(null); setEmailRecipient(""); } }}>
                <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="text-start">
                        <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 border border-indigo-100">
                            <Mail size={22} className="text-indigo-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Email PDF Version</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                            Send {emailLetter?.letterType} for {emailLetter?.employeeName} as an encrypted PDF.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4 text-start">
                        <label className="text-[10px] font-black tracking-wide text-slate-400 ml-1">Recipient Email</label>
                        <Input
                            type="email"
                            placeholder="employee@email.com"
                            value={emailRecipient}
                            onChange={(e) => setEmailRecipient(e.target.value)}
                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => { setEmailLetter(null); setEmailRecipient(""); }} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Cancel</Button>
                        <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={handleEmail}>Send Email</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteLetterId} onOpenChange={(open) => !open && setDeleteLetterId(null)}>
                <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="text-start">
                        <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 border border-rose-100">
                            <Trash2 size={22} className="text-rose-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Delete Letter?</DialogTitle>
                        <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                            This action permanently removes the letter record. It cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setDeleteLetterId(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={confirmDelete}>Delete Permanently</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LettersPage;
