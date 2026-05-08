"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    AlertCircle,
    Clock,
    Flame,
    ChevronLeft,
    RefreshCw,
    Search,
    Filter,
    TrendingDown,
    Zap,
    CheckCircle2,
    Phone,
    Mail,
    Users,
    MoreHorizontal,
    Flag,
    Edit2,
    Trash2,
    UserCog,
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

const INITIAL_OVERDUE = [
    { id: "ACT-005", type: "Call", title: "Vetting Session with Arjun", lead: "Arjun Reddy", company: "Reddy Enterprises", due: "Yesterday, 10:00 AM", delay: "26h late", priority: "Critical", owner: "David Brown" },
    { id: "ACT-012", type: "Email", title: "Follow-up: Contract Review", lead: "Pooja Singh", company: "Singh Logistics", due: "2 days ago", delay: "48h late", priority: "High", owner: "Emily Davis" },
    { id: "ACT-015", type: "Meeting", title: "Strategy Calibration", lead: "Karan Johar", company: "Dharma Prod", due: "Today, 9:00 AM", delay: "4h late", priority: "Medium", owner: "James Wilson" },
]

const TYPE_ICONS: Record<string, JSX.Element> = {
    Call: <Phone size={14} className="text-rose-600" />,
    Task: <CheckCircle2 size={14} className="text-rose-600" />,
    Meeting: <Users size={14} className="text-rose-600" />,
    Email: <Mail size={14} className="text-rose-600" />,
}

type OverdueItem = typeof INITIAL_OVERDUE[number]
type RescheduleErrors = Partial<Record<"date" | "owner", string>>
type ReassignErrors = Partial<Record<"owner", string>>

export default function OverdueActivitiesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [items, setItems] = useState<OverdueItem[]>(INITIAL_OVERDUE)
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
    const [isReassignOpen, setIsReassignOpen] = useState(false)
    const [reassigningId, setReassigningId] = useState<string | null>(null)
    const [rescheduleForm, setRescheduleForm] = useState({ date: "", owner: "" })
    const [rescheduleErrors, setRescheduleErrors] = useState<RescheduleErrors>({})
    const [reassignForm, setReassignForm] = useState({ owner: "" })
    const [reassignErrors, setReassignErrors] = useState<ReassignErrors>({})

    useEffect(() => { setIsClient(true) }, [])

    const filteredItems = useMemo(() => {
        return items.filter(it => {
            const q = searchQuery.toLowerCase()
            const matchesSearch =
                it.title.toLowerCase().includes(q) ||
                it.lead.toLowerCase().includes(q) ||
                it.company.toLowerCase().includes(q) ||
                it.owner.toLowerCase().includes(q)
            const matchesType = typeFilter === "all" || it.type === typeFilter
            const matchesPriority = priorityFilter === "all" || it.priority === priorityFilter
            return matchesSearch && matchesType && matchesPriority
        })
    }, [items, searchQuery, typeFilter, priorityFilter])

    const activeFilterCount = [typeFilter, priorityFilter].filter(f => f !== "all").length

    const validateReschedule = (): boolean => {
        const e: RescheduleErrors = {}
        if (!rescheduleForm.date.trim()) e.date = "Date is required"
        else {
            const selected = new Date(rescheduleForm.date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (selected < today) e.date = "Date must be today or later"
        }
        setRescheduleErrors(e)
        return Object.keys(e).length === 0
    }

    const validateReassign = (): boolean => {
        const e: ReassignErrors = {}
        if (!reassignForm.owner.trim()) e.owner = "Owner is required"
        else if (!/^[A-Za-z\s.'-]{2,50}$/.test(reassignForm.owner.trim())) e.owner = "Owner name must contain only letters (2-50 chars)"
        setReassignErrors(e)
        return Object.keys(e).length === 0
    }

    const handleExecute = (id: string) => {
        setItems(items.filter(i => i.id !== id))
        toast({ title: "Action Resolved", description: "Activity has been processed and removed." })
    }

    const handleReschedule = () => {
        if (!validateReschedule()) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }
        toast({ title: "Schedule Updated", description: `All ${items.length} items rescheduled to ${rescheduleForm.date}.` })
        setIsRescheduleOpen(false)
        setRescheduleForm({ date: "", owner: "" })
    }

    const openReassign = (id: string) => {
        const item = items.find(i => i.id === id)
        setReassigningId(id)
        setReassignForm({ owner: item?.owner || "" })
        setReassignErrors({})
        setIsReassignOpen(true)
    }

    const handleReassign = () => {
        if (!validateReassign()) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }
        if (reassigningId) {
            setItems(items.map(i => i.id === reassigningId ? { ...i, owner: reassignForm.owner } : i))
            toast({ title: "Reassigned", description: `Activity reassigned to ${reassignForm.owner}.` })
        }
        setIsReassignOpen(false)
        setReassigningId(null)
    }

    const handleProtocol = () => {
        toast({ title: "Protocol Enabled", description: "Auto-reassignment system is now active." })
    }

    const clearFilters = () => {
        setTypeFilter("all")
        setPriorityFilter("all")
    }

    if (!isClient) return null

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: "90%" }}>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-rose-50/60 p-4 rounded-none border border-rose-100 shadow-sm border-l-[6px] border-l-rose-500">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-rose-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-none bg-white text-rose-600 border border-rose-100 shadow-sm">
                                <AlertCircle size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Overdue Action Response</h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Critical operational bottlenecks. These activities have breached their scheduled deadlines and are negatively impacting sales velocity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <p className="text-[10px] font-semibold text-rose-400">SLA Breached</p>
                        <h4 className="text-[18px] font-semibold text-rose-600">{items.length} Items</h4>
                    </div>
                    <Button onClick={() => setIsRescheduleOpen(true)} className="h-11 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 shadow-rose-100 shadow-lg border-none text-[11px] rounded-none">
                        <RefreshCw className="h-4 w-4 mr-2" /> Bulk Reschedule
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card className="border-none shadow-sm ring-1 ring-rose-100 rounded-none bg-rose-50 text-slate-900 p-5 space-y-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-rose-300 translate-x-4">
                            <Flame size={120} />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-semibold text-rose-600 tracking-wider leading-none">High-Risk Pipeline</p>
                            <h3 className="text-[24px] font-semibold tracking-tight text-slate-900">$124,500</h3>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed relative z-10">
                            Total opportunity value currently stuck in overdue activities. Immediate action required.
                        </p>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-orange-50/60 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-none bg-white text-orange-600 border border-orange-100">
                                <Clock size={20} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-300">Avg Delay</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[20px] font-semibold text-slate-900">32.4 Hours</h4>
                            <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1.5 align-middle">
                                <TrendingDown size={12} /> +12h vs last week
                            </p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50/60 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-none bg-white text-indigo-600 border border-indigo-100">
                                <Flag size={20} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-300">Critical Priority</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[20px] font-semibold text-slate-900">{items.filter(i => i.priority === "Critical").length} Issues</h4>
                            <p className="text-[11px] text-slate-500 font-medium tracking-tight">Assigned to Tier-1 Leads</p>
                        </div>
                    </Card>
                </div>

                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-sky-50/40 overflow-hidden p-6">
                    <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Overdue Inventory</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Showing {filteredItems.length} of {items.length} items.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative w-56">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input
                                    placeholder="Search overdue..."
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
                                            <Badge className="bg-rose-100 text-rose-600 border-none font-bold text-[9px] h-4 rounded-none">{activeFilterCount}</Badge>
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
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-[13px] font-medium">No overdue items match your filters.</div>
                        ) : filteredItems.map((act) => (
                            <div key={act.id} className="p-5 rounded-none bg-white border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-rose-200 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-none bg-rose-50 border border-rose-100 flex items-center justify-center">
                                        {TYPE_ICONS[act.type]}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[15px] font-semibold text-slate-900 group-hover:text-rose-600 transition-colors tracking-tight">{act.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-rose-500 text-white border-none h-4.5 text-[9px] font-semibold rounded-none">{act.delay}</Badge>
                                            <span className="text-[11px] font-semibold text-slate-400">Due: {act.due}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-center gap-1 min-w-[150px]">
                                    <p className="text-[10px] font-semibold text-slate-300 tracking-wider">Lead Impact</p>
                                    <h4 className="text-[14px] font-semibold text-slate-900">{act.lead}</h4>
                                    <p className="text-[11px] text-indigo-600 font-semibold">{act.company}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden md:block mr-2">
                                        <p className="text-[10px] font-semibold text-slate-300">Owner</p>
                                        <h4 className="text-[12px] font-semibold text-slate-900">{act.owner}</h4>
                                    </div>
                                    <Button
                                        onClick={() => handleExecute(act.id)}
                                        className="h-9 bg-white text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 font-semibold text-[11px] px-5 rounded-none transition-all shadow-sm"
                                    >
                                        Execute
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-none">
                                                <MoreHorizontal size={18} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white border-slate-200 rounded-none">
                                            <DropdownMenuItem onClick={() => openReassign(act.id)} className="text-[12px] cursor-pointer">
                                                <UserCog size={12} className="mr-2" /> Reassign
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExecute(act.id)} className="text-[12px] text-rose-600 cursor-pointer">
                                                <Trash2 size={12} className="mr-2" /> Dismiss
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="lg:col-span-12 p-6 rounded-none bg-indigo-50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="flex items-center gap-5 flex-1">
                        <div className="h-14 w-14 rounded-none bg-white shadow-md flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                            <Zap size={28} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[18px] font-semibold text-indigo-900 tracking-tight">Enable Auto-Reassignment?</h4>
                            <p className="text-[13px] text-indigo-700 font-medium leading-relaxed max-w-2xl">
                                System detected that David Brown has 8 overdue items. Automated protocol can reassign these to available reps to prevent lead decay.
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleProtocol} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 rounded-none shadow-lg shadow-indigo-100 border-none text-[11px]">Enable Protocol</Button>
                </Card>

            </div>

            <Sheet open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-rose-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900">Bulk Reschedule Recovery</SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">Move all {items.length} items to a new time window.</p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">New Date *</Label>
                                <Input
                                    type="date"
                                    className={`h-11 rounded-none border-slate-200 ${rescheduleErrors.date ? "border-rose-400" : ""}`}
                                    value={rescheduleForm.date}
                                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                                />
                                {rescheduleErrors.date && <p className="text-[11px] text-rose-500 font-medium">{rescheduleErrors.date}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Notes (optional)</Label>
                                <Input
                                    placeholder="Reason for rescheduling..."
                                    className="h-11 rounded-none border-slate-200"
                                    value={rescheduleForm.owner}
                                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, owner: e.target.value })}
                                />
                            </div>
                        </div>

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleReschedule}>Apply Recovery</Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isReassignOpen} onOpenChange={setIsReassignOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-rose-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900">Reassign Activity</SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">Transfer this overdue activity to another rep.</p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">New Owner *</Label>
                                <Input
                                    placeholder="Full name (letters only)"
                                    className={`h-11 rounded-none border-slate-200 ${reassignErrors.owner ? "border-rose-400" : ""}`}
                                    value={reassignForm.owner}
                                    onChange={(e) => setReassignForm({ owner: e.target.value })}
                                />
                                {reassignErrors.owner && <p className="text-[11px] text-rose-500 font-medium">{reassignErrors.owner}</p>}
                            </div>
                        </div>

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsReassignOpen(false)}>Cancel</Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleReassign}>Reassign</Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}
