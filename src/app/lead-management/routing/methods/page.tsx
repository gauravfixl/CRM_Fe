"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    Users,
    Zap,
    Scale,
    Clock,
    ShieldCheck,
    ChevronLeft,
    TrendingUp,
    MoreHorizontal,
    Search,
    BarChart3,
    Pencil,
    Trash2,
    X,
    Filter,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"

type Method = {
    id: string
    name: string
    type: string
    active: boolean
    usage: string
    lastFired: string
    efficiency: number
    description: string
}

const INITIAL_METHODS: Method[] = [
    { id: "1", name: "Standard Round Robin", type: "Round Robin", active: true, usage: "Inbound BDR Team", lastFired: "3 mins ago", efficiency: 98, description: "Equal distribution regardless of current load." },
    { id: "2", name: "Capacity Balancing", type: "Load Balanced", active: true, usage: "Enterprise AE Team", lastFired: "12 mins ago", efficiency: 94, description: "Prioritize reps with fewer than 5 active leads." },
    { id: "3", name: "Senior Advantage (Weighted)", type: "Weighted", active: false, usage: "High Value Segments", lastFired: "N/A", efficiency: 0, description: "Senior Reps get 60%, Juniors get 40%." },
    { id: "4", name: "Geographical Territory Match", type: "Territory Based", active: true, usage: "Global Sales Hub", lastFired: "1 hour ago", efficiency: 100, description: "Route by lead's 'Country' property Match." },
]

const METHOD_TYPES = ["Round Robin", "Load Balanced", "Weighted", "Territory Based"]

type FormState = { name: string; type: string; usage: string; description: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", type: "Round Robin", usage: "", description: "" }

export default function AssignmentMethodsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [methods, setMethods] = useState<Method[]>(INITIAL_METHODS)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"create" | "edit">("create")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [errors, setErrors] = useState<FormErrors>({})

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => { setIsClient(true) }, [])

    const validate = (state: FormState): FormErrors => {
        const e: FormErrors = {}
        if (!state.name.trim()) e.name = "Method name is required"
        else if (state.name.trim().length < 3) e.name = "Name must be at least 3 characters"
        else if (state.name.trim().length > 60) e.name = "Name must be under 60 characters"

        if (!state.type) e.type = "Select a distribution type"
        if (!state.usage.trim()) e.usage = "Assigned pool is required"
        else if (state.usage.trim().length < 2) e.usage = "Pool name too short"

        if (state.description.trim() && state.description.trim().length < 5) e.description = "Description too short"
        return e
    }

    const openCreate = () => {
        setFormMode("create"); setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true)
    }
    const openEdit = (m: Method) => {
        setFormMode("edit"); setEditingId(m.id)
        setForm({ name: m.name, type: m.type, usage: m.usage, description: m.description })
        setErrors({}); setFormOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const v = validate(form)
        setErrors(v)
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please fix highlighted fields.", variant: "destructive" })
            return
        }
        if (formMode === "create") {
            const created: Method = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(),
                type: form.type,
                usage: form.usage.trim(),
                description: form.description.trim(),
                active: true,
                lastFired: "N/A",
                efficiency: 0,
            }
            setMethods([created, ...methods])
            toast({ title: "Method created", description: `${created.name} added.` })
        } else if (editingId) {
            setMethods(methods.map(m => m.id === editingId ? {
                ...m,
                name: form.name.trim(),
                type: form.type,
                usage: form.usage.trim(),
                description: form.description.trim(),
            } : m))
            toast({ title: "Method updated", description: "Distribution scheme saved." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setMethods(methods.filter(m => m.id !== deletingId))
            toast({ title: "Method removed", description: "Distribution scheme deleted." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const toggleStatus = (id: string) => {
        setMethods(methods.map(m => m.id === id ? { ...m, active: !m.active } : m))
        toast({ title: "Distribution toggled", description: "Method activation state changed." })
    }

    const enforceWeighted = () => {
        setMethods(methods.map(m => m.name.includes("Weighted") ? { ...m, active: true } : m))
        toast({ title: "Strategy applied", description: "Enterprise segments will now prioritize weighted distribution." })
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return methods.filter(m => {
            if (term && !m.name.toLowerCase().includes(term) && !m.usage.toLowerCase().includes(term) && !m.description.toLowerCase().includes(term)) return false
            if (typeFilter !== "all" && m.type !== typeFilter) return false
            if (statusFilter === "active" && !m.active) return false
            if (statusFilter === "inactive" && m.active) return false
            return true
        })
    }, [methods, searchTerm, typeFilter, statusFilter])

    const clearFilters = () => { setSearchTerm(""); setTypeFilter("all"); setStatusFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-indigo-50 p-6 rounded-none border border-indigo-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-indigo-700"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Assignment Mechanics
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Select how leads are distributed among team members. Use balanced methods for volume and weighted for value optimization.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Fetching metrics", description: "Loading recent performance data..." })}
                        className="h-10 border-indigo-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <BarChart3 className="h-4 w-4 mr-2 text-indigo-500" /> Method Performance
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Mechanic
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Methods Overview Stats */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Active Methods", val: String(methods.filter(m => m.active).length), icon: Zap, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100" },
                        { label: "Avg. Sync Time", val: "140ms", icon: Clock, color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-100" },
                        { label: "Equity Index", val: "92/100", icon: Scale, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
                        { label: "Overflow Checks", val: "Enabled", icon: ShieldCheck, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
                    ].map((m, i) => (
                        <Card key={i} className={`border ${m.border} shadow-sm rounded-none ${m.bg} overflow-hidden`}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className={`text-[10px] font-semibold tracking-wider ${m.color} uppercase`}>{m.label}</p>
                                    <h4 className="text-[20px] font-semibold tabular-nums text-slate-900">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-xl bg-white ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Search & Filter Bar */}
                <div className="lg:col-span-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[400px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search mechanics by name, pool, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 w-[170px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <Filter className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Types</SelectItem>
                                    {METHOD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 w-[140px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {(searchTerm || typeFilter !== "all" || statusFilter !== "all") && (
                                <Button variant="ghost" onClick={clearFilters} className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none">
                                    <X className="h-3.5 w-3.5 mr-1" /> Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mechanic Cards Area */}
                <div className="lg:col-span-12">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Distribution Schemes <span className="text-slate-400 font-medium ml-1">({filtered.length})</span></h2>
                    </div>

                    {filtered.length === 0 ? (
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                            <CardContent className="p-10 text-center">
                                <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[14px] font-semibold text-slate-700">No methods match your filters</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filtered.map((method) => (
                                <Card key={method.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-indigo-100 transition-all bg-white overflow-hidden flex flex-col">
                                    <CardContent className="p-8 space-y-6 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-[18px] font-semibold text-slate-900">{method.name}</h3>
                                                    <Badge className="bg-slate-50 text-slate-500 border-none font-semibold text-[9px] h-4.5 px-1.5 uppercase tracking-wide">
                                                        {method.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-[13px] text-slate-500 font-medium">{method.description}</p>
                                            </div>
                                            <Switch checked={method.active} onCheckedChange={() => toggleStatus(method.id)} className="data-[state=checked]:bg-indigo-600" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-none bg-slate-50/50 border border-slate-100/50 space-y-1 text-center">
                                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Assigned Pool</p>
                                                <p className="text-[13px] font-semibold text-slate-700">{method.usage}</p>
                                            </div>
                                            <div className="p-4 rounded-none bg-slate-50/50 border border-slate-100/50 space-y-1 text-center">
                                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Last Decision</p>
                                                <p className="text-[13px] font-semibold text-slate-700">{method.lastFired}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 tracking-wider">
                                                <span>Scheme Efficiency</span>
                                                <span className="text-indigo-600 tracking-normal tabular-nums">{method.efficiency}%</span>
                                            </div>
                                            <Progress value={method.efficiency} className="h-1.5 bg-slate-50 [&>div]:bg-indigo-600" />
                                        </div>
                                    </CardContent>
                                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            onClick={() => openEdit(method)}
                                            className="h-8 text-indigo-600 font-semibold text-[11px] hover:bg-white px-3 border border-transparent hover:border-indigo-100 rounded-none"
                                        >
                                            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Configure Details
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-md">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                <DropdownMenuItem onClick={() => openEdit(method)} className="text-[12px] font-medium py-2.5">
                                                    <Pencil className="h-3.5 w-3.5 mr-2 text-slate-500" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleStatus(method.id)} className="text-[12px] font-medium py-2.5">
                                                    <Zap className="h-3.5 w-3.5 mr-2 text-indigo-500" /> {method.active ? "Disable" : "Enable"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => askDelete(method.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
                                                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Callout */}
                <div className="lg:col-span-12">
                    <div className="p-6 rounded-none bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-100">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md">
                                <TrendingUp size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[18px] font-semibold tracking-tight">Weighted Distribution Advice</h4>
                                <p className="text-[13px] text-indigo-100 font-medium">
                                    Systems show Weighted (60/40) distributions for Enterprise leads improve close-rates by 22%.
                                </p>
                            </div>
                        </div>
                        <Button onClick={enforceWeighted} className="h-11 bg-white text-indigo-600 hover:bg-slate-50 border-none font-semibold px-8 rounded-none shadow-xl">
                            Switch Enterprise to Weighted
                        </Button>
                    </div>
                </div>

            </div>

            {/* Side Form */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Add Assignment Mechanic" : "Edit Mechanic"}
                description="Define how leads are distributed across reps."
                icon={<Users className="h-5 w-5" />}
                accentColor="#4f46e5"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Save Mechanic" : "Update Mechanic"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Method Name" required error={errors.name} hint="3–60 characters.">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., SLA First Capacity Balancing"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Distribution Type" required error={errors.type}>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {METHOD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Assigned Pool" required error={errors.usage} hint="Team or pool consuming this mechanic.">
                        <Input
                            name="usage"
                            value={form.usage}
                            onChange={(e) => setForm({ ...form, usage: e.target.value })}
                            placeholder="e.g., Inbound SaaS Team"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Description" error={errors.description} hint="Optional brief logic explanation.">
                        <Input
                            name="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="e.g., Senior reps get 60%, juniors 40%"
                            className="h-10 rounded-none"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this mechanic?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This distribution scheme will be permanently removed. Leads tied to this mechanic will fall back to the default round-robin.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 rounded-none">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
