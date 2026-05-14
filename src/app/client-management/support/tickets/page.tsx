"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Search, Plus, Filter, MoreVertical, Clock, User, Paperclip, Eye, Edit, Trash2,
    X, CheckCircle, ArrowUpRight, AlertTriangle, TicketIcon, TrendingUp, TrendingDown,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/utils/toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

type Ticket = {
    id: string
    client: string
    contact: string
    subject: string
    description: string
    priority: string
    status: string
    agent: string
    created: string
    updated: string
    category: string
    attachments: number
}

const validators = {
    required: (v: string) => !v?.toString().trim() ? "Required" : "",
    email: (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Invalid email" : "",
    minLen: (n: number) => (v: string) => v?.trim().length < n ? `Min ${n} chars` : "",
}

export default function SupportTickets() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [filterPriority, setFilterPriority] = React.useState("all")
    const [filterCategory, setFilterCategory] = React.useState("all")

    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const [isViewOpen, setIsViewOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
    const [editingId, setEditingId] = React.useState<string | null>(null)

    const [tickets, setTickets] = React.useState<Ticket[]>([
        { id: "TK-001", client: "Acme Corp", contact: "john@acme.com", subject: "Login Issues", description: "Users unable to login to the system after the latest update.", priority: "High", status: "Open", agent: "John Doe", created: "2024-02-26T10:00:00Z", updated: "2024-02-26T14:30:00Z", category: "Technical", attachments: 2 },
        { id: "TK-002", client: "TechStart Inc", contact: "sarah@techstart.com", subject: "API Integration Help", description: "Need assistance with REST API integration.", priority: "Medium", status: "In Progress", agent: "Jane Smith", created: "2024-02-26T08:00:00Z", updated: "2024-02-26T12:00:00Z", category: "Integration", attachments: 1 },
        { id: "TK-003", client: "Global Solutions", contact: "mike@global.com", subject: "Billing Query", description: "Question about monthly billing charges.", priority: "Low", status: "Resolved", agent: "Mike Johnson", created: "2024-02-25T16:00:00Z", updated: "2024-02-26T09:00:00Z", category: "Billing", attachments: 0 },
        { id: "TK-004", client: "Innovation Labs", contact: "lisa@innovation.com", subject: "Feature Request", description: "Request for new dashboard analytics features.", priority: "Medium", status: "Open", agent: "Sarah Wilson", created: "2024-02-25T14:00:00Z", updated: "2024-02-25T14:00:00Z", category: "Feature Request", attachments: 3 },
        { id: "TK-005", client: "Enterprise Co", contact: "tom@enterprise.com", subject: "Performance Issue", description: "System running slowly during peak hours.", priority: "Critical", status: "Open", agent: "Tom Brown", created: "2024-02-25T10:00:00Z", updated: "2024-02-26T11:00:00Z", category: "Performance", attachments: 1 }
    ])

    const [form, setForm] = React.useState({
        client: "", contact: "", subject: "", description: "",
        priority: "Medium", category: "General", agent: ""
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-700'
            case 'High': return 'bg-orange-100 text-orange-700'
            case 'Medium': return 'bg-amber-100 text-amber-700'
            case 'Low': return 'bg-green-100 text-green-700'
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-700'
            case 'In Progress': return 'bg-orange-100 text-orange-700'
            case 'Resolved': return 'bg-emerald-100 text-emerald-700'
            case 'Closed': return 'bg-slate-100 text-slate-600'
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.agent.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
        const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority
        const matchesCategory = filterCategory === "all" || ticket.category === filterCategory
        return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })

    const hasActiveFilters = filterStatus !== "all" || filterPriority !== "all" || filterCategory !== "all" || searchQuery !== ""

    const clearFilters = () => {
        setFilterStatus("all")
        setFilterPriority("all")
        setFilterCategory("all")
        setSearchQuery("")
        toast.success("Filters cleared")
    }

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.subject = validators.required(form.subject) || validators.minLen(3)(form.subject)
        errs.description = validators.required(form.description)
        errs.contact = validators.email(form.contact)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", contact: "", subject: "", description: "", priority: "Medium", category: "General", agent: "" })
        setErrors({})
        setIsCreateOpen(true)
    }

    const openEdit = (ticket: Ticket) => {
        setEditingId(ticket.id)
        setForm({
            client: ticket.client, contact: ticket.contact, subject: ticket.subject,
            description: ticket.description, priority: ticket.priority, category: ticket.category, agent: ticket.agent
        })
        setErrors({})
        setIsEditOpen(true)
    }

    const openView = (ticket: Ticket) => { setSelectedTicket(ticket); setIsViewOpen(true) }

    const handleCreateTicket = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const ticket: Ticket = {
            id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
            ...form,
            status: "Open",
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            attachments: 0
        }
        setTickets([ticket, ...tickets])
        setIsCreateOpen(false)
        toast.success("Ticket created successfully")
    }

    const handleEditTicket = () => {
        if (!editingId) return
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        setTickets(tickets.map(t =>
            t.id === editingId ? { ...t, ...form, updated: new Date().toISOString() } : t
        ))
        setIsEditOpen(false)
        toast.success("Ticket updated successfully")
    }

    const handleDeleteTicket = (ticketId: string) => {
        setTickets(tickets.filter(t => t.id !== ticketId))
        toast.success("Ticket deleted")
    }

    const handleUpdateStatus = (ticketId: string, status: string) => {
        setTickets(tickets.map(t =>
            t.id === ticketId ? { ...t, status, updated: new Date().toISOString() } : t
        ))
        toast.success(`Ticket marked as ${status}`)
    }

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === "Open").length,
        inProgress: tickets.filter(t => t.status === "In Progress").length,
        resolved: tickets.filter(t => t.status === "Resolved").length,
    }

    const kpiCards = [
        { label: "Total Tickets", value: stats.total, icon: TicketIcon, bg: "bg-gradient-to-br from-slate-50 to-slate-100/60 border-slate-200/80", iconBg: "bg-slate-100", text: "text-slate-700", path: "/client-management/support/overview" },
        { label: "Open", value: stats.open, icon: AlertTriangle, bg: "bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/80", iconBg: "bg-blue-100", text: "text-blue-700", path: "/client-management/support/tickets" },
        { label: "In Progress", value: stats.inProgress, icon: ArrowUpRight, bg: "bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200/80", iconBg: "bg-amber-100", text: "text-amber-700", path: "/client-management/support/escalations" },
        { label: "Resolved", value: stats.resolved, icon: CheckCircle, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/80", iconBg: "bg-emerald-100", text: "text-emerald-700", path: "/client-management/analytics/performance" },
    ]

    const FormFields = ({ data, errs, onChange }: { data: typeof form, errs: Record<string, string>, onChange: (f: string, v: any) => void }) => (
        <>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Client <span className="text-rose-500">*</span></Label>
                    <Input
                        value={data.client}
                        onChange={(e) => onChange("client", e.target.value)}
                        placeholder="Client name"
                        className={`h-10 rounded-none ${errs.client ? "border-rose-500" : ""}`}
                    />
                    {errs.client && <p className="text-[11px] text-rose-500">{errs.client}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Contact Email</Label>
                    <Input
                        value={data.contact}
                        onChange={(e) => onChange("contact", e.target.value)}
                        placeholder="contact@client.com"
                        className={`h-10 rounded-none ${errs.contact ? "border-rose-500" : ""}`}
                    />
                    {errs.contact && <p className="text-[11px] text-rose-500">{errs.contact}</p>}
                </div>
            </div>
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Subject <span className="text-rose-500">*</span></Label>
                <Input
                    value={data.subject}
                    onChange={(e) => onChange("subject", e.target.value)}
                    placeholder="Brief description of the issue"
                    className={`h-10 rounded-none ${errs.subject ? "border-rose-500" : ""}`}
                />
                {errs.subject && <p className="text-[11px] text-rose-500">{errs.subject}</p>}
            </div>
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Description <span className="text-rose-500">*</span></Label>
                <Textarea
                    value={data.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Detailed description..."
                    className={`rounded-none border-slate-200 min-h-[90px] resize-none ${errs.description ? "border-rose-500" : ""}`}
                />
                {errs.description && <p className="text-[11px] text-rose-500">{errs.description}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Priority</Label>
                    <Select value={data.priority} onValueChange={(v) => onChange("priority", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Category</Label>
                    <Select value={data.category} onValueChange={(v) => onChange("category", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Billing">Billing</SelectItem>
                            <SelectItem value="Integration">Integration</SelectItem>
                            <SelectItem value="Feature Request">Feature Request</SelectItem>
                            <SelectItem value="Performance">Performance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Assign To</Label>
                    <Select value={data.agent} onValueChange={(v) => onChange("agent", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="John Doe">John Doe</SelectItem>
                            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                            <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                            <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                            <SelectItem value="Tom Brown">Tom Brown</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )

    return (
        <div className="px-8 py-8 space-y-6 bg-slate-50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Support <span className="text-blue-600">Tickets</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Manage, track, and resolve customer support inquiries with precision.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none h-11 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2" onClick={openCreate}>
                    <Plus className="h-5 w-5" /> Create Ticket
                </Button>
            </div>

            {/* Quick Stats - KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiCards.map((s, i) => {
                    const Icon = s.icon
                    return (
                        <Card key={i} className={`border rounded-none shadow-sm cursor-pointer hover:shadow-md transition ${s.bg}`} onClick={() => router.push(s.path)}>
                            <CardContent className="px-5 py-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`h-9 w-9 rounded-none flex items-center justify-center ${s.iconBg}`}>
                                        <Icon className={`h-4 w-4 ${s.text}`} />
                                    </div>
                                </div>
                                <p className="text-[12px] font-semibold text-slate-500 mb-0.5">{s.label}</p>
                                <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            placeholder="Search by subject, client, ID or agent..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-white border-slate-200 rounded-none text-sm font-outfit shadow-sm w-full"
                        />
                    </div>
                    <Button variant="outline" className="h-11 rounded-none px-4 font-bold gap-2 border-slate-200 bg-white" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4" /> Filters
                    </Button>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="h-11 px-4 rounded-none text-slate-500 hover:text-slate-800 font-bold gap-1.5 border border-slate-200 bg-white"
                        >
                            <X className="h-4 w-4" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Tickets List */}
            <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">
                                Support Queue
                            </CardTitle>
                            <Badge className="bg-blue-50 text-blue-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-none">
                                {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
                            </Badge>
                        </div>
                        <Button
                            variant="outline"
                            className="rounded-none h-9 px-4 font-bold font-outfit gap-2 border-slate-200 hover:bg-slate-50"
                            onClick={() => { setFilterStatus("all"); toast.success("Showing all tickets") }}
                        >
                            <Filter className="h-4 w-4" /> All Tickets
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-6 py-5">
                    {filteredTickets.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="h-16 w-16 rounded-none bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="h-7 w-7 text-slate-400" />
                            </div>
                            <p className="text-base font-bold text-slate-500 font-outfit">No tickets found</p>
                            <p className="text-sm text-slate-400 mt-1 font-outfit">Try adjusting your search or filter criteria</p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters} className="mt-4 rounded-none font-bold border-slate-200 gap-1.5">
                                    <X className="h-4 w-4" /> Clear All Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTickets.map((ticket) => (
                                <div key={ticket.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openView(ticket)}>
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="h-12 w-12 rounded-none flex items-center justify-center font-bold text-sm bg-white border border-slate-200 shadow-sm shrink-0 text-slate-700">
                                            {ticket.id.split('-')[1]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <span className="text-sm font-bold text-slate-900 tracking-tight">{ticket.id}</span>
                                                <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </Badge>
                                                <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-none">{ticket.category}</span>
                                            </div>
                                            <h3 className="text-[14px] font-bold text-slate-800 mb-1 truncate">{ticket.subject}</h3>
                                            <p className="text-[12px] font-medium text-slate-500 mb-2.5 line-clamp-1">{ticket.description}</p>
                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-medium text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-1.5 w-1.5 rounded-none bg-indigo-400" />
                                                    <span className="text-slate-600 font-bold">{ticket.client}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formatDate(ticket.created)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3 w-3" />
                                                    <span>Agent: <span className="text-slate-600 font-bold">{ticket.agent || "Unassigned"}</span></span>
                                                </div>
                                                {ticket.attachments > 0 && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Paperclip className="h-3 w-3" />
                                                        <span>{ticket.attachments} {ticket.attachments === 1 ? 'attachment' : 'attachments'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 md:mt-0 md:ml-4 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all"
                                            onClick={() => openView(ticket)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                                            onClick={() => openEdit(ticket)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all"
                                            onClick={() => handleDeleteTicket(ticket.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-none">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 rounded-none font-outfit shadow-lg border-slate-200">
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => openView(ticket)}>
                                                    <Eye className="h-4 w-4 text-blue-500" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => openEdit(ticket)}>
                                                    <Edit className="h-4 w-4 text-indigo-500" /> Edit Ticket
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleUpdateStatus(ticket.id, "In Progress")}>
                                                    <ArrowUpRight className="h-4 w-4 text-amber-500" /> Mark In Progress
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleUpdateStatus(ticket.id, "Resolved")}>
                                                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Mark Resolved
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleUpdateStatus(ticket.id, "Closed")}>
                                                    <X className="h-4 w-4 text-slate-500" /> Close Ticket
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="gap-2 font-medium cursor-pointer rounded-none text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    onClick={() => handleDeleteTicket(ticket.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete Ticket
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-blue-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Create New Ticket</SheetTitle>
                        <p className="text-[12px] text-slate-500">Submit a new support request.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <FormFields data={form} errs={errors} onChange={setField} />
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={handleCreateTicket}>Create Ticket</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Edit Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Edit Ticket</SheetTitle>
                        <p className="text-[12px] text-slate-500">Update ticket information.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <FormFields data={form} errs={errors} onChange={setField} />
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleEditTicket}>Save Changes</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* View Sheet */}
            <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">Ticket Details</SheetTitle>
                    </SheetHeader>
                    {selectedTicket && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-slate-900">{selectedTicket.id}</span>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority}</Badge>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</Badge>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Subject</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedTicket.subject}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Description</p>
                                    <p className="text-sm font-medium text-slate-700">{selectedTicket.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Client</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedTicket.client}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Contact</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedTicket.contact || ""}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Category</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedTicket.category}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Agent</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedTicket.agent || "Unassigned"}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Created</p>
                                        <p className="text-sm font-bold text-slate-900">{formatDate(selectedTicket.created)}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Updated</p>
                                        <p className="text-sm font-bold text-slate-900">{formatDate(selectedTicket.updated)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsViewOpen(false); openEdit(selectedTicket) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteTicket(selectedTicket.id); setIsViewOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Tickets</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Priority</Label>
                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Priority</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Category</Label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Technical">Technical</SelectItem>
                                    <SelectItem value="Billing">Billing</SelectItem>
                                    <SelectItem value="Integration">Integration</SelectItem>
                                    <SelectItem value="Feature Request">Feature Request</SelectItem>
                                    <SelectItem value="Performance">Performance</SelectItem>
                                    <SelectItem value="General">General</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { clearFilters() }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
