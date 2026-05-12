"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Search, Plus, Filter, MoreVertical, Clock, AlertTriangle, CheckCircle, Users,
    TrendingUp, TrendingDown, X, Eye, Edit, Trash2, ArrowUpRight, Sparkles,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
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
    subject: string
    priority: string
    status: string
    agent: string
    created: string
    description?: string
}

const validators = {
    required: (v: string) => !v?.toString().trim() ? "Required" : "",
    minLen: (n: number) => (v: string) => v?.trim().length < n ? `Min ${n} chars` : "",
}

export default function SupportOverview() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterPriority, setFilterPriority] = React.useState("all")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const [isViewOpen, setIsViewOpen] = React.useState(false)
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const [activeTicket, setActiveTicket] = React.useState<Ticket | null>(null)

    const [form, setForm] = React.useState({
        client: "", subject: "", priority: "Medium", agent: "", description: ""
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const [tickets, setTickets] = React.useState<Ticket[]>([
        { id: "TK-001", client: "Acme Corp", subject: "Login Issues", priority: "High", status: "Open", agent: "John Doe", created: "2 hours ago", description: "Users unable to login." },
        { id: "TK-002", client: "TechStart Inc", subject: "API Integration", priority: "Medium", status: "In Progress", agent: "Jane Smith", created: "4 hours ago", description: "REST API help needed." },
        { id: "TK-003", client: "Global Solutions", subject: "Billing Query", priority: "Low", status: "Resolved", agent: "Mike Johnson", created: "6 hours ago", description: "Question about invoice." },
        { id: "TK-004", client: "Innovation Labs", subject: "Feature Request", priority: "Medium", status: "Open", agent: "Sarah Wilson", created: "8 hours ago", description: "Dashboard analytics request." },
        { id: "TK-005", client: "Enterprise Co", subject: "Performance Issue", priority: "High", status: "Escalated", agent: "Tom Brown", created: "1 day ago", description: "Slow response time." }
    ])

    const teamPerformance = [
        { name: "John Doe", tickets: 45, resolved: 42, satisfaction: 4.9 },
        { name: "Jane Smith", tickets: 38, resolved: 36, satisfaction: 4.7 },
        { name: "Mike Johnson", tickets: 52, resolved: 48, satisfaction: 4.8 },
        { name: "Sarah Wilson", tickets: 41, resolved: 39, satisfaction: 4.6 },
        { name: "Tom Brown", tickets: 35, resolved: 33, satisfaction: 4.9 }
    ]

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-700'
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
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.agent.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority
        const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
        return matchesSearch && matchesPriority && matchesStatus
    })

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.subject = validators.required(form.subject) || validators.minLen(3)(form.subject)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setForm({ client: "", subject: "", priority: "Medium", agent: "", description: "" })
        setErrors({})
        setIsCreateOpen(true)
    }

    const handleCreateTicket = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const ticket: Ticket = {
            id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
            client: form.client.trim(),
            subject: form.subject.trim(),
            priority: form.priority,
            status: "Open",
            agent: form.agent || "Unassigned",
            created: "Just now",
            description: form.description
        }
        setTickets([ticket, ...tickets])
        setIsCreateOpen(false)
        toast.success("Ticket created")
    }

    const handleDeleteTicket = (id: string) => {
        setTickets(tickets.filter(t => t.id !== id))
        toast.success("Ticket removed")
    }

    const handleUpdateStatus = (id: string, status: string) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status } : t))
        toast.success(`Marked as ${status}`)
    }

    const handleEditSave = () => {
        if (!activeTicket) return
        if (!activeTicket.client?.trim() || !activeTicket.subject?.trim()) {
            toast.error("Client and Subject are required"); return
        }
        setTickets(tickets.map(t => t.id === activeTicket.id ? activeTicket : t))
        setIsEditOpen(false)
        setActiveTicket(null)
        toast.success("Ticket updated")
    }

    const supportMetrics = [
        {
            title: "Active Tickets",
            value: tickets.filter(t => t.status !== "Resolved").length.toString(),
            change: "+12%", trend: "up",
            icon: <Clock className="h-5 w-5 text-blue-600" />,
            bg: "bg-blue-50", border: "border-blue-100",
            cardBg: "bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/80",
            path: "/client-management/support/tickets"
        },
        {
            title: "Avg Response Time",
            value: "2.4h", change: "-8%", trend: "down",
            icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
            bg: "bg-amber-50", border: "border-amber-100",
            cardBg: "bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200/80",
            path: "/client-management/support/sla"
        },
        {
            title: "Resolution Rate",
            value: `${Math.round((tickets.filter(t => t.status === "Resolved").length / tickets.length) * 100)}%`,
            change: "+3%", trend: "up",
            icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
            bg: "bg-emerald-50", border: "border-emerald-100",
            cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/80",
            path: "/client-management/analytics/performance"
        },
        {
            title: "Customer Satisfaction",
            value: "4.8/5", change: "+0.2", trend: "up",
            icon: <Users className="h-5 w-5 text-violet-600" />,
            bg: "bg-violet-50", border: "border-violet-100",
            cardBg: "bg-gradient-to-br from-violet-50 to-violet-100/60 border-violet-200/80",
            path: "/client-management/customers/segments"
        }
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Support <span className="text-blue-600">Overview</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Monitor support metrics, team bandwidth, and customer satisfaction KPIs.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 w-64 bg-white border-slate-200 rounded-none text-sm font-outfit shadow-sm"
                        />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none h-11 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2" onClick={openCreate}>
                        <Plus className="h-5 w-5" /> New Ticket
                    </Button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {supportMetrics.map((metric, index) => (
                    <Card key={index} className={`border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 rounded-none cursor-pointer ${metric.cardBg}`} onClick={() => router.push(metric.path)}>
                        <CardContent className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-9 w-9 rounded-none flex items-center justify-center ${metric.bg} border ${metric.border} shadow-sm`}>
                                    {React.cloneElement(metric.icon as React.ReactElement, { className: "h-4 w-4" })}
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-none bg-white/70 border ${metric.trend === 'up' ? 'border-emerald-100' : 'border-rose-100'}`}>
                                    {metric.trend === 'up' ? (
                                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-rose-600" />
                                    )}
                                    <span className={`text-[11px] font-bold ${metric.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
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

            {/* Main Content Tabs */}
            <Tabs defaultValue="tickets" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1 rounded-none h-12 w-fit font-outfit shadow-sm">
                    <TabsTrigger value="tickets" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Recent Tickets</TabsTrigger>
                    <TabsTrigger value="performance" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Team Performance</TabsTrigger>
                    <TabsTrigger value="analytics" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Analytics</TabsTrigger>
                </TabsList>

                {/* Recent Tickets Tab */}
                <TabsContent value="tickets" className="space-y-6">
                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Recent Support Tickets</CardTitle>
                                    <Badge className="bg-blue-50 text-blue-700 border-0 font-bold text-[11px] rounded-none">{filteredTickets.length} tickets</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                                        <SelectTrigger className="h-9 w-32 rounded-none border-slate-200 text-sm font-outfit font-bold">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            <SelectItem value="all">All Priority</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="h-9 w-36 rounded-none border-slate-200 text-sm font-outfit font-bold">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                            <SelectItem value="Escalated">Escalated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {(filterPriority !== "all" || filterStatus !== "all" || searchQuery) && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-none text-slate-400 hover:text-slate-700"
                                            onClick={() => { setFilterPriority("all"); setFilterStatus("all"); setSearchQuery("") }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            {filteredTickets.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="h-14 w-14 rounded-none bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <Filter className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-500 font-outfit">No tickets match your filters</p>
                                    <p className="text-sm text-slate-400 mt-1 font-outfit">Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredTickets.map((ticket) => (
                                        <div key={ticket.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => { setActiveTicket(ticket); setIsViewOpen(true) }}>
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-none flex items-center justify-center font-bold text-sm bg-white border border-slate-200 shadow-sm text-slate-700">
                                                    {ticket.id.split('-')[1]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-slate-900 tracking-tight">{ticket.id}</span>
                                                        <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getPriorityColor(ticket.priority)}`}>
                                                            {ticket.priority}
                                                        </Badge>
                                                        <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[13px] font-bold text-slate-700 font-outfit">{ticket.subject} <span className="font-medium text-slate-500">{ticket.client}</span></p>
                                                    <p className="text-[11px] font-medium text-slate-400 font-outfit mt-0.5">Assigned to <span className="text-slate-600">{ticket.agent}</span> {ticket.created}</p>
                                                </div>
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-blue-600 transition-colors rounded-none">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-none shadow-lg border-slate-200 font-outfit">
                                                        <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => { setActiveTicket(ticket); setIsViewOpen(true) }}>
                                                            <Eye className="h-4 w-4 text-blue-500" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => { setActiveTicket({ ...ticket }); setIsEditOpen(true) }}>
                                                            <Edit className="h-4 w-4 text-indigo-500" /> Edit Ticket
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleUpdateStatus(ticket.id, "In Progress")}>
                                                            <ArrowUpRight className="h-4 w-4 text-amber-500" /> Mark In Progress
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleUpdateStatus(ticket.id, "Resolved")}>
                                                            <CheckCircle className="h-4 w-4 text-emerald-500" /> Mark Resolved
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
                </TabsContent>

                {/* Team Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Team Performance Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {teamPerformance.map((member, index) => (
                                    <div key={index} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-none hover:shadow-sm transition-all cursor-pointer" onClick={() => { toast.success(`Viewing ${member.name}`); router.push('/client-management/analytics/performance') }}>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-blue-50 border border-blue-100 rounded-none flex items-center justify-center shadow-inner">
                                                <span className="text-sm font-bold text-blue-600 tracking-tight">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 tracking-tight">{member.name}</p>
                                                <p className="text-[11px] font-medium text-slate-500 font-outfit mt-0.5">
                                                    {member.tickets} tickets <span className="text-blue-600">{member.resolved} resolved</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-900 tracking-tight">{member.satisfaction}/5</p>
                                                <p className="text-[10px] font-semibold text-slate-400 font-outfit">Satisfaction</p>
                                            </div>
                                            <Progress value={(member.resolved / member.tickets) * 100} className="w-24 h-2 bg-slate-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden cursor-pointer" onClick={() => router.push('/client-management/support/sla')}>
                            <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">SLA Compliance Tracking</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-5">
                                <div className="space-y-6">
                                    {[
                                        { label: "Response Time SLA", value: 96 },
                                        { label: "Resolution Time SLA", value: 89 },
                                        { label: "First Contact Resolution", value: 78 }
                                    ].map((sla, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-[13px] font-bold text-slate-600 font-outfit">{sla.label}</span>
                                                <span className="text-[13px] font-bold text-slate-900 font-outfit">{sla.value}%</span>
                                            </div>
                                            <Progress value={sla.value} className="h-2.5 bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Ticket Volume Trends</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-5">
                                <div className="space-y-4">
                                    {[
                                        { period: 'Today', count: 23, trend: '+4' },
                                        { period: 'This Week', count: 156, trend: '+12' },
                                        { period: 'This Month', count: 642, trend: '+45' },
                                        { period: 'Avg Per Day', count: 21, trend: '-2' }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all">
                                            <span className="text-[13px] font-bold text-slate-500 font-outfit">{stat.period}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-base font-bold text-slate-900 font-outfit">{stat.count} tickets</span>
                                                <Badge className={`text-[10px] font-bold border-0 px-2 py-0.5 rounded-none ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {stat.trend}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Create Ticket Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-blue-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Create New Ticket</SheetTitle>
                        <p className="text-[12px] text-slate-500">Open a new support ticket for a client.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client Name <span className="text-rose-500">*</span></Label>
                            <Input
                                placeholder="e.g. Acme Corp"
                                value={form.client}
                                onChange={(e) => setField("client", e.target.value)}
                                className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`}
                            />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Subject <span className="text-rose-500">*</span></Label>
                            <Input
                                placeholder="Brief description of the issue"
                                value={form.subject}
                                onChange={(e) => setField("subject", e.target.value)}
                                className={`h-10 rounded-none ${errors.subject ? "border-rose-500" : ""}`}
                            />
                            {errors.subject && <p className="text-[11px] text-rose-500">{errors.subject}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Priority</Label>
                                <Select value={form.priority} onValueChange={(v) => setField("priority", v)}>
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
                                <Label className="text-[12px] font-semibold">Assigned Agent</Label>
                                <Input
                                    placeholder="Agent name"
                                    value={form.agent}
                                    onChange={(e) => setField("agent", e.target.value)}
                                    className="h-10 rounded-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Description</Label>
                            <Textarea
                                placeholder="Describe the issue in detail..."
                                value={form.description}
                                onChange={(e) => setField("description", e.target.value)}
                                className="rounded-none border-slate-200 resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={handleCreateTicket}>
                            Create Ticket
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* View Ticket Sheet */}
            <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">Ticket Details</SheetTitle>
                    </SheetHeader>
                    {activeTicket && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-slate-900">{activeTicket.id}</span>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getPriorityColor(activeTicket.priority)}`}>{activeTicket.priority}</Badge>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(activeTicket.status)}`}>{activeTicket.status}</Badge>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Subject</p>
                                    <p className="text-sm font-bold text-slate-900">{activeTicket.subject}</p>
                                </div>
                                {activeTicket.description && (
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Description</p>
                                        <p className="text-sm font-medium text-slate-700">{activeTicket.description}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Client</p>
                                        <p className="text-sm font-bold text-slate-900">{activeTicket.client}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Agent</p>
                                        <p className="text-sm font-bold text-slate-900">{activeTicket.agent}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Created</p>
                                        <p className="text-sm font-bold text-slate-900">{activeTicket.created}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsViewOpen(false); setActiveTicket({ ...activeTicket }); setIsEditOpen(true) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteTicket(activeTicket.id); setIsViewOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Edit Ticket Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">Edit Ticket</SheetTitle>
                    </SheetHeader>
                    {activeTicket && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[12px] font-semibold">Client Name</Label>
                                    <Input
                                        value={activeTicket.client}
                                        onChange={(e) => setActiveTicket({ ...activeTicket, client: e.target.value })}
                                        className={`h-10 rounded-none ${!activeTicket.client?.trim() ? "border-rose-500" : ""}`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[12px] font-semibold">Subject</Label>
                                    <Input
                                        value={activeTicket.subject}
                                        onChange={(e) => setActiveTicket({ ...activeTicket, subject: e.target.value })}
                                        className={`h-10 rounded-none ${!activeTicket.subject?.trim() ? "border-rose-500" : ""}`}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[12px] font-semibold">Priority</Label>
                                        <Select value={activeTicket.priority} onValueChange={(v) => setActiveTicket({ ...activeTicket, priority: v })}>
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
                                        <Label className="text-[12px] font-semibold">Status</Label>
                                        <Select value={activeTicket.status} onValueChange={(v) => setActiveTicket({ ...activeTicket, status: v })}>
                                            <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-none">
                                                <SelectItem value="Open">Open</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Resolved">Resolved</SelectItem>
                                                <SelectItem value="Escalated">Escalated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[12px] font-semibold">Assigned Agent</Label>
                                    <Input
                                        value={activeTicket.agent}
                                        onChange={(e) => setActiveTicket({ ...activeTicket, agent: e.target.value })}
                                        className="h-10 rounded-none"
                                    />
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={handleEditSave}>Save Changes</Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
