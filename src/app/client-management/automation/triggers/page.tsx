"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    Activity,
    MousePointer,
    ToggleLeft,
    Plus,
    Search,
    Filter,
    RefreshCw,
    Download,
    MoreVertical,
    Trash2,
    PencilLine,
    Eye,
    ChevronRight,
    Mail,
    MessageSquare,
    Database,
    AlertCircle,
    CheckCircle2,
    Clock,
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
import { Switch } from "@/shared/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { toast } from "@/shared/utils/toast"

interface Trigger {
    id: string
    name: string
    type: "Event" | "Threshold" | "Schedule"
    event: string
    action: string
    enabled: boolean
    fires: number
    lastFired: string
    category: string
}

interface ActionItem {
    id: string
    name: string
    description: string
    icon: React.ElementType
    category: string
    uses: number
}

const INITIAL_TRIGGERS: Trigger[] = [
    { id: "TR-001", name: "New client created", type: "Event", event: "Client added to system", action: "Send welcome email", enabled: true, fires: 142, lastFired: "2 min ago", category: "Client" },
    { id: "TR-002", name: "Health score drops", type: "Threshold", event: "Health score < 40", action: "Alert account manager", enabled: true, fires: 34, lastFired: "4 hr ago", category: "Risk" },
    { id: "TR-003", name: "Invoice 7 days overdue", type: "Schedule", event: "Invoice due date + 7 days", action: "Send reminder + escalate", enabled: true, fires: 89, lastFired: "1 day ago", category: "Finance" },
    { id: "TR-004", name: "Support ticket unresolved", type: "Threshold", event: "Ticket open for 48+ hours", action: "Escalate to manager", enabled: true, fires: 22, lastFired: "30 min ago", category: "Support" },
    { id: "TR-005", name: "Renewal 30 days before", type: "Schedule", event: "Renewal date - 30 days", action: "Initiate renewal workflow", enabled: false, fires: 67, lastFired: "3 days ago", category: "Retention" },
    { id: "TR-006", name: "NPS score submitted", type: "Event", event: "Client submits NPS survey", action: "Create follow-up task", enabled: true, fires: 55, lastFired: "2 hr ago", category: "Engagement" },
]

const INITIAL_ACTIONS: ActionItem[] = [
    { id: "ACT-001", name: "Send email", description: "Dispatch a templated email to client or team", icon: Mail, category: "Communication", uses: 284 },
    { id: "ACT-002", name: "Create task", description: "Assign a follow-up task to a team member", icon: CheckCircle2, category: "Task", uses: 192 },
    { id: "ACT-003", name: "Update field", description: "Automatically update a data field in the record", icon: Database, category: "Data", uses: 156 },
    { id: "ACT-004", name: "Send in-app notification", description: "Push a real-time alert inside the platform", icon: AlertCircle, category: "Notification", uses: 311 },
    { id: "ACT-005", name: "Trigger webhook", description: "Fire an outbound webhook to an external system", icon: Zap, category: "Integration", uses: 98 },
    { id: "ACT-006", name: "Send SMS", description: "Send an SMS to the client or assigned rep", icon: MessageSquare, category: "Communication", uses: 74 },
]

const TYPE_COLORS: Record<string, string> = {
    Event: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Threshold: "bg-rose-50 text-rose-600 border-rose-100",
    Schedule: "bg-emerald-50 text-emerald-600 border-emerald-100",
}

const CATEGORY_COLORS: Record<string, string> = {
    Client: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Risk: "bg-rose-50 text-rose-600 border-rose-100",
    Finance: "bg-amber-50 text-amber-600 border-amber-100",
    Support: "bg-violet-50 text-violet-600 border-violet-100",
    Retention: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Engagement: "bg-cyan-50 text-cyan-600 border-cyan-100",
}

const TRIGGER_TYPES = ["Event", "Threshold", "Schedule"]
const CATEGORIES = Object.keys(CATEGORY_COLORS)

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function TriggersPage() {
    const router = useRouter()
    const [triggers, setTriggers] = React.useState<Trigger[]>(INITIAL_TRIGGERS)
    const [actions] = React.useState<ActionItem[]>(INITIAL_ACTIONS)
    const [search, setSearch] = React.useState("")
    const [filterType, setFilterType] = React.useState("all")
    const [filterCategory, setFilterCategory] = React.useState("all")
    const [activeTab, setActiveTab] = React.useState<"triggers" | "actions">("triggers")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<Trigger | null>(null)
    const [isSyncing, setIsSyncing] = React.useState(false)

    const [form, setForm] = React.useState({
        name: "", type: "Event" as Trigger["type"], event: "", action: "", category: "Client", enabled: true,
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        active: triggers.filter(t => t.enabled).length,
        totalFires: triggers.reduce((a, t) => a + t.fires, 0),
        actionTypes: actions.length,
        disabled: triggers.filter(t => !t.enabled).length,
    }), [triggers, actions])

    const filtered = React.useMemo(() => {
        return triggers.filter(t => {
            const matchSearch = !search ||
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.event.toLowerCase().includes(search.toLowerCase()) ||
                t.action.toLowerCase().includes(search.toLowerCase())
            const matchType = filterType === "all" || t.type === filterType
            const matchCategory = filterCategory === "all" || t.category === filterCategory
            return matchSearch && matchType && matchCategory
        })
    }, [triggers, search, filterType, filterCategory])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.event = validators.required(form.event) || validators.minLen(3)(form.event)
        errs.action = validators.required(form.action) || validators.minLen(3)(form.action)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", type: "Event", event: "", action: "", category: "Client", enabled: true })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (t: Trigger) => {
        setEditingId(t.id)
        setForm({ name: t.name, type: t.type, event: t.event, action: t.action, category: t.category, enabled: t.enabled })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setTriggers(prev => prev.map(t => t.id === editingId ? {
                ...t,
                name: form.name.trim(),
                type: form.type,
                event: form.event.trim(),
                action: form.action.trim(),
                category: form.category,
                enabled: form.enabled,
            } : t))
            toast.success("Trigger updated")
        } else {
            const t: Trigger = {
                id: `TR-${String(triggers.length + 1).padStart(3, "0")}`,
                name: form.name.trim(),
                type: form.type,
                event: form.event.trim(),
                action: form.action.trim(),
                enabled: form.enabled,
                fires: 0,
                lastFired: "Never",
                category: form.category,
            }
            setTriggers(prev => [t, ...prev])
            toast.success("Trigger created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setTriggers(prev => prev.filter(t => t.id !== id))
        toast.success("Trigger removed")
    }

    const handleToggle = (id: string) => {
        const t = triggers.find(t => t.id === id)
        setTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t))
        toast.success(t?.enabled ? "Trigger disabled" : "Trigger enabled")
    }

    const handleUseAction = (act: ActionItem) => {
        toast.success(`Action "${act.name}" added to workflow`)
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: "Syncing trigger engine...",
            success: "All triggers synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1200)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Type", "Event", "Action", "Category", "Enabled", "Fires", "Last Fired"],
            ...triggers.map(t => [t.id, t.name, t.type, t.event, t.action, t.category, t.enabled, t.fires, t.lastFired]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "triggers.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Triggers exported")
    }

    const openDetail = (t: Trigger) => {
        setSelected(t)
        setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Active Triggers", value: String(stats.active), subtitle: `${triggers.length} total configured`, icon: Zap, color: "indigo", trend: `+${stats.active}`, path: "/client-management/automation/workflows" },
        { title: "Total Fires", value: stats.totalFires.toLocaleString(), subtitle: "All-time events", icon: Activity, color: "emerald", trend: "+18%", path: "/client-management/automation/logs" },
        { title: "Action Library", value: String(stats.actionTypes), subtitle: "Reusable actions", icon: MousePointer, color: "violet", trend: `+${stats.actionTypes}`, path: "/client-management/automation/notifications" },
        { title: "Disabled Triggers", value: String(stats.disabled), subtitle: "Awaiting review", icon: ToggleLeft, color: "amber", trend: `${stats.disabled}`, path: "/client-management/automation/playbooks" },
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
                        Triggers &amp; <span className="text-indigo-600">Actions</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Configure event-driven triggers and automate response actions across the client lifecycle.</p>
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
                        <Plus className="h-4 w-4 mr-2" /> New Trigger
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

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
                <TabsList className="rounded-none bg-white border border-slate-200 p-1 w-fit">
                    <TabsTrigger value="triggers" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Triggers</TabsTrigger>
                    <TabsTrigger value="actions" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Action Library</TabsTrigger>
                </TabsList>
            </Tabs>

            {activeTab === "triggers" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="rounded-none">
                            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-semibold">Configured Triggers</CardTitle>
                                    <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} Results</Badge>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search triggers..." value={search} onChange={e => setSearch(e.target.value)}
                                        className="pl-10 rounded-none w-64 h-9" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50">
                                    {filtered.length > 0 ? filtered.map(t => (
                                        <div key={t.id} className="px-6 py-4 hover:bg-slate-50/80 transition cursor-pointer group flex items-center gap-4" onClick={() => openDetail(t)}>
                                            <div className={`h-10 w-10 rounded-none flex items-center justify-center shrink-0 border ${TYPE_COLORS[t.type] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                                <Zap className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                                                    <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-semibold border ${TYPE_COLORS[t.type]}`}>{t.type}</span>
                                                    <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-semibold border ${CATEGORY_COLORS[t.category]}`}>{t.category}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-1">
                                                    <span className="text-slate-400">When:</span> {t.event}
                                                </p>
                                                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                                    <ChevronRight className="h-3 w-3" />
                                                    <span className="text-slate-400">Then:</span> {t.action}
                                                </p>
                                                <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-400 font-semibold">
                                                    <span>{t.fires} fires</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.lastFired}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <Switch checked={t.enabled} onCheckedChange={() => handleToggle(t.id)} />
                                                    <span className="text-[10px] font-bold text-slate-500">{t.enabled ? "On" : "Off"}</span>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-none">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(t)}>
                                                            <PencilLine className="h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(t)}>
                                                            <Eye className="h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(t.id)}>
                                                            <Trash2 className="h-4 w-4" /> Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="px-6 py-12 text-center text-sm text-slate-500">No triggers match your filters.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Type Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {TRIGGER_TYPES.map((tp) => {
                                    const list = triggers.filter(t => t.type === tp)
                                    return (
                                        <div key={tp} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-none transition" onClick={() => setFilterType(tp)}>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-9 w-9 rounded-none flex items-center justify-center border ${TYPE_COLORS[tp]}`}>
                                                    <Zap className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800 leading-none">{tp}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{list.length} triggers</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                    <Sparkles className="h-4 w-4" /> Trigger Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                    <p className="text-[11px] text-slate-600">
                                        Your <span className="text-indigo-600 font-bold">{stats.active} active</span> triggers fired {stats.totalFires.toLocaleString()} times total.
                                    </p>
                                </div>
                                <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                    <p className="text-[11px] text-slate-600">
                                        Wire triggers into workflows to chain multi-step automation.
                                    </p>
                                </div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none mt-2" onClick={() => { toast.success("Opening workflows"); router.push('/client-management/automation/workflows') }}>
                                    Build a Workflow
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Most Active</CardTitle>
                                <Activity className="h-4 w-4 text-indigo-400" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[...triggers].sort((a, b) => b.fires - a.fires).slice(0, 3).map((t, i) => (
                                    <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 transition" onClick={() => openDetail(t)}>
                                        <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">{t.id.slice(-3)}</div>
                                        <div className="flex-1">
                                            <p className="text-[12px] font-bold text-slate-700 leading-tight">{t.name}</p>
                                            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{t.fires} fires • {t.lastFired}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "actions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {actions.map(act => {
                        const ActIcon = act.icon
                        return (
                            <Card key={act.id} className="rounded-none border hover:shadow-md transition">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="h-10 w-10 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                            <ActIcon className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <Badge className="rounded-none bg-slate-100 text-slate-500">{act.category}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{act.name}</p>
                                        <p className="text-[11px] text-slate-500 mt-1">{act.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <p className="text-[11px] font-semibold text-slate-400">{act.uses} uses</p>
                                        <Button size="sm" variant="ghost" className="rounded-none text-indigo-600 hover:bg-indigo-50 text-[11px] font-bold h-8" onClick={() => handleUseAction(act)}>
                                            Use Action
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Trigger" : "Create Trigger"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define an event-driven automation.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Trigger Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. Health score drops below 40" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Trigger Type</Label>
                                <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {TRIGGER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Category</Label>
                                <Select value={form.category} onValueChange={(v: any) => setField("category", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">When this event occurs <span className="text-rose-500">*</span></Label>
                            <Input value={form.event} onChange={e => setField("event", e.target.value)} placeholder="e.g. Client health score drops below 40" className={`h-10 rounded-none ${errors.event ? "border-rose-500" : ""}`} />
                            {errors.event && <p className="text-[11px] text-rose-500">{errors.event}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Then perform this action <span className="text-rose-500">*</span></Label>
                            <Input value={form.action} onChange={e => setField("action", e.target.value)} placeholder="e.g. Alert account manager" className={`h-10 rounded-none ${errors.action ? "border-rose-500" : ""}`} />
                            {errors.action && <p className="text-[11px] text-rose-500">{errors.action}</p>}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Switch checked={form.enabled} onCheckedChange={(v) => setField("enabled", v)} />
                            <Label className="text-[12px] font-semibold">Enabled on creation</Label>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Trigger"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Triggers</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All types</SelectItem>
                                    {TRIGGER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterType("all"); setFilterCategory("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Trigger Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Trigger</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.id}</p>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase">When</p>
                                        <p className="text-sm font-semibold text-slate-900">{selected.event}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase">Then</p>
                                        <p className="text-sm font-semibold text-slate-900">{selected.action}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${TYPE_COLORS[selected.type]}`}>{selected.type}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Category</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${CATEGORY_COLORS[selected.category] || ""}`}>{selected.category}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none ${selected.enabled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{selected.enabled ? "Enabled" : "Disabled"}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Fires</p><p className="font-semibold text-slate-900">{selected.fires}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Fired</p><p className="font-semibold text-slate-900">{selected.lastFired}</p></div>
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
