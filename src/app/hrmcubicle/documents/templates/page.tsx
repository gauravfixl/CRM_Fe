"use client";

import React, { useState } from 'react';
import {
    Plus,
    Search,
    Layout,
    Code,
    Settings,
    Copy,
    Trash2,
    Edit3,
    Eye,
    FileCode,
    Sparkles,
    MoreVertical,
    ChevronRight,
    Braces,
    Type,
    Save,
    X,
    Compass,
    Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useDocumentsStore, type LetterTemplate } from "@/shared/data/documents-store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { required, minLength, maxLength, isUnique, isPlaceholderTag, firstError } from "@/shared/utils/validators";

const TemplatesPage = () => {
    const { letterTemplates, addTemplate, updateTemplate, deleteTemplate, duplicateTemplate } = useDocumentsStore();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<LetterTemplate | null>(null);
    const [previewingTemplate, setPreviewingTemplate] = useState<LetterTemplate | null>(null);
    const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [templateType, setTemplateType] = useState("all");
    const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);

    const [newTemplate, setNewTemplate] = useState({
        name: "",
        type: "Offer Letter" as LetterTemplate['type'],
        content: "",
        placeholders: [] as string[]
    });

    const [currentPlaceholder, setCurrentPlaceholder] = useState("");
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

    const filteredTemplates = letterTemplates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = templateType === "all" || template.type === templateType;
        return matchesSearch && matchesType;
    });

    const handleAddPlaceholder = () => {
        const tag = currentPlaceholder.trim();
        const err = firstError(
            required(tag, "Placeholder"),
            isPlaceholderTag(tag, "Placeholder"),
            maxLength(tag, 40, "Placeholder"),
        );
        if (err) { toast.error(err); return; }
        if (newTemplate.placeholders.includes(tag)) {
            toast.error("Placeholder already exists");
            return;
        }
        setNewTemplate({
            ...newTemplate,
            placeholders: [...newTemplate.placeholders, tag]
        });
        setCurrentPlaceholder("");
    };

    const validateTemplate = (t: { name: string; content: string; type: string }, ignoreId?: string): string | null => {
        const existingNames = letterTemplates.filter(x => x.id !== ignoreId).map(x => x.name);
        return firstError(
            required(t.name, "Template name"),
            minLength(t.name, 3, "Template name"),
            maxLength(t.name, 120, "Template name"),
            isUnique(t.name, existingNames, "Template name"),
            required(t.type, "Template type"),
            required(t.content, "Template content"),
            minLength(t.content, 20, "Template content"),
        );
    };

    const handleCreateTemplate = () => {
        const err = validateTemplate(newTemplate);
        if (err) { toast.error(err); return; }
        addTemplate({
            ...newTemplate,
            name: newTemplate.name.trim(),
            content: newTemplate.content.trim(),
        });
        setIsCreateOpen(false);
        setNewTemplate({ name: "", type: "Offer Letter", content: "", placeholders: [] });
        toast.success("Template created successfully");
    };

    const handleUpdateTemplate = () => {
        if (!editingTemplate) return;
        const err = validateTemplate(editingTemplate, editingTemplate.id);
        if (err) { toast.error(err); return; }
        updateTemplate(editingTemplate.id, {
            ...editingTemplate,
            name: editingTemplate.name.trim(),
            content: editingTemplate.content.trim(),
        });
        setEditingTemplate(null);
        toast.success("Template blueprint updated");
    };

    const handleAddPlaceholderToEdit = (tag: string) => {
        if (!editingTemplate) return;
        const t = tag.trim();
        const err = firstError(
            required(t, "Placeholder"),
            isPlaceholderTag(t, "Placeholder"),
            maxLength(t, 40, "Placeholder"),
        );
        if (err) { toast.error(err); return; }
        if (editingTemplate.placeholders.includes(t)) {
            toast.error("Placeholder already exists");
            return;
        }
        setEditingTemplate({
            ...editingTemplate,
            placeholders: [...editingTemplate.placeholders, t]
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans relative" style={{ zoom: "80%" }}>
            {/* Header section */}
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-start">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Document Templates</h1>
                        <p className="text-slate-500 font-semibold text-sm mt-1">Design and manage reusable blueprints for all organizational communications.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedTemplateIds.length > 0 && (
                            <Button
                                variant="outline"
                                className="h-11 rounded-xl text-rose-600 font-bold border-rose-100 bg-rose-50/50 px-6"
                                onClick={() => setBulkDeleteOpen(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete ({selectedTemplateIds.length})
                            </Button>
                        )}
                        <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-wide border-none">
                            <Plus className="w-4 h-4" /> Create Template
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full flex gap-10">
                {/* Sidebar Filter */}
                <div className="w-80 shrink-0 space-y-6">
                    <Card className="border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-[10px] font-bold tracking-wide text-slate-400">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <nav className="space-y-1">
                                {[
                                    { label: "All Templates", value: "all", icon: Layout },
                                    { label: "Offer Letters", value: "Offer Letter", icon: Type },
                                    { label: "Experience Docs", value: "Experience Letter", icon: FileCode },
                                    { label: "Exit Letters", value: "Relieving Letter", icon: Briefcase },
                                    { label: "Custom", value: "Custom", icon: Compass }
                                ].map((tab) => (
                                    <Button
                                        key={tab.value}
                                        variant="ghost"
                                        className={`w-full justify-between gap-3 px-5 h-12 group rounded-xl transition-all ${templateType === tab.value ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50'}`}
                                        onClick={() => setTemplateType(tab.value)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* @ts-ignore */}
                                            {tab.icon && <tab.icon size={16} className={`${templateType === tab.value ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-500'} transition-colors`} />}
                                            <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                                        </div>
                                        <Badge className={`border-none text-[9px] font-black px-2 py-0.5 rounded-md ${templateType === tab.value ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                                            {tab.value === 'all' ? letterTemplates.length : letterTemplates.filter(t => t.type === tab.value).length}
                                        </Badge>
                                    </Button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>

                    <Card className="border border-indigo-100 shadow-sm rounded-[2rem] bg-indigo-50/50 p-6 relative overflow-hidden group">
                        <div className="absolute top-[-20px] right-[-20px] h-32 w-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />
                        <div className="relative z-10 text-center">
                            <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm mx-auto border border-indigo-100">
                                <Sparkles size={18} className="text-amber-400" />
                            </div>
                            <h4 className="font-bold text-lg leading-tight mb-2 tracking-tight text-indigo-900">AI Assistant</h4>
                            <p className="text-[10px] font-medium text-indigo-600/60 leading-relaxed mb-6 tracking-wide">Draft legal documents in seconds with advanced LLM integration.</p>
                            <Button className="w-full bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-100 h-10 rounded-xl font-bold text-[9px] tracking-wide shadow-sm transition-all active:scale-95" onClick={() => setIsAiDialogOpen(true)}>Try AI Generator</Button>
                        </div>
                    </Card>
                </div>

                {/* Templates Grid Area */}
                <div className="flex-1 space-y-8">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -transform -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search active blueprints..."
                            className="h-16 pl-14 bg-white border-slate-100 rounded-[1.5rem] font-bold text-base focus:ring-[6px] focus:ring-indigo-100 focus:border-indigo-200 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredTemplates.map((template) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={template.id}
                                    className="group"
                                >
                                    <Card
                                        onClick={() => setPreviewingTemplate(template)}
                                        className={`border border-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500 bg-white rounded-[2rem] p-6 overflow-hidden relative border-t-4 cursor-pointer ${selectedTemplateIds.includes(template.id) ? 'border-t-indigo-600 bg-indigo-50/5' : 'border-t-indigo-600/10 hover:border-t-indigo-600'}`}
                                    >
                                        <div className="absolute top-4 left-4 z-20" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="rounded-lg border-slate-300 text-indigo-600 cursor-pointer w-4 h-4"
                                                checked={selectedTemplateIds.includes(template.id)}
                                                onChange={() => {
                                                    setSelectedTemplateIds(prev =>
                                                        prev.includes(template.id) ? prev.filter(i => i !== template.id) : [...prev, template.id]
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ml-8">
                                                <FileCode size={24} />
                                            </div>
                                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-none" onClick={() => setEditingTemplate(template)}>
                                                    <Edit3 size={18} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-10 w-10 text-slate-300 hover:text-slate-900 rounded-xl transition-all border-none p-0">
                                                            <MoreVertical size={20} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border border-slate-200 shadow-2xl bg-white font-sans">
                                                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wide">Options</DropdownMenuLabel>
                                                        <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-slate-50 text-start" onClick={() => setPreviewingTemplate(template)}>
                                                            <Eye size={16} className="text-indigo-500" /> Preview Blueprint
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-slate-50 text-start" onClick={() => { duplicateTemplate(template.id); toast.success(`Duplicated "${template.name}"`); }}>
                                                            <Copy size={16} className="text-indigo-500" /> Duplicate Version
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                        <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50 text-start" onClick={() => setDeleteTemplateId(template.id)}>
                                                            <Trash2 size={16} /> Delete Blueprint
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <div className="mb-6 text-start">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{template.name}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge className="bg-slate-100 text-slate-400 border-none px-3 py-1 font-bold text-[9px] tracking-wide rounded-lg">
                                                    {template.type}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex flex-wrap gap-2 text-start">
                                                {template.placeholders.slice(0, 4).map((p, i) => (
                                                    <div key={i} className="bg-indigo-50/50 text-indigo-500 px-3 py-1.5 rounded-xl font-bold text-[9px] tracking-tight border border-indigo-100/50 italic">
                                                        {"{{"}{p}{"}}"}
                                                    </div>
                                                ))}
                                                {template.placeholders.length > 4 && (
                                                    <div className="bg-slate-50 text-slate-400 px-3 py-1.5 rounded-xl font-bold text-[9px] border border-slate-100 italic">
                                                        +{template.placeholders.length - 4} more
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2">
                                                <span className="text-[10px] text-slate-300 font-bold tracking-wide whitespace-nowrap">Updated {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(template.updatedAt))}</span>
                                                <Button className="h-10 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl font-bold text-[10px] tracking-wide px-6 shadow-md transition-all active:scale-95 border-none" onClick={() => router.push("/hrmcubicle/documents/letters")}>
                                                    Use Template <ChevronRight size={14} className="ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="py-32 text-center bg-white rounded-[3rem] shadow-sm border border-slate-100 border-dashed">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100">
                                <Compass size={40} className="text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">No blueprints found</h3>
                            <p className="text-slate-400 font-bold text-xs mt-2 tracking-wide">Adjust your search or filter criteria</p>
                        </div>
                    )}
                </div>

                {/* AI Enrich Dialog */}
                <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                        <DialogHeader className="text-start">
                            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 border border-amber-100">
                                <Sparkles size={22} className="text-amber-500" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">AI Document Enrichment</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                                Advanced LLM-powered document generation is currently in development. This feature will allow you to auto-generate professional letter templates, suggest legal clauses, and enrich content with compliance-ready language.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-6">
                            <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-start space-y-2">
                                <p className="text-[10px] font-bold text-indigo-700 tracking-wide">Coming Soon</p>
                                <p className="text-[10px] font-medium text-indigo-500/70 leading-relaxed">AI-assisted drafting, clause suggestions, and automated template generation will be available in the next release.</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-8 font-bold text-[10px] tracking-wide border-none" onClick={() => setIsAiDialogOpen(false)}>Got It</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Create Template Sheet */}
                <SideFormSheet
                    open={isCreateOpen}
                    onOpenChange={(o) => {
                        setIsCreateOpen(o);
                        if (!o) {
                            setNewTemplate({ name: "", type: "Offer Letter", content: "", placeholders: [] });
                            setCurrentPlaceholder("");
                        }
                    }}
                    title="New Document Template"
                    description="Define Official Blueprints v3.0"
                    icon={<Save size={20} />}
                    accentColor="#4f46e5"
                    width="xl"
                    submitLabel="Save Template"
                    cancelLabel="Discard"
                    onSubmit={(e) => { e.preventDefault(); handleCreateTemplate(); }}
                >
                    <div className="space-y-4">
                        <Field label="Template Name" required>
                            <Input
                                placeholder="e.g., Senior Management Offer Letter"
                                value={newTemplate.name}
                                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                            />
                        </Field>
                        <Field label="Document Type" required>
                            <Select
                                value={newTemplate.type}
                                onValueChange={(val: any) => setNewTemplate({ ...newTemplate, type: val })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                                    <SelectItem value="Experience Letter">Experience Letter</SelectItem>
                                    <SelectItem value="Relieving Letter">Relieving Letter</SelectItem>
                                    <SelectItem value="Appointment Letter">Appointment Letter</SelectItem>
                                    <SelectItem value="Form Template">HR Form Template</SelectItem>
                                    <SelectItem value="Email Content">Email Template</SelectItem>
                                    <SelectItem value="Custom">Custom Template</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Template Content" required>
                            <div className="flex gap-2 mb-2">
                                <Button type="button" variant="outline" size="sm" className={`h-7 w-7 rounded-lg text-[10px] font-bold p-0 ${isBold ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : ''}`} onClick={() => setIsBold(!isBold)}>B</Button>
                                <Button type="button" variant="outline" size="sm" className={`h-7 w-7 rounded-lg text-[10px] font-bold p-0 italic ${isItalic ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : ''}`} onClick={() => setIsItalic(!isItalic)}>I</Button>
                            </div>
                            <Textarea
                                placeholder="Use {{placeholder_name}} for dynamic data..."
                                className={`min-h-[280px] font-mono text-sm ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''}`}
                                value={newTemplate.content}
                                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                            />
                        </Field>
                        <Field label="Placeholders">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="tag_name"
                                    value={currentPlaceholder}
                                    onChange={(e) => setCurrentPlaceholder(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPlaceholder(); } }}
                                />
                                <Button type="button" size="icon" className="h-10 w-10 bg-indigo-600 text-white rounded-lg shrink-0" onClick={handleAddPlaceholder}>
                                    <Plus size={18} />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {newTemplate.placeholders.map((p, i) => (
                                    <Badge key={i} className="bg-white text-indigo-600 border border-indigo-100 px-3 py-1.5 gap-2 group rounded-lg font-bold text-[10px] shadow-sm">
                                        {"{{"}{p}{"}}"}
                                        <X
                                            className="w-3 h-3 text-slate-300 group-hover:text-rose-500 cursor-pointer transition-colors"
                                            onClick={() => setNewTemplate({ ...newTemplate, placeholders: newTemplate.placeholders.filter((_, idx) => idx !== i) })}
                                        />
                                    </Badge>
                                ))}
                                {newTemplate.placeholders.length === 0 && (
                                    <p className="text-[10px] text-slate-400 font-bold italic w-full">No tags defined</p>
                                )}
                            </div>
                        </Field>
                    </div>
                </SideFormSheet>

                {/* Edit Template Sheet */}
                <SideFormSheet
                    open={!!editingTemplate}
                    onOpenChange={(o) => { if (!o) setEditingTemplate(null); }}
                    title="Sync Template Blueprint"
                    description="Update system architecture for consistent organizational output."
                    icon={<Edit3 size={20} />}
                    accentColor="#7c3aed"
                    width="xl"
                    submitLabel="Synchronize Blueprint"
                    cancelLabel="Discard Changes"
                    onSubmit={(e) => { e.preventDefault(); handleUpdateTemplate(); }}
                >
                    <div className="space-y-4">
                        <Field label="Refined Title" required>
                            <Input
                                placeholder="Blueprint title..."
                                value={editingTemplate?.name || ""}
                                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                            />
                        </Field>
                        <Field label="Output Format" required>
                            <Select
                                value={editingTemplate?.type}
                                onValueChange={(val: any) => setEditingTemplate(prev => prev ? { ...prev, type: val } : null)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                                    <SelectItem value="Experience Letter">Experience Letter</SelectItem>
                                    <SelectItem value="Relieving Letter">Relieving Letter</SelectItem>
                                    <SelectItem value="Appointment Letter">Appointment Letter</SelectItem>
                                    <SelectItem value="Form Template">Form Template</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Content Repository" required>
                            <Textarea
                                className="min-h-[320px] font-mono text-sm"
                                value={editingTemplate?.content || ""}
                                onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, content: e.target.value } : null)}
                            />
                        </Field>
                        <Field label="Injection Tags">
                            <Input
                                id="tag-input-edit"
                                placeholder="new_tag (press Enter)"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddPlaceholderToEdit((e.currentTarget as HTMLInputElement).value);
                                        (e.currentTarget as HTMLInputElement).value = "";
                                    }
                                }}
                            />
                            <div className="flex flex-wrap gap-2 mt-3">
                                {editingTemplate?.placeholders.map((p, i) => (
                                    <Badge key={i} className="bg-white text-indigo-600 border border-indigo-100 px-3 py-1.5 gap-2 rounded-lg font-bold text-[10px] shadow-sm">
                                        {"{{"}{p}{"}}"}
                                        <X
                                            className="w-3 h-3 text-slate-300 hover:text-rose-500 cursor-pointer transition-colors"
                                            onClick={() => setEditingTemplate(prev => prev ? { ...prev, placeholders: prev.placeholders.filter((_, idx) => idx !== i) } : null)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </Field>
                    </div>
                </SideFormSheet>

                {/* Preview Blueprint Dialog */}
                <Dialog open={!!previewingTemplate} onOpenChange={(open) => !open && setPreviewingTemplate(null)}>
                    <DialogContent className="max-w-3xl bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                        <DialogHeader className="text-start">
                            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 border border-indigo-100">
                                <Eye size={22} className="text-indigo-600" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-tight">{previewingTemplate?.name}</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                                {previewingTemplate?.type} · Last updated {previewingTemplate?.updatedAt}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-6 space-y-6 text-start">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wide mb-2 uppercase">Placeholders</p>
                                <div className="flex flex-wrap gap-2">
                                    {previewingTemplate?.placeholders.length ? previewingTemplate.placeholders.map((p, i) => (
                                        <Badge key={i} className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-lg font-bold text-[10px] font-mono">
                                            {"{{"}{p}{"}}"}
                                        </Badge>
                                    )) : (
                                        <span className="text-[11px] text-slate-400 italic font-bold">No placeholders defined</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wide mb-2 uppercase">Content</p>
                                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-h-[400px] overflow-auto">
                                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">{previewingTemplate?.content || "No content available."}</pre>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-3">
                            <Button variant="ghost" onClick={() => setPreviewingTemplate(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6">Close</Button>
                            <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={() => { if (previewingTemplate) { setEditingTemplate(previewingTemplate); setPreviewingTemplate(null); } }}>
                                <Edit3 size={14} className="mr-2" /> Edit Template
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Single Confirm Dialog */}
                <Dialog open={!!deleteTemplateId} onOpenChange={(open) => !open && setDeleteTemplateId(null)}>
                    <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                        <DialogHeader className="text-start">
                            <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 border border-rose-100">
                                <Trash2 size={22} className="text-rose-500" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Delete Blueprint?</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                                This template will be permanently removed. Any letters already issued from it remain unaffected.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setDeleteTemplateId(null)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Cancel</Button>
                            <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={() => {
                                if (deleteTemplateId) {
                                    deleteTemplate(deleteTemplateId);
                                    toast.success("Blueprint deleted");
                                    setDeleteTemplateId(null);
                                }
                            }}>Delete Blueprint</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Bulk Delete Confirm Dialog */}
                <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                    <DialogContent className="max-w-md bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                        <DialogHeader className="text-start">
                            <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-3 border border-rose-100">
                                <Trash2 size={22} className="text-rose-500" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Delete {selectedTemplateIds.length} Blueprints?</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                                All selected blueprints will be permanently removed. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setBulkDeleteOpen(false)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide px-6">Cancel</Button>
                            <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg text-[10px] tracking-wide border-none" onClick={() => {
                                const count = selectedTemplateIds.length;
                                selectedTemplateIds.forEach(id => deleteTemplate(id));
                                setSelectedTemplateIds([]);
                                setBulkDeleteOpen(false);
                                toast.success(`${count} blueprints purged`);
                            }}>Delete All</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};



export default TemplatesPage;
