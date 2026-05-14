"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Bell,
    Activity,
    CheckCircle2,
    Volume2,
    Plus,
    Search,
    Filter,
    RefreshCw,
    Download,
    MoreVertical,
    Trash2,
    PencilLine,
    Eye,
    Mail,
    MessageSquare,
    Smartphone,
    AlertCircle,
    Users,
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
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

interface NotificationRule {
    id: string
    name: string
    trigger: string
    channel: string
    audience: string
    priority: "Critical" | "High" | "Medium" | "Low"
    enabled: boolean
    sent: number
    openRate: number
    lastSent: string
}

const CHANNEL_ICONS: Record<string, React.ElementType> = {
    Email: Mail,
    SMS: MessageSquare,
    "In-app": Smartphone,
    Slack: Volume2,
    Push: Bell,
}

const INITIAL_RULES: NotificationRule[] = [
    { id: "NR-001", name: "Welcome email on signup", trigger: "New client onboarded", channel: "Email", audience: "Client", priority: "High", enabled: true, sent: 142, openRate: 68, lastSent: "2 min ago" },
    { id: "NR-002", name: "Health score alert to CSM", trigger: "Health score drops below 40", channel: "In-app", audience: "Account manager", priority: "Critical", enabled: true, sent: 34, openRate: 100, lastSent: "4 hr ago" },
    { id: "NR-003", name: "Invoice overdue reminder", trigger: "Invoice 7 days overdue", channel: "Email", audience: "Client & finance", priority: "High", enabled: true, sent: 89, openRate: 55, lastSent: "1 day ago" },
    { id: "NR-004", name: "Renewal upcoming Slack alert", trigger: "30 days before renewal", channel: "Slack", audience: "Account team", priority: "Medium", enabled: true, sent: 67, openRate: 90, lastSent: "3 days ago" },
    { id: "NR-005", name: "Ticket unresolved escalation", trigger: "Ticket open > 48 hours", channel: "In-app", audience: "Support lead", priority: "Critical", enabled: false, sent: 22, openRate: 100, lastSent: "30 min ago" },
    { id: "NR-006", name: "NPS survey completion SMS", trigger: "Contract renewal done", channel: "SMS", audience: "Client", priority: "Low", enabled: true, sent: 55, openRate: 45, lastSent: "2 hr ago" },
]

const PRIORITY_COLORS: Record<string, string> = {
    Critical: "bg-rose-50 text-rose-600 border-rose-100",
    High: "bg-amber-50 text-amber-600 border-amber-100",
    Medium: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Low: "bg-slate-50 text-slate-500 border-slate-100",
}

const CHANNEL_COLORS: Record<string, string> = {
    Email: "bg-indigo-50 text-indigo-600 border-indigo-100",
    SMS: "bg-emerald-50 text-emerald-600 border-emerald-100",
    "In-app": "bg-violet-50 text-violet-600 border-violet-100",
    Slack: "bg-amber-50 text-amber-600 border-amber-100",
    Push: "bg-cyan-50 text-cyan-600 border-cyan-100",
}

const PRIORITIES = ["Critical", "High", "Medium", "Low"]
const CHANNELS = Object.keys(CHANNEL_ICONS)

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function NotificationRulesPage() {
    const router = useRouter()
    const [rules, setRules] = React.useState<NotificationRule[]>(INITIAL_RULES)
    const [search, setSearch] = React.useState("")
    const [filterChannel, setFilterChannel] = React.useState("all")
    const [filterPriority, setFilterPriority] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<NotificationRule | null>(null)
    const [isSyncing, setIsSyncing] = React.useState(false)

    const [form, setForm] = React.useState({
        name: "", trigger: "", channel: "Email", audience: "", priority: "Medium" as NotificationRule["priority"], enabled: true,
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => {
        const active = rules.filter(r => r.enabled).length
        const totalSent = rules.reduce((a, r) => a + r.sent, 0)
        const avgOpenRate = rules.length
            ? Math.round(rules.reduce((a, r) => a + r.openRate, 0) / rules.length)
            : 0
        const channels = new Set(rules.map(r => r.channel)).size
        return { active, totalSent, avgOpenRate, channels }
    }, [rules])

    const filtered = React.useMemo(() => {
        return rules.filter(r => {
            const matchSearch = !search ||
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.trigger.toLowerCase().includes(search.toLowerCase()) ||
                r.audience.toLowerCase().includes(search.toLowerCase())
            const matchChannel = filterChannel === "all" || r.channel === filterChannel
            const matchPriority = filterPriority === "all" || r.priority === filterPriority
            return matchSearch && matchChannel && matchPriority
        })
    }, [rules, search, filterChannel, filterPriority])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.trigger = validators.required(form.trigger) || validators.minLen(3)(form.trigger)
        errs.audience = validators.required(form.audience)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", trigger: "", channel: "Email", audience: "", priority: "Medium", enabled: true })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (r: NotificationRule) => {
        setEditingId(r.id)
        setForm({ name: r.name, trigger: r.trigger, channel: r.channel, audience: r.audience, priority: r.priority, enabled: r.enabled })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setRules(prev => prev.map(r => r.id === editingId ? {
                ...r,
                name: form.name.trim(),
                trigger: form.trigger.trim(),
                channel: form.channel,
                audience: form.audience.trim(),
                priority: form.priority,
                enabled: form.enabled,
            } : r))
            toast.success("Rule updated")
        } else {
            const r: NotificationRule = {
                id: `NR-${String(rules.length + 1).padStart(3, "0")}`,
                name: form.name.trim(),
                trigger: form.trigger.trim(),
                channel: form.channel,
                audience: form.audience.trim() || "All",
                priority: form.priority,
                enabled: form.enabled,
                sent: 0,
                openRate: 0,
                lastSent: "Never",
            }
            setRules(prev => [r, ...prev])
            toast.success("Rule created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id))
        toast.success("Rule removed")
    }

    const handleToggle = (id: string) => {
        const r = rules.find(r => r.id === id)
        setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
        toast.success(r?.enabled ? "Rule disabled" : "Rule enabled")
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: "Syncing notification rules...",
            success: "All rules synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1200)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Trigger", "Channel", "Audience", "Priority", "Enabled", "Sent", "Open Rate", "Last Sent"],
            ...rules.map(r => [r.id, r.name, r.trigger, r.channel, r.audience, r.priority, r.enabled, r.sent, `${r.openRate}%`, r.lastSent]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "notification-rules.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Rules exported")
    }

    const openDetail = (r: NotificationRule) => {
        setSelected(r)
        setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Active Rules", value: String(stats.active), subtitle: `${rules.length} total configured`, icon: Bell, color: "indigo", trend: `+${stats.active}`, path: "/client-management/automation/triggers" },
        { title: "Notifications Sent", value: stats.totalSent.toLocaleString(), subtitle: "All-time deliveries", icon: Activity, color: "emerald", trend: "+22%", path: "/client-management/automation/logs" },
        { title: "Avg Open Rate", value: `${stats.avgOpenRate}%`, subtitle: "Engagement across channels", icon: CheckCircle2, color: "violet", trend: "+3%", path: "/client-management/analytics/overview" },
        { title: "Channels Configured", value: String(stats.channels), subtitle: "Delivery surfaces", icon: Volume2, color: "amber", trend: `+${stats.channels}`, path: "/client-management/automation/workflows" },
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
                        Notification <span className="text-indigo-600">Rules</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Define who gets notified, when, and through which channel.</p>
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
                        <Plus className="h-4 w-4 mr-2" /> New Rule
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
                                <CardTitle className="text-base font-semibold">Notification Rules</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} Results</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search rules..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {filtered.length > 0 ? filtered.map(r => {
                                    const ChannelIcon = CHANNEL_ICONS[r.channel] || Bell
                                    return (
                                        <div key={r.id} className="px-6 py-4 hover:bg-slate-50/80 transition cursor-pointer group flex items-center gap-4" onClick={() => openDetail(r)}>
                                            <div className={`h-10 w-10 rounded-none flex items-center justify-center shrink-0 border ${CHANNEL_COLORS[r.channel]}`}>
                                                <ChannelIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                                                    <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-semibold border ${PRIORITY_COLORS[r.priority]}`}>{r.priority}</span>
                                                    <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-semibold border ${CHANNEL_COLORS[r.channel]}`}>{r.channel}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> Trigger: {r.trigger}
                                                </p>
                                                <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-400 font-semibold">
                                                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {r.audience}</span>
                                                    <span>{r.sent} sent</span>
                                                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> {r.openRate}% open</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.lastSent}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <Switch checked={r.enabled} onCheckedChange={() => handleToggle(r.id)} />
                                                    <span className="text-[10px] font-bold text-slate-500">{r.enabled ? "On" : "Off"}</span>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-none">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(r)}>
                                                            <PencilLine className="h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(r)}>
                                                            <Eye className="h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(r.id)}>
                                                            <Trash2 className="h-4 w-4" /> Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div className="px-6 py-12 text-center text-sm text-slate-500">No notification rules match your filters.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Channel Mix</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Distribution of rules across channels</p>
                            </div>
                            <Volume2 className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {CHANNELS.map(ch => {
                                const list = rules.filter(r => r.channel === ch)
                                const progress = rules.length ? (list.length / rules.length) * 100 : 0
                                return (
                                    <div key={ch} className="space-y-2 cursor-pointer hover:bg-slate-50 p-2 -m-2 transition" onClick={() => setFilterChannel(ch)}>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{ch} <span className="text-slate-400 font-medium ml-2">{list.length} rules</span></span>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Priority Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {PRIORITIES.map(p => {
                                const list = rules.filter(r => r.priority === p)
                                return (
                                    <div key={p} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-none transition" onClick={() => setFilterPriority(p)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-none flex items-center justify-center border ${PRIORITY_COLORS[p]}`}>
                                                <AlertCircle className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 leading-none">{p}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{list.length} rules</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">{list.length}</span>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> Engagement Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Your <span className="text-indigo-600 font-bold">{stats.active} active</span> rules drive a {stats.avgOpenRate}% avg open rate.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Critical priority alerts maintain 100% delivery to escalation owners.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none mt-2" onClick={() => { toast.success("Reviewing triggers"); router.push('/client-management/automation/triggers') }}>
                                Wire up Triggers
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Deliveries</CardTitle>
                            <Clock className="h-4 w-4 text-indigo-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rules.slice(0, 3).map((r, i) => (
                                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 transition" onClick={() => openDetail(r)}>
                                    <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">{r.id.slice(-3)}</div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold text-slate-700 leading-tight">{r.name}</p>
                                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{r.channel} • {r.lastSent}</p>
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
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Notification Rule" : "Create Notification Rule"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Tell the system who to notify and how.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Rule Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. Welcome email on signup" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Trigger Condition <span className="text-rose-500">*</span></Label>
                            <Input value={form.trigger} onChange={e => setField("trigger", e.target.value)} placeholder="e.g. New client onboarded" className={`h-10 rounded-none ${errors.trigger ? "border-rose-500" : ""}`} />
                            {errors.trigger && <p className="text-[11px] text-rose-500">{errors.trigger}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Channel</Label>
                                <Select value={form.channel} onValueChange={(v: any) => setField("channel", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Priority</Label>
                                <Select value={form.priority} onValueChange={(v: any) => setField("priority", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Audience / Recipients <span className="text-rose-500">*</span></Label>
                            <Input value={form.audience} onChange={e => setField("audience", e.target.value)} placeholder="e.g. Account manager, Finance team" className={`h-10 rounded-none ${errors.audience ? "border-rose-500" : ""}`} />
                            {errors.audience && <p className="text-[11px] text-rose-500">{errors.audience}</p>}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Switch checked={form.enabled} onCheckedChange={(v) => setField("enabled", v)} />
                            <Label className="text-[12px] font-semibold">Enabled on creation</Label>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Rule"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Notification Rules</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Channel</Label>
                            <Select value={filterChannel} onValueChange={setFilterChannel}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All channels</SelectItem>
                                    {CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Priority</Label>
                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All priorities</SelectItem>
                                    {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterChannel("all"); setFilterPriority("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Rule Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Rule</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.id}</p>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-[11px] text-slate-400 uppercase">Trigger</p>
                                    <p className="text-sm font-semibold text-slate-900">{selected.trigger}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Channel</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${CHANNEL_COLORS[selected.channel]}`}>{selected.channel}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Priority</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${PRIORITY_COLORS[selected.priority]}`}>{selected.priority}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Audience</p><p className="font-semibold text-slate-900">{selected.audience}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none ${selected.enabled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{selected.enabled ? "Enabled" : "Disabled"}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Sent</p><p className="font-semibold text-slate-900">{selected.sent}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Open Rate</p><p className="font-semibold text-slate-900">{selected.openRate}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Sent</p><p className="font-semibold text-slate-900">{selected.lastSent}</p></div>
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
