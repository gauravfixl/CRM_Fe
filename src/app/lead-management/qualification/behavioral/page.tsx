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
    ExternalLink,
    Zap,
    RefreshCw,
    Gauge,
    Search,
    Filter,
    Trash2,
    Target
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"

const INITIAL_BEHAVIORAL_ACTIONS = [
    { id: "1", action: "Pricing Page Visit", source: "Website", icon: Globe, score: 15, intensity: "High", triggers: 420 },
    { id: "2", action: "Email Clicked (Sales)", source: "Outreach", icon: Mail, score: 10, intensity: "Medium", triggers: 1850 },
    { id: "3", action: "Whitepaper Download", source: "Content", icon: FileDown, score: 20, intensity: "High", triggers: 115 },
    { id: "4", action: "Webinar Registered", source: "Events", icon: Calendar, score: 25, intensity: "High", triggers: 88 },
    { id: "5", action: "Homepage Navigation", source: "Website", icon: MousePointer2, score: 2, intensity: "Low", triggers: 12400 },
    { id: "6", action: "Email Opened", source: "Outreach", icon: Mail, score: 1, intensity: "Low", triggers: 45200 },
]

type BehavioralAction = {
    id: string
    action: string
    source: string
    icon: any
    score: number
    intensity: string
    triggers: number
}

type FormErrors = {
    action?: string
    source?: string
    score?: string
    intensity?: string
}

export default function BehavioralScoringPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [actions, setActions] = useState<BehavioralAction[]>(INITIAL_BEHAVIORAL_ACTIONS)
    const [isSimulating, setIsSimulating] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingAction, setEditingAction] = useState<BehavioralAction | null>(null)
    const [newAction, setNewAction] = useState({ action: "", source: "Website", score: 10, intensity: "Medium" })
    const [errors, setErrors] = useState<FormErrors>({})
    const [searchTerm, setSearchTerm] = useState("")
    const [filterSource, setFilterSource] = useState("all")
    const [botFilterActive, setBotFilterActive] = useState(true)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const filteredActions = actions.filter(a => {
        const matchSearch = !searchTerm ||
            a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.source.toLowerCase().includes(searchTerm.toLowerCase())
        const matchSource = filterSource === "all" || a.source === filterSource
        return matchSearch && matchSource
    })

    const handleSimulation = () => {
        setIsSimulating(true)
        toast({ title: "Behavior Tracker Online", description: "Simulating real-time event ingestion..." })
        setTimeout(() => {
            setIsSimulating(false)
            setActions(prev => prev.map(a => ({ ...a, triggers: a.triggers + Math.floor(Math.random() * 20) })))
            toast({ title: "Ingestion Complete", description: "Trigger counts have been updated." })
        }, 1500)
    }

    const validateForm = (): boolean => {
        const e: FormErrors = {}
        if (!newAction.action.trim()) e.action = "Event/action name is required"
        else if (newAction.action.trim().length < 3) e.action = "Name must be at least 3 characters"
        else if (newAction.action.trim().length > 80) e.action = "Name must be under 80 characters"

        if (!newAction.source) e.source = "Traffic source is required"

        if (newAction.score === undefined || newAction.score === null || isNaN(newAction.score)) e.score = "Intent score is required"
        else if (newAction.score < -100) e.score = "Score cannot be lower than -100"
        else if (newAction.score > 100) e.score = "Score cannot exceed 100"

        if (!newAction.intensity) e.intensity = "Intensity level is required"

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleAddOrUpdate = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!validateForm()) {
            toast({ title: "Validation Failed", description: "Please fix the highlighted errors.", variant: "destructive" })
            return
        }
        if (editingAction) {
            setActions(prev => prev.map(a => a.id === editingAction.id ? { ...a, ...newAction } : a))
            toast({ title: "Action Updated", description: "Behavioral rule synchronized." })
        } else {
            const iconMap: Record<string, any> = {
                Website: Globe, Outreach: Mail, Events: Calendar, Content: FileDown, API: Zap
            }
            setActions([...actions, {
                ...newAction,
                id: Math.random().toString(36).substr(2, 9),
                triggers: 0,
                icon: iconMap[newAction.source] || Zap,
            }])
            toast({ title: "Action Registered", description: "New behavioral trigger is now live." })
        }
        setIsAddOpen(false)
        setEditingAction(null)
        setErrors({})
        setNewAction({ action: "", source: "Website", score: 10, intensity: "Medium" })
    }

    const startEdit = (item: BehavioralAction) => {
        setEditingAction(item)
        setNewAction({ action: item.action, source: item.source, score: item.score, intensity: item.intensity })
        setErrors({})
        setIsAddOpen(true)
    }

    const openCreate = () => {
        setEditingAction(null)
        setNewAction({ action: "", source: "Website", score: 10, intensity: "Medium" })
        setErrors({})
        setIsAddOpen(true)
    }

    const handleDelete = (id: string) => {
        setActions(actions.filter(a => a.id !== id))
        toast({ title: "Action Removed", description: "Behavioral trigger deleted." })
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header — colorful light fill */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-pink-50 p-6 border border-pink-100 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-white text-pink-600 border border-pink-100">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Behavioral Scoring Tracker
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Map digital interactions to intent scores. Higher intent actions should drive faster MQL/SQL conversion velocities.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleSimulation}
                        disabled={isSimulating}
                        className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5"
                    >
                        {isSimulating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin text-indigo-500" /> : <Play className="h-4 w-4 mr-2 text-slate-400" />}
                        {isSimulating ? "Tracking..." : "Test Ingestion"}
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Event Type
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Intent Analytics — compact 4-up KPI strip */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 group transition-all">
                        <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="p-1.5 rounded-none bg-white text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                                    <Globe size={16} />
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] px-1.5 py-0 rounded-none">+12.4%</Badge>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-500 tracking-wider truncate">Web Performance</p>
                                <h3 className="text-[20px] font-semibold text-slate-900 tracking-tight tabular-nums leading-tight">14,280</h3>
                                <p className="text-[10px] font-medium text-slate-600 truncate">Events captured this month</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-pink-100 rounded-none bg-pink-50 group transition-all">
                        <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="p-1.5 rounded-none bg-white text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-500">
                                    <Mail size={16} />
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] px-1.5 py-0 rounded-none">+8.2%</Badge>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-500 tracking-wider truncate">Outreach Engagement</p>
                                <h3 className="text-[20px] font-semibold text-slate-900 tracking-tight tabular-nums leading-tight">6,140</h3>
                                <p className="text-[10px] font-medium text-slate-600 truncate">Positive email triggers</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-amber-100 rounded-none bg-amber-50 group transition-all">
                        <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="p-1.5 rounded-none bg-white text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500">
                                    <Gauge size={16} />
                                </div>
                                <Badge className="bg-rose-50 text-rose-600 border-none text-[10px] px-1.5 py-0 rounded-none">-2.1%</Badge>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-500 tracking-wider truncate">Intent Velocity</p>
                                <h3 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-tight">High</h3>
                                <p className="text-[10px] font-medium text-slate-600 truncate">Avg. 4.2 events per lead</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-emerald-100 rounded-none bg-emerald-50 group transition-all">
                        <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="p-1.5 rounded-none bg-white text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                                    <Target size={16} />
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] px-1.5 py-0 rounded-none">+5.6%</Badge>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-500 tracking-wider truncate">High-Intent Sessions</p>
                                <h3 className="text-[20px] font-semibold text-slate-900 tracking-tight tabular-nums leading-tight">2,840</h3>
                                <p className="text-[10px] font-medium text-slate-600 truncate">Matched scoring thresholds</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Event Configuration */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Event Scoring Map</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast({ title: "Recent Triggers", description: "Opening trigger history feed..." })}
                                className="h-8 text-slate-500 font-semibold text-[11px]"
                            >
                                Recent Triggers <ExternalLink size={12} className="ml-1.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Filter / Search */}
                    <div className="flex items-center gap-3 bg-slate-50/50 p-2 border border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search events by name or source..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-lg focus-visible:ring-indigo-500"
                            />
                        </div>
                        <Select value={filterSource} onValueChange={setFilterSource}>
                            <SelectTrigger className="w-[180px] h-10 border-slate-100 bg-white font-semibold text-[12px] rounded-lg">
                                <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sources</SelectItem>
                                <SelectItem value="Website">Website</SelectItem>
                                <SelectItem value="Outreach">Outreach</SelectItem>
                                <SelectItem value="Events">Events</SelectItem>
                                <SelectItem value="Content">Content</SelectItem>
                                <SelectItem value="API">API Integration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {filteredActions.length === 0 ? (
                            <div className="p-10 border-2 border-dashed border-slate-200 text-center">
                                <p className="text-[13px] font-semibold text-slate-400">No events match your filters.</p>
                            </div>
                        ) : filteredActions.map((item) => (
                            <Card key={item.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white group hover:ring-indigo-100 transition-all overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-500">
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
                                                <span className={`text-[18px] font-semibold ${item.score >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{item.score >= 0 ? '+' : ''}{item.score}</span>
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
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-blue-50 overflow-hidden">
                        <CardHeader className="p-6 border-b border-blue-100">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Automation Health</CardTitle>
                            <CardDescription className="text-[11px] font-medium text-slate-600">Quality of signal vs. noise in behavioral tracking.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 bg-white">
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
                                    <span className={botFilterActive ? "text-emerald-500" : "text-slate-400"}>{botFilterActive ? "Active" : "Disabled"}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100">
                                    <div className="flex items-center gap-3">
                                        <Zap size={14} className="text-emerald-600" />
                                        <span className="text-[12px] font-semibold text-emerald-700">Blocked 1.2k bot hits</span>
                                    </div>
                                    <Switch
                                        checked={botFilterActive}
                                        onCheckedChange={(c) => { setBotFilterActive(c); toast({ title: c ? "Bot Filter Enabled" : "Bot Filter Disabled" }) }}
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 p-1 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200 translate-x-4">
                            <Activity size={120} />
                        </div>
                        <CardContent className="p-6 space-y-4 relative z-10">
                            <div className="p-2.5 rounded-xl bg-white text-indigo-600 w-fit">
                                <BarChart3 size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold leading-none text-indigo-600">Intent Prediction Engine</h4>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                                    Analyzing 42k interaction patterns. We've detected a trend: leads visiting "API Docs" convert 4x faster.
                                </p>
                            </div>
                            <Button
                                onClick={() => toast({ title: "AI Optimization Started", description: "Recalibrating weights based on conversion data..." })}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none font-semibold text-[12px] h-10 mt-2"
                            >
                                Adjust weights based on AI
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Side-drawer Form */}
            <SideFormSheet
                open={isAddOpen}
                onOpenChange={(o) => { setIsAddOpen(o); if (!o) setErrors({}) }}
                title={editingAction ? 'Edit Event Logic' : 'Define New Digital Touchpoint'}
                description={editingAction ? 'Update the scoring logic for this event.' : 'Register a new behavioral trigger for the scoring engine.'}
                icon={<Activity size={18} />}
                onSubmit={handleAddOrUpdate}
                submitLabel={editingAction ? 'Sync Changes' : 'Register Touchpoint'}
                accentColor="#4f46e5"
            >
                <div className="space-y-5">
                    <Field label="Event / Action Name" required error={errors.action}>
                        <Input
                            value={newAction.action}
                            onChange={e => { setNewAction({ ...newAction, action: e.target.value }); if (errors.action) setErrors({ ...errors, action: undefined }) }}
                            placeholder="e.g., API Documentation Accessed"
                            className="h-11 rounded-lg"
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Traffic Source" required error={errors.source}>
                            <Select value={newAction.source} onValueChange={v => { setNewAction({ ...newAction, source: v }); if (errors.source) setErrors({ ...errors, source: undefined }) }}>
                                <SelectTrigger className="h-11 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Website">Website</SelectItem>
                                    <SelectItem value="Outreach">Outreach</SelectItem>
                                    <SelectItem value="Events">Events</SelectItem>
                                    <SelectItem value="Content">Content</SelectItem>
                                    <SelectItem value="API">API Integration</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Intent Score" required error={errors.score} hint="Range: -100 to 100">
                            <Input
                                type="number"
                                min={-100}
                                max={100}
                                value={newAction.score}
                                onChange={e => { setNewAction({ ...newAction, score: parseInt(e.target.value) || 0 }); if (errors.score) setErrors({ ...errors, score: undefined }) }}
                                className="h-11 rounded-lg"
                            />
                        </Field>
                    </div>

                    <Field label="Intensity Level" required error={errors.intensity}>
                        <Select value={newAction.intensity} onValueChange={v => { setNewAction({ ...newAction, intensity: v }); if (errors.intensity) setErrors({ ...errors, intensity: undefined }) }}>
                            <SelectTrigger className="h-11 rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High">High Intent</SelectItem>
                                <SelectItem value="Medium">Medium Intent</SelectItem>
                                <SelectItem value="Low">Low / General</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

        </div>
    )
}
