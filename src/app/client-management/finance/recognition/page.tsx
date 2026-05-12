"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from "next/navigation"
import {
    Search,
    Plus,
    Trash2,
    Eye,
    Calendar,
    CheckCircle,
    Play,
    Timer,
    Target,
    Layers,
    FileText,
    Settings2,
    PencilLine,
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

interface RecognitionRule {
    id: string
    name: string
    type: 'Subscription' | 'Services' | 'License'
    method: 'Pro-rata Monthly' | 'Event Driven' | 'Upfront Point-in-time'
    status: 'Active' | 'Inactive'
}

interface RecognitionSchedule {
    id: number
    contract: string
    total: number
    recognized: number
    next: string
    status: 'Active' | 'Paused' | 'Completed'
}

const INITIAL_RULES: RecognitionRule[] = [
    { id: "RR-001", name: "SaaS Subscription Nexus", type: "Subscription", method: "Pro-rata Monthly", status: "Active" },
    { id: "RR-002", name: "Professional Milestone Sync", type: "Services", method: "Event Driven", status: "Active" },
    { id: "RR-003", name: "License Perpetual Ledger", type: "License", method: "Upfront Point-in-time", status: "Active" }
]

const INITIAL_SCHEDULES: RecognitionSchedule[] = [
    { id: 1, contract: "Acme Enterprise Nexus", total: 120000, recognized: 85000, next: "2024-10-01", status: "Active" },
    { id: 2, contract: "TechFlow Global 24", total: 48000, recognized: 12000, next: "2024-10-15", status: "Active" }
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

export default function RevenueRecognition() {
    const router = useRouter()
    const [rules, setRules] = useState<RecognitionRule[]>(INITIAL_RULES)
    const [schedules, setSchedules] = useState<RecognitionSchedule[]>(INITIAL_SCHEDULES)
    const [searchQuery, setSearchQuery] = useState("")

    // Rule state
    const [isRuleFormOpen, setIsRuleFormOpen] = useState(false)
    const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
    const [ruleForm, setRuleForm] = useState<{ name: string; type: RecognitionRule['type']; method: RecognitionRule['method']; status: RecognitionRule['status'] }>({
        name: '', type: 'Subscription', method: 'Pro-rata Monthly', status: 'Active'
    })
    const [ruleErrors, setRuleErrors] = useState<Record<string, string>>({})
    const [isRuleDetailOpen, setIsRuleDetailOpen] = useState(false)
    const [selectedRule, setSelectedRule] = useState<RecognitionRule | null>(null)

    // Schedule state
    const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false)
    const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null)
    const [scheduleForm, setScheduleForm] = useState<{ contract: string; total: string; recognized: string; next: string; status: RecognitionSchedule['status'] }>({
        contract: '', total: '', recognized: '', next: '', status: 'Active'
    })
    const [scheduleErrors, setScheduleErrors] = useState<Record<string, string>>({})
    const [isScheduleDetailOpen, setIsScheduleDetailOpen] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState<RecognitionSchedule | null>(null)

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    // Rule helpers
    const setRuleFieldFn = (f: string, v: any) => {
        setRuleForm(p => ({ ...p, [f]: v }))
        if (ruleErrors[f]) setRuleErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validateRule = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(ruleForm.name) || validators.minLen(3)(ruleForm.name)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setRuleErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreateRule = () => {
        setEditingRuleId(null)
        setRuleForm({ name: '', type: 'Subscription', method: 'Pro-rata Monthly', status: 'Active' })
        setRuleErrors({})
        setIsRuleFormOpen(true)
    }
    const openEditRule = (r: RecognitionRule) => {
        setEditingRuleId(r.id)
        setRuleForm({ name: r.name, type: r.type, method: r.method, status: r.status })
        setRuleErrors({})
        setIsRuleFormOpen(true)
    }
    const handleSaveRule = () => {
        if (!validateRule()) { toast.error("Please correct the highlighted fields"); return }
        if (editingRuleId) {
            setRules(rules.map(r => r.id === editingRuleId ? { ...r, name: ruleForm.name.trim(), type: ruleForm.type, method: ruleForm.method, status: ruleForm.status } : r))
            toast.success(`Logic ${editingRuleId} updated`)
        } else {
            const id = `RR-${String(rules.length + 1).padStart(3, '0')}`
            setRules([...rules, { id, name: ruleForm.name.trim(), type: ruleForm.type, method: ruleForm.method, status: ruleForm.status }])
            toast.success(`Logic ${id} deployed`)
        }
        setIsRuleFormOpen(false)
    }
    const handleDeleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
        toast.success("Recognition logic removed")
    }
    const openRuleDetail = (r: RecognitionRule) => {
        setSelectedRule(r)
        setIsRuleDetailOpen(true)
    }

    // Schedule helpers
    const setScheduleFieldFn = (f: string, v: any) => {
        setScheduleForm(p => ({ ...p, [f]: v }))
        if (scheduleErrors[f]) setScheduleErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validateSchedule = () => {
        const errs: Record<string, string> = {}
        errs.contract = validators.required(scheduleForm.contract) || validators.minLen(2)(scheduleForm.contract)
        errs.total = validators.required(scheduleForm.total) || validators.number(scheduleForm.total)
        errs.recognized = scheduleForm.recognized ? validators.number(scheduleForm.recognized) : ""
        errs.next = validators.required(scheduleForm.next) || validators.date(scheduleForm.next)
        if (scheduleForm.recognized && Number(scheduleForm.recognized) > Number(scheduleForm.total)) {
            errs.recognized = "Cannot exceed total"
        }
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setScheduleErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreateSchedule = () => {
        setEditingScheduleId(null)
        setScheduleForm({ contract: '', total: '', recognized: '0', next: '', status: 'Active' })
        setScheduleErrors({})
        setIsScheduleFormOpen(true)
    }
    const openEditSchedule = (s: RecognitionSchedule) => {
        setEditingScheduleId(s.id)
        setScheduleForm({ contract: s.contract, total: String(s.total), recognized: String(s.recognized), next: s.next, status: s.status })
        setScheduleErrors({})
        setIsScheduleFormOpen(true)
    }
    const handleSaveSchedule = () => {
        if (!validateSchedule()) { toast.error("Please correct the highlighted fields"); return }
        const data: RecognitionSchedule = {
            id: editingScheduleId || Date.now(),
            contract: scheduleForm.contract.trim(),
            total: Number(scheduleForm.total),
            recognized: Number(scheduleForm.recognized || 0),
            next: scheduleForm.next,
            status: scheduleForm.status,
        }
        if (editingScheduleId) {
            setSchedules(schedules.map(s => s.id === editingScheduleId ? data : s))
            toast.success("Schedule updated")
        } else {
            setSchedules([data, ...schedules])
            toast.success("Schedule created")
        }
        setIsScheduleFormOpen(false)
    }
    const handleDeleteSchedule = (id: number) => {
        setSchedules(schedules.filter(s => s.id !== id))
        toast.success("Schedule removed")
    }
    const openScheduleDetail = (s: RecognitionSchedule) => {
        setSelectedSchedule(s)
        setIsScheduleDetailOpen(true)
    }
    const handleRunCycle = () => {
        toast.success("Recognition cycle completed for all active contracts")
    }

    const filteredSchedules = useMemo(() =>
        schedules.filter(s => s.contract.toLowerCase().includes(searchQuery.toLowerCase()))
        , [schedules, searchQuery])

    const totalDeferred = useMemo(() => schedules.reduce((s, sc) => s + (sc.total - sc.recognized), 0), [schedules])
    const totalRecognized = useMemo(() => schedules.reduce((s, sc) => s + sc.recognized, 0), [schedules])

    const kpis = [
        { label: "Deferred Liability", value: fmt(totalDeferred), change: "+18.3%", icon: Timer, color: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100/50 text-indigo-600", path: "/client-management/finance/accounting" },
        { label: "Recognized (YTD)", value: fmt(totalRecognized), change: "+12.5%", icon: CheckCircle, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600", path: "/client-management/revenue/overview" },
        { label: "Monthly Velocity", value: "$206k", change: "+8.7%", icon: Target, color: "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100/50 text-blue-600", path: "/client-management/analytics/forecasting" },
        { label: "Compliance Index", value: "100%", icon: Settings2, color: "bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-100/50 text-slate-600", path: "/client-management/finance/reports" }
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Revenue <span className="text-indigo-600">Recognition</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Automated recognition schedules, deferred liability management, and ASC 606 compliance</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => toast.success("Recognition records exported")}>
                        <FileText className="w-4 h-4 text-slate-400" /> Audit Ledger
                    </Button>
                    <Button className="h-11 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={handleRunCycle}>
                        <Play className="w-4 h-4" /> Run Cycle
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {kpis.map((stat, i) => (
                    <Card key={i} className={`${stat.color} p-6 rounded-none border shadow-sm hover:shadow-md transition-all cursor-pointer`} onClick={() => router.push(stat.path)}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-none flex items-center justify-center bg-white shadow-sm border border-current opacity-90">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && (
                                <Badge variant="outline" className="font-semibold text-[10px] bg-white border-emerald-100 text-emerald-600 tracking-tight rounded-none">{stat.change} ↑</Badge>
                            )}
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="schedule" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-none h-14 w-fit shadow-sm">
                    <TabsTrigger value="schedule" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Deferred Schedules</TabsTrigger>
                    <TabsTrigger value="rules" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Recognition Logic</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule">
                    <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Active Deferred Portfolio</CardTitle>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Find contract or entity..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-none text-sm font-medium"
                                    />
                                </div>
                                <Button className="h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 px-4" onClick={openCreateSchedule}>
                                    <Plus className="w-4 h-4" /> New
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4 text-slate-900">
                            {filteredSchedules.length > 0 ? filteredSchedules.map((sc) => (
                                <div
                                    key={sc.id}
                                    className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:bg-white hover:shadow-xl transition-all cursor-pointer"
                                    onClick={() => openScheduleDetail(sc)}
                                >
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-14 w-14 rounded-none bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                            <Layers className="w-7 h-7 text-indigo-600" />
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{sc.contract}</h4>
                                                <Badge className={`rounded-none text-[10px] font-semibold px-2 py-0.5 border-0 ${sc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : sc.status === 'Paused' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{sc.status}</Badge>
                                            </div>
                                            <div className="w-full max-w-sm space-y-2">
                                                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                                                    <span>Recognition: {Math.round((sc.recognized / sc.total) * 100)}%</span>
                                                    <span>Delta: {fmt(sc.total - sc.recognized)}</span>
                                                </div>
                                                <Progress value={(sc.recognized / sc.total) * 100} className="h-1.5 bg-slate-100 rounded-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-medium text-slate-400">Next Tranche</p>
                                            <p className="text-sm font-semibold text-slate-900">{sc.next}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-medium text-slate-400">Total Value</p>
                                            <p className="text-xl font-semibold text-slate-900 tracking-tight">{fmt(sc.total)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openScheduleDetail(sc)}><Eye className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openEditSchedule(sc)}><PencilLine className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-rose-600" onClick={() => handleDeleteSchedule(sc.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-sm text-slate-500">No schedules match your search.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rules">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-900">
                        {rules.map((rule) => (
                            <Card key={rule.id} className="rounded-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all bg-white border border-slate-100 group cursor-pointer" onClick={() => openRuleDetail(rule)}>
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="h-12 w-12 rounded-none bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                            <Settings2 className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <Badge className={`rounded-none font-semibold text-[10px] border-0 ${rule.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>{rule.status}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{rule.name}</h4>
                                        <p className="text-[11px] font-medium text-slate-400">{rule.id}</p>
                                    </div>
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between py-2 border-b border-slate-50 text-xs">
                                            <span className="font-medium text-slate-500">Method</span>
                                            <span className="font-semibold text-slate-900">{rule.method}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-slate-50 text-xs">
                                            <span className="font-medium text-slate-500">Type</span>
                                            <span className="font-semibold text-slate-900">{rule.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                                        <Button variant="outline" className="flex-1 rounded-none h-10 border-slate-200 font-semibold text-xs hover:bg-slate-50 text-slate-900" onClick={() => openEditRule(rule)}>Edit</Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-rose-500 hover:bg-rose-50" onClick={() => handleDeleteRule(rule.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Card className="rounded-none border-2 border-dashed border-slate-200 bg-transparent shadow-none hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer" onClick={openCreateRule}>
                            <CardContent className="p-8 flex flex-col items-center justify-center gap-3 h-full min-h-[260px]">
                                <div className="h-12 w-12 rounded-none border-2 border-dashed border-slate-300 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-slate-400" />
                                </div>
                                <span className="text-sm font-semibold text-slate-500">New Recognition Rule</span>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Schedule Form Sheet */}
            <Sheet open={isScheduleFormOpen} onOpenChange={setIsScheduleFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingScheduleId ? "Edit Schedule" : "New Schedule"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track contract-based revenue recognition.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Contract Name <span className="text-rose-500">*</span></Label>
                            <Input value={scheduleForm.contract} onChange={e => setScheduleFieldFn("contract", e.target.value)} placeholder="e.g., Acme Enterprise" className={`h-10 rounded-none ${scheduleErrors.contract ? "border-rose-500" : ""}`} />
                            {scheduleErrors.contract && <p className="text-[11px] text-rose-500">{scheduleErrors.contract}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Total Value ($) <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={scheduleForm.total} onChange={e => setScheduleFieldFn("total", e.target.value)} placeholder="120000" className={`h-10 rounded-none ${scheduleErrors.total ? "border-rose-500" : ""}`} />
                                {scheduleErrors.total && <p className="text-[11px] text-rose-500">{scheduleErrors.total}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Recognized ($)</Label>
                                <Input type="number" value={scheduleForm.recognized} onChange={e => setScheduleFieldFn("recognized", e.target.value)} placeholder="0" className={`h-10 rounded-none ${scheduleErrors.recognized ? "border-rose-500" : ""}`} />
                                {scheduleErrors.recognized && <p className="text-[11px] text-rose-500">{scheduleErrors.recognized}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Next Tranche <span className="text-rose-500">*</span></Label>
                                <Input type="date" value={scheduleForm.next} onChange={e => setScheduleFieldFn("next", e.target.value)} className={`h-10 rounded-none ${scheduleErrors.next ? "border-rose-500" : ""}`} />
                                {scheduleErrors.next && <p className="text-[11px] text-rose-500">{scheduleErrors.next}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={scheduleForm.status} onValueChange={(v: any) => setScheduleFieldFn("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Paused">Paused</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsScheduleFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveSchedule}>{editingScheduleId ? "Save Changes" : "Create"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Schedule Detail Sheet */}
            <Sheet open={isScheduleDetailOpen} onOpenChange={setIsScheduleDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Contract Schedule</SheetTitle>
                    </SheetHeader>
                    {selectedSchedule && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-none border border-slate-100">
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Contract</p>
                                        <p className="text-lg font-bold text-slate-900">{selectedSchedule.contract}</p>
                                    </div>
                                    <Badge className={`rounded-none border-0 ${selectedSchedule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : selectedSchedule.status === 'Paused' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{selectedSchedule.status}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-semibold text-slate-400">Recognition Progress</p>
                                        <p className="text-sm font-bold text-slate-900">{Math.round((selectedSchedule.recognized / selectedSchedule.total) * 100)}% Complete</p>
                                    </div>
                                    <Progress value={(selectedSchedule.recognized / selectedSchedule.total) * 100} className="h-2 bg-slate-100 rounded-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Total Value</p><p className="font-bold text-slate-900">{fmt(selectedSchedule.total)}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Recognized</p><p className="font-bold text-emerald-600">{fmt(selectedSchedule.recognized)}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Deferred</p><p className="font-bold text-rose-600">{fmt(selectedSchedule.total - selectedSchedule.recognized)}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Next Tranche</p>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {selectedSchedule.next}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsScheduleDetailOpen(false); openEditSchedule(selectedSchedule) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteSchedule(selectedSchedule.id); setIsScheduleDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Rule Form Sheet */}
            <Sheet open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingRuleId ? "Edit Recognition Logic" : "New Recognition Logic"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define how revenue is recognized.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Policy Name <span className="text-rose-500">*</span></Label>
                            <Input value={ruleForm.name} onChange={e => setRuleFieldFn("name", e.target.value)} placeholder="e.g., Enterprise Tier Recognition" className={`h-10 rounded-none ${ruleErrors.name ? "border-rose-500" : ""}`} />
                            {ruleErrors.name && <p className="text-[11px] text-rose-500">{ruleErrors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={ruleForm.type} onValueChange={(v: any) => setRuleFieldFn("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Subscription">Subscription</SelectItem>
                                        <SelectItem value="Services">Services</SelectItem>
                                        <SelectItem value="License">License</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={ruleForm.status} onValueChange={(v: any) => setRuleFieldFn("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Recognition Method</Label>
                            <Select value={ruleForm.method} onValueChange={(v: any) => setRuleFieldFn("method", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Pro-rata Monthly">Pro-rata Monthly</SelectItem>
                                    <SelectItem value="Event Driven">Event Driven</SelectItem>
                                    <SelectItem value="Upfront Point-in-time">Upfront Point-in-time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsRuleFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveRule}>{editingRuleId ? "Save Changes" : "Deploy"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Rule Detail Sheet */}
            <Sheet open={isRuleDetailOpen} onOpenChange={setIsRuleDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Recognition Logic</SheetTitle>
                    </SheetHeader>
                    {selectedRule && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Policy</p>
                                    <p className="text-lg font-semibold text-slate-900">{selectedRule.name}</p>
                                    <p className="text-sm text-indigo-600 font-semibold">{selectedRule.id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><Badge className="rounded-none bg-indigo-50 text-indigo-700 border-0">{selectedRule.type}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none border-0 ${selectedRule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{selectedRule.status}</Badge>
                                    </div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Method</p><p className="font-semibold text-slate-900">{selectedRule.method}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsRuleDetailOpen(false); openEditRule(selectedRule) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteRule(selectedRule.id); setIsRuleDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
