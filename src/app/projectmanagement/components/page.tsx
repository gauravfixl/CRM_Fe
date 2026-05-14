"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Component,
    Plus,
    Search,
    Trash2,
    Loader2,
    Tag as TagIcon,
    Folder,
    Layers,
    Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import SidePanel from "@/shared/components/projectmanagement/side-panel"
import { useProjectStore } from "@/shared/data/projects-store"
import { useComponentStore, type ProjectComponent } from "@/shared/data/component-store"
import { useIssueStore } from "@/shared/data/issue-store"

const COLORS = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-blue-500", "bg-purple-500"]

const schema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
    description: z.string().max(200).optional().or(z.literal("")),
    projectId: z.string().min(1, "Pick a project"),
    leadName: z.string().trim().min(2, "Lead is required"),
    color: z.string().min(1, "Pick a color"),
})
type FormValues = z.infer<typeof schema>

export default function ComponentsPage() {
    const [mounted, setMounted] = useState(false)
    const { projects } = useProjectStore()
    const { components, addComponent, updateComponent, deleteComponent } = useComponentStore()
    const { issues } = useIssueStore()
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [editing, setEditing] = useState<ProjectComponent | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
        useComponentStore.persist.rehydrate()
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { name: "", description: "", projectId: "", leadName: "", color: COLORS[0] },
    })

    const projectId = watch("projectId")
    const color = watch("color")

    useEffect(() => {
        if (isOpen && editing) {
            reset({
                name: editing.name,
                description: editing.description,
                projectId: editing.projectId,
                leadName: editing.leadName,
                color: editing.color,
            })
        } else if (isOpen) {
            reset({ name: "", description: "", projectId: "", leadName: "", color: COLORS[0] })
        }
    }, [isOpen, editing, reset])

    if (!mounted) return null

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 200))
        if (editing) {
            updateComponent(editing.id, {
                name: values.name,
                description: values.description || "",
                projectId: values.projectId,
                leadName: values.leadName,
                color: values.color,
            })
        } else {
            addComponent({
                name: values.name,
                description: values.description || "",
                projectId: values.projectId,
                leadName: values.leadName,
                color: values.color,
            })
        }
        setIsLoading(false)
        setIsOpen(false)
        setEditing(null)
        reset()
    }

    // Compute issue count per component from real issues
    const componentIssueCount = useMemo(() => {
        const map: Record<string, number> = {}
        components.forEach(c => {
            map[c.id] = issues.filter(i => i.componentId === c.id).length
        })
        return map
    }, [components, issues])

    const filtered = components.filter(c => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    })

    const kpis = [
        { label: "Total Components", value: components.length, icon: <Component size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "Projects Used", value: new Set(components.map(c => c.projectId)).size, icon: <Folder size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Linked Issues", value: Object.values(componentIssueCount).reduce((s, n) => s + n, 0), icon: <TagIcon size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Unassigned", value: components.filter(c => !c.leadName).length, icon: <Layers size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Component size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Components</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Logical sub-sections used to categorize work inside projects.
                    </p>
                </div>
                <Button onClick={() => { setEditing(null); setIsOpen(true) }} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} strokeWidth={3} /> New Component
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

            <div className="relative max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search components..."
                    className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(c => {
                    const project = projects.find(p => p.id === c.projectId)
                    const issueCount = componentIssueCount[c.id] || 0
                    return (
                        <div key={c.id} className="border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all group rounded-none">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`h-9 w-9 ${c.color} text-white flex items-center justify-center rounded-none`}>
                                    <Component size={16} />
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => { setEditing(c); setIsOpen(true) }}
                                        className="h-7 w-7 flex items-center justify-center text-slate-300 hover:text-indigo-600 rounded-none"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { if (confirm("Delete component?")) deleteComponent(c.id) }}
                                        className="h-7 w-7 flex items-center justify-center text-slate-300 hover:text-rose-600 rounded-none"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                            <p className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-2">{c.description}</p>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                                <Badge className="bg-slate-50 text-slate-600 text-[10px] font-bold rounded-none">{project?.key || "?"}</Badge>
                                <Badge className="bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-none">{issueCount} issues</Badge>
                                <span className="text-[11px] font-bold text-slate-500 truncate ml-auto">Lead: {c.leadName}</span>
                            </div>
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-none">
                        <Component size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No components yet.</p>
                    </div>
                )}
            </div>

            <SidePanel
                open={isOpen}
                onClose={() => { setIsOpen(false); setEditing(null) }}
                title={editing ? "Edit Component" : "Create Component"}
                description="A logical sub-section within a project for routing issues."
                width="md"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditing(null) }} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button type="submit" form="comp-form" disabled={!isValid || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : editing ? "Save" : "Create"}
                        </Button>
                    </div>
                }
            >
                <form id="comp-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name <span className="text-rose-500">*</span></Label>
                        <Input {...register("name")} placeholder="e.g. Frontend Core" className="rounded-none" />
                        {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                        <Textarea {...register("description")} placeholder="Short summary..." className="min-h-[80px] resize-none rounded-none" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project <span className="text-rose-500">*</span></Label>
                        <Select value={projectId} onValueChange={(v) => setValue("projectId", v, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none"><SelectValue placeholder="Pick a project" /></SelectTrigger>
                            <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.projectId && <p className="text-[11px] font-semibold text-rose-600">{errors.projectId.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lead <span className="text-rose-500">*</span></Label>
                        <Input {...register("leadName")} placeholder="Lead name" className="rounded-none" />
                        {errors.leadName && <p className="text-[11px] font-semibold text-rose-600">{errors.leadName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Color</Label>
                        <div className="flex items-center gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setValue("color", c, { shouldValidate: true })}
                                    className={`h-8 w-8 ${c} border-2 transition-all rounded-none ${color === c ? "border-slate-900 scale-110" : "border-white"}`}
                                />
                            ))}
                        </div>
                    </div>
                </form>
            </SidePanel>
        </div>
    )
}
