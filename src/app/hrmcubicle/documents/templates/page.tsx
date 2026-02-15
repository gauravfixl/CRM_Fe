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

const TemplatesPage = () => {
    const { letterTemplates, addTemplate, updateTemplate, deleteTemplate } = useDocumentsStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<LetterTemplate | null>(null);
    const [templateType, setTemplateType] = useState("all");
    const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);

    const [newTemplate, setNewTemplate] = useState({
        name: "",
        type: "Offer Letter" as LetterTemplate['type'],
        content: "",
        placeholders: [] as string[]
    });

    const [currentPlaceholder, setCurrentPlaceholder] = useState("");

    const filteredTemplates = letterTemplates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = templateType === "all" || template.type === templateType;
        return matchesSearch && matchesType;
    });

    const handleAddPlaceholder = () => {
        if (currentPlaceholder && !newTemplate.placeholders.includes(currentPlaceholder)) {
            setNewTemplate({
                ...newTemplate,
                placeholders: [...newTemplate.placeholders, currentPlaceholder]
            });
            setCurrentPlaceholder("");
        }
    };

    const handleCreateTemplate = () => {
        if (!newTemplate.name || !newTemplate.content) {
            toast.error("Please fill in template name and content");
            return;
        }
        addTemplate(newTemplate);
        setIsCreateOpen(false);
        setNewTemplate({ name: "", type: "Offer Letter", content: "", placeholders: [] });
        toast.success("Template created successfully");
    };

    const handleUpdateTemplate = () => {
        if (!editingTemplate?.name || !editingTemplate?.content) {
            toast.error("Required fields cannot be empty");
            return;
        }
        updateTemplate(editingTemplate.id, editingTemplate);
        setEditingTemplate(null);
        toast.success("Template blueprint updated");
    };

    const handleAddPlaceholderToEdit = (tag: string) => {
        if (editingTemplate && tag && !editingTemplate.placeholders.includes(tag)) {
            setEditingTemplate({
                ...editingTemplate,
                placeholders: [...editingTemplate.placeholders, tag]
            });
        }
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
                                onClick={() => {
                                    selectedTemplateIds.forEach(id => deleteTemplate(id));
                                    setSelectedTemplateIds([]);
                                    toast.success(`${selectedTemplateIds.length} blueprints purged`);
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete ({selectedTemplateIds.length})
                            </Button>
                        )}
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-wide border-none">
                                    <Plus className="w-4 h-4" /> Create Template
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">New Document Template</DialogTitle>
                                    <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                                        Define Official Blueprints v3.0
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-3 gap-8 py-8">
                                    <div className="col-span-2 space-y-6">
                                        <div className="space-y-3 text-start">
                                            <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Template Name</label>
                                            <Input
                                                placeholder="e.g., Senior Management Offer Letter"
                                                value={newTemplate.name}
                                                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                                className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-3 text-start">
                                            <div className="flex items-center justify-between mb-1 ml-1">
                                                <label className="text-[10px] font-bold tracking-wide text-slate-400">Template Content</label>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="h-7 w-7 rounded-lg text-[10px] font-black p-0 border-slate-200 shadow-sm">B</Button>
                                                    <Button variant="outline" size="sm" className="h-7 w-7 rounded-lg text-[10px] font-black p-0 border-slate-200 shadow-sm italic">I</Button>
                                                </div>
                                            </div>
                                            <Textarea
                                                placeholder="Use {{placeholder_name}} for dynamic data..."
                                                className="min-h-[400px] font-mono text-sm bg-slate-50 border-slate-200 rounded-[2rem] p-8 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all custom-scrollbar overflow-y-auto"
                                                value={newTemplate.content}
                                                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-4 p-8 rounded-[2rem] bg-indigo-50/40 border border-indigo-100 shadow-sm text-start">
                                            <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                                <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                    <Settings size={16} />
                                                </div>
                                                <h4 className="text-[10px] font-bold tracking-wide">Properties</h4>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 tracking-wide ml-1">Document Type</label>
                                                <Select
                                                    value={newTemplate.type}
                                                    onValueChange={(val: any) => setNewTemplate({ ...newTemplate, type: val })}
                                                >
                                                    <SelectTrigger className="h-12 bg-white border-none rounded-xl font-bold text-xs px-4 shadow-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-xs">
                                                        <SelectItem value="Offer Letter" className="rounded-lg h-10">Offer Letter</SelectItem>
                                                        <SelectItem value="Experience Letter" className="rounded-lg h-10">Experience Letter</SelectItem>
                                                        <SelectItem value="Relieving Letter" className="rounded-lg h-10">Relieving Letter</SelectItem>
                                                        <SelectItem value="Appointment Letter" className="rounded-lg h-10">Appointment Letter</SelectItem>
                                                        <SelectItem value="Form Template" className="rounded-lg h-10">HR Form Template</SelectItem>
                                                        <SelectItem value="Email Content" className="rounded-lg h-10">Email Template</SelectItem>
                                                        <SelectItem value="Custom" className="rounded-lg h-10">Custom Template</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-8 rounded-[2rem] bg-slate-50 border border-slate-200 shadow-sm text-start">
                                            <div className="flex items-center gap-3 text-slate-600 mb-2 text-start">
                                                <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-start">
                                                    <Braces size={16} className="text-indigo-500" />
                                                </div>
                                                <h4 className="text-[10px] font-bold tracking-wide">Placeholders</h4>
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="tag_name"
                                                    className="h-10 text-xs bg-white border-none rounded-xl font-bold px-4 shadow-sm"
                                                    value={currentPlaceholder}
                                                    onChange={(e) => setCurrentPlaceholder(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddPlaceholder()}
                                                />
                                                <Button size="icon" className="h-10 w-10 bg-indigo-600 text-white rounded-xl shadow-md shrink-0" onClick={handleAddPlaceholder}>
                                                    <Plus size={18} />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-4 text-start">
                                                {newTemplate.placeholders.map((p, i) => (
                                                    <Badge key={i} className="bg-white text-indigo-600 border border-indigo-100 px-3 py-1.5 gap-2 group rounded-lg font-bold text-[9px] shadow-sm">
                                                        {"{{"}{p}{"}}"}
                                                        <X
                                                            className="w-3 h-3 text-slate-300 group-hover:text-rose-500 cursor-pointer transition-colors"
                                                            onClick={() => setNewTemplate({ ...newTemplate, placeholders: newTemplate.placeholders.filter((_, idx) => idx !== i) })}
                                                        />
                                                    </Badge>
                                                ))}
                                                {newTemplate.placeholders.length === 0 && (
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-wide italic opacity-50 text-start w-full">No tags defined</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="border-t border-slate-50 pt-8 gap-3">
                                    <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6">Discard</Button>
                                    <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-indigo-100 transition-all text-[10px] tracking-wide border-none gap-2" onClick={handleCreateTemplate}>
                                        <Save size={16} /> Save Template
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                            <Button className="w-full bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-100 h-10 rounded-xl font-bold text-[9px] tracking-wide shadow-sm transition-all active:scale-95">Try AI Generator</Button>
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
                                    <Card className={`border border-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500 bg-white rounded-[2rem] p-6 overflow-hidden relative border-t-4 ${selectedTemplateIds.includes(template.id) ? 'border-t-indigo-600 bg-indigo-50/5' : 'border-t-indigo-600/10 hover:border-t-indigo-600'}`}>
                                        <div className="absolute top-4 left-4 z-20">
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
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-none" onClick={() => setEditingTemplate(template)}>
                                                    <Edit3 size={18} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-10 w-10 text-slate-300 hover:text-slate-900 rounded-xl transition-all border-none p-0">
                                                            <MoreVertical size={20} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl bg-white font-sans">
                                                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wide">Options</DropdownMenuLabel>
                                                        <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-slate-50 text-start" onClick={() => toast.success("Opening template preview")}>
                                                            <Eye size={16} className="text-indigo-500" /> Preview Blueprint
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-slate-50 text-start" onClick={() => toast.success("Blueprint duplicated")}>
                                                            <Copy size={16} className="text-indigo-500" /> Duplicate Version
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                        <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50 text-start" onClick={() => deleteTemplate(template.id)}>
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
                                                <Button className="h-10 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl font-bold text-[10px] tracking-wide px-6 shadow-md transition-all active:scale-95 border-none">
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

                {/* Edit Template Dialog */}
                <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
                    <DialogContent className="max-w-6xl bg-white rounded-[2rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                        <DialogHeader className="text-start">
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-tight">Sync Template Blueprint</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2">
                                Update system architecture for consistent organizational output.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-8 py-8">
                            <div className="col-span-2 space-y-6">
                                <div className="space-y-3 text-start">
                                    <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Refined Title</label>
                                    <Input
                                        placeholder="Blueprint title..."
                                        value={editingTemplate?.name || ""}
                                        onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-3 text-start">
                                    <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1 mb-2 block">Content Repository</label>
                                    <Textarea
                                        className="min-h-[450px] font-mono text-sm bg-slate-50 border-slate-200 rounded-[2.5rem] p-8 focus:bg-white transition-all custom-scrollbar overflow-y-auto"
                                        value={editingTemplate?.content || ""}
                                        onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, content: e.target.value } : null)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-4 p-8 rounded-[2rem] bg-indigo-50/40 border border-indigo-100 shadow-sm text-start">
                                    <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                        <Settings size={16} />
                                        <h4 className="text-[10px] font-bold tracking-wide">Configuration</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-400 tracking-wide ml-1">Output Format</label>
                                        <Select
                                            value={editingTemplate?.type}
                                            onValueChange={(val: any) => setEditingTemplate(prev => prev ? { ...prev, type: val } : null)}
                                        >
                                            <SelectTrigger className="h-12 bg-white border-none rounded-xl font-bold text-xs px-4 shadow-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-xs">
                                                <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                                                <SelectItem value="Experience Letter">Experience Letter</SelectItem>
                                                <SelectItem value="Relieving Letter">Relieving Letter</SelectItem>
                                                <SelectItem value="Appointment Letter">Appointment Letter</SelectItem>
                                                <SelectItem value="Form Template">Form Template</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4 p-8 rounded-[2rem] bg-slate-50 border border-slate-200 shadow-sm text-start">
                                    <div className="flex items-center gap-3 text-slate-600 mb-2">
                                        <Braces size={16} className="text-indigo-500" />
                                        <h4 className="text-[10px] font-bold tracking-wide">Injection Tags</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            id="tag-input-edit"
                                            placeholder="new_tag"
                                            className="h-10 text-xs bg-white border-none rounded-xl font-bold px-4 shadow-sm"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddPlaceholderToEdit((e.currentTarget as HTMLInputElement).value);
                                                    (e.currentTarget as HTMLInputElement).value = "";
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {editingTemplate?.placeholders.map((p, i) => (
                                            <Badge key={i} className="bg-white text-indigo-600 border border-indigo-100 px-3 py-1.5 gap-2 rounded-lg font-bold text-[9px] shadow-sm">
                                                {"{{"}{p}{"}}"}
                                                <X
                                                    className="w-3 h-3 text-slate-300 hover:text-rose-500 cursor-pointer transition-colors"
                                                    onClick={() => setEditingTemplate(prev => prev ? { ...prev, placeholders: prev.placeholders.filter((_, idx) => idx !== i) } : null)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="border-t border-slate-50 pt-8 gap-3">
                            <Button variant="ghost" onClick={() => setEditingTemplate(null)} className="h-14 rounded-2xl font-bold text-[11px] tracking-wide transition-all px-8 border-none">Discard Changes</Button>
                            <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl h-14 px-12 font-bold shadow-lg shadow-indigo-100 transition-all text-[11px] tracking-wide border-none" onClick={handleUpdateTemplate}>Synchronize Blueprint</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};



export default TemplatesPage;
