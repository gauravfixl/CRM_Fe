"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Repeat,
    Plus,
    Filter,
    GripVertical,
    ChevronLeft,
    Search,
    Play,
    Settings2,
    Trash2,
    ArrowRight,
    Zap,
    CheckCircle2,
    ShieldCheck,
    Globe,
    Target,
    GitBranch
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import { Switch } from "@/shared/components/ui/switch"

// --- Mock Data: Routing Rules ---
const INITIAL_RULES = [
    {
        id: "1",
        name: "Enterprise Leads - US West",
        priority: 1,
        condition: "Score > 80 AND Territory == 'US-West'",
        action: "Assign to High-Value RR Pool",
        status: true,
        type: "Logic Boundary"
    },
    {
        id: "2",
        name: "Google Ads - Discovery Phase",
        priority: 2,
        condition: "Source == 'Google Ads' AND Stage == 'Discovery'",
        action: "Assign to BDR Inbound Queue",
        status: true,
        type: "Source Rule"
    },
    {
        id: "3",
        name: "Competitor Domain Penalty",
        priority: 3,
        condition: "Email Domain in COMPETITOR_LIST",
        action: "Route to Governance Queue (Blocked)",
        status: true,
        type: "Security Block"
    },
    {
        id: "4",
        name: "EMEA Region - French Speaking",
        priority: 4,
        condition: "Country == 'France' OR Country == 'Belgium'",
        action: "Assign to EMEA-French Team",
        status: false,
        type: "Geography"
    },
]

export default function RoutingRulesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [rules, setRules] = useState(INITIAL_RULES)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [newItem, setNewItem] = useState({ name: "", condition: "", action: "", type: "Logic Boundary" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const toggleRuleStatus = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, status: !r.status } : r))
        toast({ title: "Rule Updated", description: "Routing logic activation state changed." })
    }

    const handleDelete = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id))
        toast({ title: "Rule Removed", description: "The routing rule has been successfully deleted." })
    }

    const startEdit = (rule: any) => {
        setEditingItem(rule)
        setNewItem({ name: rule.name, condition: rule.condition, action: rule.action, type: rule.type })
        setIsAddOpen(true)
    }

    const handleAddOrUpdate = () => {
        if (!newItem.name || !newItem.condition || !newItem.action) {
            toast({ title: "Incomplete Data", description: "Please provide a name, condition, and action.", variant: "destructive" })
            return
        }
        if (editingItem) {
            setRules(prev => prev.map(r => r.id === editingItem.id ? { ...r, ...newItem } : r))
            toast({ title: "Rule Updated", description: "Rule logic has been updated." })
        } else {
            setRules([...rules, {
                ...newItem,
                id: Math.random().toString(36).substr(2, 9),
                priority: rules.length + 1,
                status: true
            }])
            toast({ title: "Rule Created", description: "New routing logic is now active." })
        }
        setIsAddOpen(false)
        setEditingItem(null)
        setNewItem({ name: "", condition: "", action: "", type: "Logic Boundary" })
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
                            <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-sm">
                                <Repeat className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Routing Rules Builder
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Configure conditional logic (IF/THEN) to automate lead distribution. Rules are processed sequentially based on priority.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Play className="h-4 w-4 mr-2 text-slate-400" /> Test with Sample Lead
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                                onClick={() => { setEditingItem(null); setNewItem({ name: "", condition: "", action: "", type: "Logic Boundary" }) }}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Create New Rule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? 'Edit Rule' : 'Create New Rule'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Rule Name</Label>
                                    <Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g., Enterprise Leads" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Rule Type</Label>
                                    <Select value={newItem.type} onValueChange={v => setNewItem({ ...newItem, type: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Logic Boundary">Logic Boundary</SelectItem>
                                            <SelectItem value="Source Rule">Source Rule</SelectItem>
                                            <SelectItem value="Security Block">Security Block</SelectItem>
                                            <SelectItem value="Geography">Geography</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Condition (IF)</Label>
                                    <Input value={newItem.condition} onChange={e => setNewItem({ ...newItem, condition: e.target.value })} placeholder="e.g., Score > 80" className="h-11 rounded-xl font-mono text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Action (THEN)</Label>
                                    <Input value={newItem.action} onChange={e => setNewItem({ ...newItem, action: e.target.value })} placeholder="e.g., Assign to High-Value RR Pool" className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddOrUpdate}>
                                {editingItem ? 'Update Rule' : 'Save Rule'}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Rules List Area */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[400px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Find rules by name or condition..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-xl focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-10 border-slate-100 bg-white font-semibold text-[12px] px-4 rounded-xl">
                                <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" /> All Types
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {rules.map((rule) => (
                            <Card key={rule.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex items-stretch">
                                        <div className="w-10 flex flex-col items-center justify-center border-r border-slate-50 group-hover:bg-cyan-50/30 transition-colors">
                                            <GripVertical size={16} className="text-slate-300" />
                                            <span className="text-[10px] font-semibold text-slate-400 mt-1">{rule.priority}</span>
                                        </div>
                                        <div className="flex-1 p-5 space-y-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-[15px] font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">{rule.name}</h3>
                                                        <Badge className="bg-slate-50 text-slate-400 hover:bg-slate-100 border-none font-semibold text-[9px] uppercase tracking-wider">{rule.type}</Badge>
                                                        {!rule.status && <Badge variant="destructive" className="bg-slate-100 text-slate-400 font-semibold text-[9px] uppercase px-1.5 h-4.5 border-none">Disabled</Badge>}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[12px] font-mono bg-slate-50 p-1.5 px-3 rounded-lg border border-slate-100 w-fit">
                                                        <span className="text-indigo-500 font-semibold">IF</span>
                                                        <span className="text-slate-600">{rule.condition}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center h-10 px-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider leading-none">Status</span>
                                                    <Switch checked={rule.status} onCheckedChange={() => toggleRuleStatus(rule.id)} className="data-[state=checked]:bg-cyan-600" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <div className="flex items-center gap-3 text-emerald-600">
                                                    <ArrowRight size={14} />
                                                    <span className="text-[12px] font-semibold">THEN: <span className="text-slate-900 underline underline-offset-4 decoration-emerald-200">{rule.action}</span></span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(rule)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                                                        <Settings2 size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Conflict Resolution Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit shadow-sm">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold">Rule Priority Engine</h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    When multiple rules match, the system executes the one with the lowest priority number.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h5 className="text-[12px] font-semibold text-slate-400 tracking-wider">Conflict Settings</h5>
                            <div className="space-y-3">
                                {[
                                    { label: "Stop after match", desc: "Prevents secondary rules from firing.", active: true },
                                    { label: "Fallback Catch-all", desc: "Route if no rules match.", active: true }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50 group hover:border-indigo-100 transition-colors">
                                        <div className="space-y-0.5">
                                            <p className="text-[13px] font-semibold text-slate-700">{s.label}</p>
                                            <p className="text-[10px] font-medium text-slate-400">{s.desc}</p>
                                        </div>
                                        <Switch checked={s.active} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-700">
                                <Zap size={14} className="fill-emerald-700" />
                                <span className="text-[12px] font-semibold">AI Consistency Check</span>
                            </div>
                            <p className="text-[11px] text-emerald-600 font-medium">
                                No overlapping conditions found in your current 4 rules. Your logic is clean.
                            </p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-indigo-900 p-6 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-indigo-900">
                            <GitBranch size={100} />
                        </div>
                        <h4 className="text-[15px] font-semibold text-indigo-800">Logic Testing Sandbox</h4>
                        <p className="text-[12px] text-indigo-600/80 font-medium leading-relaxed">
                            Validate your rules against historical data before pushing to live production.
                        </p>
                        <Button className="w-full h-9 bg-white text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] rounded-xl border-none shadow-sm">
                            Enter Sandbox
                        </Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
