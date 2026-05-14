"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Layers,
    Plus,
    Search,
    ChevronRight,
    Target,
    Flag,
    Calendar as CalendarIcon,
    Loader2,
    Trash2,
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
import { useSprintEpicStore, type Epic } from "@/shared/data/sprint-epic-store"
import { useIssueStore } from "@/shared/data/issue-store"

type EpicStatus = "OPEN" | "IN_PROGRESS" | "DONE"

const STATUS_OPTIONS: { value: EpicStatus; label: string }[] = [
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
]

const EPIC_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"]

const epicSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    description: z.string().max(400).optional().or(z.literal("")),
    projectId: z.string().min(1, "Pick a project"),
    status: z.enum(["OPEN", "IN_PROGRESS", "DONE"]),
    color: z.string().min(1),
})
type EpicFormValues = z.infer<typeof epicSchema>

export default function EpicsPage() {
    const [mounted, setMounted] = useState(false)
    const { projects } = useProjectStore()
    const { epics, addEpic, updateEpic, deleteEpic } = useSprintEpicStore()
    const { issues } = useIssueStore()
    const [query, setQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<EpicStatus | "all">("all")
    const [isOpen, setIsOpen] = useState(false)
    const [editingEpic, setEditingEpic] = useState<Epic | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
        useSprintEpicStore.persist.rehydrate()
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<EpicFormValues>({
        resolver: zodResolver(epicSchema),
        mode: "onChange",
        defaultValues: { name: "", description: "", projectId: "", status: "OPEN", color: EPIC_COLORS[0] },
    })

    const projectId = watch("projectId")
    const status = watch("status")
    const color = watch("color")

    useEffect(() => {
        if (isOpen && editingEpic) {
            reset({
                name: editingEpic.name,
                description: editingEpic.description || "",
                projectId: editingEpic.projectId,
                status: editingEpic.status,
                color: editingEpic.color,
            })
        } else if (isOpen) {
            reset({ name: "", description: "", projectId: "", status: "OPEN", color: EPIC_COLORS[0] })
        }
    }, [isOpen, editingEpic, reset])

    if (!mounted) return null

    const onSubmit = async (values: EpicFormValues) => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 200))
        if (editingEpic) {
            updateEpic(editingEpic.id, {
                name: values.name,
                description: values.description || "",
                projectId: values.projectId,
                status: values.status,
                color: values.color,
            })
        } else {
            addEpic({
                id: `epic-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: values.name,
                description: values.description || "",
                projectId: values.projectId,
                status: values.status,
                color: values.color,
                createdAt: new Date().toISOString(),
            })
        }
        setIsLoading(false)
        setIsOpen(false)
        setEditingEpic(null)
        reset()
    }

    const handleDelete = (epicId: string) => {
        if (confirm("Delete this epic? Linked issues won't be deleted but will lose the epic association.")) {
            deleteEpic(epicId)
        }
    }

    const handleEdit = (epic: Epic) => {
        setEditingEpic(epic)
        setIsOpen(true)
    }

    // Compute progress per epic from real issues
    const epicProgress = useMemo(() => {
        const map: Record<string, { total: number; done: number; progress: number }> = {}
        epics.forEach(e => {
            const epicIssues = issues.filter(i => i.epicId === e.id)
            const done = epicIssues.filter(i => i.status === "DONE").length
            const total = epicIssues.length
            map[e.id] = { total, done, progress: total > 0 ? Math.round((done / total) * 100) : 0 }
        })
        return map
    }, [epics, issues])

    const filteredEpics = epics.filter(e => {
        if (statusFilter !== "all" && e.status !== statusFilter) return false
        const q = query.trim().toLowerCase()
        if (!q) return true
        return e.name.toLowerCase().includes(q) || (e.description || "").toLowerCase().includes(q)
    })

    const kpis = [
        { label: "Total Epics", value: epics.length, icon: <Layers size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "all" as const },
        { label: "Open", value: epics.filter(e => e.status === "OPEN").length, icon: <Flag size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "OPEN" as const },
        { label: "In Progress", value: epics.filter(e => e.status === "IN_PROGRESS").length, icon: <Target size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "IN_PROGRESS" as const },
        { label: "Done", value: epics.filter(e => e.status === "DONE").length, icon: <CalendarIcon size={18} />, color: "text-rose-800", bg: "bg-rose-100", filter: "DONE" as const },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Layers size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Epics</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Large bodies of work that span multiple sprints.
                    </p>
                </div>
                <Button onClick={() => { setEditingEpic(null); setIsOpen(true) }} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} strokeWidth={3} /> New Epic
                </Button>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setStatusFilter(stat.filter)}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer text-left ${stat.bg} ${statusFilter === stat.filter ? "ring-2 ring-indigo-500" : ""}`}
                    >
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-500/60" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search epics..."
                        className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none"
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEpics.map(epic => {
                    const project = projects.find(p => p.id === epic.projectId)
                    const stats = epicProgress[epic.id] || { total: 0, done: 0, progress: 0 }
                    return (
                        <div key={epic.id} className="border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all rounded-none group">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                    <div className="h-3 w-3 mt-1 shrink-0" style={{ backgroundColor: epic.color }} />
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-slate-900 truncate">{epic.name}</h3>
                                        <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">{project?.name || "Unknown Project"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Badge className={`text-[10px] font-bold rounded-none ${epic.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700" : epic.status === "DONE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
                                        {epic.status.replace("_", " ")}
                                    </Badge>
                                    <button onClick={() => handleEdit(epic)} className="h-7 w-7 flex items-center justify-center text-slate-300 hover:text-indigo-600 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 size={12} /></button>
                                    <button onClick={() => handleDelete(epic.id)} className="h-7 w-7 flex items-center justify-center text-slate-300 hover:text-rose-600 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{epic.description || "No description"}</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                    <span>Progress · {stats.done}/{stats.total} issues</span>
                                    <span>{stats.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-none">
                                    <div className="h-full transition-all rounded-none" style={{ width: `${stats.progress}%`, backgroundColor: epic.color }} />
                                </div>
                            </div>
                        </div>
                    )
                })}
                {filteredEpics.length === 0 && (
                    <div className="md:col-span-2 py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-none">
                        <Layers size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No epics yet.</p>
                        <Button onClick={() => { setEditingEpic(null); setIsOpen(true) }} className="mt-3 h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 rounded-none">
                            <Plus size={14} strokeWidth={3} /> Create your first epic
                        </Button>
                    </div>
                )}
            </div>

            {/* Create / Edit Epic Form */}
            <SidePanel
                open={isOpen}
                onClose={() => { setIsOpen(false); setEditingEpic(null) }}
                title={editingEpic ? "Edit Epic" : "Create Epic"}
                description="A high-level body of work that groups related stories."
                width="lg"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditingEpic(null) }} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button type="submit" form="create-epic-form" disabled={!isValid || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : editingEpic ? "Save Changes" : "Create Epic"}
                        </Button>
                    </div>
                }
            >
                <form id="create-epic-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Epic Name <span className="text-rose-500">*</span></Label>
                        <Input {...register("name")} placeholder="e.g. Authentication v2" className="rounded-none" />
                        {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                        <Textarea {...register("description")} placeholder="High-level goal of this epic..." className="min-h-[90px] resize-none rounded-none" />
                        {errors.description && <p className="text-[11px] font-semibold text-rose-600">{errors.description.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project <span className="text-rose-500">*</span></Label>
                            <Select value={projectId} onValueChange={(v) => setValue("projectId", v, { shouldValidate: true })}>
                                <SelectTrigger className="rounded-none">
                                    <SelectValue placeholder="Pick a project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            {errors.projectId && <p className="text-[11px] font-semibold text-rose-600">{errors.projectId.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                            <Select value={status} onValueChange={(v) => setValue("status", v as EpicStatus, { shouldValidate: true })}>
                                <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Color</Label>
                        <div className="flex items-center gap-2">
                            {EPIC_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setValue("color", c, { shouldValidate: true })}
                                    style={{ backgroundColor: c }}
                                    className={`h-8 w-8 border-2 transition-all rounded-none ${color === c ? "border-slate-900 scale-110" : "border-white"}`}
                                />
                            ))}
                        </div>
                    </div>
                </form>
            </SidePanel>
        </div>
    )
}
