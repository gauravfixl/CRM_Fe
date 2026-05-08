"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    Plus,
    TrendingUp,
    TrendingDown,
    Activity,
    ChevronLeft,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import { Switch } from "@/shared/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"

const SCORING_RULES = [
    { id: "1", name: "Enterprise Company Size", category: "Firmographic", type: "Positive", score: 20, description: "Lead company has >500 employees.", status: true, triggers: 1240 },
    { id: "2", name: "CXO Authority", category: "Persona", type: "Positive", score: 25, description: "Job title contains 'Chief' or 'VP'.", status: true, triggers: 450 },
    { id: "3", name: "Invalid Email Pattern", category: "Data Quality", type: "Negative", score: -50, description: "Email contains 'test', 'spam' or 'random'.", status: true, triggers: 82 },
    { id: "4", name: "Specific Revenue Range", category: "Firmographic", type: "Positive", score: 15, description: "Annual revenue > $50M.", status: false, triggers: 0 },
    { id: "5", name: "Inactivity Decay", category: "Engagement", type: "Decay", score: -5, description: "Reduce score by 5 every 7 days of silence.", status: true, triggers: 3100 },
    { id: "6", name: "Competitor Domain", category: "Governance", type: "Negative", score: -100, description: "Email domain matches known competitor list.", status: true, triggers: 12 },
]

type Rule = typeof SCORING_RULES[number]

type FormErrors = {
    name?: string
    description?: string
    category?: string
    type?: string
    score?: string
}

type DecaySettings = {
    inactiveDays: number
    decayPoints: number
    enabled: boolean
}

export default function ScoringRulesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [rules, setRules] = useState<Rule[]>(SCORING_RULES)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingRule, setEditingRule] = useState<Rule | null>(null)
    const [newRule, setNewRule] = useState({ name: "", category: "Firmographic", type: "Positive", score: 10, description: "", status: true })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isDecayOpen, setIsDecayOpen] = useState(false)
    const [decaySettings, setDecaySettings] = useState<DecaySettings>({ inactiveDays: 7, decayPoints: 5, enabled: true })
    const [draftDecay, setDraftDecay] = useState<DecaySettings>(decaySettings)
    const [decayErrors, setDecayErrors] = useState<{ inactiveDays?: string; decayPoints?: string }>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const validateForm = (): boolean => {
        const e: FormErrors = {}
        if (!newRule.name.trim()) e.name = "Rule name is required"
        else if (newRule.name.trim().length < 3) e.name = "Rule name must be at least 3 characters"
        else if (newRule.name.trim().length > 80) e.name = "Rule name must be under 80 characters"

        if (!newRule.description.trim()) e.description = "Description is required"
        else if (newRule.description.trim().length < 5) e.description = "Description must be at least 5 characters"

        if (!newRule.category) e.category = "Category is required"
        if (!newRule.type) e.type = "Logic type is required"

        if (newRule.score === undefined || newRule.score === null || isNaN(newRule.score)) e.score = "Score is required"
        else if (newRule.score < -100 || newRule.score > 100) e.score = "Score must be between -100 and 100"
        else if (newRule.type === "Positive" && newRule.score <= 0) e.score = "Positive rules must have a score > 0"
        else if (newRule.type === "Negative" && newRule.score >= 0) e.score = "Negative rules must have a score < 0"
        else if (newRule.type === "Decay" && newRule.score >= 0) e.score = "Decay rules must have a score < 0"

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleAddOrUpdate = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!validateForm()) {
            toast({ title: "Validation Failed", description: "Please fix the highlighted errors.", variant: "destructive" })
            return
        }
        if (editingRule) {
            setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...newRule } : r))
            toast({ title: "Rule Updated", description: "Scoring logic has been modified." })
        } else {
            setRules([...rules, { ...newRule, id: Math.random().toString(36).substr(2, 9), triggers: 0 }])
            toast({ title: "Rule Created", description: "New scoring parameter is now active." })
        }
        setIsAddOpen(false)
        setEditingRule(null)
        setErrors({})
        setNewRule({ name: "", category: "Firmographic", type: "Positive", score: 10, description: "", status: true })
    }

    const startEdit = (rule: Rule) => {
        setEditingRule(rule)
        setNewRule({ name: rule.name, category: rule.category, type: rule.type, score: rule.score, description: rule.description, status: rule.status })
        setErrors({})
        setIsAddOpen(true)
    }

    const openCreate = () => {
        setEditingRule(null)
        setErrors({})
        setNewRule({ name: "", category: "Firmographic", type: "Positive", score: 10, description: "", status: true })
        setIsAddOpen(true)
    }

    const handleDelete = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
        toast({ title: "Rule Deleted", description: "Scoring parameter removed permanently." })
    }

    const handleDuplicate = (rule: Rule) => {
        setRules([...rules, { ...rule, id: Math.random().toString(36).substr(2, 9), name: `${rule.name} (Copy)`, triggers: 0 }])
        toast({ title: "Rule Duplicated", description: "A copy has been added." })
    }

    const toggleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r))
    }

    const filteredRules = useMemo(() => {
        return rules.filter(r => {
            const term = searchTerm.toLowerCase()
            const matchSearch = !term ||
                r.name.toLowerCase().includes(term) ||
                r.description.toLowerCase().includes(term) ||
                r.category.toLowerCase().includes(term)
            const matchCat = categoryFilter === "all" || r.category === categoryFilter
            return matchSearch && matchCat
        })
    }, [rules, searchTerm, categoryFilter])

    const validateDecay = (): boolean => {
        const e: { inactiveDays?: string; decayPoints?: string } = {}
        if (!draftDecay.inactiveDays) e.inactiveDays = "Inactive days is required"
        else if (draftDecay.inactiveDays < 1 || draftDecay.inactiveDays > 365) e.inactiveDays = "Range: 1-365 days"
        if (!draftDecay.decayPoints) e.decayPoints = "Decay points is required"
        else if (draftDecay.decayPoints < 1 || draftDecay.decayPoints > 100) e.decayPoints = "Range: 1-100"
        setDecayErrors(e)
        return Object.keys(e).length === 0
    }

    const saveDecay = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!validateDecay()) return
        setDecaySettings(draftDecay)
        setIsDecayOpen(false)
        toast({ title: "Decay Settings Saved", description: `Reduce ${draftDecay.decayPoints} pts per ${draftDecay.inactiveDays} idle days.` })
    }

    const openDecay = () => {
        setDraftDecay(decaySettings)
        setDecayErrors({})
        setIsDecayOpen(true)
    }

    if (!isClient) return null

    const positiveCount = rules.filter(r => r.type === "Positive" && r.status).length
    const negativeCount = rules.filter(r => r.type === "Negative" && r.status).length
    const totalTriggers = rules.reduce((sum, r) => sum + r.triggers, 0)

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header — colorful light fill */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-indigo-50 p-6 border border-indigo-100 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-white text-indigo-600 border border-indigo-100">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Scoring Rules Logic
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Configure rule-based prioritization. Assign points for profile fit and penalize for poor data or competitor proximity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={openDecay}
                        className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5"
                    >
                        <Clock className="h-4 w-4 mr-2 text-slate-400" /> Decay Settings
                    </Button>
                    <Button
                        onClick={openCreate}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create Rule
                    </Button>
                </div>
            </div>

            {/* Metrics Breakdown — colourful KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Positive Rules", val: `${positiveCount} Active`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Negative Guards", val: `${negativeCount} Active`, icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-50" },
                    { label: "Lifetime Triggers", val: totalTriggers.toLocaleString(), icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Model Stability", val: "98.4%", icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50" },
                ].map((m, i) => (
                    <Card key={i} className={`border-none shadow-sm ring-1 ring-slate-100 rounded-none overflow-hidden ${m.bg}`}>
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{m.label}</p>
                                <h4 className="text-[20px] font-semibold text-slate-900 tracking-tight">{m.val}</h4>
                            </div>
                            <div className={`p-2.5 rounded-xl bg-white ${m.color}`}>
                                <m.icon size={18} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Rules List Area */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-2 border border-slate-100/50">
                    <div className="relative flex-1 lg:max-w-[500px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find rules by name, description or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 border-slate-100 bg-white shadow-sm text-[13px] rounded-lg focus-visible:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="h-10 w-[180px] border-slate-100 bg-white font-semibold text-[12px] rounded-lg">
                                <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Firmographic">Firmographic</SelectItem>
                                <SelectItem value="Persona">Persona</SelectItem>
                                <SelectItem value="Engagement">Engagement</SelectItem>
                                <SelectItem value="Data Quality">Data Quality</SelectItem>
                                <SelectItem value="Governance">Governance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {filteredRules.length === 0 ? (
                        <div className="p-10 border-2 border-dashed border-slate-200 text-center bg-white">
                            <p className="text-[13px] font-semibold text-slate-400">No rules match your filters.</p>
                        </div>
                    ) : filteredRules.map((rule) => (
                        <Card key={rule.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-indigo-100 transition-all bg-white relative overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-stretch">
                                    <div className={`w-2 md:w-3 ${rule.type === 'Positive' ? 'bg-emerald-500' : rule.type === 'Negative' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1 space-y-1.5 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-[15px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{rule.name}</h3>
                                                <Badge variant="secondary" className="bg-slate-50 text-slate-400 font-semibold text-[9px] uppercase tracking-wider border-none px-2 h-5">
                                                    {rule.category}
                                                </Badge>
                                                {!rule.status && <Badge variant="destructive" className="bg-slate-100 text-slate-400 font-semibold text-[9px] uppercase px-2 h-5">Disabled</Badge>}
                                            </div>
                                            <p className="text-[12px] text-slate-500 font-medium line-clamp-1">{rule.description}</p>
                                            <div className="flex items-center gap-4 text-[11px] font-semibold flex-wrap">
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
                                                <div className="flex items-center h-10 px-4 bg-slate-50 border border-slate-100 gap-3">
                                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Active</span>
                                                    <Switch
                                                        checked={rule.status}
                                                        onCheckedChange={() => toggleStatus(rule.id)}
                                                        className="data-[state=checked]:bg-indigo-600"
                                                    />
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-lg shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => startEdit(rule)} className="text-[12px] font-semibold py-2.5">Edit Rule Logic</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDuplicate(rule)} className="text-[12px] font-semibold py-2.5">Duplicate Rule</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Trigger Log", description: `${rule.triggers.toLocaleString()} triggers recorded for "${rule.name}".` })} className="text-[12px] font-semibold py-2.5">View Trigger Log</DropdownMenuItem>
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
            <div className="p-8 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-3 bg-white/50">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-400">
                    <AlertTriangle size={24} />
                </div>
                <div className="text-center">
                    <p className="text-[14px] font-semibold text-slate-600 italic">"Good scoring rules are objective and focus on Ideal Customer Profile (ICP) alignment."</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">— Sales Operations Best Practice</p>
                </div>
            </div>

            {/* Rule Side-drawer Form */}
            <SideFormSheet
                open={isAddOpen}
                onOpenChange={(o) => { setIsAddOpen(o); if (!o) setErrors({}) }}
                title={editingRule ? 'Edit Scoring Rule' : 'Create New Scoring Rule'}
                description={editingRule ? 'Update logic and impact for this rule.' : 'Define a new lead scoring parameter.'}
                icon={<Zap size={18} />}
                onSubmit={handleAddOrUpdate}
                submitLabel={editingRule ? 'Update Rule' : 'Save Rule'}
                accentColor="#4f46e5"
            >
                <div className="space-y-5">
                    <Field label="Rule Name" required error={errors.name}>
                        <Input
                            value={newRule.name}
                            onChange={e => { setNewRule({ ...newRule, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }) }}
                            placeholder="e.g., Target Industry Match"
                            className="h-11 rounded-lg"
                        />
                    </Field>

                    <Field label="Description" required error={errors.description}>
                        <Input
                            value={newRule.description}
                            onChange={e => { setNewRule({ ...newRule, description: e.target.value }); if (errors.description) setErrors({ ...errors, description: undefined }) }}
                            placeholder="When company belongs to SaaS or FinTech..."
                            className="h-11 rounded-lg"
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Category" required error={errors.category}>
                            <Select value={newRule.category} onValueChange={v => { setNewRule({ ...newRule, category: v }); if (errors.category) setErrors({ ...errors, category: undefined }) }}>
                                <SelectTrigger className="h-11 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Firmographic">Firmographic</SelectItem>
                                    <SelectItem value="Persona">Persona</SelectItem>
                                    <SelectItem value="Engagement">Engagement</SelectItem>
                                    <SelectItem value="Data Quality">Data Quality</SelectItem>
                                    <SelectItem value="Governance">Governance</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Logic Type" required error={errors.type}>
                            <Select value={newRule.type} onValueChange={v => { setNewRule({ ...newRule, type: v }); if (errors.type) setErrors({ ...errors, type: undefined }) }}>
                                <SelectTrigger className="h-11 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Positive">Positive Impact</SelectItem>
                                    <SelectItem value="Negative">Negative Penalty</SelectItem>
                                    <SelectItem value="Decay">Time Decay</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Score Adjustment" required error={errors.score} hint="Range: -100 to 100. Match sign with logic type.">
                        <Input
                            type="number"
                            min={-100}
                            max={100}
                            value={newRule.score}
                            onChange={e => { setNewRule({ ...newRule, score: parseInt(e.target.value) || 0 }); if (errors.score) setErrors({ ...errors, score: undefined }) }}
                            className="h-11 rounded-lg"
                        />
                    </Field>

                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
                        <div className="space-y-0.5">
                            <p className="text-[13px] font-semibold text-slate-700">Rule Active</p>
                            <p className="text-[11px] text-slate-500">Disable to pause without deleting</p>
                        </div>
                        <Switch
                            checked={newRule.status}
                            onCheckedChange={(c) => setNewRule({ ...newRule, status: c })}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                    </div>
                </div>
            </SideFormSheet>

            {/* Decay Settings Side-drawer */}
            <SideFormSheet
                open={isDecayOpen}
                onOpenChange={(o) => { setIsDecayOpen(o); if (!o) setDecayErrors({}) }}
                title="Time Decay Settings"
                description="Reduce score for inactive leads."
                icon={<Clock size={18} />}
                onSubmit={saveDecay}
                submitLabel="Save Decay"
                accentColor="#f59e0b"
            >
                <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100">
                        <div className="space-y-0.5">
                            <p className="text-[13px] font-semibold text-slate-700">Enable Decay</p>
                            <p className="text-[11px] text-slate-500">Auto-reduce inactive leads</p>
                        </div>
                        <Switch
                            checked={draftDecay.enabled}
                            onCheckedChange={(c) => setDraftDecay({ ...draftDecay, enabled: c })}
                            className="data-[state=checked]:bg-amber-500"
                        />
                    </div>
                    <Field label="Inactive Days Before Decay" required error={decayErrors.inactiveDays} hint="Range: 1-365 days">
                        <Input
                            type="number"
                            min={1}
                            max={365}
                            value={draftDecay.inactiveDays}
                            onChange={e => { setDraftDecay({ ...draftDecay, inactiveDays: parseInt(e.target.value) || 0 }); if (decayErrors.inactiveDays) setDecayErrors({ ...decayErrors, inactiveDays: undefined }) }}
                            className="h-11 rounded-lg"
                        />
                    </Field>
                    <Field label="Points to Subtract" required error={decayErrors.decayPoints} hint="Range: 1-100 points">
                        <Input
                            type="number"
                            min={1}
                            max={100}
                            value={draftDecay.decayPoints}
                            onChange={e => { setDraftDecay({ ...draftDecay, decayPoints: parseInt(e.target.value) || 0 }); if (decayErrors.decayPoints) setDecayErrors({ ...decayErrors, decayPoints: undefined }) }}
                            className="h-11 rounded-lg"
                        />
                    </Field>
                </div>
            </SideFormSheet>

        </div>
    )
}
