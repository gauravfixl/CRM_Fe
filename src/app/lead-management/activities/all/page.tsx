"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Calendar,
    Phone,
    Mail,
    Users,
    CheckCircle2,
    Clock,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Download,
    MoreHorizontal,
    MoreVertical,
    Activity,
    ArrowUpRight,
    TrendingUp,
    Briefcase,
    LayoutGrid,
    MessageSquare,
    Zap,
    Scale,
    AlertCircle,
    UserCheck
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"

// --- Mock Data ---
const ACTIVITIES = [
    {
        id: "ACT-001",
        type: "Call",
        title: "Initial Discovery Call",
        lead: "Aarav Sharma",
        company: "Nexus Tech",
        owner: "Sarah Johnson",
        date: "Today, 10:30 AM",
        status: "Completed",
        priority: "High",
    },
    {
        id: "ACT-002",
        type: "Task",
        title: "Send Proposal Draft",
        lead: "Ishani Gupta",
        company: "Quantum Solutions",
        owner: "Michael Chen",
        date: "Today, 2:00 PM",
        status: "Scheduled",
        priority: "High",
    },
    {
        id: "ACT-003",
        type: "Meeting",
        title: "Contract Review Session",
        lead: "Rajesh Malhotra",
        company: "Malhotra Group",
        owner: "Sarah Johnson",
        date: "Tomorrow, 11:00 AM",
        status: "Scheduled",
        priority: "Critical",
    },
    {
        id: "ACT-004",
        type: "Email",
        title: "Follow-up: Pricing Inquiry",
        lead: "Zoya Khan",
        company: "Khan & Co",
        owner: "James Wilson",
        date: "Yesterday, 4:15 PM",
        status: "Completed",
        priority: "Medium",
    },
    {
        id: "ACT-005",
        type: "Call",
        title: "Vetting Session",
        lead: "Arjun Reddy",
        company: "Reddy Enterprises",
        owner: "David Brown",
        date: "2h ago",
        status: "Overdue",
        priority: "High",
    },
    {
        id: "ACT-006",
        type: "Task",
        title: "Update CRM Records",
        lead: "Pooja Singh",
        company: "Singh Logistics",
        owner: "Emily Davis",
        date: "Scheduled: 22 Feb",
        status: "Scheduled",
        priority: "Low",
    },
]

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"

const TYPE_ICONS = {
    Call: <Phone size={14} className="text-indigo-600" />,
    Task: <CheckCircle2 size={14} className="text-amber-600" />,
    Meeting: <Users size={14} className="text-emerald-600" />,
    Email: <Mail size={14} className="text-cyan-600" />,
}

const STATUS_COLORS = {
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Scheduled: "bg-blue-50 text-blue-600 border-blue-100",
    Overdue: "bg-rose-50 text-rose-600 border-rose-100",
}

const PRIORITY_COLORS = {
    Critical: "text-rose-600 font-bold",
    High: "text-orange-600 font-bold",
    Medium: "text-indigo-600 font-semibold",
    Low: "text-slate-400 font-medium",
}

export default function AllActivitiesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [activities, setActivities] = useState(ACTIVITIES)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newActivity, setNewActivity] = useState({
        title: "",
        type: "Call",
        lead: "",
        company: "",
        owner: "Sarah Johnson",
        priority: "High",
        status: "Scheduled",
        date: "Today, 4:00 PM"
    })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const filteredActivities = activities.filter(act =>
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.company.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddActivity = () => {
        if (!newActivity.title || !newActivity.lead) {
            toast({
                title: "Error",
                description: "Title and Lead name are required.",
                variant: "destructive"
            })
            return
        }

        const activity = {
            ...newActivity,
            id: `ACT-00${activities.length + 1}`,
        }
        setActivities([activity, ...activities])
        setIsAddOpen(false)
        setNewActivity({
            title: "",
            type: "Call",
            lead: "",
            company: "",
            owner: "Sarah Johnson",
            priority: "High",
            status: "Scheduled",
            date: "Today, 4:00 PM"
        })
        toast({
            title: "Success",
            description: "Activity scheduled successfully.",
        })
    }

    const handleDelete = (id: string) => {
        setActivities(activities.filter(a => a.id !== id))
        toast({
            title: "Deleted",
            description: "Activity has been removed.",
        })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Global Activity Inventory
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            A centralized command center for all lead interactions. Manage calls, meetings, tasks, and emails to drive pipeline velocity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export History
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Schedule Activity
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle className="text-[18px] font-bold text-slate-900 tracking-tight">Schedule New Activity</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Activity Title</Label>
                                    <Input
                                        placeholder="e.g., Deep Vetting Call"
                                        className="h-11 rounded-xl border-slate-100"
                                        value={newActivity.title}
                                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Type</Label>
                                        <Select value={newActivity.type} onValueChange={(val) => setNewActivity({ ...newActivity, type: val })}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-100">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-100">
                                                <SelectItem value="Call">Call</SelectItem>
                                                <SelectItem value="Meeting">Meeting</SelectItem>
                                                <SelectItem value="Task">Task</SelectItem>
                                                <SelectItem value="Email">Email</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Priority</Label>
                                        <Select value={newActivity.priority} onValueChange={(val) => setNewActivity({ ...newActivity, priority: val })}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-100">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-100">
                                                <SelectItem value="Critical">Critical</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Lead Name</Label>
                                    <Input
                                        placeholder="Full Name"
                                        className="h-11 rounded-xl border-slate-100"
                                        value={newActivity.lead}
                                        onChange={(e) => setNewActivity({ ...newActivity, lead: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Company</Label>
                                    <Input
                                        placeholder="e.g., Nexus Corp"
                                        className="h-11 rounded-xl border-slate-100"
                                        value={newActivity.company}
                                        onChange={(e) => setNewActivity({ ...newActivity, company: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="h-11 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100" onClick={handleAddActivity}>
                                    Schedule Activity
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Tactical Stats */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Today's Agenda", val: "12 Activities", detail: "4 Calls, 2 Meetings", icon: Zap, bg: "bg-amber-50", color: "text-amber-600" },
                        { label: "Pending Response", val: "18 Leads", detail: "Awaiting outreach", icon: MessageSquare, bg: "bg-indigo-50", color: "text-indigo-600" },
                        { label: "Overdue Actions", val: "14 Items", detail: "Needs immediate fix", icon: AlertCircle, bg: "bg-rose-50", color: "text-rose-600" },
                        { label: "Productivity", val: "92%", detail: "Close-to-completion", icon: TrendingUp, bg: "bg-emerald-50", color: "text-emerald-600" },
                    ].map((s, i) => (
                        <Card key={i} className={`border-none shadow-sm ring-1 ring-slate-100 rounded-2xl ${s.bg} p-4 space-y-3`}>
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-xl bg-white/80 ${s.color} shadow-sm`}>
                                    <s.icon size={18} />
                                </div>
                                <ArrowUpRight size={14} className="text-slate-400/50" />
                            </div>
                            <div className="space-y-0.5">
                                <p className={`text-[10px] font-semibold tracking-wider font-medium opacity-70 ${s.color}`}>{s.label}</p>
                                <h4 className="text-[18px] font-bold text-slate-900">{s.val}</h4>
                                <p className="text-[10px] text-slate-500 font-medium">{s.detail}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filter & Toolbar */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input
                                    placeholder="Search activities, leads..."
                                    className="pl-9 h-10 rounded-xl border-slate-100 bg-white text-[12px] font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-10 border-slate-100 text-slate-600 font-semibold px-4 gap-2">
                                <Filter size={14} className="text-slate-400" /> Filters
                                <Badge className="bg-indigo-100 text-indigo-600 border-none font-bold text-[9px] h-4">2</Badge>
                            </Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-xl border border-slate-100">
                                <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-semibold text-indigo-600 bg-white shadow-sm rounded-lg">List</Button>
                                <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-semibold text-slate-400 hover:text-slate-600">Calendar</Button>
                                <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-semibold text-slate-400 hover:text-slate-600">Kanban</Button>
                            </div>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent">
                                <TableHead className="w-[80px] text-[10px] font-bold text-slate-400 py-5">Type</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400">Activity Detail</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400">Lead / Company</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400">Owner</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400">Due Date</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400">Priority</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400">Status</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredActivities.map((act) => (
                                <TableRow key={act.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 w-fit">
                                            {TYPE_ICONS[act.type as keyof typeof TYPE_ICONS]}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="text-[14px] font-bold text-slate-900 line-clamp-1">{act.title}</p>
                                            <p className="text-[10px] font-semibold text-slate-400">{act.id}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="text-[14px] font-bold text-indigo-600 hover:underline cursor-pointer">{act.lead}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">{act.company}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                {act.owner.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-[13px] font-medium text-slate-600">{act.owner}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-[13px] font-bold ${act.status === 'Overdue' ? 'text-rose-500' : 'text-slate-600'}`}>{act.date}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-[12px] ${PRIORITY_COLORS[act.priority as keyof typeof PRIORITY_COLORS]}`}>
                                            {act.priority}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`text-[10px] font-bold border border-transparent ${STATUS_COLORS[act.status as keyof typeof STATUS_COLORS]}`}>
                                            {act.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-slate-300 hover:text-rose-600"
                                            onClick={() => handleDelete(act.id)}
                                        >
                                            <MoreHorizontal size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

            </div>

        </div>
    )
}
