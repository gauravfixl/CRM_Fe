"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Users,
    Video,
    MapPin,
    Calendar,
    Clock,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Download,
    MoreHorizontal,
    Zap,
    Scale,
    AlertCircle,
    UserCheck,
    Briefcase,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    CalendarDays,
    Settings2,
    Link as LinkIcon,
    Presentation
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"

// --- Mock Data ---
const INITIAL_MEETINGS = [
    {
        id: "MTG-001",
        title: "Platform Demo & Technical Vetting",
        lead: "Aarav Sharma",
        company: "Nexus Tech",
        time: "10:30 AM - 11:30 AM",
        type: "Video",
        link: "https://zoom.us/j/123456789",
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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"

export default function MeetingsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [meetings, setMeetings] = useState(INITIAL_MEETINGS)
    const [isBookOpen, setIsBookOpen] = useState(false)
    const [newMeeting, setNewMeeting] = useState({
        title: "",
        lead: "",
        company: "",
        time: "10:00 AM - 11:00 AM",
        type: "Video" as "Video" | "On-site",
        status: "Scheduled"
    })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleJoin = (mtg: any) => {
        toast({
            title: "Joining Meeting",
            description: `Connecting to ${mtg.title} via Zoom...`,
        })
    }

    const handleBookMeeting = () => {
        if (!newMeeting.title || !newMeeting.lead) return
        setMeetings([{ ...newMeeting, id: `MTG-00${meetings.length + 1}`, priority: "Medium", status: "Scheduled" } as any, ...meetings])
        setIsBookOpen(false)
        setNewMeeting({ title: "", lead: "", company: "", time: "10:00 AM - 11:00 AM", type: "Video", status: "Scheduled" })
        toast({
            title: "Meeting Booked",
            description: "Calendar has been successfully updated.",
        })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <CalendarDays size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Meeting & Presentation Hub
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Synchronize your sales calendar. Track high-impact demos, technical vettings, and commercial negotiations to ensure maximum stakeholder engagement.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Settings2 className="h-4 w-4 mr-2 text-slate-400" /> Availability Rules
                    </Button>
                    <Dialog open={isBookOpen} onOpenChange={setIsBookOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Book Meeting
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle className="text-[18px] font-semibold text-slate-900 tracking-tight">Schedule New Session</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input placeholder="Meeting Title" className="h-11 rounded-xl" value={newMeeting.title} onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input placeholder="Lead Name" className="h-11 rounded-xl" value={newMeeting.lead} onChange={(e) => setNewMeeting({ ...newMeeting, lead: e.target.value })} />
                                    <Input placeholder="Company" className="h-11 rounded-xl" value={newMeeting.company} onChange={(e) => setNewMeeting({ ...newMeeting, company: e.target.value })} />
                                </div>
                                <Input placeholder="Time (e.g., 2:00 PM - 3:00 PM)" className="h-11 rounded-xl" value={newMeeting.time} onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })} />
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-bold rounded-xl" onClick={handleBookMeeting}>Confirm Booking</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Upcoming Meetings List */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Confirmed Schedule</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Your upcoming high-impact stakeholder sessions.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                                <span className="text-[11px] font-semibold text-slate-500">Video</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                <span className="text-[11px] font-semibold text-slate-500">On-site</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {meetings.map((mtg) => (
                            <Card key={mtg.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6 group hover:ring-indigo-100 transition-all cursor-default">
                                <div className="flex items-start justify-between">
                                    <div className={`p-4 rounded-2xl ${mtg.type === 'Video' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} transition-colors group-hover:bg-indigo-600 group-hover:text-white`}>
                                        {mtg.type === 'Video' ? <Video size={24} /> : <MapPin size={24} />}
                                    </div>
                                    <Badge className="bg-indigo-600 text-white border-none text-[9px] font-semibold tracking-wider">{mtg.status}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[16px] font-semibold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{mtg.title}</h4>
                                    <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                                        <Users size={14} />
                                        <span>{mtg.lead} • {mtg.company}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                                        <Clock size={12} />
                                        <span>{mtg.time}</span>
                                    </div>
                                    {mtg.type === 'Video' ? (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 text-indigo-600 bg-indigo-50 font-semibold text-[10px] items-center gap-2"
                                            onClick={() => handleJoin(mtg)}
                                        >
                                            <LinkIcon size={12} /> Launch
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="ghost" className="h-8 text-emerald-600 bg-emerald-50 font-semibold text-[10px] items-center gap-2">
                                            <MapPin size={12} /> Map
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </Card>

                {/* Day view timeline sidebar */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Daily Pulse: Timeline</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Monitoring your bandwidth for today, 22 Feb.</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 border-slate-100 bg-white font-semibold text-[10px] text-slate-400">Week View</Button>
                    </div>

                    <div className="space-y-0 relative flex-1">
                        <div className="absolute left-[84px] top-0 bottom-0 w-[1px] bg-slate-100" />
                        {CALENDAR_SLOTS.map((slot, i) => (
                            <div key={i} className="flex gap-12 group h-20">
                                <div className="w-12 text-right">
                                    <span className="text-[12px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors tabular-nums">{slot.hour}</span>
                                </div>
                                <div className="relative flex-1">
                                    <div className="absolute -left-[54px] top-2.5 h-2 w-2 rounded-full border-2 border-white bg-slate-200 group-hover:bg-indigo-600 z-10" />
                                    <div className={`p-4 rounded-2xl h-[calc(100%-8px)] border transition-all ${slot.highlight ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100' : slot.busy ? 'bg-slate-50 border-slate-100 text-slate-900 group-hover:bg-slate-100' : 'bg-slate-50/20 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer'} flex items-center justify-between`}>
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

                {/* Briefing sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-3xl bg-indigo-50 text-slate-900 p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 text-indigo-200 translate-x-4 translate-y-4">
                            <Presentation size={100} />
                        </div>
                        <h4 className="text-[16px] font-semibold">Preparation Advisory</h4>
                        <div className="space-y-4 relative z-10">
                            <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-2 shadow-sm">
                                <p className="text-[10px] font-semibold text-indigo-600">Context: Nexus Tech</p>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                                    Lead mentioned concerns about **API scalability** in the initial call. Ensure the technical slide deck is ready.
                                </p>
                            </div>
                            <Button className="h-10 w-full bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-xl border-none text-[11px] shadow-lg shadow-indigo-200">
                                Open Briefing Notes
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                                <UserCheck size={28} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[18px] font-semibold text-slate-900">100% RSVP Rate</h4>
                                <p className="text-[11px] text-slate-500 font-medium tracking-tight">All attendees have confirmed for today's sessions.</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full h-9 border-slate-100 text-indigo-600 font-semibold text-[10px] rounded-xl hover:bg-indigo-50">Reschedule Policy</Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
