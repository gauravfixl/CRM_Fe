"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Repeat,
    Plus,
    Users,
    Zap,
    Scale,
    Target,
    Clock,
    ShieldCheck,
    ChevronLeft,
    TrendingUp,
    Settings,
    MoreHorizontal,
    LayoutGrid,
    Search,
    Filter,
    BarChart3
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"
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

// --- Mock Data: Assignment Methods ---
const ASSIGNMENT_METHODS = [
    {
        id: "1",
        name: "Standard Round Robin",
        type: "Round Robin",
        active: true,
        usage: "Inbound BDR Team",
        lastFired: "3 mins ago",
        efficiency: 98,
        description: "Equal distribution regardless of current load."
    },
    {
        id: "2",
        name: "Capacity Balancing",
        type: "Load Balanced",
        active: true,
        usage: "Enterprise AE Team",
        lastFired: "12 mins ago",
        efficiency: 94,
        description: "Prioritize reps with fewer than 5 active leads."
    },
    {
        id: "3",
        name: "Senior Advantage (Weighted)",
        type: "Weighted",
        active: false,
        usage: "High Value Segments",
        lastFired: "N/A",
        efficiency: 0,
        description: "Senior Reps get 60%, Juniors get 40%."
    },
    {
        id: "4",
        name: "Geographical Territory Match",
        type: "Territory Based",
        active: true,
        usage: "Global Sales Hub",
        lastFired: "1 hour ago",
        efficiency: 100,
        description: "Route by lead's 'Country' property Match."
    },
]

export default function AssignmentMethodsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [methods, setMethods] = useState(ASSIGNMENT_METHODS)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newMethod, setNewMethod] = useState({ name: "", type: "Round Robin", usage: "", description: "" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const toggleMethodStatus = (id: string) => {
        setMethods(methods.map(m => m.id === id ? { ...m, active: !m.active } : m))
        toast({ title: "Distribution Toggled", description: "Assignment method activation state changed." })
    }

    const enforceWeighted = () => {
        setMethods(methods.map(m => m.name.includes("Weighted") ? { ...m, active: true } : m))
        toast({ title: "Strategy Applied", description: "Enterprise segments will now prioritize weighted distribution." })
    }

    const handleAddMethod = () => {
        if (!newMethod.name || !newMethod.usage) {
            toast({ title: "Incomplete Data", description: "Please specify the method name and usage pool.", variant: "destructive" })
            return
        }
        setMethods([...methods, {
            ...newMethod,
            id: Math.random().toString(36).substr(2, 9),
            active: true,
            lastFired: "N/A",
            efficiency: 0
        }])
        toast({ title: "Method Created", description: "New assignment scheme successfully added." })
        setIsAddOpen(false)
        setNewMethod({ name: "", type: "Round Robin", usage: "", description: "" })
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
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Assignment Mechanics
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Select how leads are distributed among team members. Use balanced methods for volume and weighted for value optimization.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ title: "Fetching Metrics", description: "Loading recent performance data..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <BarChart3 className="h-4 w-4 mr-2 text-slate-400" /> Method Performance
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Add Mechanic
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Add Assignment Mechanic</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Method Name</Label>
                                    <Input value={newMethod.name} onChange={e => setNewMethod({ ...newMethod, name: e.target.value })} placeholder="e.g., SLA First" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Distribution Type</Label>
                                    <Select value={newMethod.type} onValueChange={v => setNewMethod({ ...newMethod, type: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Round Robin">Round Robin</SelectItem>
                                            <SelectItem value="Load Balanced">Load Balanced</SelectItem>
                                            <SelectItem value="Weighted">Weighted</SelectItem>
                                            <SelectItem value="Territory Based">Territory Based</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Assigned Pool</Label>
                                    <Input value={newMethod.usage} onChange={e => setNewMethod({ ...newMethod, usage: e.target.value })} placeholder="e.g., Inbound SaaS Team" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Description</Label>
                                    <Input value={newMethod.description} onChange={e => setNewMethod({ ...newMethod, description: e.target.value })} placeholder="Brief logic explanation..." className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddMethod}>Save Mechanic</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Methods Overview */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Active Methods", val: "3", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Avg. Sync Time", val: "140ms", icon: Clock, color: "text-cyan-600", bg: "bg-cyan-50" },
                        { label: "Equity Index", val: "92/100", icon: Scale, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Overflow Checks", val: "Enabled", icon: ShieldCheck, color: "text-slate-600", bg: "bg-slate-50" },
                    ].map((m, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white overflow-hidden">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold text-slate-400 tracking-wider">{m.label}</p>
                                    <h4 className="text-[20px] font-semibold tabular-nums text-slate-900">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Mechanic Cards Area */}
                <div className="lg:col-span-12">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Distribution Schemes</h2>
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-slate-300" />
                            <span className="text-[11px] font-semibold text-slate-400 tracking-wider">Filter by pool</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {methods.map((method) => (
                            <Card key={method.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden flex flex-col">
                                <CardContent className="p-8 space-y-6 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[18px] font-semibold text-slate-900">{method.name}</h3>
                                                <Badge className="bg-slate-50 text-slate-400 border-none font-semibold text-[9px] h-4.5 px-1.5 uppercase tracking-wide">
                                                    {method.type}
                                                </Badge>
                                            </div>
                                            <p className="text-[13px] text-slate-500 font-medium">{method.description}</p>
                                        </div>
                                        <Switch checked={method.active} onCheckedChange={() => toggleMethodStatus(method.id)} className="data-[state=checked]:bg-indigo-600" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-1 text-center">
                                            <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Assigned Pool</p>
                                            <p className="text-[13px] font-semibold text-slate-700">{method.usage}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-1 text-center">
                                            <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Last Decision</p>
                                            <p className="text-[13px] font-semibold text-slate-700">{method.lastFired}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 tracking-wider">
                                            <span>Scheme Efficiency</span>
                                            <span className="text-indigo-600 tracking-normal tabular-nums">{method.efficiency}%</span>
                                        </div>
                                        <Progress value={method.efficiency} className="h-1.5 bg-slate-50 [&>div]:bg-indigo-600" />
                                    </div>
                                </CardContent>
                                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <Button variant="ghost" onClick={() => toast({ title: "Opening Rules", description: "Loading mechanic configuration matrix." })} className="h-8 text-indigo-600 font-semibold text-[11px] hover:bg-white px-3 border border-transparent hover:border-indigo-100 rounded-lg">
                                        Configuration Details
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-900 rounded-lg">
                                        <MoreHorizontal size={16} />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Bottom Callout */}
                <div className="lg:col-span-12">
                    <div className="p-6 rounded-3xl bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-100">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
                                <TrendingUp size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[18px] font-semibold tracking-tight">Weighted Distribution Advice</h4>
                                <p className="text-[13px] text-indigo-100 font-medium">
                                    Systems show Weighted (60/40) distributions for Enterprise leads improve close-rates by 22%.
                                </p>
                            </div>
                        </div>
                        <Button onClick={enforceWeighted} className="h-11 bg-white text-indigo-600 hover:bg-slate-50 border-none font-semibold px-8 rounded-xl shadow-xl">
                            Switch Enterprise to Weighted
                        </Button>
                    </div>
                </div>

            </div>

        </div>
    )
}
