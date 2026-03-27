"use client"

import React, { useState } from 'react'
import { Search, Plus, MoreVertical, AlertTriangle, Clock, ArrowUp, ArrowDown, CheckCircle, XCircle, Eye, Edit, Trash2, TrendingUp, X, Settings } from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/utils/toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

type Escalation = {
    id: string
    ticketId: string
    client: string
    subject: string
    reason: string
    priority: string
    status: string
    escalatedBy: string
    escalatedTo: string
    escalatedAt: string
    expectedResolution: string
    description: string
    updates: number
}

type EscalationRule = {
    id: string
    name: string
    trigger: string
    action: string
    timeframe: string
    status: string
}

export default function Escalations() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isAddRuleOpen, setIsAddRuleOpen] = useState(false)
    const [selectedEsc, setSelectedEsc] = useState<Escalation | null>(null)

    const [newEscalation, setNewEscalation] = useState({
        ticketId: "",
        client: "",
        subject: "",
        reason: "",
        priority: "High",
        escalateTo: "",
        description: ""
    })

    const [newRule, setNewRule] = useState({ name: "", trigger: "", action: "", timeframe: "" })

    const [escalations, setEscalations] = useState<Escalation[]>([
        {
            id: "ESC-001",
            ticketId: "TK-005",
            client: "Enterprise Co",
            subject: "Critical System Outage",
            reason: "Sla Breach",
            priority: "Critical",
            status: "Active",
            escalatedBy: "Tom Brown",
            escalatedTo: "Senior Manager",
            escalatedAt: "2024-02-26T09:00:00Z",
            expectedResolution: "2024-02-26T15:00:00Z",
            description: "System completely down affecting all users",
            updates: 3
        },
        {
            id: "ESC-002",
            ticketId: "TK-001",
            client: "Acme Corp",
            subject: "Login Authentication Issues",
            reason: "Customer Complaint",
            priority: "High",
            status: "In Progress",
            escalatedBy: "John Doe",
            escalatedTo: "Technical Lead",
            escalatedAt: "2024-02-25T14:30:00Z",
            expectedResolution: "2024-02-26T18:00:00Z",
            description: "Multiple users reporting login failures",
            updates: 5
        },
        {
            id: "ESC-003",
            ticketId: "TK-003",
            client: "Global Solutions",
            subject: "Data Sync Problems",
            reason: "Technical Complexity",
            priority: "High",
            status: "Resolved",
            escalatedBy: "Mike Johnson",
            escalatedTo: "Development Team",
            escalatedAt: "2024-02-24T11:00:00Z",
            expectedResolution: "2024-02-25T17:00:00Z",
            description: "Data synchronization failing between systems",
            updates: 7
        },
        {
            id: "ESC-004",
            ticketId: "TK-007",
            client: "Innovation Labs",
            subject: "Performance Degradation",
            reason: "Sla Breach",
            priority: "Medium",
            status: "Active",
            escalatedBy: "Sarah Wilson",
            escalatedTo: "Infrastructure Team",
            escalatedAt: "2024-02-26T08:15:00Z",
            expectedResolution: "2024-02-27T12:00:00Z",
            description: "Application response times exceeding acceptable limits",
            updates: 2
        }
    ])

    const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([
        { id: "RULE-001", name: "Critical Priority Auto-Escalation", trigger: "Priority = Critical", action: "Escalate To Senior Manager", timeframe: "Immediate", status: "Active" },
        { id: "RULE-002", name: "Sla Breach Escalation", trigger: "Response Time > Sla Threshold", action: "Escalate To Team Lead", timeframe: "15 Minutes After Breach", status: "Active" },
        { id: "RULE-003", name: "Customer Vip Escalation", trigger: "Client Tier = Enterprise", action: "Escalate To Account Manager", timeframe: "1 Hour", status: "Active" },
        { id: "RULE-004", name: "Unresolved Ticket Escalation", trigger: "Ticket Age > 24 Hours", action: "Escalate To Senior Support", timeframe: "Daily Review", status: "Inactive" }
    ])

    // Dynamic metrics
    const activeCount = escalations.filter(e => e.status === "Active").length
    const resolvedCount = escalations.filter(e => e.status === "Resolved").length
    const resolutionRate = Math.round((resolvedCount / escalations.length) * 100)

    const escalationMetrics = [
        {
            title: "Active Escalations",
            value: activeCount.toString(),
            change: "+3",
            trend: "up",
            icon: <AlertTriangle className="h-4 w-4 text-rose-600" />,
            bg: "bg-rose-50", border: "border-rose-100",
            cardBg: "bg-gradient-to-br from-rose-50 to-rose-100/60 border-rose-200/80"
        },
        {
            title: "Avg Resolution Time",
            value: "6.2h",
            change: "-1.2h",
            trend: "down",
            icon: <Clock className="h-4 w-4 text-blue-600" />,
            bg: "bg-blue-50", border: "border-blue-100",
            cardBg: "bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/80"
        },
        {
            title: "Escalation Rate",
            value: "7.3%",
            change: "+0.5%",
            trend: "up",
            icon: <ArrowUp className="h-4 w-4 text-amber-600" />,
            bg: "bg-amber-50", border: "border-amber-100",
            cardBg: "bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200/80"
        },
        {
            title: "Resolution Rate",
            value: `${resolutionRate}%`,
            change: "+4%",
            trend: "up",
            icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
            bg: "bg-emerald-50", border: "border-emerald-100",
            cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/80"
        }
    ]

    const formatDate = (dateString: string) => {
        if (!dateString) return "—"
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
            case 'Active': return 'bg-red-100 text-red-700'
            case 'In Progress': return 'bg-orange-100 text-orange-700'
            case 'Resolved': return 'bg-emerald-100 text-emerald-700'
            case 'Closed': return 'bg-slate-100 text-slate-600'
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    const getTimeRemaining = (expectedResolution: string) => {
        const now = new Date()
        const target = new Date(expectedResolution)
        const diff = target.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        if (hours < 0) return "Overdue"
        if (hours < 1) return "< 1h"
        return `${hours}h`
    }

    const hasActiveFilters = filterStatus !== "all" || filterPriority !== "all" || searchQuery !== ""

    const filteredEscalations = escalations.filter(e => {
        const matchesSearch =
            e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === "all" || e.status === filterStatus
        const matchesPriority = filterPriority === "all" || e.priority === filterPriority
        return matchesSearch && matchesStatus && matchesPriority
    })

    const handleCreateEscalation = () => {
        if (!newEscalation.ticketId || !newEscalation.reason || !newEscalation.escalateTo) {
            toast.error("Please fill in all required fields")
            return
        }
        const escalation: Escalation = {
            id: `ESC-${String(escalations.length + 1).padStart(3, '0')}`,
            ticketId: newEscalation.ticketId,
            client: newEscalation.client || "Unknown Client",
            subject: newEscalation.subject || "Escalated Issue",
            reason: newEscalation.reason,
            priority: newEscalation.priority,
            status: "Active",
            escalatedBy: "Current User",
            escalatedTo: newEscalation.escalateTo,
            escalatedAt: new Date().toISOString(),
            expectedResolution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            description: newEscalation.description,
            updates: 0
        }
        setEscalations([escalation, ...escalations])
        setNewEscalation({ ticketId: "", client: "", subject: "", reason: "", priority: "High", escalateTo: "", description: "" })
        setIsCreateOpen(false)
        toast.success("Escalation created successfully")
    }

    const handleEditEscalation = () => {
        if (!selectedEsc) return
        setEscalations(escalations.map(e => e.id === selectedEsc.id ? selectedEsc : e))
        setIsEditOpen(false)
        setSelectedEsc(null)
        toast.success("Escalation updated successfully")
    }

    const handleDeleteEscalation = (id: string) => {
        setEscalations(escalations.filter(e => e.id !== id))
        toast.success("Escalation deleted")
    }

    const handleUpdateStatus = (id: string, status: string) => {
        setEscalations(escalations.map(e => e.id === id ? { ...e, status } : e))
        toast.success(`Marked as ${status}`)
    }

    const handleAddRule = () => {
        if (!newRule.name || !newRule.trigger || !newRule.action) {
            toast.error("Please fill in all required fields")
            return
        }
        const rule: EscalationRule = {
            id: `RULE-${String(escalationRules.length + 1).padStart(3, '0')}`,
            ...newRule,
            status: "Active"
        }
        setEscalationRules([...escalationRules, rule])
        setNewRule({ name: "", trigger: "", action: "", timeframe: "" })
        setIsAddRuleOpen(false)
        toast.success("Escalation rule added")
    }

    const handleToggleRule = (id: string) => {
        setEscalationRules(escalationRules.map(r =>
            r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
        ))
    }

    const handleDeleteRule = (id: string) => {
        setEscalationRules(escalationRules.filter(r => r.id !== id))
        toast.success("Rule deleted")
    }

    const openView = (esc: Escalation) => { setSelectedEsc(esc); setIsViewOpen(true) }
    const openEdit = (esc: Escalation) => { setSelectedEsc({ ...esc }); setIsEditOpen(true) }

    return (
        <div className="px-8 py-8 space-y-6 bg-slate-50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Support <span className="text-blue-600">Escalations</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Manage ticket escalations and resolution workflows efficiently.
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2">
                            <Plus className="h-5 w-5" /> Create Escalation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900">Create New Escalation</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Ticket Id <span className="text-red-500">*</span></Label>
                                    <Input value={newEscalation.ticketId} onChange={(e) => setNewEscalation({ ...newEscalation, ticketId: e.target.value })} placeholder="e.g., TK-001" className="h-11 rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Client</Label>
                                    <Input value={newEscalation.client} onChange={(e) => setNewEscalation({ ...newEscalation, client: e.target.value })} placeholder="Client name" className="h-11 rounded-xl border-slate-200" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Subject</Label>
                                <Input value={newEscalation.subject} onChange={(e) => setNewEscalation({ ...newEscalation, subject: e.target.value })} placeholder="Brief escalation subject" className="h-11 rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Escalation Reason <span className="text-red-500">*</span></Label>
                                <Select value={newEscalation.reason} onValueChange={(v) => setNewEscalation({ ...newEscalation, reason: v })}>
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select reason" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sla Breach">Sla Breach</SelectItem>
                                        <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                                        <SelectItem value="Technical Complexity">Technical Complexity</SelectItem>
                                        <SelectItem value="Resource Unavailable">Resource Unavailable</SelectItem>
                                        <SelectItem value="Management Request">Management Request</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Priority</Label>
                                    <Select value={newEscalation.priority} onValueChange={(v) => setNewEscalation({ ...newEscalation, priority: v })}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Escalate To <span className="text-red-500">*</span></Label>
                                    <Select value={newEscalation.escalateTo} onValueChange={(v) => setNewEscalation({ ...newEscalation, escalateTo: v })}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Team Lead">Team Lead</SelectItem>
                                            <SelectItem value="Senior Manager">Senior Manager</SelectItem>
                                            <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                                            <SelectItem value="Development Team">Development Team</SelectItem>
                                            <SelectItem value="Infrastructure Team">Infrastructure Team</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Description</Label>
                                <Textarea value={newEscalation.description} onChange={(e) => setNewEscalation({ ...newEscalation, description: e.target.value })} className="rounded-xl border-slate-200 resize-none" rows={3} placeholder="Detailed description of the escalation..." />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1 h-11 rounded-xl font-bold border-slate-200">Cancel</Button>
                                <Button onClick={handleCreateEscalation} className="flex-1 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">Create Escalation</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {escalationMetrics.map((metric, index) => (
                    <Card key={index} className={`border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${metric.cardBg}`}>
                        <CardContent className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${metric.bg} border ${metric.border} shadow-sm`}>
                                    {metric.icon}
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 border ${metric.trend === 'up' ? 'border-rose-100' : 'border-emerald-100'}`}>
                                    {metric.trend === 'up' ? (
                                        <ArrowUp className="h-3 w-3 text-rose-600" />
                                    ) : (
                                        <ArrowDown className="h-3 w-3 text-emerald-600" />
                                    )}
                                    <span className={`text-[11px] font-bold ${metric.trend === 'up' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {metric.change}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[12px] font-semibold text-slate-500 font-outfit mb-0.5">{metric.title}</p>
                            <h3 className="text-xl font-bold text-slate-900 font-outfit tracking-tight">{metric.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="active" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12 w-fit font-outfit shadow-sm">
                    <TabsTrigger value="active" className="px-6 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Active Escalations</TabsTrigger>
                    <TabsTrigger value="rules" className="px-6 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Escalation Rules</TabsTrigger>
                    <TabsTrigger value="history" className="px-6 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">History</TabsTrigger>
                </TabsList>

                {/* Active Escalations Tab */}
                <TabsContent value="active" className="space-y-4">
                    {/* Filters Row */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Search escalations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm font-outfit shadow-sm"
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="h-11 w-44 bg-white border-slate-200 rounded-xl text-sm font-outfit shadow-sm">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="h-11 w-40 bg-white border-slate-200 rounded-xl text-sm font-outfit shadow-sm">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={() => { setFilterStatus("all"); setFilterPriority("all"); setSearchQuery("") }} className="h-11 px-4 rounded-xl font-bold border border-slate-200 bg-white text-slate-500 gap-1.5">
                                <X className="h-4 w-4" /> Clear
                            </Button>
                        )}
                    </div>

                    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Active Escalations</CardTitle>
                                    <Badge className="bg-rose-50 text-rose-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">
                                        {filteredEscalations.length} {filteredEscalations.length === 1 ? 'escalation' : 'escalations'}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            {filteredEscalations.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <AlertTriangle className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-500">No escalations found</p>
                                    <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredEscalations.map((escalation) => (
                                        <div key={escalation.id} className="group flex flex-col p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm bg-white border border-slate-200 shadow-sm shrink-0 text-slate-700">
                                                        {escalation.id.split('-')[1]}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-bold text-slate-900">{escalation.id}</span>
                                                            <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getPriorityColor(escalation.priority)}`}>{escalation.priority}</Badge>
                                                            <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getStatusColor(escalation.status)}`}>{escalation.status}</Badge>
                                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-lg">Ticket: {escalation.ticketId}</span>
                                                        </div>
                                                        <h3 className="text-[14px] font-bold text-slate-800">{escalation.subject}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Button
                                                        variant="outline" size="icon"
                                                        className="h-9 w-9 rounded-xl border-slate-200 text-emerald-500 hover:text-emerald-700 hover:border-emerald-200"
                                                        onClick={() => handleUpdateStatus(escalation.id, "Resolved")}
                                                        title="Mark Resolved"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline" size="icon"
                                                        className="h-9 w-9 rounded-xl border-slate-200 text-rose-500 hover:text-rose-700 hover:border-rose-200"
                                                        onClick={() => handleUpdateStatus(escalation.id, "Closed")}
                                                        title="Close Escalation"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-xl">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52 rounded-xl font-outfit shadow-lg border-slate-200">
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => openView(escalation)}>
                                                                <Eye className="h-4 w-4 text-blue-500" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => openEdit(escalation)}>
                                                                <Edit className="h-4 w-4 text-indigo-500" /> Edit Escalation
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => handleUpdateStatus(escalation.id, "In Progress")}>
                                                                <TrendingUp className="h-4 w-4 text-amber-500" /> Mark In Progress
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => handleUpdateStatus(escalation.id, "Resolved")}>
                                                                <CheckCircle className="h-4 w-4 text-emerald-500" /> Mark Resolved
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="gap-2 font-medium cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                                                                onClick={() => handleDeleteEscalation(escalation.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                            <p className="text-[12px] font-medium text-slate-500 mb-3 ml-15 pl-1">{escalation.description}</p>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] font-medium text-slate-400">
                                                <span className="text-slate-600 font-bold">{escalation.client}</span>
                                                <span>Reason: <span className="text-slate-600 font-bold">{escalation.reason}</span></span>
                                                <span>To: <span className="text-slate-600 font-bold">{escalation.escalatedTo}</span></span>
                                                <span>By: <span className="text-slate-600 font-bold">{escalation.escalatedBy}</span></span>
                                                <span className={`font-bold ${getTimeRemaining(escalation.expectedResolution) === 'Overdue' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    ⏱ {getTimeRemaining(escalation.expectedResolution)} remaining
                                                </span>
                                                <span>{escalation.updates} updates</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Escalation Rules Tab */}
                <TabsContent value="rules" className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Escalation Rules</CardTitle>
                                    <Badge className="bg-blue-50 text-blue-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">{escalationRules.length} rules</Badge>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-4 font-bold font-outfit gap-2 shadow-sm" onClick={() => setIsAddRuleOpen(true)}>
                                    <Plus className="h-4 w-4" /> Add Rule
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            <div className="space-y-4">
                                {escalationRules.map((rule) => (
                                    <div key={rule.id} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-bold text-slate-900">{rule.name}</span>
                                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {rule.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-x-8 gap-y-1 text-[12px] font-medium text-slate-500">
                                                <span>Trigger: <span className="text-slate-700 font-bold">{rule.trigger}</span></span>
                                                <span>Action: <span className="text-slate-700 font-bold">{rule.action}</span></span>
                                                <span>Timeframe: <span className="text-slate-700 font-bold">{rule.timeframe}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="outline" size="icon"
                                                className={`h-9 w-9 rounded-xl border-slate-200 transition-all ${rule.status === 'Active' ? 'text-emerald-500 hover:text-emerald-700 hover:border-emerald-200' : 'text-slate-400 hover:text-emerald-500'}`}
                                                onClick={() => handleToggleRule(rule.id)}
                                                title={rule.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            >
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline" size="icon"
                                                className="h-9 w-9 rounded-xl border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all"
                                                onClick={() => handleDeleteRule(rule.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Escalation History</CardTitle>
                                <Badge className="bg-emerald-50 text-emerald-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">
                                    {escalations.filter(e => e.status === 'Resolved' || e.status === 'Closed').length} resolved
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            {escalations.filter(e => e.status === 'Resolved' || e.status === 'Closed').length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-500">No resolved escalations yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {escalations.filter(e => e.status === 'Resolved' || e.status === 'Closed').map((escalation) => (
                                        <div key={escalation.id} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm shrink-0">
                                                    ✓
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-slate-900">{escalation.id}</span>
                                                        <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getStatusColor(escalation.status)}`}>{escalation.status}</Badge>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-lg">Ticket: {escalation.ticketId}</span>
                                                    </div>
                                                    <p className="text-[14px] font-bold text-slate-700">{escalation.subject} — <span className="text-slate-500 font-medium">{escalation.client}</span></p>
                                                    <div className="flex gap-4 text-[11px] font-medium text-slate-400 mt-1">
                                                        <span>Escalated: {formatDate(escalation.escalatedAt)}</span>
                                                        <span>Resolved: {formatDate(escalation.expectedResolution)}</span>
                                                        <span>{escalation.updates} updates</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-xl" onClick={() => openView(escalation)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* View Escalation Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-lg font-outfit rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Escalation Details</DialogTitle>
                    </DialogHeader>
                    {selectedEsc && (
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">{selectedEsc.id}</span>
                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getPriorityColor(selectedEsc.priority)}`}>{selectedEsc.priority}</Badge>
                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getStatusColor(selectedEsc.status)}`}>{selectedEsc.status}</Badge>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 mb-1">Subject</p>
                                <p className="text-sm font-bold text-slate-900">{selectedEsc.subject}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 mb-1">Description</p>
                                <p className="text-sm font-medium text-slate-700">{selectedEsc.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Client</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedEsc.client}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Ticket</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedEsc.ticketId}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Escalated By</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedEsc.escalatedBy}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Escalated To</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedEsc.escalatedTo}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Reason</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedEsc.reason}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Updates</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedEsc.updates} updates</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold border-slate-200" onClick={() => setIsViewOpen(false)}>Close</Button>
                                <Button className="flex-1 h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setIsViewOpen(false); openEdit(selectedEsc) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Escalation Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md font-outfit rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Edit Escalation</DialogTitle>
                    </DialogHeader>
                    {selectedEsc && (
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Client</Label>
                                    <Input value={selectedEsc.client} onChange={(e) => setSelectedEsc({ ...selectedEsc, client: e.target.value })} className="h-11 rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Subject</Label>
                                    <Input value={selectedEsc.subject} onChange={(e) => setSelectedEsc({ ...selectedEsc, subject: e.target.value })} className="h-11 rounded-xl border-slate-200" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Priority</Label>
                                    <Select value={selectedEsc.priority} onValueChange={(v) => setSelectedEsc({ ...selectedEsc, priority: v })}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Status</Label>
                                    <Select value={selectedEsc.status} onValueChange={(v) => setSelectedEsc({ ...selectedEsc, status: v })}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Escalated To</Label>
                                <Select value={selectedEsc.escalatedTo} onValueChange={(v) => setSelectedEsc({ ...selectedEsc, escalatedTo: v })}>
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Team Lead">Team Lead</SelectItem>
                                        <SelectItem value="Senior Manager">Senior Manager</SelectItem>
                                        <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                                        <SelectItem value="Development Team">Development Team</SelectItem>
                                        <SelectItem value="Infrastructure Team">Infrastructure Team</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Description</Label>
                                <Textarea value={selectedEsc.description} onChange={(e) => setSelectedEsc({ ...selectedEsc, description: e.target.value })} className="rounded-xl border-slate-200 resize-none" rows={3} />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1 h-11 rounded-xl font-bold border-slate-200">Cancel</Button>
                                <Button onClick={handleEditEscalation} className="flex-1 h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">Save Changes</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Rule Dialog */}
            <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
                <DialogContent className="max-w-md font-outfit rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Add Escalation Rule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-sm">Rule Name <span className="text-red-500">*</span></Label>
                            <Input value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g., Critical Priority Auto-Escalation" className="h-11 rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-sm">Trigger Condition <span className="text-red-500">*</span></Label>
                            <Input value={newRule.trigger} onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })} placeholder="e.g., Priority = Critical" className="h-11 rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-sm">Action <span className="text-red-500">*</span></Label>
                            <Input value={newRule.action} onChange={(e) => setNewRule({ ...newRule, action: e.target.value })} placeholder="e.g., Escalate To Senior Manager" className="h-11 rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-sm">Timeframe</Label>
                            <Input value={newRule.timeframe} onChange={(e) => setNewRule({ ...newRule, timeframe: e.target.value })} placeholder="e.g., Immediate, 15 minutes" className="h-11 rounded-xl border-slate-200" />
                        </div>
                        <div className="flex gap-3 pt-1">
                            <Button variant="outline" onClick={() => setIsAddRuleOpen(false)} className="flex-1 h-11 rounded-xl font-bold border-slate-200">Cancel</Button>
                            <Button onClick={handleAddRule} className="flex-1 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">Add Rule</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
