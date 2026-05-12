"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Search, Plus, MoreVertical, Clock, AlertTriangle, CheckCircle, TrendingUp,
    TrendingDown, Settings, Edit, Trash2, Eye, ShieldCheck,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
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

const validators = {
    required: (v: string) => !v?.toString().trim() ? "Required" : "",
    minLen: (n: number) => (v: string) => v?.trim().length < n ? `Min ${n} chars` : "",
}

export default function SLAManagement() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const [isViewOpen, setIsViewOpen] = React.useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selectedSLA, setSelectedSLA] = React.useState<SLAAgreement | null>(null)

    const [form, setForm] = React.useState({
        name: "", client: "", priority: "Medium",
        responseTime: "", resolutionTime: "", availability: "", status: "Active"
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const [slaAgreements, setSlaAgreements] = React.useState<SLAAgreement[]>([
        { id: "SLA-001", name: "Enterprise Support", client: "Acme Corp", priority: "High", responseTime: "1 hour", resolutionTime: "4 hours", availability: "99.9%", status: "Active", compliance: 98, lastBreach: "2024-02-20", created: "2024-01-15" },
        { id: "SLA-002", name: "Standard Support", client: "TechStart Inc", priority: "Medium", responseTime: "4 hours", resolutionTime: "24 hours", availability: "99.5%", status: "Active", compliance: 95, lastBreach: "2024-02-18", created: "2024-01-20" },
        { id: "SLA-003", name: "Premium Support", client: "Global Solutions", priority: "High", responseTime: "30 minutes", resolutionTime: "2 hours", availability: "99.95%", status: "Active", compliance: 92, lastBreach: "2024-02-25", created: "2024-02-01" },
        { id: "SLA-004", name: "Basic Support", client: "Innovation Labs", priority: "Low", responseTime: "8 hours", resolutionTime: "48 hours", availability: "99.0%", status: "Active", compliance: 97, lastBreach: "2024-02-15", created: "2024-01-10" }
    ])

    const recentBreaches = [
        { id: "BR-001", client: "Global Solutions", sla: "Premium Support", type: "Response Time", target: "30 minutes", actual: "45 minutes", ticket: "TK-005", date: "2024-02-25T14:30:00Z", severity: "High" },
        { id: "BR-002", client: "Acme Corp", sla: "Enterprise Support", type: "Resolution Time", target: "4 hours", actual: "6 hours", ticket: "TK-003", date: "2024-02-20T10:15:00Z", severity: "Medium" },
        { id: "BR-003", client: "TechStart Inc", sla: "Standard Support", type: "Response Time", target: "4 hours", actual: "5.5 hours", ticket: "TK-001", date: "2024-02-18T16:20:00Z", severity: "Low" }
    ]

    const avgCompliance = Math.round(slaAgreements.reduce((acc, s) => acc + s.compliance, 0) / slaAgreements.length)
    const activeCount = slaAgreements.filter(s => s.status === "Active").length

    const slaMetrics = [
        {
            title: "Overall SLA Compliance", value: `${avgCompliance}%`,
            change: "+2.1%", trend: "up",
            icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
            bg: "bg-emerald-50", border: "border-emerald-100",
            cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/80",
            path: "/client-management/analytics/performance"
        },
        {
            title: "Avg Response Time", value: "2.4h",
            change: "-0.3h", trend: "down",
            icon: <Clock className="h-4 w-4 text-blue-600" />,
            bg: "bg-blue-50", border: "border-blue-100",
            cardBg: "bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/80",
            path: "/client-management/support/tickets"
        },
        {
            title: "SLA Breaches", value: recentBreaches.length.toString(),
            change: "-3", trend: "down",
            icon: <AlertTriangle className="h-4 w-4 text-rose-600" />,
            bg: "bg-rose-50", border: "border-rose-100",
            cardBg: "bg-gradient-to-br from-rose-50 to-rose-100/60 border-rose-200/80",
            path: "/client-management/support/escalations"
        },
        {
            title: "Active Agreements", value: activeCount.toString(),
            change: "+1", trend: "up",
            icon: <ShieldCheck className="h-4 w-4 text-violet-600" />,
            bg: "bg-violet-50", border: "border-violet-100",
            cardBg: "bg-gradient-to-br from-violet-50 to-violet-100/60 border-violet-200/80",
            path: "/client-management/customers/segments"
        }
    ]

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
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

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.responseTime = validators.required(form.responseTime)
        errs.resolutionTime = validators.required(form.resolutionTime)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", client: "", priority: "Medium", responseTime: "", resolutionTime: "", availability: "", status: "Active" })
        setErrors({})
        setIsCreateOpen(true)
    }

    const openEdit = (sla: SLAAgreement) => {
        setEditingId(sla.id)
        setForm({
            name: sla.name, client: sla.client, priority: sla.priority,
            responseTime: sla.responseTime, resolutionTime: sla.resolutionTime,
            availability: sla.availability, status: sla.status
        })
        setErrors({})
        setIsEditOpen(true)
    }

    const openView = (sla: SLAAgreement) => { setSelectedSLA(sla); setIsViewOpen(true) }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setSlaAgreements(slaAgreements.map(s => s.id === editingId ? { ...s, ...form } : s))
            setIsEditOpen(false)
            toast.success("SLA agreement updated")
        } else {
            const sla: SLAAgreement = {
                id: `SLA-${String(slaAgreements.length + 1).padStart(3, '0')}`,
                ...form,
                compliance: 100,
                lastBreach: "",
                created: new Date().toISOString().split('T')[0]
            }
            setSlaAgreements([sla, ...slaAgreements])
            setIsCreateOpen(false)
            toast.success("SLA agreement created")
        }
    }

    const handleDelete = (id: string) => {
        setSlaAgreements(slaAgreements.filter(s => s.id !== id))
        toast.success("SLA agreement deleted")
    }

    const handleToggleStatus = (id: string) => {
        setSlaAgreements(slaAgreements.map(s =>
            s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
        ))
        toast.success("Status toggled")
    }

    const FormFields = () => (
        <>
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">SLA Name <span className="text-rose-500">*</span></Label>
                <Input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="e.g., Enterprise Support"
                    className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`}
                />
                {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
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
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Priority</Label>
                    <Select value={form.priority} onValueChange={(v) => setField("priority", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Status</Label>
                    <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Response Time <span className="text-rose-500">*</span></Label>
                    <Input
                        value={form.responseTime}
                        onChange={(e) => setField("responseTime", e.target.value)}
                        placeholder="e.g., 2 hours"
                        className={`h-10 rounded-none ${errors.responseTime ? "border-rose-500" : ""}`}
                    />
                    {errors.responseTime && <p className="text-[11px] text-rose-500">{errors.responseTime}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Resolution Time <span className="text-rose-500">*</span></Label>
                    <Input
                        value={form.resolutionTime}
                        onChange={(e) => setField("resolutionTime", e.target.value)}
                        placeholder="e.g., 24 hours"
                        className={`h-10 rounded-none ${errors.resolutionTime ? "border-rose-500" : ""}`}
                    />
                    {errors.resolutionTime && <p className="text-[11px] text-rose-500">{errors.resolutionTime}</p>}
                </div>
            </div>
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Availability Target</Label>
                <Input
                    value={form.availability}
                    onChange={(e) => setField("availability", e.target.value)}
                    placeholder="e.g., 99.5%"
                    className="h-10 rounded-none"
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
                        SLA <span className="text-blue-600">Management</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Monitor and manage service level agreements across all clients.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="rounded-none h-11 px-5 font-bold font-outfit gap-2 border-slate-200 hover:bg-slate-50"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <Settings className="h-4 w-4" /> SLA Settings
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none h-11 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2" onClick={openCreate}>
                        <Plus className="h-5 w-5" /> New SLA
                    </Button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {slaMetrics.map((metric, index) => (
                    <Card key={index} className={`border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 rounded-none cursor-pointer ${metric.cardBg}`} onClick={() => router.push(metric.path)}>
                        <CardContent className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-9 w-9 rounded-none flex items-center justify-center ${metric.bg} border ${metric.border} shadow-sm`}>
                                    {metric.icon}
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

            {/* Main Content */}
            <Tabs defaultValue="agreements" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1 rounded-none h-12 w-fit font-outfit shadow-sm">
                    <TabsTrigger value="agreements" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">SLA Policies</TabsTrigger>
                    <TabsTrigger value="breaches" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Recent Breaches</TabsTrigger>
                    <TabsTrigger value="reports" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Compliance Reports</TabsTrigger>
                </TabsList>

                {/* SLA Agreements Tab */}
                <TabsContent value="agreements" className="space-y-6">
                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">SLA Policies</CardTitle>
                                    <Badge className="bg-blue-50 text-blue-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-none">{filteredSLAs.length} policies</Badge>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search SLAs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-10 w-56 bg-slate-50 border-slate-200 rounded-none text-sm font-outfit"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            {filteredSLAs.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="h-14 w-14 rounded-none bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <ShieldCheck className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-500">No SLA policies found</p>
                                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredSLAs.map((sla) => (
                                        <div key={sla.id} className="group flex flex-col p-5 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openView(sla)}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-slate-900">{sla.id}</span>
                                                        <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getPriorityColor(sla.priority)}`}>{sla.priority}</Badge>
                                                        <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${sla.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{sla.status}</Badge>
                                                    </div>
                                                    <h3 className="text-[15px] font-bold text-slate-800">
                                                        {sla.name} <span className="text-slate-500 font-medium">{sla.client}</span>
                                                    </h3>
                                                </div>
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-none font-outfit shadow-lg border-slate-200">
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => openView(sla)}>
                                                                <Eye className="h-4 w-4 text-blue-500" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => openEdit(sla)}>
                                                                <Edit className="h-4 w-4 text-indigo-500" /> Edit Policy
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleToggleStatus(sla.id)}>
                                                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                                {sla.status === "Active" ? "Deactivate" : "Activate"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="gap-2 font-medium cursor-pointer rounded-none text-red-600 focus:text-red-600 focus:bg-red-50"
                                                                onClick={() => handleDelete(sla.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
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
                                                <Badge className={`text-[11px] px-2.5 py-0.5 rounded-none border-0 font-bold ${getComplianceBg(sla.compliance)}`}>{sla.compliance}%</Badge>
                                                {sla.lastBreach && (
                                                    <span className="text-[11px] font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-none">
                                                        Last breach: {formatDate(sla.lastBreach)}
                                                    </span>
                                                )}
                                                <div className="ml-auto flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100" onClick={() => openView(sla)}>
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100" onClick={() => openEdit(sla)}>
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100" onClick={() => handleDelete(sla.id)}>
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
                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Recent SLA Breaches</CardTitle>
                                <Badge className="bg-rose-50 text-rose-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-none">{recentBreaches.length} breaches</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            <div className="space-y-4">
                                {recentBreaches.map((breach) => (
                                    <div key={breach.id} className="flex items-center justify-between p-5 bg-rose-50/30 border border-rose-100 rounded-none hover:bg-rose-50/50 transition-all cursor-pointer" onClick={() => { toast.success(`Opening ticket ${breach.ticket}`); router.push('/client-management/support/tickets') }}>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-none flex items-center justify-center font-bold text-lg bg-rose-50 border border-rose-100 text-rose-600 shadow-sm shrink-0">
                                                !
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-slate-900">{breach.id}</span>
                                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getSeverityColor(breach.severity)}`}>{breach.severity}</Badge>
                                                    <span className="text-[11px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-none">Ticket: {breach.ticket}</span>
                                                </div>
                                                <h3 className="text-[14px] font-bold text-slate-800 mb-1">
                                                    {breach.type} Breach <span className="text-slate-500 font-medium">{breach.client}</span>
                                                </h3>
                                                <div className="flex flex-wrap gap-x-6 text-[12px] font-medium text-slate-500">
                                                    <span>SLA: <span className="text-slate-700 font-bold">{breach.sla}</span></span>
                                                    <span>Target: <span className="text-slate-700 font-bold">{breach.target}</span></span>
                                                    <span>Actual: <span className="text-rose-600 font-bold">{breach.actual}</span></span>
                                                    <span>Occurred: {new Date(breach.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-none ml-2" onClick={(e) => { e.stopPropagation(); router.push('/client-management/support/escalations') }}>
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
                        <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
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
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all">
                                            <span className="text-[13px] font-bold text-slate-500 font-outfit">{item.month}</span>
                                            <div className="flex items-center gap-3">
                                                <Progress value={item.rate} className="w-28 h-2.5 bg-slate-100" />
                                                <Badge className={`text-[11px] px-2.5 py-0.5 rounded-none border-0 font-bold ${getComplianceBg(item.rate)}`}>{item.rate}%</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Performance By Client</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-5">
                                <div className="space-y-3">
                                    {slaAgreements.map((sla, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openView(sla)}>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-indigo-600">{sla.client.charAt(0)}</span>
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-600 font-outfit">{sla.client}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Progress value={sla.compliance} className="w-28 h-2.5 bg-slate-100" />
                                                <Badge className={`text-[11px] px-2.5 py-0.5 rounded-none border-0 font-bold ${getComplianceBg(sla.compliance)}`}>{sla.compliance}%</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Create Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Create SLA Policy</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define a new service level agreement.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <FormFields />
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={handleSave}>Create SLA</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Edit Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Edit SLA Policy</SheetTitle>
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
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">SLA Policy Details</SheetTitle>
                    </SheetHeader>
                    {selectedSLA && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-slate-900">{selectedSLA.id}</span>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getPriorityColor(selectedSLA.priority)}`}>{selectedSLA.priority}</Badge>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${selectedSLA.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{selectedSLA.status}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">SLA Name</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedSLA.name}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Client</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedSLA.client}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Response Time</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedSLA.responseTime}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Resolution Time</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedSLA.resolutionTime}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Availability</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedSLA.availability || ""}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Compliance</p>
                                        <p className={`text-sm font-bold ${getComplianceColor(selectedSLA.compliance)}`}>{selectedSLA.compliance}%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsViewOpen(false); openEdit(selectedSLA) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selectedSLA.id); setIsViewOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* SLA Settings Sheet */}
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">SLA Settings</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Default Response Threshold</Label>
                            <Select defaultValue="4hours">
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="1hour">1 hour</SelectItem>
                                    <SelectItem value="2hours">2 hours</SelectItem>
                                    <SelectItem value="4hours">4 hours</SelectItem>
                                    <SelectItem value="8hours">8 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Breach Notification Email</Label>
                            <Input placeholder="alerts@company.com" className="h-10 rounded-none" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Alert Threshold</Label>
                            <Select defaultValue="90">
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="80">Below 80%</SelectItem>
                                    <SelectItem value="85">Below 85%</SelectItem>
                                    <SelectItem value="90">Below 90%</SelectItem>
                                    <SelectItem value="95">Below 95%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={() => { toast.success("Settings saved"); setIsSettingsOpen(false) }}>
                            Save Settings
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
