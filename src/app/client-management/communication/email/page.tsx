"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Mail,
    Send,
    Inbox,
    Clock,
    AlertCircle,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    Star,
    Paperclip,
    ArrowUpRight,
    MessageSquare,
    CheckCircle2,
    ChevronRight,
    SearchIcon,
    Archive,
    FileText,
    Flag,
    Settings2,
    RefreshCw,
    ShieldCheck,
    X,
    Reply,
    Forward,
    History,
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
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/shared/components/ui/tooltip"

// Types
interface EmailMessage {
    id: number;
    sender: string;
    recipient: string;
    subject: string;
    content: string;
    status: 'Sent' | 'Draft' | 'Scheduled' | 'Failed' | 'Incoming';
    priority: 'High' | 'Medium' | 'Low';
    date: string;
    folder: 'inbox' | 'sent' | 'drafts' | 'scheduled' | 'trash';
    isStarred?: boolean;
    isRead?: boolean;
}

const initialEmails: EmailMessage[] = [
    { id: 1, sender: "Sarah J.", recipient: "Global Dynamics", subject: "Quarterly Business Review Follow-up", content: "Hi team, following up on our discussion regarding the scalability metrics for the upcoming rollout. The architecture seems solid...", status: "Sent", priority: "High", date: "2024-10-15 10:30 AM", folder: 'sent', isStarred: true, isRead: true },
    { id: 2, sender: "Mike W.", recipient: "DataScale Inc", subject: "Beta Feature Invitation: AI Insights", content: "We are excited to invite DataScale to our early access program for the new AI engine that predicts churn before it happens...", status: "Scheduled", priority: "Medium", date: "2024-10-18 09:00 AM", folder: 'scheduled', isRead: true },
    { id: 3, sender: "Sarah J.", recipient: "Innova Hub", subject: "API Integration Credentials", content: "The production API keys for your instance have been generated. Please find the details below. Remember to rotate these every 90 days...", status: "Sent", priority: "High", date: "2024-10-14 04:15 PM", folder: 'sent', isRead: true },
    { id: 4, sender: "Emily R.", recipient: "Swift Apps", subject: "Account Activation Checklist", content: "Welcome aboard! Here is the initial checklist to get your team started. We need the signed MSA by EOD Friday...", status: "Draft", priority: "Low", date: "2024-10-16 11:20 AM", folder: 'drafts', isRead: false },
    { id: 5, sender: "Mike W.", recipient: "Horizon Media", subject: "Service Maintenance Window", content: "Please be advised that there will be a brief maintenance window this Sunday starting at 02:00 AM UTC for database optimization...", status: "Failed", priority: "Medium", date: "2024-10-12 02:00 AM", folder: 'sent', isRead: true },
    { id: 6, sender: "Global Dynamics", recipient: "Account Team", subject: "Urgent: Infrastructure Query", content: "We are seeing some latency in the Singapore region. Can someone investigate?", status: "Incoming", priority: "High", date: "2024-10-16 02:45 PM", folder: 'inbox', isRead: false },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        indigo: "from-indigo-50 to-indigo-100/50 border-indigo-200/50 text-indigo-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        rose: "from-rose-50 to-rose-100/50 border-rose-200/50 text-rose-600",
    }
    const currentClasses = colorClasses[color] || colorClasses.blue
    return (
        <Card className={cn("bg-gradient-to-br border shadow-none transition-all hover:shadow-md", currentClasses.split(' ').slice(0, 3).join(' '))}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide font-outfit mb-2">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight leading-none">{value}</h3>
                        <p className="mt-2 text-xs font-medium text-slate-400 font-outfit">{subValue}</p>
                    </div>
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-white/60 shadow-sm border border-white/50", currentClasses.split(' ').pop())}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function EmailCenterPage() {
    const [emails, setEmails] = useState<EmailMessage[]>(initialEmails)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [activeEmail, setActiveEmail] = useState<EmailMessage | null>(null)
    const [editingEmail, setEditingEmail] = useState<EmailMessage | null>(null)
    const [currentFolder, setCurrentFolder] = useState<'inbox' | 'sent' | 'drafts' | 'scheduled' | 'trash'>('inbox')
    const [selectedEmails, setSelectedEmails] = useState<number[]>([])
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<EmailMessage>>({
        sender: 'System Admin',
        recipient: '',
        subject: '',
        content: '',
        status: 'Sent',
        priority: 'Medium',
        date: new Date().toLocaleString(),
        folder: 'sent'
    })

    const metrics = useMemo(() => {
        const total = emails.length
        const unread = emails.filter(e => e.folder === 'inbox' && !e.isRead).length
        const scheduled = emails.filter(e => e.folder === 'scheduled').length
        const failed = emails.filter(e => e.status === 'Failed').length

        return { total, unread, scheduled, failed }
    }, [emails])

    const filteredEmails = useMemo(() => {
        return emails.filter(e =>
            e.folder === currentFolder &&
            (e.subject.toLowerCase().includes(search.toLowerCase()) ||
                e.recipient.toLowerCase().includes(search.toLowerCase()))
        )
    }, [emails, search, currentFolder])

    const handleDelete = (id: number) => {
        setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: 'trash' } as EmailMessage : e))
        toast({ title: "Moved to Trash", description: "The message has been moved to the trash folder." })
    }

    const handlePermanentDelete = (id: number) => {
        setEmails(prev => prev.filter(e => e.id !== id))
        toast({ title: "Email Purged", description: "Record has been permanently deleted." })
    }

    const handleSave = () => {
        if (!formData.recipient || !formData.subject) return

        if (editingEmail) {
            setEmails(prev => prev.map(e => e.id === editingEmail.id ? { ...e, ...formData } as EmailMessage : e))
            toast({ title: "Message Updated", description: "Email details have been refreshed." })
        } else {
            const newId = emails.length > 0 ? Math.max(...emails.map(e => e.id)) + 1 : 1
            setEmails(prev => [{ ...formData, id: newId, folder: 'sent', isRead: true } as EmailMessage, ...prev])
            toast({ title: "Email Dispatched", description: "The message has been sent successfully." })
        }
        setIsDialogOpen(false)
        setEditingEmail(null)
        setFormData({ sender: 'System Admin', recipient: '', subject: '', content: '', status: 'Sent', priority: 'Medium', date: new Date().toLocaleString(), folder: 'sent' })
    }

    const toggleStar = (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setEmails(prev => prev.map(email => email.id === id ? { ...email, isStarred: !email.isStarred } : email))
    }

    const markAsRead = (id: number) => {
        setEmails(prev => prev.map(email => email.id === id ? { ...email, isRead: true } : email))
    }

    const toggleSelect = (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedEmails(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const selectAll = () => {
        if (selectedEmails.length === filteredEmails.length) {
            setSelectedEmails([])
        } else {
            setSelectedEmails(filteredEmails.map(e => e.id))
        }
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

    const folders = [
        { id: 'inbox', label: 'Inbox', icon: <Inbox className="h-4 w-4" />, count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
        { id: 'sent', label: 'Sent', icon: <Send className="h-4 w-4" /> },
        { id: 'scheduled', label: 'Scheduled', icon: <Clock className="h-4 w-4" />, count: emails.filter(e => e.folder === 'scheduled').length },
        { id: 'drafts', label: 'Drafts', icon: <FileText className="h-4 w-4" /> },
        { id: 'trash', label: 'Trash', icon: <Trash2 className="h-4 w-4" /> },
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit text-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-outfit">
                            Communication <span className="text-indigo-600">Hub</span>
                        </h1>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-2 py-0.5 text-[10px] flex items-center gap-1.5 tracking-wider font-outfit">
                            <ShieldCheck className="h-3.5 w-3.5" /> G-Suite Active
                        </Badge>
                    </div>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Orchestrate enterprise outreach and monitor client engagement across all mail protocols.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 h-11 w-11 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all bg-white" onClick={() => toast({ title: "Sync Triggered", description: "Verifying credentials with G-Suite nodes..." })}>
                                    <RefreshCw className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="font-outfit text-xs font-bold">Resync Protocols</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) { setEditingEmail(null); setFormData({ sender: 'System Admin', recipient: '', subject: '', content: '', status: 'Sent', priority: 'Medium', date: new Date().toLocaleString(), folder: 'sent' }) }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-indigo-600/20 gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Plus className="h-5 w-5" /> Build Outreach
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] font-outfit rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="px-8 py-6 bg-slate-50/80 border-b border-slate-100">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2 font-outfit">
                                    <Mail className="h-5 w-5 text-indigo-600" />
                                    {editingEmail ? 'Modify Dispatch Strategy' : 'New Client Communication'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="px-8 py-8 grid gap-6 bg-white">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Account Target</Label>
                                        <Input
                                            value={formData.recipient}
                                            onChange={e => setFormData({ ...formData, recipient: e.target.value })}
                                            placeholder="Search client database..."
                                            className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-400 font-medium font-outfit"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Dispatch Priority</Label>
                                        <Select value={formData.priority} onValueChange={(v: any) => setFormData({ ...formData, priority: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 font-medium font-outfit"><SelectValue placeholder="Select Tier" /></SelectTrigger>
                                            <SelectContent className="rounded-xl font-outfit">
                                                <SelectItem value="High" className="font-bold text-rose-600">High: Critical Pursuit</SelectItem>
                                                <SelectItem value="Medium" className="font-bold text-indigo-600">Medium: Standard Sync</SelectItem>
                                                <SelectItem value="Low" className="font-bold text-slate-600">Low: Automated/Legacy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700 ml-1 font-outfit">Subject Architecture</Label>
                                    <Input
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Attention-grabbing subject..."
                                        className="h-11 rounded-xl border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-400 font-medium font-outfit"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700 ml-1 font-outfit">Message Payload</Label>
                                    <Textarea
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Compile message body..."
                                        className="min-h-[150px] rounded-xl border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-400 font-medium p-4 font-outfit"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group">
                                        <div className="h-9 w-9 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:text-indigo-600"><Paperclip className="h-4 w-4" /></div>
                                        <span className="text-[11px] font-bold text-slate-500 font-outfit">Attach Media Collateral</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group">
                                        <div className="h-9 w-9 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:text-indigo-600"><FileText className="h-4 w-4" /></div>
                                        <span className="text-[11px] font-bold text-slate-500 font-outfit">Import Dispatch Template</span>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 gap-3">
                                <Button variant="ghost" className="rounded-xl font-bold bg-white border border-slate-200 px-6 h-11 font-outfit" onClick={() => setIsDialogOpen(false)}>Stage Draft</Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-11 font-bold shadow-lg shadow-indigo-600/20 font-outfit" onClick={handleSave}>
                                    <Send className="h-4 w-4 mr-2" /> Commit & Dispatch
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Awaiting Pulse" value={metrics.unread} subValue="Unread Incoming" icon={Inbox} color="indigo" />
                <MetricBox title="Live Sequences" value={metrics.scheduled} subValue="Active Pipelines" icon={Clock} color="blue" />
                <MetricBox title="Global Engagement" value="74.8%" subValue="Portfolio Score" icon={ArrowUpRight} color="emerald" />
                <MetricBox title="Sync Heartbeat" value="Healthy" subValue="Last Ping: 2m ago" icon={ShieldCheck} color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden p-3 h-fit sticky top-8">
                        <div className="space-y-1">
                            {folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => { setCurrentFolder(folder.id as any); setSelectedEmails([]); }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all font-outfit font-bold text-[12px] group",
                                        currentFolder === folder.id
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                            : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("transition-colors", currentFolder === folder.id ? "text-white" : "text-slate-400 group-hover:text-indigo-500")}>
                                            {folder.icon}
                                        </div>
                                        <span>{folder.label}</span>
                                    </div>
                                    {folder.count ? (
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[9px]",
                                            currentFolder === folder.id ? "bg-white text-indigo-600" : "bg-indigo-50 text-indigo-700"
                                        )}>
                                            {folder.count}
                                        </span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-50">
                            <p className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-4 font-outfit">Portfolio Segments</p>
                            <div className="space-y-1.5">
                                {[
                                    { color: 'bg-emerald-500', name: 'Strategic Tier' },
                                    { color: 'bg-rose-500', name: 'At Risk / Churn' },
                                    { color: 'bg-amber-500', name: 'Upsell Opps' },
                                    { color: 'bg-indigo-500', name: 'System Managed' },
                                ].map((seg, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm ring-2 ring-white", seg.color)} />
                                        <span className="group-hover:text-indigo-600 transition-colors">{seg.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main List Area */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden font-outfit">
                        {/* Control Bar */}
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={selectAll}
                                    className={cn(
                                        "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
                                        selectedEmails.length === filteredEmails.length && filteredEmails.length > 0
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "border-slate-200 hover:border-indigo-400"
                                    )}
                                >
                                    {selectedEmails.length === filteredEmails.length && filteredEmails.length > 0 && <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                                </button>
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit capitalize">{currentFolder}</h2>
                                {selectedEmails.length > 0 && (
                                    <div className="h-4 w-px bg-slate-200 mx-1" />
                                )}
                                <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold font-outfit">
                                    {selectedEmails.length > 0 ? `${selectedEmails.length} selected` : `${filteredEmails.length} entries`}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search protocol history..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 w-full md:w-64 font-outfit h-10"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="rounded-xl text-slate-400 border-slate-200 h-10 w-10 hover:bg-slate-50"><Filter className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Selection Actions */}
                        {selectedEmails.length > 0 && (
                            <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-indigo-700 hover:bg-white gap-2" onClick={() => toast({ title: "Bulk Archived", description: `${selectedEmails.length} records moved to archives.` })}>
                                        <Archive className="h-3.5 w-3.5" /> Archive
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-indigo-700 hover:bg-white gap-2" onClick={() => toast({ title: "Bulk Tagged", description: "Segments updated successfully." })}>
                                        <Flag className="h-3.5 w-3.5" /> Tag Pulse
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-rose-700 hover:bg-white gap-2" onClick={() => {
                                        setEmails(prev => prev.map(e => selectedEmails.includes(e.id) ? { ...e, folder: 'trash' } as EmailMessage : e));
                                        setSelectedEmails([]);
                                        toast({ title: "Bulk Deletion", description: `${selectedEmails.length} moved to trash.` });
                                    }}>
                                        <Trash2 className="h-3.5 w-3.5" /> Move to Trash
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-slate-600" onClick={() => setSelectedEmails([])}><X className="h-4 w-4" /></Button>
                            </div>
                        )}

                        <div className="divide-y divide-slate-50">
                            {filteredEmails.length > 0 ? filteredEmails.map((email) => (
                                <div
                                    key={email.id}
                                    className={cn(
                                        "group relative p-6 hover:bg-slate-50/80 transition-all cursor-pointer border-l-4 border-transparent",
                                        !email.isRead && "bg-indigo-50/20 border-l-indigo-500",
                                        selectedEmails.includes(email.id) && "bg-indigo-50/40 border-l-indigo-600"
                                    )}
                                    onClick={() => { setActiveEmail(email); markAsRead(email.id); setViewDialogOpen(true); }}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="flex flex-col items-center gap-3">
                                            <button
                                                onClick={(e) => toggleSelect(email.id, e)}
                                                className={cn(
                                                    "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
                                                    selectedEmails.includes(email.id) ? "bg-indigo-600 border-indigo-600" : "border-slate-200 group-hover:border-indigo-300"
                                                )}
                                            >
                                                {selectedEmails.includes(email.id) && <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                                            </button>
                                            <button onClick={(e) => toggleStar(email.id, e)} className="transition-transform active:scale-125">
                                                <Star className={cn("h-4.5 w-4.5 transition-colors", email.isStarred ? "text-amber-400 fill-amber-400" : "text-slate-200 hover:text-amber-200")} />
                                            </button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm border border-slate-100">
                                                        <AvatarFallback className="bg-slate-50 text-slate-500 font-bold text-[9px] font-outfit">
                                                            {(currentFolder === 'sent' ? email.recipient : email.sender).split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className={cn("text-[13px] font-bold font-outfit", !email.isRead ? "text-slate-900" : "text-slate-600")}>
                                                        {currentFolder === 'sent' ? `To: ${email.recipient}` : email.sender}
                                                    </span>
                                                    <span className={cn(
                                                        "px-2.5 py-0.5 rounded-full text-[9px] font-bold font-outfit border shadow-sm tracking-wider",
                                                        getStatusColor(email.status)
                                                    )}>
                                                        {email.status}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 font-outfit tracking-widest">{email.date}</span>
                                            </div>
                                            <p className={cn("text-[14px] font-outfit truncate pr-20 leading-tight mb-1.5", !email.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700")}>
                                                {email.subject}
                                            </p>
                                            <p className="text-[12px] font-medium text-slate-400 font-outfit line-clamp-1 pr-20 opacity-80 leading-relaxed">
                                                {email.content}
                                            </p>
                                        </div>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white border bg-white/50 shadow-sm" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingEmail(email)
                                                            setFormData(email)
                                                            setIsDialogOpen(true)
                                                        }}>
                                                            <PencilLine className="h-4.5 w-4.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p className="font-outfit text-xs font-bold">Revise Specs</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white border bg-white/50 shadow-sm" onClick={(e) => e.stopPropagation()}>
                                                        <MoreVertical className="h-4.5 w-4.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 font-outfit rounded-2xl p-2 shadow-2xl border-slate-100">
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 rounded-xl" onClick={() => { setFormData({ ...email, subject: `Re: ${email.subject}`, content: '\n\n--- Original Message ---\n' + email.content }); setIsDialogOpen(true); }}>
                                                        <Reply className="h-4 w-4" /> Quick Reply Dispatch
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 rounded-xl" onClick={() => toast({ title: "Forwarded", description: "Internal routing scheduled." })}>
                                                        <Forward className="h-4 w-4" /> Move to Internal Hub
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 rounded-xl">
                                                        <Settings2 className="h-4 w-4" /> Protocol Settings
                                                    </DropdownMenuItem>
                                                    <div className="h-px bg-slate-50 my-2" />
                                                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 text-rose-500 cursor-pointer font-bold text-[11px] focus:bg-rose-50 rounded-xl" onClick={() => currentFolder === 'trash' ? handlePermanentDelete(email.id) : handleDelete(email.id)}>
                                                        <Trash2 className="h-4 w-4" /> {currentFolder === 'trash' ? 'Purge Record' : 'Move to Trash'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="px-6 py-24 text-center">
                                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100/50 relative">
                                        <Mail className="h-10 w-10 text-slate-200" />
                                        <div className="absolute -right-1 -bottom-1 h-8 w-8 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center">
                                            <Search className="h-4 w-4 text-slate-300" />
                                        </div>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-400 font-outfit mb-2">Vault Staging Clear</h3>
                                    <p className="text-[12px] font-medium text-slate-300 font-outfit max-w-[200px] mx-auto">No telemetry records found for {currentFolder} segments.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Global Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-50/50 rounded-bl-full -z-0 group-hover:scale-[1.8] transition-all duration-700" />
                        <h3 className="text-[10px] font-bold text-slate-400 tracking-widest font-outfit mb-6 relative z-10">Internal Reputation</h3>
                        <div className="space-y-6 relative z-10">
                            {[
                                { name: 'Dispatch Integrity', score: 98, color: 'bg-emerald-500', trend: '+4%' },
                                { name: 'Response Velocity', score: 84, color: 'bg-indigo-500', trend: '+12%' },
                                { name: 'Segment Penetration', score: 18.5, color: 'bg-amber-500', isSmall: true, trend: '-2%' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-bold font-outfit">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-600">{stat.name}</span>
                                            <span className={cn("text-[9px]", stat.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>{stat.trend}</span>
                                        </div>
                                        <span className="text-slate-900">{stat.score}{stat.isSmall ? '%' : '/100'}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                        <div className={cn("h-full rounded-full transition-all duration-1000", stat.color)} style={{ width: `${stat.isSmall ? stat.score * 5 : stat.score}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-8 py-4 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-bold tracking-widest transition-all shadow-xl shadow-slate-200 font-outfit">
                            Audit Performance
                        </Button>
                    </Card>

                    <Card className="rounded-2xl border-indigo-100 bg-indigo-50/10 p-6 shadow-sm group">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest font-outfit">Optimization AI</h3>
                            <RefreshCw className="h-4 w-4 text-indigo-500 animate-spin-slow" />
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white border border-indigo-100 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                                <p className="text-[9px] font-bold text-emerald-600 font-outfit mb-1 tracking-widest">Peak Sync Window</p>
                                <p className="text-[12px] font-bold text-slate-800 font-outfit">Tue - Wed • 09:30 AM</p>
                            </div>
                            <div className="flex items-start gap-3 p-1">
                                <AlertCircle className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed font-outfit">
                                    Detected high volatility in <span className="text-indigo-600 font-bold">Asian Pacific</span> response rates. Shift outreach to UTC+8.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 tracking-widest font-outfit mb-6">Sync Architecture</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Main SMTP Node', status: 'Optimal', health: 100 },
                                { name: 'App Webhook Bridge', status: 'Syncing', health: 92 },
                                { name: 'Analytics Parser', status: 'Standby', health: 100 },
                            ].map((sync, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 transition-all cursor-pointer group">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-700 font-outfit group-hover:text-indigo-600 truncate">{sync.name}</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn("h-1.5 w-1.5 rounded-full", sync.health === 100 ? "bg-emerald-500" : "bg-amber-500")} />
                                            <span className="text-[9px] font-medium text-slate-400 font-outfit italic">{sync.status}</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-bold bg-white text-slate-400 border-slate-200 px-1.5 py-0">Tier A</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Comprehensive Detail View Modal */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[850px] font-outfit rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    {activeEmail && (
                        <div className="flex flex-col h-full max-h-[90vh]">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/80">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-14 w-14 border-4 border-white shadow-xl ring-1 ring-slate-100">
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-bold text-lg">
                                                {(currentFolder === 'sent' ? activeEmail.recipient : activeEmail.sender)[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{currentFolder === 'sent' ? `To: ${activeEmail.recipient}` : activeEmail.sender}</h2>
                                            <p className="text-[12px] font-medium text-slate-400 flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5" /> Received On: {activeEmail.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Button variant="outline" className="rounded-xl h-11 px-6 text-[12px] font-bold gap-2 bg-white border-slate-200 shadow-sm" onClick={() => { setFormData({ ...activeEmail, subject: `Re: ${activeEmail.subject}`, content: '\n\n--- Previous Message ---\n' + activeEmail.content }); setIsDialogOpen(true); setViewDialogOpen(false); }}>
                                            <Reply className="h-4 w-4 text-indigo-600" /> Dispatch Reply
                                        </Button>
                                        <Button variant="outline" className="rounded-xl h-11 px-6 text-[12px] font-bold gap-2 bg-white border-slate-200 shadow-sm">
                                            <Forward className="h-4 w-4 text-slate-400" /> Internal Forward
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors" onClick={() => { handleDelete(activeEmail.id); setViewDialogOpen(false); }}>
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h1 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">{activeEmail.subject}</h1>
                                    <div className="flex items-center gap-3">
                                        <Badge className={cn("text-[10px] font-bold py-1 px-3 tracking-wider border-none", getStatusColor(activeEmail.status))}>{activeEmail.status} Pulse</Badge>
                                        <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-200 py-1 px-3 tracking-wider">Priority: {activeEmail.priority}</Badge>
                                        <div className="h-4 w-px bg-slate-200 mx-1" />
                                        <div className="flex items-center gap-1.5 text-emerald-600">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span className="text-[10px] font-bold tracking-widest font-outfit">AES-256 Encrypted</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 overflow-y-auto flex-1 bg-white">
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-[15px] leading-relaxed text-slate-600 font-medium font-outfit whitespace-pre-wrap">
                                        {activeEmail.content}
                                    </p>
                                </div>
                                <div className="mt-16 pt-10 border-t border-slate-50">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                                        <History className="h-4 w-4" /> Interaction Intelligence Audit
                                    </h4>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                                                <RefreshCw className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-800">Portfolio Status Synchronized</p>
                                                <p className="text-[11px] font-medium text-slate-400 mt-0.5 whitespace-nowrap">Source: Salesforce CRM • Verified By System Logic</p>
                                            </div>
                                            <div className="ml-auto text-[10px] font-bold text-slate-300 tracking-tighter">Oct 16 • 03:00 PM</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center px-10">
                                <p className="text-[11px] font-medium text-slate-400 italic">Tracking ID: COMM-B-{activeEmail.id}-99X2</p>
                                <div className="flex gap-3">
                                    <Button variant="ghost" className="rounded-xl font-bold text-xs px-6 font-outfit" onClick={() => setViewDialogOpen(false)}>Halt Review</Button>
                                    <Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl px-8 h-10 font-bold transition-all shadow-lg shadow-slate-200 font-outfit">
                                        Command Follow-up
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
