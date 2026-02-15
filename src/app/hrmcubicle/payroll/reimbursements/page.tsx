"use client"

import React, { useState } from "react";
import {
    Wallet,
    ShieldCheck,
    ChevronRight,
    Search,
    Receipt,
    Trash2,
    Edit3,
    CheckCircle2,
    Activity,
    FileText,
    AlertCircle,
    Eye,
    Check,
    X,
    Filter,
    XCircle,
    MoreHorizontal,
    Scale,
    Clock,
    History,
    ExternalLink,
    Bell,
    Download,
    Lock,
    MessageSquare,
    Maximize2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
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
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/shared/components/ui/sheet";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { usePayrollStore } from "@/shared/data/payroll-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const ReimbursementsPage = () => {
    const { claims, updateClaimStatus, addClaim, updateClaim, deleteClaim } = usePayrollStore();
    const { toast } = useToast();
    const [selectedClaim, setSelectedClaim] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isPolicyOpen, setIsPolicyOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [editingClaim, setEditingClaim] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const [formData, setFormData] = useState({
        employeeName: "",
        employeeId: "",
        category: "Medical",
        amount: "",
        submittedDate: new Date().toISOString().split('T')[0],
        taxable: false,
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const categories = [
        { name: "Medical", limit: "₹25,000", utilized: 12400, total: 25000, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", border: "border-[#8B5CF6]/20" },
        { name: "Travel", limit: "₹50,000", utilized: 38000, total: 50000, color: "text-[#EC4899]", bg: "bg-[#EC4899]/10", border: "border-[#EC4899]/20" },
        { name: "Fuel/LTA", limit: "₹45,000", utilized: 15600, total: 45000, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/20" },
        { name: "Misc", limit: "₹10,000", utilized: 2100, total: 10000, color: "text-[#6366F1]", bg: "bg-[#6366F1]/10", border: "border-[#6366F1]/20" },
    ];

    const filteredClaims = claims.filter(claim => {
        const matchesSearch = claim.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || claim.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatINR = (amt: number) => `₹${amt.toLocaleString("en-IN")}`;

    const handleOpenForm = (claim?: any) => {
        if (claim) {
            setEditingClaim(claim);
            setFormData({
                employeeName: claim.employeeName,
                employeeId: claim.employeeId,
                category: claim.category,
                amount: claim.amount.toString(),
                submittedDate: claim.submittedDate,
                taxable: claim.taxable,
            });
        } else {
            setEditingClaim(null);
            setFormData({
                employeeName: "",
                employeeId: "",
                category: "Medical",
                amount: "",
                submittedDate: new Date().toISOString().split('T')[0],
                taxable: false,
            });
        }
        setIsFormOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.employeeName || !formData.amount || !formData.employeeId) {
            toast({ title: "Incomplete Protocol", description: "All fields are required for disbursement.", variant: "destructive" });
            return;
        }

        const claimPayload = {
            ...formData,
            amount: parseFloat(formData.amount),
            status: editingClaim ? editingClaim.status : 'Pending' as any,
        };

        if (editingClaim) {
            updateClaim(editingClaim.id, claimPayload);
            toast({ title: "Record Refined", description: "The reimbursement claim has been updated." });
        } else {
            addClaim(claimPayload);
            toast({ title: "Proposal Logged", description: "New manual claim has been injected into the cycle." });
        }
        setIsFormOpen(false);
    };

    const handleReject = () => {
        if (!rejectionReason) {
            toast({ title: "Reason Required", description: "Please explain the deficiency for the employee.", variant: "destructive" });
            return;
        }
        updateClaimStatus(selectedClaim.id, 'Rejected');
        toast({ title: "Claim Deflected", description: "Employee will be notified of the deficiency." });
        setIsRejectionOpen(false);
        setIsDetailOpen(false);
        setRejectionReason("");
    };

    const handleFinalizeCycle = () => {
        setIsFinalizing(true);
        setTimeout(() => {
            setIsFinalizing(false);
            toast({ title: "Cycle Finalized", description: "All approved claims have been queued for payroll payout.", variant: "default" });
        }, 2000);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === filteredClaims.length ? [] : filteredClaims.map(d => d.id));
    };

    const handleDelete = (id: string) => {
        deleteClaim(id);
        toast({ title: "Record Expunged", description: "The reimbursement claim has been permanently removed." });
    };

    const handleBulkApprove = () => {
        setIsBulkProcessing(true);
        setTimeout(() => {
            selectedIds.forEach(id => updateClaimStatus(id, 'Approved'));
            setSelectedIds([]);
            setIsBulkProcessing(false);
            toast({ title: "Bulk Authorization", description: `${selectedIds.length} claims have been cleared for payout.` });
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-hidden">
            <div className="flex flex-col h-full overflow-auto" style={{ transform: "scale(0.8)", transformOrigin: "top left", width: "125%", height: "125%" }}>
                {/* Header */}
                <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-[#CB9DF0]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                            <Wallet size={20} />
                        </div>
                        <div className="text-start">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight text-start">Reimbursement hub</h1>
                            <p className="text-sm font-medium text-slate-500 text-start italic">January 2026 Cycle • Policy Compliance</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => setIsPolicyOpen(true)} className="h-10 border-slate-200 rounded-lg font-semibold text-xs gap-2 px-4 hover:text-[#8B5CF6] transition-all border-none bg-slate-50/50">
                            <ShieldCheck size={14} /> Policy engine
                        </Button>
                        <Button
                            disabled={isFinalizing}
                            onClick={handleFinalizeCycle}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-10 px-4 font-semibold text-xs gap-2 shadow-sm border-none transition-all"
                        >
                            {isFinalizing ? <Activity size={14} className="animate-spin" /> : <Lock size={14} />} Finalize cycle
                        </Button>
                        <Button onClick={() => handleOpenForm()} className="bg-[#CB9DF0] hover:bg-[#b088e0] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-sm border-none shadow-lg shadow-[#CB9DF0]/20 transition-all hover:scale-[1.02]">
                            Create manual claim <ChevronRight size={14} className="ml-1" />
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-8 space-y-8">
                        {/* Budget Utilization Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat, i) => (
                                <Card key={i} className={`rounded-2xl border ${cat.border} ${cat.bg} shadow-sm overflow-hidden group hover:shadow-md transition-all text-start relative`}>
                                    <CardContent className="p-5 text-start relative z-10">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className={`h-8 w-8 bg-white/80 rounded-lg flex items-center justify-center shadow-sm`}>
                                                <Receipt size={16} className={cat.color} />
                                            </div>
                                            <Badge className="bg-white/50 text-slate-600 border-none font-bold text-[8px] tracking-widest leading-none px-2 py-1">Utilized {Math.round((cat.utilized / cat.total) * 100)}%</Badge>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-[10px] font-semibold text-slate-500 block text-start mb-1">{cat.name} budget status</span>
                                                <div className="flex items-end gap-1">
                                                    <p className="text-xl font-bold text-slate-900 tracking-tight">{formatINR(cat.utilized)}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 mb-1">/ {formatINR(cat.total)}</p>
                                                </div>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/40 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(cat.utilized / cat.total) * 100}%` }}
                                                    className={`h-full ${cat.color.replace('text-', 'bg-')} opacity-80`}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <Receipt size={80} className={`absolute -right-4 -bottom-4 ${cat.color} opacity-[0.03] group-hover:scale-110 transition-transform`} />
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Queue Table */}
                            <div className="lg:col-span-8 space-y-6">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-6 border-b border-slate-50 text-start">
                                        <div className="flex justify-between items-center text-start">
                                            <div className="text-start">
                                                <CardTitle className="text-lg font-bold text-slate-800 tracking-tight text-start">Verification queue</CardTitle>
                                                <CardDescription className="text-sm font-medium text-slate-400 mt-1 text-start italic">Audit artifacts and policy check</CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="relative w-48 font-sans text-start">
                                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        placeholder="Search employee..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="pl-9 h-9 bg-slate-50 border-none rounded-lg text-xs font-semibold focus:ring-1 focus:ring-[#CB9DF0]"
                                                    />
                                                </div>
                                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                    <SelectTrigger className="h-9 w-32 rounded-lg border-slate-100 text-slate-500 font-semibold text-[10px] bg-white shadow-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Filter size={12} />
                                                            <SelectValue placeholder="Status" />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-none shadow-2xl bg-white font-sans z-[200]">
                                                        <SelectItem value="All" className="text-[10px] font-semibold">All nodes</SelectItem>
                                                        <SelectItem value="Approved" className="text-[10px] font-semibold text-emerald-600">Approved</SelectItem>
                                                        <SelectItem value="Pending" className="text-[10px] font-semibold text-amber-600">Pending</SelectItem>
                                                        <SelectItem value="Rejected" className="text-[10px] font-semibold text-rose-600">Rejected</SelectItem>
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
                                                        <span className="text-xs font-bold text-slate-500 leading-none">{selectedIds.length} Nodes selected for batch clearance</span>
                                                        <div className="h-4 w-px bg-slate-200" />
                                                        <Button onClick={handleBulkApprove} disabled={isBulkProcessing} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-4 rounded-lg shadow-sm border-none transition-all active:scale-95">
                                                            {isBulkProcessing ? <Activity size={12} className="animate-spin mr-2" /> : <CheckCircle2 size={12} className="mr-2" />} Authorize payout
                                                        </Button>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-slate-400 hover:text-rose-500 font-bold text-[10px] transition-colors">Discard selection</Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <Table>
                                            <TableHeader className="bg-slate-50/50">
                                                <TableRow className="border-slate-100 h-12">
                                                    <TableHead className="pl-8 w-12 text-start">
                                                        <Checkbox
                                                            checked={selectedIds.length > 0 && selectedIds.length === filteredClaims.length}
                                                            onCheckedChange={toggleSelectAll}
                                                            className="border-slate-300 data-[state=checked]:bg-[#CB9DF0] data-[state=checked]:border-[#CB9DF0]"
                                                        />
                                                    </TableHead>
                                                    <TableHead className="text-[11px] font-bold text-slate-400 tracking-wider text-start">Employee</TableHead>
                                                    <TableHead className="text-[11px] font-bold text-slate-400 tracking-wider text-start">Category</TableHead>
                                                    <TableHead className="text-[11px] font-bold text-slate-400 tracking-wider text-start">Amount</TableHead>
                                                    <TableHead className="text-[11px] font-bold text-slate-400 tracking-wider text-start text-right pr-8">Protocol</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <AnimatePresence mode="popLayout">
                                                    {filteredClaims.length > 0 ? filteredClaims.map((claim) => (
                                                        <motion.tr
                                                            key={claim.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className={`group hover:bg-slate-50/50 border-slate-50 border-b last:border-0 transition-colors ${selectedIds.includes(claim.id) ? 'bg-[#CB9DF0]/5' : ''}`}
                                                        >
                                                            <TableCell className="pl-8 py-3 text-start">
                                                                <Checkbox
                                                                    checked={selectedIds.includes(claim.id)}
                                                                    onCheckedChange={() => toggleSelect(claim.id)}
                                                                    className="border-slate-300 data-[state=checked]:bg-[#CB9DF0] data-[state=checked]:border-[#CB9DF0]"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="py-3 text-start">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500 group-hover:bg-white transition-colors">{claim.employeeId.slice(-3)}</div>
                                                                    <div className="text-start">
                                                                        <span className="text-sm font-semibold text-slate-900 block leading-tight">{claim.employeeName}</span>
                                                                        <span className="text-[9px] font-medium text-slate-400 italic">{claim.employeeId}</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={`border-none text-[9px] font-bold px-2 text-slate-400`}>{claim.category}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-sm font-bold text-slate-700 tracking-tight text-start">{formatINR(claim.amount)}</TableCell>
                                                            <TableCell className="text-right pr-8">
                                                                <div className="flex justify-end gap-2 text-start">
                                                                    <Badge className={`bg-white border-none text-[10px] font-bold shadow-sm h-7 px-3 mr-2 ${claim.status === 'Approved' ? 'text-emerald-500' : claim.status === 'Rejected' ? 'text-rose-500' : 'text-amber-500'
                                                                        }`}>{claim.status}</Badge>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-[#CB9DF0] hover:bg-slate-100" onClick={() => { setSelectedClaim(claim); setIsDetailOpen(true); }}>
                                                                        <Eye size={14} />
                                                                    </Button>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:bg-slate-100">
                                                                                <MoreHorizontal size={14} />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-[180px] rounded-xl p-2 border-none shadow-2xl ring-1 ring-slate-100 bg-white font-sans text-start">
                                                                            <DropdownMenuItem onClick={() => { updateClaimStatus(claim.id, 'Approved'); toast({ title: "Authorized!" }); }} className="rounded-lg flex items-center gap-3 px-3 py-1.5 font-semibold text-[11px] text-emerald-600">
                                                                                <CheckCircle2 size={14} /> Approve payout
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => { setSelectedClaim(claim); setIsRejectionOpen(true); }} className="rounded-lg flex items-center gap-3 px-3 py-1.5 font-semibold text-[11px] text-rose-400">
                                                                                <XCircle size={14} /> Decline payout
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator className="bg-slate-50" />
                                                                            <DropdownMenuItem onClick={() => handleOpenForm(claim)} className="rounded-lg flex items-center gap-3 px-3 py-1.5 font-semibold text-[11px] text-slate-600">
                                                                                <FileText size={14} /> Refine log
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleDelete(claim.id)} className="rounded-lg flex items-center gap-3 px-3 py-1.5 font-semibold text-[11px] text-rose-300">
                                                                                <Trash2 size={14} /> Expunge record
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </TableCell>
                                                        </motion.tr>
                                                    )) : (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="h-40 text-center">
                                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                                    <Search size={40} className="mb-4 opacity-10" />
                                                                    <p className="text-sm font-semibold italic leading-none">No matching compliance nodes found</p>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </AnimatePresence>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Side Panel: Log */}
                            <div className="lg:col-span-4 space-y-6 text-start">
                                <Card className="rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-6 relative overflow-hidden group shadow-sm">
                                    <div className="relative z-10 text-start">
                                        <div className="flex justify-between items-center mb-6 text-start">
                                            <h4 className="text-sm font-bold tracking-tight text-slate-800 mb-0 leading-none">Audit insight</h4>
                                            <Badge className="bg-[#CB9DF0] text-white border-none font-bold text-[8px] leading-none h-4 px-2 tracking-widest">LIVE</Badge>
                                        </div>
                                        <div className="space-y-4 text-start">
                                            {[
                                                { title: "Manual overrides", val: "₹1.2L", icon: Scale, color: "text-[#8B5CF6]" },
                                                { title: "Policy violations", val: "14", icon: AlertCircle, color: "text-rose-500" },
                                                { title: "Avg resolution", val: "1.2d", icon: Clock, color: "text-emerald-500" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#8B5CF6]/10 text-start shadow-sm transition-transform group-hover:translate-x-1">
                                                    <div className="flex items-center gap-3 text-start">
                                                        <item.icon size={14} className={item.color} />
                                                        <span className="text-[10px] font-semibold text-slate-500 text-start">{item.title}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <ShieldCheck size={140} className="absolute -right-12 -bottom-12 text-[#8B5CF6] opacity-[0.05] group-hover:scale-110 transition-transform" />
                                </Card>

                                <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-start">
                                    <div className="flex items-center gap-3 mb-4 text-start">
                                        <div className="h-7 w-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                                            <History size={14} />
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-800 tracking-tight text-start mb-0 leading-none">Payout log</h4>
                                    </div>
                                    <div className="space-y-3 text-start">
                                        {[
                                            { name: "Batch #104", amt: "₹4.5L", date: "Jan 12", users: 18, status: "Cleared" },
                                            { name: "Batch #103", amt: "₹2.1L", date: "Jan 05", users: 9, status: "Cleared" }
                                        ].map((batch, i) => (
                                            <div key={i} className="flex items-center justify-between border-b last:border-0 border-slate-50 pb-2 last:pb-0 text-start group cursor-default">
                                                <div className="text-start">
                                                    <span className="text-[11px] font-bold text-slate-900 block leading-tight text-start transition-colors group-hover:text-[#CB9DF0]">{batch.name}</span>
                                                    <span className="text-[9px] font-medium text-slate-400 mt-0.5 block text-start italic">{batch.date} • {batch.users} claims • {batch.status}</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-emerald-600">{batch.amt}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full mt-4 h-8 border-none bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg font-semibold text-[10px] transition-all">View full report</Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Rejection Narrative Dialog */}
            <Dialog open={isRejectionOpen} onOpenChange={setIsRejectionOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-md font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150]">
                    <DialogHeader className="text-start space-y-2 font-sans">
                        <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                            <XCircle size={20} />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Decline payout authorization</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500 leading-normal">Please specify the deficiency or reason for rejecting <b>{selectedClaim?.employeeName}</b>'s claim.</DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4 font-sans text-start">
                        <Label className="text-[11px] font-semibold text-slate-400 block ml-1 leading-none uppercase tracking-wider">Deficiency narrative</Label>
                        <Textarea
                            placeholder="e.g., Attached receipt is illegible or outside policy period..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="rounded-2xl bg-slate-50 border-none h-32 font-medium text-sm p-4 focus-visible:ring-1 focus-visible:ring-rose-200 transition-all"
                        />
                        <div className="flex gap-2">
                            {["Illegible Document", "Invalid Category", "Policy Cap Hit"].map((tag) => (
                                <Badge
                                    key={tag}
                                    onClick={() => setRejectionReason(tag)}
                                    className="bg-slate-50 text-slate-500 border border-slate-100 font-semibold text-[9px] px-3 py-1 cursor-pointer hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                                >{tag}</Badge>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="font-sans flex-col sm:flex-row gap-3">
                        <Button variant="ghost" onClick={() => setIsRejectionOpen(false)} className="flex-1 rounded-2xl h-12 font-bold text-slate-400">Discard</Button>
                        <Button
                            onClick={handleReject}
                            className="flex-[2] bg-rose-500 hover:bg-rose-600 text-white rounded-2xl h-12 font-bold shadow-lg shadow-rose-100 border-none transition-all"
                        >Confirm rejection</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manual Entry Form */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CB9DF0]/10 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50" />
                    <DialogHeader className="text-start space-y-2 relative z-10 font-sans">
                        <Badge className="bg-[#CB9DF0] text-white border-none font-bold text-[10px] px-3 py-1 w-fit shadow-lg shadow-[#CB9DF0]/20">Audit artifact</Badge>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{editingClaim ? "Refine claim artifacts" : "Initialize reimbursement"}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-400 leading-none mt-2">Map manual financial injection to current cycle</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-8 relative z-10 font-sans">
                        <div className="space-y-2 text-start">
                            <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none mb-1">Beneficiary name</Label>
                            <Input
                                placeholder="Formal identity..."
                                value={formData.employeeName}
                                onChange={e => setFormData({ ...formData, employeeName: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12 font-medium text-sm px-4 focus-visible:ring-1 focus-visible:ring-[#CB9DF0]/50"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-start">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none mb-1">Registry ID</Label>
                                <Input
                                    placeholder="EMPXXX"
                                    value={formData.employeeId}
                                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-semibold text-sm px-4"
                                />
                            </div>
                            <div className="space-y-2 text-start">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none mb-1">Claim category</Label>
                                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none font-semibold text-xs px-4 focus:ring-1 focus:ring-[#CB9DF0]">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="rounded-xl border border-slate-100 shadow-2xl p-2 font-sans bg-white z-[200] min-w-[180px]">
                                        {categories.map(c => (
                                            <SelectItem key={c.name} value={c.name} className="rounded-lg text-xs font-medium text-slate-700 h-10 focus:bg-slate-50 transition-colors">{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-start">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none mb-1">Requested quantum (₹)</Label>
                                <Input
                                    placeholder="0.00"
                                    type="number"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-bold text-base text-slate-900 px-4 tabular-nums"
                                />
                            </div>
                            <div className="space-y-2 text-start">
                                <Label className="text-[11px] font-semibold text-slate-500 block ml-1 leading-none mb-1">Registry date</Label>
                                <Input
                                    type="date"
                                    value={formData.submittedDate}
                                    onChange={e => setFormData({ ...formData, submittedDate: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12 font-semibold text-sm px-4"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="relative z-10 sm:justify-start font-sans">
                        <Button
                            className="w-full bg-slate-900 text-white rounded-2xl h-14 font-bold text-sm shadow-2xl shadow-slate-200 hover:bg-[#CB9DF0] hover:scale-[1.02] transition-all border-none"
                            onClick={handleSubmit}
                        >
                            {editingClaim ? "Confirm repository update" : "Inject claim into terminal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Artifact Preview & Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent className="sm:max-w-2xl border-none shadow-2xl p-0 overflow-hidden font-sans">
                    <div className="h-full flex flex-col bg-white overflow-hidden text-start font-sans">
                        <div className="bg-slate-50 p-8 text-slate-900 relative border-b border-slate-100 text-start">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 text-start">
                                    <Badge className="bg-[#CB9DF0]/10 text-[#CB9DF0] border-none font-bold text-[10px] uppercase px-3 leading-none h-6 shadow-sm">Reviewing claim artifact</Badge>
                                    <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight text-start mb-0 leading-tight">Claim: {selectedClaim?.employeeName}</SheetTitle>
                                    <SheetDescription className="text-slate-500 font-medium text-[11px] text-start mt-0 leading-none">Category: {selectedClaim?.category} • Trace ID: {selectedClaim?.id.slice(-8)}</SheetDescription>
                                </div>
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-end">
                                    <span className="text-[10px] font-semibold text-slate-400 leading-none mb-1">Requested quantum</span>
                                    <p className="text-xl font-bold text-slate-900 leading-none">{formatINR(selectedClaim?.amount || 0)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                            {/* Evidence Previewer (Mockup Image) */}
                            <div className="flex-1 bg-slate-100 p-6 flex flex-col gap-4 border-r border-slate-50">
                                <div className="flex justify-between items-center mb-0">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Evidence preview</h4>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 bg-white shadow-sm rounded-lg hover:text-[#CB9DF0] transition-colors"
                                            onClick={() => toast({ title: "Fullscreen view", description: "Expanding artifact for granular inspection." })}
                                        >
                                            <Maximize2 size={12} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 bg-white shadow-sm rounded-lg hover:text-[#CB9DF0] transition-colors"
                                            onClick={() => toast({ title: "Downloading artifact", description: "The original file is being fetched from the vault." })}
                                        >
                                            <Download size={12} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden relative group">
                                    {/* Mockup of a medical/travel bill */}
                                    <div className="absolute inset-0 bg-[#f9fafb] p-8 flex flex-col gap-10">
                                        <div className="flex justify-between border-b border-slate-100 pb-4">
                                            <div className="space-y-1">
                                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                                <div className="h-3 w-16 bg-slate-100 rounded" />
                                            </div>
                                            <div className="h-8 w-8 bg-slate-100 rounded-full" />
                                        </div>
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex justify-between">
                                                    <div className="h-3 w-32 bg-slate-100 rounded" />
                                                    <div className="h-3 w-12 bg-slate-200 rounded" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-auto border-t border-slate-100 pt-4 flex justify-between items-center">
                                            <div className="h-4 w-12 bg-slate-100 rounded" />
                                            <div className="h-6 w-20 bg-[#CB9DF0]/20 rounded" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                                        <Badge className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 font-bold border-none shadow-xl">Verifying digital signature...</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Controls */}
                            <ScrollArea className="w-full lg:w-72 p-6 bg-white shrink-0">
                                <div className="space-y-8 text-start font-sans">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none border-b border-slate-50 pb-3">Audit metrics</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-medium text-slate-500">Policy alignment</span>
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px]">100% OK</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-medium text-slate-500">Taxability</span>
                                                <span className="text-[11px] font-bold text-slate-800">Non-Taxable</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-medium text-slate-500">Claim frequency</span>
                                                <span className="text-[11px] font-bold text-slate-800">1st this month</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-start">
                                        <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] font-medium text-amber-700 leading-normal italic">Historical data shows similar claims approved for this beneficiary in previous cycle.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => { updateClaimStatus(selectedClaim.id, 'Approved'); setIsDetailOpen(false); toast({ title: "Authorized" }); }}
                                            className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 border-none transition-all"
                                        >
                                            Clear payout
                                        </Button>
                                        <Button
                                            onClick={() => setIsRejectionOpen(true)}
                                            variant="ghost"
                                            className="w-full h-11 text-rose-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl font-bold text-xs transition-all border-none"
                                        >
                                            Deflect claim
                                        </Button>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Policy engine sheet */}
            <Sheet open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
                <SheetContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden font-sans">
                    <div className="h-full flex flex-col bg-white overflow-hidden text-start font-sans">
                        <div className="bg-[#CB9DF0] p-10 text-white relative text-start">
                            <Badge className="bg-white/20 text-white border-none font-bold text-[9px] px-3 mb-4 leading-none h-5 shadow-sm">GOVERNANCE ENGINE</Badge>
                            <SheetTitle className="text-2xl font-bold text-white tracking-tight leading-none mt-2 text-start">Reimbursement policy</SheetTitle>
                            <SheetDescription className="text-white/70 font-medium text-[11px] mt-2 text-start italic">Define thresholds and taxable parameters for cycles</SheetDescription>
                        </div>
                        <ScrollArea className="flex-1 p-8 text-start">
                            <div className="space-y-6 text-start">
                                {categories.map((cat, i) => (
                                    <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4 text-start group hover:bg-white transition-all shadow-sm">
                                        <div className="flex justify-between items-center text-start">
                                            <h4 className="text-sm font-bold text-slate-900 tracking-tight capitalize text-start leading-none mb-0">{cat.name}</h4>
                                            <Badge className="bg-white text-slate-400 border border-slate-100 font-bold text-[9px] leading-none h-5 shadow-sm px-3">Non-Taxable</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-start">
                                            <div className="space-y-1 text-start">
                                                <span className="text-[10px] font-semibold text-slate-400 block leading-none mb-1 text-start">Global cycle limit</span>
                                                <Input defaultValue={cat.limit} className="h-10 bg-white border-slate-100 rounded-lg font-bold text-xs text-start focus:ring-1 focus:ring-[#CB9DF0]" />
                                            </div>
                                            <div className="space-y-1 text-start">
                                                <span className="text-[10px] font-semibold text-slate-400 block leading-none mb-1 text-start">Policy violation action</span>
                                                <Input placeholder="Flag for manual review" className="h-10 bg-white border-slate-100 rounded-lg font-semibold text-xs text-start focus:ring-1 focus:ring-[#CB9DF0]" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                            <Button onClick={() => setIsPolicyOpen(false)} className="w-full h-12 bg-[#CB9DF0] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#CB9DF0]/20 border-none transition-all">Save policy configuration</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default ReimbursementsPage;
