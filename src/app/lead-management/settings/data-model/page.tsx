"use client"

import React, { useState, useEffect } from "react"
import {
    Database, Plus, Search, Lock, Unlock, Pencil, Trash2, X,
    Hash, Type, Calendar, ToggleLeft, List, Link, AlignLeft,
    CheckCircle2, Activity, Layers, Code, ShieldCheck, Zap
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

type FieldType = "Text" | "Number" | "Date" | "Boolean" | "Dropdown" | "URL" | "Textarea"
type ObjectTab = "Lead" | "Contact" | "Account" | "Opportunity"

interface FieldEntry {
    id: string
    label: string
    apiKey: string
    type: FieldType
    required: boolean
    indexed: boolean
    system: boolean
}

const TYPE_ICONS: Record<FieldType, React.ReactNode> = {
    Text: <Type size={13} className="text-blue-500" />,
    Number: <Hash size={13} className="text-purple-500" />,
    Date: <Calendar size={13} className="text-amber-500" />,
    Boolean: <ToggleLeft size={13} className="text-emerald-500" />,
    Dropdown: <List size={13} className="text-indigo-500" />,
    URL: <Link size={13} className="text-cyan-500" />,
    Textarea: <AlignLeft size={13} className="text-rose-400" />,
}

const INITIAL_FIELDS: Record<ObjectTab, FieldEntry[]> = {
    Lead: [
        { id: "F1", label: "Full Name", apiKey: "lead.full_name", type: "Text", required: true, indexed: true, system: true },
        { id: "F2", label: "Email Address", apiKey: "lead.email", type: "Text", required: true, indexed: true, system: true },
        { id: "F3", label: "Phone Number", apiKey: "lead.phone", type: "Text", required: false, indexed: false, system: true },
        { id: "F4", label: "Lead Score", apiKey: "lead.score", type: "Number", required: false, indexed: true, system: true },
        { id: "F5", label: "Source Channel", apiKey: "lead.source", type: "Dropdown", required: false, indexed: true, system: true },
        { id: "F6", label: "Budget Range", apiKey: "lead.budget", type: "Dropdown", required: false, indexed: false, system: false },
    ],
    Contact: [
        { id: "C1", label: "First Name", apiKey: "contact.first_name", type: "Text", required: true, indexed: true, system: true },
        { id: "C2", label: "Last Name", apiKey: "contact.last_name", type: "Text", required: true, indexed: true, system: true },
        { id: "C3", label: "Job Title", apiKey: "contact.job_title", type: "Text", required: false, indexed: false, system: false },
    ],
    Account: [
        { id: "A1", label: "Company Name", apiKey: "account.name", type: "Text", required: true, indexed: true, system: true },
        { id: "A2", label: "Industry", apiKey: "account.industry", type: "Dropdown", required: false, indexed: true, system: true },
        { id: "A3", label: "Annual Revenue", apiKey: "account.revenue", type: "Number", required: false, indexed: false, system: false },
    ],
    Opportunity: [
        { id: "O1", label: "Deal Name", apiKey: "opp.name", type: "Text", required: true, indexed: true, system: true },
        { id: "O2", label: "Deal Value", apiKey: "opp.value", type: "Number", required: true, indexed: true, system: true },
        { id: "O3", label: "Close Date", apiKey: "opp.close_date", type: "Date", required: false, indexed: false, system: false },
    ],
}

const STAT_CARDS = [
    { label: "Schema Fields", value: "42", sub: "Across 4 objects", icon: Database, bg: "bg-slate-50/10", text: "text-slate-600", border: "border-slate-100/20" },
    { label: "Validations", value: "14", sub: "Active logic rules", icon: ShieldCheck, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Indexed Nodes", value: "8", sub: "Search optimization", icon: Zap, bg: "bg-amber-50/10", text: "text-amber-600", border: "border-amber-100/20" },
    { label: "Global Sync", value: "100%", sub: "Cluster health", icon: Activity, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
]

const TABS: ObjectTab[] = ["Lead", "Contact", "Account", "Opportunity"]

export default function DataModelPage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [activeTab, setActiveTab] = useState<ObjectTab>("Lead")
    const [validationEngine, setValidationEngine] = useState(true)
    const [fields, setFields] = useState(INITIAL_FIELDS)
    const [search, setSearch] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [editField, setEditField] = useState<FieldEntry | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<FieldEntry | null>(null)
    const [newField, setNewField] = useState({ label: "", type: "Text" as FieldType, required: false, indexed: false })

    useEffect(() => { setIsClient(true) }, [])

    const currentFields = fields[activeTab].filter(f =>
        f.label.toLowerCase().includes(search.toLowerCase()) ||
        f.apiKey.toLowerCase().includes(search.toLowerCase())
    )

    const handleAddField = () => {
        if (!newField.label) { toast({ title: "Field label required" }); return }
        const apiKey = `${activeTab.toLowerCase()}.${newField.label.toLowerCase().replace(/\s+/g, '_')}`
        const entry: FieldEntry = { id: `F${Date.now()}`, apiKey, system: false, ...newField }
        setFields({ ...fields, [activeTab]: [...fields[activeTab], entry] })
        setShowAddModal(false)
        setNewField({ label: "", type: "Text", required: false, indexed: false })
        toast({ title: "✅ Field Added", description: `"${entry.label}" added to ${activeTab} object.` })
    }

    const handleDeleteField = (f: FieldEntry) => {
        if (f.system) { toast({ title: "System field", description: "Cannot delete system-defined fields." }); return }
        setFields({ ...fields, [activeTab]: fields[activeTab].filter(x => x.id !== f.id) })
        setDeleteConfirm(null)
        toast({ title: "Field Removed", description: `"${f.label}" deleted from ${activeTab}.` })
    }

    const handleSaveEdit = () => {
        if (!editField) return
        setFields({ ...fields, [activeTab]: fields[activeTab].map(f => f.id === editField.id ? editField : f) })
        setEditField(null)
        toast({ title: "Field Updated", description: `"${editField.label}" saved.` })
    }

    const handleToggleRequired = (id: string) => {
        setFields({ ...fields, [activeTab]: fields[activeTab].map(f => f.id === id ? { ...f, required: !f.required } : f) })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-blue-500">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100"><Database className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Data Architecture & Schema</h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">Manage custom fields, data types, and validation rules per object schema.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Validation Engine</span>
                        <Switch checked={validationEngine} onCheckedChange={setValidationEngine} className="data-[state=checked]:bg-blue-600" />
                    </div>
                    <Button onClick={() => setShowAddModal(true)} className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-blue-100">
                        <Plus className="h-4 w-4 mr-2" /> Add Field
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

            <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                {/* Object Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex rounded-xl bg-slate-50 p-1 gap-1 w-fit">
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => { setActiveTab(tab); setSearch("") }}
                                className={`px-5 py-2 rounded-lg text-[12px] font-black uppercase tracking-wide transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                        <Input placeholder="Search fields..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl border-slate-100 bg-slate-50 text-[12px]" />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-50 hover:bg-transparent">
                            {["Field Label", "API Key", "Type", "Required", "Indexed", "Actions"].map(h => (
                                <TableHead key={h} className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentFields.map((f) => (
                            <TableRow key={f.id} className="border-slate-50 hover:bg-slate-50/60 transition-colors group">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {f.system ? <Lock size={13} className="text-slate-300 shrink-0" /> : <Unlock size={13} className="text-blue-400 shrink-0" />}
                                        <span className="text-[13px] font-bold text-slate-900">{f.label}</span>
                                    </div>
                                </TableCell>
                                <TableCell><code className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">{f.apiKey}</code></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        {TYPE_ICONS[f.type]}
                                        <span className="text-[12px] font-bold text-slate-600">{f.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Switch checked={f.required} disabled={f.system} onCheckedChange={() => handleToggleRequired(f.id)} className="data-[state=checked]:bg-rose-500 scale-75" />
                                </TableCell>
                                <TableCell>
                                    {f.indexed
                                        ? <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black uppercase">Indexed</Badge>
                                        : <Badge className="bg-slate-50 text-slate-400 border-none text-[9px] font-black uppercase">Not Indexed</Badge>}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button size="icon" variant="ghost" onClick={() => setEditField({ ...f })} className="h-8 w-8 text-slate-300 hover:text-blue-500 rounded-lg">
                                            <Pencil size={14} />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => f.system ? toast({ title: "System field — cannot delete" }) : setDeleteConfirm(f)} className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-lg">
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Add Field Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-[18px] font-black text-slate-900">Add Field</h2>
                                <p className="text-[12px] text-slate-500 font-medium">To: <strong>{activeTab}</strong> object</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setShowAddModal(false)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Field Label</Label>
                                <Input placeholder="e.g. Company Size" value={newField.label} onChange={e => setNewField({ ...newField, label: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Field Type</Label>
                                <Select value={newField.type} onValueChange={v => setNewField({ ...newField, type: v as FieldType })}>
                                    <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50 font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {(["Text", "Number", "Date", "Boolean", "Dropdown", "URL", "Textarea"] as FieldType[]).map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center justify-between flex-1 p-4 rounded-xl bg-rose-50 border border-rose-100">
                                    <span className="text-[12px] font-bold text-rose-700">Required</span>
                                    <Switch checked={newField.required} onCheckedChange={v => setNewField({ ...newField, required: v })} className="data-[state=checked]:bg-rose-500" />
                                </div>
                                <div className="flex items-center justify-between flex-1 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <span className="text-[12px] font-bold text-blue-700">Indexed</span>
                                    <Switch checked={newField.indexed} onCheckedChange={v => setNewField({ ...newField, indexed: v })} className="data-[state=checked]:bg-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleAddField} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl border-none">Add Field</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Field Modal */}
            {editField && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">Edit Field</h2>
                            <Button size="icon" variant="ghost" onClick={() => setEditField(null)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Field Label</Label>
                                <Input value={editField.label} onChange={e => setEditField({ ...editField, label: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">API Key (read-only)</p>
                                <code className="text-[12px] font-mono text-slate-600">{editField.apiKey}</code>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center justify-between flex-1 p-4 rounded-xl bg-rose-50 border border-rose-100">
                                    <span className="text-[12px] font-bold text-rose-700">Required</span>
                                    <Switch checked={editField.required} disabled={editField.system} onCheckedChange={v => setEditField({ ...editField, required: v })} className="data-[state=checked]:bg-rose-500" />
                                </div>
                                <div className="flex items-center justify-between flex-1 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <span className="text-[12px] font-bold text-blue-700">Indexed</span>
                                    <Switch checked={editField.indexed} onCheckedChange={v => setEditField({ ...editField, indexed: v })} className="data-[state=checked]:bg-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setEditField(null)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleSaveEdit} className="flex-1 h-11 bg-slate-900 text-white font-bold rounded-xl border-none">Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200 text-center">
                        <div className="h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600"><Trash2 size={26} /></div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-900">Delete Field?</h2>
                            <p className="text-[13px] text-slate-500 font-medium">"{deleteConfirm.label}" and all its data will be removed permanently.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={() => handleDeleteField(deleteConfirm)} className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl border-none">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
