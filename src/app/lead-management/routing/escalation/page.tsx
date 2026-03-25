"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowUpRight,
    Plus,
    Clock,
    UserCheck,
    Bell,
    Settings2,
    ChevronLeft,
    AlertTriangle,
    ShieldAlert,
    RefreshCcw,
    ChevronRight,
    Users,
    Mail,
    Phone,
    Trash2,
    Zap,
    ArrowRightCircle
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"

// --- Mock Data: Escalation Steps ---
const ESCALATION_PLANS = [
    {
        id: "1",
        name: "Standard High-Intent Policy",
        trigger: "No First Response within 30 mins",
        levels: [
            { id: "l1", target: "Current Owner", action: "Push Notification + SMS", delay: "0m" },
            { id: "l2", target: "Team Lead", action: "Reassign to Available Rep", delay: "15m" },
            { id: "l3", target: "Sales Manager", action: "Manual Review Alert", delay: "1h" },
        ],
        active: true,
        segment: "High Score leads"
    },
    {
        id: "2",
        name: "Weekend Inactivity Recovery",
        trigger: "Stage == 'New' for > 12 Hours",
        levels: [
            { id: "w1", target: "Lead Owner", action: "Email Reminder", delay: "0m" },
            { id: "w2", target: "Global Queue", action: "Return to General Pool", delay: "4h" },
        ],
        active: true,
        segment: "All Leads"
    }
]

export default function EscalationPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [plans, setPlans] = useState(ESCALATION_PLANS)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newPlan, setNewPlan] = useState({ name: "", trigger: "", segment: "All Leads" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleAddPlan = () => {
        if (!newPlan.name || !newPlan.trigger) {
            toast({ title: "Incomplete Data", description: "Please provide a plan name and a trigger condition.", variant: "destructive" })
            return
        }
        setPlans([...plans, {
            ...newPlan,
            id: Math.random().toString(36).substr(2, 9),
            active: true,
            levels: [
                { id: "l1", target: "Current Owner", action: "Push Notification", delay: "0m" }
            ]
        }])
        toast({ title: "Escalation Plan Created", description: "New recovery sequence added." })
        setIsAddOpen(false)
        setNewPlan({ name: "", trigger: "", segment: "All Leads" })
    }

    const togglePlanStatus = (id: string) => {
        setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p))
        toast({ title: "Plan Toggled", description: "Escalation workflow status updated." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Reassignment & Escalation
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Ensure no lead gets stuck. Automate reassignment if owners don't respond within SLA targets and escalate issues to management.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ title: "Notification Logic", description: "Loading escalation webhook rules..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Bell className="h-4 w-4 mr-2 text-slate-400" /> Notification Logic
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> New Recovery Plan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Create Recovery Plan</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Plan Name</Label>
                                    <Input value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} placeholder="e.g., Enterprise Weekend Recovery" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Trigger Logic (e.g., 2h without contact)</Label>
                                    <Input value={newPlan.trigger} onChange={e => setNewPlan({ ...newPlan, trigger: e.target.value })} placeholder="Define when to activate..." className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Target Segment</Label>
                                    <Select value={newPlan.segment} onValueChange={v => setNewPlan({ ...newPlan, segment: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="All Leads">All Leads</SelectItem>
                                            <SelectItem value="High Score leads">High Score leads</SelectItem>
                                            <SelectItem value="Enterprise Segment">Enterprise Segment</SelectItem>
                                            <SelectItem value="Inbound Organic">Inbound Organic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddPlan}>Initialize Workflow</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Active Escalation Plans */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Escalation Workflows</h2>
                        <Badge variant="outline" className="border-slate-100 bg-white shadow-sm text-slate-400 font-semibold text-[10px] tracking-wider h-6">Priority Sequenced</Badge>
                    </div>

                    <div className="space-y-4">
                        {plans.map((plan) => (
                            <Card key={plan.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden transition-all hover:ring-rose-100 group">
                                <CardHeader className="p-6 pb-0 border-b border-slate-50 relative">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <CardTitle className="text-[17px] font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">{plan.name}</CardTitle>
                                                <Badge className="bg-slate-50 text-slate-400 border-none font-semibold text-[9px] px-2 h-5 uppercase tracking-wide">{plan.segment}</Badge>
                                            </div>
                                            <p className="text-[12px] font-medium text-slate-400 italic">Trigger: {plan.trigger}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Switch checked={plan.active} onCheckedChange={() => togglePlanStatus(plan.id)} className="data-[state=checked]:bg-rose-500" />
                                            <Button variant="ghost" onClick={() => toast({ title: "Workflow Matrix", description: "Matrix definition logic requested." })} size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-900">
                                                <Settings2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-slate-50 mt-6 overflow-hidden">
                                        <div className="h-full bg-rose-500 w-1/3" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 bg-slate-50/30">
                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        {plan.levels.map((level, idx) => (
                                            <React.Fragment key={level.id}>
                                                <div className="flex-1 min-w-[180px] p-4 rounded-2xl bg-white border border-slate-100 shadow-sm relative group/level">
                                                    <span className="absolute -top-2 left-4 px-2 bg-slate-900 text-white text-[9px] font-semibold rounded-full uppercase tracking-widest group-hover:bg-rose-500 transition-colors">LVL {idx + 1}</span>
                                                    <div className="space-y-3 pt-1">
                                                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                                                            <span>Delay: {level.delay}</span>
                                                            <Users size={12} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[13px] font-semibold text-slate-900">{level.target}</p>
                                                            <p className="text-[11px] font-medium text-slate-500 leading-none">{level.action}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {idx < plan.levels.length - 1 && (
                                                    <ChevronRight className="text-slate-200 hidden md:block" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                        <div className="flex-shrink-0 p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 tracking-wider">
                                        <span className="flex items-center gap-1.5"><Zap size={12} className="text-rose-500" /> 12 Hits this week</span>
                                        <span className="flex items-center gap-1.5 text-emerald-500"><Clock size={12} /> 94% Recovered</span>
                                    </div>
                                    <Button variant="ghost" className="h-7 text-rose-500 font-semibold text-[10px] tracking-widest hover:bg-rose-100 uppercase">
                                        View Action Log
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Global Escalation Dashboard */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Recovery Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100/50 space-y-1">
                                    <p className="text-[10px] font-semibold tracking-wider text-indigo-500 uppercase">Auto-Reassigned</p>
                                    <h4 className="text-[24px] font-semibold tabular-nums text-indigo-900 tracking-tighter">420</h4>
                                </div>
                                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100/50 space-y-1">
                                    <p className="text-[10px] font-semibold tracking-wider text-rose-500 uppercase">L3 Escalations</p>
                                    <h4 className="text-[24px] font-semibold tabular-nums text-rose-900 tracking-tighter">14</h4>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <h5 className="text-[11px] font-semibold text-slate-400 tracking-wider">Reason Distribution</h5>
                                <div className="space-y-3">
                                    {[
                                        { label: "Missed SLA", val: 65, color: "bg-rose-500" },
                                        { label: "Out of Office", val: 20, color: "bg-amber-500" },
                                        { label: "Manual Override", val: 15, color: "bg-indigo-500" },
                                    ].map((r, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between text-[11px] font-semibold tracking-wider text-slate-600">
                                                <span>{r.label}</span>
                                                <span className="tabular-nums">{r.val}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div className={`h-full ${r.color}`} style={{ width: `${r.val}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-indigo-900 p-6 space-y-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform -rotate-12">
                            <ArrowRightCircle size={100} className="text-indigo-600" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <div className="p-2.5 rounded-xl bg-indigo-100/50 w-fit">
                                <RefreshCcw size={20} className="text-indigo-600" />
                            </div>
                            <h4 className="text-[16px] font-semibold">Return to Queue Policy</h4>
                            <p className="text-[12px] text-indigo-600/80 font-medium leading-relaxed">
                                Leads reassigned more than 3 times are automatically moved to the **High-Touch Governance Pool**.
                            </p>
                        </div>
                        <Button onClick={() => toast({ title: "Threshold Check", description: "Adjust auto-return assignment limits." })} className="w-full h-10 bg-white shadow border-transparent text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest relative z-10">
                            Adjust Return Thresholds
                        </Button>
                    </Card>

                    {/* Operational Alert */}
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                            <AlertTriangle size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-amber-900">Config Conflict Detected</p>
                            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                                Strategy **"Weekend Recovery"** overlaps with **"General Inbound"** for leads in EMEA region.
                            </p>
                            <Button variant="ghost" onClick={() => toast({ title: "Conflict Resolver", description: "Calculating resolution paths for overlapping strategies..." })} className="h-auto p-0 pt-1 text-[10px] font-semibold tracking-wider uppercase text-amber-800 hover:text-amber-900 hover:bg-transparent mt-1">
                                Resolve Conflict
                            </Button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
