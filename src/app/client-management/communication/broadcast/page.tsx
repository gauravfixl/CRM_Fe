"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Radio,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    AlertTriangle,
    CheckCircle2,
    History,
    ShieldAlert,
    Send,
    Users,
    Globe,
    Clock,
    Zap,
    ChevronRight,
    Megaphone
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

// Types
interface Broadcast {
    id: number;
    title: string;
    scope: 'All Accounts' | 'Enterprise' | 'Free Tier' | 'Region: North America';
    severity: 'Critical' | 'Warning' | 'Info' | 'Broadcast';
    status: 'Active' | 'Draft' | 'Expired' | 'Scheduled';
    message: string;
    targetReach: number;
    sentAt: string;
}

const initialBroadcasts: Broadcast[] = [
    { id: 1, title: "System Maintenance: Sunday Oct 20", scope: "All Accounts", severity: "Warning", status: "Active", message: "Please be advised that all instances will undergo maintenance on Sunday from 02:00 to 04:00 AM UTC.", targetReach: 12500, sentAt: "10 mins ago" },
    { id: 2, title: "Critical Security Patch: API v2.4", scope: "Enterprise", severity: "Critical", status: "Active", message: "URGENT: All Enterprise API keys must be rotated by EOD Tuesday due to v2.4 updates.", targetReach: 450, sentAt: "1 hour ago" },
    { id: 3, title: "New Resource: Executive Playbook", scope: "All Accounts", severity: "Info", status: "Expired", message: "Check out the new Strategic Account Playbook now available in your resources tab.", targetReach: 12500, sentAt: "2 days ago" },
    { id: 4, title: "Localized Holiday Support Hours", scope: "Region: North America", severity: "Broadcast", status: "Scheduled", message: "Support hours for US & Canada will be modified for the upcoming Thanksgiving weekend.", targetReach: 2800, sentAt: "Starts Oct 25" },
    { id: 5, title: "Vulnerability Disclosure: Library X", scope: "All Accounts", severity: "Critical", status: "Expired", message: "We have patched a potential vulnerability in Library X. No action is required from your side.", targetReach: 12500, sentAt: "Sep 15, 2024" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        amber: "from-amber-50 to-amber-100/50 border-amber-200/50 text-amber-600",
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
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

export default function BroadcastMessagesPage() {
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initialBroadcasts)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingBroadcast, setEditingBroadcast] = useState<Broadcast | null>(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<Broadcast>>({
        title: '',
        scope: 'All Accounts',
        severity: 'Info',
        status: 'Draft',
        message: '',
        targetReach: 0,
        sentAt: 'Just now'
    })

    const metrics = useMemo(() => {
        const total = broadcasts.length
        const criticalCount = broadcasts.filter(b => b.severity === 'Critical').length
        const totalReach = broadcasts.reduce((sum, b) => sum + b.targetReach, 0).toLocaleString()
        const avgAck = "92.4%"

        return { total, criticalCount, totalReach, avgAck }
    }, [broadcasts])

    const filteredBroadcasts = useMemo(() => {
        return broadcasts.filter(b =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.scope.toLowerCase().includes(search.toLowerCase())
        )
    }, [broadcasts, search])

    const handleDelete = (id: number) => {
        setBroadcasts(prev => prev.filter(b => b.id !== id))
        toast({ title: "Broadcast Terminated", description: "The message has been pulled from distribution." })
    }

    const handleSave = () => {
        if (!formData.title || !formData.message) return

        if (editingBroadcast) {
            setBroadcasts(prev => prev.map(b => b.id === editingBroadcast.id ? { ...b, ...formData } as Broadcast : b))
            toast({ title: "Distribution Modified", description: "Broadcast parameters have been updated." })
        } else {
            const newId = broadcasts.length > 0 ? Math.max(...broadcasts.map(b => b.id)) + 1 : 1
            setBroadcasts(prev => [{ ...formData, id: newId } as Broadcast, ...prev])
            toast({ title: "Pulse Dispatched", description: "High-priority broadcast sent to all segments." })
        }
        setIsDialogOpen(false)
        setEditingBroadcast(null)
        setFormData({ title: '', scope: 'All Accounts', severity: 'Info', status: 'Draft', message: '', targetReach: 0, sentAt: 'Just now' })
    }

    const getSeverityProps = (severity: string) => {
        switch (severity) {
            case 'Critical': return { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: <ShieldAlert className="h-3 w-3" /> }
            case 'Warning': return { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <AlertTriangle className="h-3 w-3" /> }
            case 'Info': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Zap className="h-3 w-3" /> }
            case 'Broadcast': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <Megaphone className="h-3 w-3" /> }
            default: return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: <Radio className="h-3 w-3" /> }
        }
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit text-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Broadcast <span className="text-amber-600">Command Center</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Orchestrate global announcements, critical system alerts, and mass-market communications.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingBroadcast(null); setFormData({ title: '', scope: 'All Accounts', severity: 'Info', status: 'Draft', message: '', targetReach: 0, sentAt: 'Just now' }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-amber-600/20 gap-2 transition-all hover:scale-105 active:scale-95">
                            <Megaphone className="h-5 w-5" /> Initiate Pulse
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingBroadcast ? 'Reconfigure Pulse' : 'New Global Announcement'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Announcement Title</Label>
                                    <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Planned Infrastructure Upgrade" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Target Distribution Scope</Label>
                                    <Select value={formData.scope} onValueChange={(v: any) => setFormData({ ...formData, scope: v })}>
                                        <SelectTrigger><SelectValue placeholder="Scope" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All Accounts">Global - All Accounts</SelectItem>
                                            <SelectItem value="Enterprise">Enterprise Cluster Only</SelectItem>
                                            <SelectItem value="Free Tier">Freemium Segments</SelectItem>
                                            <SelectItem value="Region: North America">Regional - North America</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2 col-span-1">
                                    <Label className="font-bold text-slate-700">Alert Severity</Label>
                                    <Select value={formData.severity} onValueChange={(v: any) => setFormData({ ...formData, severity: v })}>
                                        <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Critical">Critical - High Impact</SelectItem>
                                            <SelectItem value="Warning">Warning - Actionable</SelectItem>
                                            <SelectItem value="Info">Info - Update</SelectItem>
                                            <SelectItem value="Broadcast">Standard Announcement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label className="font-bold text-slate-700">Audit Status</Label>
                                    <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft Staging</SelectItem>
                                            <SelectItem value="Active">Active Pulse</SelectItem>
                                            <SelectItem value="Scheduled">Future Delay</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label className="font-bold text-slate-700">Projected Reach</Label>
                                    <Input type="number" value={formData.targetReach} onChange={e => setFormData({ ...formData, targetReach: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Message Payload</Label>
                                <Textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Global message payload..." className="min-h-[120px] resize-none" />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Save to Staging</Button>
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSave}>
                                <Send className="h-4 w-4 mr-2" /> Dispatch Pulse
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Global Pulses" value={metrics.total.toString()} subValue="Last 30 Days" icon={Radio} color="rose" />
                <MetricBox title="Critical Alerts" value={metrics.criticalCount.toString()} subValue="Requiring Attention" icon={ShieldAlert} color="amber" />
                <MetricBox title="Aggregated Reach" value={metrics.totalReach} subValue="Unique Entities" icon={Globe} color="blue" />
                <MetricBox title="Response Velocity" value={metrics.avgAck} subValue="Engagement Ack" icon={CheckCircle2} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden font-outfit">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Distribution Log</h2>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-0 font-bold ml-1">{filteredBroadcasts.length} active pulses</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search pulses..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/10 w-full md:w-64 font-outfit"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30 font-outfit">
                                        <th className="px-6 py-4">Announcement Details</th>
                                        <th className="px-6 py-4">Scope & Severity</th>
                                        <th className="px-6 py-4">Reach & Impact</th>
                                        <th className="px-6 py-4">Audit Status</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredBroadcasts.map((b) => {
                                        const props = getSeverityProps(b.severity)
                                        return (
                                            <tr key={b.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border shadow-sm", props.color)}>
                                                            {props.icon}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 font-outfit truncate max-w-[200px]">{b.title}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 font-outfit mt-0.5 whitespace-nowrap">Sent: {b.sentAt}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-[9px] font-bold font-outfit border whitespace-nowrap shadow-sm",
                                                            props.color
                                                        )}>
                                                            {props.icon}
                                                            {b.severity}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 font-outfit ml-1">{b.scope}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1 font-outfit">
                                                        <p className="text-[12px] font-bold text-slate-700 font-outfit">{b.targetReach.toLocaleString()}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 font-outfit">Target Accounts</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={cn(
                                                        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold font-outfit border shadow-sm",
                                                        b.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            b.status === 'Scheduled' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                                "bg-slate-50 text-slate-600 border-slate-100"
                                                    )}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-amber-600 transition-colors">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                                                setEditingBroadcast(b)
                                                                setFormData(b)
                                                                setIsDialogOpen(true)
                                                            }}>
                                                                <PencilLine className="h-4 w-4" /> Re-Staging Pulse
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                                <Eye className="h-4 w-4" /> View Payload
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                                <Globe className="h-4 w-4" /> Geo-Targeting
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(b.id)}>
                                                                <Trash2 className="h-4 w-4" /> Halt Distribution
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 h-16 w-16 bg-amber-50 rounded-bl-full -z-0 opacity-40 group-hover:scale-150 transition-transform" />
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6 relative z-10">Regional Reach</h3>
                        <div className="space-y-5 relative z-10">
                            {[
                                { name: 'North America', count: 4850, pct: 65, color: 'bg-blue-500' },
                                { name: 'Europe / UK', count: 3200, pct: 45, color: 'bg-indigo-500' },
                                { name: 'Asia Pacific', count: 2100, pct: 28, color: 'bg-emerald-500' },
                                { name: 'Others', count: 1200, pct: 12, color: 'bg-slate-400' },
                            ].map((r, i) => (
                                <div key={i} className="space-y-1.5 text-[10px] font-bold font-outfit">
                                    <div className="flex justify-between items-center px-1 font-outfit text-sm">
                                        <span className="text-slate-600 font-outfit">{r.name}</span>
                                        <span className="text-slate-900 font-outfit">{r.count.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full opacity-80", r.color)} style={{ width: `${r.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-rose-100 bg-rose-50/10 p-6 shadow-sm overflow-hidden group">
                        <div className="flex items-center gap-2 mb-6 text-rose-600">
                            <ShieldAlert className="h-4 w-4" />
                            <h3 className="text-xs font-bold tracking-wider font-outfit">Critical Staging</h3>
                        </div>
                        <div className="p-4 bg-white border border-rose-100 rounded-xl relative group-hover:shadow-md transition-all cursor-pointer">
                            <p className="text-[13px] font-bold text-slate-900 font-outfit leading-tight mb-2">Planned Service Halt</p>
                            <p className="text-[11px] font-medium text-slate-500 font-outfit leading-relaxed mb-4">
                                This broadcast will reach <span className="text-rose-600 font-bold">12.5k clients</span>. Executive approval required before pulse launch.
                            </p>
                            <Button className="w-full py-4 bg-rose-600 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-rose-600/20 font-outfit">
                                Request Executive Audit
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6">Queue Health</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Main SMS Hub', latency: '24ms', load: 'Normal' },
                                { name: 'App Push Cluster', latency: '112ms', load: 'High' },
                                { name: 'Email SMTP Relay', latency: '8ms', load: 'Optimal' },
                            ].map((q, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-700 font-outfit">{q.name}</p>
                                        <p className="text-[9px] font-medium text-slate-400 font-outfit">Latency: {q.latency}</p>
                                    </div>
                                    <Badge variant="outline" className={cn(
                                        "text-[8px] font-bold px-1.5 py-0 border-0",
                                        q.load === 'High' ? "text-rose-500 bg-rose-50" : "text-emerald-500 bg-emerald-50"
                                    )}>
                                        {q.load}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
