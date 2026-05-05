"use client"

import React, { useState } from 'react'
import { Search, Plus, Filter, MoreVertical, Clock, User, Paperclip, Eye, Edit, Trash2, X, CheckCircle, ArrowUpRight, AlertTriangle } from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
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

export default function SupportTickets() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")
    const [filterCategory, setFilterCategory] = useState("all")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: "TK-001",
            client: "Acme Corp",
            contact: "john@acme.com",
            subject: "Login Issues",
            description: "Users unable to login to the system after the latest update. Multiple users affected.",
            priority: "High",
            status: "Open",
            agent: "John Doe",
            created: "2024-02-26T10:00:00Z",
            updated: "2024-02-26T14:30:00Z",
            category: "Technical",
            attachments: 2
        },
        {
            id: "TK-002",
            client: "TechStart Inc",
            contact: "sarah@techstart.com",
            subject: "Api Integration Help",
            description: "Need assistance with REST API integration for payment gateway.",
            priority: "Medium",
            status: "In Progress",
            agent: "Jane Smith",
            created: "2024-02-26T08:00:00Z",
            updated: "2024-02-26T12:00:00Z",
            category: "Integration",
            attachments: 1
        },
        {
            id: "TK-003",
            client: "Global Solutions",
            contact: "mike@global.com",
            subject: "Billing Query",
            description: "Question about monthly billing charges and invoice discrepancy.",
            priority: "Low",
            status: "Resolved",
            agent: "Mike Johnson",
            created: "2024-02-25T16:00:00Z",
            updated: "2024-02-26T09:00:00Z",
            category: "Billing",
            attachments: 0
        },
        {
            id: "TK-004",
            client: "Innovation Labs",
            contact: "lisa@innovation.com",
            subject: "Feature Request",
            description: "Request for new dashboard analytics features and export functionality.",
            priority: "Medium",
            status: "Open",
            agent: "Sarah Wilson",
            created: "2024-02-25T14:00:00Z",
            updated: "2024-02-25T14:00:00Z",
            category: "Feature Request",
            attachments: 3
        },
        {
            id: "TK-005",
            client: "Enterprise Co",
            contact: "tom@enterprise.com",
            subject: "Performance Issue",
            description: "System running slowly during peak hours, response time exceeds 10 seconds.",
            priority: "High",
            status: "Escalated",
            agent: "Tom Brown",
            created: "2024-02-25T10:00:00Z",
            updated: "2024-02-26T11:00:00Z",
            category: "Performance",
            attachments: 1
        }
    ])

    const [newTicket, setNewTicket] = useState({
        client: "",
        contact: "",
        subject: "",
        description: "",
        priority: "Medium",
        category: "General",
        agent: ""
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700'
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
            case 'Escalated': return 'bg-red-100 text-red-700'
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
    }

    const handleCreateTicket = () => {
        if (!newTicket.client || !newTicket.subject || !newTicket.description) {
            toast.error("Please fill in all required fields")
            return
        }
        const ticket: Ticket = {
            id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
            ...newTicket,
            status: "Open",
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            attachments: 0
        }
        setTickets([ticket, ...tickets])
        setNewTicket({ client: "", contact: "", subject: "", description: "", priority: "Medium", category: "General", agent: "" })
        setIsCreateDialogOpen(false)
        toast.success("Ticket created successfully")
    }

    const handleEditTicket = () => {
        if (!selectedTicket) return
        setTickets(tickets.map(t =>
            t.id === selectedTicket.id ? { ...selectedTicket, updated: new Date().toISOString() } : t
        ))
        setIsEditDialogOpen(false)
        setSelectedTicket(null)
        toast.success("Ticket updated successfully")
    }

    const handleDeleteTicket = (ticketId: string) => {
        setTickets(tickets.filter(t => t.id !== ticketId))
        toast.success("Ticket deleted successfully")
    }

    const handleUpdateStatus = (ticketId: string, status: string) => {
        setTickets(tickets.map(t =>
            t.id === ticketId ? { ...t, status, updated: new Date().toISOString() } : t
        ))
        toast.success(`Ticket marked as ${status}`)
    }

    const openView = (ticket: Ticket) => { setSelectedTicket(ticket); setIsViewDialogOpen(true) }
    const openEdit = (ticket: Ticket) => { setSelectedTicket({ ...ticket }); setIsEditDialogOpen(true) }

    // Stats computed from tickets
    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === "Open").length,
        inProgress: tickets.filter(t => t.status === "In Progress").length,
        resolved: tickets.filter(t => t.status === "Resolved").length,
    }

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
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2">
                            <Plus className="h-5 w-5" /> Create Ticket
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">Create New Ticket</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-5 py-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Client <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={newTicket.client}
                                        onChange={(e) => setNewTicket({ ...newTicket, client: e.target.value })}
                                        placeholder="Client name"
                                        className="rounded-xl border-slate-200 h-11"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Contact Email</Label>
                                    <Input
                                        value={newTicket.contact}
                                        onChange={(e) => setNewTicket({ ...newTicket, contact: e.target.value })}
                                        placeholder="contact@client.com"
                                        className="rounded-xl border-slate-200 h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Subject <span className="text-red-500">*</span></Label>
                                <Input
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    placeholder="Brief description of the issue"
                                    className="rounded-xl border-slate-200 h-11"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Description <span className="text-red-500">*</span></Label>
                                <Textarea
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    placeholder="Detailed description of the issue..."
                                    className="rounded-xl border-slate-200 min-h-[90px] resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Priority</Label>
                                    <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })}>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-11"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Category</Label>
                                    <Select value={newTicket.category} onValueChange={(v) => setNewTicket({ ...newTicket, category: v })}>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-11"><SelectValue /></SelectTrigger>
                                        <SelectContent>
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
                                    <Label className="font-bold text-slate-700 text-sm">Assign To</Label>
                                    <Select value={newTicket.agent} onValueChange={(v) => setNewTicket({ ...newTicket, agent: v })}>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="John Doe">John Doe</SelectItem>
                                            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                                            <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                                            <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                                            <SelectItem value="Tom Brown">Tom Brown</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1 rounded-xl h-11 font-bold border-slate-200">
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateTicket} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-bold shadow-lg shadow-blue-600/20">
                                    Create Ticket
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Tickets", value: stats.total, bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" },
                    { label: "Open", value: stats.open, bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700" },
                    { label: "In Progress", value: stats.inProgress, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700" },
                    { label: "Resolved", value: stats.resolved, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700" },
                ].map((s, i) => (
                    <Card key={i} className={`${s.bg} border ${s.border} shadow-sm`}>
                        <CardContent className="px-5 py-4">
                            <p className="text-[12px] font-semibold text-slate-500 mb-0.5">{s.label}</p>
                            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                        </CardContent>
                    </Card>
                ))}
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
                            className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm font-outfit shadow-sm w-full"
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-11 w-40 bg-white border-slate-200 rounded-xl text-sm font-outfit shadow-sm">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Escalated">Escalated</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="h-11 w-40 bg-white border-slate-200 rounded-xl text-sm font-outfit shadow-sm">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="h-11 w-44 bg-white border-slate-200 rounded-xl text-sm font-outfit shadow-sm">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Billing">Billing</SelectItem>
                            <SelectItem value="Integration">Integration</SelectItem>
                            <SelectItem value="Feature Request">Feature Request</SelectItem>
                            <SelectItem value="Performance">Performance</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="h-11 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-bold gap-1.5 border border-slate-200 bg-white"
                        >
                            <X className="h-4 w-4" /> Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Tickets List */}
            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden">
                <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">
                                Support Queue
                            </CardTitle>
                            <Badge className="bg-blue-50 text-blue-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">
                                {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
                            </Badge>
                        </div>
                        <Button
                            variant="outline"
                            className="rounded-xl h-9 px-4 font-bold font-outfit gap-2 border-slate-200 hover:bg-slate-50"
                            onClick={() => setFilterStatus("all")}
                        >
                            <Filter className="h-4 w-4" /> All Tickets
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-6 py-5">
                    {filteredTickets.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="h-7 w-7 text-slate-400" />
                            </div>
                            <p className="text-base font-bold text-slate-500 font-outfit">No tickets found</p>
                            <p className="text-sm text-slate-400 mt-1 font-outfit">Try adjusting your search or filter criteria</p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters} className="mt-4 rounded-xl font-bold border-slate-200 gap-1.5">
                                    <X className="h-4 w-4" /> Clear All Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTickets.map((ticket) => (
                                <div key={ticket.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm bg-white border border-slate-200 shadow-sm shrink-0 text-slate-700">
                                            {ticket.id.split('-')[1]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <span className="text-sm font-bold text-slate-900 tracking-tight">{ticket.id}</span>
                                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </Badge>
                                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-lg">{ticket.category}</span>
                                            </div>
                                            <h3 className="text-[14px] font-bold text-slate-800 mb-1 truncate">{ticket.subject}</h3>
                                            <p className="text-[12px] font-medium text-slate-500 mb-2.5 line-clamp-1">{ticket.description}</p>
                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-medium text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                                    <span className="text-slate-600 font-bold">{ticket.client}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formatDate(ticket.created)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3 w-3" />
                                                    <span>Agent: <span className="text-slate-600 font-bold">{ticket.agent}</span></span>
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
                                    <div className="flex items-center gap-2 mt-3 md:mt-0 md:ml-4 self-end md:self-center">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all"
                                            onClick={() => openView(ticket)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                                            onClick={() => openEdit(ticket)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all"
                                            onClick={() => handleDeleteTicket(ticket.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-xl">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 rounded-xl font-outfit shadow-lg border-slate-200">
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => openView(ticket)}>
                                                    <Eye className="h-4 w-4 text-blue-500" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => openEdit(ticket)}>
                                                    <Edit className="h-4 w-4 text-indigo-500" /> Edit Ticket
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => handleUpdateStatus(ticket.id, "In Progress")}>
                                                    <ArrowUpRight className="h-4 w-4 text-amber-500" /> Mark In Progress
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => handleUpdateStatus(ticket.id, "Resolved")}>
                                                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Mark Resolved
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => handleUpdateStatus(ticket.id, "Closed")}>
                                                    <X className="h-4 w-4 text-slate-500" /> Close Ticket
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="gap-2 font-medium cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
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

            {/* View Ticket Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[520px] font-outfit rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">Ticket Details</DialogTitle>
                    </DialogHeader>
                    {selectedTicket && (
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">{selectedTicket.id}</span>
                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority}</Badge>
                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</Badge>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 mb-1">Subject</p>
                                <p className="text-sm font-bold text-slate-900">{selectedTicket.subject}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 mb-1">Description</p>
                                <p className="text-sm font-medium text-slate-700">{selectedTicket.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Client</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedTicket.client}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Contact</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedTicket.contact || "—"}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Category</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedTicket.category}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Assigned Agent</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedTicket.agent || "Unassigned"}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Created</p>
                                    <p className="text-sm font-bold text-slate-900">{formatDate(selectedTicket.created)}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Last Updated</p>
                                    <p className="text-sm font-bold text-slate-900">{formatDate(selectedTicket.updated)}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" className="flex-1 rounded-xl h-11 font-bold border-slate-200" onClick={() => setIsViewDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button className="flex-1 rounded-xl h-11 font-bold bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setIsViewDialogOpen(false); openEdit(selectedTicket) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit Ticket
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Ticket Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] font-outfit rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">Edit Ticket</DialogTitle>
                    </DialogHeader>
                    {selectedTicket && (
                        <div className="grid gap-5 py-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Client</Label>
                                    <Input
                                        value={selectedTicket.client}
                                        onChange={(e) => setSelectedTicket({ ...selectedTicket, client: e.target.value })}
                                        className="rounded-xl border-slate-200 h-11"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Contact Email</Label>
                                    <Input
                                        value={selectedTicket.contact}
                                        onChange={(e) => setSelectedTicket({ ...selectedTicket, contact: e.target.value })}
                                        className="rounded-xl border-slate-200 h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Subject</Label>
                                <Input
                                    value={selectedTicket.subject}
                                    onChange={(e) => setSelectedTicket({ ...selectedTicket, subject: e.target.value })}
                                    className="rounded-xl border-slate-200 h-11"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Description</Label>
                                <Textarea
                                    value={selectedTicket.description}
                                    onChange={(e) => setSelectedTicket({ ...selectedTicket, description: e.target.value })}
                                    className="rounded-xl border-slate-200 min-h-[80px] resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Priority</Label>
                                    <Select value={selectedTicket.priority} onValueChange={(v) => setSelectedTicket({ ...selectedTicket, priority: v })}>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-11"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Status</Label>
                                    <Select value={selectedTicket.status} onValueChange={(v) => setSelectedTicket({ ...selectedTicket, status: v })}>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-11"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                            <SelectItem value="Escalated">Escalated</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Assign To</Label>
                                    <Select value={selectedTicket.agent} onValueChange={(v) => setSelectedTicket({ ...selectedTicket, agent: v })}>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-11"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="John Doe">John Doe</SelectItem>
                                            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                                            <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                                            <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                                            <SelectItem value="Tom Brown">Tom Brown</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1 rounded-xl h-11 font-bold border-slate-200">
                                    Cancel
                                </Button>
                                <Button onClick={handleEditTicket} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold shadow-lg">
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
