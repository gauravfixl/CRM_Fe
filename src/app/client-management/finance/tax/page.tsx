"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from "next/navigation"
import {
    Search,
    Plus,
    Trash2,
    Eye,
    Calculator,
    FileText,
    AlertTriangle,
    Globe,
    ShieldCheck,
    Clock,
    Calendar,
    Lock,
    PencilLine,
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

interface TaxRule {
    id: string
    name: string
    type: string
    rate: number
    region: string
    status: 'Active' | 'Inactive'
    authority?: string
}

interface TaxReturn {
    id: number
    period: string
    region: string
    due: string
    liability: number
    status: 'Pending' | 'Draft' | 'Filed'
}

const INITIAL_RULES: TaxRule[] = [
    { id: "TAX-001", name: "US Sales Tax (CA)", type: "Sales Tax", rate: 8.25, region: "United States", status: "Active", authority: "IRS" },
    { id: "TAX-002", name: "UK VAT Standard", type: "VAT", rate: 20.0, region: "United Kingdom", status: "Active", authority: "HMRC" },
    { id: "TAX-003", name: "Canada GST", type: "GST", rate: 5.0, region: "Canada", status: "Active", authority: "CRA" }
]

const INITIAL_RETURNS: TaxReturn[] = [
    { id: 1, period: "Q3 2024", region: "United States", due: "2024-10-31", liability: 45200, status: "Pending" },
    { id: 2, period: "Q3 2024", region: "United Kingdom", due: "2024-11-07", liability: 62300, status: "Draft" }
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
    percent: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 || Number(v) > 100 ? "Must be 0-100" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

export default function TaxModule() {
    const router = useRouter()
    const [rules, setRules] = useState<TaxRule[]>(INITIAL_RULES)
    const [returns, setReturns] = useState<TaxReturn[]>(INITIAL_RETURNS)
    const [searchQuery, setSearchQuery] = useState("")

    // Rule state
    const [isRuleFormOpen, setIsRuleFormOpen] = useState(false)
    const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
    const [ruleForm, setRuleForm] = useState({ name: '', type: 'Sales Tax', region: 'United States', rate: '', authority: '' })
    const [ruleErrors, setRuleErrors] = useState<Record<string, string>>({})
    const [isRuleDetailOpen, setIsRuleDetailOpen] = useState(false)
    const [selectedRule, setSelectedRule] = useState<TaxRule | null>(null)

    // Return state
    const [isReturnFormOpen, setIsReturnFormOpen] = useState(false)
    const [editingReturnId, setEditingReturnId] = useState<number | null>(null)
    const [returnForm, setReturnForm] = useState<{ period: string; region: string; due: string; liability: string; status: TaxReturn['status'] }>({
        period: '', region: '', due: '', liability: '', status: 'Pending'
    })
    const [returnErrors, setReturnErrors] = useState<Record<string, string>>({})
    const [isReturnDetailOpen, setIsReturnDetailOpen] = useState(false)
    const [selectedReturn, setSelectedReturn] = useState<TaxReturn | null>(null)

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    // Rule helpers
    const setRuleField = (f: string, v: any) => {
        setRuleForm(p => ({ ...p, [f]: v }))
        if (ruleErrors[f]) setRuleErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validateRule = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(ruleForm.name) || validators.minLen(2)(ruleForm.name)
        errs.region = validators.required(ruleForm.region)
        errs.rate = validators.required(ruleForm.rate) || validators.percent(ruleForm.rate)
        errs.authority = validators.required(ruleForm.authority)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setRuleErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreateRule = () => {
        setEditingRuleId(null)
        setRuleForm({ name: '', type: 'Sales Tax', region: 'United States', rate: '', authority: '' })
        setRuleErrors({})
        setIsRuleFormOpen(true)
    }
    const openEditRule = (r: TaxRule) => {
        setEditingRuleId(r.id)
        setRuleForm({ name: r.name, type: r.type, region: r.region, rate: String(r.rate), authority: r.authority || '' })
        setRuleErrors({})
        setIsRuleFormOpen(true)
    }
    const handleSaveRule = () => {
        if (!validateRule()) { toast.error("Please correct the highlighted fields"); return }
        if (editingRuleId) {
            setRules(rules.map(r => r.id === editingRuleId ? { ...r, name: ruleForm.name.trim(), type: ruleForm.type, region: ruleForm.region.trim(), rate: Number(ruleForm.rate), authority: ruleForm.authority.trim() } : r))
            toast.success(`Rule ${editingRuleId} updated`)
        } else {
            const id = `TAX-${String(rules.length + 1).padStart(3, '0')}`
            setRules([...rules, { id, name: ruleForm.name.trim(), type: ruleForm.type, rate: Number(ruleForm.rate), region: ruleForm.region.trim(), status: 'Active', authority: ruleForm.authority.trim() }])
            toast.success(`Rule ${id} provisioned`)
        }
        setIsRuleFormOpen(false)
    }
    const handleToggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r))
        toast.success("Status updated")
    }
    const handleDeleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
        toast.success("Rule deleted")
    }
    const openRuleDetail = (r: TaxRule) => {
        setSelectedRule(r)
        setIsRuleDetailOpen(true)
    }

    // Return helpers
    const setReturnField = (f: string, v: any) => {
        setReturnForm(p => ({ ...p, [f]: v }))
        if (returnErrors[f]) setReturnErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validateReturn = () => {
        const errs: Record<string, string> = {}
        errs.period = validators.required(returnForm.period)
        errs.region = validators.required(returnForm.region)
        errs.due = validators.required(returnForm.due) || validators.date(returnForm.due)
        errs.liability = validators.required(returnForm.liability) || validators.number(returnForm.liability)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setReturnErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreateReturn = () => {
        setEditingReturnId(null)
        setReturnForm({ period: '', region: '', due: '', liability: '', status: 'Pending' })
        setReturnErrors({})
        setIsReturnFormOpen(true)
    }
    const openEditReturn = (r: TaxReturn) => {
        setEditingReturnId(r.id)
        setReturnForm({ period: r.period, region: r.region, due: r.due, liability: String(r.liability), status: r.status })
        setReturnErrors({})
        setIsReturnFormOpen(true)
    }
    const handleSaveReturn = () => {
        if (!validateReturn()) { toast.error("Please correct the highlighted fields"); return }
        const data: TaxReturn = {
            id: editingReturnId || Date.now(),
            period: returnForm.period.trim(),
            region: returnForm.region.trim(),
            due: returnForm.due,
            liability: Number(returnForm.liability),
            status: returnForm.status,
        }
        if (editingReturnId) {
            setReturns(returns.map(r => r.id === editingReturnId ? data : r))
            toast.success("Return updated")
        } else {
            setReturns([data, ...returns])
            toast.success("Return created")
        }
        setIsReturnFormOpen(false)
    }
    const handleFileReturn = (id: number) => {
        setReturns(returns.map(r => r.id === id ? { ...r, status: 'Filed' as const } : r))
        toast.success("Return filed")
    }
    const handleDeleteReturn = (id: number) => {
        setReturns(returns.filter(r => r.id !== id))
        toast.success("Return removed")
    }
    const openReturnDetail = (r: TaxReturn) => {
        setSelectedReturn(r)
        setIsReturnDetailOpen(true)
    }

    const filteredRules = useMemo(() => rules.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.region.toLowerCase().includes(searchQuery.toLowerCase())
    ), [rules, searchQuery])

    const totalLiability = useMemo(() => returns.reduce((s, r) => s + r.liability, 0), [returns])
    const pendingReturns = useMemo(() => returns.filter(r => r.status !== 'Filed').length, [returns])

    const kpis = [
        { label: "Total Liability (MTD)", value: fmt(totalLiability), change: "+8.3%", icon: Calculator, color: "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100/50 text-rose-600", path: "/client-management/finance/overview" },
        { label: "Tax Collected", value: "$67.8k", change: "+12.1%", icon: FileText, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600", path: "/client-management/finance/accounting" },
        { label: "Compliance Index", value: "98.5%", icon: ShieldCheck, color: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100/50 text-indigo-600", path: "/client-management/finance/reports" },
        { label: "Pending Returns", value: `${String(pendingReturns).padStart(2, '0')} Nodes`, icon: AlertTriangle, color: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100/50 text-amber-600", path: "/client-management/finance/tax" }
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Tax <span className="text-indigo-600">Compliance</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Multi-jurisdictional tax rules, liability tracking, and structural reporting</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => toast.success("Global tax nexus synchronized")}>
                        <Globe className="w-4 h-4 text-slate-400" /> Nexus Sync
                    </Button>
                    <Button className="h-11 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={openCreateRule}>
                        <Plus className="w-4 h-4" /> Tax Rule
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

            <Tabs defaultValue="rules" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-none h-14 w-fit shadow-sm">
                    <TabsTrigger value="rules" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Jurisdiction Rules</TabsTrigger>
                    <TabsTrigger value="returns" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Returns & Filing</TabsTrigger>
                </TabsList>

                <TabsContent value="rules">
                    <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Tax Rule Engine</CardTitle>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search rules or region..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-none text-sm font-medium"
                                    />
                                </div>
                                <Button className="h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 px-4" onClick={openCreateRule}>
                                    <Plus className="w-4 h-4" /> New
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4 text-slate-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredRules.length > 0 ? filteredRules.map((rule) => (
                                    <div
                                        key={rule.id}
                                        className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex items-center justify-between hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer"
                                        onClick={() => openRuleDetail(rule)}
                                    >
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{rule.name}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-none border-0 ${rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{rule.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-6 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {rule.region}</span>
                                                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> {rule.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="text-right">
                                                <p className="text-2xl font-semibold text-indigo-600 tracking-tight">{rule.rate}%</p>
                                                <p className="text-[10px] font-medium text-slate-400">Rate</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 border-l border-slate-200 pl-4">
                                                <Switch checked={rule.status === 'Active'} onCheckedChange={() => handleToggleRule(rule.id)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                                <span className="text-[9px] font-medium text-slate-400">Toggle</span>
                                            </div>
                                            <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openEditRule(rule)}><PencilLine className="w-3.5 h-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-400 hover:text-rose-600" onClick={() => handleDeleteRule(rule.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 text-center py-12 text-sm text-slate-500">No rules match your search.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="returns">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100 text-slate-900">
                            <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-slate-900">Upcoming Filing Deadlines</CardTitle>
                                <Button className="h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 px-4" onClick={openCreateReturn}>
                                    <Plus className="w-4 h-4" /> New Return
                                </Button>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {returns.length > 0 ? returns.map((ret) => (
                                    <div
                                        key={ret.id}
                                        className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all cursor-pointer"
                                        onClick={() => openReturnDetail(ret)}
                                    >
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-none bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-md font-semibold text-slate-900 tracking-tight leading-none mb-1">{ret.region} • {ret.period}</h4>
                                                    <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" /> Deadline: {ret.due}
                                                    </p>
                                                </div>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-none border-0 ${ret.status === 'Filed' ? 'bg-emerald-100 text-emerald-700' : ret.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{ret.status}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
                                            <div className="text-right">
                                                <p className="text-xl font-semibold text-slate-900 tracking-tight">{fmt(ret.liability)}</p>
                                                <p className="text-[10px] font-medium text-slate-400">Liability</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {ret.status !== 'Filed' && (
                                                    <Button className="h-10 px-4 rounded-none bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800" onClick={() => handleFileReturn(ret.id)}>File</Button>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openEditReturn(ret)}><PencilLine className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-rose-600" onClick={() => handleDeleteReturn(ret.id)}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-sm text-slate-500">No returns yet.</div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-8">
                            <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100 text-slate-900 cursor-pointer hover:shadow-2xl transition" onClick={() => router.push('/client-management/finance/reports')}>
                                <CardContent className="p-8 space-y-6">
                                    <div className="h-12 w-12 rounded-none bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-slate-900 tracking-tight leading-none">Compliance Health</h4>
                                    <div className="space-y-5">
                                        {[
                                            { label: "US Federal", value: 98 },
                                            { label: "UK VAT Nexus", value: 92 },
                                            { label: "Canada GST", value: 100 }
                                        ].map((c, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-[12px] font-medium text-slate-500">
                                                    <span>{c.label}</span>
                                                    <span className="text-slate-900">{c.value}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${c.value}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Rule Form Sheet */}
            <Sheet open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingRuleId ? "Edit Tax Rule" : "New Tax Rule"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define a jurisdiction-specific tax rule.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Rule Name <span className="text-rose-500">*</span></Label>
                            <Input value={ruleForm.name} onChange={e => setRuleField("name", e.target.value)} placeholder="e.g., EU Digital VAT" className={`h-10 rounded-none ${ruleErrors.name ? "border-rose-500" : ""}`} />
                            {ruleErrors.name && <p className="text-[11px] text-rose-500">{ruleErrors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={ruleForm.type} onValueChange={(v) => setRuleField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                                        <SelectItem value="VAT">VAT</SelectItem>
                                        <SelectItem value="GST">GST</SelectItem>
                                        <SelectItem value="Custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Rate (%) <span className="text-rose-500">*</span></Label>
                                <Input type="number" step="0.01" value={ruleForm.rate} onChange={e => setRuleField("rate", e.target.value)} placeholder="20.0" className={`h-10 rounded-none ${ruleErrors.rate ? "border-rose-500" : ""}`} />
                                {ruleErrors.rate && <p className="text-[11px] text-rose-500">{ruleErrors.rate}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Jurisdiction <span className="text-rose-500">*</span></Label>
                            <Input value={ruleForm.region} onChange={e => setRuleField("region", e.target.value)} placeholder="e.g., European Union" className={`h-10 rounded-none ${ruleErrors.region ? "border-rose-500" : ""}`} />
                            {ruleErrors.region && <p className="text-[11px] text-rose-500">{ruleErrors.region}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Filing Authority <span className="text-rose-500">*</span></Label>
                            <Input value={ruleForm.authority} onChange={e => setRuleField("authority", e.target.value)} placeholder="e.g., HMRC" className={`h-10 rounded-none ${ruleErrors.authority ? "border-rose-500" : ""}`} />
                            {ruleErrors.authority && <p className="text-[11px] text-rose-500">{ruleErrors.authority}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsRuleFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveRule}>{editingRuleId ? "Save Changes" : "Deploy Rule"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Rule Detail Sheet */}
            <Sheet open={isRuleDetailOpen} onOpenChange={setIsRuleDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Tax Rule Details</SheetTitle>
                    </SheetHeader>
                    {selectedRule && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-none border border-slate-100">
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Logic ID</p>
                                        <p className="text-xl font-bold text-indigo-600">{selectedRule.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Rate</p>
                                        <p className="text-xl font-bold text-slate-900">{selectedRule.rate}%</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Name</p><p className="text-sm font-bold text-slate-900">{selectedRule.name}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><Badge className="rounded-none bg-indigo-50 text-indigo-700 border-0">{selectedRule.type}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Region</p><p className="text-sm font-bold text-slate-900">{selectedRule.region}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none border-0 ${selectedRule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{selectedRule.status}</Badge>
                                    </div>
                                </div>
                                {selectedRule.authority && (
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase">Filing Authority</p>
                                        <div className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-none mt-1">
                                            <Calculator className="w-4 h-4 text-slate-400" />
                                            <p className="text-sm font-semibold text-slate-700">{selectedRule.authority}</p>
                                        </div>
                                    </div>
                                )}
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

            {/* Return Form Sheet */}
            <Sheet open={isReturnFormOpen} onOpenChange={setIsReturnFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingReturnId ? "Edit Return" : "New Tax Return"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track an upcoming filing deadline.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Period <span className="text-rose-500">*</span></Label>
                                <Input value={returnForm.period} onChange={e => setReturnField("period", e.target.value)} placeholder="Q3 2024" className={`h-10 rounded-none ${returnErrors.period ? "border-rose-500" : ""}`} />
                                {returnErrors.period && <p className="text-[11px] text-rose-500">{returnErrors.period}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Region <span className="text-rose-500">*</span></Label>
                                <Input value={returnForm.region} onChange={e => setReturnField("region", e.target.value)} placeholder="United States" className={`h-10 rounded-none ${returnErrors.region ? "border-rose-500" : ""}`} />
                                {returnErrors.region && <p className="text-[11px] text-rose-500">{returnErrors.region}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Due Date <span className="text-rose-500">*</span></Label>
                            <Input type="date" value={returnForm.due} onChange={e => setReturnField("due", e.target.value)} className={`h-10 rounded-none ${returnErrors.due ? "border-rose-500" : ""}`} />
                            {returnErrors.due && <p className="text-[11px] text-rose-500">{returnErrors.due}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Liability ($) <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={returnForm.liability} onChange={e => setReturnField("liability", e.target.value)} placeholder="45200" className={`h-10 rounded-none ${returnErrors.liability ? "border-rose-500" : ""}`} />
                                {returnErrors.liability && <p className="text-[11px] text-rose-500">{returnErrors.liability}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={returnForm.status} onValueChange={(v: any) => setReturnField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Filed">Filed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsReturnFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveReturn}>{editingReturnId ? "Save Changes" : "Create"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Return Detail Sheet */}
            <Sheet open={isReturnDetailOpen} onOpenChange={setIsReturnDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Return Details</SheetTitle>
                    </SheetHeader>
                    {selectedReturn && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Region & Period</p>
                                    <p className="text-lg font-semibold text-slate-900">{selectedReturn.region}</p>
                                    <p className="text-sm text-slate-500">{selectedReturn.period}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Liability</p><p className="font-semibold text-2xl text-slate-900">{fmt(selectedReturn.liability)}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none border-0 ${selectedReturn.status === 'Filed' ? 'bg-emerald-100 text-emerald-700' : selectedReturn.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{selectedReturn.status}</Badge>
                                    </div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Due Date</p><p className="font-semibold text-slate-900">{selectedReturn.due}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                {selectedReturn.status !== 'Filed' && (
                                    <Button className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-none" onClick={() => { handleFileReturn(selectedReturn.id); setIsReturnDetailOpen(false) }}>File Return</Button>
                                )}
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsReturnDetailOpen(false); openEditReturn(selectedReturn) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteReturn(selectedReturn.id); setIsReturnDetailOpen(false) }}>
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
