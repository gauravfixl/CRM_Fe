"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Repeat,
    Plus,
    Filter,
    GripVertical,
    ChevronLeft,
    Search,
    Play,
    Settings2,
    Trash2,
    ArrowRight,
    Zap,
    ShieldCheck,
    GitBranch,
    Pencil,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Switch } from "@/shared/components/ui/switch"
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

type Rule = {
    id: string
    name: string
    priority: number
    condition: string
    action: string
    status: boolean
    type: string
}

const INITIAL_RULES: Rule[] = [
    { id: "1", name: "Enterprise Leads - US West", priority: 1, condition: "Score > 80 AND Territory == 'US-West'", action: "Assign to High-Value RR Pool", status: true, type: "Logic Boundary" },
    { id: "2", name: "Google Ads - Discovery Phase", priority: 2, condition: "Source == 'Google Ads' AND Stage == 'Discovery'", action: "Assign to BDR Inbound Queue", status: true, type: "Source Rule" },
    { id: "3", name: "Competitor Domain Penalty", priority: 3, condition: "Email Domain in COMPETITOR_LIST", action: "Route to Governance Queue (Blocked)", status: true, type: "Security Block" },
    { id: "4", name: "EMEA Region - French Speaking", priority: 4, condition: "Country == 'France' OR Country == 'Belgium'", action: "Assign to EMEA-French Team", status: false, type: "Geography" },
]

const RULE_TYPES = ["Logic Boundary", "Source Rule", "Security Block", "Geography"]

type FormState = { name: string; type: string; condition: string; action: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", type: "Logic Boundary", condition: "", action: "" }

export default function RoutingRulesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [rules, setRules] = useState<Rule[]>(INITIAL_RULES)
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
        if (!state.name.trim()) e.name = "Rule name is required"
        else if (state.name.trim().length < 3) e.name = "Name must be at least 3 characters"
        else if (state.name.trim().length > 60) e.name = "Name must be under 60 characters"

        if (!state.type) e.type = "Select a rule type"

        if (!state.condition.trim()) e.condition = "Condition (IF) is required"
        else if (state.condition.trim().length < 4) e.condition = "Condition is too short"

        if (!state.action.trim()) e.action = "Action (THEN) is required"
        else if (state.action.trim().length < 4) e.action = "Action is too short"
        return e
    }

    const openCreate = () => {
        setFormMode("create"); setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true)
    }
    const openEdit = (r: Rule) => {
        setFormMode("edit"); setEditingId(r.id)
        setForm({ name: r.name, type: r.type, condition: r.condition, action: r.action })
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
            const created: Rule = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(),
                type: form.type,
                condition: form.condition.trim(),
                action: form.action.trim(),
                priority: rules.length + 1,
                status: true,
            }
            setRules([...rules, created])
            toast({ title: "Rule created", description: `${created.name} added.` })
        } else if (editingId) {
            setRules(rules.map(r => r.id === editingId ? { ...r, name: form.name.trim(), type: form.type, condition: form.condition.trim(), action: form.action.trim() } : r))
            toast({ title: "Rule updated", description: "Rule logic has been updated." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setRules(rules.filter(r => r.id !== deletingId))
            toast({ title: "Rule deleted", description: "Routing rule removed." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const toggleStatus = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, status: !r.status } : r))
        toast({ title: "Rule updated", description: "Routing logic activation state changed." })
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return rules.filter(r => {
            if (term && !r.name.toLowerCase().includes(term) && !r.condition.toLowerCase().includes(term) && !r.action.toLowerCase().includes(term)) return false
            if (typeFilter !== "all" && r.type !== typeFilter) return false
            if (statusFilter === "active" && !r.status) return false
            if (statusFilter === "inactive" && r.status) return false
            return true
        })
    }, [rules, searchTerm, typeFilter, statusFilter])

    const clearFilters = () => { setSearchTerm(""); setTypeFilter("all"); setStatusFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-cyan-50 p-6 rounded-none border border-cyan-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-cyan-700"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700 border border-cyan-200 shadow-sm">
                                <Repeat className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Routing Rules Builder
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Configure conditional logic (IF/THEN) to automate lead distribution. Rules are processed sequentially based on priority.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Test Lead Sent", description: "Sample lead routed against the active rule chain." })}
                        className="h-10 border-cyan-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <Play className="h-4 w-4 mr-2 text-cyan-600" /> Test with Sample Lead
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create New Rule
                    </Button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                <div className="relative flex-1 lg:max-w-[400px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Find rules by name, condition or action..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-cyan-500"
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
                            {RULE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Rules List Area */}
                <div className="lg:col-span-8 space-y-3">
                    {filtered.length === 0 ? (
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                            <CardContent className="p-10 text-center">
                                <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[14px] font-semibold text-slate-700">No rules match your filters</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                            </CardContent>
                        </Card>
                    ) : filtered.map((rule) => (
                        <Card key={rule.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-cyan-100 transition-all bg-white overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex items-stretch">
                                    <div className="w-10 flex flex-col items-center justify-center border-r border-slate-50 group-hover:bg-cyan-50/40 transition-colors">
                                        <GripVertical size={16} className="text-slate-300" />
                                        <span className="text-[10px] font-semibold text-slate-400 mt-1">{rule.priority}</span>
                                    </div>
                                    <div className="flex-1 p-5 space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-[15px] font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors">{rule.name}</h3>
                                                    <Badge className="bg-slate-50 text-slate-500 hover:bg-slate-100 border-none font-semibold text-[9px] uppercase tracking-wider">{rule.type}</Badge>
                                                    {!rule.status && <Badge className="bg-slate-100 text-slate-500 font-semibold text-[9px] uppercase px-1.5 h-4.5 border-none">Disabled</Badge>}
                                                </div>
                                                <div className="flex items-center gap-2 text-[12px] font-mono bg-slate-50 p-1.5 px-3 rounded border border-slate-100 w-fit">
                                                    <span className="text-indigo-500 font-semibold">IF</span>
                                                    <span className="text-slate-600">{rule.condition}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center h-10 px-4 bg-slate-50 rounded-none border border-slate-100 gap-3">
                                                <span className="text-[10px] font-semibold text-slate-500 tracking-wider leading-none">Status</span>
                                                <Switch checked={rule.status} onCheckedChange={() => toggleStatus(rule.id)} className="data-[state=checked]:bg-cyan-600" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                            <div className="flex items-center gap-3 text-emerald-600">
                                                <ArrowRight size={14} />
                                                <span className="text-[12px] font-semibold">THEN: <span className="text-slate-900 underline underline-offset-4 decoration-emerald-200">{rule.action}</span></span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(rule)} className="h-8 w-8 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => askDelete(rule.id)} className="h-8 w-8 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                                    <Trash2 size={14} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                                                            <MoreHorizontal size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => toggleStatus(rule.id)} className="text-[12px] font-medium py-2.5">
                                                            <Settings2 className="h-3.5 w-3.5 mr-2 text-slate-500" /> {rule.status ? "Disable" : "Enable"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Rule tested", description: `Simulating ${rule.name}.` })} className="text-[12px] font-medium py-2.5">
                                                            <Play className="h-3.5 w-3.5 mr-2 text-indigo-500" /> Test Rule
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => askDelete(rule.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
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

                {/* Conflict Resolution Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 w-fit shadow-sm">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold">Rule Priority Engine</h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    When multiple rules match, the system executes the one with the lowest priority number.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h5 className="text-[12px] font-semibold text-slate-400 tracking-wider">Conflict Settings</h5>
                            <div className="space-y-3">
                                {[
                                    { label: "Stop after match", desc: "Prevents secondary rules from firing.", active: true },
                                    { label: "Fallback Catch-all", desc: "Route if no rules match.", active: true }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-none bg-slate-50/50 border border-slate-100/50 group hover:border-indigo-100 transition-colors">
                                        <div className="space-y-0.5">
                                            <p className="text-[13px] font-semibold text-slate-700">{s.label}</p>
                                            <p className="text-[10px] font-medium text-slate-400">{s.desc}</p>
                                        </div>
                                        <Switch defaultChecked={s.active} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-none bg-emerald-50 border border-emerald-100 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-700">
                                <Zap size={14} className="fill-emerald-700" />
                                <span className="text-[12px] font-semibold">AI Consistency Check</span>
                            </div>
                            <p className="text-[11px] text-emerald-700 font-medium">
                                No overlapping conditions found in your current {rules.length} rules. Your logic is clean.
                            </p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50 text-indigo-900 p-6 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] text-indigo-900">
                            <GitBranch size={100} />
                        </div>
                        <h4 className="text-[15px] font-semibold text-indigo-800 relative z-10">Logic Testing Sandbox</h4>
                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed relative z-10">
                            Validate your rules against historical data before pushing to live production.
                        </p>
                        <Button onClick={() => toast({ title: "Sandbox", description: "Loading historical replay environment..." })} className="w-full h-9 bg-white text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] rounded-none border border-indigo-100 relative z-10">
                            Enter Sandbox
                        </Button>
                    </Card>
                </div>

            </div>

            {/* Side Form */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Create New Rule" : "Edit Rule"}
                description="Configure conditional logic to route incoming leads."
                icon={<Repeat className="h-5 w-5" />}
                accentColor="#0891b2"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Save Rule" : "Update Rule"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Rule Name" required error={errors.name} hint="3–60 characters.">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Enterprise Leads - US West"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Rule Type" required error={errors.type}>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {RULE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Condition (IF)" required error={errors.condition} hint="Boolean expression evaluated against the lead.">
                        <Input
                            name="condition"
                            value={form.condition}
                            onChange={(e) => setForm({ ...form, condition: e.target.value })}
                            placeholder="e.g., Score > 80 AND Territory == 'US-West'"
                            className="h-10 rounded-none font-mono text-sm"
                        />
                    </Field>

                    <Field label="Action (THEN)" required error={errors.action} hint="What happens when the condition matches.">
                        <Input
                            name="action"
                            value={form.action}
                            onChange={(e) => setForm({ ...form, action: e.target.value })}
                            placeholder="e.g., Assign to High-Value RR Pool"
                            className="h-10 rounded-none"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this rule?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This routing rule will be permanently removed. Future leads will no longer be evaluated against it.
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
