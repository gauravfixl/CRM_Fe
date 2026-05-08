"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Phone,
    PhoneCall,
    PhoneIncoming,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    MoreHorizontal,
    Mic,
    Pause,
    SkipForward,
    Volume2,
    TrendingUp,
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

const INITIAL_QUEUE = [
    { id: "CAL-001", lead: "Aarav Sharma", company: "Nexus Tech", phone: "+91 98765 43210", reason: "Discovery Call", priority: "High", status: "Ready" },
    { id: "CAL-002", lead: "Ishani Gupta", company: "Quantum Solutions", phone: "+91 87654 32109", reason: "Follow-up", priority: "Medium", status: "In 15m" },
    { id: "CAL-003", lead: "Rajesh Malhotra", company: "Malhotra Group", phone: "+91 76543 21098", reason: "Price Negotiation", priority: "Critical", status: "Overdue" },
    { id: "CAL-004", lead: "Zoya Khan", company: "Khan & Co", phone: "+91 65432 10987", reason: "Demo Confirmation", priority: "Low", status: "Tomorrow" },
]

const INITIAL_HISTORY = [
    { id: "HIS-001", lead: "Arjun Reddy", duration: "12:45", outcome: "Interested", date: "Today, 10:15 AM" },
    { id: "HIS-002", lead: "Pooja Singh", duration: "5:20", outcome: "No Answer", date: "Today, 9:30 AM" },
    { id: "HIS-003", lead: "Karan Johar", duration: "24:10", outcome: "MQL Qualified", date: "Yesterday, 4:00 PM" },
]

type QueueCall = typeof INITIAL_QUEUE[number]
type FormErrors = Partial<Record<"lead" | "company" | "phone" | "reason", string>>

const emptyForm = { lead: "", company: "", phone: "", reason: "", priority: "Medium" }

export default function CallsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isDialing, setIsDialing] = useState(false)
    const [activeLead, setActiveLead] = useState<any>(null)
    const [queue, setQueue] = useState<QueueCall[]>(INITIAL_QUEUE)
    const [history, setHistory] = useState(INITIAL_HISTORY)
    const [showOutcome, setShowOutcome] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => { setIsClient(true) }, [])

    const filteredQueue = useMemo(() => {
        return queue.filter(c => {
            const q = searchQuery.toLowerCase()
            const matchesSearch =
                c.lead.toLowerCase().includes(q) ||
                c.company.toLowerCase().includes(q) ||
                c.reason.toLowerCase().includes(q) ||
                c.phone.includes(q)
            const matchesPriority = priorityFilter === "all" || c.priority === priorityFilter
            const matchesStatus = statusFilter === "all" || c.status === statusFilter
            return matchesSearch && matchesPriority && matchesStatus
        })
    }, [queue, searchQuery, priorityFilter, statusFilter])

    const activeFilterCount = [priorityFilter, statusFilter].filter(f => f !== "all").length

    const validate = (): boolean => {
        const e: FormErrors = {}
        if (!form.lead.trim()) e.lead = "Lead name is required"
        else if (!/^[A-Za-z\s.'-]{2,50}$/.test(form.lead.trim())) e.lead = "Lead name must contain only letters (2-50 chars)"

        if (!form.company.trim()) e.company = "Company is required"
        else if (form.company.trim().length < 2) e.company = "Company must be at least 2 characters"

        if (!form.phone.trim()) e.phone = "Phone number is required"
        else if (!/^[+]?[\d\s()-]{8,20}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number"

        if (!form.reason.trim()) e.reason = "Reason is required"
        else if (form.reason.trim().length < 3) e.reason = "Reason must be at least 3 characters"

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleDial = (leadObj: any) => {
        setActiveLead(leadObj)
        setIsDialing(true)
        setShowOutcome(false)
        toast({ title: "Dialing Lead", description: `Connecting to ${leadObj.lead}...` })
    }

    const handleEndCall = () => {
        setIsDialing(false)
        setShowOutcome(true)
    }

    const logOutcome = (outcome: string) => {
        const newHistoryItem = {
            id: `HIS-${String(history.length + 1).padStart(3, "0")}`,
            lead: activeLead.lead,
            duration: "03:42",
            outcome,
            date: "Just now"
        }
        setHistory([newHistoryItem, ...history])
        setQueue(queue.filter(q => q.id !== activeLead.id))
        setShowOutcome(false)
        setActiveLead(null)
        toast({ title: "Call Logged", description: `Outcome saved as ${outcome}.` })
    }

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm)
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (call: QueueCall) => {
        setEditingId(call.id)
        setForm({ lead: call.lead, company: call.company, phone: call.phone, reason: call.reason, priority: call.priority })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validate()) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }
        if (editingId) {
            setQueue(queue.map(c => c.id === editingId ? { ...c, ...form } : c))
            toast({ title: "Call Updated", description: "Queue entry updated." })
        } else {
            const id = `CAL-${String(queue.length + 1).padStart(3, "0")}`
            setQueue([{ ...form, id, status: "Ready" } as QueueCall, ...queue])
            toast({ title: "Call Queued", description: "Lead added to outreach queue." })
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setQueue(queue.filter(c => c.id !== id))
        toast({ title: "Removed", description: "Call removed from queue." })
    }

    const handleShuffle = () => {
        const shuffled = [...queue].sort(() => Math.random() - 0.5)
        setQueue(shuffled)
        toast({ title: "Queue Shuffled", description: "Order randomized." })
    }

    const clearFilters = () => {
        setPriorityFilter("all")
        setStatusFilter("all")
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
                                <Phone size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Global Call Center</h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The primary outreach engine. Manage your call queue, track talk time, and log outcomes with precision to increase connect rates.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 px-6 border-r border-slate-200">
                        <div className="text-right">
                            <p className="text-[10px] font-semibold text-slate-400">Daily Talk Time</p>
                            <h4 className="text-[18px] font-bold text-slate-900 tabular-nums">1h 24m</h4>
                        </div>
                        <div className="h-10 w-10 rounded-none bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                            <Mic size={20} />
                        </div>
                    </div>
                    <Button onClick={openCreate} variant="outline" className="h-10 border-slate-200 bg-white text-slate-600 font-semibold px-5 rounded-none">
                        <Plus className="h-4 w-4 mr-2" /> Add to Queue
                    </Button>
                    <Button
                        onClick={() => filteredQueue.length > 0 && handleDial(filteredQueue[0])}
                        disabled={filteredQueue.length === 0}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none disabled:opacity-50"
                    >
                        <SkipForward className="h-4 w-4 mr-2" /> Dial Next Lead
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                {isDialing && activeLead && (
                    <Card className="lg:col-span-12 border-none shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200">
                                <Volume2 size={120} />
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="h-20 w-20 rounded-none bg-indigo-600 flex items-center justify-center animate-pulse">
                                    <PhoneCall size={40} className="text-white" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500 text-white border-none h-5 text-[9px] font-semibold rounded-none">Active Call</Badge>
                                        <span className="text-[14px] font-semibold tabular-nums tracking-wider text-emerald-600">03:42</span>
                                    </div>
                                    <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">{activeLead.lead}</h2>
                                    <p className="text-[14px] text-slate-500 font-medium tracking-wide">{activeLead.phone} • {activeLead.company}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <Button size="icon" className="h-14 w-14 rounded-none bg-white text-slate-600 hover:bg-slate-100 border border-slate-200">
                                    <Pause size={24} />
                                </Button>
                                <Button size="icon" className="h-14 w-14 rounded-none bg-white text-slate-600 hover:bg-slate-100 border border-slate-200">
                                    <Mic size={24} />
                                </Button>
                                <Button onClick={handleEndCall} className="h-14 bg-rose-500 hover:bg-rose-600 text-white font-bold px-10 rounded-none border-none shadow-lg shadow-rose-900/40">
                                    End Session
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {showOutcome && activeLead && (
                    <Card className="lg:col-span-12 border-none shadow-xl ring-2 ring-emerald-500 rounded-none bg-white p-8 animate-in slide-in-from-top duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-1">
                                <h3 className="text-[20px] font-semibold text-slate-900 tracking-tight">Call Outcome: {activeLead.lead}</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Select the result of this call to update lead status and history.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {["Interested", "No Answer", "Busy", "Not Interested", "Qualified"].map((outcome) => (
                                    <Button
                                        key={outcome}
                                        variant="outline"
                                        className="h-10 rounded-none border-slate-200 font-semibold text-[11px] hover:bg-indigo-50 hover:text-indigo-600 px-6"
                                        onClick={() => logOutcome(outcome)}
                                    >
                                        {outcome}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-sky-50/40 overflow-hidden p-6">
                    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Today's Outreach Queue</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Showing {filteredQueue.length} of {queue.length} leads.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative w-56">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input
                                    placeholder="Search leads..."
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
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Status</Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="Ready">Ready</SelectItem>
                                                <SelectItem value="In 15m">In 15m</SelectItem>
                                                <SelectItem value="Overdue">Overdue</SelectItem>
                                                <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button onClick={handleShuffle} variant="outline" className="h-9 border-slate-200 bg-white text-slate-400 font-semibold text-[10px] px-4 rounded-none">Shuffle Queue</Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredQueue.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-[13px] font-medium">No calls match your filters.</div>
                        ) : filteredQueue.map((call) => (
                            <div key={call.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-none bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all gap-4 group">
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-none bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center justify-center">
                                        <PhoneIncoming size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[15px] font-semibold text-slate-900 tracking-tight">{call.lead}</h4>
                                        <p className="text-[11px] text-slate-500 font-medium">{call.reason} • <span className="text-indigo-600 font-semibold">{call.company}</span></p>
                                        <p className="text-[11px] text-slate-400 font-medium">{call.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] font-semibold text-slate-400">Status</p>
                                        <h4 className={`text-[12px] font-semibold ${call.status === 'Overdue' ? 'text-rose-500' : call.status === 'Ready' ? 'text-emerald-500' : 'text-slate-900'}`}>{call.status}</h4>
                                    </div>
                                    <Button
                                        onClick={() => handleDial(call)}
                                        className="h-9 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-semibold text-[11px] px-5 rounded-none transition-all shadow-sm"
                                    >
                                        <Phone size={14} className="mr-2" /> Dial
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-none">
                                                <MoreHorizontal size={18} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white border-slate-200 rounded-none">
                                            <DropdownMenuItem onClick={() => openEdit(call)} className="text-[12px] cursor-pointer">
                                                <Edit2 size={12} className="mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(call.id)} className="text-[12px] text-rose-600 cursor-pointer">
                                                <Trash2 size={12} className="mr-2" /> Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-5">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-emerald-50/50 p-6 space-y-5">
                        <div className="space-y-1 text-center">
                            <p className="text-[11px] font-semibold text-slate-400 tracking-wider">Connect Efficiency</p>
                            <h3 className="text-[32px] font-semibold text-slate-900 tabular-nums">42%</h3>
                            <div className="flex items-center justify-center gap-2 text-emerald-500 font-semibold text-[12px]">
                                <TrendingUp size={14} /> +8% vs last week
                            </div>
                        </div>
                        <div className="space-y-3 pt-3 border-t border-slate-200">
                            {[
                                { label: "Total Calls", val: 42 },
                                { label: "Connected", val: 18 },
                                { label: "MQL Handoffs", val: 4 },
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-[12px] font-semibold text-slate-500">{s.label}</span>
                                    <span className="text-[14px] font-semibold text-slate-900 tabular-nums">{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-cyan-50/50 p-6 space-y-4">
                        <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight">Recent Outcomes</h4>
                        <div className="space-y-3">
                            {history.map((h, i) => (
                                <div key={i} className="flex items-center justify-between text-[13px] p-2 bg-white border border-slate-100">
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-slate-900">{h.lead}</p>
                                        <p className="text-[10px] text-slate-400 font-semibold">{h.date}</p>
                                    </div>
                                    <Badge className="bg-slate-50 text-slate-600 border border-slate-200 font-semibold text-[10px] h-5 rounded-none">{h.outcome}</Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full h-8 text-indigo-600 font-semibold text-[11px] hover:bg-white rounded-none">View Recording Library</Button>
                    </Card>
                </div>

            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-emerald-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900 tracking-tight">
                                {editingId ? "Edit Call" : "Add Call to Queue"}
                            </SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">
                                {editingId ? "Update call queue details." : "Schedule a new outreach call."}
                            </p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Lead Name *</Label>
                                <Input
                                    placeholder="Full name (letters only)"
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

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Phone *</Label>
                                <Input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className={`h-11 rounded-none border-slate-200 ${errors.phone ? "border-rose-400" : ""}`}
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                                {errors.phone && <p className="text-[11px] text-rose-500 font-medium">{errors.phone}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Reason *</Label>
                                <Input
                                    placeholder="e.g., Discovery Call"
                                    className={`h-11 rounded-none border-slate-200 ${errors.reason ? "border-rose-400" : ""}`}
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                />
                                {errors.reason && <p className="text-[11px] text-rose-500 font-medium">{errors.reason}</p>}
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

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleSubmit}>
                                {editingId ? "Save Changes" : "Add to Queue"}
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}
