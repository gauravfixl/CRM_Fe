"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutGrid,
    Plus,
    Users,
    ChevronLeft,
    Search,
    Filter,
    ShieldCheck,
    Clock,
    Zap,
    AlertCircle,
    ArrowUpRight,
    ArrowRight,
    Trash2,
    Pencil,
    X,
    MoreHorizontal,
    AlertTriangle,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
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

type Queue = {
    id: string
    name: string
    type: string
    leadCount: number
    avgHoldTime: string
    members: string[]
    health: number
    status: string
}

const INITIAL_QUEUES: Queue[] = [
    { id: "1", name: "General Inbound Pool", type: "Unassigned Holding", leadCount: 142, avgHoldTime: "42 mins", members: ["AM", "JS", "RK", "EW"], health: 85, status: "Active" },
    { id: "2", name: "Enterprise VIP Queue", type: "Priority Tier", leadCount: 12, avgHoldTime: "8 mins", members: ["MC", "SJ", "BW"], health: 98, status: "High Priority" },
    { id: "3", name: "EMEA Region Hub", type: "Geography Pool", leadCount: 54, avgHoldTime: "1.2 hours", members: ["FR", "DE", "IT"], health: 62, status: "Warning" },
    { id: "4", name: "Nurture Overflow", type: "Low Intent Cache", leadCount: 850, avgHoldTime: "N/A", members: ["BOT"], health: 100, status: "Automated" },
]

const QUEUE_TYPES = ["Unassigned Holding", "Priority Tier", "Geography Pool", "Low Intent Cache"]
const QUEUE_STATUSES = ["Active", "High Priority", "Warning", "Automated"]

type FormState = { name: string; type: string; status: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", type: "Unassigned Holding", status: "Active" }

export default function QueuesPoolsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [queues, setQueues] = useState<Queue[]>(INITIAL_QUEUES)
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
        if (!state.name.trim()) e.name = "Queue name is required"
        else if (state.name.trim().length < 3) e.name = "Name must be at least 3 characters"
        else if (state.name.trim().length > 60) e.name = "Name must be under 60 characters"

        if (!state.type) e.type = "Select a queue type"
        if (!state.status) e.status = "Select a status"
        return e
    }

    const openCreate = () => {
        setFormMode("create"); setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true)
    }
    const openEdit = (q: Queue) => {
        setFormMode("edit"); setEditingId(q.id)
        setForm({ name: q.name, type: q.type, status: q.status })
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
            const created: Queue = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(),
                type: form.type,
                status: form.status,
                leadCount: 0,
                avgHoldTime: "N/A",
                members: [],
                health: 100,
            }
            setQueues([created, ...queues])
            toast({ title: "Queue created", description: `${created.name} added.` })
        } else if (editingId) {
            setQueues(queues.map(q => q.id === editingId ? { ...q, name: form.name.trim(), type: form.type, status: form.status } : q))
            toast({ title: "Queue updated", description: "Settings applied." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setQueues(queues.filter(q => q.id !== deletingId))
            toast({ title: "Queue removed", description: "Queue deleted." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return queues.filter(q => {
            if (term && !q.name.toLowerCase().includes(term) && !q.type.toLowerCase().includes(term)) return false
            if (typeFilter !== "all" && q.type !== typeFilter) return false
            if (statusFilter !== "all" && q.status !== statusFilter) return false
            return true
        })
    }, [queues, searchTerm, typeFilter, statusFilter])

    const clearFilters = () => { setSearchTerm(""); setTypeFilter("all"); setStatusFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-emerald-50 p-6 rounded-none border border-emerald-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-emerald-700"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Queues & Shared Pools
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Manage collective holding areas for leads before they are claimed or auto-assigned. Set capacity limits and pickup policies.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Team Access", description: "Loading team membership editor..." })}
                        className="h-10 border-emerald-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <Users className="h-4 w-4 mr-2 text-emerald-600" /> Manage Team Access
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create Queue
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Stats Row — compact 4-up KPI strip */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card className="border border-indigo-100 shadow-sm rounded-none bg-indigo-50 p-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 min-w-0">
                                <p className="text-[10px] font-semibold text-indigo-700 tracking-wider uppercase leading-none truncate">Total In-Queue</p>
                                <h3 className="text-[20px] font-semibold tracking-tight text-slate-900 tabular-nums leading-tight">
                                    {queues.reduce((s, q) => s + q.leadCount, 0).toLocaleString()}
                                </h3>
                                <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                                    <ArrowUpRight size={11} /> +12.4% vs last week
                                </p>
                            </div>
                            <div className="p-1.5 rounded-none bg-white text-indigo-600 shrink-0">
                                <LayoutGrid size={16} />
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-cyan-100 shadow-sm rounded-none bg-cyan-50 p-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 min-w-0">
                                <p className="text-[10px] font-semibold text-cyan-700 tracking-wider uppercase leading-none truncate">Avg. Pickup Time</p>
                                <h3 className="text-[20px] font-semibold tracking-tight text-slate-900 tabular-nums leading-tight">22.5m</h3>
                                <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1 mt-0.5 truncate">
                                    <ArrowRight size={11} className="rotate-90 shrink-0" /> Needs improvement (EMEA)
                                </p>
                            </div>
                            <div className="p-1.5 rounded-none bg-white text-cyan-600 shrink-0">
                                <Clock size={16} />
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-emerald-100 shadow-sm rounded-none bg-emerald-50 p-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 min-w-0 w-full">
                                <p className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase leading-none truncate">Pool Saturation</p>
                                <h3 className="text-[20px] font-semibold tracking-tight text-slate-900 tabular-nums leading-tight">68%</h3>
                                <Progress value={68} className="h-1.5 w-full mt-1.5 bg-white [&>div]:bg-emerald-500" />
                            </div>
                            <div className="p-1.5 rounded-none bg-white text-emerald-600 shrink-0 ml-2">
                                <ShieldCheck size={16} />
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-rose-100 shadow-sm rounded-none bg-rose-50 p-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 min-w-0">
                                <p className="text-[10px] font-semibold text-rose-700 tracking-wider uppercase leading-none truncate">Stale Leads</p>
                                <h3 className="text-[20px] font-semibold tracking-tight text-slate-900 tabular-nums leading-tight">47</h3>
                                <p className="text-[10px] font-semibold text-rose-600 flex items-center gap-1 mt-0.5 truncate">
                                    <AlertTriangle size={11} className="shrink-0" /> Pickup SLA breached
                                </p>
                            </div>
                            <div className="p-1.5 rounded-none bg-white text-rose-600 shrink-0">
                                <AlertTriangle size={16} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search & Filter Bar */}
                <div className="lg:col-span-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[400px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search queues by name or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-emerald-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 w-[180px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <Filter className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Types</SelectItem>
                                    {QUEUE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 w-[150px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Status</SelectItem>
                                    {QUEUE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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

                {/* Queue Management Cards */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                            Global Queues <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none font-semibold px-2 h-5 text-[10px]">{filtered.length}</Badge>
                        </h2>
                    </div>

                    {filtered.length === 0 ? (
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                            <CardContent className="p-10 text-center">
                                <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[14px] font-semibold text-slate-700">No queues match your filters</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {filtered.map((queue) => (
                                <Card key={queue.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white transition-all hover:ring-emerald-100 group overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-4 flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-[16px] font-semibold text-slate-900 tracking-tight truncate">{queue.name}</h4>
                                                    <Badge className={`
                                                        ${queue.status === 'High Priority' ? 'bg-indigo-600 text-white' :
                                                            queue.status === 'Warning' ? 'bg-rose-50 text-rose-600' :
                                                                queue.status === 'Automated' ? 'bg-cyan-50 text-cyan-600' :
                                                                    'bg-emerald-50 text-emerald-600'}
                                                        border-none text-[8px] font-semibold px-1.5 h-4.5 uppercase
                                                    `}>
                                                        {queue.status}
                                                    </Badge>
                                                    <Badge className="bg-slate-50 text-slate-500 border-none font-semibold text-[8px] h-4.5 px-1.5 uppercase tracking-wide">
                                                        {queue.type}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                    <div className="space-y-0.5">
                                                        <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Leads</span>
                                                        <p className="text-[18px] font-semibold text-slate-900 tabular-nums">{queue.leadCount.toLocaleString()}</p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Avg Hold</span>
                                                        <p className="text-[16px] font-semibold text-slate-600 tabular-nums">{queue.avgHoldTime}</p>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Queue Health Index</span>
                                                        <div className="flex items-center gap-3">
                                                            <Progress value={queue.health} className={`h-1.5 flex-1 bg-slate-50 ${queue.health < 70 ? '[&>div]:bg-rose-500' : '[&>div]:bg-emerald-500'}`} />
                                                            <span className={`text-[11px] font-semibold tabular-nums ${queue.health < 70 ? 'text-rose-600' : 'text-emerald-600'}`}>{queue.health}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-10 min-w-[200px]">
                                                <div className="flex items-center -space-x-2">
                                                    {queue.members.slice(0, 4).map((m, i) => (
                                                        <Avatar key={i} className="h-8 w-8 ring-2 ring-white border-none bg-slate-100 text-[10px] font-semibold text-slate-500">
                                                            <AvatarFallback>{m}</AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    {queue.members.length > 4 && (
                                                        <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0 border-slate-100 bg-white text-[10px] font-semibold text-slate-400">
                                                            +{queue.members.length - 4}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(queue)} className="h-9 w-9 bg-slate-50 rounded-md text-slate-500 hover:text-slate-900">
                                                        <Pencil size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => askDelete(queue.id)} className="h-9 w-9 bg-rose-50 rounded-md text-rose-500 hover:text-rose-600">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 bg-slate-50 rounded-md text-slate-400 hover:text-slate-900">
                                                                <MoreHorizontal size={14} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                            <DropdownMenuItem onClick={() => openEdit(queue)} className="text-[12px] font-medium py-2.5">
                                                                <Pencil className="h-3.5 w-3.5 mr-2 text-slate-500" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => toast({ title: "Members", description: `Opening member roster for ${queue.name}.` })} className="text-[12px] font-medium py-2.5">
                                                                <Users className="h-3.5 w-3.5 mr-2 text-indigo-500" /> Manage Members
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => askDelete(queue.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
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
                    )}
                </div>

                {/* Queue Policy Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 w-fit shadow-sm">
                                <Zap size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold">Auto-Pickup Policy</h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Current mode: <strong>Push Hybrid</strong>. System pushes to reps but allows manual claim from Pool.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h5 className="text-[12px] font-semibold text-slate-400 tracking-wider">Pickup Rules</h5>
                            <div className="space-y-3">
                                {[
                                    { label: "Max Claim Per Rep", val: "5 leads/hr" },
                                    { label: "Idle Purge", val: "24 hours" },
                                    { label: "Pool Priority Lock", val: "30 mins" },
                                ].map((r, i) => (
                                    <div key={i} className="flex flex-col gap-1 p-3 rounded-none bg-slate-50/50 border border-slate-100/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] font-semibold text-slate-700">{r.label}</span>
                                            <Badge variant="outline" className="border-slate-100 text-[10px] font-semibold text-indigo-600 px-1.5 h-5">{r.val}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-rose-50 text-slate-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-rose-500 group-hover:scale-110 transition-transform">
                            <AlertCircle size={80} />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <h4 className="text-[16px] font-semibold tracking-tight text-rose-600">Congestion Alert</h4>
                            <p className="text-[12px] text-slate-700 font-medium leading-relaxed">
                                <strong className="font-semibold text-slate-900">EMEA Region Hub</strong> has exceeded capacity (54 leads). SLA breach risk is High.
                            </p>
                        </div>
                        <Button onClick={() => toast({ title: "Redistribution", description: "Loading load-balancer..." })} className="w-full h-10 bg-white text-rose-600 border border-rose-100 hover:bg-rose-100/50 font-semibold text-[11px] uppercase tracking-wider relative z-10 rounded-none">
                            Redistribute Leads
                        </Button>
                    </Card>
                </div>

            </div>

            {/* Side Form */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Create New Queue" : "Edit Queue"}
                description="Configure a holding pool for incoming leads."
                icon={<LayoutGrid className="h-5 w-5" />}
                accentColor="#059669"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Create Queue" : "Update Queue"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Queue Name" required error={errors.name} hint="3–60 characters.">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Enterprise VIP Queue"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Queue Type" required error={errors.type}>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {QUEUE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Status" required error={errors.status}>
                        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {QUEUE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this queue?</AlertDialogTitle>
                        <AlertDialogDescription>
                            All leads currently held in this queue will need to be redistributed manually. This cannot be undone.
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
