"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import { validateEscalationRule, type ValidationErrors } from "@/shared/api/settings-validators";
import {
    ArrowUpCircle,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Zap,
    Mail,
    Smartphone,
    Edit,
    Timer,
    Trash2,
    Download,
    CheckCircle2
} from "lucide-react";

type EscalationRule = {
    id: string;
    module: "Leave" | "Expense" | "Attendance" | "Payroll" | "General";
    trigger: string;
    triggerDays: number;
    level1: { escalatee: string; afterDays: number };
    level2: { escalatee: string; afterDays: number };
    level3: { escalatee: string; afterDays: number };
    notification: "Email" | "In-app" | "Both";
    reminderFrequency: string;
    status: "Active" | "Inactive";
};

type EscalationHistory = {
    id: string;
    ruleId: string;
    module: string;
    triggerItem: string;
    escalatedTo: string;
    level: number;
    date: string;
    resolved: boolean;
    resolutionTime?: string;
};

const mockRules: EscalationRule[] = [
    { id: "ESC-001", module: "Leave", trigger: "Pending > 3 days", triggerDays: 3, level1: { escalatee: "Reporting Manager", afterDays: 2 }, level2: { escalatee: "HR Head", afterDays: 5 }, level3: { escalatee: "Director", afterDays: 7 }, notification: "Both", reminderFrequency: "Daily", status: "Active" },
    { id: "ESC-002", module: "Expense", trigger: "Pending > 5 days", triggerDays: 5, level1: { escalatee: "Finance Manager", afterDays: 3 }, level2: { escalatee: "CFO", afterDays: 7 }, level3: { escalatee: "CEO", afterDays: 10 }, notification: "Email", reminderFrequency: "Every 2 days", status: "Active" },
    { id: "ESC-003", module: "Attendance", trigger: "Regularization pending > 2 days", triggerDays: 2, level1: { escalatee: "Reporting Manager", afterDays: 1 }, level2: { escalatee: "HR Manager", afterDays: 3 }, level3: { escalatee: "HR Head", afterDays: 5 }, notification: "In-app", reminderFrequency: "Daily", status: "Active" },
    { id: "ESC-004", module: "Payroll", trigger: "Discrepancy unresolved > 48 hours", triggerDays: 2, level1: { escalatee: "Payroll Admin", afterDays: 1 }, level2: { escalatee: "Finance Head", afterDays: 3 }, level3: { escalatee: "Director", afterDays: 5 }, notification: "Both", reminderFrequency: "Every 12 hours", status: "Inactive" },
    { id: "ESC-005", module: "General", trigger: "Request pending > 7 days", triggerDays: 7, level1: { escalatee: "Department Head", afterDays: 3 }, level2: { escalatee: "VP", afterDays: 7 }, level3: { escalatee: "CEO", afterDays: 10 }, notification: "Both", reminderFrequency: "Weekly", status: "Active" },
];

const mockHistory: EscalationHistory[] = [
    { id: "EH-001", ruleId: "ESC-001", module: "Leave", triggerItem: "Leave request by Amit Joshi", escalatedTo: "Reporting Manager", level: 1, date: "2026-03-30", resolved: true, resolutionTime: "4 hours" },
    { id: "EH-002", ruleId: "ESC-002", module: "Expense", triggerItem: "Expense claim INR 45,000 by Neha", escalatedTo: "Finance Manager", level: 1, date: "2026-03-29", resolved: false },
    { id: "EH-003", ruleId: "ESC-001", module: "Leave", triggerItem: "Leave request by Priya Sharma", escalatedTo: "HR Head", level: 2, date: "2026-03-28", resolved: true, resolutionTime: "1.5 days" },
    { id: "EH-004", ruleId: "ESC-003", module: "Attendance", triggerItem: "Regularization by Vikram Singh", escalatedTo: "HR Manager", level: 2, date: "2026-03-27", resolved: true, resolutionTime: "8 hours" },
    { id: "EH-005", ruleId: "ESC-005", module: "General", triggerItem: "Asset request by Kavita Patel", escalatedTo: "Department Head", level: 1, date: "2026-03-26", resolved: true, resolutionTime: "2 days" },
];

const EscalationRulesPage = () => {
    const { toast } = useToast();
    const [rules, setRules] = useState<EscalationRule[]>(mockRules);
    const [history, setHistory] = useState<EscalationHistory[]>(mockHistory);
    const [searchTerm, setSearchTerm] = useState("");
    const [moduleFilter, setModuleFilter] = useState<string>("All");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [historySearch, setHistorySearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editRule, setEditRule] = useState<EscalationRule | null>(null);
    const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<ValidationErrors>({});

    const [form, setForm] = useState({
        module: "Leave" as EscalationRule["module"],
        triggerDays: 3,
        l1Escalatee: "Reporting Manager",
        l1Days: 2,
        l2Escalatee: "HR Head",
        l2Days: 5,
        l3Escalatee: "Director",
        l3Days: 7,
        notification: "Both" as EscalationRule["notification"],
        reminderFrequency: "Daily",
    });

    const filtered = rules.filter(r => {
        const matchesSearch =
            r.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = moduleFilter === "All" || r.module === moduleFilter;
        const matchesStatus = statusFilter === "All" || r.status === statusFilter;
        return matchesSearch && matchesModule && matchesStatus;
    });

    const filteredHistory = history.filter(h =>
        h.module.toLowerCase().includes(historySearch.toLowerCase()) ||
        h.triggerItem.toLowerCase().includes(historySearch.toLowerCase()) ||
        h.escalatedTo.toLowerCase().includes(historySearch.toLowerCase())
    );

    const toggleRule = (id: string) => {
        const rule = rules.find(r => r.id === id);
        const nextStatus = rule?.status === "Active" ? "Inactive" : "Active";
        setRules(rules.map(r => r.id === id ? { ...r, status: nextStatus as "Active" | "Inactive" } : r));
        toast({ title: `Rule ${nextStatus}`, description: `Escalation rule ${id} is now ${nextStatus.toLowerCase()}.` });
    };

    const confirmDelete = () => {
        if (!deleteRuleId) return;
        const rule = rules.find(r => r.id === deleteRuleId);
        setRules(rules.filter(r => r.id !== deleteRuleId));
        toast({ title: "Rule Deleted", description: `${rule?.id} (${rule?.module}) removed.`, variant: "destructive" });
        setDeleteRuleId(null);
    };

    const markResolved = (historyId: string) => {
        setHistory(history.map(h => h.id === historyId ? { ...h, resolved: true, resolutionTime: h.resolutionTime || "Just now" } : h));
        toast({ title: "Marked Resolved", description: `Escalation ${historyId} marked as resolved.` });
    };

    const exportHistory = () => {
        toast({ title: "Exporting History", description: `Preparing CSV for ${filteredHistory.length} escalation records.` });
    };

    const handleSave = () => {
        const errs = validateEscalationRule(form);
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) {
            toast({ title: "Please fix validation errors", description: Object.values(errs)[0], variant: "destructive" });
            return;
        }
        const newRule: EscalationRule = {
            id: editRule?.id || `ESC-${String(rules.length + 1).padStart(3, "0")}`,
            module: form.module,
            trigger: `Pending > ${form.triggerDays} days`,
            triggerDays: form.triggerDays,
            level1: { escalatee: form.l1Escalatee, afterDays: form.l1Days },
            level2: { escalatee: form.l2Escalatee, afterDays: form.l2Days },
            level3: { escalatee: form.l3Escalatee, afterDays: form.l3Days },
            notification: form.notification,
            reminderFrequency: form.reminderFrequency,
            status: "Active",
        };
        if (editRule) {
            setRules(rules.map(r => r.id === editRule.id ? newRule : r));
        } else {
            setRules([newRule, ...rules]);
        }
        setIsDialogOpen(false);
        setEditRule(null);
        setFormErrors({});
        toast({ title: editRule ? "Rule Updated" : "Rule Created", description: `Escalation rule for ${form.module} saved.` });
    };

    const openEdit = (rule: EscalationRule) => {
        setEditRule(rule);
        setForm({
            module: rule.module,
            triggerDays: rule.triggerDays,
            l1Escalatee: rule.level1.escalatee,
            l1Days: rule.level1.afterDays,
            l2Escalatee: rule.level2.escalatee,
            l2Days: rule.level2.afterDays,
            l3Escalatee: rule.level3.escalatee,
            l3Days: rule.level3.afterDays,
            notification: rule.notification,
            reminderFrequency: rule.reminderFrequency,
        });
        setIsDialogOpen(true);
    };

    // SLA stats
    const avgResolution: Record<string, string> = {
        Leave: "6 hours", Expense: "1.2 days", Attendance: "8 hours", General: "2 days", Payroll: "N/A"
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                        <ArrowUpCircle size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Escalation Rules</h1>
                        <p className="text-sm font-medium text-slate-500">Configure automatic escalation triggers and notification chains.</p>
                    </div>
                </div>
                <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={() => { setEditRule(null); setIsDialogOpen(true); }}>
                    <Plus size={16} className="mr-2" /> Create Rule
                </Button>
            </div>

            <div className="flex-1 overflow-auto">
                <Tabs defaultValue="rules" className="h-full flex flex-col">
                    <div className="px-8 pt-4 bg-white border-b border-slate-200">
                        <TabsList className="bg-slate-100">
                            <TabsTrigger value="rules" className="font-bold">Rules</TabsTrigger>
                            <TabsTrigger value="history" className="font-bold">Escalation History</TabsTrigger>
                            <TabsTrigger value="sla" className="font-bold">SLA Tracker</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="rules" className="flex-1 p-8 space-y-4">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="relative w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search rules..." className="pl-9 bg-slate-50 border-slate-200" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            <Select value={moduleFilter} onValueChange={setModuleFilter}>
                                <SelectTrigger className="w-44"><SelectValue placeholder="Module" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Modules</SelectItem>
                                    <SelectItem value="Leave">Leave</SelectItem>
                                    <SelectItem value="Expense">Expense</SelectItem>
                                    <SelectItem value="Attendance">Attendance</SelectItem>
                                    <SelectItem value="Payroll">Payroll</SelectItem>
                                    <SelectItem value="General">General</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Statuses</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="ml-auto text-xs font-semibold text-slate-500">
                                {filtered.length} of {rules.length} rules
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Module</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Trigger</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">L1 Escalatee</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">L2 Escalatee</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">L3 Escalatee</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Notify</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Reminder</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-12 text-slate-400 font-medium">
                                                No escalation rules match your filters.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filtered.map(rule => (
                                        <TableRow key={rule.id} className="hover:bg-slate-50/50">
                                            <TableCell>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">{rule.module}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-slate-700">{rule.trigger}</TableCell>
                                            <TableCell className="text-sm text-slate-600">
                                                <span className="font-medium">{rule.level1.escalatee}</span>
                                                <span className="text-xs text-slate-400 ml-1">({rule.level1.afterDays}d)</span>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">
                                                <span className="font-medium">{rule.level2.escalatee}</span>
                                                <span className="text-xs text-slate-400 ml-1">({rule.level2.afterDays}d)</span>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">
                                                <span className="font-medium">{rule.level3.escalatee}</span>
                                                <span className="text-xs text-slate-400 ml-1">({rule.level3.afterDays}d)</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    {(rule.notification === "Email" || rule.notification === "Both") && <Mail size={14} className="text-slate-400" />}
                                                    {(rule.notification === "In-app" || rule.notification === "Both") && <Smartphone size={14} className="text-slate-400" />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">{rule.reminderFrequency}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={rule.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}>
                                                    {rule.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => openEdit(rule)} title="Edit rule">
                                                        <Edit size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRule(rule.id)} title="Toggle status">
                                                        {rule.status === "Active"
                                                            ? <ToggleRight size={18} className="text-emerald-500" />
                                                            : <ToggleLeft size={18} className="text-slate-400" />
                                                        }
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => setDeleteRuleId(rule.id)} title="Delete rule">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 p-8 space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="relative w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search history..." className="pl-9 bg-slate-50 border-slate-200" value={historySearch} onChange={e => setHistorySearch(e.target.value)} />
                            </div>
                            <Button variant="outline" onClick={exportHistory} className="ml-auto">
                                <Download size={14} className="mr-2" /> Export CSV
                            </Button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Date</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Module</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Trigger Item</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Escalated To</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Level</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Resolution Time</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHistory.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                                                No escalation events match your search.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredHistory.map(h => (
                                        <TableRow key={h.id} className="hover:bg-slate-50/50">
                                            <TableCell className="text-sm text-slate-500">{h.date}</TableCell>
                                            <TableCell><Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">{h.module}</Badge></TableCell>
                                            <TableCell className="text-sm font-medium text-slate-700">{h.triggerItem}</TableCell>
                                            <TableCell className="text-sm text-slate-600">{h.escalatedTo}</TableCell>
                                            <TableCell>
                                                <Badge className={`border-none text-white ${h.level === 1 ? "bg-amber-500" : h.level === 2 ? "bg-orange-500" : "bg-red-500"}`}>
                                                    L{h.level}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={h.resolved ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}>
                                                    {h.resolved ? "Resolved" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500">{h.resolutionTime || "-"}</TableCell>
                                            <TableCell className="text-right">
                                                {!h.resolved ? (
                                                    <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => markResolved(h.id)}>
                                                        <CheckCircle2 size={14} className="mr-1" /> Resolve
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-slate-300">—</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="sla" className="flex-1 p-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(avgResolution).map(([module, time]) => (
                                <Card key={module} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-5 flex flex-col items-center gap-3 text-center">
                                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                            <Timer size={24} className="text-blue-600" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">{module}</p>
                                        <p className="text-xl font-bold text-slate-900">{time}</p>
                                        <p className="text-xs text-slate-400">Avg Resolution Time</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create/Edit Escalation Rule Sheet */}
            <SideFormSheet
                open={isDialogOpen}
                onOpenChange={v => { setIsDialogOpen(v); if (!v) setEditRule(null); }}
                title={`${editRule ? "Edit" : "Create"} Escalation Rule`}
                description="Define conditions and escalation chain for automatic alerts."
                icon={<Zap size={20} />}
                accentColor={editRule ? "#7c3aed" : "#4f46e5"}
                width="md"
                submitLabel={`${editRule ? "Update" : "Create"} Rule`}
                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Module">
                            <Select value={form.module} onValueChange={v => setForm({ ...form, module: v as EscalationRule["module"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Leave">Leave</SelectItem>
                                    <SelectItem value="Expense">Expense</SelectItem>
                                    <SelectItem value="Attendance">Attendance</SelectItem>
                                    <SelectItem value="Payroll">Payroll</SelectItem>
                                    <SelectItem value="General">General</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Trigger After (days)" required error={formErrors.triggerDays || undefined}>
                            <Input type="number" min={1} value={form.triggerDays} onChange={e => setForm({ ...form, triggerDays: parseInt(e.target.value) || 1 })} />
                        </Field>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Escalation Chain</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="L1 Escalatee" required error={formErrors.l1Escalatee || undefined}>
                                <Input value={form.l1Escalatee} onChange={e => setForm({ ...form, l1Escalatee: e.target.value })} />
                            </Field>
                            <Field label="After (days)" required error={formErrors.l1Days || undefined}>
                                <Input type="number" min={1} value={form.l1Days} onChange={e => setForm({ ...form, l1Days: parseInt(e.target.value) || 1 })} />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="L2 Escalatee" required error={formErrors.l2Escalatee || undefined}>
                                <Input value={form.l2Escalatee} onChange={e => setForm({ ...form, l2Escalatee: e.target.value })} />
                            </Field>
                            <Field label="After (days)" required error={formErrors.l2Days || undefined}>
                                <Input type="number" min={1} value={form.l2Days} onChange={e => setForm({ ...form, l2Days: parseInt(e.target.value) || 1 })} />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="L3 Escalatee" required error={formErrors.l3Escalatee || undefined}>
                                <Input value={form.l3Escalatee} onChange={e => setForm({ ...form, l3Escalatee: e.target.value })} />
                            </Field>
                            <Field label="After (days)" required error={formErrors.l3Days || undefined}>
                                <Input type="number" min={1} value={form.l3Days} onChange={e => setForm({ ...form, l3Days: parseInt(e.target.value) || 1 })} />
                            </Field>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Notification">
                            <Select value={form.notification} onValueChange={v => setForm({ ...form, notification: v as EscalationRule["notification"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="In-app">In-app</SelectItem>
                                    <SelectItem value="Both">Both</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Reminder Frequency">
                            <Select value={form.reminderFrequency} onValueChange={v => setForm({ ...form, reminderFrequency: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Every 2 days">Every 2 days</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                </div>
            </SideFormSheet>

            <AlertDialog open={!!deleteRuleId} onOpenChange={v => !v && setDeleteRuleId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this escalation rule?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This rule will stop firing immediately. Historical escalations will not be affected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default EscalationRulesPage;
