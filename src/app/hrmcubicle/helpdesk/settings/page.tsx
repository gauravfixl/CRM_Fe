"use client"

import React, { useState } from "react";
import {
    Settings2,
    Save,
    Plus,
    Trash2,
    ChevronRight,
    Clock,
    Shuffle,
    Bell,
    ShieldCheck,
    Zap,
    Activity,
    Workflow,
    AlertTriangle,
    Mail,
    Smartphone,
    X,
    Lock,
    Layers,
    Gauge,
    Edit3,
    Pencil,
    MessageSquare,
    Copy,
    Check
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
    useHelpdeskStore,
    type CategoryDef,
    type SLARule,
    type AutomationRule,
    type NotificationTemplate,
    type Ticket as TicketType
} from "@/shared/data/helpdesk-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const priorityColors: Record<TicketType["priority"], string> = {
    Urgent: "bg-rose-50 text-rose-600",
    High: "bg-amber-50 text-amber-600",
    Medium: "bg-indigo-50 text-indigo-600",
    Low: "bg-emerald-50 text-emerald-600"
};

const HelpdeskSettingsPage = () => {
    const {
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubCategory,
        removeSubCategory,
        slaRules,
        addSLARule,
        updateSLARule,
        deleteSLARule,
        automations,
        addAutomation,
        updateAutomation,
        deleteAutomation,
        toggleAutomation,
        notificationTemplates,
        updateNotificationTemplate,
        toggleNotificationTemplate,
        addNotificationTemplate,
        deleteNotificationTemplate,
        securitySettings,
        toggleSecuritySetting
    } = useHelpdeskStore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("categories");

    // Category dialog state
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryDef | null>(null);
    const [categoryForm, setCategoryForm] = useState({ name: "", subInput: "", subs: [] as string[] });

    // Sub-category add state per card
    const [subInputs, setSubInputs] = useState<Record<string, string>>({});
    const [subInputOpen, setSubInputOpen] = useState<string | null>(null);

    // SLA dialog
    const [isSLADialogOpen, setIsSLADialogOpen] = useState(false);
    const [editingSLA, setEditingSLA] = useState<SLARule | null>(null);
    const [slaForm, setSLAForm] = useState<Omit<SLARule, 'id'>>({
        priority: "Medium",
        responseTimeHours: 4,
        resolutionTimeHours: 24,
        escalationContact: "",
        escalationEnabled: false
    });

    // Automation dialog
    const [isAutomationDialogOpen, setIsAutomationDialogOpen] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState<AutomationRule | null>(null);
    const [autoForm, setAutoForm] = useState<Omit<AutomationRule, 'id'>>({
        title: "",
        description: "",
        enabled: true,
        type: "custom",
        condition: ""
    });

    // Notification template dialog
    const [isTplDialogOpen, setIsTplDialogOpen] = useState(false);
    const [editingTpl, setEditingTpl] = useState<NotificationTemplate | null>(null);
    const [tplForm, setTplForm] = useState<Omit<NotificationTemplate, 'id'>>({
        channel: "email",
        name: "",
        subject: "",
        body: "",
        enabled: true
    });

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<{ kind: "category" | "sla" | "automation" | "template"; id: string; label: string } | null>(null);

    const sections = [
        { id: "categories", label: "Categories & Routing", icon: Layers },
        { id: "sla", label: "SLA Policies", icon: Gauge },
        { id: "automations", label: "Auto-Assigned Rules", icon: Workflow },
        { id: "notifications", label: "Alert Templates", icon: Bell },
        { id: "access", label: "Functional Security", icon: ShieldCheck },
    ];

    const openNewCategory = () => {
        setEditingCategory(null);
        setCategoryForm({ name: "", subInput: "", subs: [] });
        setIsCategoryDialogOpen(true);
    };

    const openEditCategory = (cat: CategoryDef) => {
        setEditingCategory(cat);
        setCategoryForm({ name: cat.name, subInput: "", subs: [...cat.subCategories] });
        setIsCategoryDialogOpen(true);
    };

    const saveCategory = () => {
        const name = categoryForm.name.trim();
        if (!name) {
            toast({ title: "Name Required", description: "Category name cannot be empty.", variant: "destructive" });
            return;
        }
        if (name.length < 2) {
            toast({ title: "Too Short", description: "Category name must be at least 2 characters.", variant: "destructive" });
            return;
        }
        if (name.length > 50) {
            toast({ title: "Too Long", description: "Category name must be under 50 characters.", variant: "destructive" });
            return;
        }
        const dupe = categories.find(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingCategory?.id);
        if (dupe) {
            toast({ title: "Duplicate", description: "A category with this name already exists.", variant: "destructive" });
            return;
        }
        if (editingCategory) {
            updateCategory(editingCategory.id, { name, subCategories: categoryForm.subs });
            toast({ title: "Category Updated", description: `${name} has been updated.` });
        } else {
            addCategory(name, categoryForm.subs);
            toast({ title: "Category Created", description: `${name} added to routing catalog.` });
        }
        setIsCategoryDialogOpen(false);
    };

    const addSubToForm = () => {
        const val = categoryForm.subInput.trim();
        if (!val) return;
        if (categoryForm.subs.includes(val)) {
            toast({ title: "Already Exists", description: "This sub-category is already added.", variant: "destructive" });
            return;
        }
        setCategoryForm({ ...categoryForm, subs: [...categoryForm.subs, val], subInput: "" });
    };

    const openNewSLA = () => {
        setEditingSLA(null);
        setSLAForm({ priority: "Medium", responseTimeHours: 4, resolutionTimeHours: 24, escalationContact: "", escalationEnabled: false });
        setIsSLADialogOpen(true);
    };

    const openEditSLA = (rule: SLARule) => {
        setEditingSLA(rule);
        setSLAForm({
            priority: rule.priority,
            responseTimeHours: rule.responseTimeHours,
            resolutionTimeHours: rule.resolutionTimeHours,
            escalationContact: rule.escalationContact || "",
            escalationEnabled: rule.escalationEnabled
        });
        setIsSLADialogOpen(true);
    };

    const saveSLA = () => {
        if (!["Urgent", "High", "Medium", "Low"].includes(slaForm.priority)) {
            toast({ title: "Invalid Priority", description: "Select a valid priority class.", variant: "destructive" });
            return;
        }
        if (!Number.isFinite(slaForm.responseTimeHours) || slaForm.responseTimeHours <= 0) {
            toast({ title: "Invalid Response Hours", description: "Response hours must be a positive number.", variant: "destructive" });
            return;
        }
        if (!Number.isFinite(slaForm.resolutionTimeHours) || slaForm.resolutionTimeHours <= 0) {
            toast({ title: "Invalid Resolution Hours", description: "Resolution hours must be a positive number.", variant: "destructive" });
            return;
        }
        if (slaForm.responseTimeHours > 720 || slaForm.resolutionTimeHours > 720) {
            toast({ title: "Too Large", description: "Hours must be within 720 (30 days).", variant: "destructive" });
            return;
        }
        if (slaForm.responseTimeHours > slaForm.resolutionTimeHours) {
            toast({ title: "Invalid Range", description: "Response time cannot exceed resolution time.", variant: "destructive" });
            return;
        }
        if (slaForm.escalationEnabled && slaForm.escalationContact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(slaForm.escalationContact)) {
            toast({ title: "Invalid Email", description: "Escalation contact must be a valid email.", variant: "destructive" });
            return;
        }
        // Duplicate priority check (only one rule per priority)
        const dupe = slaRules.find(r => r.priority === slaForm.priority && r.id !== editingSLA?.id);
        if (dupe) {
            toast({ title: "Duplicate", description: `An SLA rule for ${slaForm.priority} already exists.`, variant: "destructive" });
            return;
        }
        if (editingSLA) {
            updateSLARule(editingSLA.id, slaForm);
            toast({ title: "SLA Updated", description: `${slaForm.priority} priority SLA saved.` });
        } else {
            addSLARule(slaForm);
            toast({ title: "SLA Created", description: `${slaForm.priority} priority SLA added.` });
        }
        setIsSLADialogOpen(false);
    };

    const openNewAutomation = () => {
        setEditingAutomation(null);
        setAutoForm({ title: "", description: "", enabled: true, type: "custom", condition: "" });
        setIsAutomationDialogOpen(true);
    };

    const openEditAutomation = (rule: AutomationRule) => {
        setEditingAutomation(rule);
        setAutoForm({
            title: rule.title,
            description: rule.description,
            enabled: rule.enabled,
            type: rule.type,
            condition: rule.condition || ""
        });
        setIsAutomationDialogOpen(true);
    };

    const saveAutomation = () => {
        const title = autoForm.title.trim();
        const desc = autoForm.description.trim();
        if (!title || title.length < 3) {
            toast({ title: "Title Required", description: "Title must be at least 3 characters.", variant: "destructive" });
            return;
        }
        if (title.length > 80) {
            toast({ title: "Title Too Long", description: "Title must be under 80 characters.", variant: "destructive" });
            return;
        }
        if (!desc || desc.length < 10) {
            toast({ title: "Description Required", description: "Description must be at least 10 characters.", variant: "destructive" });
            return;
        }
        if (desc.length > 300) {
            toast({ title: "Description Too Long", description: "Description must be under 300 characters.", variant: "destructive" });
            return;
        }
        if (!["routing", "auto-close", "sentiment", "escalation", "custom"].includes(autoForm.type)) {
            toast({ title: "Invalid Type", description: "Select a valid automation type.", variant: "destructive" });
            return;
        }
        if (editingAutomation) {
            updateAutomation(editingAutomation.id, { ...autoForm, title, description: desc });
            toast({ title: "Rule Updated", description: `${title} saved.` });
        } else {
            addAutomation({ ...autoForm, title, description: desc });
            toast({ title: "Rule Created", description: `${title} added to automation workflow.` });
        }
        setIsAutomationDialogOpen(false);
    };

    const openEditTpl = (tpl: NotificationTemplate) => {
        setEditingTpl(tpl);
        setTplForm({
            channel: tpl.channel,
            name: tpl.name,
            subject: tpl.subject,
            body: tpl.body,
            enabled: tpl.enabled
        });
        setIsTplDialogOpen(true);
    };

    const openNewTpl = () => {
        setEditingTpl(null);
        setTplForm({ channel: "email", name: "", subject: "", body: "", enabled: true });
        setIsTplDialogOpen(true);
    };

    const saveTpl = () => {
        const name = tplForm.name.trim();
        const body = tplForm.body.trim();
        const subject = tplForm.subject.trim();
        if (!name || name.length < 3) {
            toast({ title: "Name Required", description: "Template name must be at least 3 characters.", variant: "destructive" });
            return;
        }
        if (name.length > 60) {
            toast({ title: "Too Long", description: "Template name must be under 60 characters.", variant: "destructive" });
            return;
        }
        if (tplForm.channel === "email" && !subject) {
            toast({ title: "Subject Required", description: "Email templates need a subject line.", variant: "destructive" });
            return;
        }
        if (subject && subject.length > 150) {
            toast({ title: "Subject Too Long", description: "Subject must be under 150 characters.", variant: "destructive" });
            return;
        }
        if (!body || body.length < 10) {
            toast({ title: "Body Required", description: "Template body must be at least 10 characters.", variant: "destructive" });
            return;
        }
        if (body.length > 2000) {
            toast({ title: "Body Too Long", description: "Template body must be under 2000 characters.", variant: "destructive" });
            return;
        }
        if (!["email", "push", "sms"].includes(tplForm.channel)) {
            toast({ title: "Invalid Channel", description: "Select a valid channel.", variant: "destructive" });
            return;
        }
        const payload = { ...tplForm, name, body, subject };
        if (editingTpl) {
            updateNotificationTemplate(editingTpl.id, payload);
            toast({ title: "Template Saved", description: `${name} updated successfully.` });
        } else {
            addNotificationTemplate(payload);
            toast({ title: "Template Created", description: `${name} added to alert system.` });
        }
        setIsTplDialogOpen(false);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        switch (deleteTarget.kind) {
            case "category":
                deleteCategory(deleteTarget.id);
                toast({ title: "Category Removed", description: `${deleteTarget.label} deleted from catalog.` });
                break;
            case "sla":
                deleteSLARule(deleteTarget.id);
                toast({ title: "SLA Removed", description: `${deleteTarget.label} rule deleted.` });
                break;
            case "automation":
                deleteAutomation(deleteTarget.id);
                toast({ title: "Rule Removed", description: `${deleteTarget.label} deleted from workflow.` });
                break;
            case "template":
                deleteNotificationTemplate(deleteTarget.id);
                toast({ title: "Template Removed", description: `${deleteTarget.label} deleted.` });
                break;
        }
        setDeleteTarget(null);
    };

    const handleAddSubInline = (catId: string) => {
        const val = (subInputs[catId] || "").trim();
        if (!val) {
            toast({ title: "Empty", description: "Enter sub-category name.", variant: "destructive" });
            return;
        }
        const cat = categories.find(c => c.id === catId);
        if (cat?.subCategories.includes(val)) {
            toast({ title: "Already Exists", description: "This sub-category already exists.", variant: "destructive" });
            return;
        }
        addSubCategory(catId, val);
        setSubInputs({ ...subInputs, [catId]: "" });
        setSubInputOpen(null);
        toast({ title: "Sub-category Added", description: `${val} added under ${cat?.name}.` });
    };

    const automationIcons: Record<AutomationRule["type"], any> = {
        routing: Shuffle,
        "auto-close": Save,
        sentiment: Activity,
        escalation: AlertTriangle,
        custom: Zap
    };

    const channelIcon = (ch: NotificationTemplate["channel"]) => ch === "email" ? Mail : ch === "push" ? Bell : Smartphone;

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Settings2 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase">Operational Engine</h1>
                        <p className="text-sm font-medium text-slate-500">Configure global helpdesk protocols & triggers</p>
                    </div>
                </div>
                <Button
                    onClick={() => toast({ title: "Configuration Synced", description: `All ${activeTab} changes are persisted.` })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all"
                >
                    <Save size={16} /> Sync Status
                </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Navigation Sidebar */}
                <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col p-6 shrink-0">
                    <div className="space-y-1">
                        {sections.map((sec) => (
                            <button
                                key={sec.id}
                                onClick={() => setActiveTab(sec.id)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === sec.id ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <sec.icon size={18} className={activeTab === sec.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{sec.label}</span>
                                </div>
                                <ChevronRight size={14} className={`transition-transform duration-300 ${activeTab === sec.id ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto p-4 bg-slate-900 rounded-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Engine Version</span>
                            <span className="text-xs font-bold text-white block">V2.4.0 (Stable)</span>
                        </div>
                        <Activity size={60} className="absolute -right-4 -bottom-4 text-white/5 pointer-events-none group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-[#f1f5f9]/30">
                    <ScrollArea className="h-full">
                        <div className="max-w-4xl mx-auto p-12 lg:px-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-10 pb-20"
                                >
                                    {/* ========== CATEGORIES ========== */}
                                    {activeTab === "categories" && (
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Categorization & Logic</h2>
                                                <p className="text-sm font-medium text-slate-500">Define how tickets are classified and routed across departments.</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {categories.map((cat) => (
                                                    <Card key={cat.id} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
                                                        <CardContent className="p-0">
                                                            <div className="p-6 flex items-center justify-between border-b border-slate-50">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                                                        {cat.name[0]}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{cat.name}</h4>
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.subCategories.length} Sub-issues</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-xl bg-slate-50" onClick={() => openEditCategory(cat)}><Pencil size={15} /></Button>
                                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-500 rounded-xl bg-slate-50" onClick={() => setDeleteTarget({ kind: "category", id: cat.id, label: cat.name })}><Trash2 size={15} /></Button>
                                                                </div>
                                                            </div>
                                                            <div className="px-6 py-4 bg-slate-50/50 flex flex-wrap gap-2 items-center">
                                                                {cat.subCategories.map((sub) => (
                                                                    <Badge key={sub} className="bg-white text-slate-500 shadow-sm border-none font-bold text-[9px] h-6 px-3 uppercase tracking-widest flex items-center gap-1.5 group">
                                                                        {sub}
                                                                        <X size={10} className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500" onClick={() => { removeSubCategory(cat.id, sub); toast({ title: "Removed", description: `${sub} removed.` }); }} />
                                                                    </Badge>
                                                                ))}
                                                                {subInputOpen === cat.id ? (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Input
                                                                            autoFocus
                                                                            placeholder="Name..."
                                                                            value={subInputs[cat.id] || ""}
                                                                            onChange={(e) => setSubInputs({ ...subInputs, [cat.id]: e.target.value })}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "Enter") handleAddSubInline(cat.id);
                                                                                if (e.key === "Escape") { setSubInputOpen(null); setSubInputs({ ...subInputs, [cat.id]: "" }); }
                                                                            }}
                                                                            className="h-6 w-32 px-2 text-[10px] font-bold rounded-md border-indigo-200"
                                                                        />
                                                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-600" onClick={() => handleAddSubInline(cat.id)}><Check size={12} /></Button>
                                                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400" onClick={() => { setSubInputOpen(null); setSubInputs({ ...subInputs, [cat.id]: "" }); }}><X size={12} /></Button>
                                                                    </div>
                                                                ) : (
                                                                    <Badge className="bg-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-100 border-none font-bold text-[9px] h-6 px-3 uppercase tracking-widest" onClick={() => setSubInputOpen(cat.id)}>
                                                                        + New Sub-category
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                <Button variant="outline" className="h-16 w-full rounded-2xl border-dashed border-2 border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-[11px] gap-2 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all" onClick={openNewCategory}>
                                                    <Plus size={16} /> Insert Functional Cluster
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ========== SLA ========== */}
                                    {activeTab === "sla" && (
                                        <div className="space-y-8">
                                            <div className="flex items-end justify-between">
                                                <div className="space-y-2">
                                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Service Level Governance</h2>
                                                    <p className="text-sm font-medium text-slate-500">Define response and resolution timelines based on priority matrices.</p>
                                                </div>
                                                <Button onClick={openNewSLA} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-5 font-bold gap-2 text-xs uppercase tracking-widest shadow-sm">
                                                    <Plus size={14} /> New Rule
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {slaRules.map((rule) => (
                                                    <Card key={rule.id} className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
                                                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                                                            <div className="space-y-1">
                                                                <Badge className={`${priorityColors[rule.priority]} font-black text-[9px] h-5 px-3 uppercase tracking-widest border-none`}>{rule.priority}</Badge>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Priority Class</p>
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center gap-2 text-slate-900">
                                                                    <Clock size={16} className="text-amber-500" />
                                                                    <span className="text-sm font-black">{rule.responseTimeHours}h</span>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Response</span>
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center gap-2 text-slate-900">
                                                                    <Clock size={16} className="text-indigo-600" />
                                                                    <span className="text-sm font-black">{rule.resolutionTimeHours}h</span>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution</span>
                                                            </div>

                                                            <div className="flex flex-col items-start">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Escalation</span>
                                                                <Switch checked={rule.escalationEnabled} onCheckedChange={(v) => { updateSLARule(rule.id, { escalationEnabled: v }); toast({ title: v ? "Escalation ON" : "Escalation OFF", description: `${rule.priority} auto-escalation ${v ? "enabled" : "disabled"}.` }); }} />
                                                            </div>

                                                            <div className="flex items-center justify-end gap-2 md:col-span-1">
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-xl bg-slate-50" onClick={() => openEditSLA(rule)}><Pencil size={15} /></Button>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-500 rounded-xl bg-slate-50" onClick={() => setDeleteTarget({ kind: "sla", id: rule.id, label: `${rule.priority} SLA` })}><Trash2 size={15} /></Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                {slaRules.length === 0 && (
                                                    <div className="p-10 text-center text-slate-400 font-bold italic text-sm bg-white rounded-2xl border-2 border-dashed border-slate-100">
                                                        No SLA rules defined. Add one to start enforcing deadlines.
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6 bg-slate-900 rounded-[32px] text-white flex items-center justify-between shadow-2xl overflow-hidden relative group">
                                                <div className="relative z-10 flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                                                        <AlertTriangle size={28} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black tracking-tight uppercase leading-none mb-1">Impact Warning</h4>
                                                        <p className="text-xs font-medium text-slate-400 leading-relaxed italic">Reducing SLA hours may impact agent CSAT scores if workload is high.</p>
                                                    </div>
                                                </div>
                                                <Zap size={140} className="absolute -right-10 -bottom-10 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-700" />
                                            </div>
                                        </div>
                                    )}

                                    {/* ========== AUTOMATIONS ========== */}
                                    {activeTab === "automations" && (
                                        <div className="space-y-8">
                                            <div className="flex items-end justify-between">
                                                <div className="space-y-2">
                                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Automation Workflow</h2>
                                                    <p className="text-sm font-medium text-slate-500">Intelligent triggers to route tickets and maintain desk hygiene.</p>
                                                </div>
                                                <Button onClick={openNewAutomation} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-5 font-bold gap-2 text-xs uppercase tracking-widest shadow-sm">
                                                    <Plus size={14} /> New Rule
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {automations.map((rule) => {
                                                    const Icon = automationIcons[rule.type] || Zap;
                                                    return (
                                                        <Card key={rule.id} className="rounded-2xl border-none shadow-sm bg-white overflow-hidden hover:shadow-lg transition-all">
                                                            <CardContent className="p-8 flex items-center justify-between gap-4">
                                                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shadow-sm ${rule.enabled ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                                        <Icon size={20} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{rule.title}</h4>
                                                                        <p className="text-xs font-medium text-slate-500 mt-1">{rule.description}</p>
                                                                        {rule.condition && <p className="text-[10px] font-mono text-indigo-600 mt-2 bg-indigo-50 inline-block px-2 py-0.5 rounded">{rule.condition}</p>}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Switch checked={rule.enabled} onCheckedChange={() => { toggleAutomation(rule.id); toast({ title: rule.enabled ? "Disabled" : "Enabled", description: `${rule.title} ${rule.enabled ? "disabled" : "enabled"}.` }); }} />
                                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-xl bg-slate-50" onClick={() => openEditAutomation(rule)}><Pencil size={14} /></Button>
                                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-500 rounded-xl bg-slate-50" onClick={() => setDeleteTarget({ kind: "automation", id: rule.id, label: rule.title })}><Trash2 size={14} /></Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}
                                                {automations.length === 0 && (
                                                    <div className="p-10 text-center text-slate-400 font-bold italic text-sm bg-white rounded-2xl border-2 border-dashed border-slate-100">
                                                        No automation rules yet. Create one to streamline operations.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ========== NOTIFICATIONS ========== */}
                                    {activeTab === "notifications" && (
                                        <div className="space-y-8">
                                            <div className="flex items-end justify-between">
                                                <div className="space-y-2">
                                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Alert Dispatch System</h2>
                                                    <p className="text-sm font-medium text-slate-500">Configure multi-channel templates for stakeholder communication.</p>
                                                </div>
                                                <Button onClick={openNewTpl} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-5 font-bold gap-2 text-xs uppercase tracking-widest shadow-sm">
                                                    <Plus size={14} /> New Template
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {notificationTemplates.map((tpl) => {
                                                    const Icon = channelIcon(tpl.channel);
                                                    return (
                                                        <Card key={tpl.id} className={`rounded-[28px] border-none shadow-sm bg-white p-8 space-y-6 ${tpl.locked ? 'opacity-60' : ''}`}>
                                                            <div className="flex items-center justify-between">
                                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm ${tpl.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                                                    <Icon size={18} />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Switch checked={tpl.enabled} disabled={tpl.locked} onCheckedChange={() => { toggleNotificationTemplate(tpl.id); toast({ title: tpl.enabled ? "Paused" : "Activated", description: `${tpl.name} ${tpl.enabled ? "paused" : "activated"}.` }); }} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{tpl.name}</h4>
                                                                    {tpl.locked && <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] h-4 font-bold uppercase px-2">Enterprise Only</Badge>}
                                                                </div>
                                                                <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed italic line-clamp-2">"{tpl.body}"</p>
                                                            </div>
                                                            {tpl.locked ? (
                                                                <Button disabled className="w-full h-11 bg-slate-100 text-slate-300 border-none text-[10px] font-bold uppercase tracking-widest rounded-xl">Upgrade to Unlock</Button>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Button variant="outline" className="flex-1 h-11 bg-slate-50 border-slate-100 text-[10px] font-bold uppercase tracking-widest rounded-xl gap-2" onClick={() => openEditTpl(tpl)}>
                                                                        <Edit3 size={14} /> Edit Template
                                                                    </Button>
                                                                    <Button variant="outline" size="icon" className="h-11 w-11 text-slate-400 hover:text-rose-500 rounded-xl border-slate-100" onClick={() => setDeleteTarget({ kind: "template", id: tpl.id, label: tpl.name })}><Trash2 size={14} /></Button>
                                                                </div>
                                                            )}
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* ========== SECURITY ========== */}
                                    {activeTab === "access" && (
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Functional Security</h2>
                                                <p className="text-sm font-medium text-slate-500">Govern access rights and sensitive data visibility protocols.</p>
                                            </div>

                                            <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                                                <div className="p-8 space-y-8">
                                                    {securitySettings.map((item, idx) => (
                                                        <div key={item.id} className={`flex items-center justify-between ${idx < securitySettings.length - 1 ? 'pb-6 border-b border-slate-50' : ''}`}>
                                                            <div className="flex-1 pr-4">
                                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.label}</h4>
                                                                <p className="text-xs font-medium text-slate-400 mt-1">{item.description}</p>
                                                            </div>
                                                            <Switch checked={item.value} onCheckedChange={() => { toggleSecuritySetting(item.id); toast({ title: item.value ? "Disabled" : "Enabled", description: `${item.label} ${item.value ? "disabled" : "enabled"}.` }); }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>

                                            <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl border-dashed flex items-center gap-6">
                                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                                                    <Lock size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-[11px] font-black text-rose-900 uppercase tracking-widest leading-none">Privacy Guard Active</h5>
                                                    <p className="text-[10px] font-medium text-rose-700/70 leading-relaxed mt-2 italic">Your data is currently being handled under Global Standards. Contact IT for specialized custom overrides.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">{editingCategory ? "Update classification and sub-issues." : "Add a new ticket cluster to the catalog."}</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</Label>
                            <Input placeholder="e.g. Procurement" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub-categories</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g. Vendor onboarding"
                                    value={categoryForm.subInput}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, subInput: e.target.value })}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubToForm(); } }}
                                    className="h-10 rounded-xl"
                                />
                                <Button type="button" onClick={addSubToForm} className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase">Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2 min-h-[40px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                                {categoryForm.subs.length === 0 && <span className="text-[10px] text-slate-400 italic font-bold uppercase tracking-widest">No sub-categories yet</span>}
                                {categoryForm.subs.map((sub, i) => (
                                    <Badge key={i} className="bg-white text-slate-600 border-slate-200 font-bold text-[10px] h-7 px-3 gap-2 shadow-sm">
                                        {sub}
                                        <X size={11} className="cursor-pointer hover:text-rose-500" onClick={() => setCategoryForm({ ...categoryForm, subs: categoryForm.subs.filter((_, idx) => idx !== i) })} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveCategory} className="bg-indigo-600 hover:bg-indigo-700 text-white">{editingCategory ? "Save Changes" : "Create Category"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SLA Dialog */}
            <Dialog open={isSLADialogOpen} onOpenChange={setIsSLADialogOpen}>
                <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">{editingSLA ? "Reconfigure SLA" : "New SLA Rule"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Configure response and resolution timelines.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority Class</Label>
                            <Select value={slaForm.priority} onValueChange={(v) => setSLAForm({ ...slaForm, priority: v as any })}>
                                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Response (Hours)</Label>
                                <Input type="number" min={1} value={slaForm.responseTimeHours} onChange={(e) => setSLAForm({ ...slaForm, responseTimeHours: Number(e.target.value) || 0 })} className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution (Hours)</Label>
                                <Input type="number" min={1} value={slaForm.resolutionTimeHours} onChange={(e) => setSLAForm({ ...slaForm, resolutionTimeHours: Number(e.target.value) || 0 })} className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escalation Contact (optional)</Label>
                            <Input placeholder="supervisor@firm.com" value={slaForm.escalationContact} onChange={(e) => setSLAForm({ ...slaForm, escalationContact: e.target.value })} className="h-11 rounded-xl" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <div>
                                <Label className="text-[11px] font-bold text-slate-700">Auto-escalate on breach</Label>
                                <p className="text-[10px] text-slate-400">Notify escalation contact when SLA is breached.</p>
                            </div>
                            <Switch checked={slaForm.escalationEnabled} onCheckedChange={(v) => setSLAForm({ ...slaForm, escalationEnabled: v })} />
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsSLADialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveSLA} className="bg-indigo-600 hover:bg-indigo-700 text-white">{editingSLA ? "Save Rule" : "Create Rule"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Automation Dialog */}
            <Dialog open={isAutomationDialogOpen} onOpenChange={setIsAutomationDialogOpen}>
                <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">{editingAutomation ? "Edit Automation" : "New Automation"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Define a trigger to reduce manual ops.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rule Title</Label>
                            <Input placeholder="e.g. Auto-escalate breached HR tickets" value={autoForm.title} onChange={(e) => setAutoForm({ ...autoForm, title: e.target.value })} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</Label>
                            <Textarea placeholder="Explain what this rule does" value={autoForm.description} onChange={(e) => setAutoForm({ ...autoForm, description: e.target.value })} className="min-h-[80px] rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</Label>
                                <Select value={autoForm.type} onValueChange={(v) => setAutoForm({ ...autoForm, type: v as any })}>
                                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="routing">Smart Routing</SelectItem>
                                        <SelectItem value="auto-close">Auto-Close</SelectItem>
                                        <SelectItem value="sentiment">Sentiment Triage</SelectItem>
                                        <SelectItem value="escalation">Escalation</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</Label>
                                <div className="flex items-center gap-3 h-11">
                                    <Switch checked={autoForm.enabled} onCheckedChange={(v) => setAutoForm({ ...autoForm, enabled: v })} />
                                    <span className="text-xs font-bold text-slate-600">{autoForm.enabled ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Condition (optional)</Label>
                            <Input placeholder="e.g. priority == Urgent AND inactive > 48h" value={autoForm.condition} onChange={(e) => setAutoForm({ ...autoForm, condition: e.target.value })} className="h-11 rounded-xl font-mono text-xs" />
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsAutomationDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveAutomation} className="bg-indigo-600 hover:bg-indigo-700 text-white">{editingAutomation ? "Save Rule" : "Create Rule"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Notification Template Dialog */}
            <Dialog open={isTplDialogOpen} onOpenChange={setIsTplDialogOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="text-lg font-bold text-slate-900 uppercase">{editingTpl ? "Edit Template" : "New Template"}</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Supported placeholders: [TicketID], [EmployeeName], [Subject]</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Channel</Label>
                                <Select value={tplForm.channel} onValueChange={(v) => setTplForm({ ...tplForm, channel: v as any })}>
                                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="push">Push</SelectItem>
                                        <SelectItem value="sms">SMS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Template Name</Label>
                                <Input placeholder="e.g. Ticket Closed" value={tplForm.name} onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })} className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line</Label>
                            <Input placeholder="e.g. Your ticket [TicketID] has been updated" value={tplForm.subject} onChange={(e) => setTplForm({ ...tplForm, subject: e.target.value })} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Body</Label>
                            <Textarea placeholder="Hi [EmployeeName], your ticket [TicketID] has been resolved..." value={tplForm.body} onChange={(e) => setTplForm({ ...tplForm, body: e.target.value })} className="min-h-[140px] rounded-xl font-medium text-sm" />
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsTplDialogOpen(false)}>Cancel</Button>
                        <Button onClick={saveTpl} className="bg-indigo-600 hover:bg-indigo-700 text-white">{editingTpl ? "Save Template" : "Create Template"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {deleteTarget?.label}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove this entry from the configuration.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default HelpdeskSettingsPage;
