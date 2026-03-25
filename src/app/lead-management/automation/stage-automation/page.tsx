"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Database,
    ArrowRight,
    Users,
    Zap,
    CheckCircle2,
    Clock,
    ShieldCheck,
    AlertCircle,
    Settings2,
    Trash2,
    MoreHorizontal,
    GitBranch,
    BarChart3,
    ArrowUpRight,
    MousePointer2,
    Boxes
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
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"

// --- Mock Data: Stages ---
const PIPELINE_STAGES = [
    {
        id: "1",
        label: "New Discovery",
        count: 142,
        automations: 3,
        lastExecution: "2 mins ago",
        status: "Active",
        color: "bg-indigo-500",
        automationItems: ["Send Welcome Email", "Create Discovery Task", "Tag: Fresh"]
    },
    {
        id: "2",
        label: "Qualified (SQL)",
        count: 45,
        automations: 4,
        lastExecution: "15 mins ago",
        status: "Active",
        color: "bg-emerald-500",
        automationItems: ["Assign to Sales Pod", "Sync to CRM Hub", "Alert Team Lead", "Set SLA: 2h"]
    },
    {
        id: "3",
        label: "Proposal Sent",
        count: 28,
        automations: 2,
        lastExecution: "1 hour ago",
        status: "Active",
        color: "bg-cyan-500",
        automationItems: ["Update Value Field", "Notify Success Mgr"]
    },
    {
        id: "4",
        label: "Closed Lost",
        count: 120,
        automations: 2,
        lastExecution: "Today",
        status: "Active",
        color: "bg-slate-400",
        automationItems: ["Trigger Feedback Nurture", "Update Score: -100"]
    },
]

export default function StageAutomationPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [stages, setStages] = useState(PIPELINE_STAGES)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [selectedStage, setSelectedStage] = useState<string | null>(null)
    const [newItem, setNewItem] = useState({ name: "", type: "Communication" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleAddItem = () => {
        if (!newItem.name || !selectedStage) {
            toast({ title: "Incomplete Data", description: "Action name and stage selection required.", variant: "destructive" })
            return
        }

        setStages(stages.map(s => {
            if (s.id === selectedStage) {
                return { ...s, automationItems: [...s.automationItems, newItem.name] }
            }
            return s
        }))

        toast({ title: "Automation Attached", description: `New action bound to stage.` })
        setIsAddOpen(false)
        setNewItem({ name: "", type: "Communication" })
        setSelectedStage(null)
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
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <Boxes className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Stage-Based Automation
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Drive your pipeline forward. Define the actions that fire instantly when a lead moves into or out of a specific lifecycle stage.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Opening visual path architect..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <GitBranch className="h-4 w-4 mr-2 text-slate-400" /> Pipeline Flow
                    </Button>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none" onClick={() => setSelectedStage(null)}>
                                <Plus className="h-4 w-4 mr-2" /> Global Transition
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Bind Automation Action</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Target Stage</Label>
                                    <Select value={selectedStage || ''} onValueChange={setSelectedStage}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue placeholder="Select pipeline stage" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {stages.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Action Description</Label>
                                    <Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g., Dispatch NPS Survey" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Action Classification</Label>
                                    <Select value={newItem.type} onValueChange={v => setNewItem({ ...newItem, type: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Communication">Communication</SelectItem>
                                            <SelectItem value="Data Sync">Data Sync</SelectItem>
                                            <SelectItem value="Assignment">Assignment</SelectItem>
                                            <SelectItem value="WebHook">WebHook</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddItem}>Inject Action</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Pipeline Stages Vertical Feed */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                            Stage Automation Hub <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 h-5 text-[10px] font-semibold uppercase tracking-wider">Active</Badge>
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => toast({ description: "All automation hooks temporarily suspended." })} className="text-indigo-600 font-semibold text-[11px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-700">Toggle All Off</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {stages.map((s, idx) => (
                            <div key={s.id} className="relative">
                                {/* Connection Line */}
                                {idx < stages.length - 1 && (
                                    <div className="absolute left-8 top-16 bottom-0 w-px bg-slate-100 z-0" />
                                )}

                                <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white group hover:ring-indigo-100 transition-all overflow-hidden relative z-10">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Indicator */}
                                            <div className="md:w-16 flex flex-col items-center justify-center border-r border-slate-50 py-6">
                                                <div className={`h-4 w-4 rounded-full ${s.color} ring-4 ring-white shadow-sm shadow-black/10`} />
                                                <div className="mt-4 flex flex-col items-center gap-1">
                                                    <span className="text-[9px] font-semibold text-slate-400 uppercase leading-none">POS</span>
                                                    <span className="text-[14px] font-semibold text-slate-400 tabular-nums">0{idx + 1}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-center gap-4">
                                                        <h3 className="text-[18px] font-semibold text-slate-900">{s.label}</h3>
                                                        <Badge variant="outline" className="border-slate-100 text-slate-500 text-[10px] font-semibold tracking-wider px-2 h-6 rounded-lg">
                                                            {s.count} leads in stage
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {s.automationItems.map((item, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl group/item hover:bg-white hover:border-indigo-200 transition-colors">
                                                                <Zap size={10} className="text-amber-500 fill-amber-500" />
                                                                <span className="text-[11px] font-semibold text-slate-600">{item}</span>
                                                            </div>
                                                        ))}
                                                        <Button variant="ghost" onClick={() => { setSelectedStage(s.id); setIsAddOpen(true) }} className="h-8 w-8 rounded-xl p-0 hover:bg-indigo-50 text-indigo-500">
                                                            <Plus size={14} />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8 min-w-[200px] justify-end">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">Last Sync</p>
                                                        <p className="text-[12px] font-semibold text-slate-600">{s.lastExecution}</p>
                                                        <div className="flex items-center gap-1.5 justify-end mt-1">
                                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                                            <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-tight italic">Engine Valid</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-px h-12 bg-slate-50" />
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-slate-900 rounded-xl">
                                                                <MoreHorizontal size={20} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
                                                            <DropdownMenuItem onClick={() => toast({ description: "Initiating order reconfiguration mode." })} className="py-2.5 text-[12px] font-medium">Reorder Logic</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => toast({ description: "Stage flow halted.", variant: "destructive" })} className="py-2.5 text-[12px] font-medium text-rose-500">Disable Stage Flow</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => toast({ description: "Opening advanced rule architect." })} className="py-2.5 text-[12px] font-medium text-indigo-600 font-semibold">Manage Rules</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pipeline Health Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
                                <BarChart3 size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Automation Accuracy</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Tracking success/fail ratio of automations during stage transitions.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="space-y-4">
                                {[
                                    { label: "New → Discovery", val: 99, status: "Healthy" },
                                    { label: "Discovery → SQL", val: 94, status: "Warning" },
                                    { label: "SQL → Proposal", val: 97, status: "Healthy" },
                                ].map((t, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[11px] font-semibold">
                                            <span className="text-slate-500">{t.label}</span>
                                            <span className={t.status === 'Healthy' ? 'text-emerald-500' : 'text-amber-500'}>{t.val}% OK</span>
                                        </div>
                                        <Progress value={t.val} className={`h-1.5 ${t.status === 'Healthy' ? '[&>div]:bg-indigo-600' : '[&>div]:bg-amber-500'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-amber-50 p-6 space-y-4 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                                <AlertCircle size={18} />
                            </div>
                            <h4 className="text-[14px] font-semibold tracking-tight text-amber-900">Orphaned Transitions</h4>
                        </div>
                        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                            A lead moved from "Discovery" to "Closed Lost" 2 hours ago but no exit survey automation was triggered.
                        </p>
                        <Button onClick={() => toast({ description: "Transition debugging initiated." })} className="w-full h-9 bg-white text-orange-600 hover:bg-orange-100 font-semibold text-[10px] uppercase tracking-widest rounded-xl border-none shadow-sm">
                            Debug Transition
                        </Button>
                    </Card>

                    <div className="p-6 rounded-3xl bg-indigo-600 text-white space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                            <ShieldCheck size={100} />
                        </div>
                        <h4 className="text-[16px] font-semibold relative z-10">Governance Guardrails</h4>
                        <p className="text-[12px] text-indigo-100 font-medium relative z-10">
                            Strict mode is ON. Automations will fail-safe if data validation isn't met during movement.
                        </p>
                        <Switch checked={true} onCheckedChange={() => toast({ title: "Guardrails Adjusted", description: "Strict mode validation updated." })} className="mt-2 data-[state=checked]:bg-white [&>span]:bg-indigo-600 relative z-10" />
                    </div>
                </div>

            </div>

        </div>
    )
}
