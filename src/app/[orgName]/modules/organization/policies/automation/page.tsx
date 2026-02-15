"use client"

import React, { useState } from "react"
import {
    Zap,
    Workflow,
    Play,
    Pause,
    StopCircle,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Search,
    MoreVertical,
    Plus,
    Activity,
    Cpu,
    Code,
    Database,
    MessageSquare,
    Save,
    Settings2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const initialRules = [
    { id: "AP-001", name: "Auto-Assign Enterprise Leads", engine: "CRM Core", status: "Running", success: 98.4, triggers: 1204, load: "Low" },
    { id: "AP-002", name: "Invoice Reminder Protocol", engine: "Billing Nexus", status: "Running", success: 92.1, triggers: 452, load: "Medium" },
    { id: "AP-003", name: "Dormant Client Archival", engine: "Data Policy", status: "Paused", success: 100, triggers: 82, load: "Idle" },
    { id: "AP-004", name: "Security Breach Lockdown", engine: "Identity Guard", status: "Running", success: 100, triggers: 1, load: "Critical" },
]

export default function AutomationPoliciesPage() {
    const [rules, setRules] = useState(initialRules)
    const [isNewRuleOpen, setIsNewRuleOpen] = useState(false)

    const handleToggleRule = (id: string, current: string) => {
        const newStatus = current === "Running" ? "Paused" : "Running"
        setRules(rules.map(r => r.id === id ? { ...r, status: newStatus } : r))
        toast.info(`Engine ${id} is now ${newStatus.toLowerCase()}`)
    }

    const handleCreateRule = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("ruleName") as string
        const engine = formData.get("engineType") as string

        if (!name) return toast.error("Rule name is required")

        const newRule = {
            id: `AP-00${rules.length + 1}`,
            name,
            engine,
            status: "Running",
            success: 100,
            triggers: 0,
            load: "Low"
        }

        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Compiling business logic and deploying to edge...",
            success: () => {
                setRules([newRule, ...rules])
                setIsNewRuleOpen(false)
                return `${name} automation is now live.`
            },
            error: "Compilation failed. Check syntax."
        })
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Automation Policies</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure institutional-level workflow engines and event-driven automation rules.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Viewing automation history...")}>
                        <Clock className="w-4 h-4" />
                        Execution History
                    </Button>
                    <Dialog open={isNewRuleOpen} onOpenChange={setIsNewRuleOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-black uppercase text-[10px] tracking-widest px-6 shadow-xl shadow-indigo-100">
                                <Plus className="w-4 h-4" />
                                New Policy Engine
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                            <div className="bg-indigo-600 p-8 text-white relative">
                                <Activity className="absolute right-4 top-4 w-12 h-12 text-white opacity-10 animate-pulse" />
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black text-white tracking-tight">Deploy Automation</DialogTitle>
                                    <DialogDescription className="text-indigo-100 font-medium">
                                        Define event triggers and execution logic for cross-firm workflows.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                            <form onSubmit={handleCreateRule} className="p-8 space-y-6 bg-white">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ruleName" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Protocol Name</Label>
                                        <Input id="ruleName" name="ruleName" placeholder="e.g. Mass Project Archivation" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Base Engine</Label>
                                            <Select name="engineType" defaultValue="CRM Core">
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CRM Core">CRM Core</SelectItem>
                                                    <SelectItem value="Billing Nexus">Billing Nexus</SelectItem>
                                                    <SelectItem value="Identity Guard">Identity Guard</SelectItem>
                                                    <SelectItem value="Data Policy">Data Policy</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Priority Tier</Label>
                                            <Select defaultValue="Medium">
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="High">High (Immediate)</SelectItem>
                                                    <SelectItem value="Medium">Medium (Queued)</SelectItem>
                                                    <SelectItem value="Low">Low (Batch)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logic snippet (YAML/Pseudocode)</Label>
                                        <Textarea placeholder="on: lead.created { action: assign_to_firm_pool }" className="min-h-[100px] rounded-xl bg-slate-50 border-slate-100 font-mono text-xs" />
                                    </div>
                                </div>
                                <DialogFooter className="pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dry-run validated</span>
                                    </div>
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl shadow-lg shadow-indigo-100">
                                        Commit Protocol
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-indigo-500 to-purple-700 border-none text-white shadow-xl shadow-indigo-200">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em]">Total Runs</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-white">42.8k</p>
                        <p className="text-[10px] text-indigo-100 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter italic">Total system cycles</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-indigo-600">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Efficiency Rate</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">96.4%</p>
                        <Progress value={96.4} className="h-1.5 mt-2 bg-slate-100" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Engines</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">{rules.filter(r => r.status === 'Running').length}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Live protocols</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-red-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Load</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">12%</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic text-emerald-600 font-bold">Stable Overhead</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* AUTOMATION RULES TABLE */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Active Policy Engines</CardTitle>
                            <CardDescription className="text-xs font-medium">Global workflow automations maintaining enterprise operational flow.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black text-red-600 uppercase tracking-[0.2em] border border-red-100 hover:bg-red-50" onClick={() => toast.error("CRITICAL: Global automation emergency stop initiated!")}>
                            Emergency Stop <StopCircle className="ml-2 w-3 h-3" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/30 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Policy Protocol</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Base Engine</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Success Rate</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Triggers</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">State</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rules.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-colors shadow-sm ${rule.status === 'Running' ? 'text-indigo-600' : 'text-slate-300'}`}>
                                                    <Cpu className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 leading-none">{rule.name}</p>
                                                    <p className="text-[10px] text-slate-300 mt-1.5 uppercase font-mono tracking-widest">{rule.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-xs font-bold text-slate-500">
                                            <Badge variant="outline" className="rounded-md border-slate-100 bg-white shadow-sm font-bold uppercase text-[9px] tracking-tight text-slate-600">
                                                {rule.engine}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black text-slate-700">{rule.success}%</span>
                                                <div className="w-16">
                                                    <Progress value={rule.success} className="h-1 bg-slate-100" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-sm font-black text-slate-800">
                                            {rule.triggers.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-5">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Engine State</p>
                                                    <p className={`text-[10px] font-black mt-0.5 uppercase ${rule.status === 'Running' ? 'text-emerald-500' : 'text-amber-500'}`}>{rule.status}</p>
                                                </div>
                                                <Switch checked={rule.status === 'Running'} onCheckedChange={() => handleToggleRule(rule.id, rule.status)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-center gap-4 border-dashed">
                <Settings2 className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed font-sans">
                    Institutional policies use the <span className="font-bold">Edge-First Engine®</span>. New rules are compiled and synchronized across all distributed business units within 300ms.
                </p>
            </div>
        </div>
    )
}
