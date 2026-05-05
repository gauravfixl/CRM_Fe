"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    AlertCircle,
    Clock,
    Flame,
    ChevronLeft,
    RefreshCw,
    Search,
    Filter,
    ArrowUpRight,
    TrendingDown,
    Zap,
    Scale,
    Layers,
    UserX,
    Briefcase,
    Activity,
    CheckCircle2,
    Calendar,
    Phone,
    Mail,
    Users,
    MoreHorizontal,
    Flag
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"

const INITIAL_OVERDUE = [
    {
        id: "ACT-005",
        type: "Call",
        title: "Vetting Session with Arjun",
        lead: "Arjun Reddy",
        company: "Reddy Enterprises",
        due: "Yesterday, 10:00 AM",
        delay: "26h late",
        priority: "Critical",
        owner: "David Brown"
    },
    {
        id: "ACT-012",
        type: "Email",
        title: "Follow-up: Contract Review",
        lead: "Pooja Singh",
        company: "Singh Logistics",
        due: "2 days ago",
        delay: "48h late",
        priority: "High",
        owner: "Emily Davis"
    },
    {
        id: "ACT-015",
        type: "Meeting",
        title: "Strategy Calibration",
        lead: "Karan Johar",
        company: "Dharma Prod",
        due: "Today, 9:00 AM",
        delay: "4h late",
        priority: "Medium",
        owner: "James Wilson"
    },
]

const TYPE_ICONS = {
    Call: <Phone size={14} className="text-rose-600" />,
    Task: <CheckCircle2 size={14} className="text-rose-600" />,
    Meeting: <Users size={14} className="text-rose-600" />,
    Email: <Mail size={14} className="text-rose-600" />,
}

export default function OverdueActivitiesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [items, setItems] = useState(INITIAL_OVERDUE)
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleExecute = (id: string) => {
        setItems(items.filter(i => i.id !== id))
        toast({
            title: "Action Resolved",
            description: "Activity has been processed and removed from overdue queue.",
        })
    }

    const handleProtocol = () => {
        toast({
            title: "Protocol Enabled",
            description: "Auto-reassignment system is now active for this department.",
        })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm border-l-[6px] border-l-rose-500">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-rose-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                                <AlertCircle size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Overdue Action Response
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Critical operational bottlenecks. These activities have breached their scheduled deadlines and are negatively impacting sales velocity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <p className="text-[10px] font-semibold text-rose-400 font-medium">SLA Breached</p>
                        <h4 className="text-[18px] font-semibold text-rose-600">{items.length} Items</h4>
                    </div>
                    <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 shadow-rose-100 shadow-lg border-none text-[11px]">
                                <RefreshCw className="h-4 w-4 mr-2" /> Bulk Reschedule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-[18px] font-semibold text-slate-900">Bulk Reschedule Recovery</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <p className="text-[13px] text-slate-500 font-medium tracking-tight">Move all {items.length} items to a new availability window.</p>
                                <Input type="date" className="h-11 rounded-xl" />
                                <Button className="w-full h-11 bg-indigo-600 font-bold rounded-xl" onClick={() => {
                                    setIsRescheduleOpen(false)
                                    toast({ title: "Schedule Updated", description: "All items have been pushed to tomorrow morning." })
                                }}>Apply Recovery</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Priority Risk Area */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-sm ring-1 ring-rose-100 rounded-3xl bg-rose-50 text-slate-900 p-6 space-y-4 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-rose-300 translate-x-4">
                            <Flame size={120} />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-semibold text-rose-600 tracking-wider leading-none">High-Risk Pipeline</p>
                            <h3 className="text-[24px] font-semibold tracking-tight text-slate-900">$124,500</h3>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed relative z-10">
                            Total opportunity value currently stuck in overdue activities. Immediate action required to prevent churn.
                        </p>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                                <Clock size={20} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-300">Avg Delay</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[20px] font-semibold text-slate-900">32.4 Hours</h4>
                            <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1.5 align-middle">
                                <TrendingDown size={12} /> +12h vs last week
                            </p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                                <Flag size={20} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-300">Critical Priority</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[20px] font-semibold text-slate-900">6 Issues</h4>
                            <p className="text-[11px] text-slate-500 font-medium tracking-tight">Assigned to Tier-1 Leads</p>
                        </div>
                    </Card>
                </div>

                {/* Overdue List */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Overdue Inventory</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Sorted by delay duration (highest first).</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {items.map((act) => (
                            <div key={act.id} className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-rose-200 hover:bg-rose-50/10 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:border-rose-100">
                                        {TYPE_ICONS[act.type as keyof typeof TYPE_ICONS]}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[16px] font-semibold text-slate-900 group-hover:text-rose-600 transition-colors tracking-tight">{act.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-rose-500 text-white border-none h-4.5 text-[9px] font-semibold">{act.delay}</Badge>
                                            <span className="text-[11px] font-semibold text-slate-400">Due: {act.due}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-center gap-1 min-w-[150px]">
                                    <p className="text-[10px] font-semibold text-slate-300 tracking-wider">Lead Impact</p>
                                    <h4 className="text-[14px] font-semibold text-slate-900">{act.lead}</h4>
                                    <p className="text-[11px] text-indigo-600 font-semibold">{act.company}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block mr-4">
                                        <p className="text-[10px] font-semibold text-slate-300">Owner</p>
                                        <h4 className="text-[13px] font-semibold text-slate-900">{act.owner}</h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => handleExecute(act.id)}
                                            className="h-10 bg-white text-rose-600 hover:bg-rose-600 hover:text-white border-2 border-rose-100 hover:border-rose-600 font-semibold text-[11px] px-6 rounded-xl transition-all shadow-sm"
                                        >
                                            Execute
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-slate-900">
                                            <MoreHorizontal size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Automation Tip */}
                <Card className="lg:col-span-12 p-8 rounded-3xl bg-indigo-50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="h-16 w-16 rounded-2xl bg-white shadow-xl shadow-indigo-200/50 flex items-center justify-center text-indigo-600 shrink-0">
                            <Zap size={32} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[20px] font-semibold text-indigo-900 tracking-tight">Enable Auto-Reassignment?</h4>
                            <p className="text-[14px] text-indigo-700 font-medium leading-relaxed max-w-2xl">
                                System detected that **David Brown** has 8 overdue items. Automated protocol can reassign these to available reps to prevent lead decay.
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleProtocol} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 rounded-xl shadow-lg shadow-indigo-100 border-none text-[11px]">Enable Protocol</Button>
                </Card>

            </div>

        </div>
    )
}
