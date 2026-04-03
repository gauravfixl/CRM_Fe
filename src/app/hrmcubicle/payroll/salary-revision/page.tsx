"use client"

import React, { useState, useMemo } from "react";
import {
    TrendingUp, Plus, Search, Edit, Trash2, Download, CheckCircle2, XCircle, Clock,
    DollarSign, Users, Percent, FileText, Eye, ChevronDown, ArrowUpRight, Filter
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
import { Textarea } from "@/shared/components/ui/textarea";
import { useSalaryStore, type SalaryRevision } from "@/shared/data/salary-store";

const SalaryRevisionPage = () => {
    const { toast } = useToast();
    const { revisions, addRevision, updateRevision, deleteRevision } = useSalaryStore();
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingRevision, setViewingRevision] = useState<SalaryRevision | null>(null);

    const [form, setForm] = useState({
        employeeId: "", employeeName: "", department: "Engineering", currentCTC: 0,
        revisedCTC: 0, effectiveDate: "", reason: "", linkedAppraisalId: ""
    });

    const incrementPercent = useMemo(() => {
        if (form.currentCTC <= 0) return 0;
        return ((form.revisedCTC - form.currentCTC) / form.currentCTC * 100);
    }, [form.currentCTC, form.revisedCTC]);

    const stats = useMemo(() => {
        const pending = revisions.filter(r => r.status === "Pending").length;
        const approved = revisions.filter(r => r.status === "Approved").length;
        const avgIncrement = revisions.length > 0 ? (revisions.reduce((s, r) => s + r.incrementPercent, 0) / revisions.length).toFixed(1) : "0";
        const budgetImpact = revisions.filter(r => r.status === "Approved").reduce((s, r) => s + (r.revisedCTC - r.currentCTC), 0);
        return { pending, approved, avgIncrement, budgetImpact };
    }, [revisions]);

    // Department budget data
    const deptBudgets = [
        { name: "Engineering", budget: 5000000, used: 3200000, color: "bg-[#8B5CF6]" },
        { name: "Marketing", budget: 2000000, used: 1500000, color: "bg-pink-500" },
        { name: "Operations", budget: 1500000, used: 800000, color: "bg-amber-500" },
        { name: "HR", budget: 1000000, used: 600000, color: "bg-emerald-500" },
    ];

    const filteredRevisions = revisions
        .filter(r => activeTab === "all" || r.status.toLowerCase() === activeTab)
        .filter(r => r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || r.department.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSave = () => {
        if (!form.employeeName || form.currentCTC <= 0 || form.revisedCTC <= 0) {
            toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" }); return;
        }
        const data = { ...form, incrementPercent: Number(incrementPercent.toFixed(1)), status: "Pending" as const, approvedBy: "" };
        if (editingId) {
            updateRevision(editingId, data);
            toast({ title: "Revision Updated", description: `Revision for ${form.employeeName} updated.` });
        } else {
            addRevision(data);
            toast({ title: "Revision Created", description: `Salary revision for ${form.employeeName} submitted for approval.` });
        }
        setIsCreateOpen(false);
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => setForm({ employeeId: "", employeeName: "", department: "Engineering", currentCTC: 0, revisedCTC: 0, effectiveDate: "", reason: "", linkedAppraisalId: "" });

    const handleApprove = (id: string) => {
        updateRevision(id, { status: "Approved", approvedBy: "HR Admin" });
        toast({ title: "Revision Approved", description: "Salary revision has been approved." });
    };

    const handleReject = (id: string) => {
        updateRevision(id, { status: "Rejected" });
        toast({ title: "Revision Rejected", description: "Salary revision has been rejected." });
    };

    const handleExport = () => {
        const csv = ["Employee,Department,Current CTC,Revised CTC,Increment %,Effective Date,Status", ...revisions.map(r => `${r.employeeName},${r.department},${r.currentCTC},${r.revisedCTC},${r.incrementPercent}%,${r.effectiveDate},${r.status}`)].join("\n");
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "salary_revisions.csv"; a.click(); URL.revokeObjectURL(url);
        toast({ title: "Exported", description: "Salary revisions exported." });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><TrendingUp size={20} /></div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Salary Revision Management</h1>
                        <p className="text-xs font-semibold text-slate-500">Increments, appraisal-linked revisions & arrears</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-lg font-bold text-xs gap-2 border-slate-200" onClick={handleExport}><Download size={14} /> Export</Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs" onClick={() => { resetForm(); setEditingId(null); setIsCreateOpen(true); }}><Plus size={14} className="mr-1.5" /> New Revision</Button>
                </div>
            </div>

            <div className="flex-1 p-8 space-y-6 pb-32">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Pending Revisions", val: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                        { label: "Avg Increment", val: `${stats.avgIncrement}%`, icon: Percent, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
                        { label: "Budget Impact", val: `₹${(stats.budgetImpact / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Approved This Cycle", val: stats.approved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                    ].map((s, i) => (
                        <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}><s.icon size={20} /></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</p><p className="text-xl font-bold text-slate-900">{s.val}</p></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Table */}
                    <Card className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div className="px-5 pt-4 border-b border-slate-100 flex items-center justify-between pb-0">
                                <TabsList className="bg-slate-50 p-1 rounded-xl h-10">
                                    {[{ id: "all", label: "All" }, { id: "pending", label: "Pending" }, { id: "approved", label: "Approved" }, { id: "rejected", label: "Rejected" }].map(t => (
                                        <TabsTrigger key={t.id} value={t.id} className="rounded-lg px-4 h-8 font-bold text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6]">{t.label}</TabsTrigger>
                                    ))}
                                </TabsList>
                                <div className="relative w-56 mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                                    <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 rounded-lg border-none bg-slate-50 h-8 font-bold text-[10px]" />
                                </div>
                            </div>
                            <TabsContent value={activeTab} className="m-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-none">
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-5">Employee</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Department</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right">Current CTC</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right">Proposed CTC</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Increment</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Status</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right pr-5">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRevisions.length > 0 ? filteredRevisions.map(r => (
                                            <TableRow key={r.id} className="border-slate-50 hover:bg-slate-50/50">
                                                <TableCell className="pl-5"><div><p className="font-bold text-slate-900 text-sm">{r.employeeName}</p><p className="text-[10px] text-slate-400 font-bold">{r.employeeId}</p></div></TableCell>
                                                <TableCell className="font-bold text-xs text-slate-600">{r.department}</TableCell>
                                                <TableCell className="text-right font-bold text-xs text-slate-700">₹{(r.currentCTC / 100000).toFixed(1)}L</TableCell>
                                                <TableCell className="text-right font-bold text-xs text-[#8B5CF6]">₹{(r.revisedCTC / 100000).toFixed(1)}L</TableCell>
                                                <TableCell><Badge className={cn("border-none font-bold text-[9px]", r.incrementPercent >= 15 ? "bg-emerald-50 text-emerald-600" : r.incrementPercent >= 10 ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600")}><ArrowUpRight size={10} className="mr-0.5" />{r.incrementPercent}%</Badge></TableCell>
                                                <TableCell><Badge variant="outline" className={cn("font-bold text-[9px]", r.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : r.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-red-50 text-red-600 border-red-100")}>{r.status}</Badge></TableCell>
                                                <TableCell className="text-right pr-5">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => { setViewingRevision(r); setIsDetailOpen(true); }}><Eye size={13} className="text-slate-400" /></Button>
                                                        {r.status === "Pending" && <>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleApprove(r.id)}><CheckCircle2 size={13} className="text-emerald-500" /></Button>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleReject(r.id)}><XCircle size={13} className="text-red-400" /></Button>
                                                        </>}
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => { setForm({ employeeId: r.employeeId, employeeName: r.employeeName, department: r.department, currentCTC: r.currentCTC, revisedCTC: r.revisedCTC, effectiveDate: r.effectiveDate, reason: r.reason || "", linkedAppraisalId: r.linkedAppraisalId || "" }); setEditingId(r.id); setIsCreateOpen(true); }}><Edit size={13} className="text-slate-400" /></Button>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => { deleteRevision(r.id); toast({ title: "Deleted" }); }}><Trash2 size={13} className="text-red-400" /></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow><TableCell colSpan={7} className="h-40 text-center"><p className="text-slate-400 font-bold">No revisions found</p></TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    </Card>

                    {/* Budget Tracker */}
                    <Card className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <CardContent className="p-5">
                            <h3 className="text-sm font-bold text-slate-900 mb-4">Department Budget Utilization</h3>
                            <div className="space-y-5">
                                {deptBudgets.map((d, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-700">{d.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400">₹{(d.used / 100000).toFixed(1)}L / ₹{(d.budget / 100000).toFixed(1)}L</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className={cn("h-full rounded-full transition-all", d.color)} style={{ width: `${(d.used / d.budget * 100)}%` }} />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400">{Math.round(d.used / d.budget * 100)}% utilized</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-6 max-w-lg shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editingId ? "Edit Revision" : "New Salary Revision"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Employee Name</Label><Input value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })} className="h-9 rounded-lg text-xs font-bold" /></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Employee ID</Label><Input value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="h-9 rounded-lg text-xs font-bold" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Department</Label>
                                <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })}><SelectTrigger className="h-9 rounded-lg text-xs font-bold"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl font-bold"><SelectItem value="Engineering" className="text-xs">Engineering</SelectItem><SelectItem value="Marketing" className="text-xs">Marketing</SelectItem><SelectItem value="Operations" className="text-xs">Operations</SelectItem><SelectItem value="HR" className="text-xs">HR</SelectItem><SelectItem value="Finance" className="text-xs">Finance</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Effective Date</Label><Input type="date" value={form.effectiveDate} onChange={e => setForm({ ...form, effectiveDate: e.target.value })} className="h-9 rounded-lg text-xs font-bold" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Current CTC (₹)</Label><Input type="number" value={form.currentCTC || ""} onChange={e => setForm({ ...form, currentCTC: Number(e.target.value) })} className="h-9 rounded-lg text-xs font-bold" /></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Proposed CTC (₹)</Label><Input type="number" value={form.revisedCTC || ""} onChange={e => setForm({ ...form, revisedCTC: Number(e.target.value) })} className="h-9 rounded-lg text-xs font-bold" /></div>
                        </div>
                        {form.currentCTC > 0 && form.revisedCTC > 0 && (
                            <div className={cn("p-4 rounded-xl border flex items-center justify-between", incrementPercent >= 0 ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100")}>
                                <span className="text-xs font-bold text-slate-600">Increment</span>
                                <div className="text-right">
                                    <p className={cn("text-lg font-bold", incrementPercent >= 0 ? "text-emerald-600" : "text-red-600")}>{incrementPercent >= 0 ? "+" : ""}{incrementPercent.toFixed(1)}%</p>
                                    <p className="text-[10px] font-bold text-slate-400">₹{((form.revisedCTC - form.currentCTC) / 12).toLocaleString()}/mo change</p>
                                </div>
                            </div>
                        )}
                        <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Reason</Label><Textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="rounded-lg text-xs font-medium resize-none min-h-[60px]" placeholder="Annual appraisal, promotion, market correction..." /></div>
                        <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Linked Appraisal ID (optional)</Label><Input value={form.linkedAppraisalId} onChange={e => setForm({ ...form, linkedAppraisalId: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="e.g. APR-2026-001" /></div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-lg h-9 px-6 font-bold text-xs">Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-6 font-bold text-xs" onClick={handleSave}>{editingId ? "Save" : "Submit for Approval"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-6 max-w-lg shadow-2xl">
                    <DialogHeader><DialogTitle className="text-lg font-bold text-slate-900">Revision Details</DialogTitle></DialogHeader>
                    {viewingRevision && (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-[10px] font-bold text-slate-400">Employee</p><p className="text-sm font-bold text-slate-900">{viewingRevision.employeeName}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400">Department</p><p className="text-sm font-bold text-slate-900">{viewingRevision.department}</p></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] font-bold text-slate-400">Current CTC</p><p className="text-sm font-bold text-slate-900">₹{(viewingRevision.currentCTC / 100000).toFixed(1)}L</p></div>
                                <div className="p-3 bg-[#8B5CF6]/5 rounded-xl"><p className="text-[10px] font-bold text-slate-400">Proposed CTC</p><p className="text-sm font-bold text-[#8B5CF6]">₹{(viewingRevision.revisedCTC / 100000).toFixed(1)}L</p></div>
                                <div className="p-3 bg-emerald-50 rounded-xl"><p className="text-[10px] font-bold text-slate-400">Increment</p><p className="text-sm font-bold text-emerald-600">+{viewingRevision.incrementPercent}%</p></div>
                            </div>
                            <div><p className="text-[10px] font-bold text-slate-400">Effective Date</p><p className="text-sm font-bold text-slate-900">{viewingRevision.effectiveDate}</p></div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 mb-2">Approval Workflow</p>
                                <div className="flex items-center gap-2">
                                    {["Manager", "HR", "Finance", "Final"].map((step, i) => (
                                        <React.Fragment key={step}>
                                            <div className={cn("h-8 px-3 rounded-lg flex items-center text-[10px] font-bold", i === 0 && viewingRevision.status !== "Pending" ? "bg-emerald-100 text-emerald-700" : i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400")}>{step}</div>
                                            {i < 3 && <ChevronDown size={12} className="text-slate-300 rotate-[-90deg]" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            {viewingRevision.reason && <div><p className="text-[10px] font-bold text-slate-400">Reason</p><p className="text-xs font-medium text-slate-600">{viewingRevision.reason}</p></div>}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SalaryRevisionPage;
