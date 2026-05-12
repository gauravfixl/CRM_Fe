"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    AlertCircle,
    Bell,
    Clock,
    ShieldCheck,
    Trophy,
    Briefcase,
    Calendar,
    Settings,
    Plus,
    Trash2,
    ToggleLeft,
    Search,
    Play,
    Edit2,
    Copy
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/shared/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/shared/components/ui/alert-dialog";
import { useToast } from "@/shared/components/ui/use-toast";
import { automationRulesApi, extractApiError } from "@/shared/api/settings-api";
import { validateAutomationRule, type ValidationErrors } from "@/shared/api/settings-validators";

const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-[11px] text-rose-600 font-medium mt-1">{msg}</p> : null;

type RuleCategory = 'Attendance' | 'Leave' | 'Engagement' | 'Security' | 'Payroll';

interface PolicyRule {
    id: string;
    name: string;
    description: string;
    category: RuleCategory;
    trigger: string;
    action: string;
    isActive: boolean;
    lastRun?: string;
}

interface GlobalConfig {
    enableAllAutomations: boolean;
    notifyOnFailure: boolean;
    maxConcurrentRuns: number;
    executionMode: 'realtime' | 'batch' | 'scheduled';
}

const INITIAL_RULES: PolicyRule[] = [
    {
        id: "rule-1",
        name: "Late Arrival Notification",
        description: "Auto-notify manager when an employee is late 3 times in a rolling month.",
        category: "Attendance",
        trigger: "Late Mark Count > 3",
        action: "Send Email Notification to Manager",
        isActive: true,
        lastRun: "2026-01-25 09:30 AM"
    },
    {
        id: "rule-2",
        name: "Automatic Leave Deduction",
        description: "Deduct 0.5 days from Casual Leave for missing punch-out without approval.",
        category: "Attendance",
        trigger: "Missing Punch-Out",
        action: "Deduct 0.5 CL & Post to Payroll",
        isActive: false
    },
    {
        id: "rule-3",
        name: "Birthday Celebration",
        description: "Post a celebratory message on the 'Engage' wall and send a push notification.",
        category: "Engagement",
        trigger: "Current Date = DOB",
        action: "Post to Wall + Push Notification",
        isActive: true,
        lastRun: "2026-01-26 08:00 AM"
    },
    {
        id: "rule-4",
        name: "Probation Expiry Alert",
        description: "Notify HR Admin 15 days before an employee's probation period ends.",
        category: "Security",
        trigger: "Days to Probation End = 15",
        action: "HR Priority Dashboard Alert",
        isActive: true,
        lastRun: "2026-01-24 10:15 AM"
    },
    {
        id: "rule-5",
        name: "Welcome Kit Trigger",
        description: "Generate IT asset request when employee status changes to 'Joined'.",
        category: "Security",
        trigger: "Status = Joined",
        action: "Create IT Ticket + Notify IT Manager",
        isActive: true
    },
    {
        id: "rule-6",
        name: "Overtime Approval Bypass",
        description: "Auto-approve overtime requests less than 2 hours for 'Senior' designations.",
        category: "Payroll",
        trigger: "OT Hours < 2 & Designation = Senior",
        action: "Auto-Approve + Payroll Sync",
        isActive: false
    }
];

const emptyRule: Omit<PolicyRule, "id"> = {
    name: "",
    description: "",
    category: "Attendance",
    trigger: "",
    action: "",
    isActive: true,
};

const AutomationRulesPage = () => {
    const { toast } = useToast();
    const [rules, setRules] = useState<PolicyRule[]>(INITIAL_RULES);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<PolicyRule | null>(null);
    const [form, setForm] = useState<Omit<PolicyRule, "id">>(emptyRule);

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
        enableAllAutomations: true,
        notifyOnFailure: true,
        maxConcurrentRuns: 10,
        executionMode: "realtime",
    });

    const [deleteId, setDeleteId] = useState<string | null>(null);

    // API backed ids mapped to frontend rule ids
    const [apiIdMap, setApiIdMap] = useState<Record<string, string>>({});
    const [formErrors, setFormErrors] = useState<ValidationErrors>({});

    const categories: (RuleCategory | "All")[] = ["All", "Attendance", "Leave", "Engagement", "Security", "Payroll"];

    // Load existing automation rules from backend on mount
    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                const res = await automationRulesApi.list();
                if (cancel || !Array.isArray(res?.data)) return;
                const mapped: PolicyRule[] = res.data.map((r) => ({
                    id: `rule-${r._id}`,
                    name: r.name,
                    description: r.description || "",
                    category: ((["Attendance", "Leave", "Engagement", "Security", "Payroll"].includes(r.module)
                        ? r.module
                        : "Attendance") as RuleCategory),
                    trigger: (r.trigger?.event as string) || "",
                    action: Array.isArray(r.actions) && r.actions[0] ? String(r.actions[0].type || r.actions[0].action || "custom") : "",
                    isActive: !!r.enabled,
                    lastRun: r.lastExecutedAt ? new Date(r.lastExecutedAt).toLocaleString() : undefined,
                }));
                const idMap: Record<string, string> = {};
                res.data.forEach((r) => { idMap[`rule-${r._id}`] = r._id; });
                if (mapped.length) {
                    setRules(mapped);
                    setApiIdMap(idMap);
                }
            } catch {
                // ignore — fall back to INITIAL_RULES
            }
        })();
        return () => { cancel = true; };
    }, []);

    const openCreateDialog = () => {
        setEditingRule(null);
        setForm(emptyRule);
        setIsDialogOpen(true);
    };

    const openEditDialog = (rule: PolicyRule) => {
        setEditingRule(rule);
        const { id, ...rest } = rule;
        setForm(rest);
        setIsDialogOpen(true);
    };

    const handleSaveRule = async () => {
        const errs = validateAutomationRule({
            name: form.name,
            trigger: form.trigger,
            action: form.action,
            category: form.category,
        });
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" });
            return;
        }

        const payload = {
            name: form.name.trim(),
            description: form.description,
            module: form.category,
            trigger: { event: form.trigger.trim(), source: "system" },
            conditions: {},
            actions: [{ type: form.action.trim() }],
            enabled: form.isActive,
        };

        try {
            if (editingRule) {
                const backendId = apiIdMap[editingRule.id];
                if (backendId) {
                    await automationRulesApi.update(backendId, payload);
                }
                setRules(rules.map(r => r.id === editingRule.id ? { ...editingRule, ...form } : r));
                toast({ title: "Rule Updated", description: `${form.name} has been updated.` });
            } else {
                const res = await automationRulesApi.create(payload);
                const newId = res.data?._id ? `rule-${res.data._id}` : `rule-${Date.now()}`;
                if (res.data?._id) setApiIdMap(prev => ({ ...prev, [newId]: res.data._id }));
                const newRule: PolicyRule = { ...form, id: newId };
                setRules([newRule, ...rules]);
                toast({ title: "Rule Created", description: `${form.name} saved to backend.` });
            }
        } catch (e) {
            // Graceful fallback — still save locally
            if (editingRule) {
                setRules(rules.map(r => r.id === editingRule.id ? { ...editingRule, ...form } : r));
            } else {
                const newRule: PolicyRule = { ...form, id: `rule-${Date.now()}` };
                setRules([newRule, ...rules]);
            }
            toast({ title: "Saved Locally", description: extractApiError(e, "Backend unreachable — change kept locally."), variant: "destructive" });
        }

        setIsDialogOpen(false);
        setEditingRule(null);
        setForm(emptyRule);
        setFormErrors({});
    };

    const toggleRule = async (id: string) => {
        const rule = rules.find(r => r.id === id);
        const newState = !rule?.isActive;
        setRules(rules.map(r => r.id === id ? { ...r, isActive: newState } : r));
        toast({
            title: newState ? "Rule Enabled" : "Rule Disabled",
            description: `${rule?.name} automation is now ${newState ? 'on' : 'off'}.`,
        });
        const backendId = apiIdMap[id];
        if (backendId) {
            try { await automationRulesApi.update(backendId, { enabled: newState }); } catch { /* non-fatal */ }
        }
    };

    const runRuleManually = async (id: string, name: string) => {
        const backendId = apiIdMap[id];
        if (backendId) {
            try {
                await automationRulesApi.execute(backendId);
                toast({ title: "Rule Executed", description: `'${name}' ran successfully on backend.` });
                return;
            } catch (e) {
                toast({ title: "Execution Failed", description: extractApiError(e, "Backend execution failed."), variant: "destructive" });
                return;
            }
        }
        toast({
            title: "Rule Triggered (local)",
            description: `'${name}' ran in local mode (not persisted).`,
        });
    };

    const duplicateRule = (rule: PolicyRule) => {
        const copy: PolicyRule = {
            ...rule,
            id: `rule-${Date.now()}`,
            name: `${rule.name} (Copy)`,
            isActive: false,
            lastRun: undefined,
        };
        setRules([copy, ...rules]);
        toast({ title: "Rule Duplicated", description: `Created a copy of ${rule.name}.` });
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        const rule = rules.find(r => r.id === deleteId);
        setRules(rules.filter(r => r.id !== deleteId));
        toast({ title: "Rule Deleted", description: `${rule?.name} has been removed.`, variant: "destructive" });
        const backendId = apiIdMap[deleteId];
        if (backendId) {
            try { await automationRulesApi.remove(backendId); } catch (e) {
                toast({ title: "Backend Sync Failed", description: extractApiError(e, "Rule deleted locally only."), variant: "destructive" });
            }
        }
        setDeleteId(null);
    };

    const saveGlobalConfig = () => {
        setIsConfigOpen(false);
        toast({ title: "Global Config Saved", description: "Automation engine configuration updated." });
    };

    const filteredRules = rules.filter(r => {
        const matchesSearch =
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.trigger.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCategory === "All" || r.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'Attendance': return Clock;
            case 'Leave': return Calendar;
            case 'Engagement': return Trophy;
            case 'Security': return ShieldCheck;
            case 'Payroll': return Briefcase;
            default: return Zap;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden" style={{ zoom: '0.8' }}>
            <header className="h-24 px-10 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Automation Engine</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">HR Policy & Workflow Robotics (Layer 3)</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                        onClick={() => setIsConfigOpen(true)}
                    >
                        <Settings size={18} className="mr-2" /> Global Config
                    </Button>
                    <Button
                        className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100"
                        onClick={openCreateDialog}
                    >
                        <Plus size={20} className="mr-2" /> Create New Automation
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-10 flex flex-col gap-8 overflow-hidden">
                <div className="grid grid-cols-4 gap-6 shrink-0">
                    {[
                        { label: "Active Automations", value: rules.filter(r => r.isActive).length, color: "text-indigo-600", bg: "bg-indigo-50", icon: Zap },
                        { label: "Executed (24h)", value: "1,248", color: "text-emerald-600", bg: "bg-emerald-50", icon: Play },
                        { label: "Warnings/Fails", value: "3", color: "text-rose-600", bg: "bg-rose-50", icon: AlertCircle },
                        { label: "Man-hours Saved", value: "342h", color: "text-amber-600", bg: "bg-amber-50", icon: Trophy }
                    ].map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center gap-5 text-start">
                                <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                    <h3 className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex items-center gap-6 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 shrink-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <Input
                            className="h-14 pl-16 rounded-2xl bg-slate-50 border-none w-full font-bold text-lg placeholder:italic transition-all shadow-inner focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            placeholder="Search automation rules or triggers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-xl font-bold text-xs transition-all tracking-tight h-11
                                    ${selectedCategory === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <ScrollArea className="flex-1 -mx-4 px-4 overflow-y-auto">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-10">
                        <AnimatePresence mode="popLayout">
                            {filteredRules.map((rule, i) => {
                                const Icon = getCategoryIcon(rule.category);
                                return (
                                    <motion.div
                                        key={rule.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card
                                            onClick={() => openEditDialog(rule)}
                                            className={`border-2 transition-all rounded-[2.5rem] bg-white overflow-hidden shadow-sm group cursor-pointer ${rule.isActive ? 'border-indigo-100' : 'border-slate-100 opacity-70'}`}
                                        >
                                            <CardContent className="p-0">
                                                <div className="p-8">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${rule.isActive ? 'bg-indigo-600 text-white ring-8 ring-indigo-50' : 'bg-slate-200 text-slate-500'}`}>
                                                                <Icon size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{rule.name}</h3>
                                                                    <Badge className={`${rule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} border-none text-[10px] font-black tracking-widest px-3 h-5`}>
                                                                        {rule.isActive ? 'RUNNING' : 'PAUSED'}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm font-medium text-slate-500 max-w-[400px] leading-relaxed italic line-clamp-2">
                                                                    "{rule.description}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <Switch
                                                                checked={rule.isActive}
                                                                onCheckedChange={() => toggleRule(rule.id)}
                                                                className="data-[state=checked]:bg-indigo-600"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                                                    <ToggleLeft size={12} />
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger Condition</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-700 font-mono bg-white px-3 py-2 rounded-lg border border-slate-200/50">
                                                                {rule.trigger}
                                                            </p>
                                                        </div>
                                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                                    <Zap size={12} />
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Automated Action</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-indigo-600 font-mono bg-white px-3 py-2 rounded-lg border border-indigo-100/50">
                                                                {rule.action}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        {rule.lastRun && (
                                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                                <Clock size={14} />
                                                                Last active: {rule.lastRun}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="font-bold text-xs text-indigo-600 hover:bg-white rounded-lg h-9 px-4 gap-2 border border-transparent hover:border-slate-200"
                                                            onClick={() => runRuleManually(rule.id, rule.name)}
                                                        >
                                                            <Play size={14} /> Run Now
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                            onClick={() => openEditDialog(rule)}
                                                            title="Edit rule"
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                                                            onClick={() => duplicateRule(rule)}
                                                            title="Duplicate rule"
                                                        >
                                                            <Copy size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                            onClick={() => setDeleteId(rule.id)}
                                                            title="Delete rule"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={openCreateDialog}
                            className="border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50/10 transition-all gap-4 min-h-[300px]"
                        >
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-400 transition-colors">
                                <Plus size={40} />
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-bold tracking-tight">Create Custom Rule</h4>
                                <p className="text-sm font-medium opacity-70">Design complex IF-THIS-THEN-THAT logic</p>
                            </div>
                        </motion.button>

                        {filteredRules.length === 0 && (
                            <div className="col-span-full text-center py-16 text-slate-400">
                                <Bell size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="font-bold">No rules match your filters.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </main>

            {/* Create / Edit Rule Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">
                            {editingRule ? "Edit Automation Rule" : "Create Automation Rule"}
                        </DialogTitle>
                        <DialogDescription>
                            Define an IF-THIS-THEN-THAT rule to automate HR policy workflows.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="rule-name">Rule Name *</Label>
                            <Input
                                id="rule-name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Late Arrival Notification"
                                className={formErrors.name ? "border-rose-400" : ""}
                            />
                            <FieldError msg={formErrors.name} />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="rule-desc">Description</Label>
                            <Textarea
                                id="rule-desc"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Brief description of what this rule does."
                                rows={2}
                                maxLength={500}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select value={form.category} onValueChange={(v: RuleCategory) => setForm({ ...form, category: v })}>
                                <SelectTrigger className={formErrors.category ? "border-rose-400" : ""}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Attendance">Attendance</SelectItem>
                                    <SelectItem value="Leave">Leave</SelectItem>
                                    <SelectItem value="Engagement">Engagement</SelectItem>
                                    <SelectItem value="Security">Security</SelectItem>
                                    <SelectItem value="Payroll">Payroll</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError msg={formErrors.category} />
                        </div>

                        <div className="space-y-2 flex flex-col">
                            <Label>Status</Label>
                            <div className="flex items-center gap-3 h-10">
                                <Switch
                                    checked={form.isActive}
                                    onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                                    className="data-[state=checked]:bg-indigo-600"
                                />
                                <span className="text-sm font-medium text-slate-600">
                                    {form.isActive ? "Active" : "Paused"}
                                </span>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="rule-trigger">Trigger Condition (IF) *</Label>
                            <Input
                                id="rule-trigger"
                                value={form.trigger}
                                onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                                placeholder="e.g. Late Mark Count > 3"
                                className={`font-mono text-sm ${formErrors.trigger ? "border-rose-400" : ""}`}
                            />
                            <FieldError msg={formErrors.trigger} />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="rule-action">Automated Action (THEN) *</Label>
                            <Input
                                id="rule-action"
                                value={form.action}
                                onChange={(e) => setForm({ ...form, action: e.target.value })}
                                placeholder="e.g. Send Email Notification to Manager"
                                className={`font-mono text-sm ${formErrors.action ? "border-rose-400" : ""}`}
                            />
                            <FieldError msg={formErrors.action} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveRule}>
                            {editingRule ? "Save Changes" : "Create Rule"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Global Config Dialog */}
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Global Automation Config</DialogTitle>
                        <DialogDescription>
                            Engine-wide defaults applied to every automation rule.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-2">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                                <p className="font-bold text-slate-800">Enable All Automations</p>
                                <p className="text-xs text-slate-500">Master kill-switch for the entire engine.</p>
                            </div>
                            <Switch
                                checked={globalConfig.enableAllAutomations}
                                onCheckedChange={(v) => setGlobalConfig({ ...globalConfig, enableAllAutomations: v })}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                                <p className="font-bold text-slate-800">Notify on Failure</p>
                                <p className="text-xs text-slate-500">Email admin when any rule fails execution.</p>
                            </div>
                            <Switch
                                checked={globalConfig.notifyOnFailure}
                                onCheckedChange={(v) => setGlobalConfig({ ...globalConfig, notifyOnFailure: v })}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Execution Mode</Label>
                            <Select
                                value={globalConfig.executionMode}
                                onValueChange={(v: 'realtime' | 'batch' | 'scheduled') => setGlobalConfig({ ...globalConfig, executionMode: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="realtime">Real-time</SelectItem>
                                    <SelectItem value="batch">Batch (Hourly)</SelectItem>
                                    <SelectItem value="scheduled">Scheduled (Nightly)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="max-conc">Max Concurrent Runs</Label>
                            <Input
                                id="max-conc"
                                type="number"
                                min={1}
                                max={100}
                                value={globalConfig.maxConcurrentRuns}
                                onChange={(e) => setGlobalConfig({ ...globalConfig, maxConcurrentRuns: Number(e.target.value) || 1 })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfigOpen(false)}>Cancel</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={saveGlobalConfig}>
                            Save Config
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this automation rule?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove the rule from the engine. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AutomationRulesPage;
