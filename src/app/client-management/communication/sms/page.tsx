"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    MessageSquare,
    Bell,
    Smartphone,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    Clock,
    CheckCircle2,
    AlertCircle,
    Zap,
    Send,
    PhoneCall,
    History,
    ChevronRight,
    ArrowUpRight,
    SearchIcon,
    RefreshCw,
    ShieldCheck,
    X,
    LayoutDashboard,
    Activity,
    FileText,
    Volume2,
    Settings2,
    Check
} from "lucide-react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Textarea } from "@/shared/components/ui/textarea"
import { useToast } from "@/shared/components/ui/use-toast"
import { Badge } from "@/shared/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/shared/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"

// Types
interface Notification {
    id: number;
    account: string;
    channel: 'SMS' | 'Push' | 'In-App' | 'Voice';
    type: 'Alert' | 'Reminder' | 'System' | 'Promotion';
    message: string;
    status: 'Delivered' | 'Pending' | 'Failed' | 'Muted';
    timestamp: string;
    priority: 'High' | 'Medium' | 'Low';
    folder: 'active' | 'history' | 'scheduled' | 'trash';
}

const initialNotifications: Notification[] = [
    { id: 1, account: "Global Dynamics", channel: "SMS", type: "Reminder", message: "Reminder: Your contract renewal is in 15 days. View details in dashboard.", status: "Delivered", timestamp: "10 mins ago", priority: "High", folder: 'active' },
    { id: 2, account: "DataScale Inc", channel: "Push", type: "Alert", message: "System Update: New AI Insights engine is now live for your account.", status: "Delivered", timestamp: "45 mins ago", priority: "Medium", folder: 'active' },
    { id: 3, account: "Innova Hub", channel: "In-App", type: "System", message: "Support ticket #4502 has been updated by Marcus T.", status: "Pending", timestamp: "Just now", priority: "Medium", folder: 'active' },
    { id: 4, account: "Swift Apps", channel: "SMS", type: "Alert", message: "High usage alert: You have reached 80% of your monthly API quota.", status: "Delivered", timestamp: "2 hours ago", priority: "High", folder: 'history' },
    { id: 5, account: "Horizon Media", channel: "Push", type: "Promotion", message: "Quarterly Review: Schedule your session now to unlock bonus credits.", status: "Failed", timestamp: "1 day ago", priority: "Low", folder: 'history' },
    { id: 6, account: "Cloud Peak", channel: "Voice", type: "Alert", message: "Account Health Alert: Significant drop in Singapore region delivery.", status: "Muted", timestamp: "2 days ago", priority: "High", folder: 'trash' },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        violet: "from-violet-50 to-violet-100/50 border-violet-200/50 text-violet-600",
        indigo: "from-indigo-50 to-indigo-100/50 border-indigo-200/50 text-indigo-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        rose: "from-rose-50 to-rose-100/50 border-rose-200/50 text-rose-600",
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
    }
    const currentClasses = colorClasses[color] || colorClasses.violet
    return (
        <Card className={cn("bg-gradient-to-br border shadow-none transition-all hover:shadow-md", (currentClasses || "").split(' ').slice(0, 3).join(' '))}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide font-outfit mb-2">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight leading-none">{value}</h3>
                        <p className="mt-2 text-xs font-medium text-slate-400 font-outfit">{subValue}</p>
                    </div>
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-white/60 shadow-sm border border-white/50", (currentClasses || "").split(' ').pop())}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function SMSNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const [search, setSearch] = useState("")
    const [currentFolder, setCurrentFolder] = useState<'active' | 'history' | 'scheduled' | 'trash'>('active')
    const [selectedEntries, setSelectedEntries] = useState<number[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [activeNotification, setActiveNotification] = useState<Notification | null>(null)
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<Notification>>({
        account: '',
        channel: 'SMS',
        type: 'Reminder',
        message: '',
        status: 'Delivered',
        priority: 'Medium',
        timestamp: 'Just now',
        folder: 'active'
    })

    const metrics = useMemo(() => {
        const total = notifications.length
        const smsCount = notifications.filter(n => n.channel === 'SMS').length
        const deliverability = "98.2%"
        const pendingCount = notifications.filter(n => n.status === 'Pending').length

        return { total, smsCount, deliverability, pendingCount }
    }, [notifications])

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n =>
            n.folder === currentFolder &&
            (n.account.toLowerCase().includes(search.toLowerCase()) ||
                n.message.toLowerCase().includes(search.toLowerCase()))
        )
    }, [notifications, search, currentFolder])

    const handleDelete = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, folder: 'trash' } as Notification : n))
        toast({ title: "Archived to Trash", description: "Entry has been removed from active dispatch." })
    }

    const handlePermanentDelete = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
        toast({ title: "Entry Purged", description: "Critical log has been permanently deleted." })
    }

    const handleSave = () => {
        if (!formData.account || !formData.message) return

        if (editingNotification) {
            setNotifications(prev => prev.map(n => n.id === editingNotification.id ? { ...n, ...formData } as Notification : n))
            toast({ title: "Entry Refined", description: "Notification payload updated successfully." })
        } else {
            const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1
            setNotifications(prev => [{ ...formData, id: newId, folder: 'active' } as Notification, ...prev])
            toast({ title: "Gateway Dispatch", description: "Push notification committed to production servers." })
        }
        setIsDialogOpen(false)
        setEditingNotification(null)
        setFormData({ account: '', channel: 'SMS', type: 'Reminder', message: '', status: 'Delivered', priority: 'Medium', timestamp: 'Just now', folder: 'active' })
    }

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'SMS': return <Smartphone className="h-4 w-4" />
            case 'Push': return <Bell className="h-4 w-4" />
            case 'In-App': return <MessageSquare className="h-4 w-4" />
            case 'Voice': return <Volume2 className="h-4 w-4" />
            default: return <Zap className="h-4 w-4" />
        }
    }

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'High': return 'text-rose-600 bg-rose-50 border-rose-100'
            case 'Medium': return 'text-violet-600 bg-violet-50 border-violet-100'
            default: return 'text-slate-500 bg-slate-50 border-slate-100'
        }
    }

    const toggleSelect = (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedEntries(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const selectAll = () => {
        if (selectedEntries.length === filteredNotifications.length) {
            setSelectedEntries([])
        } else {
            setSelectedEntries(filteredNotifications.map(n => n.id))
        }
    }

    const folders = [
        { id: 'active', label: 'Alert Center', icon: <Activity className="h-4 w-4" />, count: notifications.filter(n => n.folder === 'active').length },
        { id: 'history', label: 'Delivery Vault', icon: <History className="h-4 w-4" /> },
        { id: 'scheduled', label: 'Queued Jobs', icon: <Clock className="h-4 w-4" />, count: notifications.filter(n => n.folder === 'scheduled').length },
        { id: 'trash', label: 'Purged Logs', icon: <Trash2 className="h-4 w-4" /> },
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit text-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-outfit">
                            SMS & <span className="text-violet-600">Notifications</span>
                        </h1>
                        <Badge variant="outline" className="bg-violet-50 text-violet-600 border-violet-100 font-bold px-2 py-0.5 text-[10px] flex items-center gap-1.5 tracking-wider font-outfit">
                            <ShieldCheck className="h-3.5 w-3.5" /> Gateway Operational
                        </Badge>
                    </div>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Orchestrate real-time alerts, reminders, and cross-channel system notifications.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 h-11 w-11 text-slate-400 hover:text-violet-600 hover:border-violet-100 transition-all bg-white" onClick={() => toast({ title: "Gateway Ping", description: "SMS nodes are responding with <20ms latency." })}>
                                    <RefreshCw className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="font-outfit text-xs font-bold">Health Check</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) { setEditingNotification(null); setFormData({ account: '', channel: 'SMS', type: 'Reminder', message: '', status: 'Delivered', priority: 'Medium', timestamp: 'Just now', folder: 'active' }) }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-violet-600/20 gap-2 transition-all hover:scale-[1.02]">
                                <Plus className="h-5 w-5" /> Execute Push
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[650px] font-outfit rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="px-8 py-6 bg-slate-50/80 border-b border-slate-100">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2 font-outfit">
                                    <Bell className="h-5 w-5 text-violet-600" />
                                    {editingNotification ? 'Modify Notification Logic' : 'Rapid Gateway Dispatch'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="px-8 py-8 grid gap-6 bg-white">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Recipient Account</Label>
                                        <Input
                                            value={formData.account}
                                            onChange={e => setFormData({ ...formData, account: e.target.value })}
                                            placeholder="e.g. Innova Hub"
                                            className="h-11 rounded-xl border-slate-200 focus:ring-violet-500/10 focus:border-violet-400 font-medium font-outfit"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Prime Channel</Label>
                                        <Select value={formData.channel} onValueChange={(v: any) => setFormData({ ...formData, channel: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 font-medium font-outfit"><SelectValue placeholder="Channel" /></SelectTrigger>
                                            <SelectContent className="rounded-xl font-outfit">
                                                <SelectItem value="SMS" className="font-bold text-violet-600">SMS: Carrier Relay</SelectItem>
                                                <SelectItem value="Push" className="font-bold text-blue-600">Push: App Token</SelectItem>
                                                <SelectItem value="In-App" className="font-bold text-emerald-600">In-App: Modal Bar</SelectItem>
                                                <SelectItem value="Voice" className="font-bold text-rose-600">Voice: IVR Call</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Dispatch Taxonomy</Label>
                                        <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 font-medium font-outfit"><SelectValue placeholder="Category" /></SelectTrigger>
                                            <SelectContent className="rounded-xl font-outfit">
                                                <SelectItem value="Reminder" className="font-medium">Routine: Reminder</SelectItem>
                                                <SelectItem value="Alert" className="font-bold text-rose-600">High: Critical Alert</SelectItem>
                                                <SelectItem value="System" className="font-medium">System: Operational</SelectItem>
                                                <SelectItem value="Promotion" className="font-medium text-amber-600">Growth: Promotion</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">SLA Priority</Label>
                                        <Select value={formData.priority} onValueChange={(v: any) => setFormData({ ...formData, priority: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 font-medium font-outfit"><SelectValue placeholder="Priority" /></SelectTrigger>
                                            <SelectContent className="rounded-xl font-outfit">
                                                <SelectItem value="High" className="font-bold">Urgent Execution</SelectItem>
                                                <SelectItem value="Medium" className="font-medium">Standard Pipeline</SelectItem>
                                                <SelectItem value="Low" className="font-medium">Best Effort / Batch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700 ml-1 font-outfit">Notification Payload</Label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Limited to 160 characters for SMS compliance..."
                                        className="min-h-[120px] rounded-xl border-slate-200 focus:ring-violet-500/10 focus:border-violet-400 font-medium p-4 font-outfit"
                                        maxLength={160}
                                    />
                                    <div className="flex justify-between items-center px-1">
                                        <p className="text-[10px] font-bold text-slate-400 italic font-outfit">GSM-03.38 Encoded</p>
                                        <p className={cn("text-[10px] font-bold", (formData.message?.length || 0) > 140 ? "text-rose-500" : "text-slate-400")}>
                                            {formData.message?.length || 0} / 160
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 gap-3">
                                <Button variant="ghost" className="rounded-xl font-bold bg-white border border-slate-200 px-6 h-11 font-outfit" onClick={() => setIsDialogOpen(false)}>Queue Draft</Button>
                                <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8 h-11 font-bold shadow-lg shadow-violet-600/20 font-outfit" onClick={handleSave}>
                                    <Send className="h-4 w-4 mr-2" /> Launch Dispatch
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Real-time Dispatch" value={metrics.total} subValue="Active Cycles (24h)" icon={Activity} color="violet" />
                <MetricBox title="SMS Hub Capacity" value={metrics.smsCount} subValue="Live Carrier Nodes" icon={Smartphone} color="blue" />
                <MetricBox title="Delivery Integrity" value={metrics.deliverability} subValue="Success Confirmation" icon={CheckCircle2} color="emerald" />
                <MetricBox title="Queue Latency" value={metrics.pendingCount} subValue="Pending Ack" icon={Clock} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Side Nav */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden p-3 h-fit sticky top-8">
                        <div className="space-y-1">
                            {folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => { setCurrentFolder(folder.id as any); setSelectedEntries([]); }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all font-outfit font-bold text-[11.5px] group",
                                        currentFolder === folder.id
                                            ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                                            : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("transition-colors text-[16px]", currentFolder === folder.id ? "text-white" : "text-slate-400 group-hover:text-violet-500")}>
                                            {folder.icon}
                                        </div>
                                        <span>{folder.label}</span>
                                    </div>
                                    {folder.count ? (
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[9px]",
                                            currentFolder === folder.id ? "bg-white text-violet-600" : "bg-violet-50 text-violet-700"
                                        )}>
                                            {folder.count}
                                        </span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-50">
                            <p className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-4 font-outfit">Dispatch Nodes</p>
                            <div className="space-y-1.5">
                                {[
                                    { color: 'bg-emerald-500', name: 'AP-South-1' },
                                    { color: 'bg-violet-500', name: 'EU-Central-1' },
                                    { color: 'bg-indigo-500', name: 'US-East-1' },
                                ].map((node, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm ring-2 ring-white animate-pulse", node.color)} />
                                        <span className="group-hover:text-violet-600 transition-colors">{node.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Ledger Area */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden font-outfit">
                        {/* Control Bar */}
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={selectAll}
                                    className={cn(
                                        "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
                                        selectedEntries.length === filteredNotifications.length && filteredNotifications.length > 0
                                            ? "bg-violet-600 border-violet-600"
                                            : "border-slate-200 hover:border-violet-400"
                                    )}
                                >
                                    {selectedEntries.length === filteredNotifications.length && filteredNotifications.length > 0 && <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                                </button>
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit capitalize">{currentFolder === 'active' ? 'Operational Ledger' : currentFolder}</h2>
                                {selectedEntries.length > 0 && (
                                    <div className="h-4 w-px bg-slate-200 mx-1" />
                                )}
                                <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold font-outfit">
                                    {selectedEntries.length > 0 ? `${selectedEntries.length} selected` : `${filteredNotifications.length} entries`}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search alert payload..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none h-10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="rounded-xl text-slate-400 border-slate-200 h-10 w-10 hover:bg-slate-50"><Filter className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Bulk Actions Bar */}
                        {selectedEntries.length > 0 && (
                            <div className="px-6 py-3 bg-violet-50/50 border-b border-violet-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-violet-700 hover:bg-white gap-2" onClick={() => toast({ title: "Bulk Supressed", description: `${selectedEntries.length} alerts muted for 2h.` })}>
                                        <Bell className="h-3.5 w-3.5" /> Mute Alerts
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-violet-700 hover:bg-white gap-2" onClick={() => toast({ title: "Batch Retried", description: "Re-dispatching to carrier gateway..." })}>
                                        <RefreshCw className="h-3.5 w-3.5" /> Retry Sync
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-rose-700 hover:bg-white gap-2" onClick={() => {
                                        setNotifications(prev => prev.map(n => selectedEntries.includes(n.id) ? { ...n, folder: 'trash' } as Notification : n));
                                        setSelectedEntries([]);
                                        toast({ title: "Purged to Trash", description: `${selectedEntries.length} logs moved.` });
                                    }}>
                                        <Trash2 className="h-3.5 w-3.5" /> Purge Selection
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-slate-600" onClick={() => setSelectedEntries([])}><X className="h-4 w-4" /></Button>
                            </div>
                        )}

                        <div className="divide-y divide-slate-50">
                            {filteredNotifications.length > 0 ? filteredNotifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "group relative p-6 hover:bg-slate-50/80 transition-all cursor-pointer border-l-4 border-transparent",
                                        n.priority === 'High' && "bg-rose-50/20 border-l-rose-500",
                                        selectedEntries.includes(n.id) && "bg-violet-50/40 border-l-violet-600"
                                    )}
                                    onClick={() => { setActiveNotification(n); setViewDialogOpen(true); }}
                                >
                                    <div className="flex items-start gap-5">
                                        <button
                                            onClick={(e) => toggleSelect(n.id, e)}
                                            className={cn(
                                                "h-5 w-5 rounded border-2 flex items-center justify-center transition-all mt-1",
                                                selectedEntries.includes(n.id) ? "bg-violet-600 border-violet-600" : "border-slate-200 group-hover:border-violet-300"
                                            )}
                                        >
                                            {selectedEntries.includes(n.id) && <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600">
                                                        {getChannelIcon(n.channel)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-bold text-slate-900 font-outfit">{n.account}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border font-outfit",
                                                                n.status === 'Delivered' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                    n.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                                            )}>
                                                                {n.status}
                                                            </span>
                                                            <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-bold border font-outfit", getPriorityColor(n.priority))}>
                                                                {n.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-slate-400 font-outfit tracking-widest">{n.timestamp}</span>
                                                    <Badge variant="ghost" className="text-[9px] font-bold text-slate-400 p-0 hover:bg-transparent font-outfit">{n.type}</Badge>
                                                </div>
                                            </div>
                                            <p className="text-[13.5px] font-medium text-slate-600 font-outfit line-clamp-2 leading-relaxed pr-16 bg-slate-50/50 p-3 rounded-xl border border-slate-100 mt-2">
                                                {n.message}
                                            </p>
                                        </div>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-violet-600 hover:bg-white border bg-white/50 shadow-sm" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingNotification(n)
                                                            setFormData(n)
                                                            setIsDialogOpen(true)
                                                        }}>
                                                            <PencilLine className="h-4.5 w-4.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p className="font-outfit text-xs font-bold">Pivot Call</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white border bg-white/50 shadow-sm" onClick={(e) => e.stopPropagation()}>
                                                        <MoreVertical className="h-4.5 w-4.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 font-outfit rounded-2xl p-2 shadow-2xl border-slate-100">
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-violet-50 focus:text-violet-600 rounded-xl" onClick={(e) => { e.stopPropagation(); toast({ title: "Retry Sent", description: "Payload re-queued to gateway." }) }}>
                                                        <RefreshCw className="h-4 w-4" /> Gateway Re-dispatch
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-violet-50 focus:text-violet-600 rounded-xl">
                                                        <Eye className="h-4 w-4" /> Full Delivery Report
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-violet-50 focus:text-violet-600 rounded-xl">
                                                        <Settings2 className="h-4 w-4" /> Protocol Config
                                                    </DropdownMenuItem>
                                                    <div className="h-px bg-slate-50 my-2" />
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 text-rose-500 cursor-pointer font-bold text-[11px] focus:bg-rose-50 rounded-xl" onClick={(e) => { e.stopPropagation(); currentFolder === 'trash' ? handlePermanentDelete(n.id) : handleDelete(n.id); }}>
                                                        <Trash2 className="h-4 w-4" /> {currentFolder === 'trash' ? 'Purge Analytics' : 'Suspend Workflow'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="px-6 py-24 text-center">
                                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100/50">
                                        <AlertCircle className="h-10 w-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-400 font-outfit mb-2">Clean Staging Node</h3>
                                    <p className="text-[12px] font-medium text-slate-300 font-outfit max-w-[200px] mx-auto">No telemetry data streams found in {currentFolder} repository.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Analytics Pane */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-violet-50/50 rounded-bl-full -z-0 group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-[10px] font-bold text-slate-400 tracking-widest font-outfit mb-6 relative z-10">Channel Volume</h3>
                        <div className="space-y-6 relative z-10">
                            {[
                                { name: 'SMS Carrier Load', score: 42, color: 'bg-violet-500', trend: '+12%' },
                                { name: 'Push Token Velocity', score: 88, color: 'bg-blue-500', trend: '+24%' },
                                { name: 'Voice IVR Path', score: 12, color: 'bg-rose-500', isSmall: true, trend: '-2%' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10.5px] font-bold font-outfit">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-600">{stat.name}</span>
                                            <span className={cn("text-[8px]", stat.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>{stat.trend}</span>
                                        </div>
                                        <span className="text-slate-900">{stat.score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner ring-1 ring-slate-100">
                                        <div className={cn("h-full rounded-full transition-all duration-1000 opacity-80", stat.color)} style={{ width: `${stat.score}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-8 py-4 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-bold tracking-widest transition-all shadow-xl shadow-slate-200 group font-outfit">
                            Full Telemetry <ArrowUpRight className="h-3 w-3 inline ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </Card>

                    <Card className="rounded-2xl border-amber-100 bg-amber-50/10 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-amber-600">
                            <AlertCircle className="h-4 w-4" />
                            <h3 className="text-[10px] font-bold tracking-widest font-outfit">Critical Thresholds</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white border border-amber-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <p className="text-[13px] font-bold text-slate-800 font-outfit leading-none mb-1">Innova Hub Breach</p>
                                <p className="text-[11px] font-medium text-slate-500 font-outfit leading-relaxed">SLA Sync Lost: Asia-SE node reporting 400ms jitter. SMS failover engaged.</p>
                                <Button className="w-full mt-5 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-amber-500/20 gap-2 tracking-wider font-outfit" onClick={() => toast({ title: "Connecting...", description: "Engaging Tier-1 Voice Path for Innova Hub." })}>
                                    <PhoneCall className="h-3.5 w-3.5" /> Direct Call Bridge
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden group">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest font-outfit">Success Triggers</h3>
                            <ChevronRight className="h-4 w-4 text-slate-200" />
                        </div>
                        <div className="space-y-3">
                            {[
                                { text: 'Contract Signed: Auto Welcome', active: true },
                                { text: 'Health < 20: Churn Dispatch', active: true },
                                { text: 'Expansion: Growth Push', active: false },
                            ].map((t, i) => (
                                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/50 border border-slate-100 group-hover:border-violet-100 transition-colors">
                                    <span className="text-[11.5px] font-bold text-slate-600 font-outfit">{t.text}</span>
                                    <div className={cn("h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-sm", t.active ? "bg-emerald-500" : "bg-slate-200")} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Detailed Notification Log View */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[800px] font-outfit rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    {activeNotification && (
                        <div className="flex flex-col h-full max-h-[85vh]">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/80">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 shadow-xl flex items-center justify-center text-white">
                                            {getChannelIcon(activeNotification.channel)}
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{activeNotification.account}</h2>
                                            <p className="text-[12px] font-medium text-slate-400 flex items-center gap-2">
                                                <History className="h-3.5 w-3.5" /> Node Sync: {activeNotification.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Button variant="outline" className="rounded-xl h-11 px-6 text-[12px] font-bold gap-2 bg-white border-slate-200 shadow-sm hover:border-violet-300 hover:text-violet-600 font-outfit" onClick={() => toast({ title: "Force Retried", description: "Gateway ACK received." })}>
                                            <RefreshCw className="h-4 w-4" /> Force Hub Retry
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50" onClick={() => { handleDelete(activeNotification.id); setViewDialogOpen(false); }}>
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={cn("text-[10px] font-bold py-1 px-3 tracking-wider border-none font-outfit",
                                        activeNotification.status === 'Delivered' ? 'bg-emerald-500 text-white' :
                                            activeNotification.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                                    )}>
                                        {activeNotification.status} Gateway Pulse
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-200 py-1 px-3 font-outfit">Priority: {activeNotification.priority}</Badge>
                                    <div className="h-4 w-px bg-slate-200 mx-1" />
                                    <div className="flex items-center gap-1.5 text-violet-600">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span className="text-[10px] font-bold tracking-widest font-outfit">Carrier Confirmed</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 bg-white flex-1 overflow-y-auto">
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-400 tracking-widest mb-4 font-outfit">Notification Payload</h4>
                                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 font-outfit text-slate-700 text-[15px] leading-relaxed font-medium">
                                            {activeNotification.message}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest font-outfit">Metadata Artifacts</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-[12px] p-1">
                                                    <span className="text-slate-500 font-medium">Dispatch Channel</span>
                                                    <span className="font-bold text-slate-800">{activeNotification.channel}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[12px] p-1">
                                                    <span className="text-slate-500 font-medium">Message Taxonomy</span>
                                                    <span className="font-bold text-slate-800">{activeNotification.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest font-outfit">Sync Reliability</h4>
                                            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 font-outfit">
                                                <p className="text-[10px] font-bold text-emerald-600 mb-1">Carrier ACK</p>
                                                <p className="text-[14px] font-bold text-emerald-700 flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" /> Success Verified
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center px-10">
                                <p className="text-[11px] font-medium text-slate-400 italic">Tracking ID: NOTIF-X-{activeNotification.id}-G</p>
                                <Button className="bg-slate-900 hover:bg-violet-600 text-white rounded-xl px-8 h-10 font-bold transition-all shadow-lg font-outfit" onClick={() => setViewDialogOpen(false)}>Halt Review</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
