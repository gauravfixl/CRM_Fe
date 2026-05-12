"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    MessageSquare, Bell, Smartphone, Search, Filter, MoreVertical, Plus, Trash2,
    PencilLine, Eye, Clock, CheckCircle2, AlertCircle, Send, PhoneCall,
    Activity, Volume2, RefreshCw, ShieldCheck, ArrowUpRight,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface Notification {
    id: number
    account: string
    phone: string
    channel: 'SMS' | 'Push' | 'In-App' | 'Voice'
    type: 'Alert' | 'Reminder' | 'System' | 'Promotion'
    message: string
    status: 'Delivered' | 'Pending' | 'Failed' | 'Muted'
    timestamp: string
    priority: 'High' | 'Medium' | 'Low'
    folder: 'active' | 'history' | 'scheduled' | 'trash'
    template?: string
}

const initialNotifications: Notification[] = [
    { id: 1, account: "Global Dynamics", phone: "+15550100123", channel: "SMS", type: "Reminder", message: "Reminder: Your contract renewal is in 15 days. View details in dashboard.", status: "Delivered", timestamp: "10 mins ago", priority: "High", folder: 'active' },
    { id: 2, account: "DataScale Inc", phone: "+15550100124", channel: "Push", type: "Alert", message: "System Update: New AI Insights engine is now live for your account.", status: "Delivered", timestamp: "45 mins ago", priority: "Medium", folder: 'active' },
    { id: 3, account: "Innova Hub", phone: "+15550100125", channel: "In-App", type: "System", message: "Support ticket #4502 has been updated by Marcus T.", status: "Pending", timestamp: "Just now", priority: "Medium", folder: 'active' },
    { id: 4, account: "Swift Apps", phone: "+15550100126", channel: "SMS", type: "Alert", message: "High usage alert: You have reached 80% of your monthly API quota.", status: "Delivered", timestamp: "2 hours ago", priority: "High", folder: 'history' },
    { id: 5, account: "Horizon Media", phone: "+15550100127", channel: "Push", type: "Promotion", message: "Quarterly Review: Schedule your session now to unlock bonus credits.", status: "Failed", timestamp: "1 day ago", priority: "Low", folder: 'history' },
    { id: 6, account: "Cloud Peak", phone: "+15550100128", channel: "Voice", type: "Alert", message: "Account Health Alert: Significant drop in Singapore region delivery.", status: "Muted", timestamp: "2 days ago", priority: "High", folder: 'trash' },
]

const smsTemplates = [
    { id: 'renewal', name: 'Renewal Reminder', body: 'Reminder: Your contract renewal is in 15 days.' },
    { id: 'quota', name: 'Quota Alert', body: 'High usage alert: You have reached 80% of your monthly quota.' },
    { id: 'maint', name: 'Maintenance Notice', body: 'Scheduled maintenance window this Sunday 02:00 UTC.' },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    phone: (v: string) => v && !/^[+\d][\d\s().-]{6,20}$/.test(v.trim()) ? "Enter a valid phone" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    maxLen: (n: number) => (v: string) => v && v.length > n ? `Must be at most ${n} characters` : "",
}

const getChannelIcon = (channel: string) => {
    switch (channel) {
        case 'SMS': return Smartphone
        case 'Push': return Bell
        case 'In-App': return MessageSquare
        case 'Voice': return Volume2
        default: return Bell
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100'
        case 'Failed': return 'bg-rose-50 text-rose-600 border-rose-100'
        case 'Muted': return 'bg-slate-50 text-slate-600 border-slate-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}

export default function SMSNotificationsPage() {
    const router = useRouter()
    const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications)
    const [search, setSearch] = React.useState("")
    const [currentFolder, setCurrentFolder] = React.useState<'active' | 'history' | 'scheduled' | 'trash'>('active')
    const [channelFilter, setChannelFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Notification | null>(null)

    const [form, setForm] = React.useState({
        account: "", phone: "", channel: "SMS" as Notification['channel'],
        type: "Reminder" as Notification['type'], priority: "Medium" as Notification['priority'],
        message: "", template: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = notifications.length
        const smsCount = notifications.filter(n => n.channel === 'SMS').length
        const deliverability = "98.2%"
        const pendingCount = notifications.filter(n => n.status === 'Pending').length
        return { total, smsCount, deliverability, pendingCount }
    }, [notifications])

    const filtered = React.useMemo(() => {
        return notifications.filter(n =>
            n.folder === currentFolder &&
            (channelFilter === "all" || n.channel === channelFilter) &&
            (n.account.toLowerCase().includes(search.toLowerCase()) ||
                n.message.toLowerCase().includes(search.toLowerCase()))
        )
    }, [notifications, search, currentFolder, channelFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const applyTemplate = (id: string) => {
        const t = smsTemplates.find(t => t.id === id)
        if (t) setForm(prev => ({ ...prev, template: id, message: t.body }))
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.account = validators.required(form.account) || validators.minLen(2)(form.account)
        if (form.channel === 'SMS' || form.channel === 'Voice') {
            errs.phone = validators.required(form.phone) || validators.phone(form.phone)
        }
        errs.message = validators.required(form.message) || validators.minLen(3)(form.message) || validators.maxLen(160)(form.message)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ account: "", phone: "", channel: "SMS", type: "Reminder", priority: "Medium", message: "", template: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (n: Notification) => {
        setEditingId(n.id)
        setForm({ account: n.account, phone: n.phone, channel: n.channel, type: n.type, priority: n.priority, message: n.message, template: n.template || "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setNotifications(notifications.map(n => n.id === editingId ? {
                ...n, account: form.account.trim(), phone: form.phone.trim(),
                channel: form.channel, type: form.type, priority: form.priority,
                message: form.message.trim(),
            } : n))
            toast.success("Notification updated")
        } else {
            const newNotif: Notification = {
                id: Date.now(),
                account: form.account.trim(),
                phone: form.phone.trim(),
                channel: form.channel,
                type: form.type,
                message: form.message.trim(),
                status: "Delivered",
                timestamp: "Just now",
                priority: form.priority,
                folder: 'active',
            }
            setNotifications([newNotif, ...notifications])
            toast.success("Notification dispatched")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, folder: 'trash' as const } : n))
        toast.success("Moved to trash")
    }

    const handlePermanentDelete = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id))
        toast.success("Notification purged")
    }

    const openDetail = (n: Notification) => { setSelected(n); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Dispatched (24h)", value: String(metrics.total), subtitle: "Active Cycles", icon: Activity, color: "violet", trend: "+12%", path: "/client-management/communication/history" },
        { title: "SMS Volume", value: String(metrics.smsCount), subtitle: "Carrier Nodes", icon: Smartphone, color: "blue", trend: "+8%", path: "/client-management/communication/broadcast" },
        { title: "Delivery Rate", value: metrics.deliverability, subtitle: "Success Ack", icon: CheckCircle2, color: "emerald", trend: "+1.4%", path: "/client-management/analytics/overview" },
        { title: "Pending Queue", value: String(metrics.pendingCount), subtitle: "Awaiting Ack", icon: Clock, color: "rose", trend: "", path: "/client-management/communication/campaigns" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
    }

    const folders = [
        { id: 'active', label: 'Alert Center', icon: Activity, count: notifications.filter(n => n.folder === 'active').length },
        { id: 'history', label: 'History', icon: Clock, count: 0 },
        { id: 'scheduled', label: 'Scheduled', icon: Clock, count: notifications.filter(n => n.folder === 'scheduled').length },
        { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
    ]

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            SMS & <span className="text-violet-600">Notifications</span>
                        </h1>
                        <Badge className="rounded-none bg-violet-50 text-violet-600 border-violet-100 border text-[10px]">
                            <ShieldCheck className="h-3 w-3 mr-1" /> Gateway Operational
                        </Badge>
                    </div>
                    <p className="text-[14px] font-medium text-slate-500">Orchestrate real-time alerts, reminders, and cross-channel notifications.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => toast.success("Gateway sync triggered")}>
                        <RefreshCw className="h-4 w-4 mr-2" />Sync
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Compose
                    </Button>
                </div>
            </div>

            {/* KPI Cards - clickable */}
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
                                            {kpi.trend && <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>}
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-2">
                    <Card className="rounded-none">
                        <CardContent className="p-3">
                            <div className="space-y-1">
                                {folders.map(f => {
                                    const FIcon = f.icon
                                    return (
                                        <button key={f.id} onClick={() => setCurrentFolder(f.id as any)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition text-[12px] font-bold ${currentFolder === f.id ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                                            <div className="flex items-center gap-2.5">
                                                <FIcon className="h-4 w-4" />
                                                <span>{f.label}</span>
                                            </div>
                                            {f.count > 0 && (
                                                <span className={`px-1.5 py-0.5 text-[9px] rounded-none ${currentFolder === f.id ? "bg-white text-violet-600" : "bg-violet-50 text-violet-700"}`}>{f.count}</span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <p className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-3">SMS Templates</p>
                                <div className="space-y-1">
                                    {smsTemplates.map(t => (
                                        <div key={t.id} className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer rounded-none" onClick={() => router.push('/client-management/communication/templates')}>
                                            <MessageSquare className="h-3 w-3 text-violet-500" />
                                            <span className="truncate">{t.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-7 space-y-4">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold capitalize">{currentFolder}</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600 border-0">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {filtered.length > 0 ? filtered.map(n => {
                                    const ChIcon = getChannelIcon(n.channel)
                                    return (
                                        <div key={n.id} className={`group relative p-5 hover:bg-slate-50/80 transition cursor-pointer border-l-4 ${n.priority === 'High' ? "border-l-rose-500 bg-rose-50/10" : "border-l-transparent"}`}
                                            onClick={() => openDetail(n)}>
                                            <div className="flex items-start gap-4">
                                                <div className="h-9 w-9 rounded-none bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                                                    <ChIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[13px] font-bold text-slate-900">{n.account}</p>
                                                            <span className={`px-1.5 py-0.5 rounded-none text-[9px] font-bold border ${getStatusColor(n.status)}`}>{n.status}</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-400">{n.timestamp}</span>
                                                    </div>
                                                    <p className="text-[12px] text-slate-600 line-clamp-2 pr-16 mb-1">{n.message}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400">{n.channel} • {n.type}</span>
                                                    </div>
                                                </div>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-none w-44">
                                                            <DropdownMenuItem onClick={() => openDetail(n)}><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEdit(n)}><PencilLine className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => toast.success("Retry dispatched")}><RefreshCw className="h-4 w-4 mr-2" /> Retry</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-rose-500 border-t mt-1" onClick={() => currentFolder === 'trash' ? handlePermanentDelete(n.id) : handleDelete(n.id)}>
                                                                <Trash2 className="h-4 w-4 mr-2" /> {currentFolder === 'trash' ? 'Purge' : 'Delete'}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div className="p-12 text-center">
                                        <AlertCircle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-slate-400">No notifications in {currentFolder}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Channel Volume</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {[
                                { name: 'SMS Carrier Load', score: 42, color: 'bg-violet-500', trend: '+12%' },
                                { name: 'Push Token Velocity', score: 88, color: 'bg-blue-500', trend: '+24%' },
                                { name: 'Voice IVR Path', score: 12, color: 'bg-rose-500', trend: '-2%' },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="text-slate-600">{s.name}</span>
                                        <span className="text-slate-900">{s.score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-none">
                                        <div className={`h-full ${s.color}`} style={{ width: `${s.score}%` }} />
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold tracking-widest h-10" onClick={() => router.push('/client-management/analytics/overview')}>
                                Full Telemetry <ArrowUpRight className="h-3 w-3 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-amber-100 bg-amber-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-amber-600 tracking-widest uppercase flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Critical Threshold
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-amber-100 rounded-none">
                                <p className="text-[12px] font-bold text-slate-800">Innova Hub Breach</p>
                                <p className="text-[10px] text-slate-500 mt-1">SLA Sync Lost: Asia-SE node reporting 400ms jitter.</p>
                            </div>
                            <Button className="w-full rounded-none bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold" onClick={() => toast.success("Engaging Tier-1 Voice Path")}>
                                <PhoneCall className="h-3.5 w-3.5 mr-2" /> Direct Call Bridge
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Compose Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-violet-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Notification" : "Compose Notification"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Send a real-time alert or reminder.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Use Template</Label>
                            <Select value={form.template} onValueChange={applyTemplate}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue placeholder="Select template (optional)" /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {smsTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account <span className="text-rose-500">*</span></Label>
                            <Input value={form.account} onChange={e => setField("account", e.target.value)} placeholder="e.g. Innova Hub" className={`h-10 rounded-none ${errors.account ? "border-rose-500" : ""}`} />
                            {errors.account && <p className="text-[11px] text-rose-500">{errors.account}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Channel</Label>
                                <Select value={form.channel} onValueChange={(v: any) => setField("channel", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="SMS">SMS</SelectItem>
                                        <SelectItem value="Push">Push</SelectItem>
                                        <SelectItem value="In-App">In-App</SelectItem>
                                        <SelectItem value="Voice">Voice</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Reminder">Reminder</SelectItem>
                                        <SelectItem value="Alert">Alert</SelectItem>
                                        <SelectItem value="System">System</SelectItem>
                                        <SelectItem value="Promotion">Promotion</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {(form.channel === 'SMS' || form.channel === 'Voice') && (
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Phone Number <span className="text-rose-500">*</span></Label>
                                <Input value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="+1 555 010 0123" className={`h-10 rounded-none ${errors.phone ? "border-rose-500" : ""}`} />
                                {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Priority</Label>
                            <Select value={form.priority} onValueChange={(v: any) => setField("priority", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Message <span className="text-rose-500">*</span></Label>
                            <Textarea value={form.message} onChange={e => setField("message", e.target.value)} placeholder="Limited to 160 characters for SMS" maxLength={160} className={`min-h-[120px] rounded-none ${errors.message ? "border-rose-500" : ""}`} />
                            <div className="flex justify-between">
                                <span className="text-[10px] text-slate-400">GSM-03.38 Encoded</span>
                                <span className={`text-[10px] font-bold ${form.message.length > 140 ? "text-rose-500" : "text-slate-400"}`}>{form.message.length} / 160</span>
                            </div>
                            {errors.message && <p className="text-[11px] text-rose-500">{errors.message}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={handleSave}>
                            <Send className="h-4 w-4 mr-2" />{editingId ? "Save" : "Dispatch"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Notifications</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Channel</Label>
                            <Select value={channelFilter} onValueChange={setChannelFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Channels</SelectItem>
                                    <SelectItem value="SMS">SMS</SelectItem>
                                    <SelectItem value="Push">Push</SelectItem>
                                    <SelectItem value="In-App">In-App</SelectItem>
                                    <SelectItem value="Voice">Voice</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setChannelFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Notification Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.account}</p>
                                    <p className="text-sm text-slate-500">{selected.phone}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Channel</p><p className="font-semibold text-slate-900">{selected.channel}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><Badge className="rounded-none">{selected.type}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getStatusColor(selected.status)}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Priority</p><p className="font-semibold text-slate-900">{selected.priority}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Timestamp</p><p className="font-semibold text-slate-900 text-sm">{selected.timestamp}</p></div>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">Message Payload</p>
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-none">
                                        <p className="text-[13px] text-slate-700">{selected.message}</p>
                                    </div>
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
