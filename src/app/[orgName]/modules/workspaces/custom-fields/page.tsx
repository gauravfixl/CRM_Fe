"use client"

import React, { useState, useMemo } from "react"
import {
    Plus, MoreHorizontal, Trash2, Edit3, Search, ChevronRight, ChevronUp, ChevronDown,
    Type, Hash, CalendarDays, List, CheckSquare, Link, UserCircle, AlignLeft, ToggleLeft,
    GripVertical, Eye, X, AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

type FieldType = "text" | "textarea" | "number" | "date" | "single_select" | "multi_select" | "checkbox" | "url" | "user_picker"

interface CustomField {
    id: string
    name: string
    type: FieldType
    required: boolean
    defaultValue: string
    scope: string[]
    options: string[]
    usedIn: number
    order: number
}

const FIELD_TYPE_META: Record<FieldType, { label: string; icon: React.ReactNode }> = {
    text: { label: "Text", icon: <Type className="w-3.5 h-3.5" /> },
    textarea: { label: "Text Area", icon: <AlignLeft className="w-3.5 h-3.5" /> },
    number: { label: "Number", icon: <Hash className="w-3.5 h-3.5" /> },
    date: { label: "Date", icon: <CalendarDays className="w-3.5 h-3.5" /> },
    single_select: { label: "Single Select", icon: <List className="w-3.5 h-3.5" /> },
    multi_select: { label: "Multi Select", icon: <List className="w-3.5 h-3.5" /> },
    checkbox: { label: "Checkbox", icon: <CheckSquare className="w-3.5 h-3.5" /> },
    url: { label: "URL", icon: <Link className="w-3.5 h-3.5" /> },
    user_picker: { label: "User Picker", icon: <UserCircle className="w-3.5 h-3.5" /> },
}

const SCOPE_OPTIONS = ["TASK", "BUG", "STORY", "EPIC"]

const initialFields: CustomField[] = [
    { id: "f1", name: "Environment", type: "single_select", required: true, defaultValue: "Production", scope: ["BUG"], options: ["Production", "Staging", "Development", "QA"], usedIn: 14, order: 0 },
    { id: "f2", name: "Acceptance Criteria", type: "textarea", required: false, defaultValue: "", scope: ["STORY", "TASK"], options: [], usedIn: 22, order: 1 },
    { id: "f3", name: "Estimated Hours", type: "number", required: false, defaultValue: "0", scope: ["TASK", "BUG", "STORY", "EPIC"], options: [], usedIn: 35, order: 2 },
    { id: "f4", name: "Release Target", type: "date", required: false, defaultValue: "", scope: ["EPIC"], options: [], usedIn: 5, order: 3 },
    { id: "f5", name: "Customer Impact", type: "single_select", required: true, defaultValue: "Low", scope: ["BUG"], options: ["None", "Low", "Medium", "High", "Critical"], usedIn: 11, order: 4 },
]

export default function CustomFieldsPage() {
    const [fields, setFields] = useState<CustomField[]>(initialFields)
    const [search, setSearch] = useState("")
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [editingField, setEditingField] = useState<CustomField | null>(null)
    const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null)
    const [showPreview, setShowPreview] = useState<CustomField | null>(null)

    // Form state
    const [form, setForm] = useState({
        name: "", type: "text" as FieldType, required: false, defaultValue: "",
        scope: [] as string[], options: [] as string[], newOption: ""
    })

    const stats = useMemo(() => ({
        total: fields.length,
        text: fields.filter(f => f.type === "text" || f.type === "textarea").length,
        select: fields.filter(f => f.type === "single_select" || f.type === "multi_select").length,
        date: fields.filter(f => f.type === "date").length,
    }), [fields])

    const filteredFields = useMemo(() =>
        fields.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.order - b.order),
        [fields, search]
    )

    const resetForm = () => setForm({ name: "", type: "text", required: false, defaultValue: "", scope: [], options: [], newOption: "" })

    const handleCreate = () => {
        if (!form.name.trim()) { toast.error("Field name is required"); return }
        const nf: CustomField = {
            id: `f${Date.now()}`, name: form.name, type: form.type, required: form.required,
            defaultValue: form.defaultValue, scope: form.scope.length ? form.scope : SCOPE_OPTIONS,
            options: form.options, usedIn: 0, order: fields.length,
        }
        setFields(p => [...p, nf])
        resetForm()
        setShowCreateDialog(false)
        toast.success(`Field "${nf.name}" created`)
    }

    const handleEdit = () => {
        if (!editingField || !form.name.trim()) { toast.error("Field name is required"); return }
        setFields(p => p.map(f => f.id === editingField.id ? {
            ...f, name: form.name, type: form.type, required: form.required,
            defaultValue: form.defaultValue, scope: form.scope.length ? form.scope : SCOPE_OPTIONS,
            options: form.options,
        } : f))
        setEditingField(null)
        resetForm()
        toast.success("Field updated")
    }

    const handleDelete = () => {
        if (!deleteFieldId) return
        const field = fields.find(f => f.id === deleteFieldId)
        setFields(p => p.filter(f => f.id !== deleteFieldId))
        setDeleteFieldId(null)
        toast.success(`Field "${field?.name}" deleted`)
    }

    const toggleRequired = (id: string) => {
        setFields(p => p.map(f => f.id === id ? { ...f, required: !f.required } : f))
        toast.success("Required status toggled")
    }

    const moveField = (id: string, direction: "up" | "down") => {
        setFields(prev => {
            const sorted = [...prev].sort((a, b) => a.order - b.order)
            const idx = sorted.findIndex(f => f.id === id)
            if ((direction === "up" && idx === 0) || (direction === "down" && idx === sorted.length - 1)) return prev
            const swapIdx = direction === "up" ? idx - 1 : idx + 1
            const newFields = [...sorted]
            const tempOrder = newFields[idx].order
            newFields[idx] = { ...newFields[idx], order: newFields[swapIdx].order }
            newFields[swapIdx] = { ...newFields[swapIdx], order: tempOrder }
            return newFields
        })
    }

    const addOption = () => {
        if (!form.newOption.trim()) return
        if (form.options.includes(form.newOption.trim())) { toast.error("Option already exists"); return }
        setForm(p => ({ ...p, options: [...p.options, p.newOption.trim()], newOption: "" }))
    }

    const removeOption = (opt: string) => setForm(p => ({ ...p, options: p.options.filter(o => o !== opt) }))

    const moveOption = (idx: number, dir: "up" | "down") => {
        setForm(p => {
            const opts = [...p.options]
            const swapIdx = dir === "up" ? idx - 1 : idx + 1
            if (swapIdx < 0 || swapIdx >= opts.length) return p
            ;[opts[idx], opts[swapIdx]] = [opts[swapIdx], opts[idx]]
            return { ...p, options: opts }
        })
    }

    const toggleScope = (s: string) => {
        setForm(p => ({ ...p, scope: p.scope.includes(s) ? p.scope.filter(x => x !== s) : [...p.scope, s] }))
    }

    const renderFieldForm = () => (
        <div className="flex flex-col gap-3 py-2 max-h-[60vh] overflow-y-auto">
            <div><label className="text-xs font-medium text-zinc-500">Name</label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Environment" className="mt-1 h-8 text-xs" /></div>
            <div>
                <label className="text-xs font-medium text-zinc-500">Type</label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as FieldType, options: [], defaultValue: "" }))}>
                    <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {(Object.keys(FIELD_TYPE_META) as FieldType[]).map(t => (
                            <SelectItem key={t} value={t} className="text-xs">
                                <span className="flex items-center gap-2">{FIELD_TYPE_META[t].icon}{FIELD_TYPE_META[t].label}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-zinc-500">Required</label>
                <button onClick={() => setForm(p => ({ ...p, required: !p.required }))} className={`relative w-9 h-5 rounded-full transition-colors ${form.required ? "bg-indigo-600" : "bg-zinc-200"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.required ? "translate-x-4" : ""}`} />
                </button>
            </div>
            <div>
                <label className="text-xs font-medium text-zinc-500">Default Value</label>
                {form.type === "date" ? (
                    <Input type="date" value={form.defaultValue} onChange={e => setForm(p => ({ ...p, defaultValue: e.target.value }))} className="mt-1 h-8 text-xs" />
                ) : form.type === "number" ? (
                    <Input type="number" value={form.defaultValue} onChange={e => setForm(p => ({ ...p, defaultValue: e.target.value }))} className="mt-1 h-8 text-xs" />
                ) : form.type === "checkbox" ? (
                    <div className="flex items-center gap-2 mt-1">
                        <input type="checkbox" checked={form.defaultValue === "true"} onChange={e => setForm(p => ({ ...p, defaultValue: String(e.target.checked) }))} className="w-4 h-4" />
                        <span className="text-xs text-zinc-500">{form.defaultValue === "true" ? "Checked" : "Unchecked"}</span>
                    </div>
                ) : (
                    <Input value={form.defaultValue} onChange={e => setForm(p => ({ ...p, defaultValue: e.target.value }))} placeholder="Default value" className="mt-1 h-8 text-xs" />
                )}
            </div>
            <div>
                <label className="text-xs font-medium text-zinc-500">Scope</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                    {SCOPE_OPTIONS.map(s => (
                        <button key={s} onClick={() => toggleScope(s)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition-colors ${form.scope.includes(s) ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-zinc-200 text-zinc-500"}`}>{s}</button>
                    ))}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">Leave empty for all issue types</p>
            </div>
            {(form.type === "single_select" || form.type === "multi_select") && (
                <div>
                    <label className="text-xs font-medium text-zinc-500">Options</label>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Input value={form.newOption} onChange={e => setForm(p => ({ ...p, newOption: e.target.value }))} onKeyDown={e => e.key === "Enter" && addOption()} placeholder="Add option..." className="h-8 text-xs flex-1" />
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-2" onClick={addOption}><Plus className="w-3.5 h-3.5" /></Button>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        {form.options.map((opt, idx) => (
                            <div key={opt} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-50 rounded border border-zinc-100">
                                <GripVertical className="w-3 h-3 text-zinc-300" />
                                <span className="text-xs text-zinc-700 flex-1">{opt}</span>
                                <button onClick={() => moveOption(idx, "up")} disabled={idx === 0} className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                                <button onClick={() => moveOption(idx, "down")} disabled={idx === form.options.length - 1} className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                                <button onClick={() => removeOption(opt)} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    const renderPreview = (field: CustomField) => (
        <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4">
            <p className="text-[10px] font-medium text-zinc-400 uppercase mb-3">Issue Form Preview</p>
            <div className="bg-white rounded-md border border-zinc-200 p-3">
                <label className="text-xs font-medium text-zinc-700 flex items-center gap-1">
                    {field.name}{field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "text" && <Input placeholder={field.defaultValue || `Enter ${field.name.toLowerCase()}...`} className="mt-1.5 h-8 text-xs" readOnly />}
                {field.type === "textarea" && <textarea className="mt-1.5 w-full h-16 text-xs border border-zinc-200 rounded-md p-2 resize-none" placeholder={field.defaultValue || `Enter ${field.name.toLowerCase()}...`} readOnly />}
                {field.type === "number" && <Input type="number" placeholder={field.defaultValue || "0"} className="mt-1.5 h-8 text-xs" readOnly />}
                {field.type === "date" && <Input type="date" className="mt-1.5 h-8 text-xs" readOnly />}
                {field.type === "checkbox" && <div className="flex items-center gap-2 mt-1.5"><input type="checkbox" checked={field.defaultValue === "true"} readOnly className="w-4 h-4" /><span className="text-xs text-zinc-500">{field.name}</span></div>}
                {field.type === "url" && <Input placeholder="https://..." className="mt-1.5 h-8 text-xs" readOnly />}
                {field.type === "user_picker" && <div className="mt-1.5 h-8 border border-zinc-200 rounded-md flex items-center px-2 text-xs text-zinc-400">Select user...</div>}
                {(field.type === "single_select" || field.type === "multi_select") && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {field.options.map(o => <span key={o} className="px-2 py-0.5 bg-zinc-100 rounded text-[10px] text-zinc-600">{o}</span>)}
                    </div>
                )}
                <p className="text-[10px] text-zinc-400 mt-2">Scope: {field.scope.join(", ")}</p>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 p-6 bg-[#fafafa] min-h-screen">
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400">PROJECTS</span>
                <ChevronRight className="w-3 h-3 text-zinc-300" />
                <span className="text-[10px] font-medium text-zinc-400">CUSTOM FIELDS</span>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Custom Fields</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                <SmallCard><SmallCardHeader><Type className="w-4 h-4 text-indigo-500" /><span className="text-xs font-medium text-zinc-500">Total Fields</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{stats.total}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><AlignLeft className="w-4 h-4 text-blue-500" /><span className="text-xs font-medium text-zinc-500">Text Fields</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{stats.text}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><List className="w-4 h-4 text-purple-500" /><span className="text-xs font-medium text-zinc-500">Select Fields</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{stats.select}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><CalendarDays className="w-4 h-4 text-green-500" /><span className="text-xs font-medium text-zinc-500">Date Fields</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{stats.date}</span></SmallCardContent></SmallCard>
            </div>

            {/* Search + Create */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input placeholder="Search fields..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
                </div>
                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { resetForm(); setShowCreateDialog(true) }}>
                    <Plus className="w-3.5 h-3.5 mr-1" />Create Field
                </Button>
            </div>

            {/* Fields Table */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-[40px]">Order</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Name</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Type</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Required</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Scope</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Used In</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-[60px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFields.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center text-xs text-zinc-400 py-8">No fields found</TableCell></TableRow>
                        ) : filteredFields.map((field, idx) => (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <div className="flex flex-col items-center gap-0.5">
                                        <button onClick={() => moveField(field.id, "up")} disabled={idx === 0} className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                                        <button onClick={() => moveField(field.id, "down")} disabled={idx === filteredFields.length - 1} className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-medium text-zinc-900">{field.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        {FIELD_TYPE_META[field.type].icon}
                                        <span className="text-xs text-zinc-600">{FIELD_TYPE_META[field.type].label}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={field.required ? "default" : "secondary"} className="text-[10px]">
                                        {field.required ? "Required" : "Optional"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {field.scope.map(s => <span key={s} className="px-1.5 py-0.5 bg-zinc-100 rounded text-[10px] text-zinc-600">{s}</span>)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-zinc-600">{field.usedIn} issues</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setShowPreview(field)}><Eye className="w-3.5 h-3.5 mr-2" />Preview</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setForm({ name: field.name, type: field.type, required: field.required, defaultValue: field.defaultValue, scope: [...field.scope], options: [...field.options], newOption: "" })
                                                setEditingField(field)
                                            }}><Edit3 className="w-3.5 h-3.5 mr-2" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleRequired(field.id)}><ToggleLeft className="w-3.5 h-3.5 mr-2" />{field.required ? "Make Optional" : "Make Required"}</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteFieldId(field.id)}><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Field Ordering Section */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-zinc-900 mb-3">Field Display Order</h3>
                <p className="text-[10px] text-zinc-400 mb-3">Reorder how fields appear on the issue form using the arrows.</p>
                <div className="flex flex-col gap-1">
                    {fields.sort((a, b) => a.order - b.order).map((field, idx) => (
                        <div key={field.id} className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded border border-zinc-100">
                            <GripVertical className="w-3.5 h-3.5 text-zinc-300" />
                            <span className="text-xs text-zinc-400 w-5">{idx + 1}.</span>
                            <span className="flex items-center gap-1.5 text-xs text-zinc-700 flex-1">{FIELD_TYPE_META[field.type].icon}{field.name}</span>
                            <button onClick={() => moveField(field.id, "up")} disabled={idx === 0} className="p-0.5 text-zinc-400 hover:text-zinc-600 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                            <button onClick={() => moveField(field.id, "down")} disabled={idx === fields.length - 1} className="p-0.5 text-zinc-400 hover:text-zinc-600 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Create Custom Field</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Define a new field for your project issues.</DialogDescription>
                    </DialogHeader>
                    {renderFieldForm()}
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingField} onOpenChange={o => { if (!o) { setEditingField(null); resetForm() } }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Edit Custom Field</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Update the field configuration.</DialogDescription>
                    </DialogHeader>
                    {renderFieldForm()}
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => { setEditingField(null); resetForm() }}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteFieldId} onOpenChange={o => !o && setDeleteFieldId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Delete Custom Field</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            {fields.find(f => f.id === deleteFieldId)?.usedIn
                                ? <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" />This field is used in {fields.find(f => f.id === deleteFieldId)?.usedIn} issues. Deleting it will remove the field data from those issues.</span>
                                : "Are you sure you want to delete this field? This action cannot be undone."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setDeleteFieldId(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={!!showPreview} onOpenChange={o => !o && setShowPreview(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Field Preview</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">This is how the field will appear on an issue form.</DialogDescription>
                    </DialogHeader>
                    {showPreview && renderPreview(showPreview)}
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowPreview(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}