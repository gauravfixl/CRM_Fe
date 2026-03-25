"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    GitBranch,
    Play,
    Settings2,
    Trash2,
    MoreHorizontal,
    Copy,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Activity,
    Save
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
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

// --- Mock Data: Workflows ---
const INITIAL_WORKFLOWS = [
    {
        id: "1",
        name: "Enterprise Inbound Welcome",
        trigger: "Lead Created",
        steps: 4,
        status: true,
        lastRun: "2 mins ago",
        successRate: 98,
        category: "Nurture"
    },
    {
        id: "2",
        name: "Lost Lead Feedback Loop",
        trigger: "Stage == 'Lost'",
        steps: 2,
        status: true,
        lastRun: "1 hour ago",
        successRate: 100,
        category: "Retention"
    },
    {
        id: "3",
        name: "High Score SMS Alert",
        trigger: "Score > 85",
        steps: 3,
        status: false,
        lastRun: "N/A",
        successRate: 0,
        category: "Alerts"
    },
    {
        id: "4",
        name: "Webinar Attendee Follow-up",
        trigger: "Campaign Event: 'Webinar'",
        steps: 5,
        status: true,
        lastRun: "Yesterday",
        successRate: 92,
        category: "Event"
    },
]

export default function WorkflowsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newWorkflow, setNewWorkflow] = useState({ name: "", trigger: "Lead Created", category: "Nurture" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCreateWorkflow = () => {
        if (!newWorkflow.name) {
            toast({ title: "Validation Error", description: "Workflow needs a name to proceed.", variant: "destructive" })
            return
        }
        setWorkflows([...workflows, {
            ...newWorkflow,
            id: Math.random().toString(36).substr(2, 9),
            steps: 1,
            status: false,
            lastRun: "Never",
            successRate: 0
        }])
        toast({ title: "Workflow Registered", description: "Empty workflow shell generated. Open builder to add steps." })
        setIsAddOpen(false)
        setNewWorkflow({ name: "", trigger: "Lead Created", category: "Nurture" })
    }

    const handleDelete = (id: string) => {
        setWorkflows(workflows.filter(w => w.id !== id))
        toast({ title: "Workflow Deleted", description: "Blueprint removed permanently." })
    }

    const toggleStatus = (id: string) => {
        setWorkflows(workflows.map(w => w.id === id ? { ...w, status: !w.status } : w))
        toast({
            title: "Workflow Status Updated",
            description: "State changes are being propagated across trigger engines.",
        })
    }

    const runManually = (name: string) => {
        toast({
            title: "Manual Execution Started",
            description: `Force-triggering execution for ${name}.`,
        })
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
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Process Workflows
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Orchestrate lead lifecycles with multi-step automation. Combine triggers, logic, and actions to drive performance.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Sandbox environment initializing..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Play className="h-4 w-4 mr-2 text-slate-400" /> Simulation Sandbox
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none transition-all active:scale-95">
                                <Plus className="h-4 w-4 mr-2" /> Create Workflow
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Initialize New Workflow</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Workflow Nomenclature</Label>
                                    <Input value={newWorkflow.name} onChange={e => setNewWorkflow({ ...newWorkflow, name: e.target.value })} placeholder="e.g., Abandoned Cart Recovery" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Initial Trigger</Label>
                                    <Select value={newWorkflow.trigger} onValueChange={v => setNewWorkflow({ ...newWorkflow, trigger: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Lead Created">Lead Created</SelectItem>
                                            <SelectItem value="Stage Changed">Stage Changed</SelectItem>
                                            <SelectItem value="Form Submitted">Form Submitted</SelectItem>
                                            <SelectItem value="Score Threshold">Score Threshold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Category Classification</Label>
                                    <Select value={newWorkflow.category} onValueChange={v => setNewWorkflow({ ...newWorkflow, category: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Nurture">Nurture</SelectItem>
                                            <SelectItem value="Retention">Retention</SelectItem>
                                            <SelectItem value="Alerts">Alerts</SelectItem>
                                            <SelectItem value="Event">Event</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleCreateWorkflow}>Launch Canvas Builder</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Workflow Inventory */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[400px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search workflows by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-xl focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => toast({ description: "Opening category filter pane..." })} className="h-10 border-slate-100 bg-white font-semibold text-[12px] px-4 rounded-xl">
                                <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" /> Categories
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {workflows.map((w) => (
                            <Card key={w.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-600">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Info Section */}
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className={`p-3 rounded-xl ${w.status ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'} transition-colors`}>
                                                    <GitBranch size={20} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[15px] font-semibold text-slate-900 leading-none">{w.name}</h3>
                                                        <Badge className="bg-slate-50 text-slate-400 border-none font-semibold text-[8px] h-4.5 px-1.5 uppercase tracking-wide">{w.category}</Badge>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-400">Trigger: <span className="text-slate-600">{w.trigger}</span></p>
                                                </div>
                                            </div>

                                            {/* Progress / Success */}
                                            <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Steps</span>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(w.steps)].map((_, i) => (
                                                        <div key={i} className="h-1.5 w-4 rounded-full bg-slate-100 group-hover:bg-indigo-100" />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Health & Status */}
                                            <div className="flex items-center gap-8 min-w-[240px] justify-end">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Success Rate</p>
                                                    <h4 className={`text-[18px] font-semibold tabular-nums mt-0.5 ${w.successRate > 90 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        {w.successRate}%
                                                    </h4>
                                                </div>
                                                <div className="w-px h-8 bg-slate-50" />
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Status</p>
                                                        <Switch checked={w.status} onCheckedChange={() => toggleStatus(w.id)} className="mt-1 data-[state=checked]:bg-indigo-600" />
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-xl">
                                                                <MoreHorizontal size={18} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
                                                            <DropdownMenuItem onClick={() => runManually(w.name)} className="text-[12px] font-medium py-2.5">
                                                                <Play className="h-3.5 w-3.5 mr-2 text-indigo-500" /> Run Manually
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => toast({ description: "Opening visual node editor." })} className="text-[12px] font-medium py-2.5">
                                                                <Settings2 className="h-3.5 w-3.5 mr-2 text-slate-400" /> Edit Blueprint
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => toast({ description: "Workflow cloned successfully." })} className="text-[12px] font-medium py-2.5">
                                                                <Copy className="h-3.5 w-3.5 mr-2 text-slate-400" /> Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(w.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
                                                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Workflow Governance Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
                                <Activity size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Automation Pulse</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Current engine throughput and conflict resolution metrics for active workflows.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50 text-center space-y-1">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Today's Executions</p>
                                    <h5 className="text-[18px] font-semibold text-slate-900">14,204</h5>
                                </div>
                                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50 text-center space-y-1">
                                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Avg. Latency</p>
                                    <h5 className="text-[18px] font-semibold text-emerald-500">42ms</h5>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h5 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Engine Controls</h5>
                                {[
                                    { label: "Conflict Resolution", desc: "Prioritize overlapping rules.", active: true },
                                    { label: "Execution Retry", desc: "Max 3 attempts on fail.", active: true },
                                    { label: "Global Pause", desc: "Instantly stop all flows.", active: false, danger: true },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                        <div className="space-y-0.5">
                                            <p className={`text-[12px] font-semibold ${c.danger ? 'text-rose-600' : 'text-slate-700'}`}>{c.label}</p>
                                            <p className="text-[9px] font-medium text-slate-400">{c.desc}</p>
                                        </div>
                                        <Switch checked={c.active} onCheckedChange={() => toast({ title: "Engine Reconfigured", description: "Global automation parameter updated." })} className={`data-[state=checked]:${c.danger ? 'bg-rose-500' : 'bg-indigo-600'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-slate-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200 translate-x-4">
                            <CheckCircle2 size={120} />
                        </div>
                        <h4 className="text-[15px] font-semibold text-indigo-600">Workflow Versioning</h4>
                        <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                            Safely roll back to previous logic states. Every save creates a cryptographically signed version.
                        </p>
                        <Button className="w-full h-9 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-[11px] rounded-xl border-none">
                            View Version History
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                            <AlertCircle size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-bold text-amber-900">Optimization Tip</p>
                            <p className="text-[11px] text-amber-700 font-medium leading-relaxed italic">
                                "Shortening the delay on Stage 1 Follow-ups by 4 hours could increase engagement by 12%."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
