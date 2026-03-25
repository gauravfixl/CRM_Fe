"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    Plus,
    Minus,
    TrendingUp,
    TrendingDown,
    Activity,
    Users,
    ChevronLeft,
    Search,
    Filter,
    MoreHorizontal,
    Trash2,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Settings
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import { Switch } from "@/shared/components/ui/switch"
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

// --- Mock Data: Scoring Rules ---
const SCORING_RULES = [
    { id: "1", name: "Enterprise Company Size", category: "Firmographic", type: "Positive", score: 20, description: "Lead company has >500 employees.", status: true, triggers: 1240 },
    { id: "2", name: "CXO Authority", category: "Persona", type: "Positive", score: 25, description: "Job title contains 'Chief' or 'VP'.", status: true, triggers: 450 },
    { id: "3", name: "Invalid Email Pattern", category: "Data Quality", type: "Negative", score: -50, description: "Email contains 'test', 'spam' or 'random'.", status: true, triggers: 82 },
    { id: "4", name: "Specific Revenue Range", category: "Firmographic", type: "Positive", score: 15, description: "Annual revenue > $50M.", status: false, triggers: 0 },
    { id: "5", name: "Inactivity Decay", category: "Engagement", type: "Decay", score: -5, description: "Reduce score by 5 every 7 days of silence.", status: true, triggers: 3100 },
    { id: "6", name: "Competitor Domain", category: "Governance", type: "Negative", score: -100, description: "Email domain matches known competitor list.", status: true, triggers: 12 },
]

export default function ScoringRulesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [rules, setRules] = useState(SCORING_RULES)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingRule, setEditingRule] = useState<any>(null)
    const [newRule, setNewRule] = useState({ name: "", category: "Firmographic", type: "Positive", score: 10, description: "", status: true })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleAddOrUpdate = () => {
        if (!newRule.name) return
        if (editingRule) {
            setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...newRule } : r))
            toast({ title: "Rule Updated", description: "Scoring logic has been modified." })
        } else {
            setRules([...rules, { ...newRule, id: Math.random().toString(36).substr(2, 9), triggers: 0 }])
            toast({ title: "Rule Created", description: "New scoring parameter is now active." })
        }
        setIsAddOpen(false)
        setEditingRule(null)
        setNewRule({ name: "", category: "Firmographic", type: "Positive", score: 10, description: "", status: true })
    }

    const startEdit = (rule: any) => {
        setEditingRule(rule)
        setNewRule({ ...rule })
        setIsAddOpen(true)
    }

    const handleDelete = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
        toast({ title: "Rule Deleted", description: "Scoring parameter removed permanently." })
    }

    const toggleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r))
    }

    const filteredRules = rules.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                                <Zap className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Scoring Rules Logic
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Configure rule-based prioritization. Assign points for profile fit and penalize for poor data or competitor proximity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Clock className="h-4 w-4 mr-2 text-slate-400" /> Decay Settings
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Create Rule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>{editingRule ? 'Edit Scoring Rule' : 'Create New Scoring Rule'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Rule Name</Label>
                                    <Input value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g., Target Industry Match" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Description</Label>
                                    <Input value={newRule.description} onChange={e => setNewRule({ ...newRule, description: e.target.value })} placeholder="When company belongs to SaaS or FinTech..." className="h-11 rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold">Category</Label>
                                        <Select value={newRule.category} onValueChange={v => setNewRule({ ...newRule, category: v })}>
                                            <SelectTrigger className="h-11 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Firmographic">Firmographic</SelectItem>
                                                <SelectItem value="Persona">Persona</SelectItem>
                                                <SelectItem value="Engagement">Engagement</SelectItem>
                                                <SelectItem value="Data Quality">Data Quality</SelectItem>
                                                <SelectItem value="Governance">Governance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold">Logic Type</Label>
                                        <Select value={newRule.type} onValueChange={v => setNewRule({ ...newRule, type: v as any })}>
                                            <SelectTrigger className="h-11 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Positive">Positive Impact</SelectItem>
                                                <SelectItem value="Negative">Negative Penalty</SelectItem>
                                                <SelectItem value="Decay">Time Decay</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Score Adjustment</Label>
                                    <Input type="number" value={newRule.score} onChange={e => setNewRule({ ...newRule, score: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddOrUpdate}>
                                {editingRule ? 'Update Rule' : 'Save Rule'}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Positive Rules", val: "14 Active", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Negative Guards", val: "6 Active", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-50" },
                    { label: "Daily Triggers", val: "1.2k", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Model Stability", val: "98.4%", icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50" },
                ].map((m, i) => (
                    <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{m.label}</p>
                                <h4 className="text-[20px] font-semibold text-slate-900 tracking-tight">{m.val}</h4>
                            </div>
                            <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                                <m.icon size={18} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Rules List Area */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/50">
                    <div className="relative flex-1 lg:max-w-[500px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find rules by name, description or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 border-slate-100 bg-white shadow-sm text-[13px] rounded-xl focus-visible:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-10 border-slate-100 bg-white font-semibold text-[12px] px-4 rounded-xl">
                            <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" /> Category
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {filteredRules.map((rule) => (
                        <Card key={rule.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-indigo-100 transition-all bg-white relative overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-stretch">
                                    <div className={`w-2 md:w-3 ${rule.type === 'Positive' ? 'bg-emerald-500' : rule.type === 'Negative' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1 space-y-1.5 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[15px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{rule.name}</h3>
                                                <Badge variant="secondary" className="bg-slate-50 text-slate-400 font-semibold text-[9px] uppercase tracking-wider border-none px-2 h-5">
                                                    {rule.category}
                                                </Badge>
                                                {!rule.status && <Badge variant="destructive" className="bg-slate-100 text-slate-400 font-semibold text-[9px] uppercase px-2 h-5">Disabled</Badge>}
                                            </div>
                                            <p className="text-[12px] text-slate-500 font-medium line-clamp-1">{rule.description}</p>
                                            <div className="flex items-center gap-4 text-[11px] font-semibold">
                                                <span className="flex items-center gap-1.5 text-slate-400"><Activity size={12} /> {rule.triggers.toLocaleString()} Lifetime Triggers</span>
                                                <span className="text-slate-200">•</span>
                                                <span className={`${rule.type === 'Positive' ? 'text-emerald-600' : 'text-rose-600'}`}>{rule.type} logic</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <span className="text-[10px] font-semibold text-slate-400 tracking-widest pb-1">Score Change</span>
                                                <div className={`text-[20px] font-semibold tracking-tighter tabular-nums ${rule.score > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {rule.score > 0 ? '+' : ''}{rule.score}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center h-10 px-4 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Active</span>
                                                    <Switch
                                                        checked={rule.status}
                                                        onCheckedChange={() => toggleStatus(rule.id)}
                                                        className="data-[state=checked]:bg-indigo-600"
                                                    />
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => startEdit(rule)} className="text-[12px] font-semibold py-2.5">Edit Rule Logic</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-[12px] font-semibold py-2.5">Duplicate Rule</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-[12px] font-semibold py-2.5">View Trigger Log</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDelete(rule.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">Delete Permanently</DropdownMenuItem>
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

            {/* Empty State / Hint */}
            <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center space-y-3 bg-white/50">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-400">
                    <AlertTriangle size={24} />
                </div>
                <div className="text-center">
                    <p className="text-[14px] font-semibold text-slate-600 italic">"Good scoring rules are objective and focus on Ideal Customer Profile (ICP) alignment."</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">— Sales Operations Best Practice</p>
                </div>
            </div>

        </div>
    )
}
