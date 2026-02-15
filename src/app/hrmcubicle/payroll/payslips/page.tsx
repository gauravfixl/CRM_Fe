"use client"

import React, { useState } from "react";
import {
    FileText,
    Download,
    Mail,
    Eye,
    Settings2,
    Layout,
    History,
    Search,
    Filter,
    CheckCircle2,
    MoreHorizontal,
    ChevronRight,
    Printer,
    Share2,
    Lock,
    Unlock,
    RotateCcw,
    ShieldCheck,
    ArrowUpRight,
    AlertCircle,
    Send,
    Activity,
    Trash2,
    Calendar,
    Users,
    Maximize2,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
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
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { usePayrollStore } from "@/shared/data/payroll-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const PayslipsPage = () => {
    const { payslips, updatePayslipStatus, deletePayslip, addPayslip } = usePayrollStore();
    const { toast } = useToast();
    const [isTemplateOpen, setIsTemplateOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
    const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("Jan 2026");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        employeeName: "",
        employeeId: "",
        month: "Jan 2026",
        netAmount: "0",
    });

    const templates = [
        { id: "T1", name: "Executive Minimal", primary: true, desc: "Ultra-clean A4 optimized layout" },
        { id: "T2", name: "Detailed Statutory", primary: false, desc: "Full breakdown of EPF/ESI/TDS" },
        { id: "T3", name: "Standard Compact", primary: false, desc: "Balanced mobile-first view" },
    ];

    const months = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"];

    const formatINR = (amt: number) => `₹${amt.toLocaleString("en-IN")}`;

    const filteredPayslips = payslips.filter(p =>
        (p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        p.month === selectedMonth
    );

    const handleSubmit = () => {
        if (!formData.employeeName || !formData.employeeId) {
            toast({ title: "Incomplete data", description: "All fields are required for generation.", variant: "destructive" });
            return;
        }
        addPayslip({
            ...formData,
            netAmount: parseFloat(formData.netAmount),
            status: 'Pending'
        });
        toast({ title: "Draft initiated", description: "Statement has been queued for generation." });
        setIsFormOpen(false);
    };

    const handleBulkGenerate = () => {
        setIsBulkProcessing(true);
        setTimeout(() => {
            selectedIds.forEach(id => updatePayslipStatus(id, 'Generated'));
            setSelectedIds([]);
            setIsBulkProcessing(false);
            toast({ title: "Bulk compilation complete", description: `${selectedIds.length} payslips have been generated.` });
        }, 2000);
    };

    const handleBulkDistribute = () => {
        setIsBulkProcessing(true);
        setTimeout(() => {
            selectedIds.forEach(id => updatePayslipStatus(id, 'Distributed'));
            setSelectedIds([]);
            setIsBulkProcessing(false);
            toast({ title: "Bulk distribution complete", description: `${selectedIds.length} payslips have been sent to employees.` });
        }, 2000);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === filteredPayslips.length ? [] : filteredPayslips.map(d => d.id));
    };

    const handleFinalizeCycle = () => {
        toast({ title: "Cycle finalized", description: `${selectedMonth} payroll has been locked for processing.` });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans" style={{ zoom: 0.8 }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#F0C1E1]/10 rounded-xl flex items-center justify-center text-[#EC4899]">
                        <FileText size={20} />
                    </div>
                    <div className="text-start">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Statement center</h1>
                        <p className="text-xs font-medium text-slate-500 italic">Payslip generation & distribution hub</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="h-10 w-40 rounded-lg border-slate-200 font-semibold text-xs">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl bg-white font-sans z-[200]">
                            {months.map(m => (
                                <SelectItem key={m} value={m} className="text-xs font-semibold">{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setIsTemplateOpen(true)} className="h-10 border-slate-200 rounded-lg font-semibold text-xs gap-2 px-4 hover:text-[#8B5CF6] transition-all border-none bg-slate-50/50">
                        <Layout size={14} /> Design system
                    </Button>
                    <Button onClick={handleFinalizeCycle} className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-10 px-4 font-semibold text-xs gap-2 shadow-sm border-none transition-all">
                        <Lock size={14} /> Finalize cycle
                    </Button>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-[#EC4899] hover:bg-[#db2777] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#EC4899]/20 border-none transition-all hover:scale-[1.02]">
                        <Send size={14} className="mr-2" /> Initialize statement
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-8">
                    {/* Management Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Ready", val: payslips.filter(p => p.status === 'Generated' && p.month === selectedMonth).length, metric: "Generated", icon: FileText, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", border: "border-[#8B5CF6]/20" },
                            { label: "Transit", val: payslips.filter(p => p.status === 'Distributed' && p.month === selectedMonth).length, metric: "Dispatched", icon: Share2, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                            { label: "Queue", val: payslips.filter(p => p.status === 'Pending' && p.month === selectedMonth).length, metric: "Staged", icon: RotateCcw, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                            { label: "Uptime", val: "99.9%", metric: "Reliability", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" }
                        ].map((m, i) => (
                            <Card key={i} className={`rounded-2xl border ${m.border} ${m.bg} shadow-sm overflow-hidden text-start transition-all hover:shadow-md`}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1 text-start">
                                            <p className="text-[11px] font-semibold text-slate-500">{m.label}</p>
                                            <p className="text-3xl font-bold text-slate-900 tracking-tight">{m.val}</p>
                                            <p className="text-[10px] font-medium text-slate-400 italic">{m.metric} statements</p>
                                        </div>
                                        <div className={`h-12 w-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm ${m.color}`}>
                                            <m.icon size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50 text-start">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-start">
                                <div className="text-start">
                                    <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">Distribution ledger</CardTitle>
                                    <CardDescription className="text-xs font-semibold text-slate-400 mt-1 italic">Trace statement lifecycle status</CardDescription>
                                </div>
                                <div className="flex gap-2 text-start font-sans">
                                    <div className="relative w-64 font-sans">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Audit ID or Employee name..."
                                            className="pl-9 h-10 bg-slate-50 border-none rounded-xl text-xs font-medium"
                                        />
                                    </div>
                                    <Button variant="outline" className="h-10 rounded-xl border-slate-100 text-slate-500 font-semibold text-[10px] gap-2">
                                        <Filter size={14} /> Refine
                                    </Button>
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
                                        className="bg-slate-50 border-b border-slate-100 px-8 py-3 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4 text-start">
                                            <span className="text-xs font-bold text-slate-500 leading-none">{selectedIds.length} statements selected for batch processing</span>
                                            <div className="h-4 w-px bg-slate-200" />
                                            <Button onClick={handleBulkGenerate} disabled={isBulkProcessing} className="h-8 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white text-[10px] font-bold px-4 rounded-lg shadow-sm border-none transition-all active:scale-95">
                                                {isBulkProcessing ? <Activity size={12} className="animate-spin mr-2" /> : <RotateCcw size={12} className="mr-2" />} Bulk generate
                                            </Button>
                                            <Button onClick={handleBulkDistribute} disabled={isBulkProcessing} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-4 rounded-lg shadow-sm border-none transition-all active:scale-95">
                                                {isBulkProcessing ? <Activity size={12} className="animate-spin mr-2" /> : <Send size={12} className="mr-2" />} Bulk distribute
                                            </Button>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-slate-400 hover:text-rose-500 font-bold text-[10px] transition-colors">Clear selection</Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Table>
                                <TableHeader className="bg-slate-50/50 font-sans">
                                    <TableRow className="border-slate-100 h-14 font-sans">
                                        <TableHead className="pl-8 w-12 text-start">
                                            <Checkbox
                                                checked={selectedIds.length > 0 && selectedIds.length === filteredPayslips.length}
                                                onCheckedChange={toggleSelectAll}
                                                className="border-slate-300 data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
                                            />
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400 text-start font-sans">Recipient</TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400 text-start font-sans">Cycle</TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400 text-start font-sans">Net disbursement</TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400 text-start font-sans">Trace status</TableHead>
                                        <TableHead className="text-[11px] font-bold text-slate-400 text-start font-sans">Staged date</TableHead>
                                        <TableHead className="text-right pr-8 text-[11px] font-bold text-slate-400 font-sans">Protocol</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {filteredPayslips.map((ps) => (
                                            <motion.tr
                                                key={ps.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`group hover:bg-slate-50/50 border-slate-50 border-b last:border-0 ${selectedIds.includes(ps.id) ? 'bg-[#EC4899]/5' : ''}`}
                                            >
                                                <TableCell className="pl-8 py-3">
                                                    <Checkbox
                                                        checked={selectedIds.includes(ps.id)}
                                                        onCheckedChange={() => toggleSelect(ps.id)}
                                                        className="border-slate-300 data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-4 font-sans">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-[10px] text-slate-500 tracking-tight group-hover:bg-[#EC4899]/10 group-hover:text-[#EC4899] transition-colors">{ps.employeeId.slice(-3)}</div>
                                                        <div className="text-start">
                                                            <span className="text-sm font-bold text-slate-900 block leading-tight">{ps.employeeName}</span>
                                                            <span className="text-[9px] font-semibold text-slate-400 leading-none italic">{ps.employeeId}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-bold text-slate-600 tracking-tight font-sans">{ps.month}</TableCell>
                                                <TableCell className="text-sm font-bold text-slate-900 tracking-tight font-sans">{formatINR(ps.netAmount)}</TableCell>
                                                <TableCell className="font-sans">
                                                    <Badge className={`bg-white border-none text-[9px] font-bold shadow-sm h-6 px-3 tracking-wider ${ps.status === 'Distributed' ? 'text-emerald-500' : ps.status === 'Generated' ? 'text-[#8B5CF6]' : 'text-amber-500'
                                                        }`}>{ps.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-[10px] font-semibold text-slate-400 italic font-sans">{ps.generatedDate || "Queued"}</TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-9 w-9 p-0 rounded-xl text-slate-300 hover:text-[#EC4899] hover:bg-slate-100"
                                                            onClick={() => { setSelectedPayslip(ps); setIsPdfPreviewOpen(true); }}
                                                        >
                                                            <Eye size={14} />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl text-slate-300 hover:bg-slate-100">
                                                                    <MoreHorizontal size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 border-none shadow-2xl ring-1 ring-slate-100 bg-white font-sans text-start">
                                                                <DropdownMenuLabel className="text-[9px] font-bold text-slate-400 px-3 py-2 italic tracking-wide">Protocol actions</DropdownMenuLabel>
                                                                {ps.status === 'Pending' && (
                                                                    <DropdownMenuItem onClick={() => { updatePayslipStatus(ps.id, 'Generated'); toast({ title: "Statement compiled" }); }} className="rounded-xl flex items-center gap-3 px-3 py-2.5 font-bold text-[11px] text-slate-700">
                                                                        <RotateCcw size={14} className="text-[#8B5CF6]" /> Compile hash
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {ps.status === 'Generated' && (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => { setSelectedPayslip(ps); setIsEmailPreviewOpen(true); }} className="rounded-xl flex items-center gap-3 px-3 py-2.5 font-bold text-[11px] text-emerald-600">
                                                                            <Mail size={14} /> Preview email
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => { updatePayslipStatus(ps.id, 'Distributed'); toast({ title: "Dispatched to employee" }); }} className="rounded-xl flex items-center gap-3 px-3 py-2.5 font-bold text-[11px] text-emerald-600">
                                                                            <Send size={14} /> Dispatch statement
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                                <DropdownMenuItem onClick={() => { setSelectedPayslip(ps); setIsPdfPreviewOpen(true); }} className="rounded-xl flex items-center gap-3 px-3 py-2.5 font-bold text-[11px] text-slate-700">
                                                                    <Download size={14} /> Download PDF
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                                <DropdownMenuItem onClick={() => { deletePayslip(ps.id); toast({ title: "Record deleted" }); }} className="rounded-xl flex items-center gap-3 px-3 py-2.5 font-bold text-[11px] text-rose-500">
                                                                    <Trash2 size={14} /> Delete record
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

            {/* PDF Preview Dialog */}
            <Dialog open={isPdfPreviewOpen} onOpenChange={setIsPdfPreviewOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-0 max-w-4xl font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] overflow-hidden">
                    <div className="flex flex-col h-[80vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Payslip preview</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">{selectedPayslip?.employeeName} • {selectedPayslip?.month}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="h-9 px-4 rounded-lg font-semibold text-xs gap-2 border-slate-200">
                                    <Download size={14} /> Download
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setIsPdfPreviewOpen(false)} className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100">
                                    <X size={16} />
                                </Button>
                            </div>
                        </div>
                        <ScrollArea className="flex-1 p-8 bg-slate-50">
                            {/* Mockup Payslip */}
                            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 border border-slate-100">
                                <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Payslip</h2>
                                        <p className="text-sm font-medium text-slate-500 mt-1">{selectedPayslip?.month}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-slate-400">Employee ID</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedPayslip?.employeeId}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-slate-400 mb-2">Employee name</p>
                                    <p className="text-base font-bold text-slate-900">{selectedPayslip?.employeeName}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between py-3 border-b border-slate-50">
                                        <span className="text-sm font-semibold text-slate-600">Basic salary</span>
                                        <span className="text-sm font-bold text-slate-900">{formatINR(selectedPayslip?.netAmount * 0.5 || 0)}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-slate-50">
                                        <span className="text-sm font-semibold text-slate-600">HRA</span>
                                        <span className="text-sm font-bold text-slate-900">{formatINR(selectedPayslip?.netAmount * 0.2 || 0)}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-slate-50">
                                        <span className="text-sm font-semibold text-slate-600">Allowances</span>
                                        <span className="text-sm font-bold text-slate-900">{formatINR(selectedPayslip?.netAmount * 0.15 || 0)}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-slate-50">
                                        <span className="text-sm font-semibold text-slate-600">Gross salary</span>
                                        <span className="text-sm font-bold text-slate-900">{formatINR(selectedPayslip?.netAmount * 0.85 || 0)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 bg-rose-50 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-rose-600 mb-3">Deductions</p>
                                    <div className="flex justify-between py-2">
                                        <span className="text-sm font-semibold text-slate-600">PF contribution</span>
                                        <span className="text-sm font-bold text-rose-600">- {formatINR(selectedPayslip?.netAmount * 0.12 || 0)}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-sm font-semibold text-slate-600">TDS</span>
                                        <span className="text-sm font-bold text-rose-600">- {formatINR(selectedPayslip?.netAmount * 0.03 || 0)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-6 bg-emerald-50 rounded-2xl">
                                    <span className="text-base font-bold text-slate-900">Net payable</span>
                                    <span className="text-2xl font-bold text-emerald-600">{formatINR(selectedPayslip?.netAmount || 0)}</span>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Email Preview Dialog */}
            <Dialog open={isEmailPreviewOpen} onOpenChange={setIsEmailPreviewOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-2xl font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <DialogHeader className="text-start space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <Mail size={16} className="text-emerald-600" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-slate-900">Email preview</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs font-medium text-slate-500">Review email before sending to {selectedPayslip?.employeeName}</DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-semibold text-slate-400 mb-1">To:</p>
                            <p className="text-sm font-bold text-slate-900">{selectedPayslip?.employeeName} ({selectedPayslip?.employeeId}@company.com)</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-semibold text-slate-400 mb-1">Subject:</p>
                            <p className="text-sm font-bold text-slate-900">Your Payslip for {selectedPayslip?.month}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                Dear {selectedPayslip?.employeeName},<br /><br />
                                Please find attached your payslip for {selectedPayslip?.month}. Your net salary of <span className="font-bold text-emerald-600">{formatINR(selectedPayslip?.netAmount || 0)}</span> has been credited to your registered bank account.<br /><br />
                                If you have any queries, please contact the HR department.<br /><br />
                                Best regards,<br />
                                <span className="font-bold">HR Team</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <FileText size={16} className="text-blue-600" />
                            <span className="text-xs font-bold text-blue-900">Payslip_{selectedPayslip?.employeeId}_{selectedPayslip?.month}.pdf</span>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex gap-3">
                        <Button variant="ghost" onClick={() => setIsEmailPreviewOpen(false)} className="flex-1 h-11 rounded-xl font-bold text-slate-400">Cancel</Button>
                        <Button
                            onClick={() => {
                                updatePayslipStatus(selectedPayslip.id, 'Distributed');
                                setIsEmailPreviewOpen(false);
                                toast({ title: "Email sent", description: "Payslip has been sent to employee." });
                            }}
                            className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 font-bold shadow-lg shadow-emerald-100 border-none transition-all"
                        >
                            <Send size={14} className="mr-2" /> Send email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Design System Sheet */}
            <Sheet open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                <SheetContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden font-sans">
                    <div className="h-full flex flex-col bg-white overflow-hidden text-start font-sans">
                        <div className="bg-slate-900 p-10 text-white border-b border-slate-800 flex flex-col items-start text-start relative overflow-hidden">
                            <Badge className="bg-[#8B5CF6] text-white border-none font-bold text-[10px] px-3 mb-4 leading-none h-6 shadow-lg shadow-[#8B5CF6]/20">UI system</Badge>
                            <SheetTitle className="text-2xl font-bold text-white tracking-tighter leading-none mt-2 mb-0">Template matrix</SheetTitle>
                            <SheetDescription className="text-slate-400 font-medium text-[11px] mt-2 leading-none italic">Select base visualization for statements</SheetDescription>
                            <Layout size={100} className="absolute -right-8 -bottom-8 opacity-10" />
                        </div>
                        <ScrollArea className="flex-1 p-8 text-start font-sans">
                            <div className="space-y-6 text-start">
                                {templates.map((t) => (
                                    <div key={t.id} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group text-start ${t.primary ? 'border-[#8B5CF6] bg-[#8B5CF6]/5' : 'border-slate-100 border-dashed hover:border-slate-200'}`}>
                                        <div className="flex justify-between items-start mb-3 text-start">
                                            <div className="text-start">
                                                <h4 className="text-sm font-bold text-slate-900 leading-none">{t.name}</h4>
                                                <p className="text-[10px] font-semibold text-slate-400 mt-2 block leading-none italic">{t.desc}</p>
                                            </div>
                                            {t.primary && <CheckCircle2 size={16} className="text-[#8B5CF6]" />}
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 text-start">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="h-1 bg-slate-200 rounded-full group-hover:bg-[#8B5CF6]/20 transition-colors" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-8 border-t border-slate-50 bg-slate-50/50 text-start">
                            <Button className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold text-[10px] tracking-wider shadow-xl shadow-slate-200 border-none transition-all hover:bg-[#8B5CF6]">Sync design across terminal</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Initialization Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl overflow-hidden relative fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#EC4899]/10 rounded-full -translate-y-16 -translate-x-16 blur-3xl" />
                    <DialogHeader className="text-start space-y-2 relative z-10 font-sans">
                        <Badge className="bg-[#EC4899] text-white border-none font-bold text-[10px] px-3 py-1 w-fit shadow-md">Statement node</Badge>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Initialize ledger statement</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-400 leading-none mt-2">Map individual records for statutory generation</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-8 relative z-10 font-sans">
                        <div className="space-y-2 text-start">
                            <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none mb-1">Recipient name</Label>
                            <Input
                                placeholder="Formal identity..."
                                value={formData.employeeName}
                                onChange={e => setFormData({ ...formData, employeeName: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12 font-medium text-sm px-4"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-start font-sans">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none mb-1">Registry ID</Label>
                                <Input
                                    placeholder="EMPXXX"
                                    value={formData.employeeId}
                                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-bold text-sm px-4"
                                />
                            </div>
                            <div className="space-y-2 text-start font-sans">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none mb-1">Disbursement quantum</Label>
                                <Input
                                    type="number"
                                    value={formData.netAmount}
                                    onChange={e => setFormData({ ...formData, netAmount: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-bold text-base px-4 tabular-nums"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="relative z-10 sm:justify-start font-sans">
                        <Button
                            className="w-full bg-[#EC4899] hover:bg-[#db2777] text-white rounded-2xl h-14 font-bold text-sm shadow-2xl shadow-[#EC4899]/20 transition-all border-none"
                            onClick={handleSubmit}
                        >
                            Stage statement for audit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PayslipsPage;
