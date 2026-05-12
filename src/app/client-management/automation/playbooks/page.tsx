"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    BookOpen,
    Target,
    CheckCircle2,
    Clock,
    Plus,
    Search,
    Filter,
    RefreshCw,
    Download,
    MoreVertical,
    Trash2,
    PencilLine,
    Eye,
    Play,
    Users,
    Sparkles,
    Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

interface Playbook {
    id: string
    name: string
    stage: string
    steps: number
    completionRate: number
    assignedTo: string
    status: "Active" | "Draft"
    lastUsed: string
    category: string
}

const INITIAL_PLAYBOOKS: Playbook[] = [
    { id: "PB-001", name: "New client onboarding", stage: "Onboarding", steps: 8, completionRate: 92, assignedTo: "Account team", status: "Active", lastUsed: "Today", category: "Onboarding" },
    { id: "PB-002", name: "Churn prevention protocol", stage: "Retention", steps: 5, completionRate: 78, assignedTo: "CSM team", status: "Active", lastUsed: "Yesterday", category: "Retention" },
    { id: "PB-003", name: "Upsell motion - enterprise", stage: "Expansion", steps: 6, completionRate: 65, assignedTo: "Sales team", status: "Active", lastUsed: "2 days ago", category: "Sales" },
    { id: "PB-004", name: "Executive business review", stage: "Engagement", steps: 4, completionRate: 88, assignedTo: "Account team", status: "Active", lastUsed: "1 week ago", category: "Engagement" },
    { id: "PB-005", name: "Contract renewal workflow", stage: "Renewal", steps: 7, completionRate: 0, assignedTo: "Finance & CSM", status: "Draft", lastUsed: "Never", category: "Finance" },
    { id: "PB-006", name: "Crisis escalation response", stage: "Support", steps: 3, completionRate: 100, assignedTo: "Support team", status: "Active", lastUsed: "3 days ago", category: "Support" },
]

const STAGES = ["Onboarding", "Retention", "Expansion", "Engagement", "Renewal", "Support"]

const CATEGORY_COLORS: Record<string, string> = {
    Onboarding: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Retention: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Sales: "bg-violet-50 text-violet-600 border-violet-100",
    Engagement: "bg-cyan-50 text-cyan-600 border-cyan-100",
    Finance: "bg-amber-50 text-amber-600 border-amber-100",
    Support: "bg-rose-50 text-rose-600 border-rose-100",
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 1 ? "Must be at least 1" : "",
}

export default function PlaybooksPage() {
    const router = useRouter()
    const [playbooks, setPlaybooks] = React.useState<Playbook[]>(INITIAL_PLAYBOOKS)
    const [search, setSearch] = React.useState("")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [filterStage, setFilterStage] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<Playbook | null>(null)
    const [isSyncing, setIsSyncing] = React.useState(false)

    const [form, setForm] = React.useState({
        name: "", stage: "Onboarding", steps: "1", assignedTo: "", status: "Draft" as Playbook["status"], category: "Onboarding",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => {
        const active = playbooks.filter(p => p.status === "Active").length
        const draft = playbooks.filter(p => p.status === "Draft").length
        const totalSteps = playbooks.reduce((a, p) => a + p.steps, 0)
        const avgCompletion = playbooks.length
            ? Math.round(playbooks.reduce((a, p) => a + p.completionRate, 0) / playbooks.length)
            : 0
        return { active, draft, totalSteps, avgCompletion }
    }, [playbooks])

    const filtered = React.useMemo(() => {
        return playbooks.filter(pb => {
            const matchSearch = !search ||
                pb.name.toLowerCase().includes(search.toLowerCase()) ||
                pb.stage.toLowerCase().includes(search.toLowerCase()) ||
                pb.assignedTo.toLowerCase().includes(search.toLowerCase())
            const matchStatus = filterStatus === "all" || pb.status.toLowerCase() === filterStatus
            const matchStage = filterStage === "all" || pb.stage === filterStage
            return matchSearch && matchStatus && matchStage
        })
    }, [playbooks, search, filterStatus, filterStage])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.steps = validators.required(form.steps) || validators.number(form.steps)
        errs.assignedTo = validators.required(form.assignedTo)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", stage: "Onboarding", steps: "1", assignedTo: "", status: "Draft", category: "Onboarding" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (pb: Playbook) => {
        setEditingId(pb.id)
        setForm({ name: pb.name, stage: pb.stage, steps: String(pb.steps), assignedTo: pb.assignedTo, status: pb.status, category: pb.category })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setPlaybooks(prev => prev.map(p => p.id === editingId ? {
                ...p,
                name: form.name.trim(),
                stage: form.stage,
                steps: Number(form.steps),
                assignedTo: form.assignedTo.trim(),
                status: form.status,
                category: form.category,
            } : p))
            toast.success("Playbook updated")
        } else {
            const pb: Playbook = {
                id: `PB-${String(playbooks.length + 1).padStart(3, "0")}`,
                name: form.name.trim(),
                stage: form.stage,
                steps: Number(form.steps),
                completionRate: 0,
                assignedTo: form.assignedTo.trim() || "Unassigned",
                status: form.status,
                lastUsed: "Never",
                category: form.category,
            }
            setPlaybooks(prev => [pb, ...prev])
            toast.success("Playbook created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setPlaybooks(prev => prev.filter(p => p.id !== id))
        toast.success("Playbook removed")
    }

    const handleLaunch = (pb: Playbook) => {
        setPlaybooks(prev => prev.map(p => p.id === pb.id ? { ...p, status: "Active", lastUsed: "Just now" } : p))
        toast.success(`Playbook "${pb.name}" launched`)
        setIsDetailOpen(false)
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: "Syncing playbooks...",
            success: "All playbooks synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1200)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Stage", "Steps", "Completion %", "Assigned To", "Status", "Last Used"],
            ...playbooks.map(p => [p.id, p.name, p.stage, p.steps, `${p.completionRate}%`, p.assignedTo, p.status, p.lastUsed]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "playbooks.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Playbooks exported")
    }

    const openDetail = (pb: Playbook) => {
        setSelected(pb)
        setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Active Playbooks", value: String(stats.active), subtitle: `${playbooks.length} total in library`, icon: BookOpen, color: "indigo", trend: `+${stats.active}`, path: "/client-management/automation/workflows" },
        { title: "Avg Completion", value: `${stats.avgCompletion}%`, subtitle: "Step completion across plays", icon: Target, color: "emerald", trend: "+4%", path: "/client-management/analytics/overview" },
        { title: "Total Steps", value: String(stats.totalSteps), subtitle: "Steps defined", icon: CheckCircle2, color: "violet", trend: `+${stats.totalSteps}`, path: "/client-management/automation/triggers" },
        { title: "Drafts Pending", value: String(stats.draft), subtitle: "Awaiting activation", icon: Clock, color: "amber", trend: `${stats.draft}`, path: "/client-management/automation/approvals" },
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
                        Playbook <span className="text-indigo-600">Library</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Reusable automation templates to standardize engagement motions across teams.</p>
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
                        <Plus className="h-4 w-4 mr-2" /> New Playbook
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">All Playbooks</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} Results</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search playbooks..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Playbook</th>
                                            <th className="px-6 py-3">Stage</th>
                                            <th className="px-6 py-3">Steps</th>
                                            <th className="px-6 py-3">Completion</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((pb) => (
                                            <tr key={pb.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(pb)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50">
                                                            <BookOpen className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{pb.name}</p>
                                                            <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                                                <Users className="h-3 w-3" /> {pb.assignedTo}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${CATEGORY_COLORS[pb.category] || "bg-slate-50 text-slate-500 border-slate-100"}`}>{pb.stage}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{pb.steps}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={pb.completionRate} className="w-20 h-1.5" />
                                                        <span className="text-xs font-bold text-slate-900">{pb.completionRate}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`rounded-none ${pb.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"} border`}>{pb.status}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleLaunch(pb)}>
                                                                <Play className="h-4 w-4" /> Launch
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(pb)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(pb)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(pb.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No playbooks match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Stage Distribution</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Playbooks grouped by lifecycle stage</p>
                            </div>
                            <Target className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {STAGES.map((s) => {
                                const list = playbooks.filter(p => p.stage === s)
                                const progress = playbooks.length ? (list.length / playbooks.length) * 100 : 0
                                return (
                                    <div key={s} className="space-y-2 cursor-pointer hover:bg-slate-50 p-2 -m-2 transition" onClick={() => setFilterStage(s)}>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{s} <span className="text-slate-400 font-medium ml-2">{list.length} plays</span></span>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">High Performing Plays</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...playbooks].sort((a, b) => b.completionRate - a.completionRate).slice(0, 4).map((pb, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-none transition" onClick={() => openDetail(pb)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-none bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
                                            {pb.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{pb.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{pb.steps} steps</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">{pb.completionRate}%</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{pb.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 rounded-none mt-3" onClick={() => router.push('/client-management/automation/workflows')}>
                                View All Workflows
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> Playbook Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Onboarding playbooks deliver <span className="text-indigo-600 font-bold">{stats.avgCompletion}%</span> avg completion across {stats.totalSteps} defined steps.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    {stats.draft} draft plays are ready for review and activation.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none mt-2" onClick={() => { toast.success("Browsing notifications"); router.push('/client-management/automation/notifications') }}>
                                Explore Notification Rules
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Playbook" : "Create Playbook"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">A reusable template for client engagement motions.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Playbook Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. New client onboarding" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Stage</Label>
                                <Select value={form.stage} onValueChange={(v: any) => setField("stage", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Steps <span className="text-rose-500">*</span></Label>
                                <Input type="number" min="1" value={form.steps} onChange={e => setField("steps", e.target.value)} placeholder="5" className={`h-10 rounded-none ${errors.steps ? "border-rose-500" : ""}`} />
                                {errors.steps && <p className="text-[11px] text-rose-500">{errors.steps}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Assigned Team <span className="text-rose-500">*</span></Label>
                            <Input value={form.assignedTo} onChange={e => setField("assignedTo", e.target.value)} placeholder="e.g. Account team" className={`h-10 rounded-none ${errors.assignedTo ? "border-rose-500" : ""}`} />
                            {errors.assignedTo && <p className="text-[11px] text-rose-500">{errors.assignedTo}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Category</Label>
                                <Select value={form.category} onValueChange={(v: any) => setField("category", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {Object.keys(CATEGORY_COLORS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Playbook"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Playbooks</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="active">Active only</SelectItem>
                                    <SelectItem value="draft">Drafts only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Stage</Label>
                            <Select value={filterStage} onValueChange={setFilterStage}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All stages</SelectItem>
                                    {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterStatus("all"); setFilterStage("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Playbook Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Playbook</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.id} • {selected.assignedTo}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Stage</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${CATEGORY_COLORS[selected.category] || ""}`}>{selected.stage}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none ${selected.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{selected.status}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Total Steps</p><p className="font-semibold text-slate-900">{selected.steps}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Completion</p><p className="font-semibold text-slate-900">{selected.completionRate}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Used</p><p className="font-semibold text-slate-900">{selected.lastUsed}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Assigned</p><p className="font-semibold text-slate-900">{selected.assignedTo}</p></div>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <p className="text-[11px] text-slate-400 uppercase">Progress</p>
                                    <Progress value={selected.completionRate} className="h-2 bg-slate-100" />
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => handleLaunch(selected)}>
                                    <Play className="h-4 w-4 mr-2" />Launch
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
