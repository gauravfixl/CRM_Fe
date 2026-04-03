"use client"

import React, { useState } from "react"
import {
    Zap, Search, Plus, MoreHorizontal, Play, Pause,
    Trash2, Edit2, ChevronRight, AlertCircle, CheckCircle2,
    Clock, Bot, ArrowRight, X, Copy, FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

interface AutomationRule {
    id: string
    name: string
    trigger: string
    condition: string
    conditionValue: string
    action: string
    actionValue: string
    active: boolean
    lastTriggered: string
    runCount: number
    createdAt: string
}

interface AuditEntry {
    id: string
    ruleId: string
    ruleName: string
    trigger: string
    result: "success" | "error"
    timestamp: string
    detail: string
}

const TRIGGERS = [
    "Issue Created", "Issue Updated", "Status Changed",
    "Sprint Started", "Sprint Completed", "Scheduled (Daily)", "Scheduled (Weekly)"
]
const CONDITIONS = [
    "Field equals", "Field contains", "Issue type is",
    "Priority is", "Assignee is"
]
const ACTIONS = [
    "Set field value", "Assign to user", "Add comment",
    "Change status", "Add label", "Send notification", "Move to sprint"
]

const TEMPLATES = [
    { name: "Auto-assign bugs to QA team", trigger: "Issue Created", condition: "Issue type is", conditionValue: "Bug", action: "Assign to user", actionValue: "QA Lead" },
    { name: "Move completed sub-tasks \u2192 resolve parent", trigger: "Status Changed", condition: "Field equals", conditionValue: "Done", action: "Change status", actionValue: "Done" },
    { name: "Notify when high priority created", trigger: "Issue Created", condition: "Priority is", conditionValue: "High", action: "Send notification", actionValue: "Team Channel" },
    { name: "Auto-close stale issues after 30 days", trigger: "Scheduled (Daily)", condition: "Field equals", conditionValue: "Stale > 30 days", action: "Change status", actionValue: "Closed" },
]

const INITIAL_RULES: AutomationRule[] = [
    { id: "rule-1", name: "Auto-assign bugs to QA", trigger: "Issue Created", condition: "Issue type is", conditionValue: "Bug", action: "Assign to user", actionValue: "QA Lead", active: true, lastTriggered: "2h ago", runCount: 47, createdAt: "2026-03-15" },
    { id: "rule-2", name: "Notify on high priority", trigger: "Issue Created", condition: "Priority is", conditionValue: "High", action: "Send notification", actionValue: "Team Channel", active: true, lastTriggered: "30m ago", runCount: 123, createdAt: "2026-03-10" },
    { id: "rule-3", name: "Close stale issues", trigger: "Scheduled (Daily)", condition: "Field equals", conditionValue: "Stale > 30 days", action: "Change status", actionValue: "Closed", active: false, lastTriggered: "1d ago", runCount: 12, createdAt: "2026-03-20" },
]

const INITIAL_AUDIT: AuditEntry[] = [
    { id: "a1", ruleId: "rule-2", ruleName: "Notify on high priority", trigger: "Issue PROJ-189 created", result: "success", timestamp: "30m ago", detail: "Notification sent to Team Channel" },
    { id: "a2", ruleId: "rule-1", ruleName: "Auto-assign bugs to QA", trigger: "Issue PROJ-192 created", result: "success", timestamp: "2h ago", detail: "Assigned to QA Lead" },
    { id: "a3", ruleId: "rule-3", ruleName: "Close stale issues", trigger: "Scheduled run", result: "error", timestamp: "1d ago", detail: "3 issues closed, 1 failed (permission denied)" },
    { id: "a4", ruleId: "rule-2", ruleName: "Notify on high priority", trigger: "Issue PROJ-185 created", result: "success", timestamp: "2d ago", detail: "Notification sent to Team Channel" },
    { id: "a5", ruleId: "rule-1", ruleName: "Auto-assign bugs to QA", trigger: "Issue PROJ-180 created", result: "success", timestamp: "3d ago", detail: "Assigned to QA Lead" },
]

export default function AutomationPage() {
    const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES)
    const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("rules")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingRule, setEditingRule] = useState<AutomationRule | null>(null)
    const [step, setStep] = useState(1)

    // Form state
    const [formName, setFormName] = useState("")
    const [formTrigger, setFormTrigger] = useState("")
    const [formCondition, setFormCondition] = useState("")
    const [formConditionValue, setFormConditionValue] = useState("")
    const [formAction, setFormAction] = useState("")
    const [formActionValue, setFormActionValue] = useState("")

    const resetForm = () => {
        setFormName(""); setFormTrigger(""); setFormCondition("")
        setFormConditionValue(""); setFormAction(""); setFormActionValue("")
        setStep(1); setEditingRule(null)
    }

    const openCreate = () => { resetForm(); setDialogOpen(true) }

    const openEdit = (rule: AutomationRule) => {
        setEditingRule(rule)
        setFormName(rule.name); setFormTrigger(rule.trigger); setFormCondition(rule.condition)
        setFormConditionValue(rule.conditionValue); setFormAction(rule.action); setFormActionValue(rule.actionValue)
        setStep(1); setDialogOpen(true)
    }

    const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
        setFormName(tpl.name); setFormTrigger(tpl.trigger); setFormCondition(tpl.condition)
        setFormConditionValue(tpl.conditionValue); setFormAction(tpl.action); setFormActionValue(tpl.actionValue)
        setStep(1); setDialogOpen(true)
    }

    const handleSave = () => {
        if (!formName || !formTrigger || !formAction) {
            toast.error("Please complete all required fields"); return
        }
        if (editingRule) {
            setRules(prev => prev.map(r => r.id === editingRule.id ? {
                ...r, name: formName, trigger: formTrigger, condition: formCondition,
                conditionValue: formConditionValue, action: formAction, actionValue: formActionValue
            } : r))
            toast.success("Rule updated successfully")
        } else {
            const newRule: AutomationRule = {
                id: `rule-${Date.now()}`, name: formName, trigger: formTrigger,
                condition: formCondition, conditionValue: formConditionValue,
                action: formAction, actionValue: formActionValue,
                active: true, lastTriggered: "Never", runCount: 0, createdAt: new Date().toISOString().split("T")[0]
            }
            setRules(prev => [newRule, ...prev])
            toast.success("Rule created successfully")
        }
        setDialogOpen(false); resetForm()
    }

    const toggleRule = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r))
        const rule = rules.find(r => r.id === id)
        toast.success(`Rule "${rule?.name}" ${rule?.active ? "disabled" : "enabled"}`)
    }

    const deleteRule = (id: string) => {
        const rule = rules.find(r => r.id === id)
        setRules(prev => prev.filter(r => r.id !== id))
        toast.success(`Rule "${rule?.name}" deleted`)
    }

    const filteredRules = rules.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const activeRules = rules.filter(r => r.active).length
    const totalRuns = rules.reduce((sum, r) => sum + r.runCount, 0)
    const errorCount = auditLog.filter(a => a.result === "error").length
    const errorRate = auditLog.length > 0 ? Math.round((errorCount / auditLog.length) * 100) : 0

    const ruleSummary = `WHEN ${formTrigger || "..."} IF ${formCondition || "..."} ${formConditionValue ? `is "${formConditionValue}"` : ""} THEN ${formAction || "..."} ${formActionValue ? `to "${formActionValue}"` : ""}`

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* BREADCRUMB + HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span><span>/</span>
                    <span className="text-zinc-900 font-semibold">AUTOMATION</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Automation Rules</h1>
                        <p className="text-xs text-zinc-500 font-medium">Build rules to automate repetitive project tasks.</p>
                    </div>
                    <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={openCreate}>
                        <Plus className="w-3.5 h-3.5 mr-2" /> Create Rule
                    </Button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 border-none text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Active Rules</p>
                        <Zap className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{activeRules}</p>
                        <p className="text-[10px] text-white/80">of {rules.length} total</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Triggered This Week</p>
                        <Play className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{totalRuns}</p>
                        <p className="text-[10px] text-zinc-400">Total executions</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Actions Performed</p>
                        <Bot className="w-4 h-4 text-indigo-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{totalRuns}</p>
                        <p className="text-[10px] text-zinc-400">Automated actions</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Error Rate</p>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{errorRate}%</p>
                        <p className="text-[10px] text-zinc-400">{errorCount} errors in {auditLog.length} runs</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABS: Rules / Templates / Audit Log */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-zinc-100 h-9 rounded-lg px-1">
                    <TabsTrigger value="rules" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Rules</TabsTrigger>
                    <TabsTrigger value="templates" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Templates</TabsTrigger>
                    <TabsTrigger value="audit" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Audit Log</TabsTrigger>
                </TabsList>

                {/* RULES TAB */}
                <TabsContent value="rules" className="mt-4">
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                <Input placeholder="Search rules..." className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-indigo-100" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                        </div>
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow>
                                    <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Rule Name</TableHead>
                                    <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Trigger</TableHead>
                                    <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                                    <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Last Triggered</TableHead>
                                    <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Runs</TableHead>
                                    <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRules.map((rule) => (
                                    <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="py-3 px-4">
                                            <span className="text-xs font-bold text-zinc-900">{rule.name}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <Badge variant="outline" className="text-[10px] font-medium border-zinc-200 text-zinc-600">{rule.trigger}</Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${rule.active ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"}`}>
                                                {rule.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <span className="text-[10px] font-mono text-zinc-500">{rule.lastTriggered}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <span className="text-xs font-semibold text-zinc-700">{rule.runCount}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-right pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={() => toggleRule(rule.id)} title={rule.active ? "Disable" : "Enable"}>
                                                    {rule.active ? <Pause className="h-3.5 w-3.5 text-zinc-500" /> : <Play className="h-3.5 w-3.5 text-emerald-500" />}
                                                </Button>
                                                <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={() => openEdit(rule)}>
                                                    <Edit2 className="h-3.5 w-3.5 text-zinc-500" />
                                                </Button>
                                                <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50 rounded-md" onClick={() => deleteRule(rule.id)}>
                                                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredRules.length === 0 && (
                                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-xs text-zinc-400">No rules found</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* TEMPLATES TAB */}
                <TabsContent value="templates" className="mt-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        {TEMPLATES.map((tpl, idx) => (
                            <div key={idx} className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">{tpl.name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    <Badge variant="outline" className="text-[9px] font-medium border-indigo-200 text-indigo-600">WHEN: {tpl.trigger}</Badge>
                                    <Badge variant="outline" className="text-[9px] font-medium border-amber-200 text-amber-600">IF: {tpl.condition} = {tpl.conditionValue}</Badge>
                                    <Badge variant="outline" className="text-[9px] font-medium border-emerald-200 text-emerald-600">THEN: {tpl.action}</Badge>
                                </div>
                                <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95 w-fit" onClick={() => applyTemplate(tpl)}>
                                    <Copy className="w-3.5 h-3.5 mr-2" /> Use Template
                                </Button>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* AUDIT LOG TAB */}
                <TabsContent value="audit" className="mt-4">
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow>
                                    <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Rule</TableHead>
                                    <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Trigger</TableHead>
                                    <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Result</TableHead>
                                    <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Detail</TableHead>
                                    <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLog.map((entry) => (
                                    <TableRow key={entry.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="py-3 px-4">
                                            <span className="text-xs font-bold text-zinc-900">{entry.ruleName}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-xs text-zinc-500">{entry.trigger}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${entry.result === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                                {entry.result}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-xs text-zinc-500">{entry.detail}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <span className="text-[10px] font-mono text-zinc-500">{entry.timestamp}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* CREATE / EDIT RULE DIALOG */}
            <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) { setDialogOpen(false); resetForm() } else setDialogOpen(true) }}>
                <DialogContent className="sm:max-w-[540px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight">
                            {editingRule ? "Edit Rule" : "Create Automation Rule"}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3].map((s) => (
                            <button key={s} onClick={() => setStep(s)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${step === s ? "bg-indigo-50 text-indigo-700" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s ? "bg-indigo-600 text-white" : "bg-zinc-300 text-white"}`}>{s}</span>
                                {s === 1 ? "WHEN" : s === 2 ? "IF" : "THEN"}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 py-3">
                        {/* Rule name (always shown) */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">Rule Name</label>
                            <Input className="h-9 text-xs border-zinc-200" placeholder="e.g., Auto-assign bugs to QA" value={formName} onChange={(e) => setFormName(e.target.value)} />
                        </div>

                        {/* Step 1: WHEN (Trigger) */}
                        {step === 1 && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-zinc-500">WHEN (Trigger)</label>
                                <Select value={formTrigger} onValueChange={setFormTrigger}>
                                    <SelectTrigger className="h-9 text-xs border-zinc-200"><SelectValue placeholder="Select trigger..." /></SelectTrigger>
                                    <SelectContent>
                                        {TRIGGERS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Step 2: IF (Condition) */}
                        {step === 2 && (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-zinc-500">IF (Condition)</label>
                                    <Select value={formCondition} onValueChange={setFormCondition}>
                                        <SelectTrigger className="h-9 text-xs border-zinc-200"><SelectValue placeholder="Select condition..." /></SelectTrigger>
                                        <SelectContent>
                                            {CONDITIONS.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-zinc-500">Value</label>
                                    <Input className="h-9 text-xs border-zinc-200" placeholder="e.g., Bug, High, John..." value={formConditionValue} onChange={(e) => setFormConditionValue(e.target.value)} />
                                </div>
                            </>
                        )}

                        {/* Step 3: THEN (Action) */}
                        {step === 3 && (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-zinc-500">THEN (Action)</label>
                                    <Select value={formAction} onValueChange={setFormAction}>
                                        <SelectTrigger className="h-9 text-xs border-zinc-200"><SelectValue placeholder="Select action..." /></SelectTrigger>
                                        <SelectContent>
                                            {ACTIONS.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-zinc-500">Action Value</label>
                                    <Input className="h-9 text-xs border-zinc-200" placeholder="e.g., QA Lead, Done, #urgent..." value={formActionValue} onChange={(e) => setFormActionValue(e.target.value)} />
                                </div>
                            </>
                        )}

                        {/* Rule preview */}
                        {(formTrigger || formCondition || formAction) && (
                            <div className="bg-zinc-50 rounded-md border border-zinc-200 p-3 mt-1">
                                <p className="text-[10px] font-semibold uppercase text-zinc-400 mb-1">Rule Preview</p>
                                <p className="text-xs text-zinc-700 font-medium">{ruleSummary}</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex items-center gap-2">
                        {step > 1 && (
                            <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setStep(step - 1)}>Back</Button>
                        )}
                        {step < 3 ? (
                            <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setStep(step + 1)}>
                                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        ) : (
                            <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleSave}>
                                {editingRule ? "Update Rule" : "Create Rule"}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
