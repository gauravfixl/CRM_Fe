"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, ListTree, Tag as TagIcon, Search } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useToast } from "@/shared/components/ui/use-toast"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { useAdminSettingsStore, type CustomField, type Tag } from "@/shared/data/admin-settings-store"
import { validateField } from "@/shared/components/admin-settings/validation"

type SubTab = "fields" | "tags"

const FIELD_TYPES: CustomField["type"][] = ["Text", "Number", "Date", "Dropdown", "Checkbox", "Email", "URL"]
const APPLIES_TO: CustomField["appliesTo"][] = ["Lead", "Client", "Project", "Invoice", "Employee"]
const TAG_APPLIES_TO = ["Lead", "Client", "Project", "Invoice", "Employee", "Task"]
const TAG_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#2563eb", "#8b5cf6", "#ec4899", "#06b6d4", "#64748b"]

export default function CustomFieldsTagsPage() {
    const [tab, setTab] = useState<SubTab>("fields")

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                    <ListTree className="w-5 h-5 text-[#8b5cf6]" /> Custom Fields & Tags
                </h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Extend records with custom data fields and reusable tags.</p>
            </div>

            <div className="flex items-center gap-1 border-b border-[#EEF1F6] bg-white">
                <TabBtn active={tab === "fields"} onClick={() => setTab("fields")} icon={<ListTree className="w-3.5 h-3.5" />} label="Custom Fields" />
                <TabBtn active={tab === "tags"} onClick={() => setTab("tags")} icon={<TagIcon className="w-3.5 h-3.5" />} label="Tags" />
            </div>

            {tab === "fields" ? <FieldsPanel /> : <TagsPanel />}
        </div>
    )
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="px-4 py-2.5 text-[13px] font-semibold inline-flex items-center gap-2 transition-colors border-b-2"
            style={{
                borderColor: active ? "#8b5cf6" : "transparent",
                color: active ? "#8b5cf6" : "#64748B",
                background: active ? "rgba(139,92,246,0.04)" : "transparent",
            }}
        >
            {icon} {label}
        </button>
    )
}

// ---------------- Custom Fields ----------------
type FieldFormShape = {
    fieldName: string
    fieldKey: string
    type: CustomField["type"]
    appliesTo: CustomField["appliesTo"]
    required: boolean
    status: CustomField["status"]
}

const fieldEmpty: FieldFormShape = {
    fieldName: "", fieldKey: "", type: "Text", appliesTo: "Lead", required: false, status: "Active",
}

function FieldsPanel() {
    const { toast } = useToast()
    const fields = useAdminSettingsStore((s) => s.customFields)
    const addField = useAdminSettingsStore((s) => s.addCustomField)
    const updateField = useAdminSettingsStore((s) => s.updateCustomField)
    const deleteField = useAdminSettingsStore((s) => s.deleteCustomField)

    const [search, setSearch] = useState("")
    const [filterApplies, setFilterApplies] = useState("all")

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<CustomField | null>(null)
    const [data, setData] = useState<FieldFormShape>(fieldEmpty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState<CustomField | null>(null)

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({
                fieldName: editing.fieldName, fieldKey: editing.fieldKey, type: editing.type,
                appliesTo: editing.appliesTo, required: editing.required, status: editing.status,
            })
        } else setData(fieldEmpty)
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const setField = (k: keyof FieldFormShape, v: any) => {
        setData((d) => ({ ...d, [k]: v }))
        if (touched[k as string]) {
            const err = validateField(k as string, v)
            setErrors((e) => ({ ...e, [k]: err ?? "" }))
        }
    }
    const onBlur = (k: keyof FieldFormShape) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((e) => ({ ...e, [k]: validateField(k as string, data[k]) ?? "" }))
    }

    const validate = () => {
        const next: Record<string, string> = {}
        const requiredFields: Array<keyof FieldFormShape> = ["fieldName", "fieldKey", "type", "appliesTo", "status"]
        for (const f of requiredFields) {
            const err = validateField(f as string, data[f])
            if (err) next[f] = err
        }
        setErrors(next)
        setTouched(Object.fromEntries(requiredFields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) { toast({ title: "Please fix the highlighted fields", variant: "destructive" }); return }
        setSubmitting(true)
        try {
            const payload: Omit<CustomField, "id"> = {
                fieldName: data.fieldName.trim(),
                fieldKey: data.fieldKey.trim().toLowerCase(),
                type: data.type,
                appliesTo: data.appliesTo,
                required: data.required,
                status: data.status,
            }
            if (mode === "edit" && editing) {
                updateField(editing.id, payload)
                toast({ title: "Field updated", description: payload.fieldName })
            } else {
                addField(payload)
                toast({ title: "Field added", description: payload.fieldName })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const filtered = useMemo(() => fields.filter((f) => {
        if (filterApplies !== "all" && f.appliesTo !== filterApplies) return false
        if (search.trim()) {
            const q = search.toLowerCase()
            return [f.fieldName, f.fieldKey, f.type].some((v) => v.toLowerCase().includes(q))
        }
        return true
    }), [fields, search, filterApplies])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#64748B]">{fields.length} custom field{fields.length !== 1 ? "s" : ""} defined.</p>
                <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Field
                </Button>
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm p-4 flex flex-wrap items-center gap-3 rounded-none">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fields..." className="pl-8 h-9 text-[13px] border-[#E5E7EB] rounded-none" />
                </div>
                <Select value={filterApplies} onValueChange={setFilterApplies}>
                    <SelectTrigger className="h-9 w-[180px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All entities</SelectItem>
                        {APPLIES_TO.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm overflow-hidden rounded-none">
                <table className="w-full text-[13px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#EEF1F6]">
                        <tr>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">Field Name</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">Key</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[120px]">Type</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[120px]">Applies To</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[100px]">Required</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[100px]">Status</th>
                            <th className="w-[80px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-12 text-[#94A3B8] text-[13px]">No fields match.</td></tr>
                        ) : filtered.map((f) => (
                            <tr key={f.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#FAFBFC]">
                                <td className="px-4 py-2.5 font-semibold text-[#0F172A]">{f.fieldName}</td>
                                <td className="px-4 py-2.5 font-mono text-[12px] text-[#64748B]">{f.fieldKey}</td>
                                <td className="px-4 py-2.5">
                                    <span className="inline-flex items-center px-2 py-0.5 border text-[11.5px] font-semibold rounded-none" style={{ background: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.30)", color: "#6d28d9" }}>{f.type}</span>
                                </td>
                                <td className="px-4 py-2.5 text-[#0F172A]">{f.appliesTo}</td>
                                <td className="px-4 py-2.5">{f.required ? <span className="text-red-600 font-semibold">Yes</span> : <span className="text-[#94A3B8]">No</span>}</td>
                                <td className="px-4 py-2.5">
                                    <span className="inline-flex items-center px-2 py-0.5 border text-[11.5px] font-semibold rounded-none" style={{
                                        background: f.status === "Active" ? "rgba(16,185,129,0.08)" : "rgba(148,163,184,0.10)",
                                        borderColor: f.status === "Active" ? "rgba(16,185,129,0.30)" : "rgba(148,163,184,0.30)",
                                        color: f.status === "Active" ? "#047857" : "#475569",
                                    }}>{f.status}</span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-none">
                                                <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => { setEditing(f); setMode("edit"); setFormOpen(true) }} className="text-[13px] cursor-pointer">
                                                <Pencil className="w-4 h-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => setDeleting(f)} className="text-[13px] cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Custom Field" : "Add Custom Field"}
                description="Add additional data points to records (e.g., GSTIN, Reference No)."
                icon={<ListTree className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="md"
                accentColor="#8b5cf6"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Field Name" required error={touched.fieldName ? errors.fieldName : undefined} className="sm:col-span-2">
                        <Input value={data.fieldName} onChange={(e) => setField("fieldName", e.target.value)} onBlur={() => onBlur("fieldName")} placeholder="e.g. GSTIN" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Field Key" required error={touched.fieldKey ? errors.fieldKey : undefined} hint="lowercase, hyphens, used in API/imports" className="sm:col-span-2">
                        <Input value={data.fieldKey} onChange={(e) => setField("fieldKey", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} onBlur={() => onBlur("fieldKey")} placeholder="gstin" className="h-10 border-[#E5E7EB] text-[13px] font-mono rounded-none" />
                    </Field>
                    <Field label="Field Type" required>
                        <Select value={data.type} onValueChange={(v) => setField("type", v as CustomField["type"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{FIELD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Applies To" required>
                        <Select value={data.appliesTo} onValueChange={(v) => setField("appliesTo", v as CustomField["appliesTo"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{APPLIES_TO.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Status" required>
                        <Select value={data.status} onValueChange={(v) => setField("status", v as CustomField["status"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="flex items-center justify-between border border-[#EEF1F6] bg-white px-3 py-2.5">
                        <div>
                            <p className="text-[13px] font-semibold text-[#0F172A]">Required</p>
                            <p className="text-[11.5px] text-[#64748B]">Block save if empty</p>
                        </div>
                        <Switch checked={data.required} onCheckedChange={(v) => setField("required", v)} />
                    </div>
                </div>
            </SideFormSheet>

            <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this field?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span>You are about to delete <span className="font-semibold text-[#0F172A]">{deleting?.fieldName}</span>. Records using this field will lose the value.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (!deleting) return
                                deleteField(deleting.id)
                                toast({ title: "Field deleted", description: deleting.fieldName })
                                setDeleting(null)
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

// ---------------- Tags ----------------
type TagFormShape = { tagName: string; color: string; appliesTo: string }
const tagEmpty: TagFormShape = { tagName: "", color: "#2563eb", appliesTo: "Lead" }

function TagsPanel() {
    const { toast } = useToast()
    const tags = useAdminSettingsStore((s) => s.tags)
    const addTag = useAdminSettingsStore((s) => s.addTag)
    const updateTag = useAdminSettingsStore((s) => s.updateTag)
    const deleteTag = useAdminSettingsStore((s) => s.deleteTag)

    const [search, setSearch] = useState("")

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<Tag | null>(null)
    const [data, setData] = useState<TagFormShape>(tagEmpty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState<Tag | null>(null)

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({ tagName: editing.tagName, color: editing.color, appliesTo: editing.appliesTo })
        } else setData(tagEmpty)
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const set = (k: keyof TagFormShape, v: string) => {
        setData((d) => ({ ...d, [k]: v }))
        if (touched[k as string]) setErrors((e) => ({ ...e, [k]: validateField(k as string, v) ?? "" }))
    }
    const onBlur = (k: keyof TagFormShape) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((e) => ({ ...e, [k]: validateField(k as string, data[k]) ?? "" }))
    }

    const validate = () => {
        const next: Record<string, string> = {}
        const err = validateField("tagName", data.tagName)
        if (err) next.tagName = err
        if (!data.color) next.color = "Color is required"
        if (!data.appliesTo) next.appliesTo = "Applies-to is required"
        setErrors(next)
        setTouched({ tagName: true, color: true, appliesTo: true })
        return Object.keys(next).length === 0
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) { toast({ title: "Please fix the highlighted fields", variant: "destructive" }); return }
        setSubmitting(true)
        try {
            const payload = { tagName: data.tagName.trim(), color: data.color, appliesTo: data.appliesTo }
            if (mode === "edit" && editing) {
                updateTag(editing.id, payload)
                toast({ title: "Tag updated", description: payload.tagName })
            } else {
                addTag(payload)
                toast({ title: "Tag added", description: payload.tagName })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const filtered = useMemo(() => tags.filter((t) => {
        if (search.trim()) {
            const q = search.toLowerCase()
            return [t.tagName, t.appliesTo].some((v) => v.toLowerCase().includes(q))
        }
        return true
    }), [tags, search])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#64748B]">{tags.length} tag{tags.length !== 1 ? "s" : ""} in use.</p>
                <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Tag
                </Button>
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm p-4 flex items-center gap-3 rounded-none">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tags..." className="pl-8 h-9 text-[13px] border-[#E5E7EB] rounded-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map((t) => (
                    <div key={t.id} className="bg-white border border-[#EEF1F6] shadow-sm p-3 flex items-center gap-3 rounded-none">
                        <span className="w-3 h-12" style={{ backgroundColor: t.color }} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">{t.tagName}</p>
                            <p className="text-[11.5px] text-[#64748B]">{t.appliesTo} · used {t.usageCount}×</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-none">
                                    <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => { setEditing(t); setMode("edit"); setFormOpen(true) }} className="text-[13px] cursor-pointer">
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setDeleting(t)} className="text-[13px] cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-12 text-[#94A3B8] text-[13px] bg-white border border-[#EEF1F6]">No tags match.</div>
                )}
            </div>

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Tag" : "Add Tag"}
                description="Reusable colored labels for organizing records."
                icon={<TagIcon className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="md"
                accentColor="#8b5cf6"
            >
                <div className="space-y-4">
                    <Field label="Tag Name" required error={touched.tagName ? errors.tagName : undefined}>
                        <Input value={data.tagName} onChange={(e) => set("tagName", e.target.value)} onBlur={() => onBlur("tagName")} placeholder="e.g. VIP" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Color" required>
                        <div className="flex flex-wrap gap-2">
                            {TAG_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => set("color", c)}
                                    className="w-10 h-10 transition-transform hover:scale-110"
                                    style={{
                                        backgroundColor: c,
                                        boxShadow: data.color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : "none",
                                        borderRadius: 0,
                                    }}
                                />
                            ))}
                        </div>
                    </Field>
                    <Field label="Applies To" required>
                        <Select value={data.appliesTo} onValueChange={(v) => set("appliesTo", v)}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{TAG_APPLIES_TO.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this tag?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span>You are about to delete <span className="font-semibold text-[#0F172A]">{deleting?.tagName}</span>. Records currently using it will lose the tag.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (!deleting) return
                                deleteTag(deleting.id)
                                toast({ title: "Tag deleted", description: deleting.tagName })
                                setDeleting(null)
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
