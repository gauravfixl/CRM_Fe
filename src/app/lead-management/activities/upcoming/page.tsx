"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Calendar,
    Zap,
    ChevronLeft,
    Plus,
    Search,
    Filter,
    CheckCircle2,
    MoreHorizontal,
    Timer,
    Compass,
    Edit2,
    Trash2,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/shared/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Label } from "@/shared/components/ui/label"

const INITIAL_UPCOMING = [
    { id: "UP-101", time: "In 45 min", type: "Meeting", title: "Product Roadmap Walkthrough", lead: "Aarav Sharma", company: "Nexus Tech", prepStatus: "Ready", priority: "High" },
    { id: "UP-102", time: "3:00 PM", type: "Call", title: "Commercial Terms Discussion", lead: "Ishani Gupta", company: "Quantum Solutions", prepStatus: "Action Needed", priority: "Critical" },
    { id: "UP-103", time: "5:30 PM", type: "Task", title: "Review LinkedIn Outreach Seq", lead: "Pooja Singh", company: "Singh Logistics", prepStatus: "Ready", priority: "Medium" },
]

const TOMORROW_PREVIEW = [
    { time: "09:00 AM", title: "Daily Sales Blitz", attendees: 12 },
    { time: "11:30 AM", title: "Contract Signing @ Malhotra HO", attendees: 4 },
    { time: "02:00 PM", title: "Technical Demo: V2 API", attendees: 8 },
]

type UpcomingItem = typeof INITIAL_UPCOMING[number]
type FormErrors = Partial<Record<"title" | "lead" | "company" | "time", string>>

const emptyForm = { title: "", lead: "", company: "", time: "", type: "Meeting", priority: "Medium", prepStatus: "Ready" }

export default function UpcomingActivitiesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [activities, setActivities] = useState<UpcomingItem[]>(INITIAL_UPCOMING)
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [prepFilter, setPrepFilter] = useState("all")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => { setIsClient(true) }, [])

    const filteredActivities = useMemo(() => {
        return activities.filter(a => {
            const q = searchQuery.toLowerCase()
            const matchesSearch =
                a.title.toLowerCase().includes(q) ||
                a.lead.toLowerCase().includes(q) ||
                a.company.toLowerCase().includes(q)
            const matchesType = typeFilter === "all" || a.type === typeFilter
            const matchesPriority = priorityFilter === "all" || a.priority === priorityFilter
            const matchesPrep = prepFilter === "all" || a.prepStatus === prepFilter
            return matchesSearch && matchesType && matchesPriority && matchesPrep
        })
    }, [activities, searchQuery, typeFilter, priorityFilter, prepFilter])

    const activeFilterCount = [typeFilter, priorityFilter, prepFilter].filter(f => f !== "all").length

    const validate = (): boolean => {
        const e: FormErrors = {}
        if (!form.title.trim()) e.title = "Title is required"
        else if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters"

        if (!form.lead.trim()) e.lead = "Lead name is required"
        else if (!/^[A-Za-z\s.'-]{2,50}$/.test(form.lead.trim())) e.lead = "Lead name must contain only letters (2-50 chars)"

        if (!form.company.trim()) e.company = "Company is required"
        else if (form.company.trim().length < 2) e.company = "Company must be at least 2 characters"

        if (!form.time.trim()) e.time = "Time is required"

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const togglePrep = (id: string) => {
        setActivities(activities.map(act =>
            act.id === id ? { ...act, prepStatus: act.prepStatus === 'Ready' ? 'Action Needed' : 'Ready' } : act
        ))
        toast({ title: "Status Updated", description: "Readiness status has been toggled." })
    }

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm)
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (act: UpcomingItem) => {
        setEditingId(act.id)
        setForm({
            title: act.title,
            lead: act.lead,
            company: act.company,
            time: act.time,
            type: act.type,
            priority: act.priority,
            prepStatus: act.prepStatus
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validate()) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }
        if (editingId) {
            setActivities(activities.map(a => a.id === editingId ? { ...a, ...form } : a))
            toast({ title: "Activity Updated", description: "Schedule updated." })
        } else {
            const id = `UP-${String(activities.length + 101).padStart(3, "0")}`
            setActivities([{ ...form, id } as UpcomingItem, ...activities])
            toast({ title: "Activity Added", description: "New upcoming activity scheduled." })
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setActivities(activities.filter(a => a.id !== id))
        toast({ title: "Removed", description: "Activity removed from schedule." })
    }

    const handleSync = () => {
        toast({ title: "Calendar Syncing", description: "Fetching latest slots from G-Suite and Outlook..." })
    }

    const handleFreeze = () => {
        toast({ title: "Schedule Frozen", description: "No new slots will be accepted for the next 24 hours." })
    }

    const clearFilters = () => {
        setTypeFilter("all")
        setPriorityFilter("all")
        setPrepFilter("all")
    }

    if (!isClient) return null

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: "90%" }}>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-indigo-50/60 p-4 rounded-none border border-indigo-100 shadow-sm border-l-[6px] border-l-indigo-600">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-none bg-white text-indigo-600 border border-indigo-100 shadow-sm">
                                <Timer size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Upcoming Readiness Hub</h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Next 48 hours of operational planning. Audit your preparation status for upcoming stakeholder sessions and high-value outreach.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <p className="text-[10px] font-semibold text-slate-400">Next Activity</p>
                        <h4 className="text-[18px] font-semibold text-indigo-600">Starting in 45m</h4>
                    </div>
                    <Button onClick={openCreate} variant="outline" className="h-11 border-slate-200 bg-white text-slate-600 font-semibold px-5 rounded-none text-[11px]">
                        <Plus className="h-4 w-4 mr-2" /> Add Activity
                    </Button>
                    <Button
                        onClick={handleSync}
                        className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 rounded-none shadow-lg shadow-indigo-100 border-none text-[11px]"
                    >
                        <Calendar className="h-4 w-4 mr-2" /> Calendar Sync
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-sky-50/40 overflow-hidden p-6">
                    <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Immediate Horizon (Next 12h)</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Showing {filteredActivities.length} of {activities.length} activities.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative w-56">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input
                                    placeholder="Search upcoming..."
                                    className="pl-9 h-9 rounded-none border-slate-200 bg-white text-[12px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-9 border-slate-200 bg-white text-slate-600 font-semibold px-3 gap-2 rounded-none text-[11px]">
                                        <Filter size={12} /> Filters
                                        {activeFilterCount > 0 && (
                                            <Badge className="bg-indigo-100 text-indigo-600 border-none font-bold text-[9px] h-4 rounded-none">{activeFilterCount}</Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 bg-white border-slate-200 rounded-none p-4 space-y-3" align="end">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[12px] font-bold text-slate-900">Filters</h4>
                                        {activeFilterCount > 0 && (
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-rose-500" onClick={clearFilters}>Clear</Button>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Type</Label>
                                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="Call">Call</SelectItem>
                                                <SelectItem value="Meeting">Meeting</SelectItem>
                                                <SelectItem value="Task">Task</SelectItem>
                                                <SelectItem value="Email">Email</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Priority</Label>
                                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All Priorities</SelectItem>
                                                <SelectItem value="Critical">Critical</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Prep Status</Label>
                                        <Select value={prepFilter} onValueChange={setPrepFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="Ready">Ready</SelectItem>
                                                <SelectItem value="Action Needed">Action Needed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredActivities.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-[13px] font-medium">No upcoming activities match your filters.</div>
                        ) : filteredActivities.map((act) => (
                            <div key={act.id} className="p-5 rounded-none bg-white border border-slate-100 group hover:border-indigo-200 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-none bg-slate-50 border border-slate-100 flex flex-col items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                            <span className="text-[9px] font-semibold text-slate-400 group-hover:text-indigo-100 leading-none mb-1">Time</span>
                                            <span className="text-[12px] font-semibold text-slate-900 group-hover:text-white tabular-nums tracking-tighter text-center px-1">{act.time.split(' ')[1] || act.time}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[15px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{act.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-indigo-600 text-white border-none px-2 text-[9px] font-semibold uppercase rounded-none">{act.lead}</Badge>
                                                <p className="text-[11px] text-slate-400 font-semibold tracking-wider">{act.type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right cursor-pointer" onClick={() => togglePrep(act.id)}>
                                            <p className="text-[10px] font-semibold text-slate-300 tracking-wider">Readiness</p>
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className={`text-[12px] font-semibold ${act.prepStatus === 'Ready' ? 'text-emerald-500' : 'text-amber-500'}`}>{act.prepStatus}</span>
                                                {act.prepStatus === 'Ready' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Zap size={12} className="text-amber-500" />}
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-none">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-white border-slate-200 rounded-none">
                                                <DropdownMenuItem onClick={() => openEdit(act)} className="text-[12px] cursor-pointer">
                                                    <Edit2 size={12} className="mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => togglePrep(act.id)} className="text-[12px] cursor-pointer">
                                                    <CheckCircle2 size={12} className="mr-2" /> Toggle Readiness
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(act.id)} className="text-[12px] text-rose-600 cursor-pointer">
                                                    <Trash2 size={12} className="mr-2" /> Remove
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-5">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 p-6 space-y-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-400 translate-x-4">
                            <Calendar size={120} />
                        </div>
                        <h4 className="text-[16px] font-semibold text-indigo-600 leading-none">Tomorrow Preview</h4>
                        <div className="space-y-4 flex-1 relative z-10">
                            {TOMORROW_PREVIEW.map((p, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="text-[12px] font-semibold text-slate-400 tabular-nums w-16">{p.time}</div>
                                    <div className="space-y-1">
                                        <h4 className="text-[13px] font-semibold text-slate-900 leading-tight">{p.title}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium">{p.attendees} confirmed</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={() => toast({ title: "Full Agenda", description: "Loading week view..." })}
                            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-none border-none text-[11px] shadow-lg shadow-indigo-100">
                            Full Week Agenda
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-emerald-50/50 p-6 space-y-5 flex flex-col items-center text-center">
                        <div className="p-3 rounded-none bg-white text-indigo-600 border border-indigo-100">
                            <Compass size={28} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[16px] font-semibold text-slate-900">Strategy Focus</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                You have 3 commercial sessions today. Avoid booking new discovery calls to focus on high-ticket closing.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full h-9 border-slate-200 bg-white text-indigo-600 font-semibold text-[10px] rounded-none"
                            onClick={handleFreeze}
                        >
                            Freeze Schedule
                        </Button>
                    </Card>
                </div>

                <div className="lg:col-span-12">
                    <div className="p-6 rounded-none bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-none bg-white shadow-md border border-emerald-100 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={28} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[18px] font-semibold text-emerald-900 tracking-tight">Sync Complete: Readiness Audit</h4>
                                <p className="text-[13px] text-emerald-700 font-medium">
                                    All collateral for technical vetting (ACT-101) has been verified. You're ready for the 10:30 AM session.
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => toast({ title: "Prep Notes", description: "Opening prep document..." })}
                            className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 rounded-none shadow-lg shadow-emerald-200 border-none text-[11px]">
                            Open Prep Notes
                        </Button>
                    </div>
                </div>

            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-indigo-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900">
                                {editingId ? "Edit Upcoming Activity" : "Add Upcoming Activity"}
                            </SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">
                                {editingId ? "Update activity details." : "Schedule a new activity for the next 48 hours."}
                            </p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Title *</Label>
                                <Input
                                    placeholder="Activity title"
                                    className={`h-11 rounded-none border-slate-200 ${errors.title ? "border-rose-400" : ""}`}
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                                {errors.title && <p className="text-[11px] text-rose-500 font-medium">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type</Label>
                                    <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val })}>
                                        <SelectTrigger className="h-11 rounded-none border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-white rounded-none">
                                            <SelectItem value="Call">Call</SelectItem>
                                            <SelectItem value="Meeting">Meeting</SelectItem>
                                            <SelectItem value="Task">Task</SelectItem>
                                            <SelectItem value="Email">Email</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Priority</Label>
                                    <Select value={form.priority} onValueChange={(val) => setForm({ ...form, priority: val })}>
                                        <SelectTrigger className="h-11 rounded-none border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-white rounded-none">
                                            <SelectItem value="Critical">Critical</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Lead Name *</Label>
                                <Input
                                    placeholder="Lead full name (letters only)"
                                    className={`h-11 rounded-none border-slate-200 ${errors.lead ? "border-rose-400" : ""}`}
                                    value={form.lead}
                                    onChange={(e) => setForm({ ...form, lead: e.target.value })}
                                />
                                {errors.lead && <p className="text-[11px] text-rose-500 font-medium">{errors.lead}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Company *</Label>
                                <Input
                                    placeholder="Company name"
                                    className={`h-11 rounded-none border-slate-200 ${errors.company ? "border-rose-400" : ""}`}
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                />
                                {errors.company && <p className="text-[11px] text-rose-500 font-medium">{errors.company}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Time *</Label>
                                    <Input
                                        placeholder="e.g., 3:00 PM"
                                        className={`h-11 rounded-none border-slate-200 ${errors.time ? "border-rose-400" : ""}`}
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                    />
                                    {errors.time && <p className="text-[11px] text-rose-500 font-medium">{errors.time}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Prep Status</Label>
                                    <Select value={form.prepStatus} onValueChange={(val) => setForm({ ...form, prepStatus: val })}>
                                        <SelectTrigger className="h-11 rounded-none border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-white rounded-none">
                                            <SelectItem value="Ready">Ready</SelectItem>
                                            <SelectItem value="Action Needed">Action Needed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleSubmit}>
                                {editingId ? "Save Changes" : "Add Activity"}
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}
