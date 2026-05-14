"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Map, Compass, Flag, Wind, Search, Filter, MoreVertical, Plus,
    Trash2, PencilLine, Eye, Building2, ChevronRight, ArrowRight, Award, HeartHandshake, Lightbulb, Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface RoadmapStage {
    id: number
    account: string
    lifecycle: 'Discovery' | 'Onboarding' | 'Adoption' | 'Value Realization' | 'Advocacy'
    duration: string
    nextMilestone: string
    lastTouchpoint: string
}

const initialRoadmap: RoadmapStage[] = [
    { id: 1, account: "Global Dynamics", lifecycle: "Advocacy", duration: "1.8 years", nextMilestone: "Case Study Review", lastTouchpoint: "Yesterday" },
    { id: 2, account: "DataScale Inc", lifecycle: "Value Realization", duration: "9 months", nextMilestone: "Expansion Audit", lastTouchpoint: "3 days ago" },
    { id: 3, account: "Innova Hub", lifecycle: "Adoption", duration: "4 months", nextMilestone: "Power User Training", lastTouchpoint: "5 hours ago" },
    { id: 4, account: "Swift Apps", lifecycle: "Onboarding", duration: "2 weeks", nextMilestone: "Technical Setup", lastTouchpoint: "Last Week" },
    { id: 5, account: "Horizon Media", lifecycle: "Value Realization", duration: "1.2 years", nextMilestone: "Quarterly Review", lastTouchpoint: "2 days ago" },
]

const validators = {
    required: (v: any) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

const getLifecycleProps = (stage: string) => {
    switch (stage) {
        case 'Discovery': return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: <Compass className="h-4 w-4" /> }
        case 'Onboarding': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Wind className="h-4 w-4" /> }
        case 'Adoption': return { color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <Zap className="h-4 w-4" /> }
        case 'Value Realization': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <HeartHandshake className="h-4 w-4" /> }
        case 'Advocacy': return { color: 'bg-violet-50 text-violet-600 border-violet-100', icon: <Award className="h-4 w-4" /> }
        default: return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: <Flag className="h-4 w-4" /> }
    }
}

export default function CustomerJourneyPage() {
    const router = useRouter()
    const [roadmap, setRoadmap] = React.useState<RoadmapStage[]>(initialRoadmap)
    const [search, setSearch] = React.useState("")
    const [lifecycleFilter, setLifecycleFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<RoadmapStage | null>(null)

    const [form, setForm] = React.useState({
        account: "", lifecycle: "Discovery" as RoadmapStage['lifecycle'],
        duration: "0 months", nextMilestone: "", lastTouchpoint: "Just now",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = roadmap.length
        const advocates = roadmap.filter(r => r.lifecycle === 'Advocacy').length
        const maturing = roadmap.filter(r => r.lifecycle === 'Value Realization').length
        const onboarding = roadmap.filter(r => r.lifecycle === 'Onboarding').length
        return { total, advocates, maturing, onboarding, avgAge: "11.4mo" }
    }, [roadmap])

    const filtered = React.useMemo(() => {
        return roadmap.filter(r => {
            const matchSearch = !search || r.account.toLowerCase().includes(search.toLowerCase()) || r.nextMilestone.toLowerCase().includes(search.toLowerCase())
            const matchLifecycle = lifecycleFilter === "all" || r.lifecycle === lifecycleFilter
            return matchSearch && matchLifecycle
        })
    }, [roadmap, search, lifecycleFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.account = validators.required(form.account) || validators.minLen(2)(form.account)
        errs.duration = validators.required(form.duration)
        errs.nextMilestone = validators.required(form.nextMilestone) || validators.minLen(3)(form.nextMilestone)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ account: "", lifecycle: "Discovery", duration: "0 months", nextMilestone: "", lastTouchpoint: "Just now" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (r: RoadmapStage) => {
        setEditingId(r.id)
        setForm({ account: r.account, lifecycle: r.lifecycle, duration: r.duration, nextMilestone: r.nextMilestone, lastTouchpoint: r.lastTouchpoint })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: RoadmapStage = {
            id: editingId || Date.now(),
            account: form.account.trim(),
            lifecycle: form.lifecycle,
            duration: form.duration.trim(),
            nextMilestone: form.nextMilestone.trim(),
            lastTouchpoint: form.lastTouchpoint,
        }
        if (editingId) {
            setRoadmap(roadmap.map(r => r.id === editingId ? data : r))
            toast.success("Lifecycle updated")
        } else {
            setRoadmap([data, ...roadmap])
            toast.success("Journey started")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setRoadmap(roadmap.filter(r => r.id !== id))
        toast.success("Journey removed")
    }

    const openDetail = (r: RoadmapStage) => { setSelected(r); setIsDetailOpen(true) }

    const kpis = [
        { title: "Total Accounts", value: String(metrics.total), subtitle: "Journey Participants", icon: Map, color: "blue", path: "/client-management/customers" },
        { title: "Advocates", value: String(metrics.advocates), subtitle: "Net Promoter Potential", icon: Award, color: "violet", path: "/client-management/customers/feedback" },
        { title: "Stabilized", value: String(metrics.maturing), subtitle: "Value Realized Phase", icon: HeartHandshake, color: "emerald", path: "/client-management/customers/health" },
        { title: "Avg. Lifecycle", value: metrics.avgAge, subtitle: "Customer Tenure", icon: ChevronRight, color: "indigo", path: "/client-management/analytics/retention" },
    ]
    const cm: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Customer <span className="text-indigo-600">Journey Map</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">End-to-end lifecycle orchestration from initial discovery to brand advocacy.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Log Transition
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
                                <CardTitle className="text-base font-semibold">Client Lifecycle Matrix</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} accounts</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search by client..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Account Portfolio</th>
                                            <th className="px-6 py-3">Current Phase</th>
                                            <th className="px-6 py-3">Tenure</th>
                                            <th className="px-6 py-3">Next Milestone</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((item) => {
                                            const props = getLifecycleProps(item.lifecycle)
                                            return (
                                                <tr key={item.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(item)}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-none bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                                <Building2 className="h-5 w-5 text-indigo-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800">{item.account}</p>
                                                                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Last Sync: {item.lastTouchpoint}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-none text-[11px] font-bold border whitespace-nowrap ${props.color}`}>
                                                            {props.icon}
                                                            {item.lifecycle}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-900 italic">{item.duration}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <ArrowRight className="h-3 w-3 text-slate-300" />
                                                            <span className="text-[11px] font-bold text-slate-500">{item.nextMilestone}</span>
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
                                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(item)}>
                                                                    <PencilLine className="h-4 w-4" /> Move to Phase
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => toast.success("Playbook opened")}>
                                                                    <Lightbulb className="h-4 w-4" /> Success Playbook
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(item.id)}>
                                                                    <Trash2 className="h-4 w-4" /> Remove Tracking
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No journeys match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Lifecycle Funnel</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { stage: 'Discovery', count: 4, color: 'bg-slate-400', progress: 100 },
                                { stage: 'Onboarding', count: 6, color: 'bg-blue-500', progress: 85 },
                                { stage: 'Adoption', count: 12, color: 'bg-indigo-500', progress: 65 },
                                { stage: 'Value Realization', count: 18, color: 'bg-emerald-500', progress: 45 },
                                { stage: 'Advocacy', count: 8, color: 'bg-violet-500', progress: 25 },
                            ].map((f, i) => (
                                <div key={i} className="space-y-1.5 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => setLifecycleFilter(f.stage)}>
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-slate-600">{f.stage}</span>
                                        <span className="text-slate-900">{f.count}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 overflow-hidden">
                                        <div className={`h-full opacity-80 ${f.color}`} style={{ width: `${f.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-violet-100 bg-violet-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-violet-600 tracking-wider flex items-center gap-2 uppercase">
                                <Plus className="h-4 w-4" /> Advocacy Candidates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-violet-100 rounded-none">
                                <p className="text-sm font-bold text-slate-800">DataScale Inc</p>
                                <p className="text-[11px] font-medium text-slate-500">Met all success milestones. High NPS (9/10).</p>
                                <Button className="w-full mt-3 bg-violet-600 hover:bg-violet-700 text-white rounded-none text-[11px] h-8" onClick={() => toast.success("Invite sent to DataScale")}>
                                    Invite to Advisory Board
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Phase Velocity</CardTitle>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { name: 'Avg. Onboarding', value: '28d', icon: <Wind className="h-3 w-3 text-blue-500" /> },
                                { name: 'Trial to Value', value: '42d', icon: <HeartHandshake className="h-3 w-3 text-emerald-500" /> },
                                { name: 'Value to Advocacy', value: '180d', icon: <Award className="h-3 w-3 text-violet-500" /> },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => toast.success(`${stat.name} report opened`)}>
                                    <div className="flex items-center gap-2">
                                        {stat.icon}
                                        <span className="text-[12px] font-bold text-slate-500">{stat.name}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-900">{stat.value}</span>
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
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Transition Customer" : "Initialize Journey"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track customer lifecycle phase.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account Portfolio <span className="text-rose-500">*</span></Label>
                            <Input value={form.account} onChange={e => setField("account", e.target.value)} placeholder="e.g. Globex Corp" className={`h-10 rounded-none ${errors.account ? "border-rose-500" : ""}`} />
                            {errors.account && <p className="text-[11px] text-rose-500">{errors.account}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Lifecycle Phase</Label>
                                <Select value={form.lifecycle} onValueChange={(v: any) => setField("lifecycle", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Discovery">Discovery</SelectItem>
                                        <SelectItem value="Onboarding">Onboarding</SelectItem>
                                        <SelectItem value="Adoption">Adoption</SelectItem>
                                        <SelectItem value="Value Realization">Value Realization</SelectItem>
                                        <SelectItem value="Advocacy">Advocacy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Duration <span className="text-rose-500">*</span></Label>
                                <Input value={form.duration} onChange={e => setField("duration", e.target.value)} placeholder="e.g. 1.2 years" className={`h-10 rounded-none ${errors.duration ? "border-rose-500" : ""}`} />
                                {errors.duration && <p className="text-[11px] text-rose-500">{errors.duration}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Next Critical Milestone <span className="text-rose-500">*</span></Label>
                            <Input value={form.nextMilestone} onChange={e => setField("nextMilestone", e.target.value)} placeholder="e.g. Executive Business Review" className={`h-10 rounded-none ${errors.nextMilestone ? "border-rose-500" : ""}`} />
                            {errors.nextMilestone && <p className="text-[11px] text-rose-500">{errors.nextMilestone}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Save Roadmap"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Journeys</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Lifecycle Phase</Label>
                            <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Phases</SelectItem>
                                    <SelectItem value="Discovery">Discovery</SelectItem>
                                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                                    <SelectItem value="Adoption">Adoption</SelectItem>
                                    <SelectItem value="Value Realization">Value Realization</SelectItem>
                                    <SelectItem value="Advocacy">Advocacy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setLifecycleFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Journey Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.account}</p>
                                    <div className={`inline-flex mt-2 items-center gap-2 px-2 py-1 rounded-none text-[11px] font-bold border ${getLifecycleProps(selected.lifecycle).color}`}>
                                        {getLifecycleProps(selected.lifecycle).icon}
                                        {selected.lifecycle}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Tenure</p><p className="font-semibold text-slate-900 italic">{selected.duration}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Sync</p><p className="font-semibold text-slate-900">{selected.lastTouchpoint}</p></div>
                                    <div className="col-span-2">
                                        <p className="text-[11px] text-slate-400 uppercase">Next Milestone</p>
                                        <p className="font-semibold text-slate-900">{selected.nextMilestone}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <Button variant="outline" className="w-full h-10 rounded-none justify-start" onClick={() => { setIsDetailOpen(false); router.push('/client-management/customers/health') }}>
                                        <HeartHandshake className="h-4 w-4 mr-2" />View Health
                                    </Button>
                                    <Button variant="outline" className="w-full h-10 rounded-none justify-start" onClick={() => toast.success("Playbook started")}>
                                        <Lightbulb className="h-4 w-4 mr-2" />Success Playbook
                                    </Button>
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
