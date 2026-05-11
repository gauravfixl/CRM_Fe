"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutGrid,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Mail,
    UserCircle2,
    Database,
    Bell,
    Share2,
    Settings2,
    Trash2,
    Zap,
    Tag,
    ShieldCheck,
    CloudIcon,
    Code,
    X,
    Pencil,
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
    SelectValue,
} from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
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

type Action = {
    id: string
    name: string
    category: string
    iconKey: "Mail" | "UserCircle2" | "Database" | "Bell" | "Tag" | "Share2"
    usageCount: number
    status: string
    description: string
}

const ICON_MAP = {
    Mail, UserCircle2, Database, Bell, Tag, Share2,
} as const

const INITIAL_ACTIONS: Action[] = [
    { id: "1", name: "Assign Owner", category: "Distribution", iconKey: "UserCircle2", usageCount: 1242, status: "Core", description: "Updates 'Current Owner' field using specified assignment method." },
    { id: "2", name: "Send Email Template", category: "Communication", iconKey: "Mail", usageCount: 890, status: "Core", description: "Triggers outbound email via integrated SMTP/Provider." },
    { id: "3", name: "Update Lead Stage", category: "Field Update", iconKey: "Database", usageCount: 2104, status: "Core", description: "Moves lead between Lifecycle stages based on logic." },
    { id: "4", name: "Push Browser Notify", category: "Notification", iconKey: "Bell", usageCount: 412, status: "Addon", description: "Sends push notification to the active lead owner's browser." },
    { id: "5", name: "Add Lead Tag", category: "Governance", iconKey: "Tag", usageCount: 562, status: "Core", description: "Appends specified tags to the lead's metadata." },
    { id: "6", name: "HTTP Webhook", category: "Integration", iconKey: "Share2", usageCount: 154, status: "Advanced", description: "POSTs lead payload to an external URL (3rd party apps)." },
]

const CATEGORIES = ["Distribution", "Communication", "Field Update", "Notification", "Governance", "Integration"]
const STATUSES = ["Core", "Advanced", "Addon"]
const ICON_KEYS: Action["iconKey"][] = ["Mail", "UserCircle2", "Database", "Bell", "Tag", "Share2"]

type FormState = { name: string; category: string; iconKey: Action["iconKey"]; status: string; description: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", category: "Communication", iconKey: "Mail", status: "Core", description: "" }

export default function ActionsLibraryPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [actions, setActions] = useState<Action[]>(INITIAL_ACTIONS)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"create" | "edit">("create")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [errors, setErrors] = useState<FormErrors>({})

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => { setIsClient(true) }, [])

    const validate = (s: FormState): FormErrors => {
        const e: FormErrors = {}
        if (!s.name.trim()) e.name = "Action name is required"
        else if (s.name.trim().length < 3) e.name = "Name too short (min 3)"
        else if (s.name.trim().length > 50) e.name = "Name too long (max 50)"

        if (!s.category) e.category = "Category required"
        if (!s.iconKey) e.iconKey = "Icon required"
        if (!s.status) e.status = "Status required"

        if (!s.description.trim()) e.description = "Description required"
        else if (s.description.trim().length < 10) e.description = "Description must be at least 10 characters"
        else if (s.description.trim().length > 200) e.description = "Description must be under 200 characters"

        return e
    }

    const openCreate = () => {
        setFormMode("create"); setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true)
    }
    const openEdit = (a: Action) => {
        setFormMode("edit"); setEditingId(a.id)
        setForm({ name: a.name, category: a.category, iconKey: a.iconKey, status: a.status, description: a.description })
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
            const created: Action = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(), category: form.category, iconKey: form.iconKey, status: form.status, description: form.description.trim(),
                usageCount: 0,
            }
            setActions([created, ...actions])
            toast({ title: "Action defined", description: `${created.name} added to library.` })
        } else if (editingId) {
            setActions(actions.map(a => a.id === editingId ? {
                ...a, name: form.name.trim(), category: form.category, iconKey: form.iconKey, status: form.status, description: form.description.trim(),
            } : a))
            toast({ title: "Action updated", description: "Changes saved." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setActions(actions.filter(a => a.id !== deletingId))
            toast({ title: "Action deleted", description: "Removed from library." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return actions.filter(a => {
            if (term && !a.name.toLowerCase().includes(term) && !a.description.toLowerCase().includes(term) && !a.category.toLowerCase().includes(term)) return false
            if (categoryFilter !== "all" && a.category !== categoryFilter) return false
            if (statusFilter !== "all" && a.status !== statusFilter) return false
            return true
        })
    }, [actions, searchTerm, categoryFilter, statusFilter])

    const clearFilters = () => { setSearchTerm(""); setCategoryFilter("all"); setStatusFilter("all") }

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
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-700"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Actions Library
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            The toolbox for your automation workflows. Define reusable steps like sending emails, updating fields, or triggering webhooks.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Permission Matrix", description: "Loading role-based access matrix." })}
                        className="h-10 border-indigo-200 bg-white shadow-sm text-slate-700 font-bold text-[12px] px-5 rounded-none"
                    >
                        <ShieldCheck className="h-4 w-4 mr-2 text-indigo-600" /> Permission Matrix
                    </Button>
                    <Button onClick={openCreate} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none rounded-none">
                        <Plus className="h-4 w-4 mr-2" /> Define New Action
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Filter bar */}
                <div className="lg:col-span-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[500px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Find actions by name, category or description..."
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-10 w-[170px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
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
                                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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

                {/* Actions Grid */}
                <div className="lg:col-span-12">
                    {filtered.length === 0 ? (
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                            <CardContent className="p-10 text-center">
                                <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[14px] font-semibold text-slate-700">No actions match your filters</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map((action) => {
                                const Icon = ICON_MAP[action.iconKey]
                                return (
                                    <Card key={action.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-indigo-100 transition-all bg-white overflow-hidden flex flex-col">
                                        <CardContent className="p-6 space-y-6 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className={`p-4 rounded-xl ${action.category === 'Communication' ? 'bg-indigo-50 text-indigo-600' :
                                                    action.category === 'Distribution' ? 'bg-cyan-50 text-cyan-600' :
                                                        action.category === 'Integration' ? 'bg-purple-50 text-purple-600' :
                                                            'bg-slate-50 text-slate-500'
                                                    }`}>
                                                    <Icon size={24} />
                                                </div>
                                                <Badge className={`border-none font-bold text-[9px] h-5 px-2 uppercase tracking-wide ${action.status === 'Core' ? 'bg-emerald-50 text-emerald-600' :
                                                    action.status === 'Advanced' ? 'bg-rose-50 text-rose-600' :
                                                        'bg-slate-50 text-slate-500'
                                                    }`}>
                                                    {action.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-[17px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{action.name}</h4>
                                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed min-h-[40px]">
                                                    {action.description}
                                                </p>
                                            </div>

                                            <div className="pt-2 flex items-center justify-between border-t border-slate-50 pt-4">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Usage</p>
                                                    <p className="text-[14px] font-bold tabular-nums text-slate-900">{action.usageCount.toLocaleString()}</p>
                                                </div>
                                                <div className="space-y-0.5 text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency</p>
                                                    <p className="text-[14px] font-bold text-emerald-500 tabular-nums">~8ms</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                            <Button
                                                variant="ghost"
                                                onClick={() => openEdit(action)}
                                                className="h-7 text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:bg-white rounded-md px-3"
                                            >
                                                Configure
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(action)}
                                                    className="h-8 w-8 text-slate-400 hover:text-slate-900"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => askDelete(action.id)}
                                                    className="h-8 w-8 text-slate-400 hover:text-rose-500"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Bottom info cards (light fills) */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    <Card className="border-none shadow-sm ring-1 ring-cyan-100 rounded-none bg-cyan-50 text-slate-900 p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Code size={150} className="text-cyan-600" />
                        </div>
                        <div className="space-y-4 relative z-10 max-w-lg">
                            <div className="p-3 rounded-xl bg-white w-fit">
                                <CloudIcon size={32} className="text-cyan-600" />
                            </div>
                            <h4 className="text-[20px] font-bold tracking-tight text-cyan-900">Cloud Function Actions</h4>
                            <p className="text-[14px] text-cyan-800 font-medium leading-relaxed">
                                Need custom logic that isn't in the library? Deploy Node.js snippets to our serverless engine and use them as custom actions.
                            </p>
                            <Button
                                onClick={() => toast({ title: "Cloud Function", description: "Opening serverless deploy wizard." })}
                                className="h-11 bg-cyan-600 text-white hover:bg-cyan-700 font-bold text-[12px] px-8 rounded-none border-none"
                            >
                                Deploy Custom Action
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-indigo-900 p-8 space-y-6 relative overflow-hidden group">
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
                                API Sync Status
                                <Zap size={16} className="text-amber-500 fill-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <h5 className="text-[24px] font-bold tracking-tighter text-indigo-900">100%</h5>
                                    <p className="text-[12px] font-bold text-indigo-700 uppercase">Availability</p>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-[24px] font-bold tracking-tighter text-indigo-900">48ms</h5>
                                    <p className="text-[12px] font-bold text-indigo-700 uppercase">Global Latency</p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <div className="flex justify-between items-center text-[11px] font-bold mb-2 opacity-80">
                                    <span>Engine Utilization</span>
                                    <span>Normal</span>
                                </div>
                                <div className="flex gap-1 h-3">
                                    {[1, 1, 1, 1, 1, 0, 0, 0, 0, 0].map((v, i) => (
                                        <div key={i} className={`flex-1 rounded-sm ${v === 1 ? 'bg-indigo-600' : 'bg-white'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Define New Action" : "Edit Action"}
                description="Reusable automation step bound to one or more workflows."
                icon={<LayoutGrid className="h-5 w-5" />}
                accentColor="#4f46e5"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Create Action" : "Save Changes"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Action Name" required error={errors.name} hint="3–50 characters.">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., Send Slack Notification"
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

                    <Field label="Icon" required error={errors.iconKey}>
                        <Select value={form.iconKey} onValueChange={(v) => setForm({ ...form, iconKey: v as Action["iconKey"] })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {ICON_KEYS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Status" required error={errors.status}>
                        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Description" required error={errors.description} hint="10–200 characters.">
                        <Textarea
                            name="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="What does this action do?"
                            className="min-h-[90px] rounded-none"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this action?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Workflows using this action may break. This cannot be undone.
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
