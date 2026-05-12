"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Search, Plus, MoreVertical, AlertTriangle, Clock, ArrowUp, ArrowDown, CheckCircle,
    XCircle, Eye, Edit, Trash2, TrendingUp, X, Settings,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
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

const validators = {
    required: (v: string) => !v?.toString().trim() ? "Required" : "",
    minLen: (n: number) => (v: string) => v?.trim().length < n ? `Min ${n} chars` : "",
}

export default function Escalations() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [filterPriority, setFilterPriority] = React.useState("all")

    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const [isViewOpen, setIsViewOpen] = React.useState(false)
    const [isAddRuleOpen, setIsAddRuleOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)

    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selectedEsc, setSelectedEsc] = React.useState<Escalation | null>(null)

    const [form, setForm] = React.useState({
        ticketId: "", client: "", subject: "", reason: "",
        priority: "High", escalateTo: "", description: "", status: "Active"
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const [newRule, setNewRule] = React.useState({ name: "", trigger: "", action: "", timeframe: "" })
    const [ruleErrors, setRuleErrors] = React.useState<Record<string, string>>({})

    const [escalations, setEscalations] = React.useState<Escalation[]>([
        { id: "ESC-001", ticketId: "TK-005", client: "Enterprise Co", subject: "Critical System Outage", reason: "SLA Breach", priority: "Critical", status: "Active", escalatedBy: "Tom Brown", escalatedTo: "Senior Manager", escalatedAt: "2024-02-26T09:00:00Z", expectedResolution: "2024-02-26T15:00:00Z", description: "System completely down affecting all users", updates: 3 },
        { id: "ESC-002", ticketId: "TK-001", client: "Acme Corp", subject: "Login Authentication Issues", reason: "Customer Complaint", priority: "High", status: "In Progress", escalatedBy: "John Doe", escalatedTo: "Technical Lead", escalatedAt: "2024-02-25T14:30:00Z", expectedResolution: "2024-02-26T18:00:00Z", description: "Multiple users reporting login failures", updates: 5 },
        { id: "ESC-003", ticketId: "TK-003", client: "Global Solutions", subject: "Data Sync Problems", reason: "Technical Complexity", priority: "High", status: "Resolved", escalatedBy: "Mike Johnson", escalatedTo: "Development Team", escalatedAt: "2024-02-24T11:00:00Z", expectedResolution: "2024-02-25T17:00:00Z", description: "Data synchronization failing between systems", updates: 7 },
        { id: "ESC-004", ticketId: "TK-007", client: "Innovation Labs", subject: "Performance Degradation", reason: "SLA Breach", priority: "Medium", status: "Active", escalatedBy: "Sarah Wilson", escalatedTo: "Infrastructure Team", escalatedAt: "2024-02-26T08:15:00Z", expectedResolution: "2024-02-27T12:00:00Z", description: "Application response times exceeding acceptable limits", updates: 2 }
    ])

    const [escalationRules, setEscalationRules] = React.useState<EscalationRule[]>([
        { id: "RULE-001", name: "Critical Priority Auto-Escalation", trigger: "Priority = Critical", action: "Escalate To Senior Manager", timeframe: "Immediate", status: "Active" },
        { id: "RULE-002", name: "SLA Breach Escalation", trigger: "Response Time > SLA Threshold", action: "Escalate To Team Lead", timeframe: "15 Minutes After Breach", status: "Active" },
        { id: "RULE-003", name: "Customer VIP Escalation", trigger: "Client Tier = Enterprise", action: "Escalate To Account Manager", timeframe: "1 Hour", status: "Active" },
        { id: "RULE-004", name: "Unresolved Ticket Escalation", trigger: "Ticket Age > 24 Hours", action: "Escalate To Senior Support", timeframe: "Daily Review", status: "Inactive" }
    ])

    const activeCount = escalations.filter(e => e.status === "Active").length
    const resolvedCount = escalations.filter(e => e.status === "Resolved").length
    const resolutionRate = escalations.length ? Math.round((resolvedCount / escalations.length) * 100) : 0

    const escalationMetrics = [
        {
            title: "Active Escalations", value: activeCount.toString(),
            change: "+3", trend: "up",
            icon: <AlertTriangle className="h-4 w-4 text-rose-600" />,
            bg: "bg-rose-50", border: "border-rose-100",
            cardBg: "bg-gradient-to-br from-rose-50 to-rose-100/60 border-rose-200/80",
            path: "/client-management/support/tickets"
        },
        {
            title: "Avg Resolution Time", value: "6.2h",
            change: "-1.2h", trend: "down",
            icon: <Clock className="h-4 w-4 text-blue-600" />,
            bg: "bg-blue-50", border: "border-blue-100",
            cardBg: "bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/80",
            path: "/client-management/support/sla"
        },
        {
            title: "Escalation Rate", value: "7.3%",
            change: "+0.5%", trend: "up",
            icon: <ArrowUp className="h-4 w-4 text-amber-600" />,
            bg: "bg-amber-50", border: "border-amber-100",
            cardBg: "bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200/80",
            path: "/client-management/analytics/performance"
        },
        {
            title: "Resolution Rate", value: `${resolutionRate}%`,
            change: "+4%", trend: "up",
            icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
            bg: "bg-emerald-50", border: "border-emerald-100",
            cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/80",
            path: "/client-management/support/overview"
        }
    ]

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
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

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.ticketId = validators.required(form.ticketId)
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.reason = validators.required(form.reason)
        errs.escalateTo = validators.required(form.escalateTo)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ ticketId: "", client: "", subject: "", reason: "", priority: "High", escalateTo: "", description: "", status: "Active" })
        setErrors({})
        setIsCreateOpen(true)
    }

    const openEdit = (esc: Escalation) => {
        setEditingId(esc.id)
        setForm({
            ticketId: esc.ticketId, client: esc.client, subject: esc.subject,
            reason: esc.reason, priority: esc.priority, escalateTo: esc.escalatedTo,
            description: esc.description, status: esc.status
        })
        setErrors({})
        setIsEditOpen(true)
    }

    const openView = (esc: Escalation) => { setSelectedEsc(esc); setIsViewOpen(true) }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setEscalations(escalations.map(e => e.id === editingId ? {
                ...e,
                ticketId: form.ticketId,
                client: form.client,
                subject: form.subject,
                reason: form.reason,
                priority: form.priority,
                escalatedTo: form.escalateTo,
                description: form.description,
                status: form.status,
            } : e))
            setIsEditOpen(false)
            toast.success("Escalation updated")
        } else {
            const escalation: Escalation = {
                id: `ESC-${String(escalations.length + 1).padStart(3, '0')}`,
                ticketId: form.ticketId,
                client: form.client || "Unknown Client",
                subject: form.subject || "Escalated Issue",
                reason: form.reason,
                priority: form.priority,
                status: "Active",
                escalatedBy: "Current User",
                escalatedTo: form.escalateTo,
                escalatedAt: new Date().toISOString(),
                expectedResolution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                description: form.description,
                updates: 0
            }
            setEscalations([escalation, ...escalations])
            setIsCreateOpen(false)
            toast.success("Escalation created")
        }
    }

    const handleDelete = (id: string) => {
        setEscalations(escalations.filter(e => e.id !== id))
        toast.success("Escalation deleted")
    }

    const handleUpdateStatus = (id: string, status: string) => {
        setEscalations(escalations.map(e => e.id === id ? { ...e, status } : e))
        toast.success(`Marked as ${status}`)
    }

    const validateRule = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(newRule.name) || validators.minLen(2)(newRule.name)
        errs.trigger = validators.required(newRule.trigger)
        errs.action = validators.required(newRule.action)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setRuleErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleAddRule = () => {
        if (!validateRule()) { toast.error("Please correct the highlighted fields"); return }
        const rule: EscalationRule = {
            id: `RULE-${String(escalationRules.length + 1).padStart(3, '0')}`,
            ...newRule,
            status: "Active"
        }
        setEscalationRules([...escalationRules, rule])
        setNewRule({ name: "", trigger: "", action: "", timeframe: "" })
        setRuleErrors({})
        setIsAddRuleOpen(false)
        toast.success("Escalation rule added")
    }

    const handleToggleRule = (id: string) => {
        setEscalationRules(escalationRules.map(r =>
            r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
        ))
        toast.success("Rule status toggled")
    }

    const handleDeleteRule = (id: string) => {
        setEscalationRules(escalationRules.filter(r => r.id !== id))
        toast.success("Rule deleted")
    }

    const setRuleField = (field: string, value: any) => {
        setNewRule(prev => ({ ...prev, [field]: value }))
        if (ruleErrors[field]) setRuleErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const FormFields = () => (
        <>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Ticket ID <span className="text-rose-500">*</span></Label>
                    <Input
                        value={form.ticketId}
                        onChange={(e) => setField("ticketId", e.target.value)}
                        placeholder="e.g., TK-001"
                        className={`h-10 rounded-none ${errors.ticketId ? "border-rose-500" : ""}`}
                    />
                    {errors.ticketId && <p className="text-[11px] text-rose-500">{errors.ticketId}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Client <span className="text-rose-500">*</span></Label>
                    <Input
                        value={form.client}
                        onChange={(e) => setField("client", e.target.value)}
                        placeholder="Client name"
                        className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`}
                    />
                    {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                </div>
            </div>
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Subject</Label>
                <Input
                    value={form.subject}
                    onChange={(e) => setField("subject", e.target.value)}
                    placeholder="Brief escalation subject"
                    className="h-10 rounded-none"
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Escalation Reason <span className="text-rose-500">*</span></Label>
                <Select value={form.reason} onValueChange={(v) => setField("reason", v)}>
                    <SelectTrigger className={`h-10 rounded-none ${errors.reason ? "border-rose-500" : ""}`}><SelectValue placeholder="Select reason" /></SelectTrigger>
                    <SelectContent className="rounded-none">
                        <SelectItem value="SLA Breach">SLA Breach</SelectItem>
                        <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                        <SelectItem value="Technical Complexity">Technical Complexity</SelectItem>
                        <SelectItem value="Resource Unavailable">Resource Unavailable</SelectItem>
                        <SelectItem value="Management Request">Management Request</SelectItem>
                    </SelectContent>
                </Select>
                {errors.reason && <p className="text-[11px] text-rose-500">{errors.reason}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Priority</Label>
                    <Select value={form.priority} onValueChange={(v) => setField("priority", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Escalate To <span className="text-rose-500">*</span></Label>
                    <Select value={form.escalateTo} onValueChange={(v) => setField("escalateTo", v)}>
                        <SelectTrigger className={`h-10 rounded-none ${errors.escalateTo ? "border-rose-500" : ""}`}><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="Team Lead">Team Lead</SelectItem>
                            <SelectItem value="Senior Manager">Senior Manager</SelectItem>
                            <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                            <SelectItem value="Development Team">Development Team</SelectItem>
                            <SelectItem value="Infrastructure Team">Infrastructure Team</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.escalateTo && <p className="text-[11px] text-rose-500">{errors.escalateTo}</p>}
                </div>
            </div>
            {editingId && (
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Status</Label>
                    <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Description</Label>
                <Textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className="rounded-none border-slate-200 resize-none"
                    rows={3}
                    placeholder="Detailed description of the escalation..."
                />
            </div>
        </>
    )

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
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none h-11 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2" onClick={openCreate}>
                    <Plus className="h-5 w-5" /> Create Escalation
                </Button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {escalationMetrics.map((metric, index) => (
                    <Card key={index} className={`border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 rounded-none cursor-pointer ${metric.cardBg}`} onClick={() => router.push(metric.path)}>
                        <CardContent className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-9 w-9 rounded-none flex items-center justify-center ${metric.bg} border ${metric.border} shadow-sm`}>
                                    {metric.icon}
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-none bg-white/70 border ${metric.trend === 'up' ? 'border-rose-100' : 'border-emerald-100'}`}>
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
                <TabsList className="bg-white border border-slate-200 p-1 rounded-none h-12 w-fit font-outfit shadow-sm">
                    <TabsTrigger value="active" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Active Escalations</TabsTrigger>
                    <TabsTrigger value="rules" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Escalation Rules</TabsTrigger>
                    <TabsTrigger value="history" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">History</TabsTrigger>
                </TabsList>

                {/* Active Escalations Tab */}
                <TabsContent value="active" className="space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Search escalations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-white border-slate-200 rounded-none text-sm font-outfit shadow-sm"
                            />
                        </div>
                        <Button variant="outline" className="h-11 rounded-none px-4 font-bold gap-2 border-slate-200 bg-white" onClick={() => setIsFilterOpen(true)}>
                            <Settings className="h-4 w-4" /> Filters
                        </Button>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={() => { setFilterStatus("all"); setFilterPriority("all"); setSearchQuery(""); toast.success("Filters cleared") }} className="h-11 px-4 rounded-none font-bold border border-slate-200 bg-white text-slate-500 gap-1.5">
                                <X className="h-4 w-4" /> Clear
                            </Button>
                        )}
                    </div>

                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Active Escalations</CardTitle>
                                    <Badge className="bg-rose-50 text-rose-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-none">
                                        {filteredEscalations.length} {filteredEscalations.length === 1 ? 'escalation' : 'escalations'}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            {filteredEscalations.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="h-14 w-14 rounded-none bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <AlertTriangle className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-500">No escalations found</p>
                                    <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredEscalations.map((escalation) => (
                                        <div key={escalation.id} className="group flex flex-col p-5 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openView(escalation)}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-none flex items-center justify-center font-bold text-sm bg-white border border-slate-200 shadow-sm shrink-0 text-slate-700">
                                                        {escalation.id.split('-')[1]}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-bold text-slate-900">{escalation.id}</span>
                                                            <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getPriorityColor(escalation.priority)}`}>{escalation.priority}</Badge>
                                                            <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(escalation.status)}`}>{escalation.status}</Badge>
                                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-none">Ticket: {escalation.ticketId}</span>
                                                        </div>
                                                        <h3 className="text-[14px] font-bold text-slate-800">{escalation.subject}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        variant="outline" size="icon"
                                                        className="h-9 w-9 rounded-none border-slate-200 text-emerald-500 hover:text-emerald-700 hover:border-emerald-200"
                                                        onClick={() => handleUpdateStatus(escalation.id, "Resolved")}
                                                        title="Mark Resolved"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline" size="icon"
                                                        className="h-9 w-9 rounded-none border-slate-200 text-rose-500 hover:text-rose-700 hover:border-rose-200"
                                                        onClick={() => handleUpdateStatus(escalation.id, "Closed")}
                                                        title="Close Escalation"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52 rounded-none font-outfit shadow-lg border-slate-200">
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => openView(escalation)}>
                                                                <Eye className="h-4 w-4 text-blue-500" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => openEdit(escalation)}>
                                                                <Edit className="h-4 w-4 text-indigo-500" /> Edit Escalation
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleUpdateStatus(escalation.id, "In Progress")}>
                                                                <TrendingUp className="h-4 w-4 text-amber-500" /> Mark In Progress
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleUpdateStatus(escalation.id, "Resolved")}>
                                                                <CheckCircle className="h-4 w-4 text-emerald-500" /> Mark Resolved
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="gap-2 font-medium cursor-pointer rounded-none text-red-600 focus:text-red-600 focus:bg-red-50"
                                                                onClick={() => handleDelete(escalation.id)}
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
                                                    {getTimeRemaining(escalation.expectedResolution)} remaining
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
                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Escalation Rules</CardTitle>
                                    <Badge className="bg-blue-50 text-blue-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-none">{escalationRules.length} rules</Badge>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none h-9 px-4 font-bold font-outfit gap-2 shadow-sm" onClick={() => setIsAddRuleOpen(true)}>
                                    <Plus className="h-4 w-4" /> Add Rule
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            <div className="space-y-4">
                                {escalationRules.map((rule) => (
                                    <div key={rule.id} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-bold text-slate-900">{rule.name}</span>
                                                <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
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
                                                className={`h-9 w-9 rounded-none border-slate-200 transition-all ${rule.status === 'Active' ? 'text-emerald-500 hover:text-emerald-700 hover:border-emerald-200' : 'text-slate-400 hover:text-emerald-500'}`}
                                                onClick={() => handleToggleRule(rule.id)}
                                                title={rule.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            >
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline" size="icon"
                                                className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all"
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
                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Escalation History</CardTitle>
                                <Badge className="bg-emerald-50 text-emerald-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-none">
                                    {escalations.filter(e => e.status === 'Resolved' || e.status === 'Closed').length} resolved
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            {escalations.filter(e => e.status === 'Resolved' || e.status === 'Closed').length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="h-14 w-14 rounded-none bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-500">No resolved escalations yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {escalations.filter(e => e.status === 'Resolved' || e.status === 'Closed').map((escalation) => (
                                        <div key={escalation.id} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openView(escalation)}>
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-none flex items-center justify-center font-bold text-lg bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm shrink-0">
                                                    OK
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-slate-900">{escalation.id}</span>
                                                        <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(escalation.status)}`}>{escalation.status}</Badge>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-none">Ticket: {escalation.ticketId}</span>
                                                    </div>
                                                    <p className="text-[14px] font-bold text-slate-700">{escalation.subject} <span className="text-slate-500 font-medium">{escalation.client}</span></p>
                                                    <div className="flex gap-4 text-[11px] font-medium text-slate-400 mt-1">
                                                        <span>Escalated: {formatDate(escalation.escalatedAt)}</span>
                                                        <span>Resolved: {formatDate(escalation.expectedResolution)}</span>
                                                        <span>{escalation.updates} updates</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-none" onClick={(e) => { e.stopPropagation(); openView(escalation) }}>
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

            {/* Create Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-rose-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Create Escalation</SheetTitle>
                        <p className="text-[12px] text-slate-500">Escalate a ticket for prioritized resolution.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <FormFields />
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={handleSave}>Create Escalation</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Edit Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Edit Escalation</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <FormFields />
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>Save Changes</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* View Sheet */}
            <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold">Escalation Details</SheetTitle>
                    </SheetHeader>
                    {selectedEsc && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-slate-900">{selectedEsc.id}</span>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getPriorityColor(selectedEsc.priority)}`}>{selectedEsc.priority}</Badge>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(selectedEsc.status)}`}>{selectedEsc.status}</Badge>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Subject</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedEsc.subject}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Description</p>
                                    <p className="text-sm font-medium text-slate-700">{selectedEsc.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Client</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedEsc.client}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Ticket</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedEsc.ticketId}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Escalated By</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedEsc.escalatedBy}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Escalated To</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedEsc.escalatedTo}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Reason</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedEsc.reason}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Updates</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedEsc.updates} updates</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsViewOpen(false); openEdit(selectedEsc) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selectedEsc.id); setIsViewOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Add Rule Sheet */}
            <Sheet open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-blue-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Add Escalation Rule</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Rule Name <span className="text-rose-500">*</span></Label>
                            <Input
                                value={newRule.name}
                                onChange={(e) => setRuleField("name", e.target.value)}
                                placeholder="e.g., Critical Priority Auto-Escalation"
                                className={`h-10 rounded-none ${ruleErrors.name ? "border-rose-500" : ""}`}
                            />
                            {ruleErrors.name && <p className="text-[11px] text-rose-500">{ruleErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Trigger Condition <span className="text-rose-500">*</span></Label>
                            <Input
                                value={newRule.trigger}
                                onChange={(e) => setRuleField("trigger", e.target.value)}
                                placeholder="e.g., Priority = Critical"
                                className={`h-10 rounded-none ${ruleErrors.trigger ? "border-rose-500" : ""}`}
                            />
                            {ruleErrors.trigger && <p className="text-[11px] text-rose-500">{ruleErrors.trigger}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Action <span className="text-rose-500">*</span></Label>
                            <Input
                                value={newRule.action}
                                onChange={(e) => setRuleField("action", e.target.value)}
                                placeholder="e.g., Escalate To Senior Manager"
                                className={`h-10 rounded-none ${ruleErrors.action ? "border-rose-500" : ""}`}
                            />
                            {ruleErrors.action && <p className="text-[11px] text-rose-500">{ruleErrors.action}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Timeframe</Label>
                            <Input
                                value={newRule.timeframe}
                                onChange={(e) => setRuleField("timeframe", e.target.value)}
                                placeholder="e.g., Immediate, 15 minutes"
                                className="h-10 rounded-none"
                            />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsAddRuleOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={handleAddRule}>Add Rule</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Escalations</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
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
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterStatus("all"); setFilterPriority("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
