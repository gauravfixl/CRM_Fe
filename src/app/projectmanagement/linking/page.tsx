"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Link2,
    Plus,
    Search,
    AlertTriangle,
    GitBranch,
    XCircle,
    Loader2,
    Trash2
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
import { useIssueStore, type LinkType } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"

const TYPE_LABEL: Record<LinkType, string> = {
    BLOCKS: "Blocks",
    BLOCKED_BY: "Blocked by",
    RELATES_TO: "Relates to",
    DUPLICATES: "Duplicates",
    CLONED_FROM: "Cloned from",
}

const TYPE_COLOR: Record<LinkType, string> = {
    BLOCKS: "bg-rose-50 text-rose-700",
    BLOCKED_BY: "bg-rose-50 text-rose-700",
    RELATES_TO: "bg-indigo-50 text-indigo-700",
    DUPLICATES: "bg-slate-50 text-slate-600",
    CLONED_FROM: "bg-emerald-50 text-emerald-700",
}

const schema = z.object({
    fromIssueId: z.string().min(1, "Pick a source issue"),
    toIssueId: z.string().min(1, "Pick a target issue"),
    type: z.enum(["BLOCKS", "BLOCKED_BY", "RELATES_TO", "DUPLICATES", "CLONED_FROM"]),
}).refine(d => d.fromIssueId !== d.toIssueId, { message: "Source and target must differ", path: ["toIssueId"] })

type FormValues = z.infer<typeof schema>

export default function DependenciesPage() {
    const [mounted, setMounted] = useState(false)
    const { issues, addLink, removeLink, getAllLinks } = useIssueStore()
    const { projects } = useProjectStore()
    const [query, setQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<LinkType | "all">("all")
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { fromIssueId: "", toIssueId: "", type: "BLOCKS" },
    })

    const fromIssueId = watch("fromIssueId")
    const toIssueId = watch("toIssueId")
    const type = watch("type")

    useEffect(() => {
        if (isOpen) reset()
    }, [isOpen, reset])

    if (!mounted) return null

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 200))
        addLink(values.fromIssueId, values.toIssueId, values.type)
        setIsLoading(false)
        setIsOpen(false)
        reset()
    }

    const getIssue = (id: string) => issues.find(i => i.id === id)
    const getProjectKey = (issueId: string) => {
        const issue = getIssue(issueId)
        return issue ? (projects.find(p => p.id === issue.projectId)?.key || "PROJ") : "?"
    }

    // Aggregate all links from all issues
    const allLinks = useMemo(() => getAllLinks(), [issues, getAllLinks])

    const filtered = allLinks.filter(({ link, fromIssueId }) => {
        if (typeFilter !== "all" && link.type !== typeFilter) return false
        const q = query.trim().toLowerCase()
        if (!q) return true
        const fromIssue = getIssue(fromIssueId)
        const toIssue = getIssue(link.targetIssueId)
        return (fromIssue?.title.toLowerCase().includes(q) ?? false) || (toIssue?.title.toLowerCase().includes(q) ?? false)
    })

    const total = allLinks.length
    const blockers = allLinks.filter(({ link }) => link.type === "BLOCKS" || link.type === "BLOCKED_BY").length
    const related = allLinks.filter(({ link }) => link.type === "RELATES_TO").length
    const dupes = allLinks.filter(({ link }) => link.type === "DUPLICATES").length

    const kpis = [
        { label: "Total Links", value: total, icon: <Link2 size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "all" as const },
        { label: "Blockers", value: blockers, icon: <AlertTriangle size={18} />, color: "text-rose-800", bg: "bg-rose-100", filter: "BLOCKS" as const },
        { label: "Related", value: related, icon: <GitBranch size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "RELATES_TO" as const },
        { label: "Duplicates", value: dupes, icon: <XCircle size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "DUPLICATES" as const },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Link2 size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dependencies</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Connections between tasks: blockers, duplicates, and related work.
                    </p>
                </div>
                <Button onClick={() => setIsOpen(true)} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} strokeWidth={3} /> Add Dependency
                </Button>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setTypeFilter(stat.filter)}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none text-left cursor-pointer ${stat.bg} ${typeFilter === stat.filter ? "ring-2 ring-indigo-500" : ""}`}
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
                        placeholder="Search by task title..."
                        className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none"
                    />
                </div>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                    <SelectTrigger className="h-9 w-44 text-xs rounded-none">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {(Object.keys(TYPE_LABEL) as LinkType[]).map(t => (
                            <SelectItem key={t} value={t}>{TYPE_LABEL[t]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* List */}
            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                {filtered.length === 0 ? (
                    <div className="py-12 text-center">
                        <Link2 size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No dependencies yet.</p>
                        <Button onClick={() => setIsOpen(true)} className="mt-3 h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 rounded-none">
                            <Plus size={14} strokeWidth={3} /> Add first dependency
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.map(({ fromIssueId, link }) => {
                            const fromIssue = getIssue(fromIssueId)
                            const toIssue = getIssue(link.targetIssueId)
                            return (
                                <div key={link.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
                                    <Badge className="bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-bold rounded-none">
                                        {getProjectKey(fromIssueId)}-{fromIssueId.slice(-4)}
                                    </Badge>
                                    <span className="text-xs font-bold text-slate-800 flex-1 truncate">{fromIssue?.title || "(deleted)"}</span>
                                    <Badge className={`text-[10px] font-bold rounded-none ${TYPE_COLOR[link.type]}`}>{TYPE_LABEL[link.type]}</Badge>
                                    <span className="text-xs font-bold text-slate-800 flex-1 truncate">{toIssue?.title || "(deleted)"}</span>
                                    <Badge className="bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-bold rounded-none">
                                        {getProjectKey(link.targetIssueId)}-{link.targetIssueId.slice(-4)}
                                    </Badge>
                                    <button
                                        type="button"
                                        onClick={() => { if (confirm("Remove this dependency?")) removeLink(fromIssueId, link.id) }}
                                        className="h-7 w-7 flex items-center justify-center text-slate-300 hover:text-rose-600 rounded-none"
                                        aria-label="Remove dependency"
                                    >
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
                onClose={() => setIsOpen(false)}
                title="Add Dependency"
                description="Connect two existing tasks with a relationship."
                width="md"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button type="submit" form="create-dep-form" disabled={!isValid || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : "Add Dependency"}
                        </Button>
                    </div>
                }
            >
                <form id="create-dep-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Source Issue <span className="text-rose-500">*</span></Label>
                        <Select value={fromIssueId} onValueChange={(v) => setValue("fromIssueId", v, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none"><SelectValue placeholder="Choose source..." /></SelectTrigger>
                            <SelectContent>
                                {issues.slice(0, 100).map(i => <SelectItem key={i.id} value={i.id}>{i.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.fromIssueId && <p className="text-[11px] font-semibold text-rose-600">{errors.fromIssueId.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Relationship</Label>
                        <Select value={type} onValueChange={(v) => setValue("type", v as LinkType, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {(Object.keys(TYPE_LABEL) as LinkType[]).map(t => <SelectItem key={t} value={t}>{TYPE_LABEL[t]}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Issue <span className="text-rose-500">*</span></Label>
                        <Select value={toIssueId} onValueChange={(v) => setValue("toIssueId", v, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none"><SelectValue placeholder="Choose target..." /></SelectTrigger>
                            <SelectContent>
                                {issues.slice(0, 100).map(i => <SelectItem key={i.id} value={i.id} disabled={i.id === fromIssueId}>{i.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.toIssueId && <p className="text-[11px] font-semibold text-rose-600">{errors.toIssueId.message}</p>}
                    </div>
                </form>
            </SidePanel>
        </div>
    )
}
