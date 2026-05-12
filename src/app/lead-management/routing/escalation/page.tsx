"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    Clock,
    Bell,
    Settings2,
    ChevronLeft,
    AlertTriangle,
    ShieldAlert,
    RefreshCcw,
    ChevronRight,
    Users,
    Zap,
    ArrowRightCircle,
    CheckCircle2,
    Search,
    Filter,
    X,
    Pencil,
    Trash2,
    MoreHorizontal,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
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

type Level = { id: string; target: string; action: string; delay: string }
type Plan = {
    id: string
    name: string
    trigger: string
    levels: Level[]
    active: boolean
    segment: string
}

const INITIAL_PLANS: Plan[] = [
    {
        id: "1",
        name: "Standard High-Intent Policy",
        trigger: "No First Response within 30 mins",
        levels: [
            { id: "l1", target: "Current Owner", action: "Push Notification + SMS", delay: "0m" },
            { id: "l2", target: "Team Lead", action: "Reassign to Available Rep", delay: "15m" },
            { id: "l3", target: "Sales Manager", action: "Manual Review Alert", delay: "1h" },
        ],
        active: true,
        segment: "High Score leads"
    },
    {
        id: "2",
        name: "Weekend Inactivity Recovery",
        trigger: "Stage == 'New' for > 12 Hours",
        levels: [
            { id: "w1", target: "Lead Owner", action: "Email Reminder", delay: "0m" },
            { id: "w2", target: "Global Queue", action: "Return to General Pool", delay: "4h" },
        ],
        active: true,
        segment: "All Leads"
    }
]

const SEGMENTS = ["All Leads", "High Score leads", "Enterprise Segment", "Inbound Organic"]

type FormState = { name: string; trigger: string; segment: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", trigger: "", segment: "All Leads" }

export default function EscalationPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS)
    const [searchTerm, setSearchTerm] = useState("")
    const [segmentFilter, setSegmentFilter] = useState<string>("all")
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
        if (!state.name.trim()) e.name = "Plan name is required"
        else if (state.name.trim().length < 3) e.name = "Name must be at least 3 characters"
        else if (state.name.trim().length > 60) e.name = "Name must be under 60 characters"

        if (!state.trigger.trim()) e.trigger = "Trigger condition is required"
        else if (state.trigger.trim().length < 5) e.trigger = "Trigger description too short"

        if (!state.segment) e.segment = "Select a segment"
        return e
    }

    const openCreate = () => {
        setFormMode("create"); setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true)
    }
    const openEdit = (p: Plan) => {
        setFormMode("edit"); setEditingId(p.id)
        setForm({ name: p.name, trigger: p.trigger, segment: p.segment })
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
            const created: Plan = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(),
                trigger: form.trigger.trim(),
                segment: form.segment,
                active: true,
                levels: [{ id: "l1", target: "Current Owner", action: "Push Notification", delay: "0m" }]
            }
            setPlans([created, ...plans])
            toast({ title: "Plan created", description: "Recovery sequence added." })
        } else if (editingId) {
            setPlans(plans.map(p => p.id === editingId ? { ...p, name: form.name.trim(), trigger: form.trigger.trim(), segment: form.segment } : p))
            toast({ title: "Plan updated", description: "Workflow saved." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setPlans(plans.filter(p => p.id !== deletingId))
            toast({ title: "Plan deleted", description: "Escalation workflow removed." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const togglePlan = (id: string) => {
        setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p))
        toast({ title: "Plan toggled", description: "Workflow status updated." })
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return plans.filter(p => {
            if (term && !p.name.toLowerCase().includes(term) && !p.trigger.toLowerCase().includes(term)) return false
            if (segmentFilter !== "all" && p.segment !== segmentFilter) return false
            if (statusFilter === "active" && !p.active) return false
            if (statusFilter === "inactive" && p.active) return false
            return true
        })
    }, [plans, searchTerm, segmentFilter, statusFilter])

    const clearFilters = () => { setSearchTerm(""); setSegmentFilter("all"); setStatusFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-rose-50 p-6 rounded-none border border-rose-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-rose-700"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 shadow-sm">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Reassignment & Escalation
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Ensure no lead gets stuck. Automate reassignment if owners don't respond within SLA targets and escalate issues to management.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Notification logic", description: "Loading escalation webhook rules..." })}
                        className="h-10 border-rose-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <Bell className="h-4 w-4 mr-2 text-rose-500" /> Notification Logic
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> New Recovery Plan
                    </Button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                <div className="relative flex-1 lg:max-w-[400px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search plans by name or trigger..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-rose-500"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                        <SelectTrigger className="h-10 w-[180px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                            <Filter className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="all">All Segments</SelectItem>
                            {SEGMENTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                    {(searchTerm || segmentFilter !== "all" || statusFilter !== "all") && (
                        <Button variant="ghost" onClick={clearFilters} className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none">
                            <X className="h-3.5 w-3.5 mr-1" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Active Escalation Plans */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Escalation Workflows <span className="text-slate-400 font-medium ml-1">({filtered.length})</span></h2>
                        <Badge variant="outline" className="border-slate-100 bg-white shadow-sm text-slate-500 font-semibold text-[10px] tracking-wider h-6">Priority Sequenced</Badge>
                    </div>

                    {filtered.length === 0 ? (
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                            <CardContent className="p-10 text-center">
                                <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[14px] font-semibold text-slate-700">No plans match your filters</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((plan) => (
                                <Card key={plan.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden transition-all hover:ring-rose-100 group">
                                    <CardHeader className="p-6 pb-0 border-b border-slate-50 relative">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <CardTitle className="text-[17px] font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">{plan.name}</CardTitle>
                                                    <Badge className="bg-slate-50 text-slate-500 border-none font-semibold text-[9px] px-2 h-5 uppercase tracking-wide">{plan.segment}</Badge>
                                                    {!plan.active && <Badge className="bg-slate-100 text-slate-500 border-none font-semibold text-[9px] px-2 h-5 uppercase tracking-wide">Disabled</Badge>}
                                                </div>
                                                <p className="text-[12px] font-medium text-slate-500 italic">Trigger: {plan.trigger}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Switch checked={plan.active} onCheckedChange={() => togglePlan(plan.id)} className="data-[state=checked]:bg-rose-500" />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-md">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => openEdit(plan)} className="text-[12px] font-medium py-2.5">
                                                            <Pencil className="h-3.5 w-3.5 mr-2 text-slate-500" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Workflow matrix", description: "Loading level configuration..." })} className="text-[12px] font-medium py-2.5">
                                                            <Settings2 className="h-3.5 w-3.5 mr-2 text-indigo-500" /> Configure Levels
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => askDelete(plan.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
                                                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <div className="h-1 w-full bg-slate-50 mt-6 overflow-hidden">
                                            <div className="h-full bg-rose-500 w-1/3" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 bg-slate-50/30">
                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                            {plan.levels.map((level, idx) => (
                                                <React.Fragment key={level.id}>
                                                    <div className="flex-1 min-w-[180px] p-4 rounded-none bg-white border border-slate-100 shadow-sm relative group/level">
                                                        <span className="absolute -top-2 left-4 px-2 bg-slate-900 text-white text-[9px] font-semibold uppercase tracking-widest group-hover:bg-rose-500 transition-colors">LVL {idx + 1}</span>
                                                        <div className="space-y-3 pt-1">
                                                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                                                                <span>Delay: {level.delay}</span>
                                                                <Users size={12} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[13px] font-semibold text-slate-900">{level.target}</p>
                                                                <p className="text-[11px] font-medium text-slate-500 leading-none">{level.action}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {idx < plan.levels.length - 1 && (
                                                        <ChevronRight className="text-slate-300 hidden md:block" />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            <div className="flex-shrink-0 p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                <CheckCircle2 size={20} />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 tracking-wider">
                                            <span className="flex items-center gap-1.5"><Zap size={12} className="text-rose-500" /> 12 Hits this week</span>
                                            <span className="flex items-center gap-1.5 text-emerald-600"><Clock size={12} /> 94% Recovered</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            onClick={() => toast({ title: "Action log", description: `Loading log for ${plan.name}.` })}
                                            className="h-7 text-rose-500 font-semibold text-[10px] tracking-widest hover:bg-rose-100 uppercase rounded-none"
                                        >
                                            View Action Log
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Global Escalation Dashboard */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Recovery Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-none bg-indigo-50 border border-indigo-100/50 space-y-1">
                                    <p className="text-[10px] font-semibold tracking-wider text-indigo-600 uppercase">Auto-Reassigned</p>
                                    <h4 className="text-[24px] font-semibold tabular-nums text-indigo-900 tracking-tighter">420</h4>
                                </div>
                                <div className="p-4 rounded-none bg-rose-50 border border-rose-100/50 space-y-1">
                                    <p className="text-[10px] font-semibold tracking-wider text-rose-600 uppercase">L3 Escalations</p>
                                    <h4 className="text-[24px] font-semibold tabular-nums text-rose-900 tracking-tighter">14</h4>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <h5 className="text-[11px] font-semibold text-slate-400 tracking-wider">Reason Distribution</h5>
                                <div className="space-y-3">
                                    {[
                                        { label: "Missed SLA", val: 65, color: "bg-rose-500" },
                                        { label: "Out of Office", val: 20, color: "bg-amber-500" },
                                        { label: "Manual Override", val: 15, color: "bg-indigo-500" },
                                    ].map((r, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between text-[11px] font-semibold tracking-wider text-slate-600">
                                                <span>{r.label}</span>
                                                <span className="tabular-nums">{r.val}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div className={`h-full ${r.color}`} style={{ width: `${r.val}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50 text-indigo-900 p-6 space-y-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform -rotate-12">
                            <ArrowRightCircle size={100} className="text-indigo-600" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <div className="p-2.5 rounded-xl bg-white w-fit text-indigo-600">
                                <RefreshCcw size={20} />
                            </div>
                            <h4 className="text-[16px] font-semibold">Return to Queue Policy</h4>
                            <p className="text-[12px] text-indigo-700 font-medium leading-relaxed">
                                Leads reassigned more than 3 times are automatically moved to the <strong>High-Touch Governance Pool</strong>.
                            </p>
                        </div>
                        <Button
                            onClick={() => toast({ title: "Threshold check", description: "Adjust auto-return assignment limits." })}
                            className="w-full h-10 bg-white border border-indigo-100 text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest relative z-10 rounded-none"
                        >
                            Adjust Return Thresholds
                        </Button>
                    </Card>

                    <div className="p-5 rounded-none bg-amber-50 border border-amber-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                            <AlertTriangle size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-amber-900">Config Conflict Detected</p>
                            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                                Strategy <strong>"Weekend Recovery"</strong> overlaps with <strong>"General Inbound"</strong> for leads in EMEA region.
                            </p>
                            <Button
                                variant="ghost"
                                onClick={() => toast({ title: "Conflict resolver", description: "Calculating resolution paths..." })}
                                className="h-auto p-0 pt-1 text-[10px] font-semibold tracking-wider uppercase text-amber-800 hover:text-amber-900 hover:bg-transparent mt-1"
                            >
                                Resolve Conflict
                            </Button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Side Form */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Create Recovery Plan" : "Edit Recovery Plan"}
                description="Define how leads are reassigned when SLAs are at risk."
                icon={<ShieldAlert className="h-5 w-5" />}
                accentColor="#e11d48"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Initialize Workflow" : "Update Plan"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Plan Name" required error={errors.name} hint="3–60 characters.">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Enterprise Weekend Recovery"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Trigger Logic" required error={errors.trigger} hint="When should this plan activate? (e.g., 2h without contact)">
                        <Input
                            name="trigger"
                            value={form.trigger}
                            onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                            placeholder="Define when to activate..."
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Target Segment" required error={errors.segment}>
                        <Select value={form.segment} onValueChange={(v) => setForm({ ...form, segment: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {SEGMENTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this recovery plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This escalation workflow will be permanently removed. Leads matching its trigger will no longer be auto-reassigned.
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
