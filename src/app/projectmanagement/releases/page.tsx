"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Tag,
    Plus,
    ChevronRight,
    Rocket,
    Clock,
    CheckCircle2,
    Trash2,
    Calendar as CalendarIcon,
    Loader2,
    Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import SidePanel from "@/shared/components/projectmanagement/side-panel"
import { useProjectStore } from "@/shared/data/projects-store"
import { useReleaseStore, type Release, type ReleaseStatus } from "@/shared/data/release-store"

const STATUS_LABEL: Record<ReleaseStatus, string> = {
    UNRELEASED: "Unreleased",
    PLANNED: "Planned",
    RELEASED: "Released",
}

const schema = z.object({
    name: z.string().trim().min(2, "Name is required").max(60),
    version: z.string().trim().regex(/^v?\d+\.\d+(\.\d+)?$/, "Use semver like v1.2.0 or 1.2"),
    description: z.string().max(300).optional().or(z.literal("")),
    projectId: z.string().min(1, "Pick a project"),
    status: z.enum(["UNRELEASED", "PLANNED", "RELEASED"]),
    targetDate: z.string().min(1, "Target date is required"),
})
type FormValues = z.infer<typeof schema>

export default function ReleasesPage() {
    const [mounted, setMounted] = useState(false)
    const { projects } = useProjectStore()
    const { releases, addRelease, updateRelease, deleteRelease, markReleased } = useReleaseStore()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editingRelease, setEditingRelease] = useState<Release | null>(null)
    const [statusFilter, setStatusFilter] = useState<ReleaseStatus | "all">("all")

    useEffect(() => {
        setMounted(true)
        useReleaseStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { name: "", version: "v1.0.0", description: "", projectId: "", status: "PLANNED", targetDate: "" },
    })

    const projectId = watch("projectId")
    const status = watch("status")

    useEffect(() => {
        if (isOpen && editingRelease) {
            reset({
                name: editingRelease.name,
                version: editingRelease.version,
                description: editingRelease.description,
                projectId: editingRelease.projectId,
                status: editingRelease.status,
                targetDate: editingRelease.targetDate,
            })
        } else if (isOpen) {
            reset({ name: "", version: "v1.0.0", description: "", projectId: "", status: "PLANNED", targetDate: "" })
        }
    }, [isOpen, editingRelease, reset])

    if (!mounted) return null

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 200))
        if (editingRelease) {
            updateRelease(editingRelease.id, {
                name: values.name,
                version: values.version,
                description: values.description || "",
                projectId: values.projectId,
                status: values.status,
                targetDate: values.targetDate,
            })
        } else {
            addRelease({
                name: values.name,
                version: values.version,
                description: values.description || "",
                projectId: values.projectId,
                status: values.status,
                targetDate: values.targetDate,
            })
        }
        setIsLoading(false)
        setIsOpen(false)
        setEditingRelease(null)
        reset()
    }

    const filtered = releases.filter(r => statusFilter === "all" || r.status === statusFilter)

    const kpis = [
        { label: "Total Releases", value: releases.length, icon: <Tag size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "all" as const },
        { label: "Released", value: releases.filter(r => r.status === "RELEASED").length, icon: <CheckCircle2 size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "RELEASED" as const },
        { label: "Planned", value: releases.filter(r => r.status === "PLANNED").length, icon: <Clock size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "PLANNED" as const },
        { label: "Unreleased", value: releases.filter(r => r.status === "UNRELEASED").length, icon: <Rocket size={18} />, color: "text-rose-800", bg: "bg-rose-100", filter: "UNRELEASED" as const },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Tag size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Releases</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Versions of your software, scheduled and shipped.
                    </p>
                </div>
                <Button onClick={() => { setEditingRelease(null); setIsOpen(true) }} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} strokeWidth={3} /> New Release
                </Button>
            </div>

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

            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                {filtered.length === 0 ? (
                    <div className="py-12 text-center">
                        <Tag size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No releases match.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.map(r => {
                            const project = projects.find(p => p.id === r.projectId)
                            return (
                                <div key={r.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group">
                                    <div className={`h-9 w-9 flex items-center justify-center rounded-none ${r.status === "RELEASED" ? "bg-emerald-50 text-emerald-600" : r.status === "PLANNED" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"}`}>
                                        <Tag size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">{r.name} <span className="text-[10px] font-mono text-indigo-600 ml-2">{r.version}</span></h4>
                                        <p className="text-[11px] font-medium text-slate-500 truncate">{r.description || "No description"}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{project?.name || "Unknown project"} · {r.issueIds.length} issues</p>
                                    </div>
                                    <Badge className={`text-[10px] font-bold rounded-none ${r.status === "RELEASED" ? "bg-emerald-50 text-emerald-700" : r.status === "PLANNED" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}>
                                        {STATUS_LABEL[r.status]}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                        <CalendarIcon size={12} /> {new Date(r.targetDate).toLocaleDateString()}
                                    </div>
                                    {r.status !== "RELEASED" && (
                                        <button
                                            type="button"
                                            onClick={() => { if (confirm("Mark this release as shipped?")) markReleased(r.id) }}
                                            className="h-8 px-2 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Mark Released
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => { setEditingRelease(r); setIsOpen(true) }}
                                        className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-indigo-600 rounded-none"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button type="button" onClick={() => { if (confirm("Delete release?")) deleteRelease(r.id) }} className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-rose-600 rounded-none">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <SidePanel
                open={isOpen}
                onClose={() => { setIsOpen(false); setEditingRelease(null) }}
                title={editingRelease ? "Edit Release" : "Create Release"}
                description="Add a new version for one of your projects."
                width="lg"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditingRelease(null) }} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button type="submit" form="rel-form" disabled={!isValid || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : editingRelease ? "Save Changes" : "Create Release"}
                        </Button>
                    </div>
                }
            >
                <form id="rel-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name <span className="text-rose-500">*</span></Label>
                            <Input {...register("name")} placeholder="Spring Launch" className="rounded-none" />
                            {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Version <span className="text-rose-500">*</span></Label>
                            <Input {...register("version")} placeholder="v1.0.0" className="rounded-none" />
                            {errors.version && <p className="text-[11px] font-semibold text-rose-600">{errors.version.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                        <Textarea {...register("description")} placeholder="What's in this release?" className="min-h-[90px] resize-none rounded-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project <span className="text-rose-500">*</span></Label>
                            <Select value={projectId} onValueChange={(v) => setValue("projectId", v, { shouldValidate: true })}>
                                <SelectTrigger className="rounded-none"><SelectValue placeholder="Pick a project" /></SelectTrigger>
                                <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                            </Select>
                            {errors.projectId && <p className="text-[11px] font-semibold text-rose-600">{errors.projectId.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                            <Select value={status} onValueChange={(v) => setValue("status", v as ReleaseStatus, { shouldValidate: true })}>
                                <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UNRELEASED">Unreleased</SelectItem>
                                    <SelectItem value="PLANNED">Planned</SelectItem>
                                    <SelectItem value="RELEASED">Released</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Date <span className="text-rose-500">*</span></Label>
                        <Input type="date" {...register("targetDate")} className="rounded-none" />
                        {errors.targetDate && <p className="text-[11px] font-semibold text-rose-600">{errors.targetDate.message}</p>}
                    </div>
                </form>
            </SidePanel>
        </div>
    )
}
