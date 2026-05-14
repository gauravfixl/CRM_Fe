"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    GitBranch,
    Zap,
    Activity,
    CheckCircle2,
    Pause,
    Plus,
    Search,
    Filter,
    RefreshCw,
    Download,
    MoreVertical,
    Trash2,
    PencilLine,
    Eye,
    Clock,
    Loader2,
    Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Switch } from "@/shared/components/ui/switch"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

interface Workflow {
    id: string
    name: string
    trigger: string
    status: "Active" | "Paused"
    runs: number
    successRate: number
    lastRun: string
    category: string
}

const INITIAL_WORKFLOWS: Workflow[] = [
    { id: "WF-001", name: "Client onboarding sequence", trigger: "New client added", status: "Active", runs: 142, successRate: 98.2, lastRun: "2 min ago", category: "Onboarding" },
    { id: "WF-002", name: "Renewal reminder flow", trigger: "Subscription nearing expiry", status: "Active", runs: 89, successRate: 95.6, lastRun: "1 hr ago", category: "Retention" },
    { id: "WF-003", name: "Churn risk alert", trigger: "Health score drops below 40", status: "Active", runs: 34, successRate: 100, lastRun: "4 hr ago", category: "Risk" },
    { id: "WF-004", name: "Invoice follow-up", trigger: "Invoice overdue by 7 days", status: "Paused", runs: 211, successRate: 91.4, lastRun: "1 day ago", category: "Finance" },
    { id: "WF-005", name: "Escalation to account manager", trigger: "Support ticket unresolved > 48h", status: "Active", runs: 56, successRate: 96.4, lastRun: "30 min ago", category: "Support" },
    { id: "WF-006", name: "NPS follow-up survey", trigger: "Contract renewal completed", status: "Paused", runs: 77, successRate: 88.3, lastRun: "3 days ago", category: "Engagement" },
]

const CATEGORIES = ["Onboarding", "Retention", "Risk", "Finance", "Support", "Engagement"]

const CATEGORY_COLORS: Record<string, string> = {
    Onboarding: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Retention: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Risk: "bg-rose-50 text-rose-600 border-rose-100",
    Finance: "bg-amber-50 text-amber-600 border-amber-100",
    Support: "bg-violet-50 text-violet-600 border-violet-100",
    Engagement: "bg-cyan-50 text-cyan-600 border-cyan-100",
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function WorkflowsPage() {
    const router = useRouter()
    const [workflows, setWorkflows] = React.useState<Workflow[]>(INITIAL_WORKFLOWS)
    const [search, setSearch] = React.useState("")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [filterCategory, setFilterCategory] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<Workflow | null>(null)
    const [isSyncing, setIsSyncing] = React.useState(false)

    const [form, setForm] = React.useState({
        name: "", trigger: "", category: "Onboarding", status: "Active" as Workflow["status"],
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => {
        const active = workflows.filter(w => w.status === "Active").length
        const paused = workflows.filter(w => w.status === "Paused").length
        const totalRuns = workflows.reduce((a, w) => a + w.runs, 0)
        const avgSuccess = workflows.length
            ? (workflows.reduce((a, w) => a + w.successRate, 0) / workflows.length).toFixed(1)
            : "0.0"
        return { active, paused, totalRuns, avgSuccess }
    }, [workflows])

    const filtered = React.useMemo(() => {
        return workflows.filter(wf => {
            const matchSearch = !search ||
                wf.name.toLowerCase().includes(search.toLowerCase()) ||
                wf.trigger.toLowerCase().includes(search.toLowerCase())
            const matchStatus = filterStatus === "all" || wf.status.toLowerCase() === filterStatus
            const matchCategory = filterCategory === "all" || wf.category === filterCategory
            return matchSearch && matchStatus && matchCategory
        })
    }, [workflows, search, filterStatus, filterCategory])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.trigger = validators.required(form.trigger) || validators.minLen(3)(form.trigger)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", trigger: "", category: "Onboarding", status: "Active" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (wf: Workflow) => {
        setEditingId(wf.id)
        setForm({ name: wf.name, trigger: wf.trigger, category: wf.category, status: wf.status })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setWorkflows(prev => prev.map(w => w.id === editingId ? {
                ...w,
                name: form.name.trim(),
                trigger: form.trigger.trim(),
                category: form.category,
                status: form.status,
            } : w))
            toast.success("Workflow updated")
        } else {
            const wf: Workflow = {
                id: `WF-${String(workflows.length + 1).padStart(3, "0")}`,
                name: form.name.trim(),
                trigger: form.trigger.trim(),
                status: form.status,
                runs: 0,
                successRate: 100,
                lastRun: "Never",
                category: form.category,
            }
            setWorkflows(prev => [wf, ...prev])
            toast.success("Workflow created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setWorkflows(prev => prev.filter(w => w.id !== id))
        toast.success("Workflow removed")
    }

    const handleToggle = (id: string) => {
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === "Active" ? "Paused" : "Active" } : w))
        const wf = workflows.find(w => w.id === id)
        toast.success(wf?.status === "Active" ? "Workflow paused" : "Workflow activated")
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: "Syncing workflow engine...",
            success: "All workflows synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1200)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Trigger", "Status", "Category", "Runs", "Success Rate", "Last Run"],
            ...workflows.map(w => [w.id, w.name, w.trigger, w.status, w.category, w.runs, `${w.successRate}%`, w.lastRun]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "workflows.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Workflows exported")
    }

    const openDetail = (wf: Workflow) => {
        setSelected(wf)
        setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Active Workflows", value: String(stats.active), subtitle: `${workflows.length} total configured`, icon: Zap, color: "indigo", trend: `+${stats.active}`, path: "/client-management/automation/triggers" },
        { title: "Total Runs", value: stats.totalRuns.toLocaleString(), subtitle: "All-time executions", icon: Activity, color: "emerald", trend: "+12%", path: "/client-management/automation/logs" },
        { title: "Avg Success Rate", value: `${stats.avgSuccess}%`, subtitle: "Across all flows", icon: CheckCircle2, color: "violet", trend: "+1.4%", path: "/client-management/analytics/overview" },
        { title: "Paused Workflows", value: String(stats.paused), subtitle: "Awaiting activation", icon: Pause, color: "amber", trend: `${stats.paused}`, path: "/client-management/automation/playbooks" },
    ]

    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Workflow <span className="text-indigo-600">Automation</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Design, manage, and monitor automated client workflows across the lifecycle.</p>
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
                        <Plus className="h-4 w-4 mr-2" /> New Workflow
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">All Workflows</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} Results</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search workflows..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Workflow</th>
                                            <th className="px-6 py-3">Trigger</th>
                                            <th className="px-6 py-3">Runs</th>
                                            <th className="px-6 py-3">Success</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((wf) => (
                                            <tr key={wf.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(wf)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50">
                                                            <GitBranch className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{wf.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-semibold border ${CATEGORY_COLORS[wf.category] || "bg-slate-50 text-slate-500 border-slate-100"}`}>{wf.category}</span>
                                                                <span className="text-[11px] text-slate-400">{wf.id}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate">{wf.trigger}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{wf.runs}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={wf.successRate} className="w-20 h-1.5" />
                                                        <span className="text-xs font-bold text-slate-900">{wf.successRate}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-2">
                                                        <Switch checked={wf.status === "Active"} onCheckedChange={() => handleToggle(wf.id)} />
                                                        <span className="text-[11px] font-semibold text-slate-500">{wf.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(wf)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(wf)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(wf.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No workflows match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Category Distribution</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Workflows grouped by lifecycle stage</p>
                            </div>
                            <Activity className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {CATEGORIES.map((cat) => {
                                const list = workflows.filter(w => w.category === cat)
                                const progress = workflows.length ? (list.length / workflows.length) * 100 : 0
                                return (
                                    <div key={cat} className="space-y-2 cursor-pointer hover:bg-slate-50 p-2 -m-2 transition" onClick={() => setFilterCategory(cat)}>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{cat} <span className="text-slate-400 font-medium ml-2">{list.length} workflows</span></span>
                                            <span className="text-slate-900">{Math.round(progress)}%</span>
                                        </div>
                                        <Progress value={progress} className="h-1.5 bg-slate-50" />
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Top Performing Flows</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...workflows].sort((a, b) => b.successRate - a.successRate).slice(0, 4).map((wf, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-none transition" onClick={() => openDetail(wf)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-none bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
                                            {wf.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{wf.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{wf.runs} runs</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">{wf.successRate}%</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{wf.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 rounded-none mt-3" onClick={() => router.push('/client-management/automation/logs')}>
                                View Execution Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> Automation Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Your <span className="text-indigo-600 font-bold">onboarding flow</span> drives a {stats.avgSuccess}% success rate across {stats.totalRuns.toLocaleString()} runs.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Consider activating {stats.paused} paused flows to boost coverage.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none mt-2" onClick={() => { toast.success("Optimization scan started"); router.push('/client-management/automation/playbooks') }}>
                                Browse Playbooks
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Runs</CardTitle>
                            <Clock className="h-4 w-4 text-indigo-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {workflows.slice(0, 3).map((wf, i) => (
                                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 transition" onClick={() => openDetail(wf)}>
                                    <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">{wf.id.slice(-3)}</div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold text-slate-700 leading-tight">{wf.name}</p>
                                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{wf.lastRun}</p>
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
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Workflow" : "Create Workflow"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define automated actions triggered by a condition.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Workflow Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. Client onboarding sequence" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Trigger Condition <span className="text-rose-500">*</span></Label>
                            <Input value={form.trigger} onChange={e => setField("trigger", e.target.value)} placeholder="e.g. New client added" className={`h-10 rounded-none ${errors.trigger ? "border-rose-500" : ""}`} />
                            {errors.trigger && <p className="text-[11px] text-rose-500">{errors.trigger}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Category</Label>
                                <Select value={form.category} onValueChange={(v: any) => setField("category", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Paused">Paused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Workflow"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Workflows</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="active">Active only</SelectItem>
                                    <SelectItem value="paused">Paused only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Category</Label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All categories</SelectItem>
                                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterStatus("all"); setFilterCategory("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Workflow Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Workflow</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.id}</p>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-[11px] text-slate-400 uppercase">Trigger</p>
                                    <p className="text-sm font-semibold text-slate-900">{selected.trigger}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Category</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${CATEGORY_COLORS[selected.category] || ""}`}>{selected.category}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none ${selected.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{selected.status}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Total Runs</p><p className="font-semibold text-slate-900">{selected.runs}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Success Rate</p><p className="font-semibold text-slate-900">{selected.successRate}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Run</p><p className="font-semibold text-slate-900">{selected.lastRun}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
