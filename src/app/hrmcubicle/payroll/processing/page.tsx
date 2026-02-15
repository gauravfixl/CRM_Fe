"use client"

import React, { useState, useMemo } from "react";
import {
    Play,
    CheckCircle2,
    AlertCircle,
    Clock,
    DollarSign,
    Users,
    FileText,
    ChevronRight,
    ArrowRight,
    Search,
    Filter,
    Plus,
    X,
    Lock,
    Unlock,
    Calculator,
    Zap,
    Scale,
    History,
    Calendar,
    ArrowUpRight,
    MoreHorizontal,
    ShieldCheck,
    Activity,
    TrendingUp,
    Wallet,
    Download,
    Send,
    CheckSquare,
    Square
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { usePayrollStore } from "@/shared/data/payroll-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const SalaryProcessingPage = () => {
    const { payRuns, updatePayRun } = usePayrollStore();
    const { toast } = useToast();

    const activeRun = payRuns.find(r => r.status === 'Draft' || r.status === 'Processing') || payRuns[0];
    const currentStep = activeRun.step || 0;

    const [activeTab, setActiveTab] = useState("all");
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
    const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
    const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [isFinalized, setIsFinalized] = useState(false);

    const [employees, setEmployees] = useState([
        { id: "EMP001", name: "Rajesh Kumar", dept: "Engg", fixed: 85000, variable: 5000, lop: 0, ot: 0, status: "Verified", approved: false },
        { id: "EMP002", name: "Priya Sharma", dept: "Product", fixed: 95000, variable: 12000, lop: 1, ot: 4, status: "Pending review", approved: false },
        { id: "EMP003", name: "Amit Patel", dept: "Sales", fixed: 62000, variable: 25000, lop: 0, ot: 0, status: "Verified", approved: false },
        { id: "EMP004", name: "Sneha Reddy", dept: "HR", fixed: 78000, variable: 0, lop: 0, ot: 0, status: "Verified", approved: false },
    ]);

    const steps = [
        { id: 0, title: "Inputs", icon: Calculator, desc: "Bonus, LOP", color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]", lightBg: "bg-[#8B5CF6]/10", border: "border-[#8B5CF6]/20" },
        { id: 1, title: "Review", icon: Scale, desc: "Verify variance", color: "text-[#EC4899]", bg: "bg-[#EC4899]", lightBg: "bg-[#EC4899]/10", border: "border-[#EC4899]/20" },
        { id: 2, title: "Approval", icon: ShieldCheck, desc: "Final locking", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]", lightBg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/20" },
        { id: 3, title: "Paid", icon: Zap, desc: "Dispatch", color: "text-emerald-600", bg: "bg-emerald-500", lightBg: "bg-emerald-500/10", border: "border-emerald-500/20" }
    ];

    const nextStep = () => {
        if (currentStep < 3) {
            updatePayRun(activeRun.id, { step: currentStep + 1 });
            toast({ title: "Workflow advanced", description: `Moving to ${steps[currentStep + 1].title} phase.` });
        }
    };

    const formatINR = (amt: number) => `₹${amt.toLocaleString("en-IN")}`;

    // Calculate net salary with LOP/OT deductions
    const calculateNetSalary = (emp: any) => {
        const perDaySalary = emp.fixed / 30;
        const lopDeduction = perDaySalary * emp.lop;
        const otAddition = (perDaySalary / 8) * 1.5 * emp.ot; // 1.5x for OT
        return emp.fixed + emp.variable - lopDeduction + otAddition;
    };

    const totalPayroll = employees.reduce((sum, emp) => sum + calculateNetSalary(emp), 0);
    const verifiedCount = employees.filter(e => e.status === "Verified").length;
    const approvedCount = employees.filter(e => e.approved).length;

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === employees.length ? [] : employees.map(e => e.id));
    };

    const handleBulkApprove = () => {
        setIsBulkProcessing(true);
        setTimeout(() => {
            setEmployees(prev => prev.map(emp =>
                selectedIds.includes(emp.id) ? { ...emp, approved: true, status: "Verified" } : emp
            ));
            setSelectedIds([]);
            setIsBulkProcessing(false);
            toast({ title: "Bulk approval complete", description: `${selectedIds.length} employees approved.` });
        }, 1500);
    };

    const handleBulkReject = () => {
        setIsBulkProcessing(true);
        setTimeout(() => {
            setEmployees(prev => prev.map(emp =>
                selectedIds.includes(emp.id) ? { ...emp, approved: false, status: "Pending review" } : emp
            ));
            setSelectedIds([]);
            setIsBulkProcessing(false);
            toast({ title: "Bulk rejection complete", description: `${selectedIds.length} employees marked for review.` });
        }, 1500);
    };

    const handleFinalizeCycle = () => {
        if (approvedCount < employees.length) {
            toast({
                title: "Cannot finalize",
                description: `${employees.length - approvedCount} employees pending approval.`,
                variant: "destructive"
            });
            return;
        }
        setIsFinalized(true);
        setIsFinalizeDialogOpen(false);
        toast({ title: "Cycle finalized", description: "Payroll has been locked. No further edits allowed." });
    };

    const handleExport = (format: string) => {
        toast({ title: `Exporting as ${format}`, description: "Download will begin shortly..." });
        setIsExportDialogOpen(false);
    };

    const handleSaveCorrection = () => {
        if (selectedEmployee) {
            setEmployees(prev => prev.map(emp =>
                emp.id === selectedEmployee.id ? selectedEmployee : emp
            ));
            toast({ title: "Correction saved", description: "Employee data has been updated." });
            setIsCorrectionOpen(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans" style={{ zoom: 0.72 }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Salary processing</h1>
                        <p className="text-xs font-medium text-slate-500 italic">{activeRun.month} • Control center</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setIsExportDialogOpen(true)} className="h-10 border-slate-200 rounded-lg font-semibold text-xs gap-2 px-4 hover:text-[#8B5CF6] transition-all border-none bg-slate-50/50">
                        <Download size={14} /> Export data
                    </Button>
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-semibold text-xs gap-2 px-4 hover:text-[#8B5CF6] transition-all border-none bg-slate-50/50">
                        <History size={14} /> Audit logs
                    </Button>
                    {!isFinalized && currentStep < 3 && (
                        <Button onClick={nextStep} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none transition-all hover:scale-[1.02]">
                            Next stage: {steps[currentStep + 1]?.title} <ChevronRight size={14} className="ml-1" />
                        </Button>
                    )}
                    {!isFinalized && currentStep === 2 && (
                        <Button onClick={() => setIsFinalizeDialogOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-emerald-100 border-none transition-all hover:scale-[1.02]">
                            <Lock size={14} className="mr-2" /> Finalize cycle
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 space-y-8">
                    {/* Process Timeline Stepper */}
                    <div className="relative">
                        <div className="grid grid-cols-4 gap-4">
                            {steps.map((step, idx) => {
                                const isPast = currentStep > step.id;
                                const isCurrent = currentStep === step.id;
                                const isUpcoming = currentStep < step.id;

                                return (
                                    <div key={step.id} className="relative">
                                        <Card className={`rounded-2xl border ${isCurrent ? `${step.border} ${step.lightBg} shadow-md` : isPast ? 'border-emerald-500/20 bg-emerald-50' : 'border-slate-100 bg-white'} overflow-hidden transition-all hover:shadow-md`}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${isCurrent ? `${step.bg} text-white` : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        {isPast ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
                                                    </div>
                                                    <Badge className={`text-[9px] font-bold px-2 py-1 ${isCurrent ? `${step.bg} text-white` : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        Step {step.id + 1}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className={`text-sm font-bold tracking-tight ${isCurrent ? 'text-slate-900' : isPast ? 'text-emerald-700' : 'text-slate-400'}`}>{step.title}</h4>
                                                    <p className="text-[10px] font-medium text-slate-400 italic">{step.desc}</p>
                                                </div>
                                                {isCurrent && (
                                                    <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full ${step.bg}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "60%" }}
                                                            transition={{ duration: 1 }}
                                                        />
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                        {idx < steps.length - 1 && (
                                            <div className={`absolute top-1/2 -right-2 w-4 h-0.5 ${isPast ? 'bg-emerald-500' : 'bg-slate-200'} z-10`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: "Total payroll", val: formatINR(Math.round(totalPayroll)), metric: "This cycle", icon: Wallet, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", border: "border-[#8B5CF6]/20" },
                            { label: "Employees", val: employees.length, metric: `${verifiedCount} verified`, icon: Users, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                            { label: "Approved", val: approvedCount, metric: `${employees.length - approvedCount} pending`, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                            { label: "Avg salary", val: formatINR(Math.round(totalPayroll / employees.length)), metric: "Per employee", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" }
                        ].map((stat, i) => (
                            <Card key={i} className={`rounded-2xl border ${stat.border} ${stat.bg} shadow-sm overflow-hidden transition-all hover:shadow-md`}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-semibold text-slate-500">{stat.label}</p>
                                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
                                            <p className="text-[10px] font-medium text-slate-400 italic">{stat.metric}</p>
                                        </div>
                                        <div className={`h-12 w-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm ${stat.color}`}>
                                            <stat.icon size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                        {/* Center Stage Table */}
                        <div className="xl:col-span-9 space-y-6">
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardHeader className="p-4 border-b border-slate-50">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-bold text-slate-800">Employee master board</CardTitle>
                                            <CardDescription className="text-xs font-semibold text-slate-400 tabular-nums italic">{employees.length} employees • {approvedCount} approved</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="relative w-64">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <Input placeholder="Search employee..." className="pl-9 h-9 bg-slate-50 border-none rounded-lg text-xs font-medium" />
                                            </div>
                                            <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-100 text-slate-500 font-semibold text-[10px]"><Filter size={14} className="mr-2" /> Filter</Button>
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
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-bold text-slate-500">{selectedIds.length} employees selected</span>
                                                    <div className="h-4 w-px bg-slate-200" />
                                                    <Button onClick={handleBulkApprove} disabled={isBulkProcessing || isFinalized} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-4 rounded-lg shadow-sm border-none transition-all">
                                                        {isBulkProcessing ? <Activity size={12} className="animate-spin mr-2" /> : <CheckCircle2 size={12} className="mr-2" />} Bulk approve
                                                    </Button>
                                                    <Button onClick={handleBulkReject} disabled={isBulkProcessing || isFinalized} className="h-8 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold px-4 rounded-lg shadow-sm border-none transition-all">
                                                        <X size={12} className="mr-2" /> Bulk reject
                                                    </Button>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="text-slate-400 hover:text-rose-500 font-bold text-[10px]">Clear</Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <Table>
                                        <TableHeader className="bg-slate-50/50 hover:bg-slate-50/50 font-sans">
                                            <TableRow className="border-slate-100">
                                                <TableHead className="pl-8 w-12">
                                                    <Checkbox
                                                        checked={selectedIds.length > 0 && selectedIds.length === employees.length}
                                                        onCheckedChange={toggleSelectAll}
                                                        disabled={isFinalized}
                                                        className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                    />
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-400 h-10">Employee details</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-400 h-10">Fixed pay</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-400 h-10">Variable/PT</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-400 h-10">LOP/OT</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-400 h-10">Net salary</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-400 h-10">Status</TableHead>
                                                <TableHead className="text-right pr-8 text-[11px] font-bold text-slate-400 h-10">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {employees.map((emp) => (
                                                <TableRow key={emp.id} className={`group hover:bg-slate-50/50 border-slate-50 ${selectedIds.includes(emp.id) ? 'bg-[#8B5CF6]/5' : ''}`}>
                                                    <TableCell className="pl-8 py-2">
                                                        <Checkbox
                                                            checked={selectedIds.includes(emp.id)}
                                                            onCheckedChange={() => toggleSelect(emp.id)}
                                                            disabled={isFinalized}
                                                            className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-2 font-sans">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500">{emp.id.slice(-3)}</div>
                                                            <div>
                                                                <span className="text-sm font-bold text-slate-900 block leading-none">{emp.name}</span>
                                                                <span className="text-[10px] font-semibold text-slate-400 mt-1 block italic">{emp.dept} • {emp.id}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm font-bold text-slate-700 tracking-tight font-sans">{formatINR(emp.fixed)}</TableCell>
                                                    <TableCell className="text-sm font-bold text-emerald-600 tracking-tight font-sans">+{formatINR(emp.variable)}</TableCell>
                                                    <TableCell className="text-xs font-semibold text-slate-500 font-sans">
                                                        <div className="flex items-center gap-3 tabular-nums">
                                                            <span className={emp.lop > 0 ? 'text-rose-500' : ''}>LOP: {emp.lop}d</span>
                                                            <span className={emp.ot > 0 ? 'text-indigo-500' : ''}>OT: {emp.ot}h</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm font-bold text-slate-900 tracking-tight font-sans">{formatINR(Math.round(calculateNetSalary(emp)))}</TableCell>
                                                    <TableCell className="font-sans">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={`bg-white border-none text-[9px] font-bold shadow-sm h-6 px-3 ${emp.status === 'Verified' ? 'text-emerald-500' : 'text-amber-500'}`}>{emp.status}</Badge>
                                                            {emp.approved && <CheckCircle2 size={14} className="text-emerald-500" />}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-8">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={isFinalized}
                                                            className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-[#8B5CF6] hover:bg-slate-100"
                                                            onClick={() => { setSelectedEmployee(emp); setIsCorrectionOpen(true); }}
                                                        >
                                                            <Edit3 size={14} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Control Deck */}
                        <div className="xl:col-span-3 space-y-6">
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4">
                                <h4 className="text-sm font-bold text-slate-900 mb-4">Execution control</h4>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-4">
                                        <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] font-semibold text-orange-700 leading-relaxed italic">Attendance sync is 92% complete. 3 employees data missing.</p>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                                            <span>Validation check</span>
                                            <span className="text-emerald-500">Pass</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                                            <span>Statutory sync</span>
                                            <span className="text-amber-500">Pending</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                                            <span>Minimum wage</span>
                                            <span className="text-emerald-500">Compliant</span>
                                        </div>
                                        <Button className="w-full h-11 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 mt-4 border-none transition-all">Initialize bulk sync</Button>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-4 border-dashed">
                                <h4 className="text-sm font-bold text-[#8B5CF6] mb-3">Bulk operations</h4>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full h-9 border-slate-200 bg-white/80 rounded-xl font-semibold text-[10px] text-slate-500 hover:bg-white">
                                        <FileText size={14} className="mr-2" /> Import CSV
                                    </Button>
                                    <Button variant="outline" className="w-full h-9 border-slate-200 bg-white/80 rounded-xl font-semibold text-[10px] text-slate-500 hover:bg-white">
                                        <Calculator size={14} className="mr-2" /> Auto calc bonus
                                    </Button>
                                    <Button variant="outline" onClick={() => setIsExportDialogOpen(true)} className="w-full h-9 border-slate-200 bg-white/80 rounded-xl font-semibold text-[10px] text-slate-500 hover:bg-white">
                                        <Download size={14} className="mr-2" /> Generate bank file
                                    </Button>
                                </div>
                            </Card>

                            {isFinalized && (
                                <Card className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                            <Lock size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-emerald-700">Cycle finalized</h4>
                                            <p className="text-[10px] font-medium text-emerald-600 italic">No edits allowed</p>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Finalize Dialog */}
            <Dialog open={isFinalizeDialogOpen} onOpenChange={setIsFinalizeDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <DialogHeader className="space-y-2">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                            <Lock size={24} className="text-emerald-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-slate-900">Finalize payroll cycle?</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            This action will lock the payroll for {activeRun.month}. No further edits will be allowed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-slate-600">Total employees</span>
                                <span className="font-bold text-slate-900">{employees.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-slate-600">Approved</span>
                                <span className="font-bold text-emerald-600">{approvedCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-slate-600">Total payout</span>
                                <span className="font-bold text-slate-900">{formatINR(Math.round(totalPayroll))}</span>
                            </div>
                        </div>
                        {approvedCount < employees.length && (
                            <div className="p-4 bg-rose-50 rounded-xl flex items-start gap-3">
                                <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                <p className="text-xs font-semibold text-rose-700">{employees.length - approvedCount} employees are not approved yet.</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex gap-3">
                        <Button variant="ghost" onClick={() => setIsFinalizeDialogOpen(false)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                        <Button onClick={handleFinalizeCycle} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 font-bold shadow-lg shadow-emerald-100 border-none">
                            <Lock size={14} className="mr-2" /> Finalize & lock
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Export Dialog */}
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]">
                    <DialogHeader className="space-y-2">
                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                            <Download size={24} className="text-blue-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-slate-900">Export payroll data</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            Choose export format for {activeRun.month} payroll data
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
                        <Button onClick={() => handleExport('Bank File')} className="w-full h-12 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-xl font-bold justify-start px-6 border-none">
                            <Wallet size={18} className="mr-3" />
                            <div className="text-left">
                                <div className="text-sm">Bank transfer file</div>
                                <div className="text-[10px] font-medium opacity-80">NEFT/RTGS format</div>
                            </div>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Side sheet correction */}
            <Sheet open={isCorrectionOpen} onOpenChange={setIsCorrectionOpen}>
                <SheetContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden font-sans">
                    <div className="h-full flex flex-col bg-white overflow-hidden text-start">
                        <div className="bg-slate-950 p-10 text-white relative">
                            <Badge className="bg-[#8B5CF6] text-white border-none font-bold text-[10px] px-3 mb-4">Terminal corrective mode</Badge>
                            <SheetTitle className="text-2xl font-bold text-white tracking-tight leading-none mt-2">{selectedEmployee?.name}</SheetTitle>
                            <SheetDescription className="text-slate-500 font-medium text-[11px] mt-2 italic">Employee ID: {selectedEmployee?.id}</SheetDescription>
                        </div>
                        <ScrollArea className="flex-1 p-10">
                            <div className="space-y-8 text-start">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-4">Disbursement overrides</h4>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-semibold text-slate-500">Fixed salary</Label>
                                            <Input
                                                type="number"
                                                value={selectedEmployee?.fixed}
                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, fixed: parseFloat(e.target.value) })}
                                                disabled={isFinalized}
                                                className="h-12 bg-slate-50 border-none rounded-xl font-bold text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-semibold text-slate-500">Variable / Bonus</Label>
                                            <Input
                                                type="number"
                                                value={selectedEmployee?.variable}
                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, variable: parseFloat(e.target.value) })}
                                                disabled={isFinalized}
                                                className="h-12 bg-slate-50 border-none rounded-xl font-bold text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-semibold text-slate-500">OT hours</Label>
                                            <Input
                                                type="number"
                                                value={selectedEmployee?.ot}
                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, ot: parseFloat(e.target.value) })}
                                                disabled={isFinalized}
                                                className="h-12 bg-slate-50 border-none rounded-xl font-bold text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-4">Attendance reconciliation</h4>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-slate-500">LOP days</Label>
                                        <Input
                                            type="number"
                                            value={selectedEmployee?.lop}
                                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, lop: parseFloat(e.target.value) })}
                                            disabled={isFinalized}
                                            className="h-12 bg-slate-50 border-none rounded-xl font-bold text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-blue-900">Calculated net salary</span>
                                        <span className="text-lg font-bold text-blue-600">{selectedEmployee && formatINR(Math.round(calculateNetSalary(selectedEmployee)))}</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                            <Button
                                onClick={handleSaveCorrection}
                                disabled={isFinalized}
                                className="w-full h-14 bg-slate-950 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 border-none hover:scale-[1.02] transition-transform"
                            >
                                Save corrections
                            </Button>
                            <Button variant="ghost" className="w-full h-12 text-slate-400 font-bold text-xs hover:text-rose-500" onClick={() => setIsCorrectionOpen(false)}>Discard changes</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

// Internal icon for editing
const Edit3 = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
)

export default SalaryProcessingPage;
