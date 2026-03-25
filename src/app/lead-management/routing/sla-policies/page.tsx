"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Clock,
    Plus,
    Filter,
    Settings2,
    ChevronLeft,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Users,
    Zap,
    Scale,
    Timer,
    Flame,
    Gauge,
    Save
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
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: SLA Policies ---
const SLA_POLICIES = [
    {
        id: "1",
        name: "Enterprise High-Priority SLA",
        type: "First Response",
        targetTime: "15 min",
        segment: "Score > 80",
        urgency: "Emergency",
        status: "Active",
        compliance: 94
    },
    {
        id: "2",
        name: "Standard Inbound Follow-up",
        type: "Next Activity",
        targetTime: "2 hours",
        segment: "All Inbound",
        urgency: "High",
        status: "Active",
        compliance: 82
    },
    {
        id: "3",
        name: "Long-Term Nurture Gate",
        type: "Stage Movement",
        targetTime: "7 days",
        segment: "Nurturing Phase",
        urgency: "Medium",
        status: "Active",
        compliance: 68
    },
    {
        id: "4",
        name: "Trial Conversion Speed",
        type: "Discovery Done",
        targetTime: "24 hours",
        segment: "Trial Leads",
        urgency: "High",
        status: "Draft",
        compliance: 0
    },
]

export default function SLAPoliciesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [policies, setPolicies] = useState(SLA_POLICIES)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newPolicy, setNewPolicy] = useState({ name: "", type: "First Response", targetTime: "", urgency: "Medium" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleAddPolicy = () => {
        if (!newPolicy.name || !newPolicy.targetTime) {
            toast({ title: "Incomplete Data", description: "Please provide a policy name and target time.", variant: "destructive" })
            return
        }
        setPolicies([...policies, {
            ...newPolicy,
            id: Math.random().toString(36).substr(2, 9),
            segment: "All Leads",
            status: "Draft",
            compliance: 0
        }])
        toast({ title: "Policy Created", description: "New SLA policy saved as draft." })
        setIsAddOpen(false)
        setNewPolicy({ name: "", type: "First Response", targetTime: "", urgency: "Medium" })
    }

    const handleDelete = (id: string) => {
        setPolicies(policies.filter(p => p.id !== id))
        toast({ title: "Policy Deleted", description: "The SLA policy has been successfully removed." })
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
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <Timer className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                SLA Policies & Discipline
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Define response time targets for every stage of the funnel. Enforce discipline and maintain high lead velocity across teams.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ title: "Global Settings", description: "Loading enterprise-wide grace periods." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Settings2 className="h-4 w-4 mr-2 text-slate-400" /> Global Grace Periods
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Define New SLA
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Define SLA Policy</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Policy Name</Label>
                                    <Input value={newPolicy.name} onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })} placeholder="e.g., Enterprise Rapid Response" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">SLA Type</Label>
                                    <Select value={newPolicy.type} onValueChange={v => setNewPolicy({ ...newPolicy, type: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="First Response">First Response</SelectItem>
                                            <SelectItem value="Next Activity">Next Activity</SelectItem>
                                            <SelectItem value="Stage Movement">Stage Movement</SelectItem>
                                            <SelectItem value="Discovery Done">Discovery Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Target Time (e.g., 15 min, 2 hours)</Label>
                                    <Input value={newPolicy.targetTime} onChange={e => setNewPolicy({ ...newPolicy, targetTime: e.target.value })} placeholder="Target resolution time..." className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Urgency Level</Label>
                                    <Select value={newPolicy.urgency} onValueChange={v => setNewPolicy({ ...newPolicy, urgency: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Emergency">Emergency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddPolicy}>Save as Draft</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Metric Summary */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Compliance Index", val: "84.2%", icon: Gauge, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Active Policies", val: "12", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Avg. Breach Delay", val: "14m", icon: Clock, color: "text-rose-500", bg: "bg-rose-50" },
                        { label: "Recovery Rate", val: "72%", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                    ].map((m, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden bg-white">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold text-slate-400 tracking-wider">{m.label}</p>
                                    <h4 className="text-[24px] font-semibold tabular-nums text-slate-900 tracking-tighter">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                                    <m.icon size={20} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Policies List */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Governance Policies</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: "View Switched", description: "Now tracking SLA compliance matrix." })} className="h-8 text-[11px] font-semibold text-slate-400 tracking-wider">Compliance View</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {policies.map((sla) => (
                            <Card key={sla.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white transition-all hover:ring-indigo-100 group overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-600">
                                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`p-3 rounded-xl ${sla.urgency === 'Emergency' ? 'bg-rose-50 text-rose-500' : sla.urgency === 'High' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'}`}>
                                            {sla.urgency === 'Emergency' ? <Flame size={20} /> : <Timer size={20} />}
                                        </div>
                                        <div className="space-y-1 truncate">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-[15px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{sla.name}</h4>
                                                <Badge className={`
                                                    ${sla.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'} 
                                                    border-none h-4.5 px-1.5 text-[8px] font-semibold tracking-wider
                                                `}>
                                                    {sla.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                                                <span>Type: <span className="text-slate-700 font-semibold">{sla.type}</span></span>
                                                <span className="text-slate-200">•</span>
                                                <span>Target: <span className="text-indigo-600 font-semibold tabular-nums">{sla.targetTime}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                                            <div className="flex justify-between items-center w-full text-[10px] font-semibold text-slate-400 tracking-wider">
                                                <span>Compliance</span>
                                                <span className={`${sla.compliance > 80 ? 'text-emerald-500' : sla.compliance > 0 ? 'text-rose-500' : 'text-slate-300'}`}>{sla.compliance}%</span>
                                            </div>
                                            <Progress value={sla.compliance} className={`h-1.5 w-full bg-slate-50 ${sla.compliance > 80 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-rose-500'}`} />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => toast({ title: "Policy Settings", description: "Opening configuration engine." })} className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                                <Settings2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sla.id)} className="h-9 w-9 text-slate-300 hover:text-rose-500 rounded-xl">
                                                <AlertCircle size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 w-fit">
                                <Scale size={24} />
                            </div>
                            <h4 className="text-[16px] font-bold">Policy Enforcement</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Defines what happens automatically when an SLA is breached.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h5 className="text-[11px] font-semibold text-slate-400 tracking-wider">Breach Actions</h5>
                            <div className="space-y-3">
                                {[
                                    { label: "Notification Spike", desc: "Push to Manager after 5m breach", active: true },
                                    { label: "Auto-Reassignment", desc: "Trigger Escalation Plan level-2", active: true },
                                    { label: "Rep Score Penalty", desc: "Deduct 5 internal rep points", active: false },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                        <div className="space-y-0.5">
                                            <p className="text-[12px] font-semibold text-slate-700">{a.label}</p>
                                            <p className="text-[9px] font-medium text-slate-400">{a.desc}</p>
                                        </div>
                                        <Switch checked={a.active} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-indigo-900 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-100/50 flex items-center justify-center text-indigo-600">
                                <ShieldCheck size={20} />
                            </div>
                            <h4 className="text-[16px] font-semibold tracking-tight">SLA Guard</h4>
                        </div>
                        <p className="text-[12px] text-indigo-600/80 font-medium leading-relaxed">
                            SLA Guard allows 10% "Buffer Time" for teams during peak hours (10:00 - 12:00) to prevent false breaches.
                        </p>
                        <Button variant="ghost" onClick={() => toast({ title: "SLA Guard", description: "Buffer thresholds matrix opened." })} className="w-full h-9 bg-white border border-transparent shadow-sm text-indigo-600 font-semibold text-[11px] rounded-xl hover:bg-slate-50 tracking-wider">
                            Configure Buffer
                        </Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
