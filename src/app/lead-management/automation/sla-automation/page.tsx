"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Clock,
    Zap,
    Scale,
    ShieldAlert,
    AlertTriangle,
    Bell,
    UserCircle2,
    ArrowUpRight,
    Settings2,
    Trash2,
    MoreHorizontal,
    GitBranch,
    BarChart3,
    CheckCircle2,
    Flame,
    Timer,
    Info,
    ShieldCheck
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

// --- Mock Data: SLA Automation Rules ---
const SLA_AUTOMATION_RULES = [
    {
        id: "1",
        name: "First Response Escalation",
        trigger: "SLA Status == 'Breached'",
        policy: "Enterprise First Response",
        actions: ["Notify Manager", "Tag: Missed SLA", "Re-assign to Pool"],
        intensity: "Critical",
        impact: 12
    },
    {
        id: "2",
        name: "Proactive Warning",
        trigger: "SLA Time Remaining < 15m",
        policy: "All High-Intensity",
        actions: ["Push Owner Notify", "Slack Alert: L1 Team"],
        intensity: "High",
        impact: 42
    },
    {
        id: "3",
        name: "Stage Stagnation Recovery",
        trigger: "Time in Stage > 3 Days",
        policy: "Discovery Stage",
        actions: ["Send Reminder Email", "Move to 'Stagnant' Queue"],
        intensity: "Moderate",
        impact: 8
    },
]

export default function SLAAutomationPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [rules, setRules] = useState(SLA_AUTOMATION_RULES)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newRule, setNewRule] = useState({ name: "", trigger: "SLA Time Remaining < 15m", policy: "Enterprise First Response", intensity: "Moderate" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCreateRule = () => {
        if (!newRule.name) {
            toast({ title: "Incomplete Formulation", description: "Esclation rule name is required.", variant: "destructive" })
            return
        }
        setRules([...rules, {
            ...newRule,
            id: Math.random().toString(36).substr(2, 9),
            actions: ["Notify Manager", "Tag: Potential Breach"],
            impact: 0
        }])
        toast({ title: "Rule Activated", description: "Automated engine updated with new SLA escalation parameters." })
        setIsAddOpen(false)
        setNewRule({ name: "", trigger: "SLA Time Remaining < 15m", policy: "Enterprise First Response", intensity: "Moderate" })
    }

    const handleDelete = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
        toast({ title: "Rule Terminated", description: "Escalation flow successfully unregistered." })
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
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                SLA-Triggered Automation
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The recovery engine for your pipeline discipline. Automate escalations, alerts, and reassignments the moment a service level agreement is at risk.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Opening resolution schema mapping..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Timer className="h-4 w-4 mr-2 text-slate-400" /> Resolution Matrix
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Define Recovery Flow
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Establish Escalation Pathway</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Rule Designator</Label>
                                    <Input value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g., Critical Lead Rescue" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Engine Trigger</Label>
                                    <Select value={newRule.trigger} onValueChange={v => setNewRule({ ...newRule, trigger: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="SLA Time Remaining < 15m">SLA Time Remaining &lt; 15m</SelectItem>
                                            <SelectItem value="SLA Status == 'Breached'">SLA Status == 'Breached'</SelectItem>
                                            <SelectItem value="Time in Stage > 3 Days">Time in Stage &gt; 3 Days</SelectItem>
                                            <SelectItem value="Owner Inactive > 2h">Owner Inactive &gt; 2h</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Target Policy Segment</Label>
                                    <Input value={newRule.policy} onChange={e => setNewRule({ ...newRule, policy: e.target.value })} placeholder="e.g., All High-Intensity" className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleCreateRule}>Deploy Flow</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Active Recovery Rules Inventory */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                            Recovery & Escalation Rules <Badge className="bg-rose-100 text-rose-600 border-none px-2 h-5 text-[10px] font-semibold uppercase tracking-wider">{rules.length}</Badge>
                        </h2>
                        <div className="flex items-center gap-4">
                            <Search className="h-4 w-4 text-slate-300" />
                            <Filter className="h-4 w-4 text-slate-300" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {rules.map((rule) => (
                            <Card key={rule.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-rose-200 transition-all bg-white overflow-hidden border-l-4 border-l-transparent hover:border-l-rose-500">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Name & Logic */}
                                            <div className="flex items-center gap-4 min-w-[300px]">
                                                <div className={`p-3 rounded-xl ${rule.intensity === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'} transition-colors`}>
                                                    <Flame size={20} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-[15px] font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">{rule.name}</h3>
                                                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                                        <span className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-indigo-500">{rule.trigger}</span>
                                                        <span>/</span>
                                                        <span>Policy: {rule.policy}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Pipeline */}
                                            <div className="flex flex-col items-center gap-2 min-w-[200px]">
                                                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">Automated Actions</span>
                                                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                                    {rule.actions.map((act, i) => (
                                                        <Badge key={i} className="bg-slate-50 text-slate-600 border-slate-100 text-[9px] font-semibold px-1.5 h-5 rounded hover:bg-white">{act}</Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Intensity & Stats */}
                                            <div className="flex items-center gap-8 min-w-[200px] justify-end">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">Last 24h Impact</p>
                                                    <h4 className="text-[18px] font-semibold text-slate-900 tabular-nums mt-0.5">{rule.impact} <span className="text-[10px] font-medium text-slate-400 tracking-normal ml-1">saves</span></h4>
                                                </div>
                                                <div className="w-px h-10 bg-slate-50" />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => toast({ description: "Simulating specific path ruleset..." })} className="py-2.5 text-[12px] font-medium">Test Recovery Path</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ description: "Opening configuration editor..." })} className="py-2.5 text-[12px] font-medium">Edit Escalation</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(rule.id)} className="py-2.5 text-[12px] font-semibold text-rose-500">Deactivate</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Performance & Health Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
                                <Activity size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold">Automation Performance</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Percentage of breached leads successfully recovered by the automation engine.
                            </p>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            <div className="flex flex-col items-center py-4 bg-slate-50/50 rounded-3xl border border-slate-100/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <CheckCircle2 size={100} />
                                </div>
                                <h3 className="text-[36px] font-semibold text-slate-900 tracking-tighter leading-none">92%</h3>
                                <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider mt-2">Recovery Rate</p>
                                <div className="h-1.5 w-[60%] bg-white rounded-full mt-4 overflow-hidden border border-slate-100">
                                    <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h5 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Failure Breakdown</h5>
                                {[
                                    { label: "Empty Pools", val: 4, color: "bg-rose-400" },
                                    { label: "Logic Conflicts", val: 2, color: "bg-amber-400" },
                                    { label: "Notification Timeout", val: 2, color: "bg-slate-300" },
                                ].map((f, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${f.color}`} />
                                            <span className="text-[12px] font-semibold text-slate-700">{f.label}</span>
                                        </div>
                                        <span className="text-[12px] font-semibold text-slate-400">{f.val}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-amber-50 text-amber-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 text-amber-500 transition-transform group-hover:scale-110">
                            <ShieldCheck size={120} />
                        </div>
                        <h4 className="text-[16px] font-semibold tracking-tight relative z-10">Escalation Integrity</h4>
                        <p className="text-[12px] text-amber-700 font-medium leading-relaxed relative z-10">
                            Every recovery action is audited for compliance. Ensure your multi-step escalation ladders don't bypass manager oversight.
                        </p>
                        <Button onClick={() => toast({ description: "Initiating oversight and integrity check sequence." })} className="w-full h-10 bg-white text-amber-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-wider rounded-xl border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Audit Matrix
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                            <Info size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-indigo-900">Automation Insight</p>
                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                                "Warning triggers firing at 20m instead of 15m could reduce critical breaches by 14%."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
