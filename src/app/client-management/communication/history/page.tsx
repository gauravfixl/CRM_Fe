"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    History,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    Eye,
    Building2,
    Mail,
    Smartphone,
    Bell,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    Download,
    ArrowUpRight,
    ChevronRight,
    MessageSquare,
    Zap
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
import { useToast } from "@/shared/components/ui/use-toast"
import { Badge } from "@/shared/components/ui/badge"

// Types
interface HistoryEntry {
    id: number;
    account: string;
    type: 'Email' | 'SMS' | 'Call' | 'In-App';
    subject: string;
    representative: string;
    status: 'Completed' | 'Delivered' | 'Failed' | 'Opened';
    timestamp: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative' | 'N/A';
}

const initialHistory: HistoryEntry[] = [
    { id: 1, account: "Global Dynamics", type: "Email", subject: "Q3 Strategy Alignment", representative: "Sarah J.", status: "Opened", timestamp: "Oct 15, 2024 • 10:45 AM", sentiment: "Positive" },
    { id: 2, account: "DataScale Inc", type: "SMS", subject: "Critical: Support Ticket Alert", representative: "System", status: "Delivered", timestamp: "Oct 12, 2024 • 09:12 AM", sentiment: "N/A" },
    { id: 3, account: "Innova Hub", type: "Call", subject: "Executive Review Call", representative: "Mike W.", status: "Completed", timestamp: "Oct 10, 2024 • 04:30 PM", sentiment: "Neutral" },
    { id: 4, account: "Swift Apps", type: "Email", subject: "Onboarding Welcome!", representative: "Emily R.", status: "Opened", timestamp: "Oct 08, 2024 • 11:00 AM", sentiment: "Positive" },
    { id: 5, account: "Horizon Media", type: "In-App", subject: "Service Maintenance Notification", representative: "System", status: "Failed", timestamp: "Oct 05, 2024 • 02:00 AM", sentiment: "Negative" },
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

export default function CommunicationHistoryPage() {
    const [history, setHistory] = useState<HistoryEntry[]>(initialHistory)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    const metrics = useMemo(() => {
        const total = history.length
        const totalLastWeek = "842"
        const avgSentiment = "Positive"
        const topChannel = "Email (62%)"

        return { total, totalLastWeek, avgSentiment, topChannel }
    }, [history])

    const filteredHistory = useMemo(() => {
        return history.filter(h =>
            h.account.toLowerCase().includes(search.toLowerCase()) ||
            h.subject.toLowerCase().includes(search.toLowerCase())
        )
    }, [history, search])

    const handleDelete = (id: number) => {
        setHistory(prev => prev.filter(h => h.id !== id))
        toast({ title: "Audit Log Removed", description: "Record has been deleted from history repository." })
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Email': return <Mail className="h-4 w-4" />
            case 'SMS': return <Smartphone className="h-4 w-4" />
            case 'Call': return <MessageSquare className="h-4 w-4" />
            case 'In-App': return <Bell className="h-4 w-4" />
            default: return <Zap className="h-4 w-4" />
        }
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit text-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Communication <span className="text-indigo-600">Audit Trail</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Historical repository of all client interactions across integrated channels.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl py-6 px-6 font-bold font-outfit border-slate-200 text-slate-600 gap-2">
                        <Download className="h-5 w-5" /> Export Audit Log
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-indigo-600/20 gap-2">
                                <Plus className="h-5 w-5" /> Log External Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] font-outfit rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Manual Audit Logging</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700">Account Involved</Label>
                                        <Input placeholder="Search client..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700">Interaction Type</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Protocol" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Call">Phone Call</SelectItem>
                                                <SelectItem value="InPerson">In-Person Meeting</SelectItem>
                                                <SelectItem value="Workshop">Strategy Workshop</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Audit Summary</Label>
                                    <Input placeholder="e.g. Discussed new API endpoints" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700">Rep Accountable</Label>
                                        <Input defaultValue="Current User" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700">Sentiment Score</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Client Mood" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pos">Highly Positive</SelectItem>
                                                <SelectItem value="Neu">Neutral / Informative</SelectItem>
                                                <SelectItem value="Neg">Risk / Dissatisfaction</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Halt Process</Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setIsDialogOpen(false); toast({ title: "Audit Logged", description: "The manual entry has been added to history." }) }}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Commit to Ledger
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Total Interactions" value={metrics.totalLastWeek} subValue="Past 7 Business Days" icon={History} color="blue" />
                <MetricBox title="Open/Response Rate" value="68.4%" subValue="Global Network Avg" icon={ArrowUpRight} color="indigo" />
                <MetricBox title="Client Health Pulse" value={metrics.avgSentiment} subValue="Sentiment Aggregate" icon={CheckCircle2} color="emerald" />
                <MetricBox title="Primary Protocol" value={metrics.topChannel} subValue="Channel Dominance" icon={Calendar} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden font-outfit">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Communication Ledger</h2>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-0 font-bold ml-1">{filteredHistory.length} audit entries</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search audit trail..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                                <Button variant="outline" className="rounded-xl border-slate-200 text-slate-500 h-10 px-4 group hover:bg-indigo-50 transition-colors">
                                    <Filter className="h-4 w-4 mr-2 group-hover:text-indigo-600" />
                                    <span className="text-[11px] font-bold">Filters</span>
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Protocol & Account</th>
                                        <th className="px-6 py-4">Interaction Summary</th>
                                        <th className="px-6 py-4">Acc. Representative</th>
                                        <th className="px-6 py-4">Audit Status</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredHistory.map((h) => (
                                        <tr key={h.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm text-indigo-600">
                                                        {getTypeIcon(h.type)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 font-outfit">{h.account}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 font-outfit mt-0.5 whitespace-nowrap">{h.type} Sync</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-[12px] font-bold text-slate-800 font-outfit truncate max-w-[200px]">{h.subject}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 font-outfit flex items-center gap-1.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all line-clamp-1">
                                                        <Clock className="h-3 w-3" />
                                                        {h.timestamp}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                        <span className="text-[9px] font-bold text-slate-600">{h.representative.split(' ').map(n => n[0]).join('')}</span>
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-600 font-outfit">{h.representative}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={cn(
                                                        "inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[9px] font-bold font-outfit border shadow-sm",
                                                        h.status === 'Opened' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            h.status === 'Completed' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                                h.status === 'Failed' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                    "bg-slate-50 text-slate-600 border-slate-100"
                                                    )}>
                                                        {h.status}
                                                    </span>
                                                    {h.sentiment !== 'N/A' && (
                                                        <span className={cn("text-[9px] font-bold ml-1",
                                                            h.sentiment === 'Positive' ? "text-emerald-500" :
                                                                h.sentiment === 'Negative' ? "text-rose-500" : "text-amber-500"
                                                        )}>
                                                            {h.sentiment} Sentiment
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-indigo-600 transition-colors">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                            <Eye className="h-4 w-4" /> Expand Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                            <History className="h-4 w-4" /> Timeline View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(h.id)}>
                                                            <Trash2 className="h-4 w-4" /> Purge Entry
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 h-16 w-16 bg-slate-50 rounded-bl-full -z-0 opacity-40 group-hover:scale-150 transition-transform" />
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6 relative z-10">Protocol Split</h3>
                        <div className="space-y-6 relative z-10">
                            {[
                                { name: 'Email Broadcasts', pct: 62, color: 'bg-blue-500' },
                                { name: 'Support Calls', pct: 18, color: 'bg-indigo-500' },
                                { name: 'SMS Notifications', pct: 12, color: 'bg-violet-500' },
                                { name: 'In-Person Syncs', pct: 8, color: 'bg-emerald-500' },
                            ].map((p, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold font-outfit">
                                        <span className="text-slate-600">{p.name}</span>
                                        <span className="text-slate-900">{p.pct}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full opacity-80", p.color)} style={{ width: `${p.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-indigo-100 bg-indigo-50/10 p-6 shadow-sm overflow-hidden group">
                        <div className="flex items-center gap-2 mb-6 text-indigo-600">
                            <AlertCircle className="h-4 w-4" />
                            <h3 className="text-xs font-bold tracking-wider font-outfit">Audit Insights</h3>
                        </div>
                        <div className="p-4 bg-white border border-indigo-100 rounded-xl relative overflow-hidden group-hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 h-8 w-8 bg-indigo-50 rounded-bl-full" />
                            <p className="text-[11px] font-bold text-slate-400 tracking-widest mb-2 font-outfit">Critical Alert</p>
                            <p className="text-[13px] font-bold text-slate-900 font-outfit leading-tight mb-4">
                                12 interactions missed audit commitment in the last 24h.
                            </p>
                            <Button className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold group-hover:bg-indigo-600 transition-colors">
                                Review Missed Tags
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6">Sync Schedule</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'G-Suite Audit', status: 'Syncing', time: '12m ago', color: 'emerald' },
                                { name: 'Salesforce Connect', status: 'Idle', time: '2h ago', color: 'slate' },
                                { name: 'Phone Hub', status: 'Error', time: '5m ago', color: 'rose' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2 w-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]", `bg-${s.color}-500`)} />
                                        <span className="text-[11px] font-bold text-slate-700 font-outfit">{s.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-bold text-slate-400 tracking-wider font-outfit">{s.status}</span>
                                        <span className="text-[9px] font-medium text-slate-300 font-outfit">{s.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
