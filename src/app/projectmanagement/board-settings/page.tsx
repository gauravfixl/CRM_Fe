"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Settings2,
    Plus,
    ChevronRight,
    Trash2,
    Loader2,
    Columns3,
    GripVertical,
    Palette,
    ArrowLeft,
    ArrowRight,
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
import SidePanel from "@/shared/components/projectmanagement/side-panel"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkflowStore, type Column, type Transition } from "@/shared/data/workflow-store"

const schema = z.object({
    name: z.string().trim().min(2, "Column name is required").max(40),
    key: z.string().trim().regex(/^[A-Z_]+$/, "Use UPPER_SNAKE letters only").max(20),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Pick a valid color"),
    limit: z.coerce.number().int().min(0).max(99).optional(),
})
type FormValues = z.infer<typeof schema>

export default function BoardConfigPage() {
    const [mounted, setMounted] = useState(false)
    const { projects } = useProjectStore()
    const { getConfig, addColumn, updateColumn, deleteColumn, moveColumn, updateTransitions } = useWorkflowStore()
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [isOpen, setIsOpen] = useState(false)
    const [editingColumn, setEditingColumn] = useState<Column | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
        useProjectStore.persist.rehydrate()
        useWorkflowStore.persist.rehydrate()
    }, [])

    // Default to first project on load
    useEffect(() => {
        if (mounted && !selectedProjectId && projects.length > 0) {
            setSelectedProjectId(projects[0].id)
        }
    }, [mounted, projects, selectedProjectId])

    const { register, handleSubmit, reset, setValue, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { name: "", key: "", color: "#6366f1", limit: undefined },
    })

    useEffect(() => {
        if (isOpen && editingColumn) {
            reset({
                name: editingColumn.name,
                key: editingColumn.key,
                color: editingColumn.color,
                limit: editingColumn.limit,
            })
        } else if (isOpen) {
            reset({ name: "", key: "", color: "#6366f1", limit: undefined })
        }
    }, [isOpen, editingColumn, reset])

    const config = useMemo(() => selectedProjectId ? getConfig(selectedProjectId) : null, [selectedProjectId, getConfig])
    const columns = config?.columns || []

    if (!mounted) return null

    const onSubmit = async (values: FormValues) => {
        if (!selectedProjectId) return
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 200))
        if (editingColumn) {
            updateColumn(selectedProjectId, editingColumn.id, {
                name: values.name,
                key: values.key,
                color: values.color,
                limit: values.limit,
            })
        } else {
            addColumn(selectedProjectId, {
                name: values.name,
                key: values.key,
                color: values.color,
                limit: values.limit,
            })
        }
        setIsLoading(false)
        setIsOpen(false)
        setEditingColumn(null)
        reset()
    }

    const handleDelete = (col: Column) => {
        if (columns.length <= 2) {
            alert("Boards need at least 2 columns.")
            return
        }
        if (confirm(`Delete column "${col.name}"? Issues in this status will need to be re-categorized.`)) {
            deleteColumn(selectedProjectId, col.id)
        }
    }

    const kpis = [
        { label: "Columns", value: columns.length, icon: <Columns3 size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "WIP Limits", value: columns.filter(c => c.limit && c.limit > 0).length, icon: <Settings2 size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Color Coded", value: columns.length, icon: <Palette size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
        { label: "Done Status", value: columns.filter(c => c.key === "DONE" || c.key === "COMPLETED").length, icon: <ChevronRight size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Settings2 size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Board Configuration</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Define columns, WIP limits, and the workflow for each project's board.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                        <SelectTrigger className="h-9 w-56 text-xs rounded-none">
                            <SelectValue placeholder="Pick a project" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.icon} {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => { setEditingColumn(null); setIsOpen(true) }} disabled={!selectedProjectId} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                        <Plus size={14} strokeWidth={3} /> Add Column
                    </Button>
                </div>
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

            {/* Transition matrix */}
            {selectedProjectId && columns.length > 0 && (
                <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Allowed Transitions</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Toggle which status changes are permitted. Empty matrix = all allowed.</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => updateTransitions(selectedProjectId, [])}
                            className="h-8 text-xs font-bold border-slate-200 rounded-none"
                        >
                            Reset (Allow All)
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/60 border-b border-slate-200">
                                <tr>
                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">From \ To</th>
                                    {columns.map(c => (
                                        <th key={c.id} className="px-3 py-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">{c.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {columns.map(fromCol => (
                                    <tr key={fromCol.id} className="hover:bg-slate-50">
                                        <td className="px-3 py-2 text-[11px] font-bold text-slate-700">{fromCol.name}</td>
                                        {columns.map(toCol => {
                                            const transitions = config?.transitions || []
                                            const isEmpty = transitions.length === 0
                                            const isAllowed = isEmpty || transitions.some(t => t.from === fromCol.key && t.to === toCol.key)
                                            const isSelf = fromCol.id === toCol.id
                                            return (
                                                <td key={toCol.id} className="px-3 py-2 text-center">
                                                    {isSelf ? (
                                                        <span className="text-slate-200">—</span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (!selectedProjectId) return
                                                                const next: Transition[] = isEmpty
                                                                    // First time toggling: explicitly enumerate all currently-allowed transitions then flip this one off
                                                                    ? columns.flatMap(f =>
                                                                        columns
                                                                            .filter(t => t.id !== f.id)
                                                                            .map(t => ({ from: f.key, to: t.key }))
                                                                    ).filter(t => !(t.from === fromCol.key && t.to === toCol.key))
                                                                    : isAllowed
                                                                        ? transitions.filter(t => !(t.from === fromCol.key && t.to === toCol.key))
                                                                        : [...transitions, { from: fromCol.key, to: toCol.key }]
                                                                updateTransitions(selectedProjectId, next)
                                                            }}
                                                            className={`h-6 w-6 inline-flex items-center justify-center transition-colors rounded-none ${isAllowed ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                                                        >
                                                            {isAllowed ? "✓" : "✕"}
                                                        </button>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Columns list */}
            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Workflow Columns</h3>
                    {selectedProjectId && (
                        <span className="text-[11px] font-bold text-slate-500">
                            {projects.find(p => p.id === selectedProjectId)?.name}
                        </span>
                    )}
                </div>
                {!selectedProjectId ? (
                    <div className="py-12 text-center text-slate-400 text-xs">Pick a project to configure its workflow.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {columns.sort((a, b) => a.order - b.order).map((c, idx) => (
                            <div key={c.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group">
                                <GripVertical size={16} className="text-slate-300" />
                                <div className="h-3 w-3 rounded-none" style={{ backgroundColor: c.color }} />
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                                    <p className="text-[11px] font-mono text-slate-400">{c.key}</p>
                                </div>
                                {c.limit !== undefined && c.limit > 0 && (
                                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-none">WIP: {c.limit}</span>
                                )}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => moveColumn(selectedProjectId, c.id, "left")}
                                        className={`h-7 w-7 flex items-center justify-center rounded-none ${idx === 0 ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-indigo-600"}`}
                                    >
                                        <ArrowLeft size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={idx === columns.length - 1}
                                        onClick={() => moveColumn(selectedProjectId, c.id, "right")}
                                        className={`h-7 w-7 flex items-center justify-center rounded-none ${idx === columns.length - 1 ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-indigo-600"}`}
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEditingColumn(c); setIsOpen(true) }}
                                        className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-none"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(c)}
                                        className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-none"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {columns.length === 0 && (
                            <div className="py-10 text-center text-slate-400 text-xs">No columns yet. Add one to get started.</div>
                        )}
                    </div>
                )}
            </div>

            <SidePanel
                open={isOpen}
                onClose={() => { setIsOpen(false); setEditingColumn(null) }}
                title={editingColumn ? "Edit Column" : "Add Board Column"}
                description="Define a workflow column for the project's board."
                width="md"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditingColumn(null) }} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button type="submit" form="col-form" disabled={!isValid || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : editingColumn ? "Save Changes" : "Add Column"}
                        </Button>
                    </div>
                }
            >
                <form id="col-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Column Name <span className="text-rose-500">*</span></Label>
                        <Input {...register("name")} placeholder="e.g. Blocked" className="rounded-none" />
                        {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key <span className="text-rose-500">*</span></Label>
                        <Input {...register("key")} placeholder="BLOCKED" className="rounded-none uppercase" onChange={(e) => setValue("key", e.target.value.toUpperCase(), { shouldValidate: true })} />
                        {errors.key && <p className="text-[11px] font-semibold text-rose-600">{errors.key.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Color</Label>
                        <Input type="color" {...register("color")} className="h-10 w-20 rounded-none cursor-pointer p-1" />
                        {errors.color && <p className="text-[11px] font-semibold text-rose-600">{errors.color.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">WIP Limit (optional)</Label>
                        <Input type="number" {...register("limit")} placeholder="e.g. 5" className="rounded-none" min={0} max={99} />
                        {errors.limit && <p className="text-[11px] font-semibold text-rose-600">{errors.limit.message}</p>}
                    </div>
                </form>
            </SidePanel>
        </div>
    )
}
