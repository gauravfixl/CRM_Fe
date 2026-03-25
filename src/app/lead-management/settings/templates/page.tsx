"use client"

import React, { useState, useEffect } from "react"
import {
    FileText, Plus, Search, Pencil, Trash2, X, Mail, Smartphone, MessageSquare, Zap,
    ClipboardList, StickyNote, Copy, Eye, CheckCircle2, Send,
    Download, Languages, BarChart2
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

type TemplateCategory = "Email" | "SMS" | "Task" | "Note"

interface Template {
    id: string
    title: string
    category: TemplateCategory
    subject?: string
    body: string
    usageCount: number
    lastUsed: string
}

const INITIAL_TEMPLATES: Template[] = [
    { id: "T01", title: "Cold Outreach - Enterprise", category: "Email", subject: "Quick question about {{company_name}}", body: "Hi {{lead_name}},\n\nI noticed {{company_name}} is growing rapidly in the {{industry}} space...", usageCount: 142, lastUsed: "2h ago" },
    { id: "T02", title: "Follow-Up After Demo", category: "Email", subject: "Following up on our call", body: "Hi {{lead_name}}, thank you for your time today. As discussed...", usageCount: 98, lastUsed: "1 day ago" },
    { id: "T03", title: "Meeting Confirmation SMS", category: "SMS", body: "Hi {{lead_name}}, confirming your call with {{rep_name}} on {{meeting_date}} at {{meeting_time}}.", usageCount: 211, lastUsed: "4h ago" },
    { id: "T04", title: "Discovery Call Prep", category: "Task", body: "1. Review company LinkedIn\n2. Check funding history\n3. Prep 3 custom questions\n4. Set Loom recording", usageCount: 76, lastUsed: "Yesterday" },
    { id: "T05", title: "Post-Meeting Notes", category: "Note", body: "Pain points identified: {{pain_points}}\nBudget: {{budget}}\nNext steps: {{next_steps}}", usageCount: 55, lastUsed: "3 days ago" },
]

const MERGE_FIELDS = ["{{lead_name}}", "{{company_name}}", "{{industry}}", "{{rep_name}}", "{{meeting_date}}", "{{meeting_time}}", "{{budget}}", "{{pain_points}}"]

const CAT_ICONS: Record<TemplateCategory, { icon: React.ReactNode; bg: string; text: string }> = {
    Email: { icon: <Mail size={16} />, bg: "bg-blue-50", text: "text-blue-600" },
    SMS: { icon: <Smartphone size={16} />, bg: "bg-emerald-50", text: "text-emerald-600" },
    Task: { icon: <ClipboardList size={16} />, bg: "bg-amber-50", text: "text-amber-600" },
    Note: { icon: <StickyNote size={16} />, bg: "bg-purple-50", text: "text-purple-600" },
}

const STAT_CARDS = [
    { label: "Email Sets", value: "24", sub: "Production templates", icon: Mail, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
    { label: "SMS Strings", value: "12", sub: "Global regions", icon: MessageSquare, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
    { label: "Task Nodes", value: "8", sub: "Workflow presets", icon: Zap, bg: "bg-amber-50/10", text: "text-amber-600", border: "border-amber-100/20" },
    { label: "Active Ratio", value: "92%", sub: "Live engagement", icon: Eye, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
]

const CATEGORIES: TemplateCategory[] = ["Email", "SMS", "Task", "Note"]

export default function TemplatesPage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
    const [activeCategory, setActiveCategory] = useState<TemplateCategory | "All">("All")
    const [search, setSearch] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
    const [editTemplate, setEditTemplate] = useState<Template | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<Template | null>(null)
    const [newTemplate, setNewTemplate] = useState({ title: "", category: "Email" as TemplateCategory, subject: "", body: "" })

    useEffect(() => { setIsClient(true) }, [])

    const filtered = templates.filter(t => {
        const catMatch = activeCategory === "All" || t.category === activeCategory
        const searchMatch = t.title.toLowerCase().includes(search.toLowerCase())
        return catMatch && searchMatch
    })

    const handleAdd = () => {
        if (!newTemplate.title || !newTemplate.body) { toast({ title: "Title and body required" }); return }
        const entry: Template = { id: `T${Date.now()}`, ...newTemplate, usageCount: 0, lastUsed: "Just now" }
        setTemplates([entry, ...templates])
        setShowAddModal(false)
        setNewTemplate({ title: "", category: "Email", subject: "", body: "" })
        toast({ title: "✅ Template Created", description: `"${entry.title}" is now available.` })
    }

    const handleSaveEdit = () => {
        if (!editTemplate) return
        setTemplates(templates.map(t => t.id === editTemplate.id ? editTemplate : t))
        setEditTemplate(null)
        toast({ title: "Template Updated", description: `"${editTemplate.title}" saved.` })
    }

    const handleDelete = (t: Template) => {
        setTemplates(templates.filter(x => x.id !== t.id))
        setDeleteConfirm(null)
        toast({ title: "Template Removed" })
    }

    const handleCopyMerge = (field: string) => {
        navigator.clipboard.writeText(field).catch(() => { })
        toast({ title: "Copied!", description: `${field} copied to clipboard.` })
    }

    const handleDuplicate = (t: Template) => {
        const dup: Template = { ...t, id: `T${Date.now()}`, title: `${t.title} (Copy)`, usageCount: 0, lastUsed: "Just now" }
        setTemplates([dup, ...templates])
        toast({ title: "Template Duplicated", description: `"${dup.title}" created.` })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-indigo-500">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100"><FileText className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Templates & Content</h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">Manage reusable templates for email, SMS, tasks, and internal notes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                        <Input placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl border-slate-100 bg-slate-50 text-[12px]" />
                    </div>
                    <Button onClick={() => setShowAddModal(true)} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-indigo-100">
                        <Plus className="h-4 w-4 mr-2" /> New Template
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Template List */}
                <Card className="lg:col-span-9 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                    {/* Category Filter */}
                    <div className="flex rounded-xl bg-slate-50 p-1 gap-1 w-fit">
                        {(["All", ...CATEGORIES] as (TemplateCategory | "All")[]).map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-lg text-[12px] font-black uppercase tracking-wide transition-all ${activeCategory === cat ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filtered.map(t => {
                            const cat = CAT_ICONS[t.category]
                            return (
                                <div key={t.id} className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 transition-all group">
                                    <div className="flex items-start gap-5">
                                        <div className={`h-11 w-11 rounded-xl ${cat.bg} ${cat.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            {cat.icon}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-[14px] font-bold text-slate-900">{t.title}</h4>
                                                <Badge className={`border-none text-[9px] font-black uppercase ${cat.bg} ${cat.text}`}>{t.category}</Badge>
                                            </div>
                                            {t.subject && <p className="text-[12px] text-slate-500 font-medium">Subject: <em>{t.subject}</em></p>}
                                            <p className="text-[12px] text-slate-400 font-medium line-clamp-2">{t.body}</p>
                                            <div className="flex items-center gap-3 pt-1">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">Used {t.usageCount}×</span>
                                                <span className="text-[10px] text-slate-300">•</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">Last: {t.lastUsed}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button size="icon" variant="ghost" onClick={() => setPreviewTemplate(t)} className="h-8 w-8 text-slate-300 hover:text-indigo-600 rounded-lg" title="Preview"><Eye size={15} /></Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDuplicate(t)} className="h-8 w-8 text-slate-300 hover:text-blue-500 rounded-lg" title="Duplicate"><Copy size={15} /></Button>
                                            <Button size="icon" variant="ghost" onClick={() => setEditTemplate({ ...t })} className="h-8 w-8 text-slate-300 hover:text-amber-500 rounded-lg" title="Edit"><Pencil size={15} /></Button>
                                            <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(t)} className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-lg" title="Delete"><Trash2 size={15} /></Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {filtered.length === 0 && (
                            <div className="py-16 text-center">
                                <FileText size={40} className="text-slate-200 mx-auto mb-4" />
                                <p className="text-[14px] text-slate-400 font-bold">No templates found</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Merge Fields Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-7 space-y-4">
                        <h4 className="text-[14px] font-black">Merge Fields</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Click to copy variable into clipboard.</p>
                        <div className="space-y-2">
                            {MERGE_FIELDS.map(field => (
                                <button key={field} onClick={() => handleCopyMerge(field)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                    <code className="text-[12px] font-mono text-indigo-400">{field}</code>
                                    <Copy size={12} className="text-slate-600 group-hover:text-white transition-colors" />
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">New Template</h2>
                            <Button size="icon" variant="ghost" onClick={() => setShowAddModal(false)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Title</Label>
                                    <Input placeholder="Template name" value={newTemplate.title} onChange={e => setNewTemplate({ ...newTemplate, title: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</Label>
                                    <Select value={newTemplate.category} onValueChange={v => setNewTemplate({ ...newTemplate, category: v as TemplateCategory })}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50 font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {newTemplate.category === "Email" && (
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Subject</Label>
                                    <Input placeholder="e.g. Hi {{lead_name}}, quick question..." value={newTemplate.subject} onChange={e => setNewTemplate({ ...newTemplate, subject: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Body</Label>
                                <textarea value={newTemplate.body} onChange={e => setNewTemplate({ ...newTemplate, body: e.target.value })}
                                    placeholder="Use {{merge_fields}} for personalization..." rows={5}
                                    className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-[13px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleAdd} className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none">Create Template</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-[17px] font-black text-slate-900">{previewTemplate.title}</h2>
                                <Badge className={`mt-1 border-none text-[9px] font-black uppercase ${CAT_ICONS[previewTemplate.category].bg} ${CAT_ICONS[previewTemplate.category].text}`}>{previewTemplate.category}</Badge>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setPreviewTemplate(null)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        {previewTemplate.subject && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Subject</p>
                                <p className="text-[13px] font-bold text-slate-700">{previewTemplate.subject}</p>
                            </div>
                        )}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Body</p>
                            <p className="text-[13px] text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">{previewTemplate.body}</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setPreviewTemplate(null)} className="flex-1 h-10 rounded-xl font-bold border-slate-100">Close</Button>
                            <Button onClick={() => { setEditTemplate({ ...previewTemplate }); setPreviewTemplate(null) }} className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none">Edit Template</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editTemplate && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">Edit Template</h2>
                            <Button size="icon" variant="ghost" onClick={() => setEditTemplate(null)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Title</Label>
                                <Input value={editTemplate.title} onChange={e => setEditTemplate({ ...editTemplate, title: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            {editTemplate.category === "Email" && (
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Subject</Label>
                                    <Input value={editTemplate.subject || ""} onChange={e => setEditTemplate({ ...editTemplate, subject: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Body</Label>
                                <textarea value={editTemplate.body} onChange={e => setEditTemplate({ ...editTemplate, body: e.target.value })} rows={5}
                                    className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-[13px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setEditTemplate(null)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleSaveEdit} className="flex-1 h-11 bg-slate-900 text-white font-bold rounded-xl border-none">Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600"><Trash2 size={26} /></div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-900">Delete Template?</h2>
                            <p className="text-[13px] text-slate-500 font-medium">"{deleteConfirm.title}" will be removed permanently.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl border-none">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
