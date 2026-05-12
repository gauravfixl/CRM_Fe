"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    Plus,
    Filter,
    Search,
    ChevronLeft,
    Clock,
    Target,
    Activity,
    ShieldCheck,
    AlertCircle,
    Trash2,
    MoreHorizontal,
    GitBranch,
    Flame,
    X,
    Pencil,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
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

type Trigger = {
    id: string
    name: string
    event: string
    workflows: number
    status: boolean
    category: string
    intensity: string
}

const INITIAL_TRIGGERS: Trigger[] = [
    { id: "1", name: "Lead Ingestion", event: "Lead Created", workflows: 4, status: true, category: "System", intensity: "High" },
    { id: "2", name: "Stage Movement", event: "Stage == 'Qualified'", workflows: 2, status: true, category: "Lifecycle", intensity: "Medium" },
    { id: "3", name: "Score Threshold", event: "Score > 80", workflows: 1, status: true, category: "Logic", intensity: "High" },
    { id: "4", name: "Behavioral Signal", event: "Web Visit + Page 'Pricing'", workflows: 3, status: false, category: "Behavioral", intensity: "Low" },
    { id: "5", name: "SLA Breach", event: "SLA Status == 'Breached'", workflows: 1, status: true, category: "Governance", intensity: "Critical" },
]

const CATEGORIES = ["System", "Lifecycle", "Behavioral", "Logic", "Governance"]
const INTENSITIES = ["Low", "Medium", "High", "Critical"]

type FormState = { name: string; category: string; event: string; intensity: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", category: "System", event: "", intensity: "Medium" }

export default function TriggersPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [triggersList, setTriggersList] = useState<Trigger[]>(INITIAL_TRIGGERS)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
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
        if (!state.name.trim()) e.name = "Trigger name is required"
        else if (state.name.trim().length < 3) e.name = "Name must be at least 3 characters"
        else if (state.name.trim().length > 50) e.name = "Name must be under 50 characters"

        if (!state.category) e.category = "Select a category"
        if (!state.event.trim()) e.event = "Event/condition is required"
        else if (state.event.trim().length < 3) e.event = "Event description too short"

        if (!state.intensity) e.intensity = "Intensity required"
        return e
    }

    const openCreate = () => {
        setFormMode("create"); setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true)
    }
    const openEdit = (t: Trigger) => {
        setFormMode("edit"); setEditingId(t.id)
        setForm({ name: t.name, category: t.category, event: t.event, intensity: t.intensity })
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
            const created: Trigger = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(),
                event: form.event.trim(),
                category: form.category,
                intensity: form.intensity,
                workflows: 0,
                status: false,
            }
            setTriggersList([created, ...triggersList])
            toast({ title: "Trigger created", description: `${created.name} added.` })
        } else if (editingId) {
            setTriggersList(triggersList.map(t => t.id === editingId ? {
                ...t, name: form.name.trim(), event: form.event.trim(), category: form.category, intensity: form.intensity,
            } : t))
            toast({ title: "Trigger updated", description: "Changes saved." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setTriggersList(triggersList.filter(t => t.id !== deletingId))
            toast({ title: "Trigger deleted", description: "Event listener revoked." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const toggleStatus = (id: string) => {
        setTriggersList(triggersList.map(t => t.id === id ? { ...t, status: !t.status } : t))
        toast({ title: "Listener updated", description: "Trigger state modified." })
    }

    const testTrigger = (name: string) => {
        toast({ title: "Test fired", description: `Simulated payload sent to ${name}.` })
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return triggersList.filter(t => {
            if (term && !t.name.toLowerCase().includes(term) && !t.event.toLowerCase().includes(term) && !t.category.toLowerCase().includes(term)) return false
            if (categoryFilter !== "all" && t.category !== categoryFilter) return false
            if (statusFilter === "active" && !t.status) return false
            if (statusFilter === "inactive" && t.status) return false
            return true
        })
    }, [triggersList, searchTerm, categoryFilter, statusFilter])

    const clearFilters = () => { setSearchTerm(""); setCategoryFilter("all"); setStatusFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-orange-50 p-6 rounded-none border border-orange-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-orange-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-700 border border-orange-200 shadow-sm">
                                <Zap className="h-5 w-5 fill-orange-600" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Automation Triggers
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            The starting points of every process. Define the conditions that initiate your workflows.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Health check", description: "Analyzing trigger network redundancy..." })}
                        className="h-10 border-orange-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <Activity className="h-4 w-4 mr-2 text-orange-500" /> Trigger Health
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Trigger
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Stats — colored light fills */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Daily Fire Count", val: "42,850", icon: Flame, color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-100" },
                        { label: "Active Nodes", val: String(triggersList.filter(t => t.status).length), icon: GitBranch, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100" },
                        { label: "Avg Execution", val: "12ms", icon: Clock, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
                        { label: "Trigger Conflicts", val: "0", icon: ShieldCheck, color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-100" },
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
                                placeholder="Search triggers by name, event or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-orange-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-10 w-[160px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 w-[130px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
                                <Button variant="ghost" onClick={clearFilters} className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none">
                                    <X className="h-3.5 w-3.5 mr-1" /> Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Triggers Inventory */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Configured Triggers <span className="text-slate-400 font-medium ml-1">({filtered.length})</span></h2>
                    </div>

                    <div className="space-y-3">
                        {filtered.length === 0 && (
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                                <CardContent className="p-10 text-center">
                                    <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                    <p className="text-[14px] font-semibold text-slate-700">No triggers match your filters</p>
                                    <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                                </CardContent>
                            </Card>
                        )}

                        {filtered.map((trigger) => (
                            <Card key={trigger.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-orange-100 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className={`p-3 rounded-xl ${trigger.intensity === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'} group-hover:bg-orange-100 transition-colors`}>
                                                    <Zap size={20} className={trigger.status ? 'fill-current' : ''} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[15px] font-semibold text-slate-900">{trigger.name}</h3>
                                                        <Badge className="bg-slate-50 text-slate-500 border-none font-semibold text-[8px] h-4.5 px-1.5 uppercase tracking-wide">{trigger.category}</Badge>
                                                        <Badge className={`border-none font-semibold text-[8px] h-4.5 px-1.5 uppercase tracking-wide ${trigger.intensity === 'Critical' ? 'bg-rose-50 text-rose-600' : trigger.intensity === 'High' ? 'bg-orange-50 text-orange-600' : trigger.intensity === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>{trigger.intensity}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-50 w-fit px-2 py-0.5 rounded border border-slate-100">
                                                        {trigger.event}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-1.5 min-w-[120px]">
                                                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">Subscribers</span>
                                                <Badge variant="outline" className="border-indigo-100 bg-indigo-50 text-[11px] font-semibold text-indigo-600 px-2 h-6 rounded-md">
                                                    {trigger.workflows} Workflows
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-8 min-w-[220px] justify-end">
                                                <div className="space-y-0.5 mr-2">
                                                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">Status</p>
                                                    <Switch checked={trigger.status} onCheckedChange={() => toggleStatus(trigger.id)} className="data-[state=checked]:bg-orange-500" />
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-md">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 p-1 rounded-md shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => openEdit(trigger)} className="text-[12px] font-medium py-2.5">
                                                            <Pencil className="h-3.5 w-3.5 mr-2 text-slate-500" /> Edit Conditions
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => testTrigger(trigger.name)} className="text-[12px] font-medium py-2.5">
                                                            <Activity className="h-3.5 w-3.5 mr-2 text-indigo-500" /> Test Trigger
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => askDelete(trigger.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
                                                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 w-fit">
                                <Target size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Event Listeners</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                The platform is currently listening for {triggersList.length} event types across Lead, Activity, and SLA entities.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h5 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Active Listeners</h5>
                            <div className="space-y-2">
                                {[
                                    { label: "Webhook Inbound", count: 124 },
                                    { label: "Email Tracking", count: 850 },
                                    { label: "API Direct", count: 42 },
                                    { label: "Manual Override", count: 12 },
                                ].map((l, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-none bg-slate-50/50 border border-slate-100/50">
                                        <span className="text-[12px] font-semibold text-slate-700">{l.label}</span>
                                        <Badge className="bg-white border-slate-100 text-indigo-600 text-[10px] h-5 px-1.5 font-semibold tabular-nums">{l.count} hits/hr</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50 text-indigo-900 p-6 space-y-4 relative overflow-hidden">
                        <h4 className="text-[15px] font-semibold relative z-10">Custom Trigger SDK</h4>
                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed relative z-10">
                            Push your own custom events from external systems (ERP, Billing) via our Secure Trigger API.
                        </p>
                        <Button onClick={() => toast({ title: "API key", description: "Generating new SDK authorization token." })} className="w-full h-9 bg-white text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] rounded-none border border-indigo-100 relative z-10">
                            Get API Key
                        </Button>
                    </Card>

                    <div className="p-5 rounded-none bg-rose-50 border border-rose-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                            <AlertCircle size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-rose-900">Governance Warning</p>
                            <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                                "SLA Breach" trigger has no backup workflows configured. Failure to automate could lead to missed recovery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Form */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Add Trigger" : "Edit Trigger"}
                description="Define an event that initiates workflows."
                icon={<Zap className="h-5 w-5" />}
                accentColor="#ea580c"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Create Trigger" : "Save Changes"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Trigger Name" required error={errors.name} hint="3–50 characters.">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Target Account Inbound"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Category" required error={errors.category}>
                        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Event / Condition" required error={errors.event} hint="Describe the root event or condition.">
                        <Input
                            name="event"
                            value={form.event}
                            onChange={(e) => setForm({ ...form, event: e.target.value })}
                            placeholder="e.g., Score > 80 AND Source == 'Webinar'"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Intensity" required error={errors.intensity}>
                        <Select value={form.intensity} onValueChange={(v) => setForm({ ...form, intensity: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {INTENSITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this trigger?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This event listener will be permanently revoked. Any workflows subscribed to this trigger will stop firing.
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
