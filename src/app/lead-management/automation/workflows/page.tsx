"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    GitBranch,
    Play,
    Settings2,
    Trash2,
    MoreHorizontal,
    Copy,
    CheckCircle2,
    AlertCircle,
    Activity,
    X,
    Pencil,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
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

type Workflow = {
    id: string
    name: string
    trigger: string
    steps: number
    status: boolean
    lastRun: string
    successRate: number
    category: string
}

const INITIAL_WORKFLOWS: Workflow[] = [
    { id: "1", name: "Enterprise Inbound Welcome", trigger: "Lead Created", steps: 4, status: true, lastRun: "2 mins ago", successRate: 98, category: "Nurture" },
    { id: "2", name: "Lost Lead Feedback Loop", trigger: "Stage == 'Lost'", steps: 2, status: true, lastRun: "1 hour ago", successRate: 100, category: "Retention" },
    { id: "3", name: "High Score SMS Alert", trigger: "Score > 85", steps: 3, status: false, lastRun: "N/A", successRate: 0, category: "Alerts" },
    { id: "4", name: "Webinar Attendee Follow-up", trigger: "Campaign Event: 'Webinar'", steps: 5, status: true, lastRun: "Yesterday", successRate: 92, category: "Event" },
]

const TRIGGER_OPTIONS = ["Lead Created", "Stage Changed", "Form Submitted", "Score Threshold"]
const CATEGORY_OPTIONS = ["Nurture", "Retention", "Alerts", "Event"]

type FormState = { name: string; trigger: string; category: string; steps: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", trigger: "Lead Created", category: "Nurture", steps: "1" }

export default function WorkflowsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS)
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
        if (!state.name.trim()) e.name = "Workflow name is required"
        else if (state.name.trim().length < 3) e.name = "Name must be at least 3 characters"
        else if (state.name.trim().length > 60) e.name = "Name must be under 60 characters"

        if (!state.trigger) e.trigger = "Select a trigger"
        if (!state.category) e.category = "Select a category"

        const stepsNum = Number(state.steps)
        if (!state.steps) e.steps = "Steps required"
        else if (Number.isNaN(stepsNum) || !Number.isInteger(stepsNum)) e.steps = "Must be a whole number"
        else if (stepsNum < 1 || stepsNum > 20) e.steps = "Between 1 and 20"

        return e
    }

    const openCreate = () => {
        setFormMode("create")
        setEditingId(null)
        setForm(emptyForm)
        setErrors({})
        setFormOpen(true)
    }

    const openEdit = (w: Workflow) => {
        setFormMode("edit")
        setEditingId(w.id)
        setForm({ name: w.name, trigger: w.trigger, category: w.category, steps: String(w.steps) })
        setErrors({})
        setFormOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const v = validate(form)
        setErrors(v)
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please fix the highlighted fields.", variant: "destructive" })
            return
        }

        if (formMode === "create") {
            const created: Workflow = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(),
                trigger: form.trigger,
                category: form.category,
                steps: Number(form.steps),
                status: false,
                lastRun: "Never",
                successRate: 0,
            }
            setWorkflows([created, ...workflows])
            toast({ title: "Workflow created", description: `${created.name} added.` })
        } else if (editingId) {
            setWorkflows(workflows.map(w => w.id === editingId ? {
                ...w,
                name: form.name.trim(),
                trigger: form.trigger,
                category: form.category,
                steps: Number(form.steps),
            } : w))
            toast({ title: "Workflow updated", description: "Changes saved successfully." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setWorkflows(workflows.filter(w => w.id !== deletingId))
            toast({ title: "Workflow deleted", description: "Blueprint removed permanently." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const toggleStatus = (id: string) => {
        setWorkflows(workflows.map(w => w.id === id ? { ...w, status: !w.status } : w))
        toast({ title: "Status updated", description: "Workflow state changed." })
    }

    const duplicate = (id: string) => {
        const src = workflows.find(w => w.id === id)
        if (!src) return
        const copy: Workflow = { ...src, id: Math.random().toString(36).slice(2, 11), name: `${src.name} (Copy)`, status: false, lastRun: "Never", successRate: 0 }
        setWorkflows([copy, ...workflows])
        toast({ title: "Workflow duplicated", description: copy.name })
    }

    const runManually = (name: string) => {
        toast({ title: "Manual execution started", description: `Force-triggering ${name}.` })
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return workflows.filter(w => {
            if (term && !w.name.toLowerCase().includes(term) && !w.category.toLowerCase().includes(term) && !w.trigger.toLowerCase().includes(term)) return false
            if (categoryFilter !== "all" && w.category !== categoryFilter) return false
            if (statusFilter === "active" && !w.status) return false
            if (statusFilter === "inactive" && w.status) return false
            return true
        })
    }, [workflows, searchTerm, categoryFilter, statusFilter])

    const clearFilters = () => { setSearchTerm(""); setCategoryFilter("all"); setStatusFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light colored bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-amber-50 p-6 rounded-none border border-amber-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Process Workflows
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Orchestrate lead lifecycles with multi-step automation. Combine triggers, logic, and actions to drive performance.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Sandbox launched", description: "Sandbox environment initializing..." })}
                        className="h-10 border-amber-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <Play className="h-4 w-4 mr-2 text-amber-600" /> Simulation Sandbox
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none transition-all active:scale-95 rounded-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create Workflow
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Inventory */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[400px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, trigger or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-10 w-[150px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none"
                                >
                                    <X className="h-3.5 w-3.5 mr-1" /> Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filtered.length === 0 && (
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                                <CardContent className="p-10 text-center">
                                    <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                    <p className="text-[14px] font-semibold text-slate-700">No workflows match your filters</p>
                                    <p className="text-[12px] text-slate-500 mt-1">Try adjusting search or clearing filters.</p>
                                    <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                                </CardContent>
                            </Card>
                        )}

                        {filtered.map((w) => (
                            <Card key={w.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-indigo-100 transition-all bg-white overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-600">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className={`p-3 rounded-xl ${w.status ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'} transition-colors`}>
                                                    <GitBranch size={20} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[15px] font-semibold text-slate-900 leading-none">{w.name}</h3>
                                                        <Badge className="bg-slate-50 text-slate-500 border-none font-semibold text-[8px] h-4.5 px-1.5 uppercase tracking-wide">{w.category}</Badge>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-400">Trigger: <span className="text-slate-600">{w.trigger}</span></p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Steps</span>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(Math.min(w.steps, 8))].map((_, i) => (
                                                        <div key={i} className="h-1.5 w-4 rounded-full bg-indigo-100 group-hover:bg-indigo-200" />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 min-w-[240px] justify-end">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Success Rate</p>
                                                    <h4 className={`text-[18px] font-semibold tabular-nums mt-0.5 ${w.successRate > 90 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        {w.successRate}%
                                                    </h4>
                                                </div>
                                                <div className="w-px h-8 bg-slate-100" />
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Status</p>
                                                        <Switch checked={w.status} onCheckedChange={() => toggleStatus(w.id)} className="mt-1 data-[state=checked]:bg-indigo-600" />
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-md">
                                                                <MoreHorizontal size={18} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-1 rounded-md shadow-xl border-slate-100">
                                                            <DropdownMenuItem onClick={() => runManually(w.name)} className="text-[12px] font-medium py-2.5">
                                                                <Play className="h-3.5 w-3.5 mr-2 text-indigo-500" /> Run Manually
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEdit(w)} className="text-[12px] font-medium py-2.5">
                                                                <Pencil className="h-3.5 w-3.5 mr-2 text-slate-500" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => duplicate(w.id)} className="text-[12px] font-medium py-2.5">
                                                                <Copy className="h-3.5 w-3.5 mr-2 text-slate-500" /> Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => askDelete(w.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
                                                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
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
                                <Activity size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Automation Pulse</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Current engine throughput and conflict resolution metrics for active workflows.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-none bg-indigo-50 border border-indigo-100 text-center space-y-1">
                                    <p className="text-[10px] font-semibold text-indigo-700 uppercase tracking-widest">Today's Executions</p>
                                    <h5 className="text-[18px] font-semibold text-indigo-900">14,204</h5>
                                </div>
                                <div className="p-3 rounded-none bg-emerald-50 border border-emerald-100 text-center space-y-1">
                                    <p className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">Avg. Latency</p>
                                    <h5 className="text-[18px] font-semibold text-emerald-700">42ms</h5>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h5 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Engine Controls</h5>
                                {[
                                    { label: "Conflict Resolution", desc: "Prioritize overlapping rules.", active: true },
                                    { label: "Execution Retry", desc: "Max 3 attempts on fail.", active: true },
                                    { label: "Global Pause", desc: "Instantly stop all flows.", active: false, danger: true },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-none bg-slate-50/50 border border-slate-100/50">
                                        <div className="space-y-0.5">
                                            <p className={`text-[12px] font-semibold ${c.danger ? 'text-rose-600' : 'text-slate-700'}`}>{c.label}</p>
                                            <p className="text-[9px] font-medium text-slate-400">{c.desc}</p>
                                        </div>
                                        <Switch defaultChecked={c.active} onCheckedChange={() => toast({ title: "Engine reconfigured", description: `${c.label} updated.` })} className={`data-[state=checked]:${c.danger ? 'bg-rose-500' : 'bg-indigo-600'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50 text-slate-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200 translate-x-4">
                            <CheckCircle2 size={120} />
                        </div>
                        <h4 className="text-[15px] font-semibold text-indigo-700">Workflow Versioning</h4>
                        <p className="text-[12px] text-slate-700 font-medium leading-relaxed">
                            Safely roll back to previous logic states. Every save creates a cryptographically signed version.
                        </p>
                        <Button
                            onClick={() => toast({ title: "Version history", description: "Loading previous versions..." })}
                            className="w-full h-9 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-[11px] rounded-none border-none"
                        >
                            View Version History
                        </Button>
                    </Card>

                    <div className="p-5 rounded-none bg-amber-50 border border-amber-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                            <AlertCircle size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-bold text-amber-900">Optimization Tip</p>
                            <p className="text-[11px] text-amber-700 font-medium leading-relaxed italic">
                                "Shortening the delay on Stage 1 Follow-ups by 4 hours could increase engagement by 12%."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Form Sheet */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Create Workflow" : "Edit Workflow"}
                description={formMode === "create" ? "Initialize a new automation blueprint." : "Update the workflow blueprint."}
                icon={<Zap className="h-5 w-5" />}
                accentColor="#4f46e5"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Create Workflow" : "Save Changes"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Workflow Name" required error={errors.name} hint="Use a clear, descriptive name (3–60 characters).">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Abandoned Cart Recovery"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Initial Trigger" required error={errors.trigger}>
                        <Select value={form.trigger} onValueChange={(v) => setForm({ ...form, trigger: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {TRIGGER_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Category" required error={errors.category}>
                        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Steps" required error={errors.steps} hint="Whole number between 1 and 20.">
                        <Input
                            name="steps"
                            type="number"
                            min={1}
                            max={20}
                            value={form.steps}
                            onChange={(e) => setForm({ ...form, steps: e.target.value })}
                            className="h-10 rounded-none"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Delete confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this workflow?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The workflow blueprint will be permanently removed.
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
