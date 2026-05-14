"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Mail, Send, Inbox, Clock, AlertCircle, Search, Filter, MoreVertical, Plus, Trash2,
    PencilLine, Eye, Paperclip, FileText, ArrowUpRight, RefreshCw, ShieldCheck,
    Reply, Forward, History, Star,
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

interface EmailMessage {
    id: number
    sender: string
    recipient: string
    subject: string
    content: string
    status: 'Sent' | 'Draft' | 'Scheduled' | 'Failed' | 'Incoming'
    priority: 'High' | 'Medium' | 'Low'
    date: string
    folder: 'inbox' | 'sent' | 'drafts' | 'scheduled' | 'trash'
    isStarred?: boolean
    isRead?: boolean
    template?: string
}

const initialEmails: EmailMessage[] = [
    { id: 1, sender: "Sarah J.", recipient: "client@globaldynamics.com", subject: "Quarterly Business Review Follow-up", content: "Hi team, following up on our discussion regarding the scalability metrics for the upcoming rollout. The architecture seems solid and we are ready to move forward.", status: "Sent", priority: "High", date: "2024-10-15 10:30 AM", folder: 'sent', isStarred: true, isRead: true },
    { id: 2, sender: "Mike W.", recipient: "team@datascale.io", subject: "Beta Feature Invitation: AI Insights", content: "We are excited to invite DataScale to our early access program for the new AI engine that predicts churn before it happens.", status: "Scheduled", priority: "Medium", date: "2024-10-18 09:00 AM", folder: 'scheduled', isRead: true },
    { id: 3, sender: "Sarah J.", recipient: "ops@innovahub.com", subject: "API Integration Credentials", content: "The production API keys for your instance have been generated. Please find the details below. Remember to rotate these every 90 days.", status: "Sent", priority: "High", date: "2024-10-14 04:15 PM", folder: 'sent', isRead: true },
    { id: 4, sender: "Emily R.", recipient: "ceo@swiftapps.io", subject: "Account Activation Checklist", content: "Welcome aboard! Here is the initial checklist to get your team started. We need the signed MSA by EOD Friday.", status: "Draft", priority: "Low", date: "2024-10-16 11:20 AM", folder: 'drafts', isRead: false },
    { id: 5, sender: "Mike W.", recipient: "info@horizonmedia.com", subject: "Service Maintenance Window", content: "Please be advised that there will be a brief maintenance window this Sunday starting at 02:00 AM UTC.", status: "Failed", priority: "Medium", date: "2024-10-12 02:00 AM", folder: 'sent', isRead: true },
    { id: 6, sender: "Global Dynamics", recipient: "Account Team", subject: "Urgent: Infrastructure Query", content: "We are seeing some latency in the Singapore region. Can someone investigate?", status: "Incoming", priority: "High", date: "2024-10-16 02:45 PM", folder: 'inbox', isRead: false },
]

const templateOptions = [
    { id: 'qbr', name: 'Executive QBR Invitation', subject: 'Quarterly Business Review', content: 'Hello {{name}},\n\nWe would like to invite you to our quarterly business review session.' },
    { id: 'renewal', name: 'Renewal Reminder', subject: 'Your contract renewal is approaching', content: 'Hi,\n\nYour subscription renewal is due in 15 days. Please review the attached terms.' },
    { id: 'onboard', name: 'Onboarding Welcome', subject: 'Welcome to our platform', content: 'Welcome aboard! Here are your initial onboarding resources.' },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    email: (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "Enter a valid email" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Sent': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'Draft': return 'bg-slate-50 text-slate-600 border-slate-100'
        case 'Failed': return 'bg-rose-50 text-rose-600 border-rose-100'
        case 'Incoming': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}

export default function EmailCenterPage() {
    const router = useRouter()
    const [emails, setEmails] = React.useState<EmailMessage[]>(initialEmails)
    const [search, setSearch] = React.useState("")
    const [currentFolder, setCurrentFolder] = React.useState<'inbox' | 'sent' | 'drafts' | 'scheduled' | 'trash'>('inbox')

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<EmailMessage | null>(null)
    const [priorityFilter, setPriorityFilter] = React.useState("all")

    const [form, setForm] = React.useState({
        recipient: "", subject: "", content: "",
        priority: "Medium" as EmailMessage['priority'],
        template: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = emails.length
        const unread = emails.filter(e => e.folder === 'inbox' && !e.isRead).length
        const scheduled = emails.filter(e => e.folder === 'scheduled').length
        const failed = emails.filter(e => e.status === 'Failed').length
        return { total, unread, scheduled, failed }
    }, [emails])

    const filtered = React.useMemo(() => {
        return emails.filter(e =>
            e.folder === currentFolder &&
            (priorityFilter === "all" || e.priority === priorityFilter) &&
            (e.subject.toLowerCase().includes(search.toLowerCase()) ||
                e.recipient.toLowerCase().includes(search.toLowerCase()) ||
                e.sender.toLowerCase().includes(search.toLowerCase()))
        )
    }, [emails, search, currentFolder, priorityFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const applyTemplate = (id: string) => {
        const t = templateOptions.find(t => t.id === id)
        if (t) {
            setForm(prev => ({ ...prev, template: id, subject: t.subject, content: t.content }))
        }
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.recipient = validators.required(form.recipient) || validators.email(form.recipient)
        errs.subject = validators.required(form.subject) || validators.minLen(3)(form.subject)
        errs.content = validators.required(form.content) || validators.minLen(5)(form.content)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ recipient: "", subject: "", content: "", priority: "Medium", template: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (e: EmailMessage) => {
        setEditingId(e.id)
        setForm({ recipient: e.recipient, subject: e.subject, content: e.content, priority: e.priority, template: e.template || "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setEmails(emails.map(e => e.id === editingId ? {
                ...e, recipient: form.recipient.trim(), subject: form.subject.trim(),
                content: form.content.trim(), priority: form.priority,
            } : e))
            toast.success("Email updated")
        } else {
            const newEmail: EmailMessage = {
                id: Date.now(),
                sender: "System Admin",
                recipient: form.recipient.trim(),
                subject: form.subject.trim(),
                content: form.content.trim(),
                status: "Sent",
                priority: form.priority,
                date: new Date().toLocaleString(),
                folder: 'sent',
                isRead: true,
            }
            setEmails([newEmail, ...emails])
            toast.success("Email dispatched")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setEmails(emails.map(e => e.id === id ? { ...e, folder: 'trash' as const } : e))
        toast.success("Email moved to trash")
    }

    const handlePermanentDelete = (id: number) => {
        setEmails(emails.filter(e => e.id !== id))
        toast.success("Email permanently deleted")
    }

    const openDetail = (e: EmailMessage) => {
        setSelected(e)
        setEmails(emails.map(em => em.id === e.id ? { ...em, isRead: true } : em))
        setIsDetailOpen(true)
    }

    const toggleStar = (id: number, ev: React.MouseEvent) => {
        ev.stopPropagation()
        setEmails(emails.map(e => e.id === id ? { ...e, isStarred: !e.isStarred } : e))
    }

    const kpiCards = [
        { title: "Unread Inbox", value: String(metrics.unread), subtitle: "Awaiting Reply", icon: Inbox, color: "indigo", trend: `+${metrics.unread}`, path: "/client-management/communication/history" },
        { title: "Scheduled", value: String(metrics.scheduled), subtitle: "Queued Dispatch", icon: Clock, color: "blue", trend: "+8%", path: "/client-management/communication/campaigns" },
        { title: "Engagement", value: "74.8%", subtitle: "Open Rate", icon: ArrowUpRight, color: "emerald", trend: "+3%", path: "/client-management/analytics/overview" },
        { title: "Templates", value: String(templateOptions.length), subtitle: "Active Library", icon: FileText, color: "amber", trend: "", path: "/client-management/communication/templates" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    const folders = [
        { id: 'inbox', label: 'Inbox', icon: Inbox, count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
        { id: 'sent', label: 'Sent', icon: Send, count: 0 },
        { id: 'scheduled', label: 'Scheduled', icon: Clock, count: emails.filter(e => e.folder === 'scheduled').length },
        { id: 'drafts', label: 'Drafts', icon: FileText, count: emails.filter(e => e.folder === 'drafts').length },
        { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
    ]

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Email <span className="text-indigo-600">Center</span>
                        </h1>
                        <Badge className="rounded-none bg-emerald-50 text-emerald-600 border-emerald-100 border text-[10px]">
                            <ShieldCheck className="h-3 w-3 mr-1" /> G-Suite Active
                        </Badge>
                    </div>
                    <p className="text-[14px] font-medium text-slate-500">Orchestrate enterprise outreach and monitor engagement across mail protocols.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => toast.success("Mail sync triggered")}>
                        <RefreshCw className="h-4 w-4 mr-2" />Sync
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
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
                {/* Sidebar */}
                <div className="lg:col-span-2">
                    <Card className="rounded-none">
                        <CardContent className="p-3">
                            <div className="space-y-1">
                                {folders.map(f => {
                                    const FIcon = f.icon
                                    return (
                                        <button
                                            key={f.id}
                                            onClick={() => setCurrentFolder(f.id as any)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition text-[12px] font-bold ${currentFolder === f.id ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <FIcon className="h-4 w-4" />
                                                <span>{f.label}</span>
                                            </div>
                                            {f.count > 0 && (
                                                <span className={`px-1.5 py-0.5 text-[9px] rounded-none ${currentFolder === f.id ? "bg-white text-indigo-600" : "bg-indigo-50 text-indigo-700"}`}>{f.count}</span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <p className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-3">Templates</p>
                                <div className="space-y-1">
                                    {templateOptions.map(t => (
                                        <div key={t.id} className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer rounded-none" onClick={() => router.push('/client-management/communication/templates')}>
                                            <FileText className="h-3 w-3 text-indigo-500" />
                                            <span className="truncate">{t.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Email List */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold capitalize">{currentFolder}</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600 border-0">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search emails..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {filtered.length > 0 ? filtered.map(email => (
                                    <div key={email.id}
                                        className={`group relative p-5 hover:bg-slate-50/80 transition cursor-pointer border-l-4 ${!email.isRead ? "border-l-indigo-500 bg-indigo-50/10" : "border-l-transparent"}`}
                                        onClick={() => openDetail(email)}>
                                        <div className="flex items-start gap-4">
                                            <button onClick={(e) => toggleStar(email.id, e)} className="mt-0.5">
                                                <Star className={`h-4 w-4 ${email.isStarred ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-7 w-7 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                            {(currentFolder === 'sent' ? email.recipient : email.sender).charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className={`text-[13px] ${!email.isRead ? "font-bold text-slate-900" : "font-semibold text-slate-600"}`}>
                                                            {currentFolder === 'sent' ? `To: ${email.recipient}` : email.sender}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold border ${getStatusColor(email.status)}`}>{email.status}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400">{email.date}</span>
                                                </div>
                                                <p className={`text-[13px] truncate pr-16 mb-1 ${!email.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>{email.subject}</p>
                                                <p className="text-[11px] text-slate-400 line-clamp-1 pr-16">{email.content}</p>
                                            </div>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-none h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-none w-44">
                                                        <DropdownMenuItem onClick={() => openDetail(email)}><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEdit(email)}><PencilLine className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setForm({ recipient: email.sender, subject: `Re: ${email.subject}`, content: `\n\n--- Original ---\n${email.content}`, priority: email.priority, template: "" }); setEditingId(null); setIsFormOpen(true) }}>
                                                            <Reply className="h-4 w-4 mr-2" /> Reply
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast.success("Forward initiated")}><Forward className="h-4 w-4 mr-2" /> Forward</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-500 border-t mt-1" onClick={() => currentFolder === 'trash' ? handlePermanentDelete(email.id) : handleDelete(email.id)}>
                                                            <Trash2 className="h-4 w-4 mr-2" /> {currentFolder === 'trash' ? 'Purge' : 'Delete'}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center">
                                        <Mail className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-slate-400">No emails in {currentFolder}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Mail Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {[
                                { name: 'Dispatch Integrity', score: 98, color: 'bg-emerald-500', trend: '+4%' },
                                { name: 'Response Velocity', score: 84, color: 'bg-indigo-500', trend: '+12%' },
                                { name: 'Segment Penetration', score: 65, color: 'bg-amber-500', trend: '-2%' },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                        <span className="text-slate-600">{s.name}</span>
                                        <span className="text-slate-900">{s.score}/100</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-none">
                                        <div className={`h-full ${s.color}`} style={{ width: `${s.score}%` }} />
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold tracking-widest h-10" onClick={() => router.push('/client-management/analytics/overview')}>
                                Audit Performance
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-widest uppercase">AI Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[10px] font-bold text-emerald-600 mb-1">Peak Sync Window</p>
                                <p className="text-[12px] font-bold text-slate-800">Tue - Wed | 09:30 AM</p>
                            </div>
                            <div className="flex items-start gap-2 p-2">
                                <AlertCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-slate-600">High volatility in <span className="text-indigo-600 font-bold">Asia Pacific</span>. Shift outreach to UTC+8.</p>
                            </div>
                            <Button className="w-full rounded-none bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { toast.success("AI optimization running"); router.push('/client-management/analytics/overview') }}>
                                Run Optimization
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Compose / Edit Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Email" : "Compose Email"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Send a new message to your clients.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Use Template</Label>
                            <Select value={form.template} onValueChange={applyTemplate}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue placeholder="Select template (optional)" /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {templateOptions.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">To <span className="text-rose-500">*</span></Label>
                            <Input value={form.recipient} onChange={e => setField("recipient", e.target.value)} placeholder="recipient@example.com" className={`h-10 rounded-none ${errors.recipient ? "border-rose-500" : ""}`} />
                            {errors.recipient && <p className="text-[11px] text-rose-500">{errors.recipient}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Subject <span className="text-rose-500">*</span></Label>
                            <Input value={form.subject} onChange={e => setField("subject", e.target.value)} placeholder="Email subject line" className={`h-10 rounded-none ${errors.subject ? "border-rose-500" : ""}`} />
                            {errors.subject && <p className="text-[11px] text-rose-500">{errors.subject}</p>}
                        </div>
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
                            <Textarea value={form.content} onChange={e => setField("content", e.target.value)} placeholder="Compose your message..." className={`min-h-[160px] rounded-none ${errors.content ? "border-rose-500" : ""}`} />
                            {errors.content && <p className="text-[11px] text-rose-500">{errors.content}</p>}
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-none cursor-pointer" onClick={() => toast.success("Attachment dialog opened")}>
                            <Paperclip className="h-4 w-4 text-slate-500" />
                            <span className="text-[11px] font-semibold text-slate-600">Attach files</span>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            <Send className="h-4 w-4 mr-2" />{editingId ? "Save" : "Send"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Emails</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Priority</Label>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setPriorityFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Email Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">From / To</p>
                                    <p className="text-sm font-semibold text-slate-900">{selected.sender}</p>
                                    <p className="text-sm text-slate-500">{selected.recipient}</p>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Subject</p>
                                    <p className="text-base font-semibold text-slate-900">{selected.subject}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 border-t pt-3">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getStatusColor(selected.status)}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Priority</p><Badge className="rounded-none">{selected.priority}</Badge></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Date</p><p className="font-semibold text-slate-900 text-sm">{selected.date}</p></div>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">Message</p>
                                    <p className="text-[13px] text-slate-700 whitespace-pre-wrap">{selected.content}</p>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><History className="h-3 w-3" /> Audit Trail</p>
                                    <div className="text-[11px] text-slate-500">Tracking ID: COMM-{selected.id}</div>
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
