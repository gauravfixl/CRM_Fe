"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Coins, UserCheck, Settings, CheckCircle2, MoreHorizontal, Download, Search, TrendingUp, Clock, PieChart, ShieldCheck, Plus, History, PauseCircle, PlayCircle, Trash2, Pencil, Eye, FileCode2, FolderKanban } from "lucide-react";
import { Select as SelectUI, SelectContent as SelectContentUI, SelectItem as SelectItemUI, SelectTrigger as SelectTriggerUI, SelectValue as SelectValueUI } from "@/shared/components/ui/select";
import { useToast } from "@/shared/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
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

interface PayCode {
    id: string;
    name: string;
    code: string;
    formula: string;
    frequency: "Lump Sum" | "Per Shift" | "Per Hour";
    lastUpdated: string;
    updatedBy: string;
}

interface Policy {
    id: string;
    name: string;
    payCodeId: string;
    department: string;
    employees: number;
    createdOn: string;
    lastUpdated: string;
    updatedBy: string;
    isActive: boolean;
}

const INITIAL_PAY_CODES: PayCode[] = [
    { id: "PC-01", name: "General", code: "GC", formula: "[Gross]*0.1", frequency: "Lump Sum", lastUpdated: "2026-03-15", updatedBy: "HR Admin" },
    { id: "PC-02", name: "Night Shift India", code: "NIPC", formula: "[Basic]*0.2", frequency: "Lump Sum", lastUpdated: "2026-03-28", updatedBy: "HR Admin" },
    { id: "PC-03", name: "Night Shift US", code: "NIUS", formula: "[Basic]*0.4", frequency: "Lump Sum", lastUpdated: "2026-03-28", updatedBy: "HR Admin" },
];

const INITIAL_POLICIES: Policy[] = [
    { id: "POL-01", name: "Evening Shift India", payCodeId: "PC-01", department: "Operations", employees: 12, createdOn: "2025-08-01", lastUpdated: "2026-03-15", updatedBy: "HR Admin", isActive: true },
    { id: "POL-02", name: "General Shift", payCodeId: "PC-01", department: "All", employees: 48, createdOn: "2025-01-10", lastUpdated: "2025-12-20", updatedBy: "HR Admin", isActive: true },
    { id: "POL-03", name: "Night Shift India", payCodeId: "PC-02", department: "Support", employees: 18, createdOn: "2025-06-15", lastUpdated: "2026-03-28", updatedBy: "HR Admin", isActive: true },
    { id: "POL-04", name: "Noon Shift India", payCodeId: "PC-01", department: "Operations", employees: 6, createdOn: "2025-09-12", lastUpdated: "2026-01-05", updatedBy: "HR Admin", isActive: false },
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

    // Pay Codes state
    const [payCodes, setPayCodes] = useState<PayCode[]>(INITIAL_PAY_CODES);
    const [isPayCodeDialogOpen, setIsPayCodeDialogOpen] = useState(false);
    const [editingPayCode, setEditingPayCode] = useState<PayCode | null>(null);
    const [payCodeForm, setPayCodeForm] = useState<{ name: string; code: string; formula: string; frequency: PayCode["frequency"] }>({
        name: "",
        code: "",
        formula: "",
        frequency: "Lump Sum",
    });
    const [payCodeSearch, setPayCodeSearch] = useState("");

    // Policies state
    const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
    const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
    const [policyForm, setPolicyForm] = useState<{ name: string; payCodeId: string; department: string; isActive: boolean }>({
        name: "",
        payCodeId: "",
        department: "",
        isActive: true,
    });
    const [policySearch, setPolicySearch] = useState("");

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
        const shiftName = (formData.get('shiftName') as string || "").trim();
        const amount = Number(formData.get('amount')) || 0;
        const startTime = (formData.get('startTime') as string || "").trim();

        if (shiftName.length < 3) {
            toast({ title: "Invalid Name", description: "Shift name must be at least 3 characters.", variant: "destructive" });
            return;
        }
        if (!Number.isFinite(amount) || amount <= 0) {
            toast({ title: "Invalid Amount", description: "Unit rate must be a positive number.", variant: "destructive" });
            return;
        }
        if (!/^\d{1,2}:\d{2}\s?(AM|PM)?$/i.test(startTime)) {
            toast({ title: "Invalid Time", description: "Activation time must be HH:MM or HH:MM AM/PM.", variant: "destructive" });
            return;
        }
        const duplicate = rules.some(r => r.shiftName.toLowerCase() === shiftName.toLowerCase() && r.id !== editingRule?.id);
        if (duplicate) {
            toast({ title: "Duplicate Rule", description: "A rule with this shift name already exists.", variant: "destructive" });
            return;
        }

        const ruleData = {
            shiftName,
            amount,
            startTime,
            frequency: "Per Shift",
            activePolicies: editingRule?.activePolicies || 0
        };

        if (editingRule) {
            setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...ruleData } : r));
            toast({ title: "Rule Updated", description: "Shift allowance logic has been modified." });
        } else {
            const newRule = { ...ruleData, id: `RULE-${String(rules.length + 1).padStart(2, "0")}` };
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

    // ==================== Pay Code Handlers ====================
    const openPayCodeDialog = (pc?: PayCode) => {
        if (pc) {
            setEditingPayCode(pc);
            setPayCodeForm({ name: pc.name, code: pc.code, formula: pc.formula, frequency: pc.frequency });
        } else {
            setEditingPayCode(null);
            setPayCodeForm({ name: "", code: "", formula: "", frequency: "Lump Sum" });
        }
        setIsPayCodeDialogOpen(true);
    };

    const handleSavePayCode = () => {
        if (!payCodeForm.name || !payCodeForm.formula) {
            toast({ title: "Incomplete", description: "Pay code name and formula are required.", variant: "destructive" });
            return;
        }
        if (payCodeForm.name.trim().length < 3) {
            toast({ title: "Name Too Short", description: "Pay code name must be at least 3 characters.", variant: "destructive" });
            return;
        }
        const formulaPattern = /^[\[\]a-zA-Z0-9+\-*/(). ]+$/;
        if (!formulaPattern.test(payCodeForm.formula)) {
            toast({ title: "Invalid Formula", description: "Formula may contain only letters, digits, brackets, and math operators (+ - * / . ( ) [ ]).", variant: "destructive" });
            return;
        }
        const openBrackets = (payCodeForm.formula.match(/\[/g) || []).length;
        const closeBrackets = (payCodeForm.formula.match(/\]/g) || []).length;
        if (openBrackets !== closeBrackets) {
            toast({ title: "Unbalanced Brackets", description: "Formula has mismatched [ and ] brackets.", variant: "destructive" });
            return;
        }
        const openParen = (payCodeForm.formula.match(/\(/g) || []).length;
        const closeParen = (payCodeForm.formula.match(/\)/g) || []).length;
        if (openParen !== closeParen) {
            toast({ title: "Unbalanced Parentheses", description: "Formula has mismatched ( and ) parentheses.", variant: "destructive" });
            return;
        }
        const today = new Date().toISOString().split("T")[0];
        const derivedCode = payCodeForm.code || payCodeForm.name.slice(0, 3).toUpperCase().replace(/\s/g, "");

        if (!/^[A-Z0-9]{2,8}$/.test(derivedCode)) {
            toast({ title: "Invalid Code", description: "Identifier code must be 2-8 uppercase letters or digits.", variant: "destructive" });
            return;
        }
        const codeDuplicate = payCodes.some(pc => pc.code === derivedCode && pc.id !== editingPayCode?.id);
        if (codeDuplicate) {
            toast({ title: "Duplicate Code", description: `Identifier "${derivedCode}" is already in use.`, variant: "destructive" });
            return;
        }

        if (editingPayCode) {
            setPayCodes(prev => prev.map(pc => pc.id === editingPayCode.id
                ? { ...pc, ...payCodeForm, code: derivedCode, lastUpdated: today, updatedBy: "HR Admin" }
                : pc
            ));
            toast({ title: "Pay Code Updated", description: `"${payCodeForm.name}" has been modified.` });
        } else {
            const newCode: PayCode = {
                id: `PC-${String(payCodes.length + 1).padStart(2, "0")}`,
                name: payCodeForm.name,
                code: derivedCode,
                formula: payCodeForm.formula,
                frequency: payCodeForm.frequency,
                lastUpdated: today,
                updatedBy: "HR Admin",
            };
            setPayCodes(prev => [...prev, newCode]);
            toast({ title: "Pay Code Created", description: `"${newCode.name}" is now available for policies.` });
        }
        setIsPayCodeDialogOpen(false);
        setEditingPayCode(null);
    };

    const handleDeletePayCode = (pc: PayCode) => {
        const linkedPolicies = policies.filter(p => p.payCodeId === pc.id);
        if (linkedPolicies.length > 0) {
            toast({
                title: "Cannot Delete",
                description: `${linkedPolicies.length} polic${linkedPolicies.length === 1 ? "y uses" : "ies use"} this pay code. Remove those first.`,
                variant: "destructive",
            });
            return;
        }
        const confirmed = window.confirm(`Delete pay code "${pc.name}"? This cannot be undone.`);
        if (!confirmed) return;
        setPayCodes(prev => prev.filter(p => p.id !== pc.id));
        toast({ title: "Pay Code Deleted", description: `"${pc.name}" has been removed.`, variant: "destructive" });
    };

    // ==================== Policy Handlers ====================
    const openPolicyDialog = (pol?: Policy) => {
        if (pol) {
            setEditingPolicy(pol);
            setPolicyForm({ name: pol.name, payCodeId: pol.payCodeId, department: pol.department, isActive: pol.isActive });
        } else {
            setEditingPolicy(null);
            setPolicyForm({ name: "", payCodeId: payCodes[0]?.id ?? "", department: "", isActive: true });
        }
        setIsPolicyDialogOpen(true);
    };

    const handleSavePolicy = () => {
        if (!policyForm.name || !policyForm.payCodeId) {
            toast({ title: "Incomplete", description: "Policy name and pay code are required.", variant: "destructive" });
            return;
        }
        if (policyForm.name.trim().length < 3) {
            toast({ title: "Name Too Short", description: "Policy name must be at least 3 characters.", variant: "destructive" });
            return;
        }
        const dept = (policyForm.department || "").trim();
        if (dept && dept.length < 2) {
            toast({ title: "Invalid Department", description: "Department name must be at least 2 characters (or leave blank for All).", variant: "destructive" });
            return;
        }
        const duplicate = policies.some(p =>
            p.name.trim().toLowerCase() === policyForm.name.trim().toLowerCase() &&
            (p.department || "").toLowerCase() === (dept || "All").toLowerCase() &&
            p.id !== editingPolicy?.id
        );
        if (duplicate) {
            toast({ title: "Duplicate Policy", description: "A policy with this name already exists in that department.", variant: "destructive" });
            return;
        }
        const today = new Date().toISOString().split("T")[0];

        if (editingPolicy) {
            setPolicies(prev => prev.map(p => p.id === editingPolicy.id
                ? { ...p, ...policyForm, lastUpdated: today, updatedBy: "HR Admin" }
                : p
            ));
            toast({ title: "Policy Updated", description: `"${policyForm.name}" has been modified.` });
        } else {
            const newPolicy: Policy = {
                id: `POL-${String(policies.length + 1).padStart(2, "0")}`,
                name: policyForm.name,
                payCodeId: policyForm.payCodeId,
                department: policyForm.department || "All",
                employees: 0,
                createdOn: today,
                lastUpdated: today,
                updatedBy: "HR Admin",
                isActive: policyForm.isActive,
            };
            setPolicies(prev => [...prev, newPolicy]);
            toast({ title: "Policy Created", description: `"${newPolicy.name}" is now active.` });
        }
        setIsPolicyDialogOpen(false);
        setEditingPolicy(null);
    };

    const handleDeletePolicy = (pol: Policy) => {
        const confirmed = window.confirm(`Delete policy "${pol.name}"? This cannot be undone.`);
        if (!confirmed) return;
        setPolicies(prev => prev.filter(p => p.id !== pol.id));
        toast({ title: "Policy Deleted", description: `"${pol.name}" has been removed.`, variant: "destructive" });
    };

    const handleTogglePolicyActive = (pol: Policy) => {
        setPolicies(prev => prev.map(p => p.id === pol.id ? { ...p, isActive: !p.isActive, lastUpdated: new Date().toISOString().split("T")[0] } : p));
        toast({ title: pol.isActive ? "Policy Paused" : "Policy Resumed", description: `"${pol.name}" is now ${pol.isActive ? "inactive" : "active"}.` });
    };

    const filteredPayCodes = payCodes.filter(pc =>
        pc.name.toLowerCase().includes(payCodeSearch.toLowerCase()) ||
        pc.code.toLowerCase().includes(payCodeSearch.toLowerCase())
    );

    const filteredPolicies = policies.filter(p =>
        p.name.toLowerCase().includes(policySearch.toLowerCase()) ||
        p.department.toLowerCase().includes(policySearch.toLowerCase())
    );

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
                    <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-none bg-emerald-100 p-12 overflow-hidden relative group">
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

                    <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-none bg-purple-100 p-12 overflow-hidden relative group">
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

                    <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-none bg-amber-100 p-12 overflow-hidden relative">
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
                    <TabsList className="bg-slate-100/50 p-2 rounded-3xl gap-2 h-auto flex justify-start items-center flex-wrap max-w-fit border border-slate-200/50 shadow-inner">
                        {["Eligible employees", "Allowance rules", "Pay codes", "Policies", "Batch summary"].map((tab) => (
                            <TabsTrigger
                                key={tab.toLowerCase().replace(/\s/g, "-")}
                                value={tab.toLowerCase().replace(/\s/g, "-")}
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
                                <Button className="bg-[#10b981] hover:bg-[#059669] h-16 px-10 rounded-2xl font-bold shadow-2xl shadow-emerald-100 text-white transition-all hover:scale-105" onClick={() => {
                                    // Re-validate all employees against current shift rules
                                    setEmployees(prev => prev.map(emp => {
                                        const matchingRule = rules.find(r => r.shiftName === emp.shift);
                                        if (matchingRule) {
                                            return { ...emp, rate: matchingRule.amount, status: "Verified" };
                                        }
                                        return { ...emp, status: "Pending" };
                                    }));
                                    toast({ title: "Sync Complete", description: `Reconciled ${employees.length} employees with ${rules.length} active shift rules. Rates and statuses updated.` });
                                }}>
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

                    {/* Pay Codes */}
                    <TabsContent value="pay-codes" className="pt-2">
                        <Card className="shadow-3xl shadow-slate-200/50 border-none rounded-[4rem] bg-white overflow-hidden">
                            <CardHeader className="p-12 border-b border-slate-50 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                        <FileCode2 className="text-[#6366f1]" size={32} /> Pay Code Registry
                                    </CardTitle>
                                    <CardDescription className="text-lg font-bold text-slate-400 mt-2">Formula-based payment definitions linked to allowance policies.</CardDescription>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <Input
                                            placeholder="Search code or name..."
                                            className="h-14 pl-12 rounded-2xl bg-slate-50 border border-slate-200 font-bold w-72"
                                            value={payCodeSearch}
                                            onChange={(e) => setPayCodeSearch(e.target.value)}
                                        />
                                    </div>
                                    <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] h-14 px-8 rounded-2xl font-bold shadow-xl shadow-purple-100" onClick={() => openPayCodeDialog()}>
                                        <Plus className="mr-2 h-5 w-5" /> Register pay code
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {filteredPayCodes.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-6">
                                            <FileCode2 size={40} />
                                        </div>
                                        <p className="text-slate-300 font-bold text-xl uppercase tracking-tighter">No pay codes registered yet.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="border-slate-100">
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Name</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Code</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Formula</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Frequency</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Last updated</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPayCodes.map((pc) => (
                                                <TableRow key={pc.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                                    <TableCell className="p-6 font-bold text-slate-900 text-lg">{pc.name}</TableCell>
                                                    <TableCell className="p-6">
                                                        <Badge className="bg-slate-900 text-white border-none font-bold px-4 py-1.5 rounded-xl uppercase text-[10px] tracking-widest">{pc.code}</Badge>
                                                    </TableCell>
                                                    <TableCell className="p-6">
                                                        <div className="bg-indigo-50/50 text-indigo-700 px-4 py-2 rounded-xl font-mono font-bold text-sm border border-indigo-100 inline-block">
                                                            {pc.formula}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="p-6 font-bold text-slate-500 text-sm">{pc.frequency}</TableCell>
                                                    <TableCell className="p-6">
                                                        <p className="font-bold text-slate-600 text-sm">{pc.lastUpdated}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 italic">by {pc.updatedBy}</p>
                                                    </TableCell>
                                                    <TableCell className="p-6 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-[#6366f1] hover:bg-indigo-50" onClick={() => openPayCodeDialog(pc)} title="Edit pay code">
                                                                <Pencil size={18} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50" onClick={() => handleDeletePayCode(pc)} title="Delete pay code">
                                                                <Trash2 size={18} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Policies */}
                    <TabsContent value="policies" className="pt-2">
                        <Card className="shadow-3xl shadow-slate-200/50 border-none rounded-[4rem] bg-white overflow-hidden">
                            <CardHeader className="p-12 border-b border-slate-50 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                        <FolderKanban className="text-[#10b981]" size={32} /> Allowance Policies
                                    </CardTitle>
                                    <CardDescription className="text-lg font-bold text-slate-400 mt-2">Named groupings that bind pay codes to departments and staff.</CardDescription>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <Input
                                            placeholder="Search policy or dept..."
                                            className="h-14 pl-12 rounded-2xl bg-slate-50 border border-slate-200 font-bold w-72"
                                            value={policySearch}
                                            onChange={(e) => setPolicySearch(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        className="bg-[#10b981] hover:bg-[#059669] h-14 px-8 rounded-2xl font-bold shadow-xl shadow-emerald-100 text-white disabled:opacity-50"
                                        onClick={() => openPolicyDialog()}
                                        disabled={payCodes.length === 0}
                                        title={payCodes.length === 0 ? "Create a pay code first" : ""}
                                    >
                                        <Plus className="mr-2 h-5 w-5" /> New policy
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {filteredPolicies.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-6">
                                            <FolderKanban size={40} />
                                        </div>
                                        <p className="text-slate-300 font-bold text-xl uppercase tracking-tighter">No policies configured yet.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="border-slate-100">
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Policy</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Linked pay code</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Department</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400 text-center">Employees</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">Status</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400">History</th>
                                                <th className="p-6 font-bold text-xs uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPolicies.map((pol) => {
                                                const linkedCode = payCodes.find(pc => pc.id === pol.payCodeId);
                                                return (
                                                    <TableRow key={pol.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                                        <TableCell className="p-6">
                                                            <div className="font-bold text-slate-900 text-lg">{pol.name}</div>
                                                            <div className="text-[10px] font-bold text-slate-400">{pol.id}</div>
                                                        </TableCell>
                                                        <TableCell className="p-6">
                                                            {linkedCode ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Badge className="bg-slate-900 text-white border-none font-bold px-3 py-1 rounded-lg uppercase text-[10px] tracking-widest">{linkedCode.code}</Badge>
                                                                    <span className="text-xs font-mono font-bold text-indigo-600">{linkedCode.formula}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs font-bold text-rose-500">Pay code missing</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="p-6 font-bold text-slate-600">{pol.department}</TableCell>
                                                        <TableCell className="p-6 text-center">
                                                            <div className="bg-slate-50 w-16 h-10 flex items-center justify-center rounded-xl mx-auto border border-slate-100 font-bold text-slate-700">
                                                                {pol.employees}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="p-6">
                                                            {pol.isActive ? (
                                                                <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold">Active</Badge>
                                                            ) : (
                                                                <Badge className="bg-slate-100 text-slate-500 border-none font-bold">Paused</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="p-6">
                                                            <div className="text-xs font-bold text-slate-500">Created {pol.createdOn}</div>
                                                            <div className="text-[10px] font-bold text-slate-400">Updated {pol.lastUpdated} by {pol.updatedBy}</div>
                                                        </TableCell>
                                                        <TableCell className="p-6 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-[#6366f1] hover:bg-indigo-50" onClick={() => openPolicyDialog(pol)} title="Edit policy">
                                                                    <Pencil size={18} />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50" onClick={() => handleTogglePolicyActive(pol)} title={pol.isActive ? "Pause policy" : "Resume policy"}>
                                                                    {pol.isActive ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50" onClick={() => handleDeletePolicy(pol)} title="Delete policy">
                                                                    <Trash2 size={18} />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
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

                {/* Rule (Create/Edit) */}
                <SideFormSheet
                    open={isRuleModalOpen}
                    onOpenChange={setIsRuleModalOpen}
                    title={editingRule ? "Modify Allowance Rule" : "Create Global Policy"}
                    description="Define the financial weight for shift transitions."
                    icon={<Coins size={20} />}
                    accentColor={editingRule ? "#7c3aed" : "#4f46e5"}
                    width="md"
                    submitLabel={editingRule ? "Commit Changes" : "Deploy Policy"}
                    onSubmit={handleSaveRule}
                >
                    <div className="space-y-4">
                        <Field label="Shift Variant Identifier" required>
                            <Input name="shiftName" defaultValue={editingRule?.shiftName} required placeholder="e.g. Late Night Shift" />
                        </Field>
                        <Field label="Unit Rate (₹)" required>
                            <Input name="amount" type="number" defaultValue={editingRule?.amount} required />
                        </Field>
                        <Field label="Activation Time" required>
                            <Input name="startTime" defaultValue={editingRule?.startTime} required placeholder="10:00 PM" />
                        </Field>
                    </div>
                </SideFormSheet>

                {/* Timesheet Insight Modal */}
                <Dialog open={isTimesheetOpen} onOpenChange={setIsTimesheetOpen}>
                    <DialogContent className="max-w-3xl rounded-[3rem] border-2 border-slate-200 p-12 bg-white">
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

                {/* Pay Code (Create/Edit) */}
                <SideFormSheet
                    open={isPayCodeDialogOpen}
                    onOpenChange={setIsPayCodeDialogOpen}
                    title={editingPayCode ? "Edit Pay Code" : "Register New Pay Code"}
                    description="Define a formula-based payment rule. Example formulas: [Basic]*0.2, [Gross]*0.1, 500."
                    icon={<FileCode2 size={20} />}
                    accentColor={editingPayCode ? "#7c3aed" : "#4f46e5"}
                    width="md"
                    submitLabel={editingPayCode ? "Save Changes" : "Register Pay Code"}
                    onSubmit={(e) => { e.preventDefault(); handleSavePayCode(); }}
                >
                    <div className="space-y-4">
                        <Field label="Pay Code Name" required>
                            <Input
                                placeholder="e.g. Night Shift India"
                                value={payCodeForm.name}
                                onChange={(e) => setPayCodeForm({ ...payCodeForm, name: e.target.value })}
                            />
                        </Field>
                        <Field label="Identifier Code" hint="Auto-derived from name if empty (e.g. NIPC)">
                            <Input
                                placeholder="e.g. NIPC"
                                value={payCodeForm.code}
                                onChange={(e) => setPayCodeForm({ ...payCodeForm, code: e.target.value.toUpperCase() })}
                                className="uppercase"
                            />
                        </Field>
                        <Field label="Payment Formula" required>
                            <Input
                                placeholder="e.g. [Basic]*0.2 or 500"
                                value={payCodeForm.formula}
                                onChange={(e) => setPayCodeForm({ ...payCodeForm, formula: e.target.value })}
                                className="font-mono"
                            />
                        </Field>
                        <Field label="Frequency" required>
                            <SelectUI value={payCodeForm.frequency} onValueChange={(v) => setPayCodeForm({ ...payCodeForm, frequency: v as PayCode["frequency"] })}>
                                <SelectTriggerUI>
                                    <SelectValueUI />
                                </SelectTriggerUI>
                                <SelectContentUI>
                                    <SelectItemUI value="Lump Sum">Lump Sum</SelectItemUI>
                                    <SelectItemUI value="Per Shift">Per Shift</SelectItemUI>
                                    <SelectItemUI value="Per Hour">Per Hour</SelectItemUI>
                                </SelectContentUI>
                            </SelectUI>
                        </Field>
                    </div>
                </SideFormSheet>

                {/* Policy (Create/Edit) */}
                <SideFormSheet
                    open={isPolicyDialogOpen}
                    onOpenChange={setIsPolicyDialogOpen}
                    title={editingPolicy ? "Edit Policy" : "Create New Policy"}
                    description="Bind a pay code to a department or staff group to establish an allowance policy."
                    icon={<FolderKanban size={20} />}
                    accentColor={editingPolicy ? "#7c3aed" : "#059669"}
                    width="md"
                    submitLabel={editingPolicy ? "Save Changes" : "Create Policy"}
                    onSubmit={(e) => { e.preventDefault(); handleSavePolicy(); }}
                >
                    <div className="space-y-4">
                        <Field label="Policy Name" required>
                            <Input
                                placeholder="e.g. Evening Shift India"
                                value={policyForm.name}
                                onChange={(e) => setPolicyForm({ ...policyForm, name: e.target.value })}
                            />
                        </Field>
                        <Field label="Linked Pay Code" required>
                            <SelectUI value={policyForm.payCodeId} onValueChange={(v) => setPolicyForm({ ...policyForm, payCodeId: v })}>
                                <SelectTriggerUI>
                                    <SelectValueUI placeholder="Select a pay code" />
                                </SelectTriggerUI>
                                <SelectContentUI>
                                    {payCodes.map(pc => (
                                        <SelectItemUI key={pc.id} value={pc.id}>
                                            {pc.name} ({pc.code}) — {pc.formula}
                                        </SelectItemUI>
                                    ))}
                                </SelectContentUI>
                            </SelectUI>
                        </Field>
                        <Field label="Department">
                            <Input
                                placeholder="e.g. Operations (leave blank for All)"
                                value={policyForm.department}
                                onChange={(e) => setPolicyForm({ ...policyForm, department: e.target.value })}
                            />
                        </Field>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <Label className="font-semibold text-slate-700">Active on creation</Label>
                            <input
                                type="checkbox"
                                checked={policyForm.isActive}
                                onChange={(e) => setPolicyForm({ ...policyForm, isActive: e.target.checked })}
                                className="h-5 w-5 accent-[#10b981]"
                            />
                        </div>
                    </div>
                </SideFormSheet>

            </div>
        </div >
    );
};

export default ShiftAllowancePage;
