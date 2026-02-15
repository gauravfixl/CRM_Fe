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

const LettersPage = () => {
    const { issuedLetters, issueLetter, updateLetterStatus, deleteLetter } = useDocumentsStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
    const [selectedLetterIds, setSelectedLetterIds] = useState<string[]>([]);

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

    const handleIssueLetter = () => {
        if (!newLetter.employeeName || !newLetter.employeeId) {
            toast.error("Please provide employee details");
            return;
        }
        issueLetter(newLetter);
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
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
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
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs font-sans">
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
                                        <Select defaultValue="standard">
                                            <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                                <SelectValue placeholder="Standard Template" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs font-sans">
                                                <SelectItem value="standard" className="rounded-xl h-10">Standard Business Template</SelectItem>
                                                <SelectItem value="executive" className="rounded-xl h-10">Executive Level Template</SelectItem>
                                                <SelectItem value="intern" className="rounded-xl h-10">Internship Template</SelectItem>
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
                                    <Button variant="ghost" onClick={() => setIsIssueDialogOpen(false)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6">Save Draft</Button>
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
                            <Card className={`border ${stat.border} shadow-sm rounded-[2rem] ${stat.bg} overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between p-7`}>
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
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-xs">
                                        <SelectItem value="all" className="rounded-lg h-10">All Status</SelectItem>
                                        <SelectItem value="Draft" className="rounded-lg h-10 text-slate-500">Draft</SelectItem>
                                        <SelectItem value="Sent" className="rounded-lg h-10 text-indigo-500">Sent</SelectItem>
                                        <SelectItem value="Signed" className="rounded-lg h-10 text-emerald-500">Signed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-[10px] tracking-wide px-6 hover:bg-slate-50 transition-all" onClick={() => toast.success("Preparing PDF manifest for bulk print")}>
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
                                                className={`group hover:bg-indigo-50/20 transition-all border-b border-slate-50 last:border-0 ${selectedLetterIds.includes(letter.id) ? 'bg-indigo-50/30' : ''}`}
                                            >
                                                <TableCell className="px-8 py-6 w-10">
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
                                                <TableCell className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Button variant="ghost" size="icon" title="Preview" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => toast.success(`Viewing preview for ${letter.employeeName}`)}>
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Download" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => toast.success("Downloading document to local vault")}>
                                                            <Download size={16} />
                                                        </Button>
                                                        {letter.status === 'Draft' && (
                                                            <Button variant="ghost" size="icon" title="Send" className="h-9 w-9 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-none" onClick={() => toast.success("Relaying document to employee inbox")}>
                                                                <Send size={16} />
                                                            </Button>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white hover:shadow-sm rounded-xl border-none">
                                                                    <MoreHorizontal size={16} className="text-slate-400" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl bg-white font-sans">
                                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wide">Document Management</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => toast.success("Record moved to historical archives")}>
                                                                    <Stamp className="w-4 h-4 text-indigo-500" /> Archive Record
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => toast.success("Encrypted PDF dispatched via mail gateway")}>
                                                                    <Mail className="w-4 h-4 text-indigo-500" /> Email PDF Version
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50 text-start" onClick={() => deleteLetter(letter.id)}>
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
        </div>
    );
};

export default LettersPage;
