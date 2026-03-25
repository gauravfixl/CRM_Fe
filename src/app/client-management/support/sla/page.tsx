"use client"

import React, { useState } from 'react'
import { Search, Plus, MoreVertical, Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Settings, Edit, Trash2, Eye, X, ShieldCheck } from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

type SLAAgreement = {
    id: string
    name: string
    client: string
    priority: string
    responseTime: string
    resolutionTime: string
    availability: string
    status: string
    compliance: number
    lastBreach: string
    created: string
}

export default function SLAManagement() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateSLAOpen, setIsCreateSLAOpen] = useState(false)
    const [isEditSLAOpen, setIsEditSLAOpen] = useState(false)
    const [isViewSLAOpen, setIsViewSLAOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [selectedSLA, setSelectedSLA] = useState<SLAAgreement | null>(null)

    const [newSLA, setNewSLA] = useState({
        name: "",
        client: "",
        priority: "Medium",
        responseTime: "",
        resolutionTime: "",
        availability: ""
    })

    const [slaAgreements, setSlaAgreements] = useState<SLAAgreement[]>([
        {
            id: "SLA-001",
            name: "Enterprise Support",
            client: "Acme Corp",
            priority: "High",
            responseTime: "1 hour",
            resolutionTime: "4 hours",
            availability: "99.9%",
            status: "Active",
            compliance: 98,
            lastBreach: "2024-02-20",
            created: "2024-01-15"
        },
        {
            id: "SLA-002",
            name: "Standard Support",
            client: "TechStart Inc",
            priority: "Medium",
            responseTime: "4 hours",
            resolutionTime: "24 hours",
            availability: "99.5%",
            status: "Active",
            compliance: 95,
            lastBreach: "2024-02-18",
            created: "2024-01-20"
        },
        {
            id: "SLA-003",
            name: "Premium Support",
            client: "Global Solutions",
            priority: "High",
            responseTime: "30 minutes",
            resolutionTime: "2 hours",
            availability: "99.95%",
            status: "Active",
            compliance: 92,
            lastBreach: "2024-02-25",
            created: "2024-02-01"
        },
        {
            id: "SLA-004",
            name: "Basic Support",
            client: "Innovation Labs",
            priority: "Low",
            responseTime: "8 hours",
            resolutionTime: "48 hours",
            availability: "99.0%",
            status: "Active",
            compliance: 97,
            lastBreach: "2024-02-15",
            created: "2024-01-10"
        }
    ])

    const recentBreaches = [
        { id: "BR-001", client: "Global Solutions", sla: "Premium Support", type: "Response Time", target: "30 minutes", actual: "45 minutes", ticket: "TK-005", date: "2024-02-25T14:30:00Z", severity: "High" },
        { id: "BR-002", client: "Acme Corp", sla: "Enterprise Support", type: "Resolution Time", target: "4 hours", actual: "6 hours", ticket: "TK-003", date: "2024-02-20T10:15:00Z", severity: "Medium" },
        { id: "BR-003", client: "TechStart Inc", sla: "Standard Support", type: "Response Time", target: "4 hours", actual: "5.5 hours", ticket: "TK-001", date: "2024-02-18T16:20:00Z", severity: "Low" }
    ]

    // Dynamic metrics computed from agreements
    const avgCompliance = Math.round(slaAgreements.reduce((acc, s) => acc + s.compliance, 0) / slaAgreements.length)
    const activeCount = slaAgreements.filter(s => s.status === "Active").length

    const slaMetrics = [
        {
            title: "Overall Sla Compliance",
            value: `${avgCompliance}%`,
            change: "+2.1%",
            trend: "up",
            icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/80"
        },
        {
            title: "Avg Response Time",
            value: "2.4h",
            change: "-0.3h",
            trend: "down",
            icon: <Clock className="h-4 w-4 text-blue-600" />,
            bg: "bg-blue-50",
            border: "border-blue-100",
            cardBg: "bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/80"
        },
        {
            title: "Sla Breaches",
            value: recentBreaches.length.toString(),
            change: "-3",
            trend: "down",
            icon: <AlertTriangle className="h-4 w-4 text-rose-600" />,
            bg: "bg-rose-50",
            border: "border-rose-100",
            cardBg: "bg-gradient-to-br from-rose-50 to-rose-100/60 border-rose-200/80"
        },
        {
            title: "Active Agreements",
            value: activeCount.toString(),
            change: "+1",
            trend: "up",
            icon: <ShieldCheck className="h-4 w-4 text-violet-600" />,
            bg: "bg-violet-50",
            border: "border-violet-100",
            cardBg: "bg-gradient-to-br from-violet-50 to-violet-100/60 border-violet-200/80"
        }
    ]

    const formatDate = (dateString: string) => {
        if (!dateString) return "—"
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const getComplianceColor = (compliance: number) => {
        if (compliance >= 95) return 'text-emerald-600'
        if (compliance >= 90) return 'text-amber-600'
        return 'text-rose-600'
    }

    const getComplianceBg = (compliance: number) => {
        if (compliance >= 95) return 'bg-emerald-50 text-emerald-700'
        if (compliance >= 90) return 'bg-amber-50 text-amber-700'
        return 'bg-rose-50 text-rose-700'
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700'
            case 'Medium': return 'bg-amber-100 text-amber-700'
            case 'Low': return 'bg-green-100 text-green-700'
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'bg-red-100 text-red-700'
            case 'Medium': return 'bg-amber-100 text-amber-700'
            case 'Low': return 'bg-green-100 text-green-700'
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    const filteredSLAs = slaAgreements.filter(sla =>
        sla.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sla.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sla.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreateSLA = () => {
        if (!newSLA.name || !newSLA.client || !newSLA.responseTime || !newSLA.resolutionTime) {
            toast.error("Please fill in all required fields")
            return
        }
        const sla: SLAAgreement = {
            id: `SLA-${String(slaAgreements.length + 1).padStart(3, '0')}`,
            ...newSLA,
            status: "Active",
            compliance: 100,
            lastBreach: "",
            created: new Date().toISOString().split('T')[0]
        }
        setSlaAgreements([sla, ...slaAgreements])
        setNewSLA({ name: "", client: "", priority: "Medium", responseTime: "", resolutionTime: "", availability: "" })
        setIsCreateSLAOpen(false)
        toast.success("Sla agreement created successfully")
    }

    const handleEditSLA = () => {
        if (!selectedSLA) return
        setSlaAgreements(slaAgreements.map(s => s.id === selectedSLA.id ? selectedSLA : s))
        setIsEditSLAOpen(false)
        setSelectedSLA(null)
        toast.success("Sla agreement updated successfully")
    }

    const handleDeleteSLA = (id: string) => {
        setSlaAgreements(slaAgreements.filter(s => s.id !== id))
        toast.success("Sla agreement deleted")
    }

    const handleToggleStatus = (id: string) => {
        setSlaAgreements(slaAgreements.map(s =>
            s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
        ))
    }

    const openView = (sla: SLAAgreement) => { setSelectedSLA(sla); setIsViewSLAOpen(true) }
    const openEdit = (sla: SLAAgreement) => { setSelectedSLA({ ...sla }); setIsEditSLAOpen(true) }

    return (
        <div className="px-8 py-8 space-y-6 bg-slate-50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Sla <span className="text-blue-600">Management</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Monitor and manage service level agreements across all clients.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="rounded-xl h-11 px-5 font-bold font-outfit gap-2 border-slate-200 hover:bg-slate-50"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <Settings className="h-4 w-4" /> Sla Settings
                    </Button>
                    <Dialog open={isCreateSLAOpen} onOpenChange={setIsCreateSLAOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2">
                                <Plus className="h-5 w-5" /> New Sla
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md font-outfit rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-slate-900">Create Sla Agreement</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-2">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Sla Name <span className="text-red-500">*</span></Label>
                                    <Input value={newSLA.name} onChange={(e) => setNewSLA({ ...newSLA, name: e.target.value })} placeholder="e.g., Enterprise Support" className="h-11 rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Client <span className="text-red-500">*</span></Label>
                                    <Input value={newSLA.client} onChange={(e) => setNewSLA({ ...newSLA, client: e.target.value })} placeholder="Client name" className="h-11 rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Priority Level</Label>
                                    <Select value={newSLA.priority} onValueChange={(v) => setNewSLA({ ...newSLA, priority: v })}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-sm">Response Time <span className="text-red-500">*</span></Label>
                                        <Input value={newSLA.responseTime} onChange={(e) => setNewSLA({ ...newSLA, responseTime: e.target.value })} placeholder="e.g., 2 hours" className="h-11 rounded-xl border-slate-200" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-sm">Resolution Time <span className="text-red-500">*</span></Label>
                                        <Input value={newSLA.resolutionTime} onChange={(e) => setNewSLA({ ...newSLA, resolutionTime: e.target.value })} placeholder="e.g., 24 hours" className="h-11 rounded-xl border-slate-200" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Availability Target</Label>
                                    <Input value={newSLA.availability} onChange={(e) => setNewSLA({ ...newSLA, availability: e.target.value })} placeholder="e.g., 99.5%" className="h-11 rounded-xl border-slate-200" />
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <Button variant="outline" onClick={() => setIsCreateSLAOpen(false)} className="flex-1 h-11 rounded-xl font-bold border-slate-200">Cancel</Button>
                                    <Button onClick={handleCreateSLA} className="flex-1 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">Create Sla</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {slaMetrics.map((metric, index) => (
                    <Card key={index} className={`border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${metric.cardBg}`}>
                        <CardContent className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${metric.bg} border ${metric.border} shadow-sm`}>
                                    {metric.icon}
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 border ${metric.trend === 'up' ? 'border-emerald-100' : 'border-rose-100'}`}>
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

            {/* Main Content */}
            <Tabs defaultValue="agreements" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12 w-fit font-outfit shadow-sm">
                    <TabsTrigger value="agreements" className="px-6 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Sla Agreements</TabsTrigger>
                    <TabsTrigger value="breaches" className="px-6 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Recent Breaches</TabsTrigger>
                    <TabsTrigger value="reports" className="px-6 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Compliance Reports</TabsTrigger>
                </TabsList>

                {/* SLA Agreements Tab */}
                <TabsContent value="agreements" className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Active Sla Agreements</CardTitle>
                                    <Badge className="bg-blue-50 text-blue-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">{filteredSLAs.length} agreements</Badge>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search Slas..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-10 w-56 bg-slate-50 border-slate-200 rounded-xl text-sm font-outfit"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            {filteredSLAs.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <ShieldCheck className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-500">No Sla agreements found</p>
                                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredSLAs.map((sla) => (
                                        <div key={sla.id} className="group flex flex-col p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-slate-900">{sla.id}</span>
                                                        <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getPriorityColor(sla.priority)}`}>{sla.priority}</Badge>
                                                        <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${sla.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{sla.status}</Badge>
                                                    </div>
                                                    <h3 className="text-[15px] font-bold text-slate-800">
                                                        {sla.name} — <span className="text-slate-500 font-medium">{sla.client}</span>
                                                    </h3>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-xl">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl font-outfit shadow-lg border-slate-200">
                                                        <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => openView(sla)}>
                                                            <Eye className="h-4 w-4 text-blue-500" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => openEdit(sla)}>
                                                            <Edit className="h-4 w-4 text-indigo-500" /> Edit Agreement
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-lg" onClick={() => handleToggleStatus(sla.id)}>
                                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                            {sla.status === "Active" ? "Deactivate" : "Activate"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="gap-2 font-medium cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={() => handleDeleteSLA(sla.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="flex flex-wrap gap-x-8 gap-y-1 text-[12px] font-medium text-slate-500 mb-4">
                                                <span>Response: <span className="text-slate-700 font-bold">{sla.responseTime}</span></span>
                                                <span>Resolution: <span className="text-slate-700 font-bold">{sla.resolutionTime}</span></span>
                                                <span>Uptime: <span className="text-slate-700 font-bold">{sla.availability}</span></span>
                                                <span>Created: <span className="text-slate-700 font-bold">{formatDate(sla.created)}</span></span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[12px] font-bold text-slate-500">Compliance</span>
                                                <Progress value={sla.compliance} className="flex-1 h-2.5 bg-slate-100 max-w-xs" />
                                                <Badge className={`text-[11px] px-2.5 py-0.5 rounded-lg border-0 font-bold ${getComplianceBg(sla.compliance)}`}>{sla.compliance}%</Badge>
                                                {sla.lastBreach && (
                                                    <span className="text-[11px] font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">
                                                        Last breach: {formatDate(sla.lastBreach)}
                                                    </span>
                                                )}
                                                <div className="ml-auto flex gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100" onClick={() => openView(sla)}>
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100" onClick={() => openEdit(sla)}>
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100" onClick={() => handleDeleteSLA(sla.id)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Recent Breaches Tab */}
                <TabsContent value="breaches" className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Recent Sla Breaches</CardTitle>
                                <Badge className="bg-rose-50 text-rose-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">{recentBreaches.length} breaches</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            <div className="space-y-4">
                                {recentBreaches.map((breach) => (
                                    <div key={breach.id} className="flex items-center justify-between p-5 bg-rose-50/30 border border-rose-100 rounded-2xl hover:bg-rose-50/50 transition-all">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-rose-50 border border-rose-100 text-rose-600 shadow-sm shrink-0">
                                                !
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-slate-900">{breach.id}</span>
                                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getSeverityColor(breach.severity)}`}>{breach.severity}</Badge>
                                                    <span className="text-[11px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-lg">Ticket: {breach.ticket}</span>
                                                </div>
                                                <h3 className="text-[14px] font-bold text-slate-800 mb-1">
                                                    {breach.type} Breach — <span className="text-slate-500 font-medium">{breach.client}</span>
                                                </h3>
                                                <div className="flex flex-wrap gap-x-6 text-[12px] font-medium text-slate-500">
                                                    <span>Sla: <span className="text-slate-700 font-bold">{breach.sla}</span></span>
                                                    <span>Target: <span className="text-slate-700 font-bold">{breach.target}</span></span>
                                                    <span>Actual: <span className="text-rose-600 font-bold">{breach.actual}</span></span>
                                                    <span>Occurred: {formatDate(breach.date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-xl ml-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Compliance Reports Tab */}
                <TabsContent value="reports" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Monthly Compliance</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-5">
                                <div className="space-y-3">
                                    {[
                                        { month: 'February 2024', rate: 94.2 },
                                        { month: 'January 2024', rate: 92.1 },
                                        { month: 'December 2023', rate: 89.8 },
                                        { month: 'November 2023', rate: 95.5 },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
                                            <span className="text-[13px] font-bold text-slate-500 font-outfit">{item.month}</span>
                                            <div className="flex items-center gap-3">
                                                <Progress value={item.rate} className="w-28 h-2.5 bg-slate-100" />
                                                <Badge className={`text-[11px] px-2.5 py-0.5 rounded-lg border-0 font-bold ${getComplianceBg(item.rate)}`}>{item.rate}%</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Performance By Client</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-5">
                                <div className="space-y-3">
                                    {slaAgreements.map((sla, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-indigo-600">{sla.client.charAt(0)}</span>
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-600 font-outfit">{sla.client}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Progress value={sla.compliance} className="w-28 h-2.5 bg-slate-100" />
                                                <Badge className={`text-[11px] px-2.5 py-0.5 rounded-lg border-0 font-bold ${getComplianceBg(sla.compliance)}`}>{sla.compliance}%</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* View SLA Dialog */}
            <Dialog open={isViewSLAOpen} onOpenChange={setIsViewSLAOpen}>
                <DialogContent className="max-w-lg font-outfit rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Sla Agreement Details</DialogTitle>
                    </DialogHeader>
                    {selectedSLA && (
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">{selectedSLA.id}</span>
                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${getPriorityColor(selectedSLA.priority)}`}>{selectedSLA.priority}</Badge>
                                <Badge className={`text-[10px] px-2 py-0.5 rounded-lg border-0 font-bold ${selectedSLA.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{selectedSLA.status}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Sla Name</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedSLA.name}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Client</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedSLA.client}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Response Time</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedSLA.responseTime}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Resolution Time</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedSLA.resolutionTime}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Availability</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedSLA.availability || "—"}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Compliance</p>
                                    <p className={`text-sm font-bold ${getComplianceColor(selectedSLA.compliance)}`}>{selectedSLA.compliance}%</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold border-slate-200" onClick={() => setIsViewSLAOpen(false)}>Close</Button>
                                <Button className="flex-1 h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setIsViewSLAOpen(false); openEdit(selectedSLA) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit Agreement
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit SLA Dialog */}
            <Dialog open={isEditSLAOpen} onOpenChange={setIsEditSLAOpen}>
                <DialogContent className="max-w-md font-outfit rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Edit Sla Agreement</DialogTitle>
                    </DialogHeader>
                    {selectedSLA && (
                        <div className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Sla Name</Label>
                                <Input value={selectedSLA.name} onChange={(e) => setSelectedSLA({ ...selectedSLA, name: e.target.value })} className="h-11 rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Client</Label>
                                <Input value={selectedSLA.client} onChange={(e) => setSelectedSLA({ ...selectedSLA, client: e.target.value })} className="h-11 rounded-xl border-slate-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Priority</Label>
                                    <Select value={selectedSLA.priority} onValueChange={(v) => setSelectedSLA({ ...selectedSLA, priority: v })}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Status</Label>
                                    <Select value={selectedSLA.status} onValueChange={(v) => setSelectedSLA({ ...selectedSLA, status: v })}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Response Time</Label>
                                    <Input value={selectedSLA.responseTime} onChange={(e) => setSelectedSLA({ ...selectedSLA, responseTime: e.target.value })} className="h-11 rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-slate-700 text-sm">Resolution Time</Label>
                                    <Input value={selectedSLA.resolutionTime} onChange={(e) => setSelectedSLA({ ...selectedSLA, resolutionTime: e.target.value })} className="h-11 rounded-xl border-slate-200" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-bold text-slate-700 text-sm">Availability Target</Label>
                                <Input value={selectedSLA.availability} onChange={(e) => setSelectedSLA({ ...selectedSLA, availability: e.target.value })} className="h-11 rounded-xl border-slate-200" />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button variant="outline" onClick={() => setIsEditSLAOpen(false)} className="flex-1 h-11 rounded-xl font-bold border-slate-200">Cancel</Button>
                                <Button onClick={handleEditSLA} className="flex-1 h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">Save Changes</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* SLA Settings Dialog */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="max-w-md font-outfit rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Sla Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-sm">Default Response Threshold</Label>
                            <Select defaultValue="4hours">
                                <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1hour">1 hour</SelectItem>
                                    <SelectItem value="2hours">2 hours</SelectItem>
                                    <SelectItem value="4hours">4 hours</SelectItem>
                                    <SelectItem value="8hours">8 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-sm">Breach Notification Email</Label>
                            <Input placeholder="alerts@company.com" className="h-11 rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-sm">Alert Threshold</Label>
                            <Select defaultValue="90">
                                <SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="80">Below 80%</SelectItem>
                                    <SelectItem value="85">Below 85%</SelectItem>
                                    <SelectItem value="90">Below 90%</SelectItem>
                                    <SelectItem value="95">Below 95%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-3 pt-1">
                            <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold border-slate-200" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
                            <Button className="flex-1 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20" onClick={() => { toast.success("Settings saved"); setIsSettingsOpen(false) }}>
                                Save Settings
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
