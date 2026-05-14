"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    SlidersHorizontal,
    Plus,
    Search,
    Trash2,
    Loader2,
    Type,
    Hash,
    CalendarDays,
    List,
    ToggleLeft,
    Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import SidePanel from "@/shared/components/projectmanagement/side-panel"
import { useCustomFieldStore, type FieldType, type CustomField } from "@/shared/data/custom-field-store"
import { useIssueStore } from "@/shared/data/issue-store"

const FIELD_TYPES: { value: FieldType; label: string; icon: React.ReactNode }[] = [
    { value: "TEXT", label: "Text", icon: <Type size={14} /> },
    { value: "NUMBER", label: "Number", icon: <Hash size={14} /> },
    { value: "DATE", label: "Date", icon: <CalendarDays size={14} /> },
    { value: "SELECT", label: "Single Select", icon: <List size={14} /> },
    { value: "BOOLEAN", label: "Yes / No", icon: <ToggleLeft size={14} /> },
]

const schema = z.object({
    name: z.string().trim().min(2, "Name is required").max(60),
    type: z.enum(["TEXT", "NUMBER", "DATE", "SELECT", "BOOLEAN"]),
    required: z.boolean(),
    description: z.string().max(200).optional().or(z.literal("")),
    options: z.string().optional().or(z.literal("")),
})
type FormValues = z.infer<typeof schema>

export default function CustomFieldsPage() {
    const [mounted, setMounted] = useState(false)
    const { fields, addField, updateField, deleteField } = useCustomFieldStore()
    const { issues } = useIssueStore()
    const [query, setQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<FieldType | "all">("all")
    const [isOpen, setIsOpen] = useState(false)
    const [editing, setEditing] = useState<CustomField | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
        useCustomFieldStore.persist.rehydrate()
        useIssueStore.persist.rehydrate()
    }, [])

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { name: "", type: "TEXT", required: false, description: "", options: "" },
    })

    const type = watch("type")
    const required = watch("required")

    useEffect(() => {
        if (isOpen && editing) {
            reset({
                name: editing.name,
                type: editing.type,
                required: editing.required,
                description: editing.description,
                options: (editing.options || []).join(", "),
            })
        } else if (isOpen) {
            reset({ name: "", type: "TEXT", required: false, description: "", options: "" })
        }
    }, [isOpen, editing, reset])

    if (!mounted) return null

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 200))
        const optionsArr = values.type === "SELECT" && values.options
            ? values.options.split(",").map(s => s.trim()).filter(Boolean)
            : undefined
        if (editing) {
            updateField(editing.id, {
                name: values.name,
                type: values.type,
                required: values.required,
                description: values.description || "",
                options: optionsArr,
            })
        } else {
            addField({
                name: values.name,
                type: values.type,
                required: values.required,
                description: values.description || "",
                options: optionsArr,
            })
        }
        setIsLoading(false)
        setIsOpen(false)
        setEditing(null)
        reset()
    }

    // Real usage count from issue.customFields
    const usageCount = useMemo(() => {
        const map: Record<string, number> = {}
        fields.forEach(f => {
            map[f.id] = issues.filter(i => i.customFields && i.customFields[f.id] !== undefined && i.customFields[f.id] !== null && i.customFields[f.id] !== "").length
        })
        return map
    }, [fields, issues])

    const filtered = fields.filter(f => {
        if (typeFilter !== "all" && f.type !== typeFilter) return false
        const q = query.trim().toLowerCase()
        return !q || f.name.toLowerCase().includes(q)
    })

    const kpis = [
        { label: "Total Fields", value: fields.length, icon: <SlidersHorizontal size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "all" as const },
        { label: "Required", value: fields.filter(f => f.required).length, icon: <Type size={18} />, color: "text-rose-800", bg: "bg-rose-100", filter: "all" as const },
        { label: "Optional", value: fields.filter(f => !f.required).length, icon: <Hash size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "all" as const },
        { label: "In Use", value: Object.values(usageCount).filter(n => n > 0).length, icon: <List size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "all" as const },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <SlidersHorizontal size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Custom Fields</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Define extra attributes for your issues and projects.
                    </p>
                </div>
                <Button onClick={() => { setEditing(null); setIsOpen(true) }} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} strokeWidth={3} /> New Field
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <div key={i} className={`block border shadow-sm h-[75px] rounded-none ${stat.bg}`}>
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>{stat.icon}</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fields..." className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none" />
                </div>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                    <SelectTrigger className="h-9 w-44 text-xs rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {FIELD_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Required</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Used By</th>
                            <th className="px-4 py-2 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(f => (
                            <tr key={f.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">{f.name}</span>
                                        <span className="text-[11px] text-slate-400">{f.description}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge className="bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-none flex items-center gap-1 w-fit">
                                        {FIELD_TYPES.find(t => t.value === f.type)?.icon}
                                        {FIELD_TYPES.find(t => t.value === f.type)?.label}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    {f.required ? (
                                        <Badge className="bg-rose-50 text-rose-700 text-[10px] font-bold rounded-none">Required</Badge>
                                    ) : (
                                        <Badge className="bg-slate-50 text-slate-500 text-[10px] font-bold rounded-none">Optional</Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-xs font-bold text-slate-600">{usageCount[f.id] || 0} issues</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => { setEditing(f); setIsOpen(true) }}
                                            className="h-7 w-7 inline-flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-none"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { if (confirm("Delete field?")) deleteField(f.id) }}
                                            className="h-7 w-7 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-none"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-xs text-slate-400 font-medium">No custom fields.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <SidePanel
                open={isOpen}
                onClose={() => { setIsOpen(false); setEditing(null) }}
                title={editing ? "Edit Custom Field" : "Create Custom Field"}
                description="Add a new attribute that can be set on issues."
                width="md"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditing(null) }} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button type="submit" form="cf-form" disabled={!isValid || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : editing ? "Save" : "Create Field"}
                        </Button>
                    </div>
                }
            >
                <form id="cf-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Field Name <span className="text-rose-500">*</span></Label>
                        <Input {...register("name")} placeholder="e.g. Story Points" className="rounded-none" />
                        {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</Label>
                        <Select value={type} onValueChange={(v) => setValue("type", v as FieldType, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{FIELD_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    {type === "SELECT" && (
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Options (comma-separated)</Label>
                            <Input {...register("options")} placeholder="Low, Medium, High" className="rounded-none" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                        <Input {...register("description")} placeholder="What is this field for?" className="rounded-none" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={required} onChange={(e) => setValue("required", e.target.checked, { shouldValidate: true })} className="rounded-none" />
                        <span className="text-[12px] font-bold text-slate-700">Required on all issues</span>
                    </label>
                </form>
            </SidePanel>
        </div>
    )
}
