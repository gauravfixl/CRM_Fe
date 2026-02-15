"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Coins, UserCheck, Settings, CheckCircle2, MoreHorizontal, Download, Search, TrendingUp, Clock, PieChart, ShieldCheck, Plus, History, PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_EMPLOYEES = [
    { id: "EMP001", name: "Rajesh Kumar", dept: "Night-Shift Ops", shift: "Night Shift", rate: 500, volume: 12, status: "Verified" },
    { id: "EMP005", name: "Vikram Singh", dept: "Support", shift: "Night Shift", rate: 500, volume: 10, status: "Verified" },
    { id: "EMP012", name: "Suresh Raina", dept: "Logistics", shift: "Evening Shift", rate: 300, volume: 15, status: "Pending" },
    { id: "EMP024", name: "Amit Shah", dept: "Security", shift: "Night Shift", rate: 500, volume: 8, status: "On Hold" }
];

const INITIAL_RULES = [
    { id: "RULE-01", shiftName: "Night Shift", startTime: "10:00 PM", amount: 500, frequency: "Per Shift", activePolicies: 4 },
    { id: "RULE-02", shiftName: "Evening Shift", startTime: "06:00 PM", amount: 300, frequency: "Per Shift", activePolicies: 2 },
    { id: "RULE-03", shiftName: "Early Morning", startTime: "04:00 AM", amount: 200, frequency: "Per Shift", activePolicies: 1 }
];

const ShiftAllowancePage = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("eligible-employees");
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog states
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [isTimesheetOpen, setIsTimesheetOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [editingRule, setEditingRule] = useState<any>(null);

    // Dynamic Lists
    const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);

    const [rules, setRules] = useState(INITIAL_RULES);

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.dept.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Actions
    const handleVerify = (id: string) => {
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'Verified' } : e));
        toast({ title: "Authorized", description: "Personnel eligibility has been verified." });
    };

    const handleHoldStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "On Hold" ? "Pending" : "On Hold";
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
        toast({
            title: newStatus === "On Hold" ? "Payout Paused" : "Payout Resumed",
            description: `Compensation cycle for this employee has been ${newStatus.toLowerCase()}.`,
            variant: newStatus === "On Hold" ? "destructive" : "default"
        });
    };

    const handleDeleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
        toast({ title: "Rule Archived", description: "Allowance policy has been deactivated.", variant: "destructive" });
    };

    const handleEditRule = (rule: any) => {
        setEditingRule(rule);
        setIsRuleModalOpen(true);
    };

    const handleSaveRule = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const ruleData = {
            shiftName: formData.get('shiftName') as string,
            amount: Number(formData.get('amount')) || 0,
            startTime: formData.get('startTime') as string,
            frequency: "Per Shift",
            activePolicies: editingRule?.activePolicies || 0
        };

        if (editingRule) {
            setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...ruleData } : r));
            toast({ title: "Rule Updated", description: "Shift allowance logic has been modified." });
        } else {
            const newRule = { ...ruleData, id: `RULE-0${rules.length + 1}` };
            setRules(prev => [...prev, newRule]);
            toast({ title: "Rule Created", description: "New global allowance policy is now active." });
        }
        setIsRuleModalOpen(false);
        setEditingRule(null);
    };

    const handleExportBatch = (batchId: string) => {
        toast({ title: "Compiling Ledger", description: "Generating secure payroll transmission file..." });
        setTimeout(() => {
            const headers = ["ID", "Personnel", "Department", "Shift", "Rate", "Volume", "Total"];
            const csv = [
                headers.join(","),
                ...employees.map(e => [e.id, e.name, e.dept, e.shift, e.rate, e.volume, e.rate * e.volume].join(","))
            ].join("\n");
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${batchId}_Consolidated_Allowance.csv`;
            a.click();
            toast({ title: "Download Ready", description: "Encrypted payroll data saved to local storage." });
        }, 1200);
    };

    const openTimesheet = (emp: any) => {
        setSelectedEmployee(emp);
        setIsTimesheetOpen(true);
    };

    return (
        <div className="flex-1 bg-[#fcfdff] overflow-x-hidden overflow-y-auto min-h-screen">
            <div style={{ zoom: '0.6' } as React.CSSProperties} className="p-12 space-y-6">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900">Allowance Engine</h2>
                        <p className="text-slate-500 font-bold text-lg mt-2 tracking-tight">Financial oversight for shift-weighted labor compensation.</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="relative group min-w-[350px]">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#CB9DF0] transition-all" size={24} />
                            <Input
                                className="h-16 pl-16 rounded-[2rem] bg-white border-slate-100 font-bold text-lg shadow-sm focus:ring-4 focus:ring-purple-50 transition-all"
                                placeholder="Search by personnel or department..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] h-16 px-10 rounded-[2rem] font-bold shadow-2xl shadow-purple-100 text-lg"
                            onClick={() => { setEditingRule(null); setIsRuleModalOpen(true); }}
                        >
                            <Plus className="mr-3 h-6 w-6" /> Create rule
                        </Button>
                    </div>
                </div>

                {/* Analytics */}
                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[3.5rem] bg-emerald-100 p-12 overflow-hidden relative group">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-sm font-extrabold text-slate-400">Gross payout</p>
                                <div className="h-12 w-12 rounded-2xl bg-white text-emerald-500 flex items-center justify-center shadow-sm">
                                    <Coins size={24} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-4xl font-bold text-slate-900 tracking-tighter">₹ 2.45L</h4>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold px-3 py-1 rounded-lg">
                                        <TrendingUp size={12} className="mr-1" /> +12.4%
                                    </Badge>
                                    <p className="text-xs font-bold text-slate-400">vs last cycle</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-emerald-100 rounded-full blur-3xl opacity-40 group-hover:scale-125 transition-transform" />
                    </Card>

                    <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[3.5rem] bg-purple-100 p-12 overflow-hidden relative group">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-sm font-extrabold text-slate-400">Staff coverage</p>
                                <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <UserCheck size={24} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-4xl font-bold text-slate-900 tracking-tighter">84 Personnel</h4>
                                <p className="text-sm font-bold text-slate-500 opacity-80">Active across {rules.length} logical allowance hierarchies.</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-12 opacity-5 text-purple-900">
                            <PieChart size={180} />
                        </div>
                    </Card>

                    <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[3.5rem] bg-amber-100 p-12 overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-sm font-extrabold text-slate-400">System status</p>
                                <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-4xl font-bold text-slate-900 tracking-tighter">Synced</h4>
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <p className="text-xs font-bold text-slate-400">Last ledger update: 10:42 AM IST</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
                    <TabsList className="bg-slate-100/50 p-2 rounded-3xl gap-2 h-auto flex justify-start items-center max-w-fit border border-slate-200/50 shadow-inner">
                        {["Eligible employees", "Allowance rules", "Batch summary"].map((tab) => (
                            <TabsTrigger
                                key={tab.toLowerCase().replace(" ", "-")}
                                value={tab.toLowerCase().replace(" ", "-")}
                                className="px-10 py-5 rounded-2xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-[#6366f1] data-[state=active]:shadow-2xl transition-all"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Eligible Employees */}
                    <TabsContent value="eligible-employees" className="pt-2">
                        <Card className="shadow-3xl shadow-slate-200/50 border-none rounded-[4rem] bg-white overflow-hidden">
                            <CardHeader className="p-12 border-b border-slate-50 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">Employee Eligibility Ledger</CardTitle>
                                    <CardDescription className="text-lg font-bold text-slate-400 mt-2">Active personnel qualified for shift-based financial incentives.</CardDescription>
                                </div>
                                <Button className="bg-[#10b981] hover:bg-[#059669] h-16 px-10 rounded-2xl font-bold shadow-2xl shadow-emerald-100 text-white transition-all hover:scale-105" onClick={() => toast({ title: "Sync Triggered", description: "Ledger is being reconciled with shift rosters." })}>
                                    <UserCheck className="mr-3 h-5 w-5" /> Sync rosters
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-slate-100">
                                            <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Personnel & Dept</th>
                                            <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Policy variant</th>
                                            <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Unit rate</th>
                                            <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400 text-center">Volume</th>
                                            <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Estimated payout</th>
                                            <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400 text-right">Governance</th>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEmployees.map((emp) => (
                                            <motion.tr key={emp.id} layout className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="p-6">
                                                    <div className="font-bold text-slate-900 text-xl tracking-tight leading-none mb-2">{emp.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400">{emp.id}</span>
                                                        <div className="h-1 w-1 bg-slate-300 rounded-full" />
                                                        <span className="text-[10px] font-bold text-indigo-400 uppercase">{emp.dept}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-6">
                                                    <Badge className="bg-indigo-50 text-indigo-700 border-none font-bold px-5 py-2 rounded-xl text-[10px] tracking-widest font-sans uppercase">{emp.shift}</Badge>
                                                </TableCell>
                                                <TableCell className="p-6 font-bold text-slate-600 text-lg">₹ {emp.rate}</TableCell>
                                                <TableCell className="p-6 text-center">
                                                    <div className="bg-slate-50 w-20 h-10 flex items-center justify-center rounded-xl mx-auto border border-slate-100 font-bold text-slate-700">
                                                        {emp.volume}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-6">
                                                    <div className="font-bold text-slate-900 text-2xl tracking-tighter">₹ {(emp.rate * emp.volume).toLocaleString()}</div>
                                                    {emp.status === "On Hold" && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-widest">Transaction Held</p>}
                                                </TableCell>
                                                <TableCell className="p-6 text-right">
                                                    <div className="flex justify-end items-center gap-3">
                                                        {emp.status === "Pending" ? (
                                                            <Button className="h-10 px-6 bg-amber-500 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-amber-100 transition-all" onClick={() => handleVerify(emp.id)}>Verify</Button>
                                                        ) : emp.status === "Verified" ? (
                                                            <div className="h-10 w-10 flex items-center justify-center text-emerald-500 bg-emerald-50 rounded-xl shadow-inner"><CheckCircle2 size={24} /></div>
                                                        ) : (
                                                            <div className="h-10 w-10 flex items-center justify-center text-rose-500 bg-rose-50 rounded-xl shadow-inner"><Clock size={24} /></div>
                                                        )}

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-10 w-10 rounded-xl text-slate-400 hover:bg-slate-100">
                                                                    <MoreHorizontal size={20} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-xl p-2 font-bold min-w-48">
                                                                <DropdownMenuItem className="rounded-xl px-4 py-3 hover:bg-slate-50 cursor-pointer" onClick={() => openTimesheet(emp)}>
                                                                    <History size={16} className="mr-3" /> View full timesheet
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-xl px-4 py-3 text-rose-500 hover:bg-rose-50 cursor-pointer" onClick={() => handleHoldStatus(emp.id, emp.status)}>
                                                                    {emp.status === "On Hold" ? <PlayCircle size={16} className="mr-3" /> : <PauseCircle size={16} className="mr-3" />}
                                                                    {emp.status === "On Hold" ? "Resume payout" : "Place payout on hold"}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Allowance Rules */}
                    <TabsContent value="allowance-rules" className="space-y-10 pt-4">
                        <div className="grid gap-10 md:grid-cols-3">
                            {rules.map((rule) => (
                                <Card key={rule.id} className="shadow-2xl shadow-slate-200/50 border-none rounded-[4rem] bg-white overflow-hidden p-10 group hover:scale-[1.02] transition-all cursor-pointer">
                                    <CardHeader className="p-0 pb-8 border-b border-slate-50 relative">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">{rule.shiftName}</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-indigo-50 text-[#6366f1] border-none font-bold px-4 py-2 rounded-xl text-[10px] tracking-widest">{rule.startTime}</Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 rounded-lg text-slate-300 hover:bg-slate-100 p-0">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-xl p-2 font-bold min-w-40">
                                                        <DropdownMenuItem className="rounded-xl p-3 cursor-pointer hover:bg-indigo-50 text-indigo-600" onClick={() => handleEditRule(rule)}>
                                                            <Settings size={16} className="mr-2" /> Modify Rule
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl p-3 cursor-pointer hover:bg-rose-50 text-rose-500" onClick={() => handleDeleteRule(rule.id)}>
                                                            <Trash2 size={16} className="mr-2" /> Archive Rule
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0 pt-8 space-y-6">
                                        <div className="flex items-center justify-between bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payout Unit</span>
                                            <span className="font-bold text-slate-900 text-3xl tracking-tighter">₹ {rule.amount}</span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-bold text-slate-400">Calculation logic</span>
                                                <span className="font-bold text-slate-700">{rule.frequency}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-bold text-slate-400">Linked policies</span>
                                                <span className="font-bold text-[#6366f1]">{rule.activePolicies} Active</span>
                                            </div>
                                        </div>
                                        <div className="pt-8 flex gap-4">
                                            <Button
                                                variant="ghost"
                                                className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 p-0 text-slate-400 hover:text-indigo-500"
                                                onClick={() => { setEditingRule(rule); setIsRuleModalOpen(true); }}
                                            >
                                                <Settings size={22} />
                                            </Button>
                                            <Button
                                                className="flex-1 rounded-2xl font-bold h-12 bg-slate-900 text-white hover:bg-slate-800 transition-all border-none"
                                                onClick={() => { setEditingRule(rule); setIsRuleModalOpen(true); }}
                                            >
                                                Modify rule logic
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Batch Summary */}
                    <TabsContent value="batch-summary" className="pt-2">
                        <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[4rem] bg-white overflow-hidden">
                            <CardHeader className="p-12 border-b border-slate-50">
                                <CardTitle className="text-3xl font-bold text-slate-900">Archive & Payroll Batches</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-slate-100">
                                            <th className="p-6 font-bold text-xs tracking-widest text-slate-400 uppercase">Batch designation</th>
                                            <th className="p-6 font-bold text-xs tracking-widest text-slate-400 uppercase">Cycle</th>
                                            <th className="p-6 font-bold text-xs tracking-widest text-slate-400 uppercase">Staff total</th>
                                            <th className="p-6 font-bold text-xs tracking-widest text-slate-400 uppercase">Financial weight</th>
                                            <th className="p-6 font-bold text-xs tracking-widest text-slate-400 uppercase">Execution</th>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { id: "BATCH-2024-JAN", month: "January 2024", staff: 84, amount: "2,45,000", status: "Ready" },
                                            { id: "BATCH-2023-DEC", month: "December 2023", staff: 78, amount: "2,18,500", status: "Processed" }
                                        ].map((batch) => (
                                            <TableRow key={batch.id} className="border-slate-50 group hover:bg-slate-50/30 transition-all">
                                                <TableCell className="p-6 font-bold text-slate-400 text-xs tracking-[0.2em] font-sans">{batch.id}</TableCell>
                                                <TableCell className="p-6 font-bold text-slate-900 text-lg">{batch.month}</TableCell>
                                                <TableCell className="p-6 font-bold text-slate-600">{batch.staff} Qualified personnel</TableCell>
                                                <TableCell className="p-6 font-bold text-slate-900 text-2xl tracking-tighter">₹ {batch.amount}</TableCell>
                                                <TableCell className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        {batch.status === "Ready" ? (
                                                            <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold px-5 py-2 rounded-xl text-[10px] tracking-widest uppercase">Validated & Ready</Badge>
                                                        ) : (
                                                            <Badge className="bg-slate-100 text-slate-400 border-none font-bold px-5 py-2 rounded-xl text-[10px] tracking-widest uppercase">Archive Node</Badge>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all text-indigo-500"
                                                            onClick={() => handleExportBatch(batch.id)}
                                                        >
                                                            <Download size={22} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Rule Modal (Create/Edit) */}
                <Dialog open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
                    <DialogContent className="sm:max-w-4xl rounded-[3rem] border-2 border-slate-200 p-12 bg-white shadow-3xl" style={{ zoom: '0.75' } as React.CSSProperties}>
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold tracking-tight">{editingRule ? "Modify Allowance Rule" : "Create Global Policy"}</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-lg">Define the financial weight for shift transitions.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSaveRule} className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                            <div className="grid gap-3">
                                <Label className="font-bold ml-2 text-slate-600">Shift variant identifier</Label>
                                <Input name="shiftName" defaultValue={editingRule?.shiftName} required className="h-16 rounded-2xl bg-white border-2 border-slate-300 px-6 font-bold text-xl" placeholder="e.g. Late Night Shift" />
                            </div>
                            <div className="grid gap-3">
                                <Label className="font-bold ml-2 text-slate-600">Unit rate (₹)</Label>
                                <Input name="amount" type="number" defaultValue={editingRule?.amount} required className="h-16 rounded-2xl bg-white border-2 border-slate-300 px-6 font-bold text-xl" />
                            </div>
                            <div className="grid gap-3">
                                <Label className="font-bold ml-2 text-slate-600">Activation time</Label>
                                <Input name="startTime" defaultValue={editingRule?.startTime} required className="h-16 rounded-2xl bg-white border-2 border-slate-300 px-6 font-bold text-xl" placeholder="10:00 PM" />
                            </div>

                            <DialogFooter className="mt-4 flex gap-4 col-span-full">
                                <Button type="button" variant="ghost" className="rounded-2xl font-bold text-slate-400 h-16 flex-1 text-lg" onClick={() => setIsRuleModalOpen(false)}>Discard</Button>
                                <Button type="submit" className="bg-slate-900 h-16 rounded-2xl font-bold text-white shadow-xl shadow-slate-200 flex-1 text-lg">
                                    {editingRule ? "Commit changes" : "Deploy policy"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Timesheet Insight Modal */}
                <Dialog open={isTimesheetOpen} onOpenChange={setIsTimesheetOpen}>
                    <DialogContent className="max-w-3xl rounded-[3rem] border-none p-12 bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                    <History />
                                </div>
                                Compensation Evidence: {selectedEmployee?.name}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-10 py-10">
                            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Policy variant</p>
                                    <Badge className="bg-indigo-900 text-white border-none px-4 py-2 rounded-xl text-xs font-bold">{selectedEmployee?.shift}</Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total accrued</p>
                                    <p className="text-3xl font-bold text-slate-900">₹ {((selectedEmployee?.rate || 0) * (selectedEmployee?.volume || 0)).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-lg font-bold text-slate-900">Shift Log Breakdown (Current Cycle)</p>
                                <div className="border border-slate-50 rounded-[2rem] overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="border-slate-50">
                                                <th className="p-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Date</th>
                                                <th className="p-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest">In Range</th>
                                                <th className="p-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Duration</th>
                                                <th className="p-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest text-right">Credit</th>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[...Array(3)].map((_, i) => (
                                                <TableRow key={i} className="border-slate-50">
                                                    <TableCell className="p-6 font-bold text-slate-600">Jan {20 + i}, 2026</TableCell>
                                                    <TableCell className="p-6 font-bold text-slate-600">10:00 PM &ndash; 06:00 AM</TableCell>
                                                    <TableCell className="p-6 font-bold text-slate-600">8h 00m</TableCell>
                                                    <TableCell className="p-6 font-bold text-emerald-500 text-right">₹ {selectedEmployee?.rate}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-xl" onClick={() => setIsTimesheetOpen(false)}>
                                Securely close ledger
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div >
    );
};

export default ShiftAllowancePage;
