"use client"

import React, { useState, useMemo } from "react";
import {
    Landmark, Plus, Search, Edit, Trash2, Eye, Download, ChevronRight,
    DollarSign, Clock, Users, Percent, CheckCircle2, XCircle, AlertCircle, CreditCard
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import {
    Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useSalaryStore, type Loan, type EMI } from "@/shared/data/salary-store";

const LoansPage = () => {
    const { toast } = useToast();
    const { loans, addLoan, updateLoan, deleteLoan } = useSalaryStore();
    const [activeTab, setActiveTab] = useState("active");
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEmiOpen, setIsEmiOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingLoan, setViewingLoan] = useState<Loan | null>(null);

    const [form, setForm] = useState({
        employeeId: "", employeeName: "", loanType: "Personal Loan" as Loan["loanType"],
        principal: 0, interestRate: 8, tenure: 12, disbursedDate: new Date().toISOString().split("T")[0]
    });

    const calculatedEMI = useMemo(() => {
        if (form.principal <= 0 || form.tenure <= 0) return 0;
        const r = form.interestRate / 100 / 12;
        if (r === 0) return Math.round(form.principal / form.tenure);
        return Math.round((form.principal * r * Math.pow(1 + r, form.tenure)) / (Math.pow(1 + r, form.tenure) - 1));
    }, [form.principal, form.interestRate, form.tenure]);

    const stats = useMemo(() => {
        const active = loans.filter(l => l.status === "Active");
        const totalOutstanding = active.reduce((s, l) => s + l.remainingBalance, 0);
        const emisDue = active.reduce((s, l) => s + l.emis.filter(e => e.status === "Pending").slice(0, 1).length, 0);
        const avgRate = active.length > 0 ? (active.reduce((s, l) => s + l.interestRate, 0) / active.length).toFixed(1) : "0";
        return { activeCount: active.length, totalOutstanding, emisDue: active.length, avgRate };
    }, [loans]);

    const filteredLoans = loans
        .filter(l => {
            if (activeTab === "active") return l.status === "Active";
            if (activeTab === "pending") return l.status === "Pending";
            if (activeTab === "closed") return l.status === "Closed";
            if (activeTab === "advances") return l.loanType === "Salary Advance";
            return true;
        })
        .filter(l => l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || l.loanType.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSave = () => {
        if (!form.employeeName || form.principal <= 0) { toast({ title: "Validation Error", description: "Employee name and principal are required.", variant: "destructive" }); return; }
        const emis: EMI[] = Array.from({ length: form.tenure }, (_, i) => {
            const month = new Date(); month.setMonth(month.getMonth() + i + 1);
            const interest = Math.round((form.principal * form.interestRate / 100 / 12));
            const princ = calculatedEMI - interest;
            return { month: month.toLocaleDateString("en-US", { month: "short", year: "numeric" }), amount: calculatedEMI, principal: princ, interest, status: "Pending" as const };
        });
        if (editingId) {
            updateLoan(editingId, { ...form, emiAmount: calculatedEMI, remainingBalance: form.principal, emis });
            toast({ title: "Loan Updated", description: `Loan for ${form.employeeName} updated.` });
        } else {
            addLoan({ ...form, emiAmount: calculatedEMI, status: "Pending", remainingBalance: form.principal, emis });
            toast({ title: "Loan Created", description: `New ${form.loanType} of ₹${form.principal.toLocaleString()} created.` });
        }
        setIsCreateOpen(false);
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => setForm({ employeeId: "", employeeName: "", loanType: "Personal Loan", principal: 0, interestRate: 8, tenure: 12, disbursedDate: new Date().toISOString().split("T")[0] });

    const handleApproveLoan = (id: string) => {
        updateLoan(id, { status: "Active", disbursedDate: new Date().toISOString().split("T")[0] });
        toast({ title: "Loan Approved", description: "Loan has been approved and disbursed." });
    };

    const handleCloseLoan = (id: string) => {
        updateLoan(id, { status: "Closed", remainingBalance: 0 });
        toast({ title: "Loan Closed", description: "Loan has been prepaid and closed." });
    };

    const handleDelete = (id: string) => {
        deleteLoan(id);
        toast({ title: "Loan Deleted", description: "Loan record removed." });
    };

    const handleExport = () => {
        const csv = ["Employee,Type,Principal,Rate,Tenure,EMI,Outstanding,Status", ...loans.map(l => `${l.employeeName},${l.loanType},${l.principal},${l.interestRate}%,${l.tenure}m,${l.emiAmount},${l.remainingBalance},${l.status}`)].join("\n");
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "loan_register.csv"; a.click(); URL.revokeObjectURL(url);
        toast({ title: "Exported", description: "Loan register exported." });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "90%" }}>
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><Landmark size={20} /></div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Loans & Advances</h1>
                        <p className="text-xs font-semibold text-slate-500">Employee loan management with EMI tracking</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-lg font-bold text-xs gap-2 border-slate-200" onClick={handleExport}><Download size={14} /> Export Register</Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs" onClick={() => { resetForm(); setEditingId(null); setIsCreateOpen(true); }}><Plus size={14} className="mr-1.5" /> New Loan Request</Button>
                </div>
            </div>

            <div className="flex-1 p-8 space-y-6 pb-32">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Active Loans", val: stats.activeCount, icon: CreditCard, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/20", cardBg: "bg-[#CB9DF0]/15 border-[#CB9DF0]/30" },
                        { label: "Total Outstanding", val: `₹${(stats.totalOutstanding / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-100", cardBg: "bg-amber-50 border-amber-200" },
                        { label: "EMIs Due This Month", val: stats.emisDue, icon: Clock, color: "text-blue-600", bg: "bg-blue-100", cardBg: "bg-blue-50 border-blue-200" },
                        { label: "Avg Interest Rate", val: `${stats.avgRate}%`, icon: Percent, color: "text-emerald-600", bg: "bg-emerald-100", cardBg: "bg-emerald-50 border-emerald-200" },
                    ].map((s, i) => (
                        <Card key={i} className={cn("rounded-2xl border shadow-sm", s.cardBg)}>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}><s.icon size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{s.label}</p>
                                        <p className="text-xl font-bold text-slate-900">{s.val}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Table */}
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <div className="px-5 pt-4 border-b border-slate-100 flex items-center justify-between pb-0">
                            <TabsList className="bg-slate-50 p-1 rounded-xl h-10">
                                {[{ id: "active", label: "Active" }, { id: "pending", label: "Pending" }, { id: "closed", label: "Closed" }, { id: "advances", label: "Salary Advances" }].map(t => (
                                    <TabsTrigger key={t.id} value={t.id} className="rounded-lg px-4 h-8 font-bold text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6]">{t.label}</TabsTrigger>
                                ))}
                            </TabsList>
                            <div className="relative w-64 mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                                <Input placeholder="Search loans..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 rounded-lg border border-slate-200 bg-slate-50 h-8 font-bold text-[10px]" />
                            </div>
                        </div>
                        <TabsContent value={activeTab} className="m-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none">
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-5">Employee</TableHead>
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Type</TableHead>
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Principal</TableHead>
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Rate</TableHead>
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Tenure</TableHead>
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">EMI</TableHead>
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Outstanding</TableHead>
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Status</TableHead>
                                        <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right pr-5">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLoans.length > 0 ? filteredLoans.map(l => (
                                        <TableRow key={l.id} className="border-slate-50 hover:bg-slate-50/50">
                                            <TableCell className="pl-5"><div><p className="font-bold text-slate-900 text-sm">{l.employeeName}</p><p className="text-[10px] text-slate-400 font-bold">{l.employeeId}</p></div></TableCell>
                                            <TableCell><Badge variant="outline" className="font-bold text-[9px] bg-slate-50 text-slate-600 border-slate-100">{l.loanType}</Badge></TableCell>
                                            <TableCell className="font-bold text-xs text-slate-900">₹{l.principal.toLocaleString()}</TableCell>
                                            <TableCell className="font-bold text-xs text-slate-700">{l.interestRate}%</TableCell>
                                            <TableCell className="font-bold text-xs text-slate-700">{l.tenure}m</TableCell>
                                            <TableCell className="font-bold text-xs text-[#8B5CF6]">₹{l.emiAmount.toLocaleString()}</TableCell>
                                            <TableCell className="font-bold text-xs text-amber-600">₹{l.remainingBalance.toLocaleString()}</TableCell>
                                            <TableCell><Badge variant="outline" className={cn("font-bold text-[9px] px-2", l.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : l.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100")}>{l.status}</Badge></TableCell>
                                            <TableCell className="text-right pr-5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => { setViewingLoan(l); setIsEmiOpen(true); }}><Eye size={13} className="text-slate-400" /></Button>
                                                    {l.status === "Pending" && <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleApproveLoan(l.id)}><CheckCircle2 size={13} className="text-emerald-500" /></Button>}
                                                    {l.status === "Active" && <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleCloseLoan(l.id)}><XCircle size={13} className="text-amber-500" /></Button>}
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => { setForm({ employeeId: l.employeeId, employeeName: l.employeeName, loanType: l.loanType, principal: l.principal, interestRate: l.interestRate, tenure: l.tenure, disbursedDate: l.disbursedDate }); setEditingId(l.id); setIsCreateOpen(true); }}><Edit size={13} className="text-slate-400" /></Button>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleDelete(l.id)}><Trash2 size={13} className="text-red-400" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={9} className="h-40 text-center"><p className="text-slate-400 font-bold text-sm">No loans found</p></TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-lg shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editingId ? "Edit Loan" : "New Loan Request"}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500">Fill loan details. EMI is auto-calculated.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Employee Name</Label><Input value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="e.g. Rajesh Kumar" /></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Employee ID</Label><Input value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="EMP001" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Loan Type</Label><Select value={form.loanType} onValueChange={v => setForm({ ...form, loanType: v as any })}><SelectTrigger className="h-9 rounded-lg text-xs font-bold"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl font-bold"><SelectItem value="Salary Advance" className="text-xs">Salary Advance</SelectItem><SelectItem value="Personal Loan" className="text-xs">Personal Loan</SelectItem><SelectItem value="Emergency" className="text-xs">Emergency Loan</SelectItem></SelectContent></Select></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Disbursement Date</Label><Input type="date" value={form.disbursedDate} onChange={e => setForm({ ...form, disbursedDate: e.target.value })} className="h-9 rounded-lg text-xs font-bold" /></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Principal (₹)</Label><Input type="number" value={form.principal || ""} onChange={e => setForm({ ...form, principal: Number(e.target.value) })} className="h-9 rounded-lg text-xs font-bold" /></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Interest Rate (%)</Label><Input type="number" value={form.interestRate || ""} onChange={e => setForm({ ...form, interestRate: Number(e.target.value) })} className="h-9 rounded-lg text-xs font-bold" /></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Tenure (months)</Label><Input type="number" value={form.tenure || ""} onChange={e => setForm({ ...form, tenure: Number(e.target.value) })} className="h-9 rounded-lg text-xs font-bold" /></div>
                        </div>
                        <div className="p-4 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">Calculated Monthly EMI</span>
                            <span className="text-xl font-bold text-[#8B5CF6]">₹{calculatedEMI.toLocaleString()}</span>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-lg h-9 px-6 font-bold text-xs">Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-6 font-bold text-xs" onClick={handleSave}>{editingId ? "Save Changes" : "Submit Request"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EMI Schedule Dialog */}
            <Dialog open={isEmiOpen} onOpenChange={setIsEmiOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">EMI Schedule — {viewingLoan?.employeeName}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500">{viewingLoan?.loanType} • Principal ₹{viewingLoan?.principal.toLocaleString()} • {viewingLoan?.interestRate}% p.a. • {viewingLoan?.tenure} months</DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead className="font-bold text-slate-300 text-[9px] uppercase">Month</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase text-right">EMI</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase text-right">Principal</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase text-right">Interest</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase">Status</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {viewingLoan?.emis.map((e, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="font-bold text-xs text-slate-700">{e.month}</TableCell>
                                    <TableCell className="text-right font-bold text-xs">₹{e.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-bold text-xs text-slate-500">₹{e.principal.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-bold text-xs text-slate-400">₹{e.interest.toLocaleString()}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("text-[8px] font-bold", e.status === "Paid" ? "bg-emerald-50 text-emerald-600" : e.status === "Overdue" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400")}>{e.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LoansPage;
