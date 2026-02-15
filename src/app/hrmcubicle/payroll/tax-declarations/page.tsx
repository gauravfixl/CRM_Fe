"use client"

import React, { useState } from "react";
import {
    ShieldCheck,
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
    PieChart,
    AlertTriangle,
    Scale,
    History,
    MoreHorizontal,
    Eye,
    X,
    TrendingUp,
    Bookmark,
    Activity,
    Lock,
    Download,
    Bell,
    Trash2,
    Check,
    Calendar,
    ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
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
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { usePayrollStore } from "@/shared/data/payroll-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const TaxDeclarationsPage = () => {
    const { declarations, updateDeclarationStatus, addDeclaration, updateDeclaration, deleteDeclaration } = usePayrollStore();
    const { toast } = useToast();
    const [selectedDec, setSelectedDec] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDec, setEditingDec] = useState<any>(null);

    const [formData, setFormData] = useState({
        employeeName: "",
        employeeId: "",
        fiscalYear: "2025-26",
        regime: "New",
        totalSavings: "0",
        estimatedTax: "0",
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredDeclarations = declarations.filter(dec => {
        const matchesSearch = dec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dec.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || dec.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const metrics = [
        { label: "Submitted", val: `${declarations.length}/${declarations.length + 7}`, icon: Bookmark, color: "text-[#CB9DF0]", bg: "bg-[#CB9DF0]/20" },
        { label: "Verified", val: declarations.filter(d => d.status === 'Verified').length, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-100/60" },
        { label: "Risk Flags", val: "04", icon: AlertTriangle, color: "text-[#FDDBBB]", bg: "bg-[#FDDBBB]/30" },
        { label: "Tax Liability", val: "₹18.4L", icon: Scale, color: "text-[#F0C1E1]", bg: "bg-[#F0C1E1]/20" }
    ];

    const regimes = [
        { name: "New Regime", count: declarations.filter(d => d.regime === 'New').length, pct: `${Math.round((declarations.filter(d => d.regime === 'New').length / Math.max(1, declarations.length)) * 100)}%`, color: "bg-[#CB9DF0]" },
        { name: "Old Regime", count: declarations.filter(d => d.regime === 'Old').length, pct: `${Math.round((declarations.filter(d => d.regime === 'Old').length / Math.max(1, declarations.length)) * 100)}%`, color: "bg-[#F0C1E1]" },
    ];

    const formatINR = (amt: number) => `₹${amt.toLocaleString("en-IN")}`;

    const handleOpenForm = (dec?: any) => {
        if (dec) {
            setEditingDec(dec);
            setFormData({
                employeeName: dec.employeeName,
                employeeId: dec.employeeId,
                fiscalYear: dec.fiscalYear,
                regime: dec.regime,
                totalSavings: dec.totalSavings.toString(),
                estimatedTax: dec.estimatedTax.toString(),
            });
        } else {
            setEditingDec(null);
            setFormData({
                employeeName: "",
                employeeId: "",
                fiscalYear: "2025-26",
                regime: "New",
                totalSavings: "0",
                estimatedTax: "0",
            });
        }
        setIsFormOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.employeeName || !formData.employeeId) {
            toast({ title: "Incomplete Protocol", description: "Identity markers are required for compliance.", variant: "destructive" });
            return;
        }

        const payload = {
            ...formData,
            regime: formData.regime as 'Old' | 'New',
            totalSavings: parseFloat(formData.totalSavings),
            estimatedTax: parseFloat(formData.estimatedTax),
            status: editingDec ? editingDec.status : 'Pending' as any,
            declarations: editingDec ? editingDec.declarations : [],
            submittedDate: new Date().toISOString().split('T')[0],
        };

        if (editingDec) {
            updateDeclaration(editingDec.id, payload);
            toast({ title: "Compliance Updated", description: "Ledger has been updated with new declaration parameters." });
        } else {
            addDeclaration(payload);
            toast({ title: "Declaration Injected", description: "Manual compliance entry has been localized." });
        }
        setIsFormOpen(false);
    };

    const handleDelete = (id: string) => {
        deleteDeclaration(id);
        toast({ title: "Record Purged", description: "Compliance data has been removed from the repository." });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === filteredDeclarations.length ? [] : filteredDeclarations.map(d => d.id));
    };

    const handleBulkVerify = () => {
        setIsBulkProcessing(true);
        setTimeout(() => {
            selectedIds.forEach(id => updateDeclarationStatus(id, 'Verified'));
            setSelectedIds([]);
            setIsBulkProcessing(false);
            toast({ title: "Bulk Authorization Complete", description: `${selectedIds.length} declarations have been verified.` });
        }, 1500);
    };

    const handleExportReport = () => {
        toast({ title: "Generating Audit Report", description: "Your tax ledger is being compiled into Excel format." });
    };

    const handleSendReminders = () => {
        toast({ title: "Reminders Dispatched", description: "Notifications sent to employees with pending submissions." });
    };

    const handleViewProofs = (name: string) => {
        toast({ title: "Opening Artifacts", description: `Loading verification documents for ${name}...` });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-hidden">
            <div className="flex flex-col h-full overflow-auto" style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "117.65%", height: "117.65%" }}>
                {/* Header */}
                <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-[#FDDBBB]/20 rounded-xl flex items-center justify-center text-[#e6b48a]">
                            <Scale size={20} />
                        </div>
                        <div className="text-start">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight text-start">Tax Compliance Hub</h1>
                            <p className="text-sm font-semibold text-slate-500 capitalize tracking-wider text-start italic">FY 2025-26 • Operational View</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleSendReminders} className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 border-none transition-all hover:text-[#CB9DF0]">
                            <Bell size={14} /> Remind All
                        </Button>
                        <Button variant="outline" onClick={handleExportReport} className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 border-none transition-all hover:text-emerald-500">
                            <Download size={14} /> Export Report
                        </Button>
                        <Button onClick={() => handleOpenForm()} className="bg-[#CB9DF0] hover:bg-[#b088e0] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-sm border-none transition-all hover:scale-[1.02]">
                            Record Declaration <ChevronRight size={14} className="ml-1" />
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-8 space-y-6">
                        {/* Performance Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {metrics.map((m, i) => (
                                <Card key={i} className={`rounded-xl border ${m.color.replace('text-', 'border-')}/20 ${m.bg} shadow-sm overflow-hidden text-start transition-all hover:shadow-md`}>
                                    <CardContent className="p-3 space-y-1">
                                        <div className="flex justify-end">
                                            <div className="h-7 w-7 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-white">
                                                <m.icon size={14} className={m.color} />
                                            </div>
                                        </div>
                                        <div className="space-y-0 text-start">
                                            <p className="text-[10px] font-bold text-slate-500 capitalize tracking-widest leading-none mb-1">{m.label}</p>
                                            <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{m.val}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Declaration Grid */}
                            <div className="lg:col-span-8 space-y-6">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-6 border-b border-slate-50 text-start">
                                        <div className="flex justify-between items-center text-start">
                                            <div className="text-start">
                                                <CardTitle className="text-lg font-bold text-slate-800 tracking-tight text-start">Declaration Ledger</CardTitle>
                                                <CardDescription className="text-sm font-bold text-slate-400 capitalize tracking-widest mt-1 text-start italic">Historical audit trace</CardDescription>
                                            </div>
                                            <div className="flex gap-2 font-sans text-start">
                                                <div className="relative w-48 font-sans text-start">
                                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        placeholder="Search Employee..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="pl-9 h-9 bg-slate-50 border-none rounded-lg text-xs font-semibold focus:ring-1 focus:ring-[#CB9DF0]"
                                                    />
                                                </div>
                                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                    <SelectTrigger className="h-9 w-32 rounded-lg border-slate-100 text-slate-500 font-bold text-[10px] capitalize bg-white shadow-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Filter size={12} />
                                                            <SelectValue placeholder="All Status" />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-none shadow-2xl bg-white font-sans">
                                                        <SelectItem value="All" className="text-[10px] font-bold">ALL NODES</SelectItem>
                                                        <SelectItem value="Verified" className="text-[10px] font-bold text-emerald-600">VERIFIED</SelectItem>
                                                        <SelectItem value="Pending" className="text-[10px] font-bold text-amber-600">PENDING</SelectItem>
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
                                                    className="bg-slate-50 border-b border-slate-100 px-8 py-3 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-4 text-start">
                                                        <span className="text-xs font-bold text-slate-500 capitalize tracking-wide leading-none">{selectedIds.length} Nodes Selected for Bulk Processing</span>
                                                        <div className="h-4 w-px bg-slate-200" />
                                                        <Button onClick={handleBulkVerify} disabled={isBulkProcessing} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold capitalize px-4 rounded-lg shadow-sm border-none transition-all active:scale-95">
                                                            {isBulkProcessing ? <Activity size={12} className="animate-spin mr-2" /> : <CheckCircle2 size={12} className="mr-2" />} Authorize Selected
                                                        </Button>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-slate-400 hover:text-rose-500 font-bold text-[10px] capitalize transition-colors">Discard Selection</Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <Table>
                                            <TableHeader className="bg-slate-50/50">
                                                <TableRow className="border-slate-100 h-12">
                                                    <TableHead className="pl-8 w-12 text-start">
                                                        <Checkbox
                                                            checked={selectedIds.length > 0 && selectedIds.length === filteredDeclarations.length}
                                                            onCheckedChange={toggleSelectAll}
                                                            className="border-slate-300 data-[state=checked]:bg-[#CB9DF0] data-[state=checked]:border-[#CB9DF0]"
                                                        />
                                                    </TableHead>
                                                    <TableHead className="text-[11px] font-black capitalize text-slate-400 tracking-widest text-start">Employee</TableHead>
                                                    <TableHead className="text-[11px] font-black capitalize text-slate-400 tracking-widest text-start">Regime</TableHead>
                                                    <TableHead className="text-[11px] font-black capitalize text-slate-400 tracking-widest text-start">Savings</TableHead>
                                                    <TableHead className="text-[11px] font-black capitalize text-slate-400 tracking-widest text-start">TDS/Mo</TableHead>
                                                    <TableHead className="text-[11px] font-black capitalize text-slate-400 tracking-widest text-start">Status</TableHead>
                                                    <TableHead className="text-right pr-8 text-[11px] font-black capitalize text-slate-400 tracking-widest">Protocol</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <AnimatePresence mode="popLayout">
                                                    {filteredDeclarations.map((dec) => (
                                                        <motion.tr
                                                            key={dec.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className={`group hover:bg-slate-50/50 border-slate-50 border-b last:border-0 transition-colors ${selectedIds.includes(dec.id) ? 'bg-[#CB9DF0]/5' : ''}`}
                                                        >
                                                            <TableCell className="pl-8 py-3 text-start">
                                                                <Checkbox
                                                                    checked={selectedIds.includes(dec.id)}
                                                                    onCheckedChange={() => toggleSelect(dec.id)}
                                                                    className="border-slate-300 data-[state=checked]:bg-[#CB9DF0] data-[state=checked]:border-[#CB9DF0]"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="py-3 text-start">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 capitalize tracking-tighter group-hover:bg-white transition-colors">{dec.employeeId.slice(-3)}</div>
                                                                    <span className="text-sm font-bold text-slate-900 block leading-tight text-start">{dec.employeeName}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={`border-none text-[9px] font-black px-2 capitalize tracking-widest ${dec.regime === 'New' ? 'text-[#CB9DF0]' : 'text-[#F0C1E1]'
                                                                    }`}>{dec.regime}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-sm font-black text-slate-700 tracking-tight text-start">{formatINR(dec.totalSavings)}</TableCell>
                                                            <TableCell className="text-sm font-black text-rose-500 tracking-tight text-start">{formatINR(dec.estimatedTax)}</TableCell>
                                                            <TableCell>
                                                                <Badge className={`bg-white border-none text-[9px] font-black shadow-sm h-5 px-3 capitalize tracking-widest ${dec.status === 'Verified' ? 'text-emerald-500' : 'text-amber-500'
                                                                    }`}>{dec.status}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right pr-8">
                                                                <div className="flex justify-end gap-2 text-start">
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-[#CB9DF0] hover:bg-slate-100" onClick={() => { setSelectedDec(dec); setIsSheetOpen(true); }}>
                                                                        <Eye size={14} />
                                                                    </Button>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:bg-slate-100">
                                                                                <MoreHorizontal size={14} />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-[180px] rounded-xl p-2 border-none shadow-2xl ring-1 ring-slate-100 bg-white font-sans text-start">
                                                                            <DropdownMenuItem onClick={() => { updateDeclarationStatus(dec.id, 'Verified'); toast({ title: "Verified!" }); }} className="rounded-lg flex items-center gap-3 px-3 py-1.5 font-bold text-[11px] text-emerald-600">
                                                                                <CheckCircle2 size={14} /> Verify Data
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator className="bg-slate-50" />
                                                                            <DropdownMenuItem onClick={() => handleOpenForm(dec)} className="rounded-lg flex items-center gap-3 px-3 py-1.5 font-bold text-[11px] text-slate-600">
                                                                                <FileText size={14} /> Refine Entry
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleDelete(dec.id)} className="rounded-lg flex items-center gap-3 px-3 py-1.5 font-bold text-[11px] text-rose-400">
                                                                                <Trash2 size={14} /> Expunge Record
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                                {filteredDeclarations.length === 0 && (
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableCell colSpan={7} className="h-40 text-center">
                                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                                <Search size={40} className="mb-4 opacity-10" />
                                                                <p className="text-sm font-bold capitalize tracking-widest italic leading-none">No matching compliance nodes found</p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Fiscal Insights Sidebar */}
                            <div className="lg:col-span-4 space-y-6 text-start">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col items-start text-start">
                                    <CardHeader className="p-4 pb-1 text-start">
                                        <h4 className="text-[12px] font-black text-slate-400 capitalize tracking-widest text-start leading-none mb-0">Regime Distribution</h4>
                                    </CardHeader>
                                    <CardContent className="p-4 w-full text-start">
                                        <div className="space-y-3 text-start">
                                            {regimes.map((r, i) => (
                                                <div key={i} className="space-y-1.5 text-start">
                                                    <div className="flex justify-between items-end text-start">
                                                        <span className="text-xs font-bold text-slate-700 text-start">{r.name}</span>
                                                        <span className="text-xs font-black text-slate-900">{r.count} <span className="text-[8px] text-slate-400 ml-1">({r.pct})</span></span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                                        <div className={`h-full ${r.color} opacity-80`} style={{ width: r.pct }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-4 border-t border-slate-50 text-start">
                                            <div className="p-3 rounded-xl bg-[#FFF9BF]/20 border border-[#FFF9BF]/50 flex items-start gap-3 text-start">
                                                <AlertTriangle size={14} className="text-[#e6d08a] shrink-0" />
                                                <p className="text-[11px] font-bold text-[#b09e5a] leading-relaxed capitalize tracking-wide text-start italic">TDS projected to increase by 12% in final quarter (March Overflow).</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Redesigned Attractive Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#F0C1E1]/10 rounded-full -translate-y-16 -translate-x-16 blur-3xl" />
                    <DialogHeader className="text-start space-y-2 relative z-10">
                        <Badge className="bg-[#F0C1E1] text-white border-none font-bold text-[9px] px-3 py-1 capitalize tracking-wide w-fit shadow-lg shadow-[#F0C1E1]/20">Fiscal Node</Badge>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{editingDec ? "Refine Compliance Trace" : "New Tax Initialization"}</DialogTitle>
                        <DialogDescription className="text-xs font-semibold text-slate-400 capitalize tracking-wide leading-none">Map individual regime parameters for current cycle</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-8 relative z-10">
                        <div className="space-y-2 text-start">
                            <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide block ml-1 text-start leading-none">Employee Marker</Label>
                            <Input
                                placeholder="Formal Identity..."
                                value={formData.employeeName}
                                onChange={e => setFormData({ ...formData, employeeName: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12 font-semibold text-sm tracking-tight px-4"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-start">
                            <div className="space-y-2 text-start">
                                <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide block ml-1 text-start leading-none">Registry Id</Label>
                                <Input
                                    placeholder="EMPXXX"
                                    value={formData.employeeId}
                                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-bold text-sm tracking-wide px-4"
                                />
                            </div>
                            <div className="space-y-2 text-start">
                                <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide block ml-1 text-start leading-none">Tax Regime</Label>
                                <Select value={formData.regime} onValueChange={(v) => setFormData({ ...formData, regime: v })}>
                                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none font-bold text-xs px-4 focus:ring-1 focus:ring-[#CB9DF0]">
                                        <SelectValue placeholder="Select Regime" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="rounded-xl border border-slate-100 shadow-2xl p-2 font-sans bg-white z-[200] min-w-[180px]">
                                        <SelectItem value="New" className="rounded-lg text-xs font-semibold text-slate-700 h-10 focus:bg-slate-50 transition-colors">New Regime</SelectItem>
                                        <SelectItem value="Old" className="rounded-lg text-xs font-semibold text-slate-700 h-10 focus:bg-slate-50 transition-colors">Old Regime</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-start">
                            <div className="space-y-2 text-start">
                                <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide block ml-1 text-start leading-none">Gross Savings (₹)</Label>
                                <Input
                                    type="number"
                                    value={formData.totalSavings}
                                    onChange={e => setFormData({ ...formData, totalSavings: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-bold text-base text-slate-900 px-4 tabular-nums"
                                />
                            </div>
                            <div className="space-y-2 text-start">
                                <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide block ml-1 text-start leading-none">Est Monthly Tds (₹)</Label>
                                <Input
                                    type="number"
                                    value={formData.estimatedTax}
                                    onChange={e => setFormData({ ...formData, estimatedTax: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-bold text-base text-rose-500 px-4 tabular-nums"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="relative z-10 sm:justify-start">
                        <Button
                            className="w-full bg-[#CB9DF0] hover:bg-[#b088e0] text-white rounded-2xl h-14 font-bold capitalize text-xs tracking-wide shadow-2xl shadow-[#CB9DF0]/20 transition-all border-none"
                            onClick={handleSubmit}
                        >
                            {editingDec ? "Map Revised Compliance" : "Initialize Cycle Compliance"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Verification Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden font-sans">
                    <div className="h-full flex flex-col bg-white overflow-hidden text-start font-sans">
                        <div className="bg-slate-50 p-10 text-slate-900 border-b border-slate-100 flex flex-col items-start text-start">
                            <Badge className="bg-[#CB9DF0]/10 text-[#CB9DF0] border-none font-black text-[9px] capitalize tracking-widest px-3 mb-4 leading-none h-5 shadow-sm">COMPLIANCE REVIEW</Badge>
                            <SheetTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none text-start mb-0">{selectedDec?.employeeName}</SheetTitle>
                            <SheetDescription className="text-slate-400 font-bold tracking-widest text-[10px] capitalize mt-2 text-start leading-none">Financial Year 2025-2026 • {selectedDec?.regime} Regime</SheetDescription>
                        </div>
                        <ScrollArea className="flex-1 p-8 text-start font-sans">
                            <div className="space-y-8 text-start">
                                <div className="grid grid-cols-2 gap-4 text-start font-sans">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-start font-sans">
                                        <span className="text-[9px] font-black text-slate-400 capitalize tracking-widest block mb-1 leading-none text-start">Gross Savings</span>
                                        <p className="text-lg font-black text-slate-900 leading-none text-start">{formatINR(selectedDec?.totalSavings || 0)}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-start font-sans">
                                        <span className="text-[9px] font-black text-slate-400 capitalize tracking-widest block mb-1 leading-none text-start">Projected TDS</span>
                                        <p className="text-lg font-black text-rose-500 leading-none text-start">{formatINR(selectedDec?.estimatedTax || 0)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-start">
                                    <h4 className="text-[10px] font-black text-slate-900 capitalize tracking-widest border-b border-slate-50 pb-3 text-start mb-0 leading-none">Declaration Breakdown</h4>
                                    <div className="space-y-3 text-start">
                                        {[
                                            { label: "80C (Insurance, LIC, PPF)", amt: formatINR(150000) },
                                            { label: "80D (Health Insurance)", amt: formatINR(25000) },
                                            { label: "House Rent Allowance", amt: formatINR(360000) },
                                            { label: "Section 24 (Home Loan)", amt: formatINR(200000) }
                                        ].map((row, i) => (
                                            <div key={i} className="flex justify-between items-center text-start">
                                                <span className="text-[10px] font-bold text-slate-500 capitalize tracking-tighter text-start leading-none italic">{row.label}</span>
                                                <span className="text-xs font-black text-slate-800 leading-none">{row.amt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center gap-4 text-center group transition-all hover:bg-emerald-100/50">
                                    <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm transition-transform group-hover:scale-110">
                                        <ExternalLink size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-slate-900 capitalize leading-none">Evidence Repository</h4>
                                        <p className="text-[10px] font-semibold text-slate-400 capitalize italic tracking-wide">4 Documents linked to this declaration</p>
                                    </div>
                                    <Button
                                        onClick={() => handleViewProofs(selectedDec?.employeeName)}
                                        variant="outline" className="w-full h-10 border-emerald-200 text-emerald-600 font-bold text-xs capitalize hover:bg-emerald-500 hover:text-white rounded-xl border-none"
                                    >View Proofs</Button>
                                </div>
                            </div>
                        </ScrollArea>
                        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex flex-col gap-3 text-start">
                            <Button
                                onClick={() => { updateDeclarationStatus(selectedDec.id, 'Verified'); setIsSheetOpen(false); toast({ title: "Authorized" }); }}
                                className="w-full h-12 bg-[#CB9DF0] text-white rounded-xl font-black capitalize text-[10px] tracking-widest shadow-xl shadow-[#CB9DF0]/20 border-none transition-all"
                            >
                                Verify Compliance
                            </Button>
                            <Button variant="ghost" className="w-full h-10 text-slate-400 font-bold capitalize text-[9px] tracking-widest hover:text-rose-500 transition-all border-none" onClick={() => setIsSheetOpen(false)}>Flag Deficiency</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default TaxDeclarationsPage;
