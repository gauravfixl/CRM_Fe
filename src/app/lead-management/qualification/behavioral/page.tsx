"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    MousePointer2,
    Mail,
    Globe,
    FileDown,
    Calendar,
    ChevronLeft,
    Plus,
    BarChart3,
    ArrowUpRight,
    Play,
    Settings,
    Layout,
    ExternalLink,
    Zap,
    RefreshCw,
    Gauge
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Trash2 } from "lucide-react"

// --- Mock Data: Behavioral Actions ---
const INITIAL_BEHAVIORAL_ACTIONS = [
    { id: "1", action: "Pricing Page Visit", source: "Website", icon: Globe, score: 15, intensity: "High", triggers: 420 },
    { id: "2", action: "Email Clicked (Sales)", source: "Outreach", icon: Mail, score: 10, intensity: "Medium", triggers: 1850 },
    { id: "3", action: "Whitepaper Download", source: "Content", icon: FileDown, score: 20, intensity: "High", triggers: 115 },
    { id: "4", action: "Webinar Registered", source: "Events", icon: Calendar, score: 25, intensity: "High", triggers: 88 },
    { id: "5", action: "Homepage Navigation", source: "Website", icon: MousePointer2, score: 2, intensity: "Low", triggers: 12400 },
    { id: "6", action: "Email Opened", source: "Outreach", icon: Mail, score: 1, intensity: "Low", triggers: 45200 },
]

export default function BehavioralScoringPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [actions, setActions] = useState(INITIAL_BEHAVIORAL_ACTIONS)
    const [isSimulating, setIsSimulating] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingAction, setEditingAction] = useState<any>(null)
    const [newAction, setNewAction] = useState({ action: "", source: "Website", score: 10, intensity: "Medium" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleSimulation = () => {
        setIsSimulating(true)
        toast({ title: "Behavior Tracker Online", description: "Simulating real-time event ingestion..." })
        setTimeout(() => {
            setIsSimulating(false)
            setActions(prev => prev.map(a => ({ ...a, triggers: a.triggers + Math.floor(Math.random() * 20) })))
        }, 1500)
    }

    const handleAddOrUpdate = () => {
        if (!newAction.action) return
        if (editingAction) {
            setActions(prev => prev.map(a => a.id === editingAction.id ? { ...a, ...newAction } : a))
            toast({ title: "Action Updated", description: "Behavioral rule synchronized." })
        } else {
            setActions([...actions, {
                ...newAction,
                id: Math.random().toString(36).substr(2, 9),
                triggers: 0,
                icon: newAction.source === 'Website' ? Globe : newAction.source === 'Outreach' ? Mail : Zap
            } as any])
            toast({ title: "Action Registered", description: "New behavioral trigger is now live." })
        }
        setIsAddOpen(false)
        setEditingAction(null)
        setNewAction({ action: "", source: "Website", score: 10, intensity: "Medium" })
    }

    const startEdit = (item: any) => {
        setEditingAction(item)
        setNewAction({ ...item })
        setIsAddOpen(true)
    }

    const handleDelete = (id: string) => {
        setActions(actions.filter(a => a.id !== id))
        toast({ title: "Action Removed", description: "Behavioral trigger deleted." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
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
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600 border border-pink-100">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Behavioral Scoring Tracker
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Map digital interactions to intent scores. Higher intent actions should drive faster MQL/SQL conversion velocities.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleSimulation}
                        disabled={isSimulating}
                        className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5"
                    >
                        {isSimulating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin text-indigo-500" /> : <Play className="h-4 w-4 mr-2 text-slate-400" />}
                        {isSimulating ? "Tracking..." : "Test Ingestion"}
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => { setEditingAction(null); setNewAction({ action: "", source: "Website", score: 10, intensity: "Medium" }) }}
                                className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Event Type
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>{editingAction ? 'Edit Event Logic' : 'Define New Digital Touchpoint'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Event / Action Name</Label>
                                    <Input value={newAction.action} onChange={e => setNewAction({ ...newAction, action: e.target.value })} placeholder="e.g., API Documentation Accessed" className="h-11 rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold">Traffic Source</Label>
                                        <Select value={newAction.source} onValueChange={v => setNewAction({ ...newAction, source: v })}>
                                            <SelectTrigger className="h-11 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Website">Website</SelectItem>
                                                <SelectItem value="Outreach">Outreach</SelectItem>
                                                <SelectItem value="Events">Events</SelectItem>
                                                <SelectItem value="Content">Content</SelectItem>
                                                <SelectItem value="API">API Integration</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold">Intent Score</Label>
                                        <Input type="number" value={newAction.score} onChange={e => setNewAction({ ...newAction, score: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Intensity Level</Label>
                                    <Select value={newAction.intensity} onValueChange={v => setNewAction({ ...newAction, intensity: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="High">High Intent</SelectItem>
                                            <SelectItem value="Medium">Medium Intent</SelectItem>
                                            <SelectItem value="Low">Low / General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddOrUpdate}>
                                {editingAction ? 'Sync Changes' : 'Register Touchpoint'}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Intent Analytics Dashboard */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white group hover:ring-indigo-100 transition-all">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                                    <Globe size={24} />
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none">+12.4%</Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-slate-400 tracking-wider">Web Performance</p>
                                <h3 className="text-[28px] font-semibold text-slate-900 tracking-tighter">14,280</h3>
                                <p className="text-[11px] font-medium text-slate-500">Intelligent events captured this month</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white group hover:ring-indigo-100 transition-all">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-500">
                                    <Mail size={24} />
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none">+8.2%</Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-slate-400 tracking-wider">Outreach Engagement</p>
                                <h3 className="text-[28px] font-semibold text-slate-900 tracking-tighter">6,140</h3>
                                <p className="text-[11px] font-medium text-slate-500">Positive email response triggers</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white group hover:ring-indigo-100 transition-all">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500">
                                    <Gauge size={24} />
                                </div>
                                <Badge className="bg-rose-50 text-rose-600 border-none">-2.1%</Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-slate-400 tracking-wider">Intent Velocity</p>
                                <h3 className="text-[28px] font-semibold text-slate-900 tracking-tighter">High</h3>
                                <p className="text-[11px] font-medium text-slate-500">Avg. 4.2 events per qualified lead</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Event Configuration */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Event Scoring Map</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-slate-500 font-semibold text-[11px]">Recent Triggers <ExternalLink size={12} className="ml-1.5" /></Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {actions.map((item) => (
                            <Card key={item.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white group hover:ring-indigo-100 transition-all overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-500">
                                <CardContent className="p-5 flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <item.icon size={20} />
                                        </div>
                                        <div className="space-y-1 truncate">
                                            <h4 className="text-[15px] font-semibold text-slate-900 leading-none">{item.action}</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="h-5 border-slate-100 text-[9px] font-semibold text-slate-400 px-1.5 uppercase">{item.source}</Badge>
                                                <span className="text-slate-200">•</span>
                                                <span className="text-[11px] font-medium text-slate-500">{item.triggers.toLocaleString()} hits</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Scoring Impact</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[18px] font-semibold text-indigo-600">+{item.score}</span>
                                                <Badge className={`
                                                    ${item.intensity === 'High' ? 'bg-rose-50 text-rose-500' :
                                                        item.intensity === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                                            'bg-slate-50 text-slate-400'} 
                                                    border-none text-[9px] font-semibold px-1.5 h-4.5 rounded uppercase
                                                `}>
                                                    {item.intensity}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="h-9 w-9 rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50">
                                                <Settings size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(item.id)}
                                                className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Smart Aggregates Side */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Automation Health</CardTitle>
                            <CardDescription className="text-[11px] font-medium text-slate-500">Quality of signal vs. noise in behavioral tracking.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-[12px] font-semibold text-slate-600">
                                    <span>Signal Quality</span>
                                    <span className="text-indigo-600">88%</span>
                                </div>
                                <Progress value={88} className="h-2 bg-slate-50 [&>div]:bg-indigo-600" />
                                <p className="text-[10px] text-slate-400 font-medium">88% of events matched known high-intent patterns.</p>
                            </div>

                            <div className="space-y-2.5 pt-2">
                                <div className="flex justify-between items-center text-[12px] font-semibold text-slate-600">
                                    <span>Bot Filtering</span>
                                    <span className="text-emerald-500">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                                    <div className="flex items-center gap-3">
                                        <Zap size={14} className="text-emerald-600" />
                                        <span className="text-[12px] font-semibold text-emerald-700">Blocked 1.2k bot hits</span>
                                    </div>
                                    <Switch checked={true} className="data-[state=checked]:bg-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-slate-900 p-1 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200 translate-x-4">
                            <Activity size={120} />
                        </div>
                        <CardContent className="p-6 space-y-4 relative z-10">
                            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 w-fit">
                                <BarChart3 size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold leading-none text-indigo-600">Intent Prediction Engine</h4>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                                    Analyzing 42k interaction patterns. We've detected a trend: leads visiting "API Docs" convert 4x faster.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none font-semibold text-[12px] h-10 mt-2">
                                Adjust weights based on AI
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>

        </div>
    )
}
