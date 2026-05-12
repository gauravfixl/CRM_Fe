"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Calendar,
    Phone,
    Mail,
    Users,
    CheckCircle2,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Download,
    MoreHorizontal,
    ArrowUpRight,
    TrendingUp,
    MessageSquare,
    Zap,
    AlertCircle,
    Edit2,
    Trash2,
    X
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/shared/components/ui/sheet"
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

const ACTIVITIES = [
    { id: "ACT-001", type: "Call", title: "Initial Discovery Call", lead: "Aarav Sharma", company: "Nexus Tech", owner: "Sarah Johnson", date: "Today, 10:30 AM", status: "Completed", priority: "High" },
    { id: "ACT-002", type: "Task", title: "Send Proposal Draft", lead: "Ishani Gupta", company: "Quantum Solutions", owner: "Michael Chen", date: "Today, 2:00 PM", status: "Scheduled", priority: "High" },
    { id: "ACT-003", type: "Meeting", title: "Contract Review Session", lead: "Rajesh Malhotra", company: "Malhotra Group", owner: "Sarah Johnson", date: "Tomorrow, 11:00 AM", status: "Scheduled", priority: "Critical" },
    { id: "ACT-004", type: "Email", title: "Follow-up: Pricing Inquiry", lead: "Zoya Khan", company: "Khan & Co", owner: "James Wilson", date: "Yesterday, 4:15 PM", status: "Completed", priority: "Medium" },
    { id: "ACT-005", type: "Call", title: "Vetting Session", lead: "Arjun Reddy", company: "Reddy Enterprises", owner: "David Brown", date: "2h ago", status: "Overdue", priority: "High" },
    { id: "ACT-006", type: "Task", title: "Update CRM Records", lead: "Pooja Singh", company: "Singh Logistics", owner: "Emily Davis", date: "Scheduled: 22 Feb", status: "Scheduled", priority: "Low" },
]

const TYPE_ICONS = {
    Call: <Phone size={14} className="text-indigo-600" />,
    Task: <CheckCircle2 size={14} className="text-amber-600" />,
    Meeting: <Users size={14} className="text-emerald-600" />,
    Email: <Mail size={14} className="text-cyan-600" />,
}

const STATUS_COLORS: Record<string, string> = {
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Scheduled: "bg-blue-50 text-blue-600 border-blue-100",
    Overdue: "bg-rose-50 text-rose-600 border-rose-100",
}

const PRIORITY_COLORS: Record<string, string> = {
    Critical: "text-rose-600 font-bold",
    High: "text-orange-600 font-bold",
    Medium: "text-indigo-600 font-semibold",
    Low: "text-slate-400 font-medium",
}

type Activity = typeof ACTIVITIES[number]

type FormErrors = Partial<Record<"title" | "lead" | "company" | "owner" | "date", string>>

const emptyForm = {
    title: "",
    type: "Call",
    lead: "",
    company: "",
    owner: "",
    priority: "High",
    status: "Scheduled",
    date: ""
}

export default function AllActivitiesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [activities, setActivities] = useState<Activity[]>(ACTIVITIES)
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [view, setView] = useState<"List" | "Calendar" | "Kanban">("List")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => { setIsClient(true) }, [])

    const filteredActivities = useMemo(() => {
        return activities.filter(act => {
            const q = searchQuery.toLowerCase()
            const matchesSearch =
                act.title.toLowerCase().includes(q) ||
                act.lead.toLowerCase().includes(q) ||
                act.company.toLowerCase().includes(q) ||
                act.owner.toLowerCase().includes(q)
            const matchesType = typeFilter === "all" || act.type === typeFilter
            const matchesStatus = statusFilter === "all" || act.status === statusFilter
            const matchesPriority = priorityFilter === "all" || act.priority === priorityFilter
            return matchesSearch && matchesType && matchesStatus && matchesPriority
        })
    }, [activities, searchQuery, typeFilter, statusFilter, priorityFilter])

    const activeFilterCount = [typeFilter, statusFilter, priorityFilter].filter(f => f !== "all").length

    const validate = (): boolean => {
        const e: FormErrors = {}
        if (!form.title.trim()) e.title = "Activity title is required"
        else if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters"

        if (!form.lead.trim()) e.lead = "Lead name is required"
        else if (!/^[A-Za-z\s.'-]{2,50}$/.test(form.lead.trim())) e.lead = "Lead name must contain only letters (2-50 chars)"

        if (!form.company.trim()) e.company = "Company is required"
        else if (form.company.trim().length < 2) e.company = "Company must be at least 2 characters"

        if (!form.owner.trim()) e.owner = "Owner is required"

        if (!form.date.trim()) e.date = "Due date is required"

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm)
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (act: Activity) => {
        setEditingId(act.id)
        setForm({
            title: act.title,
            type: act.type,
            lead: act.lead,
            company: act.company,
            owner: act.owner,
            priority: act.priority,
            status: act.status,
            date: act.date
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
            toast({ title: "Activity Updated", description: "Changes saved successfully." })
        } else {
            const id = `ACT-${String(activities.length + 1).padStart(3, "0")}`
            setActivities([{ ...form, id } as Activity, ...activities])
            toast({ title: "Activity Scheduled", description: "New activity added to inventory." })
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setActivities(activities.filter(a => a.id !== id))
        toast({ title: "Deleted", description: "Activity has been removed." })
    }

    const handleExport = () => {
        const headers = ["ID", "Type", "Title", "Lead", "Company", "Owner", "Date", "Priority", "Status"]
        const rows = filteredActivities.map(a => [a.id, a.type, a.title, a.lead, a.company, a.owner, a.date, a.priority, a.status])
        const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `activities-${Date.now()}.csv`
        link.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${filteredActivities.length} activities exported.` })
    }

    const clearFilters = () => {
        setTypeFilter("all")
        setStatusFilter("all")
        setPriorityFilter("all")
    }

    if (!isClient) return null

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: "90%" }}>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-indigo-50/60 p-4 rounded-none border border-indigo-100 shadow-sm">
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
                                <Calendar className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Global Activity Inventory
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            A centralized command center for all lead interactions. Manage calls, meetings, tasks, and emails to drive pipeline velocity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleExport} variant="outline" className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5 rounded-none">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export History
                    </Button>
                    <Button onClick={openCreate} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none">
                        <Plus className="h-4 w-4 mr-2" /> Schedule Activity
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-5">
                    {[
                        { label: "Today's Agenda", val: "12 Activities", detail: "4 Calls, 2 Meetings", icon: Zap, bg: "bg-amber-50", color: "text-amber-600" },
                        { label: "Pending Response", val: "18 Leads", detail: "Awaiting outreach", icon: MessageSquare, bg: "bg-indigo-50", color: "text-indigo-600" },
                        { label: "Overdue Actions", val: "14 Items", detail: "Needs immediate fix", icon: AlertCircle, bg: "bg-rose-50", color: "text-rose-600" },
                        { label: "Productivity", val: "92%", detail: "Close-to-completion", icon: TrendingUp, bg: "bg-emerald-50", color: "text-emerald-600" },
                    ].map((s, i) => (
                        <Card key={i} className={`border-none shadow-sm ring-1 ring-slate-100 rounded-none ${s.bg} p-4 space-y-3`}>
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-none bg-white/80 ${s.color} shadow-sm`}>
                                    <s.icon size={18} />
                                </div>
                                <ArrowUpRight size={14} className="text-slate-400/50" />
                            </div>
                            <div className="space-y-0.5">
                                <p className={`text-[10px] font-semibold tracking-wider opacity-70 ${s.color}`}>{s.label}</p>
                                <h4 className="text-[18px] font-bold text-slate-900">{s.val}</h4>
                                <p className="text-[10px] text-slate-500 font-medium">{s.detail}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-sky-50/40 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-sky-50/60 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input
                                    placeholder="Search activities, leads..."
                                    className="pl-9 h-10 rounded-none border-slate-200 bg-white text-[12px] font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-10 border-slate-200 bg-white text-slate-600 font-semibold px-4 gap-2 rounded-none">
                                        <Filter size={14} className="text-slate-400" /> Filters
                                        {activeFilterCount > 0 && (
                                            <Badge className="bg-indigo-100 text-indigo-600 border-none font-bold text-[9px] h-4 rounded-none">{activeFilterCount}</Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 bg-white border-slate-200 rounded-none p-4 space-y-3" align="start">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[12px] font-bold text-slate-900">Filter Activities</h4>
                                        {activeFilterCount > 0 && (
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-rose-500 hover:text-rose-600" onClick={clearFilters}>
                                                Clear all
                                            </Button>
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
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Status</Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                                <SelectItem value="Overdue">Overdue</SelectItem>
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
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 p-1 bg-white rounded-none border border-slate-200">
                                {(["List", "Calendar", "Kanban"] as const).map(v => (
                                    <Button
                                        key={v}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setView(v)}
                                        className={`h-7 px-3 text-[10px] font-semibold rounded-none ${view === v ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        {v}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {view === "List" && (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-100 hover:bg-transparent">
                                    <TableHead className="w-[80px] text-[10px] font-bold text-slate-400 py-5">Type</TableHead>
                                    <TableHead className="text-[10px] font-bold text-slate-400">Activity Detail</TableHead>
                                    <TableHead className="text-[10px] font-bold text-slate-400">Lead / Company</TableHead>
                                    <TableHead className="text-[10px] font-bold text-slate-400">Owner</TableHead>
                                    <TableHead className="text-[10px] font-bold text-slate-400">Due Date</TableHead>
                                    <TableHead className="text-[10px] font-bold text-slate-400">Priority</TableHead>
                                    <TableHead className="text-[10px] font-bold text-slate-400">Status</TableHead>
                                    <TableHead className="text-[10px] font-bold text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredActivities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-[13px] font-medium">
                                            No activities match your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : filteredActivities.map((act) => (
                                    <TableRow key={act.id} className="border-slate-100 group hover:bg-white/70 transition-colors">
                                        <TableCell>
                                            <div className="p-2 rounded-none bg-white border border-slate-200 w-fit">
                                                {TYPE_ICONS[act.type as keyof typeof TYPE_ICONS]}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="text-[14px] font-bold text-slate-900 line-clamp-1">{act.title}</p>
                                                <p className="text-[10px] font-semibold text-slate-400">{act.id}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="text-[14px] font-bold text-indigo-600 hover:underline cursor-pointer">{act.lead}</p>
                                                <p className="text-[11px] text-slate-500 font-medium">{act.company}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {act.owner.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-[13px] font-medium text-slate-600">{act.owner}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-[13px] font-bold ${act.status === 'Overdue' ? 'text-rose-500' : 'text-slate-600'}`}>{act.date}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-[12px] ${PRIORITY_COLORS[act.priority]}`}>{act.priority}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[10px] font-bold border rounded-none ${STATUS_COLORS[act.status]}`}>
                                                {act.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-none">
                                                        <MoreHorizontal size={18} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white border-slate-200 rounded-none">
                                                    <DropdownMenuItem onClick={() => openEdit(act)} className="text-[12px] cursor-pointer">
                                                        <Edit2 size={12} className="mr-2" /> Edit Activity
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(act.id)} className="text-[12px] text-rose-600 cursor-pointer">
                                                        <Trash2 size={12} className="mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {view === "Calendar" && (
                        <div className="p-8 text-center bg-white">
                            <Calendar className="h-12 w-12 mx-auto text-indigo-300 mb-3" />
                            <h3 className="text-[14px] font-semibold text-slate-700">Calendar View</h3>
                            <p className="text-[12px] text-slate-400 mt-1">Showing {filteredActivities.length} activities grouped by date.</p>
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                                {filteredActivities.map(a => (
                                    <div key={a.id} className="p-3 border border-slate-100 bg-slate-50 flex items-center gap-3">
                                        <div className="p-2 bg-white border border-slate-200">{TYPE_ICONS[a.type as keyof typeof TYPE_ICONS]}</div>
                                        <div className="flex-1 space-y-0.5">
                                            <p className="text-[12px] font-bold text-slate-900">{a.title}</p>
                                            <p className="text-[10px] text-slate-500">{a.date} · {a.lead}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === "Kanban" && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
                            {(["Scheduled", "Completed", "Overdue"] as const).map(col => (
                                <div key={col} className="space-y-3 bg-slate-50 p-3 border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[11px] font-bold text-slate-700 uppercase">{col}</h4>
                                        <Badge className="bg-white text-slate-600 border border-slate-200 rounded-none">
                                            {filteredActivities.filter(a => a.status === col).length}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {filteredActivities.filter(a => a.status === col).map(a => (
                                            <Card key={a.id} className="p-3 rounded-none border border-slate-200 bg-white space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="p-1 bg-slate-50 border border-slate-100">{TYPE_ICONS[a.type as keyof typeof TYPE_ICONS]}</div>
                                                    <span className={`text-[10px] ${PRIORITY_COLORS[a.priority]}`}>{a.priority}</span>
                                                </div>
                                                <p className="text-[12px] font-bold text-slate-900 line-clamp-2">{a.title}</p>
                                                <p className="text-[10px] text-slate-500">{a.lead} · {a.company}</p>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-indigo-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900 tracking-tight">
                                {editingId ? "Edit Activity" : "Schedule New Activity"}
                            </SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">
                                {editingId ? "Modify the details for this activity." : "Plan a call, meeting, task, or email."}
                            </p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Activity Title *</Label>
                                <Input
                                    placeholder="e.g., Deep Vetting Call"
                                    className={`h-11 rounded-none border-slate-200 ${errors.title ? "border-rose-400" : ""}`}
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                                {errors.title && <p className="text-[11px] text-rose-500 font-medium">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type *</Label>
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
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Priority *</Label>
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
                                    placeholder="Full Name (letters only)"
                                    className={`h-11 rounded-none border-slate-200 ${errors.lead ? "border-rose-400" : ""}`}
                                    value={form.lead}
                                    onChange={(e) => setForm({ ...form, lead: e.target.value })}
                                />
                                {errors.lead && <p className="text-[11px] text-rose-500 font-medium">{errors.lead}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Company *</Label>
                                <Input
                                    placeholder="e.g., Nexus Corp"
                                    className={`h-11 rounded-none border-slate-200 ${errors.company ? "border-rose-400" : ""}`}
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                />
                                {errors.company && <p className="text-[11px] text-rose-500 font-medium">{errors.company}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Owner *</Label>
                                <Input
                                    placeholder="Sales rep responsible"
                                    className={`h-11 rounded-none border-slate-200 ${errors.owner ? "border-rose-400" : ""}`}
                                    value={form.owner}
                                    onChange={(e) => setForm({ ...form, owner: e.target.value })}
                                />
                                {errors.owner && <p className="text-[11px] text-rose-500 font-medium">{errors.owner}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Due Date *</Label>
                                    <Input
                                        type="text"
                                        placeholder="Today, 4:00 PM"
                                        className={`h-11 rounded-none border-slate-200 ${errors.date ? "border-rose-400" : ""}`}
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    />
                                    {errors.date && <p className="text-[11px] text-rose-500 font-medium">{errors.date}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</Label>
                                    <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                                        <SelectTrigger className="h-11 rounded-none border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-white rounded-none">
                                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Overdue">Overdue</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsFormOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleSubmit}>
                                {editingId ? "Save Changes" : "Schedule Activity"}
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}
