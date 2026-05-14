"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Rocket, CheckCircle2, Clock, AlertCircle, Search, Filter, MoreVertical, Plus,
    Trash2, PencilLine, Eye, Building2, Play, Timer, ClipboardCheck, Users, ChevronRight, ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface OnboardingProject {
    id: number
    account: string
    stage: 'Kickoff' | 'Technical Setup' | 'Training' | 'UAT' | 'Go Live'
    progress: number
    owner: string
    startDate: string
    targetDate: string
}

const initialProjects: OnboardingProject[] = [
    { id: 1, account: "Global Dynamics", stage: "UAT", progress: 78, owner: "Sarah J.", startDate: "2024-09-12", targetDate: "2024-10-30" },
    { id: 2, account: "DataScale Inc", stage: "Training", progress: 60, owner: "Mike W.", startDate: "2024-09-25", targetDate: "2024-11-15" },
    { id: 3, account: "Innova Hub", stage: "Technical Setup", progress: 35, owner: "Sarah J.", startDate: "2024-10-05", targetDate: "2024-12-05" },
    { id: 4, account: "Swift Apps", stage: "Kickoff", progress: 12, owner: "Emily R.", startDate: "2024-10-18", targetDate: "2024-11-28" },
    { id: 5, account: "Horizon Media", stage: "Go Live", progress: 95, owner: "Mike W.", startDate: "2024-08-30", targetDate: "2024-10-25" },
]

const validators = {
    required: (v: any) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    percent: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 || Number(v) > 100 ? "Must be 0-100" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

const getStageColor = (stage: string) => {
    switch (stage) {
        case 'Go Live': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'UAT': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'Training': return 'bg-violet-50 text-violet-600 border-violet-100'
        case 'Technical Setup': return 'bg-orange-50 text-orange-600 border-orange-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}

export default function OnboardingPage() {
    const router = useRouter()
    const [projects, setProjects] = React.useState<OnboardingProject[]>(initialProjects)
    const [search, setSearch] = React.useState("")
    const [stageFilter, setStageFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<OnboardingProject | null>(null)

    const [form, setForm] = React.useState({
        account: "", stage: "Kickoff" as OnboardingProject['stage'], owner: "",
        progress: "0", startDate: new Date().toISOString().split('T')[0], targetDate: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const filtered = React.useMemo(() => {
        return projects.filter(p => {
            const matchSearch = !search ||
                p.account.toLowerCase().includes(search.toLowerCase()) ||
                p.owner.toLowerCase().includes(search.toLowerCase())
            const matchStage = stageFilter === "all" || p.stage === stageFilter
            return matchSearch && matchStage
        })
    }, [projects, search, stageFilter])

    const metrics = React.useMemo(() => {
        const total = projects.length
        const avgProgress = total > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / total) : 0
        const activeNum = projects.filter(p => p.progress < 100).length
        const delayed = projects.filter(p => p.progress < 50).length
        return { total, avgProgress: `${avgProgress}%`, activeNum, delayed }
    }, [projects])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.account = validators.required(form.account) || validators.minLen(2)(form.account)
        errs.owner = validators.required(form.owner)
        errs.progress = validators.percent(form.progress)
        errs.startDate = validators.required(form.startDate) || validators.date(form.startDate)
        errs.targetDate = validators.required(form.targetDate) || validators.date(form.targetDate)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ account: "", stage: "Kickoff", owner: "", progress: "0", startDate: new Date().toISOString().split('T')[0], targetDate: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (p: OnboardingProject) => {
        setEditingId(p.id)
        setForm({ account: p.account, stage: p.stage, owner: p.owner, progress: String(p.progress), startDate: p.startDate, targetDate: p.targetDate })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: OnboardingProject = {
            id: editingId || Date.now(),
            account: form.account.trim(),
            stage: form.stage,
            owner: form.owner.trim(),
            progress: Number(form.progress),
            startDate: form.startDate,
            targetDate: form.targetDate,
        }
        if (editingId) {
            setProjects(projects.map(p => p.id === editingId ? data : p))
            toast.success("Project updated")
        } else {
            setProjects([data, ...projects])
            toast.success("Onboarding started")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setProjects(projects.filter(p => p.id !== id))
        toast.success("Project removed")
    }

    const openDetail = (p: OnboardingProject) => { setSelected(p); setIsDetailOpen(true) }

    const kpis = [
        { title: "Active Activation", value: String(metrics.activeNum), subtitle: "Ongoing Onboarding", icon: Rocket, color: "orange", path: "/client-management/customers" },
        { title: "Activation Velocity", value: metrics.avgProgress, subtitle: "Platform Completion", icon: Timer, color: "blue", path: "/client-management/customers/journey" },
        { title: "Onboarding Queue", value: String(metrics.total), subtitle: "Total Pipeline", icon: ClipboardCheck, color: "emerald", path: "/client-management/customers/health" },
        { title: "Delayed/At Risk", value: String(metrics.delayed), subtitle: "Needs Attention", icon: AlertCircle, color: "rose", path: "/client-management/support" },
    ]
    const cm: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        orange: { bg: "bg-gradient-to-br from-orange-50 to-orange-100/50", border: "border-orange-200/50", text: "text-orange-600", iconBg: "bg-orange-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Onboarding <span className="text-orange-600">Stage Tracker</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Monitor initial account activation and technical setup velocity.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Start Onboarding
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => {
                    const cc = cm[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
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
                                <CardTitle className="text-base font-semibold">Implementation Roadmap</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} active</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search apps..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Account Portfolio</th>
                                            <th className="px-6 py-3">Stage</th>
                                            <th className="px-6 py-3">Milestone Progress</th>
                                            <th className="px-6 py-3">Lead</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((proj) => (
                                            <tr key={proj.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(proj)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-none bg-orange-50 flex items-center justify-center border border-orange-100">
                                                            <Building2 className="h-5 w-5 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">{proj.account}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">Start: {proj.startDate}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-bold border whitespace-nowrap ${getStageColor(proj.stage)}`}>{proj.stage}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3 w-40">
                                                        <Progress value={proj.progress} className="h-2 bg-slate-100 flex-1 rounded-none" />
                                                        <span className="text-xs font-bold text-slate-900">{proj.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-none bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                                                            {proj.owner.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">{proj.owner}</span>
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
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(proj)}>
                                                                <PencilLine className="h-4 w-4" /> Move Stage
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(proj)}>
                                                                <ClipboardCheck className="h-4 w-4" /> View Checklist
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(proj.id)}>
                                                                <Trash2 className="h-4 w-4" /> Halt Onboarding
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No projects match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Stage Velocity</CardTitle>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { stage: 'Kickoff to Setup', time: '4.2 days', icon: <Play className="h-3 w-3" /> },
                                { stage: 'Setup to Training', time: '8.5 days', icon: <Users className="h-3 w-3" /> },
                                { stage: 'Training to UAT', time: '12.0 days', icon: <ClipboardCheck className="h-3 w-3" /> },
                                { stage: 'UAT to Go-Live', time: '5.1 days', icon: <Rocket className="h-3 w-3" /> },
                            ].map((v, i) => (
                                <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => toast.success(`${v.stage} analytics opened`)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-none bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                            {v.icon}
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-600">{v.stage}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-900">{v.time}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-rose-100 bg-rose-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-rose-600 tracking-wider flex items-center gap-2 uppercase">
                                <AlertCircle className="h-4 w-4" /> Critical Path Blocks
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-rose-100 rounded-none cursor-pointer hover:shadow-sm" onClick={() => toast.success("Block details opened")}>
                                <p className="text-sm font-bold text-slate-800 leading-none mb-1">Global Dynamics</p>
                                <p className="text-[11px] font-medium text-slate-500">Missing API Credentials for technical setup</p>
                                <div className="mt-3 flex items-center gap-2 text-rose-600 font-bold text-[10px]">
                                    <Clock className="h-3 w-3" /> Delayed 48h
                                </div>
                            </div>
                            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-none" onClick={() => router.push('/client-management/support')}>
                                Resolve Blocks
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Last 24h Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { text: 'UAT passed for Horizon Media', icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" /> },
                                { text: 'Kickoff deck sent to Swift Apps', icon: <ArrowRight className="h-3 w-3 text-blue-500" /> },
                                { text: 'Innova technical audit started', icon: <Play className="h-3 w-3 text-orange-500" /> },
                            ].map((act, i) => (
                                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => toast.success("Activity opened")}>
                                    <div className="h-6 w-6 rounded-none bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                        {act.icon}
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-700">{act.text}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-orange-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Update Onboarding" : "Setup Onboarding"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track account activation lifecycle.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.account} onChange={e => setField("account", e.target.value)} placeholder="e.g. Tesla Inc" className={`h-10 rounded-none ${errors.account ? "border-rose-500" : ""}`} />
                            {errors.account && <p className="text-[11px] text-rose-500">{errors.account}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Current Stage</Label>
                                <Select value={form.stage} onValueChange={(v: any) => setField("stage", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Kickoff">Kickoff</SelectItem>
                                        <SelectItem value="Technical Setup">Technical Setup</SelectItem>
                                        <SelectItem value="Training">Training</SelectItem>
                                        <SelectItem value="UAT">UAT</SelectItem>
                                        <SelectItem value="Go Live">Go Live</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Progress (%)</Label>
                                <Input type="number" min="0" max="100" value={form.progress} onChange={e => setField("progress", e.target.value)} className={`h-10 rounded-none ${errors.progress ? "border-rose-500" : ""}`} />
                                {errors.progress && <p className="text-[11px] text-rose-500">{errors.progress}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Activation Lead <span className="text-rose-500">*</span></Label>
                            <Input value={form.owner} onChange={e => setField("owner", e.target.value)} placeholder="Lead Name" className={`h-10 rounded-none ${errors.owner ? "border-rose-500" : ""}`} />
                            {errors.owner && <p className="text-[11px] text-rose-500">{errors.owner}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Start Date <span className="text-rose-500">*</span></Label>
                                <Input type="date" value={form.startDate} onChange={e => setField("startDate", e.target.value)} className={`h-10 rounded-none ${errors.startDate ? "border-rose-500" : ""}`} />
                                {errors.startDate && <p className="text-[11px] text-rose-500">{errors.startDate}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Go-Live Target <span className="text-rose-500">*</span></Label>
                                <Input type="date" value={form.targetDate} onChange={e => setField("targetDate", e.target.value)} className={`h-10 rounded-none ${errors.targetDate ? "border-rose-500" : ""}`} />
                                {errors.targetDate && <p className="text-[11px] text-rose-500">{errors.targetDate}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Start Onboarding"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-orange-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Projects</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Stage</Label>
                            <Select value={stageFilter} onValueChange={setStageFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Stages</SelectItem>
                                    <SelectItem value="Kickoff">Kickoff</SelectItem>
                                    <SelectItem value="Technical Setup">Technical Setup</SelectItem>
                                    <SelectItem value="Training">Training</SelectItem>
                                    <SelectItem value="UAT">UAT</SelectItem>
                                    <SelectItem value="Go Live">Go Live</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStageFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-orange-50">
                        <SheetTitle className="text-[18px] font-semibold">Onboarding Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.account}</p>
                                    <span className={`inline-flex mt-2 px-2 py-0.5 rounded-none text-[11px] font-bold border ${getStageColor(selected.stage)}`}>{selected.stage}</span>
                                </div>
                                <div className="pt-3 border-t space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[11px] text-slate-400 uppercase">Progress</span>
                                            <span className="text-sm font-bold text-slate-900">{selected.progress}%</span>
                                        </div>
                                        <Progress value={selected.progress} className="h-2 rounded-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Lead</p><p className="font-semibold text-slate-900">{selected.owner}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Start</p><p className="font-semibold text-slate-900">{selected.startDate}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Go-Live Target</p><p className="font-semibold text-slate-900">{selected.targetDate}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Halt
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
