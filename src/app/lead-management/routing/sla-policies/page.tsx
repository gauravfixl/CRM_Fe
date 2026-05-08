"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Clock,
    Plus,
    Filter,
    Settings2,
    ChevronLeft,
    ShieldCheck,
    Search,
    Zap,
    Scale,
    Timer,
    Flame,
    Gauge,
    Pencil,
    Trash2,
    X,
    MoreHorizontal,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Progress } from "@/shared/components/ui/progress"
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

type Policy = {
    id: string
    name: string
    type: string
    targetTime: string
    segment: string
    urgency: string
    status: string
    compliance: number
}

const INITIAL_POLICIES: Policy[] = [
    { id: "1", name: "Enterprise High-Priority SLA", type: "First Response", targetTime: "15 min", segment: "Score > 80", urgency: "Emergency", status: "Active", compliance: 94 },
    { id: "2", name: "Standard Inbound Follow-up", type: "Next Activity", targetTime: "2 hours", segment: "All Inbound", urgency: "High", status: "Active", compliance: 82 },
    { id: "3", name: "Long-Term Nurture Gate", type: "Stage Movement", targetTime: "7 days", segment: "Nurturing Phase", urgency: "Medium", status: "Active", compliance: 68 },
    { id: "4", name: "Trial Conversion Speed", type: "Discovery Done", targetTime: "24 hours", segment: "Trial Leads", urgency: "High", status: "Draft", compliance: 0 },
]

const SLA_TYPES = ["First Response", "Next Activity", "Stage Movement", "Discovery Done"]
const URGENCIES = ["Low", "Medium", "High", "Emergency"]
const STATUSES = ["Active", "Draft"]

type FormState = { name: string; type: string; targetTime: string; urgency: string; segment: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", type: "First Response", targetTime: "", urgency: "Medium", segment: "All Leads" }

export default function SLAPoliciesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [urgencyFilter, setUrgencyFilter] = useState<string>("all")

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
        if (!state.name.trim()) e.name = "Policy name is required"
        else if (state.name.trim().length < 3) e.name = "Name must be at least 3 characters"
        else if (state.name.trim().length > 60) e.name = "Name must be under 60 characters"

        if (!state.type) e.type = "Select an SLA type"

        if (!state.targetTime.trim()) e.targetTime = "Target time is required"
        else if (!/\d/.test(state.targetTime)) e.targetTime = "Target must include a number (e.g., 15 min)"

        if (!state.urgency) e.urgency = "Select urgency level"
        if (!state.segment.trim()) e.segment = "Segment is required"
        return e
    }

    const openCreate = () => {
        setFormMode("create"); setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true)
    }
    const openEdit = (p: Policy) => {
        setFormMode("edit"); setEditingId(p.id)
        setForm({ name: p.name, type: p.type, targetTime: p.targetTime, urgency: p.urgency, segment: p.segment })
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
            const created: Policy = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(),
                type: form.type,
                targetTime: form.targetTime.trim(),
                urgency: form.urgency,
                segment: form.segment.trim(),
                status: "Draft",
                compliance: 0,
            }
            setPolicies([created, ...policies])
            toast({ title: "Policy created", description: "SLA saved as draft." })
        } else if (editingId) {
            setPolicies(policies.map(p => p.id === editingId ? {
                ...p,
                name: form.name.trim(),
                type: form.type,
                targetTime: form.targetTime.trim(),
                urgency: form.urgency,
                segment: form.segment.trim(),
            } : p))
            toast({ title: "Policy updated", description: "Changes saved." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setPolicies(policies.filter(p => p.id !== deletingId))
            toast({ title: "Policy deleted", description: "SLA policy removed." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const toggleStatus = (id: string) => {
        setPolicies(policies.map(p => p.id === id ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p))
        toast({ title: "Policy state changed", description: "Status updated." })
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return policies.filter(p => {
            if (term && !p.name.toLowerCase().includes(term) && !p.segment.toLowerCase().includes(term)) return false
            if (typeFilter !== "all" && p.type !== typeFilter) return false
            if (urgencyFilter !== "all" && p.urgency !== urgencyFilter) return false
            return true
        })
    }, [policies, searchTerm, typeFilter, urgencyFilter])

    const clearFilters = () => { setSearchTerm(""); setTypeFilter("all"); setUrgencyFilter("all") }

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
                                <Timer className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                SLA Policies & Discipline
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Define response time targets for every stage of the funnel. Enforce discipline and maintain high lead velocity across teams.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Global settings", description: "Loading enterprise grace periods." })}
                        className="h-10 border-indigo-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <Settings2 className="h-4 w-4 mr-2 text-indigo-500" /> Global Grace Periods
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Define New SLA
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Metric Summary - colored fills */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Compliance Index", val: "84.2%", icon: Gauge, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
                        { label: "Active Policies", val: String(policies.filter(p => p.status === "Active").length), icon: ShieldCheck, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100" },
                        { label: "Avg. Breach Delay", val: "14m", icon: Clock, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-100" },
                        { label: "Recovery Rate", val: "72%", icon: Zap, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
                    ].map((m, i) => (
                        <Card key={i} className={`border ${m.border} shadow-sm rounded-none ${m.bg} overflow-hidden`}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className={`text-[10px] font-semibold tracking-wider ${m.color} uppercase`}>{m.label}</p>
                                    <h4 className="text-[24px] font-semibold tabular-nums text-slate-900 tracking-tighter">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-xl bg-white ${m.color}`}>
                                    <m.icon size={20} />
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
                                placeholder="Search policies by name or segment..."
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
                                    {SLA_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                                <SelectTrigger className="h-10 w-[140px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Urgency</SelectItem>
                                    {URGENCIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {(searchTerm || typeFilter !== "all" || urgencyFilter !== "all") && (
                                <Button variant="ghost" onClick={clearFilters} className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none">
                                    <X className="h-3.5 w-3.5 mr-1" /> Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Policies List */}
                <div className="lg:col-span-8 space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Governance Policies <span className="text-slate-400 font-medium ml-1">({filtered.length})</span></h2>
                    </div>

                    {filtered.length === 0 ? (
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                            <CardContent className="p-10 text-center">
                                <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[14px] font-semibold text-slate-700">No policies match your filters</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                            </CardContent>
                        </Card>
                    ) : filtered.map((sla) => (
                        <Card key={sla.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white transition-all hover:ring-indigo-100 group overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-600">
                            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`p-3 rounded-xl ${sla.urgency === 'Emergency' ? 'bg-rose-50 text-rose-500' : sla.urgency === 'High' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-500'}`}>
                                        {sla.urgency === 'Emergency' ? <Flame size={20} /> : <Timer size={20} />}
                                    </div>
                                    <div className="space-y-1 truncate">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-[15px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{sla.name}</h4>
                                            <Badge className={`
                                                ${sla.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}
                                                border-none h-4.5 px-1.5 text-[8px] font-semibold tracking-wider
                                            `}>
                                                {sla.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 flex-wrap">
                                            <span>Type: <span className="text-slate-700 font-semibold">{sla.type}</span></span>
                                            <span className="text-slate-200">•</span>
                                            <span>Target: <span className="text-indigo-600 font-semibold tabular-nums">{sla.targetTime}</span></span>
                                            <span className="text-slate-200">•</span>
                                            <span>Segment: <span className="text-slate-700 font-semibold">{sla.segment}</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                                        <div className="flex justify-between items-center w-full text-[10px] font-semibold text-slate-400 tracking-wider">
                                            <span>Compliance</span>
                                            <span className={`${sla.compliance > 80 ? 'text-emerald-600' : sla.compliance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>{sla.compliance}%</span>
                                        </div>
                                        <Progress value={sla.compliance} className={`h-1.5 w-full bg-slate-50 ${sla.compliance > 80 ? '[&>div]:bg-emerald-500' : sla.compliance > 0 ? '[&>div]:bg-rose-500' : '[&>div]:bg-slate-300'}`} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={sla.status === "Active"}
                                            onCheckedChange={() => toggleStatus(sla.id)}
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(sla)} className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-md">
                                            <Pencil size={14} />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-md">
                                                    <MoreHorizontal size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                <DropdownMenuItem onClick={() => openEdit(sla)} className="text-[12px] font-medium py-2.5">
                                                    <Pencil className="h-3.5 w-3.5 mr-2 text-slate-500" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleStatus(sla.id)} className="text-[12px] font-medium py-2.5">
                                                    <Zap className="h-3.5 w-3.5 mr-2 text-indigo-500" /> {sla.status === "Active" ? "Move to Draft" : "Activate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => askDelete(sla.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
                                                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sidebar Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 w-fit">
                                <Scale size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold">Policy Enforcement</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Defines what happens automatically when an SLA is breached.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h5 className="text-[11px] font-semibold text-slate-400 tracking-wider">Breach Actions</h5>
                            <div className="space-y-3">
                                {[
                                    { label: "Notification Spike", desc: "Push to Manager after 5m breach", active: true },
                                    { label: "Auto-Reassignment", desc: "Trigger Escalation Plan level-2", active: true },
                                    { label: "Rep Score Penalty", desc: "Deduct 5 internal rep points", active: false },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-none bg-slate-50/50 border border-slate-100/50">
                                        <div className="space-y-0.5">
                                            <p className="text-[12px] font-semibold text-slate-700">{a.label}</p>
                                            <p className="text-[9px] font-medium text-slate-400">{a.desc}</p>
                                        </div>
                                        <Switch defaultChecked={a.active} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50 text-indigo-900 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600">
                                <ShieldCheck size={20} />
                            </div>
                            <h4 className="text-[16px] font-semibold tracking-tight">SLA Guard</h4>
                        </div>
                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed">
                            SLA Guard allows 10% "Buffer Time" for teams during peak hours (10:00 - 12:00) to prevent false breaches.
                        </p>
                        <Button
                            variant="ghost"
                            onClick={() => toast({ title: "SLA Guard", description: "Buffer thresholds matrix opened." })}
                            className="w-full h-9 bg-white border border-indigo-100 text-indigo-600 font-semibold text-[11px] rounded-none hover:bg-slate-50 tracking-wider"
                        >
                            Configure Buffer
                        </Button>
                    </Card>
                </div>

            </div>

            {/* Side Form */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Define SLA Policy" : "Edit SLA Policy"}
                description="Set response time targets for a segment."
                icon={<Timer className="h-5 w-5" />}
                accentColor="#4f46e5"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Save as Draft" : "Update Policy"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Policy Name" required error={errors.name} hint="3–60 characters.">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Enterprise Rapid Response"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="SLA Type" required error={errors.type}>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {SLA_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Target Time" required error={errors.targetTime} hint="Numeric value with unit (e.g., 15 min, 2 hours).">
                        <Input
                            name="targetTime"
                            value={form.targetTime}
                            onChange={(e) => setForm({ ...form, targetTime: e.target.value })}
                            placeholder="e.g., 15 min"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Urgency Level" required error={errors.urgency}>
                        <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {URGENCIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Target Segment" required error={errors.segment} hint="Audience targeted by this policy.">
                        <Input
                            name="segment"
                            value={form.segment}
                            onChange={(e) => setForm({ ...form, segment: e.target.value })}
                            placeholder="e.g., All Inbound, Score > 80"
                            className="h-10 rounded-none"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this policy?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This SLA target will be removed. Reps will no longer be evaluated against it for the listed segment.
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
