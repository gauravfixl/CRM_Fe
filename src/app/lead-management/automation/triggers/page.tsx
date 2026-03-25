"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    Plus,
    Filter,
    Search,
    ChevronLeft,
    Clock,
    Target,
    Activity,
    ShieldCheck,
    AlertCircle,
    ArrowRight,
    Play,
    Settings2,
    Trash2,
    MoreHorizontal,
    GitBranch,
    UserPlus,
    LayoutGrid,
    Flame
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
import { Switch } from "@/shared/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

// --- Mock Data: Triggers ---
const TRIGGERS = [
    {
        id: "1",
        name: "Lead Ingestion",
        event: "Lead Created",
        workflows: 4,
        status: true,
        category: "System",
        intensity: "High"
    },
    {
        id: "2",
        name: "Stage Movement",
        event: "Stage == 'Qualified'",
        workflows: 2,
        status: true,
        category: "Lifecycle",
        intensity: "Medium"
    },
    {
        id: "3",
        name: "Score Threshold",
        event: "Score > 80",
        workflows: 1,
        status: true,
        category: "Logic",
        intensity: "High"
    },
    {
        id: "4",
        name: "Behavioral Signal",
        event: "Web Visit + Page 'Pricing'",
        workflows: 3,
        status: false,
        category: "Behavioral",
        intensity: "Low"
    },
    {
        id: "5",
        name: "SLA Breach",
        event: "SLA Status == 'Breached'",
        workflows: 1,
        status: true,
        category: "Governance",
        intensity: "Critical"
    },
]

export default function TriggersPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [triggersList, setTriggersList] = useState(TRIGGERS)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newTrigger, setNewTrigger] = useState({ name: "", category: "System", event: "Lead Created" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCreateTrigger = () => {
        if (!newTrigger.name) {
            toast({ title: "Incomplete Formulation", description: "Trigger name is mandatory.", variant: "destructive" })
            return
        }
        setTriggersList([...triggersList, {
            ...newTrigger,
            id: Math.random().toString(36).substr(2, 9),
            workflows: 0,
            status: false,
            intensity: "Medium"
        }])
        toast({ title: "Trigger Configured", description: "New logic parameter integrated. Ready to bind." })
        setIsAddOpen(false)
        setNewTrigger({ name: "", category: "System", event: "Lead Created" })
    }

    const handleDelete = (id: string) => {
        setTriggersList(triggersList.filter(t => t.id !== id))
        toast({ title: "Trigger Discarded", description: "Event listener revoked." })
    }

    const toggleStatus = (id: string) => {
        setTriggersList(triggersList.map(t => t.id === id ? { ...t, status: !t.status } : t))
        toast({ description: "Trigger listener state modified." })
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
                            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                                <Zap className="h-5 w-5 fill-orange-600" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Automation Triggers
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The starting points of every process. Define the conditions (Lead creation, Field changes, Score jumps) that initiate your workflows.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Analyzing trigger network redundancy..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Activity className="h-4 w-4 mr-2 text-slate-400" /> Trigger Health
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Add Trigger
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Formulate New Trigger</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Trigger Concept</Label>
                                    <Input value={newTrigger.name} onChange={e => setNewTrigger({ ...newTrigger, name: e.target.value })} placeholder="e.g., Target Account Inbound" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Classification Domain</Label>
                                    <Select value={newTrigger.category} onValueChange={v => setNewTrigger({ ...newTrigger, category: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="System">System Layer</SelectItem>
                                            <SelectItem value="Lifecycle">Lifecycle Transition</SelectItem>
                                            <SelectItem value="Behavioral">Behavioral Signal</SelectItem>
                                            <SelectItem value="Governance">Automated Governance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Root Event / Condition</Label>
                                    <Input value={newTrigger.event} onChange={e => setNewTrigger({ ...newTrigger, event: e.target.value })} placeholder="e.g., API Form Submission" className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleCreateTrigger}>Inject Protocol</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Trigger Intensity Stats */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Daily Fire Count", val: "42,850", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
                        { label: "Active Nodes", val: "14", icon: GitBranch, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Avg Execution", val: "12ms", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Trigger Conflicts", val: "0", icon: ShieldCheck, color: "text-cyan-600", bg: "bg-cyan-50" },
                    ].map((m, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white overflow-hidden">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{m.label}</p>
                                    <h4 className="text-[20px] font-semibold tabular-nums text-slate-900">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Triggers Inventory Area */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Configured Triggers</h2>
                        <div className="flex items-center gap-4">
                            <Search className="h-4 w-4 text-slate-300" />
                            <Filter className="h-4 w-4 text-slate-300" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {triggersList.map((trigger) => (
                            <Card key={trigger.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-orange-100 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Name & Event */}
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className={`p-3 rounded-xl ${trigger.intensity === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'} group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors`}>
                                                    <Zap size={20} className={trigger.status ? 'fill-current' : ''} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[15px] font-semibold text-slate-900">{trigger.name}</h3>
                                                        <Badge className="bg-slate-50 text-slate-400 border-none font-semibold text-[8px] h-4.5 px-1.5 uppercase tracking-wide">{trigger.category}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-50 w-fit px-2 py-0.5 rounded border border-slate-100">
                                                        {trigger.event}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Workflows Connected */}
                                            <div className="flex flex-col items-center gap-1.5 min-w-[120px]">
                                                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">Subscribers</span>
                                                <Badge variant="outline" className="border-slate-100 text-[11px] font-semibold text-indigo-600 px-2 h-6 rounded-lg bg-indigo-50/10">
                                                    {trigger.workflows} Workflows
                                                </Badge>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-8 min-w-[220px] justify-end">
                                                <div className="text-right flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-4 text-right">
                                                        <div className="space-y-0.5 mr-2">
                                                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">Status</p>
                                                            <Switch checked={trigger.status} onCheckedChange={() => toggleStatus(trigger.id)} className="data-[state=checked]:bg-orange-500" />
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-xl">
                                                                    <MoreHorizontal size={18} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40 p-1 rounded-xl shadow-xl border-slate-100">
                                                                <DropdownMenuItem onClick={() => toast({ description: "Condition editor loading." })} className="text-[12px] font-medium py-2.5">Edit Conditions</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast({ description: "Simulating artificial payload." })} className="text-[12px] font-medium py-2.5">Test Trigger</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDelete(trigger.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Real-time Listeners Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
                                <Target size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Event Listeners</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                The platform is currently listening for 14 event types across Lead, Activity, and SLA entities.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h5 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Active Listeners</h5>
                            <div className="space-y-2">
                                {[
                                    { label: "Webhook Inbound", count: 124, active: true },
                                    { label: "Email Tracking", count: 850, active: true },
                                    { label: "API Direct", count: 42, active: true },
                                    { label: "Manual Override", count: 12, active: true },
                                ].map((l, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                        <span className="text-[12px] font-semibold text-slate-700">{l.label}</span>
                                        <Badge className="bg-white border-slate-100 text-indigo-600 text-[10px] h-5 px-1.5 font-semibold tabular-nums">{l.count} hits/hr</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-indigo-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500 transition-transform group-hover:scale-110">
                            <Plus size={100} />
                        </div>
                        <h4 className="text-[15px] font-semibold relative z-10">Custom Trigger SDK</h4>
                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed relative z-10">
                            Push your own custom events from external systems (ERP, Billing) via our Secure Trigger API.
                        </p>
                        <Button onClick={() => toast({ description: "Generating new SDK authorization token." })} className="w-full h-9 bg-white text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] rounded-xl border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Get API Key
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                            <AlertCircle size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-rose-900">Governance Warning</p>
                            <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                                "SLA Breach" trigger has no backup workflows configured. Failure to automate could lead to missed recovery.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
