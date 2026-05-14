"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Workflow,
    Activity,
    CheckCircle,
    Timer,
    Boxes,
    Play,
    Pause,
    Plus,
    Search,
    Filter,
    RefreshCw,
    Download,
    Settings2,
    Cpu,
    Zap,
    Clock,
    Sparkles,
    Eye,
    Terminal,
    Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

interface ActiveWorkflow {
    id: string
    name: string
    type: string
    status: "Running" | "Paused"
    rate: number
    load: string
}

interface Execution {
    id: string
    flow: string
    trigger: string
    status: "Success" | "Running" | "Failed"
    duration: string
    actions: number
}

const INITIAL_WORKFLOWS: ActiveWorkflow[] = [
    { id: "WF-001", name: "Client Health Sentinel", type: "Monitoring", status: "Running", rate: 98, load: "High" },
    { id: "WF-002", name: "Renewal Velocity Sync", type: "Lifecycle", status: "Running", rate: 100, load: "Medium" },
    { id: "WF-003", name: "Structural Integrity Audit", type: "Security", status: "Paused", rate: 95, load: "Low" },
    { id: "WF-004", name: "Onboarding Orchestrator", type: "Lifecycle", status: "Running", rate: 92, load: "Medium" },
]

const INITIAL_EXECUTIONS: Execution[] = [
    { id: "EXE-01", flow: "Sentinel Health", trigger: "Telemetry", status: "Success", duration: "1.2s", actions: 12 },
    { id: "EXE-02", flow: "Velocity Sync", trigger: "Scheduler", status: "Running", duration: "Active", actions: 4 },
    { id: "EXE-03", flow: "Renewal Audit", trigger: "Cron", status: "Success", duration: "0.8s", actions: 6 },
    { id: "EXE-04", flow: "Risk Sentinel", trigger: "Webhook", status: "Failed", duration: "4.1s", actions: 8 },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function AutomationOverviewPage() {
    const router = useRouter()
    const [workflows, setWorkflows] = React.useState<ActiveWorkflow[]>(INITIAL_WORKFLOWS)
    const [executions] = React.useState<Execution[]>(INITIAL_EXECUTIONS)
    const [search, setSearch] = React.useState("")
    const [activeTab, setActiveTab] = React.useState<"nodes" | "executions">("nodes")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [filterType, setFilterType] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<ActiveWorkflow | Execution | null>(null)
    const [selectedKind, setSelectedKind] = React.useState<"workflow" | "execution" | null>(null)
    const [isSyncing, setIsSyncing] = React.useState(false)

    const [form, setForm] = React.useState({ name: "", type: "Monitoring", load: "Medium" })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => {
        const running = workflows.filter(w => w.status === "Running").length
        const successRate = executions.length ? Math.round((executions.filter(e => e.status === "Success").length / executions.length) * 100) : 0
        const totalActions = executions.reduce((a, e) => a + e.actions, 0)
        return { running, total: workflows.length, successRate, totalActions }
    }, [workflows, executions])

    const filteredWorkflows = React.useMemo(() => {
        return workflows.filter(w => {
            const matchSearch = !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.type.toLowerCase().includes(search.toLowerCase())
            const matchStatus = filterStatus === "all" || w.status.toLowerCase() === filterStatus
            const matchType = filterType === "all" || w.type === filterType
            return matchSearch && matchStatus && matchType
        })
    }, [workflows, search, filterStatus, filterType])

    const filteredExecutions = React.useMemo(() => {
        return executions.filter(e => !search || e.flow.toLowerCase().includes(search.toLowerCase()) || e.trigger.toLowerCase().includes(search.toLowerCase()))
    }, [executions, search])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setForm({ name: "", type: "Monitoring", load: "Medium" })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const wf: ActiveWorkflow = {
            id: `WF-${String(workflows.length + 1).padStart(3, "0")}`,
            name: form.name.trim(),
            type: form.type,
            status: "Running",
            rate: 100,
            load: form.load,
        }
        setWorkflows(prev => [wf, ...prev])
        toast.success("Workflow node provisioned")
        setIsFormOpen(false)
    }

    const handleToggle = (id: string) => {
        const wf = workflows.find(w => w.id === id)
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === "Running" ? "Paused" : "Running" } : w))
        toast.success(wf?.status === "Running" ? `${wf.id} suspended` : `${wf?.id} resumed`)
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: "Synchronizing automation nodes...",
            success: "All nodes synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1200)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Type", "Status", "Rate", "Load"],
            ...workflows.map(w => [w.id, w.name, w.type, w.status, `${w.rate}%`, w.load]),
        ].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "automation-overview.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Overview exported")
    }

    const openWorkflowDetail = (w: ActiveWorkflow) => {
        setSelected(w); setSelectedKind("workflow"); setIsDetailOpen(true)
    }

    const openExecutionDetail = (e: Execution) => {
        setSelected(e); setSelectedKind("execution"); setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Active Nodes", value: `${stats.running} / ${stats.total}`, subtitle: "Running workflows", icon: Boxes, color: "indigo", trend: `+${stats.running}`, path: "/client-management/automation/workflows" },
        { title: "Execution Success", value: `${stats.successRate}%`, subtitle: "Recent run accuracy", icon: CheckCircle, color: "emerald", trend: "+1.2%", path: "/client-management/automation/logs" },
        { title: "Pending Approvals", value: "08", subtitle: "Awaiting governance", icon: Timer, color: "amber", trend: "+2", path: "/client-management/automation/approvals" },
        { title: "Actions Triggered", value: String(stats.totalActions), subtitle: "Across live runs", icon: Activity, color: "violet", trend: `+${stats.totalActions}`, path: "/client-management/automation/triggers" },
    ]

    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Automation <span className="text-indigo-600">Overview</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Real-time telemetry, workflow orchestration, and execution monitoring.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={handleSync}>
                        {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        {isSyncing ? "Syncing" : "Sync"}
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" /> Build Workflow
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => {
                    const cc = colorMap[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                            <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-400">{kpi.subtitle}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${cc.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${cc.text}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-4">
                <TabsList className="rounded-none bg-white border border-slate-200 p-1 w-fit">
                    <TabsTrigger value="nodes" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Node Overview</TabsTrigger>
                    <TabsTrigger value="executions" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Live Executions</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === "nodes" && (
                        <Card className="rounded-none">
                            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-semibold">Automation Node Registry</CardTitle>
                                    <Badge className="rounded-none bg-slate-100 text-slate-600">{filteredWorkflows.length} Nodes</Badge>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search nodes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50">
                                    {filteredWorkflows.length > 0 ? filteredWorkflows.map(wf => (
                                        <div key={wf.id} className="px-6 py-4 hover:bg-slate-50/80 transition cursor-pointer group flex items-center gap-4" onClick={() => openWorkflowDetail(wf)}>
                                            <div className="h-10 w-10 rounded-none bg-white border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50">
                                                <Workflow className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-slate-800">{wf.name}</p>
                                                    <Badge className={`rounded-none text-[10px] ${wf.status === "Running" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"} border`}>{wf.status}</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-400 font-semibold">
                                                    <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> Type: {wf.type}</span>
                                                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Priority: {wf.load}</span>
                                                </div>
                                            </div>
                                            <div className="w-32 shrink-0">
                                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                                                    <span>Health</span>
                                                    <span className="text-slate-700">{wf.rate}%</span>
                                                </div>
                                                <Progress value={wf.rate} className="h-1.5" />
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-none" onClick={() => handleToggle(wf.id)}>
                                                    {wf.status === "Running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={() => openWorkflowDetail(wf)}>
                                                    <Settings2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="px-6 py-12 text-center text-sm text-slate-500">No nodes match your filters.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "executions" && (
                        <Card className="rounded-none">
                            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-semibold">Live Execution Registry</CardTitle>
                                    <Badge className="rounded-none bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Stream
                                    </Badge>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search executions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50">
                                    {filteredExecutions.map(ex => (
                                        <div key={ex.id} className="px-6 py-4 hover:bg-slate-50/80 transition cursor-pointer group flex items-center gap-4" onClick={() => openExecutionDetail(ex)}>
                                            <div className="h-10 w-10 rounded-none bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{ex.id.slice(-2)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-slate-800">{ex.flow}</p>
                                                    <Badge className={`rounded-none text-[10px] border ${ex.status === "Success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : ex.status === "Running" ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>{ex.status}</Badge>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-0.5">Trigger: {ex.trigger} • Duration: {ex.duration}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold text-slate-900">{ex.actions}</p>
                                                <p className="text-[10px] font-bold text-slate-400">Sub-actions</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="rounded-none" onClick={(e) => { e.stopPropagation(); openExecutionDetail(ex) }}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Quick Navigation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[
                                { label: "Workflows", icon: Workflow, path: "/client-management/automation/workflows" },
                                { label: "Playbooks", icon: Boxes, path: "/client-management/automation/playbooks" },
                                { label: "Triggers", icon: Zap, path: "/client-management/automation/triggers" },
                                { label: "Notifications", icon: Activity, path: "/client-management/automation/notifications" },
                                { label: "Approvals", icon: CheckCircle, path: "/client-management/automation/approvals" },
                                { label: "Logs", icon: Terminal, path: "/client-management/automation/logs" },
                            ].map((nav, i) => (
                                <div key={i} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-none transition" onClick={() => router.push(nav.path)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                            <nav.icon className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{nav.label}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> Pulse Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    <span className="text-indigo-600 font-bold">{stats.running}</span> nodes running at {stats.successRate}% execution accuracy.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    {stats.totalActions} sub-actions fired across live runs in the last cycle.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none mt-2" onClick={() => { toast.success("Opening logs"); router.push('/client-management/automation/logs') }}>
                                Inspect Audit Trail
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Activity</CardTitle>
                            <Clock className="h-4 w-4 text-indigo-400" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {executions.slice(0, 3).map((ex, i) => (
                                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 transition" onClick={() => openExecutionDetail(ex)}>
                                    <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{ex.id.slice(-2)}</div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold text-slate-700 leading-tight">{ex.flow}</p>
                                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{ex.trigger} • {ex.duration}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Provision Workflow Node</SheetTitle>
                        <p className="text-[12px] text-slate-500">Add a new automation node to the registry.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Node Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. Client Health Sentinel" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={(v) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Monitoring">Monitoring</SelectItem>
                                        <SelectItem value="Lifecycle">Lifecycle</SelectItem>
                                        <SelectItem value="Security">Security</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Load Priority</Label>
                                <Select value={form.load} onValueChange={(v) => setField("load", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>Provision Node</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Nodes</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="running">Running</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                                    <SelectItem value="Lifecycle">Lifecycle</SelectItem>
                                    <SelectItem value="Security">Security</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterStatus("all"); setFilterType("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">{selectedKind === "workflow" ? "Node Details" : "Execution Details"}</SheetTitle>
                    </SheetHeader>
                    {selected && selectedKind === "workflow" && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Workflow Node</p>
                                    <p className="text-lg font-semibold text-slate-900">{(selected as ActiveWorkflow).name}</p>
                                    <p className="text-sm text-slate-500">{(selected as ActiveWorkflow).id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><p className="font-semibold text-slate-900">{(selected as ActiveWorkflow).type}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none ${(selected as ActiveWorkflow).status === "Running" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{(selected as ActiveWorkflow).status}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Health Rate</p><p className="font-semibold text-slate-900">{(selected as ActiveWorkflow).rate}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Load</p><p className="font-semibold text-slate-900">{(selected as ActiveWorkflow).load}</p></div>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <p className="text-[11px] text-slate-400 uppercase">Health Progress</p>
                                    <Progress value={(selected as ActiveWorkflow).rate} className="h-2" />
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { handleToggle((selected as ActiveWorkflow).id); setIsDetailOpen(false) }}>
                                    {(selected as ActiveWorkflow).status === "Running" ? <><Pause className="h-4 w-4 mr-2" />Pause</> : <><Play className="h-4 w-4 mr-2" />Resume</>}
                                </Button>
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => { router.push('/client-management/automation/workflows'); toast.success("Opening workflows") }}>
                                    Go to Workflow
                                </Button>
                            </div>
                        </>
                    )}
                    {selected && selectedKind === "execution" && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Execution</p>
                                    <p className="text-lg font-semibold text-slate-900">{(selected as Execution).flow}</p>
                                    <p className="text-sm text-slate-500">{(selected as Execution).id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Trigger</p><p className="font-semibold text-slate-900">{(selected as Execution).trigger}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none ${(selected as Execution).status === "Success" ? "bg-emerald-50 text-emerald-700" : (selected as Execution).status === "Running" ? "bg-indigo-50 text-indigo-700" : "bg-rose-50 text-rose-700"}`}>{(selected as Execution).status}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Duration</p><p className="font-semibold text-slate-900">{(selected as Execution).duration}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Sub-actions</p><p className="font-semibold text-slate-900">{(selected as Execution).actions}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => { router.push('/client-management/automation/logs'); toast.success("Opening logs") }}>
                                    View Full Log
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
