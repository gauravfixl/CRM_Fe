"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from "next/navigation"
import {
    Download,
    Calendar,
    TrendingUp,
    DollarSign,
    AlertTriangle,
    RefreshCw,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    SearchCheck,
    PieChart as PieIcon,
    Clock,
    ShieldCheck,
    PencilLine,
    Trash2,
    Plus,
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { toast } from "@/shared/utils/toast"

interface Receivable {
    id: number
    client: string
    amount: number
    dueDate: string
    status: 'Overdue' | 'Due'
    invoice: string
}

const METRICS_BY_PERIOD = {
    "current-month": [
        { key: "revenue", title: "Recognized Revenue", value: "$847.5k", change: "+12.5%", trend: "up", icon: DollarSign, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50", path: "/client-management/finance/recognition" },
        { key: "expenses", title: "Operating Expenses", value: "$324.2k", change: "+8.3%", trend: "up", icon: Wallet, bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-200/50", path: "/client-management/finance/expenses" },
        { key: "profit", title: "Net Gross Profit", value: "$523.3k", change: "+15.2%", trend: "up", icon: TrendingUp, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50", path: "/client-management/finance/reports" },
        { key: "cash", title: "Cash Reserves", value: "$2.42m", change: "+6.8%", trend: "up", icon: ShieldCheck, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/50", path: "/client-management/finance/accounting" }
    ],
    "last-month": [
        { key: "revenue", title: "Recognized Revenue", value: "$792.1k", change: "+4.2%", trend: "up", icon: DollarSign, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50", path: "/client-management/finance/recognition" },
        { key: "expenses", title: "Operating Expenses", value: "$310.5k", change: "-2.1%", trend: "down", icon: Wallet, bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-200/50", path: "/client-management/finance/expenses" },
        { key: "profit", title: "Net Gross Profit", value: "$481.6k", change: "+10.5%", trend: "up", icon: TrendingUp, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50", path: "/client-management/finance/reports" },
        { key: "cash", title: "Cash Reserves", value: "$2.15m", change: "+3.4%", trend: "up", icon: ShieldCheck, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/50", path: "/client-management/finance/accounting" }
    ],
    "quarter": [
        { key: "revenue", title: "Recognized Revenue", value: "$2.48m", change: "+22.5%", trend: "up", icon: DollarSign, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50", path: "/client-management/finance/recognition" },
        { key: "expenses", title: "Operating Expenses", value: "$945.8k", change: "+15.3%", trend: "up", icon: Wallet, bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-200/50", path: "/client-management/finance/expenses" },
        { key: "profit", title: "Net Gross Profit", value: "$1.53m", change: "+28.2%", trend: "up", icon: TrendingUp, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50", path: "/client-management/finance/reports" },
        { key: "cash", title: "Cash Reserves", value: "$2.42m", change: "+18.8%", trend: "up", icon: ShieldCheck, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/50", path: "/client-management/finance/accounting" }
    ]
}

const DEFERRED_REVENUE = [
    { month: "Jan 2024", amount: 245000, recognized: 89000, remaining: 156000 },
    { month: "Feb 2024", amount: 267000, recognized: 95000, remaining: 172000 },
    { month: "Mar 2024", amount: 289000, recognized: 102000, remaining: 187000 },
    { month: "Apr 2024", amount: 312000, recognized: 108000, remaining: 204000 }
]

const INITIAL_RECEIVABLES: Receivable[] = [
    { id: 1, client: "Acme Corp", amount: 125000, dueDate: "2024-10-12", status: "Overdue", invoice: "INV-2024-001" },
    { id: 2, client: "TechStart Inc", amount: 48000, dueDate: "2024-10-18", status: "Due", invoice: "INV-2024-002" },
    { id: 3, client: "Global Solutions", amount: 189000, dueDate: "2024-10-22", status: "Due", invoice: "INV-2024-003" }
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

export default function FinanceOverview() {
    const router = useRouter()
    const [dateRange, setDateRange] = useState("current-month")
    const [receivables, setReceivables] = useState<Receivable[]>(INITIAL_RECEIVABLES)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [selected, setSelected] = useState<Receivable | null>(null)

    const [form, setForm] = useState({ client: "", invoice: "", amount: "", dueDate: "", status: "Due" as Receivable['status'] })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
    const activeMetrics = useMemo(() => METRICS_BY_PERIOD[dateRange as keyof typeof METRICS_BY_PERIOD], [dateRange])

    const setField = (f: string, v: any) => {
        setForm(prev => ({ ...prev, [f]: v }))
        if (errors[f]) setErrors(prev => { const c = { ...prev }; delete c[f]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.invoice = validators.required(form.invoice)
        errs.amount = validators.required(form.amount) || validators.number(form.amount)
        errs.dueDate = validators.required(form.dueDate) || validators.date(form.dueDate)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", invoice: "", amount: "", dueDate: "", status: "Due" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (r: Receivable) => {
        setEditingId(r.id)
        setForm({ client: r.client, invoice: r.invoice, amount: String(r.amount), dueDate: r.dueDate, status: r.status })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: Receivable = {
            id: editingId || Date.now(),
            client: form.client.trim(),
            invoice: form.invoice.trim(),
            amount: Number(form.amount),
            dueDate: form.dueDate,
            status: form.status,
        }
        if (editingId) {
            setReceivables(receivables.map(r => r.id === editingId ? data : r))
            toast.success("Receivable updated")
        } else {
            setReceivables([data, ...receivables])
            toast.success("Receivable created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setReceivables(receivables.filter(r => r.id !== id))
        toast.success("Receivable removed")
    }

    const openDetail = (r: Receivable) => {
        setSelected(r)
        setIsDetailOpen(true)
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Finance <span className="text-indigo-600">Overview</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Real-time fiscal monitoring and enterprise-grade ledger control</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-44 h-11 rounded-none border-slate-200 bg-white font-semibold shadow-sm text-slate-700">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-slate-200">
                            <SelectItem value="current-month" className="font-medium text-slate-700">Current Month</SelectItem>
                            <SelectItem value="last-month" className="font-medium text-slate-700">Last Month</SelectItem>
                            <SelectItem value="quarter" className="font-medium text-slate-700">This Quarter</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => toast.success("Financial ledger refreshed")}>
                        <RefreshCw className="w-4 h-4 text-slate-400" /> Sync
                    </Button>
                    <Button className="h-11 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={() => toast.success("Fiscal report exported successfully")}>
                        <Download className="w-4 h-4" /> Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeMetrics.map((metric, i) => (
                    <Card
                        key={i}
                        className={`${metric.bg} ${metric.border} border shadow-sm hover:shadow-md transition-all rounded-none overflow-hidden group cursor-pointer`}
                        onClick={() => router.push(metric.path)}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-12 w-12 rounded-none flex items-center justify-center shadow-sm ${metric.iconBg} ${metric.iconColor}`}>
                                    <metric.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-none ${metric.trend === 'up' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-rose-100/50 text-rose-700'}`}>
                                    {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {metric.change}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{metric.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-none h-14 w-fit shadow-sm">
                    <TabsTrigger value="dashboard" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Fiscal Dashboard</TabsTrigger>
                    <TabsTrigger value="outstanding" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Outstanding Receivables</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                            <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-slate-900">Revenue Recognition Stream</CardTitle>
                                <Button variant="ghost" className="rounded-none text-indigo-600 text-xs font-semibold" onClick={() => router.push('/client-management/finance/recognition')}>
                                    Open <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                {DEFERRED_REVENUE.map((data, idx) => (
                                    <div key={idx} className="space-y-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 transition" onClick={() => router.push('/client-management/finance/recognition')}>
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <h4 className="text-md font-semibold text-slate-900">{data.month}</h4>
                                                <p className="text-[12px] font-medium text-slate-400">Total Liability: {fmt(data.amount)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-semibold text-emerald-600">{fmt(data.recognized)}</span>
                                                <span className="text-xs text-slate-400 font-medium ml-2">Recognized</span>
                                            </div>
                                        </div>
                                        <Progress value={(data.recognized / data.amount) * 100} className="h-2 bg-slate-100 rounded-none" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white border-0">
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-semibold tracking-tight">Net Cash Flow Pulse</h4>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">System-calculated delta between all inflows and organizational burn.</p>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-none border border-white/10 hover:bg-white/10 transition-all cursor-pointer" onClick={() => router.push('/client-management/finance/accounting')}>
                                            <span className="text-xs font-semibold text-slate-300">Inflow Ops</span>
                                            <span className="text-sm font-semibold text-emerald-400">+$485k</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-none border border-white/10 hover:bg-white/10 transition-all cursor-pointer" onClick={() => router.push('/client-management/finance/expenses')}>
                                            <span className="text-xs font-semibold text-slate-300">Investing</span>
                                            <span className="text-sm font-semibold text-rose-400">-$125k</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[12px] font-medium text-slate-500">Net Delta</p>
                                            <p className="text-2xl font-semibold text-white">+$360.5k</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="outstanding">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                            <CardHeader className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Receivables Ageing
                                </CardTitle>
                                <Button className="h-9 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 gap-2" onClick={openCreate}>
                                    <Plus className="h-3.5 w-3.5" /> Add
                                </Button>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {receivables.length > 0 ? receivables.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex items-center justify-between hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer"
                                        onClick={() => openDetail(item)}
                                    >
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{item.client}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-none border-0 ${item.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-6 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Due: {item.dueDate}</span>
                                                <span className="flex items-center gap-1.5"><SearchCheck className="w-3.5 h-3.5" /> Id: {item.invoice}</span>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1" onClick={(e) => e.stopPropagation()}>
                                            <p className="text-lg font-semibold text-slate-900 tracking-tight">{fmt(item.amount)}</p>
                                            <div className="flex items-center gap-1 justify-end">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openEdit(item)}><PencilLine className="w-3.5 h-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-400 hover:text-rose-600" onClick={() => handleDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-sm text-slate-500">No outstanding receivables.</div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100 cursor-pointer hover:shadow-2xl transition" onClick={() => router.push('/client-management/finance/expenses')}>
                                <CardContent className="p-8 space-y-6">
                                    <div className="h-12 w-12 rounded-none bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                        <PieIcon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-slate-900 tracking-tight">Global Liability Mix</h4>
                                    <div className="space-y-5">
                                        {[
                                            { label: "Infrastructure", value: 45, color: "bg-indigo-500" },
                                            { label: "Operating Labor", value: 32, color: "bg-violet-500" },
                                            { label: "Marketing Burn", value: 23, color: "bg-emerald-500" }
                                        ].map((cat, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-[12px] font-medium text-slate-500">
                                                    <span>{cat.label}</span>
                                                    <span>{cat.value}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                                                    <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
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

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Receivable" : "New Receivable"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track an outstanding customer balance.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client <span className="text-rose-500">*</span></Label>
                            <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., Acme Corp" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Invoice # <span className="text-rose-500">*</span></Label>
                            <Input value={form.invoice} onChange={e => setField("invoice", e.target.value)} placeholder="INV-2024-001" className={`h-10 rounded-none ${errors.invoice ? "border-rose-500" : ""}`} />
                            {errors.invoice && <p className="text-[11px] text-rose-500">{errors.invoice}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Amount ($) <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={form.amount} onChange={e => setField("amount", e.target.value)} placeholder="125000" className={`h-10 rounded-none ${errors.amount ? "border-rose-500" : ""}`} />
                                {errors.amount && <p className="text-[11px] text-rose-500">{errors.amount}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Due">Due</SelectItem>
                                        <SelectItem value="Overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Due Date <span className="text-rose-500">*</span></Label>
                            <Input type="date" value={form.dueDate} onChange={e => setField("dueDate", e.target.value)} className={`h-10 rounded-none ${errors.dueDate ? "border-rose-500" : ""}`} />
                            {errors.dueDate && <p className="text-[11px] text-rose-500">{errors.dueDate}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save Changes" : "Create"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Receivable Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Client</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.client}</p>
                                    <p className="text-sm text-indigo-600 font-semibold">{selected.invoice}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Amount</p><p className="font-semibold text-slate-900">{fmt(selected.amount)}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p><Badge className={`rounded-none ${selected.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'} border-0`}>{selected.status}</Badge></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Due Date</p><p className="font-semibold text-slate-900">{selected.dueDate}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
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
