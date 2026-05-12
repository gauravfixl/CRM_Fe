"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Calendar,
    Clock,
    Globe,
    Plus,
    ChevronLeft,
    Save,
    Trash2,
    MapPin,
    Info,
    Coffee,
    Moon,
    Sun,
    Zap,
    Search,
    Filter,
    X,
    Pencil,
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

type Scheme = {
    id: string
    name: string
    timezone: string
    hours: string
    days: string[]
    active: boolean
    region: string
}

const INITIAL_SCHEMES: Scheme[] = [
    { id: "1", name: "US East (Headquarters)", timezone: "EST (UTC-5)", hours: "09:00 - 18:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], active: true, region: "North America" },
    { id: "2", name: "EMEA Region", timezone: "GMT (UTC+0)", hours: "08:30 - 17:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], active: true, region: "Europe / ME" },
    { id: "3", name: "APAC Hub", timezone: "SGT (UTC+8)", hours: "09:00 - 18:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], active: false, region: "Asia Pacific" },
]

const REGIONS = ["North America", "Europe / ME", "Asia Pacific", "South America"]
const TIMEZONES = ["EST (UTC-5)", "PST (UTC-8)", "CST (UTC-6)", "GMT (UTC+0)", "CET (UTC+1)", "SGT (UTC+8)", "JST (UTC+9)", "AEST (UTC+10)"]

type FormState = { name: string; region: string; timezone: string; hours: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { name: "", region: "North America", timezone: "EST (UTC-5)", hours: "09:00 - 17:00" }

export default function BusinessHoursPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [schemes, setSchemes] = useState<Scheme[]>(INITIAL_SCHEMES)
    const [searchTerm, setSearchTerm] = useState("")
    const [regionFilter, setRegionFilter] = useState<string>("all")
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
        if (!state.name.trim()) e.name = "Scheme name is required"
        else if (state.name.trim().length < 3) e.name = "Name must be at least 3 characters"
        else if (state.name.trim().length > 60) e.name = "Name must be under 60 characters"

        if (!state.region) e.region = "Select a region"
        if (!state.timezone) e.timezone = "Select a timezone"

        if (!state.hours.trim()) e.hours = "Operating hours required"
        else if (!/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/.test(state.hours.trim())) e.hours = "Use HH:MM - HH:MM format"
        return e
    }

    const openCreate = () => {
        setFormMode("create"); setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true)
    }
    const openEdit = (s: Scheme) => {
        setFormMode("edit"); setEditingId(s.id)
        setForm({ name: s.name, region: s.region, timezone: s.timezone, hours: s.hours })
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
            const created: Scheme = {
                id: Math.random().toString(36).slice(2, 11),
                name: form.name.trim(),
                region: form.region,
                timezone: form.timezone,
                hours: form.hours.trim(),
                active: true,
                days: ["Mon", "Tue", "Wed", "Thu", "Fri"]
            }
            setSchemes([created, ...schemes])
            toast({ title: "Region created", description: "Calendar scheme added." })
        } else if (editingId) {
            setSchemes(schemes.map(s => s.id === editingId ? {
                ...s,
                name: form.name.trim(),
                region: form.region,
                timezone: form.timezone,
                hours: form.hours.trim(),
            } : s))
            toast({ title: "Region updated", description: "Scheme saved." })
        }
        setFormOpen(false)
    }

    const askDelete = (id: string) => { setDeletingId(id); setDeleteOpen(true) }
    const confirmDelete = () => {
        if (deletingId) {
            setSchemes(schemes.filter(s => s.id !== deletingId))
            toast({ title: "Region removed", description: "Scheme deleted." })
        }
        setDeleteOpen(false); setDeletingId(null)
    }

    const toggleStatus = (id: string) => {
        setSchemes(schemes.map(s => s.id === id ? { ...s, active: !s.active } : s))
        toast({ title: "Scheme updated", description: "Operational status adjusted." })
    }

    const handleSaveAll = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast({ title: "Calendar synced", description: "SLA logic updated for all global regions." })
        }, 1000)
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return schemes.filter(s => {
            if (term && !s.name.toLowerCase().includes(term) && !s.timezone.toLowerCase().includes(term)) return false
            if (regionFilter !== "all" && s.region !== regionFilter) return false
            if (statusFilter === "active" && !s.active) return false
            if (statusFilter === "inactive" && s.active) return false
            return true
        })
    }, [schemes, searchTerm, regionFilter, statusFilter])

    const clearFilters = () => { setSearchTerm(""); setRegionFilter("all"); setStatusFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-amber-50 p-6 rounded-none border border-amber-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-amber-700"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Working Hours & Calendars
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Ensure SLA accuracy by defining when teams are active. Leads received outside these hours will have their SLA timer paused.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Holiday database", description: "Loading regional exclusion dates." })}
                        className="h-10 border-amber-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <MapPin className="h-4 w-4 mr-2 text-amber-600" /> Holidays
                    </Button>
                    <Button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        {isSaving ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Commit Schedules</>}
                    </Button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                <div className="relative flex-1 lg:max-w-[400px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search regions by name or timezone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-amber-500"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                        <SelectTrigger className="h-10 w-[170px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                            <Filter className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="all">All Regions</SelectItem>
                            {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 w-[140px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Operational</SelectItem>
                            <SelectItem value="inactive">Paused</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchTerm || regionFilter !== "all" || statusFilter !== "all") && (
                        <Button variant="ghost" onClick={clearFilters} className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none">
                            <X className="h-3.5 w-3.5 mr-1" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Working Schemes List */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Global Working Schemes <span className="text-slate-400 font-medium ml-1">({filtered.length})</span></h2>
                        <Button
                            onClick={openCreate}
                            variant="ghost"
                            className="h-8 text-amber-700 hover:bg-amber-50 border-transparent hover:border-amber-200 border font-semibold text-[11px] uppercase tracking-widest flex items-center gap-2 rounded-none"
                        >
                            <Plus size={14} /> Add Region
                        </Button>
                    </div>

                    {filtered.length === 0 ? (
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                            <CardContent className="p-10 text-center">
                                <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[14px] font-semibold text-slate-700">No regions match your filters</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filtered.map((scheme) => (
                                <Card key={scheme.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden transition-all hover:ring-amber-200 group">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                                        <Globe size={20} />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <h4 className="text-[17px] font-semibold text-slate-900 tracking-tight">{scheme.name}</h4>
                                                        <p className="text-[12px] font-semibold text-slate-500 flex items-center gap-1.5">
                                                            <MapPin size={12} /> {scheme.region}
                                                        </p>
                                                    </div>
                                                    <Badge className={`border-none font-semibold text-[8px] h-4.5 px-1.5 uppercase tracking-widest ${scheme.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {scheme.active ? 'Operational' : 'Paused'}
                                                    </Badge>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {scheme.days.map((day, d) => (
                                                        <Badge key={d} variant="outline" className="h-7 border-slate-100 font-semibold text-[11px] px-3 bg-slate-50 text-slate-600 rounded">
                                                            {day}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="space-y-2 text-right">
                                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Active Hours</span>
                                                    <div className="flex items-center gap-3 justify-end">
                                                        <Clock size={16} className="text-amber-500" />
                                                        <h3 className="text-[20px] font-semibold text-slate-900 tabular-nums">{scheme.hours}</h3>
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-slate-500 uppercase">{scheme.timezone}</p>
                                                </div>

                                                <div className="flex flex-col gap-2 items-center">
                                                    <Switch checked={scheme.active} onCheckedChange={() => toggleStatus(scheme.id)} className="data-[state=checked]:bg-amber-600" />
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-md">
                                                                <MoreHorizontal size={16} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                            <DropdownMenuItem onClick={() => openEdit(scheme)} className="text-[12px] font-medium py-2.5">
                                                                <Pencil className="h-3.5 w-3.5 mr-2 text-slate-500" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => askDelete(scheme.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
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

                {/* Global Governance Side */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-6 space-y-6 overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                            <Clock size={200} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 w-fit">
                                <Zap size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold">SLA Pause Logic</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Defines global behaviors for clocks when teams are offline.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
                            <div className="space-y-4">
                                {[
                                    { label: "Automatic Clock Pause", desc: "SLA stops immediately at 18:00 local.", active: true, icon: Moon },
                                    { label: "Holiday Exemption", desc: "Pause timer during regional holidays.", active: true, icon: Sun },
                                    { label: "Break-time Grace", desc: "Allow 60m daily for team lunch.", active: false, icon: Coffee },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                <p.icon size={14} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[13px] font-semibold text-slate-700">{p.label}</p>
                                                <p className="text-[10px] font-medium text-slate-400">{p.desc}</p>
                                            </div>
                                        </div>
                                        <Switch
                                            defaultChecked={p.active}
                                            onCheckedChange={() => toast({ title: "Logic switch", description: `${p.label} toggled.` })}
                                            className="data-[state=checked]:bg-indigo-600 scale-75"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-amber-50 text-amber-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="space-y-2 relative z-10">
                            <h4 className="text-[16px] font-semibold tracking-tight">Shift Planning Hub</h4>
                            <p className="text-[12px] text-amber-700 font-medium leading-relaxed">
                                Need 24/7 coverage? Set up rotating shifts to overlap regional coverage areas.
                            </p>
                        </div>
                        <Button
                            onClick={() => toast({ title: "Shift modules", description: "Launching shift architecture dashboard." })}
                            className="w-full h-10 bg-white border border-amber-100 text-amber-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest relative z-10 rounded-none"
                        >
                            Explore Shifts
                        </Button>
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-amber-500">
                            <Sun size={120} />
                        </div>
                    </Card>

                    <div className="p-5 rounded-none bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                            <Info size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-indigo-900">Platform Insight</p>
                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                                "92% of your leads are currently correctly mapped to Business Hours. 4% lack timezone data."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Side Form */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={formMode === "create" ? "Define New Scheme" : "Edit Working Scheme"}
                description="Configure operating hours for a region or team."
                icon={<Calendar className="h-5 w-5" />}
                accentColor="#d97706"
                onSubmit={handleSubmit}
                submitLabel={formMode === "create" ? "Initialize Calendar" : "Update Scheme"}
                width="md"
            >
                <div className="space-y-5">
                    <Field label="Scheme Name" required error={errors.name} hint="3–60 characters.">
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g., US West Coast Operations"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Region" required error={errors.region}>
                        <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Timezone" required error={errors.timezone}>
                        <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                            <SelectTrigger className="h-10 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {TIMEZONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Operating Hours" required error={errors.hours} hint="Format: HH:MM - HH:MM (24-hour).">
                        <Input
                            name="hours"
                            value={form.hours}
                            onChange={(e) => setForm({ ...form, hours: e.target.value })}
                            placeholder="e.g., 09:00 - 17:00"
                            className="h-10 rounded-none font-mono"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this region?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The working scheme will be removed. SLA timers for leads in this region will fall back to UTC defaults.
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
