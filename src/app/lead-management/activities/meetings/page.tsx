"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Users,
    Video,
    MapPin,
    Clock,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    MoreHorizontal,
    UserCheck,
    CalendarDays,
    Settings2,
    Link as LinkIcon,
    Presentation,
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

const INITIAL_MEETINGS = [
    {
        id: "MTG-001",
        title: "Platform Demo & Technical Vetting",
        lead: "Aarav Sharma",
        company: "Nexus Tech",
        time: "10:30 AM - 11:30 AM",
        type: "Video",
        link: "https://zoom.us/j/123456789",
        location: "",
        priority: "High",
        status: "Starting in 45m"
    },
    {
        id: "MTG-002",
        title: "ROI Modeling & Pricing Discussion",
        lead: "Ishani Gupta",
        company: "Quantum Solutions",
        time: "02:00 PM - 02:45 PM",
        type: "Video",
        link: "https://meet.google.com/abc-defg-hij",
        location: "",
        priority: "Critical",
        status: "Today"
    },
    {
        id: "MTG-003",
        title: "Contract Deep Dive (On-site)",
        lead: "Rajesh Malhotra",
        company: "Malhotra Group",
        time: "Tomorrow, 01:00 PM",
        type: "On-site",
        link: "",
        location: "Gurugram HO",
        priority: "High",
        status: "Tomorrow"
    }
]

const CALENDAR_SLOTS = [
    { hour: "09:00", title: "Morning Standup", duration: "30m", busy: true },
    { hour: "10:00", title: "Technical Vetting @ Nexus", duration: "60m", busy: true, highlight: true },
    { hour: "11:00", title: "Internal: Lead Review", duration: "30m", busy: true },
    { hour: "12:00", title: "Lunch Break", duration: "60m", busy: false },
    { hour: "13:00", title: "Open for Booking", duration: "60m", busy: false },
    { hour: "14:00", title: "ROI Discussion @ Quantum", duration: "45m", busy: true, highlight: true },
]

type Meeting = typeof INITIAL_MEETINGS[number]
type FormErrors = Partial<Record<"title" | "lead" | "company" | "time" | "link" | "location", string>>

const emptyForm = {
    title: "",
    lead: "",
    company: "",
    time: "",
    type: "Video" as "Video" | "On-site",
    link: "",
    location: "",
    priority: "Medium",
}

export default function MeetingsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS)
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => { setIsClient(true) }, [])

    const filteredMeetings = useMemo(() => {
        return meetings.filter(m => {
            const q = searchQuery.toLowerCase()
            const matchesSearch =
                m.title.toLowerCase().includes(q) ||
                m.lead.toLowerCase().includes(q) ||
                m.company.toLowerCase().includes(q)
            const matchesType = typeFilter === "all" || m.type === typeFilter
            const matchesPriority = priorityFilter === "all" || m.priority === priorityFilter
            return matchesSearch && matchesType && matchesPriority
        })
    }, [meetings, searchQuery, typeFilter, priorityFilter])

    const activeFilterCount = [typeFilter, priorityFilter].filter(f => f !== "all").length

    const validate = (): boolean => {
        const e: FormErrors = {}
        if (!form.title.trim()) e.title = "Meeting title is required"
        else if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters"

        if (!form.lead.trim()) e.lead = "Lead name is required"
        else if (!/^[A-Za-z\s.'-]{2,50}$/.test(form.lead.trim())) e.lead = "Lead name must contain only letters (2-50 chars)"

        if (!form.company.trim()) e.company = "Company is required"
        else if (form.company.trim().length < 2) e.company = "Company must be at least 2 characters"

        if (!form.time.trim()) e.time = "Time is required"
        else if (form.time.trim().length < 4) e.time = "Enter a valid time"

        if (form.type === "Video") {
            if (!form.link.trim()) e.link = "Meeting link is required for video calls"
            else if (!/^https?:\/\/.{4,}/.test(form.link.trim())) e.link = "Enter a valid URL (https://...)"
        } else {
            if (!form.location.trim()) e.location = "Location is required for on-site meetings"
        }

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleJoin = (mtg: Meeting) => {
        if (mtg.link) {
            window.open(mtg.link, "_blank")
        }
        toast({ title: "Joining Meeting", description: `Connecting to ${mtg.title}...` })
    }

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm)
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (mtg: Meeting) => {
        setEditingId(mtg.id)
        setForm({
            title: mtg.title,
            lead: mtg.lead,
            company: mtg.company,
            time: mtg.time,
            type: mtg.type as "Video" | "On-site",
            link: mtg.link || "",
            location: mtg.location || "",
            priority: mtg.priority,
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
            setMeetings(meetings.map(m => m.id === editingId ? { ...m, ...form } : m))
            toast({ title: "Meeting Updated", description: "Calendar updated." })
        } else {
            const id = `MTG-${String(meetings.length + 1).padStart(3, "0")}`
            setMeetings([{ ...form, id, status: "Scheduled" } as Meeting, ...meetings])
            toast({ title: "Meeting Booked", description: "Calendar has been successfully updated." })
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setMeetings(meetings.filter(m => m.id !== id))
        toast({ title: "Cancelled", description: "Meeting removed from calendar." })
    }

    const clearFilters = () => {
        setTypeFilter("all")
        setPriorityFilter("all")
    }

    if (!isClient) return null

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: "90%" }}>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-emerald-50/60 p-4 rounded-none border border-emerald-100 shadow-sm">
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
                            <div className="p-2 rounded-none bg-white text-emerald-600 border border-emerald-100 shadow-sm">
                                <CalendarDays size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Meeting & Presentation Hub</h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Synchronize your sales calendar. Track high-impact demos, technical vettings, and commercial negotiations to ensure maximum stakeholder engagement.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => setIsAvailabilityOpen(true)} variant="outline" className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5 rounded-none">
                        <Settings2 className="h-4 w-4 mr-2 text-slate-400" /> Availability Rules
                    </Button>
                    <Button onClick={openCreate} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none">
                        <Plus className="h-4 w-4 mr-2" /> Book Meeting
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-sky-50/40 overflow-hidden p-6">
                    <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Confirmed Schedule</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Showing {filteredMeetings.length} of {meetings.length} sessions.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative w-56">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input
                                    placeholder="Search meetings..."
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
                                                <SelectItem value="Video">Video</SelectItem>
                                                <SelectItem value="On-site">On-site</SelectItem>
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
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {filteredMeetings.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-[13px] font-medium">No meetings match your filters.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {filteredMeetings.map((mtg) => (
                                <Card key={mtg.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-5 space-y-5 group hover:ring-indigo-200 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-none ${mtg.type === 'Video' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} transition-colors`}>
                                            {mtg.type === 'Video' ? <Video size={22} /> : <MapPin size={22} />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-indigo-600 text-white border-none text-[9px] font-semibold tracking-wider rounded-none">{mtg.status}</Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-none text-slate-400">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white border-slate-200 rounded-none">
                                                    <DropdownMenuItem onClick={() => openEdit(mtg)} className="text-[12px] cursor-pointer">
                                                        <Edit2 size={12} className="mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(mtg.id)} className="text-[12px] text-rose-600 cursor-pointer">
                                                        <Trash2 size={12} className="mr-2" /> Cancel Meeting
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[15px] font-semibold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{mtg.title}</h4>
                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                                            <Users size={14} />
                                            <span>{mtg.lead} • {mtg.company}</span>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                                            <Clock size={12} />
                                            <span>{mtg.time}</span>
                                        </div>
                                        {mtg.type === 'Video' ? (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 text-indigo-600 bg-indigo-50 font-semibold text-[10px] gap-2 rounded-none"
                                                onClick={() => handleJoin(mtg)}
                                            >
                                                <LinkIcon size={12} /> Launch
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 text-emerald-600 bg-emerald-50 font-semibold text-[10px] gap-2 rounded-none"
                                                onClick={() => toast({ title: "Map Opened", description: `Navigating to ${mtg.location}` })}
                                            >
                                                <MapPin size={12} /> Map
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-cyan-50/40 overflow-hidden p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Daily Pulse: Timeline</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Monitoring your bandwidth for today.</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 border-slate-200 bg-white font-semibold text-[10px] text-slate-400 rounded-none">Week View</Button>
                    </div>

                    <div className="space-y-0 relative flex-1">
                        <div className="absolute left-[84px] top-0 bottom-0 w-[1px] bg-slate-200" />
                        {CALENDAR_SLOTS.map((slot, i) => (
                            <div key={i} className="flex gap-12 group h-20">
                                <div className="w-12 text-right">
                                    <span className="text-[12px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors tabular-nums">{slot.hour}</span>
                                </div>
                                <div className="relative flex-1">
                                    <div className="absolute -left-[54px] top-2.5 h-2 w-2 rounded-none border-2 border-white bg-slate-300 group-hover:bg-indigo-600 z-10" />
                                    <div className={`p-4 rounded-none h-[calc(100%-8px)] border transition-all ${slot.highlight ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100' : slot.busy ? 'bg-white border-slate-200 text-slate-900 group-hover:border-slate-300' : 'bg-white border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer'} flex items-center justify-between`}
                                        onClick={() => !slot.busy && (openCreate(), setForm({ ...emptyForm, time: `${slot.hour} (1h)` }))}
                                    >
                                        <div className="space-y-0.5">
                                            <h4 className="text-[14px] font-semibold tracking-tight">{slot.title}</h4>
                                            {slot.busy && <p className={`text-[11px] font-semibold ${slot.highlight ? 'text-indigo-100' : 'text-slate-400'}`}>{slot.duration}</p>}
                                        </div>
                                        {!slot.busy && <Plus size={16} />}
                                        {slot.highlight && <Presentation size={18} className="opacity-50" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-5">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 p-6 space-y-5 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 text-indigo-200 translate-x-4 translate-y-4">
                            <Presentation size={100} />
                        </div>
                        <h4 className="text-[16px] font-semibold">Preparation Advisory</h4>
                        <div className="space-y-4 relative z-10">
                            <div className="p-4 rounded-none bg-white border border-indigo-100 space-y-2 shadow-sm">
                                <p className="text-[10px] font-semibold text-indigo-600">Context: Nexus Tech</p>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                                    Lead mentioned concerns about API scalability in the initial call. Ensure the technical slide deck is ready.
                                </p>
                            </div>
                            <Button
                                onClick={() => toast({ title: "Briefing Notes", description: "Opening preparation document..." })}
                                className="h-10 w-full bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-none border-none text-[11px] shadow-lg shadow-indigo-200">
                                Open Briefing Notes
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-emerald-50/50 p-6 space-y-5 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 rounded-none bg-white text-emerald-600 border border-emerald-100">
                                <UserCheck size={28} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[18px] font-semibold text-slate-900">100% RSVP Rate</h4>
                                <p className="text-[11px] text-slate-500 font-medium tracking-tight">All attendees have confirmed for today's sessions.</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full h-9 border-slate-200 bg-white text-indigo-600 font-semibold text-[10px] rounded-none hover:bg-indigo-50"
                            onClick={() => toast({ title: "Reschedule Policy", description: "Loading policy document..." })}
                        >
                            Reschedule Policy
                        </Button>
                    </Card>
                </div>

            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-emerald-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900 tracking-tight">
                                {editingId ? "Edit Meeting" : "Schedule New Session"}
                            </SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">
                                {editingId ? "Update meeting details." : "Book a new stakeholder session."}
                            </p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Meeting Title *</Label>
                                <Input
                                    placeholder="e.g., Platform Demo"
                                    className={`h-11 rounded-none border-slate-200 ${errors.title ? "border-rose-400" : ""}`}
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                                {errors.title && <p className="text-[11px] text-rose-500 font-medium">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Lead Name *</Label>
                                    <Input
                                        placeholder="Lead name"
                                        className={`h-11 rounded-none border-slate-200 ${errors.lead ? "border-rose-400" : ""}`}
                                        value={form.lead}
                                        onChange={(e) => setForm({ ...form, lead: e.target.value })}
                                    />
                                    {errors.lead && <p className="text-[11px] text-rose-500 font-medium">{errors.lead}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Company *</Label>
                                    <Input
                                        placeholder="Company"
                                        className={`h-11 rounded-none border-slate-200 ${errors.company ? "border-rose-400" : ""}`}
                                        value={form.company}
                                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    />
                                    {errors.company && <p className="text-[11px] text-rose-500 font-medium">{errors.company}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Time *</Label>
                                <Input
                                    placeholder="e.g., 2:00 PM - 3:00 PM"
                                    className={`h-11 rounded-none border-slate-200 ${errors.time ? "border-rose-400" : ""}`}
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                />
                                {errors.time && <p className="text-[11px] text-rose-500 font-medium">{errors.time}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type</Label>
                                    <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val as "Video" | "On-site" })}>
                                        <SelectTrigger className="h-11 rounded-none border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-white rounded-none">
                                            <SelectItem value="Video">Video</SelectItem>
                                            <SelectItem value="On-site">On-site</SelectItem>
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

                            {form.type === "Video" ? (
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Meeting Link *</Label>
                                    <Input
                                        type="url"
                                        placeholder="https://zoom.us/j/..."
                                        className={`h-11 rounded-none border-slate-200 ${errors.link ? "border-rose-400" : ""}`}
                                        value={form.link}
                                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    />
                                    {errors.link && <p className="text-[11px] text-rose-500 font-medium">{errors.link}</p>}
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Location *</Label>
                                    <Input
                                        placeholder="Office address"
                                        className={`h-11 rounded-none border-slate-200 ${errors.location ? "border-rose-400" : ""}`}
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    />
                                    {errors.location && <p className="text-[11px] text-rose-500 font-medium">{errors.location}</p>}
                                </div>
                            )}
                        </div>

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleSubmit}>
                                {editingId ? "Save Changes" : "Confirm Booking"}
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-indigo-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900">Availability Rules</SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">Configure your bookable time windows.</p>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 2:00 PM", "Sunday: Unavailable", "Buffer between meetings: 15 min"].map((rule, i) => (
                                <div key={i} className="p-3 bg-slate-50 border border-slate-100 text-[12px] text-slate-700 font-medium">{rule}</div>
                            ))}
                        </div>
                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <Button className="w-full h-11 bg-indigo-600 text-white font-bold rounded-none" onClick={() => setIsAvailabilityOpen(false)}>Close</Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}
