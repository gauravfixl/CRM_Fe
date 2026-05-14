"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from "next/navigation"
import {
    Search,
    Plus,
    Trash2,
    Eye,
    Receipt,
    CheckCircle,
    Clock,
    XCircle,
    SearchCheck,
    PieChart as PieIcon,
    Wallet,
    Calendar,
    FileText,
    PencilLine,
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { Progress } from "@/shared/components/ui/progress"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/utils/toast"

interface Expense {
    id: string
    vendor: string
    category: 'Cloud' | 'SaaS' | 'Growth'
    amount: number
    date: string
    status: 'Approved' | 'Pending' | 'Rejected'
    desc: string
}

const INITIAL_EXPENSES: Expense[] = [
    { id: "EXP-001", vendor: "AWS Infrastructure", category: "Cloud", amount: 15400, date: "2024-10-01", status: "Approved", desc: "Monthly scalable instances settlement" },
    { id: "EXP-002", vendor: "Slack Technologies", category: "SaaS", amount: 2400, date: "2024-10-04", status: "Pending", desc: "Enterprise plan annual renewal" },
    { id: "EXP-003", vendor: "Marketing Agency X", category: "Growth", amount: 12500, date: "2024-10-05", status: "Rejected", desc: "Ad-hoc campaign management fee" }
]

const CATEGORIES = [
    { name: "Cloud Infrastructure", budget: 50000, spent: 35000 },
    { name: "SaaS & Operations", budget: 30000, spent: 12000 },
    { name: "Growth & Marketing", budget: 100000, spent: 85000 }
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) <= 0 ? "Must be positive" : "",
    money: (v: string) => v && !/^\$?[\d,]+(\.\d{1,2})?$/.test(v.trim()) ? "Enter a valid amount" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

export default function Expenses() {
    const router = useRouter()
    const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [selected, setSelected] = useState<Expense | null>(null)

    const [form, setForm] = useState<{ vendor: string; category: Expense['category']; amount: string; date: string; status: Expense['status']; desc: string }>({
        vendor: "", category: "SaaS", amount: "", date: "", status: "Pending", desc: ""
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const setField = (f: string, v: any) => {
        setForm(p => ({ ...p, [f]: v }))
        if (errors[f]) setErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validate = () => {
        const errs: Record<string, string> = {}
        errs.vendor = validators.required(form.vendor) || validators.minLen(2)(form.vendor)
        errs.amount = validators.required(form.amount) || validators.number(form.amount)
        errs.date = validators.required(form.date) || validators.date(form.date)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreate = () => {
        setEditingId(null)
        setForm({ vendor: "", category: "SaaS", amount: "", date: "", status: "Pending", desc: "" })
        setErrors({})
        setIsFormOpen(true)
    }
    const openEdit = (e: Expense) => {
        setEditingId(e.id)
        setForm({ vendor: e.vendor, category: e.category, amount: String(e.amount), date: e.date, status: e.status, desc: e.desc })
        setErrors({})
        setIsFormOpen(true)
    }
    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setExpenses(expenses.map(e => e.id === editingId ? { ...e, vendor: form.vendor.trim(), category: form.category, amount: Number(form.amount), date: form.date, status: form.status, desc: form.desc.trim() } : e))
            toast.success("Expense updated")
        } else {
            const id = `EXP-${String(expenses.length + 1).padStart(3, '0')}`
            const expense: Expense = {
                id, vendor: form.vendor.trim(), category: form.category,
                amount: Number(form.amount), date: form.date, status: form.status, desc: form.desc.trim()
            }
            setExpenses([expense, ...expenses])
            toast.success("Expense logged successfully")
        }
        setIsFormOpen(false)
    }
    const handleApprove = (id: string) => {
        setExpenses(expenses.map(e => e.id === id ? { ...e, status: 'Approved' as const } : e))
        toast.success(`Expense ${id} approved`)
    }
    const handleReject = (id: string) => {
        setExpenses(expenses.map(e => e.id === id ? { ...e, status: 'Rejected' as const } : e))
        toast.success(`Expense ${id} rejected`)
    }
    const handleDelete = (id: string) => {
        setExpenses(expenses.filter(e => e.id !== id))
        toast.success(`Record ${id} removed`)
    }
    const openDetail = (e: Expense) => {
        setSelected(e)
        setIsDetailOpen(true)
    }

    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => {
            const matchSearch = !searchQuery || e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.toLowerCase().includes(searchQuery.toLowerCase())
            const matchStatus = statusFilter === "all" || e.status === statusFilter
            return matchSearch && matchStatus
        })
    }, [expenses, searchQuery, statusFilter])

    const totalBurn = useMemo(() => expenses.filter(e => e.status === 'Approved').reduce((s, e) => s + e.amount, 0), [expenses])
    const pendingCount = useMemo(() => expenses.filter(e => e.status === 'Pending').length, [expenses])
    const rejectedCount = useMemo(() => expenses.filter(e => e.status === 'Rejected').length, [expenses])

    const kpis = [
        { label: "Total Burn (MTD)", value: fmt(totalBurn), change: "+8.3%", icon: Wallet, color: "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100/50 text-rose-600", path: "/client-management/finance/overview" },
        { label: "Pending Approval", value: `${pendingCount} Assets`, change: `+${pendingCount}`, icon: Clock, color: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100/50 text-amber-600", path: "/client-management/finance/expenses" },
        { label: "Rejected Requests", value: `${String(rejectedCount).padStart(2, '0')} Assets`, icon: XCircle, color: "bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-100/50 text-slate-600", path: "/client-management/finance/accounting" },
        { label: "Budget Efficiency", value: "84.2%", icon: CheckCircle, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600", path: "/client-management/analytics/forecasting" }
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Expense <span className="text-indigo-600">Architect</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Monitor organizational burn, manage approvals, and optimize fiscal categories</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => toast.success("Expense audit report generated")}>
                        <FileText className="w-4 h-4 text-slate-400" /> Audit Logs
                    </Button>
                    <Button className="h-11 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={openCreate}>
                        <Plus className="w-4 h-4" /> Log Expense
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

            <Tabs defaultValue="list" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-none h-14 w-fit shadow-sm">
                    <TabsTrigger value="list" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Expense Register</TabsTrigger>
                    <TabsTrigger value="budget" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Budget Allocation</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Expense Audit Register</CardTitle>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search vendor or category..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-none text-sm font-medium"
                                    />
                                </div>
                                <Button variant="outline" className="h-11 rounded-none border-slate-200 font-semibold px-4" onClick={() => setIsFilterOpen(true)}>Filter</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4 text-slate-900">
                            {filteredExpenses.length > 0 ? filteredExpenses.map((exp) => (
                                <div
                                    key={exp.id}
                                    className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer"
                                    onClick={() => openDetail(exp)}
                                >
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-14 w-14 rounded-none bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                            <Receipt className="w-7 h-7 text-indigo-600 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h4 className="text-md font-semibold group-hover:text-indigo-600 transition-colors tracking-tight">{exp.vendor}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-none border-0 ${exp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : exp.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{exp.status}</Badge>
                                                <Badge variant="outline" className="text-[10px] font-semibold px-2.5 py-0.5 rounded-none bg-slate-100 border-slate-200 text-slate-500">{exp.category}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {exp.date}</span>
                                                <span className="flex items-center gap-1.5"><SearchCheck className="w-3 h-3" /> {exp.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 ml-auto lg:ml-0" onClick={(e) => e.stopPropagation()}>
                                        <div className="text-right">
                                            <p className="text-xl font-semibold text-slate-900 tracking-tight">{fmt(exp.amount)}</p>
                                            <p className="text-[10px] font-medium text-slate-400">Gross Settlement</p>
                                        </div>
                                        <div className="flex items-center gap-2 border-l border-slate-200 pl-6 shrink-0">
                                            {exp.status === 'Pending' ? (
                                                <>
                                                    <Button size="sm" className="h-9 px-4 rounded-none bg-emerald-600 hover:bg-emerald-700 font-semibold text-white" onClick={() => handleApprove(exp.id)}>Approve</Button>
                                                    <Button size="sm" variant="outline" className="h-9 px-4 rounded-none border-rose-200 text-rose-600 font-semibold hover:bg-rose-50" onClick={() => handleReject(exp.id)}>Reject</Button>
                                                </>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openDetail(exp)}><Eye className="w-4 h-4" /></Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openEdit(exp)}><PencilLine className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-rose-600" onClick={() => handleDelete(exp.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-sm text-slate-500">No expenses match your filters.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="budget">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-900">
                        {CATEGORIES.map((cat, i) => (
                            <Card key={i} className="rounded-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all bg-white border border-slate-100 group cursor-pointer" onClick={() => router.push('/client-management/analytics/forecasting')}>
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="h-12 w-12 rounded-none bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <PieIcon className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                                        </div>
                                        <Badge className="bg-slate-100 text-slate-500 font-semibold text-[10px] border-0 rounded-none">{Math.round((cat.spent / cat.budget) * 100)}% Burned</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-semibold text-slate-900 tracking-tight">{cat.name}</h4>
                                        <p className="text-[11px] font-medium text-slate-400 leading-none">Category Allocation Plan</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-slate-500">Consumed</span>
                                            <span className="text-slate-900">{fmt(cat.spent)}</span>
                                        </div>
                                        <Progress value={(cat.spent / cat.budget) * 100} className="h-2 bg-slate-100 rounded-none overflow-hidden" />
                                        <div className="flex justify-between text-[11px] font-medium text-slate-400">
                                            <span>Total: {fmt(cat.budget)}</span>
                                            <span>Delta: {fmt(cat.budget - cat.spent)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingId ? "Edit Expense" : "Log Expense"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Record a vendor expense.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Vendor Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.vendor} onChange={e => setField("vendor", e.target.value)} placeholder="e.g., AWS" className={`h-10 rounded-none ${errors.vendor ? "border-rose-500" : ""}`} />
                            {errors.vendor && <p className="text-[11px] text-rose-500">{errors.vendor}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Amount ($) <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={form.amount} onChange={e => setField("amount", e.target.value)} placeholder="1250" className={`h-10 rounded-none ${errors.amount ? "border-rose-500" : ""}`} />
                                {errors.amount && <p className="text-[11px] text-rose-500">{errors.amount}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Category</Label>
                                <Select value={form.category} onValueChange={(v: any) => setField("category", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Cloud">Cloud Infrastructure</SelectItem>
                                        <SelectItem value="SaaS">SaaS & Operations</SelectItem>
                                        <SelectItem value="Growth">Growth & Marketing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Date <span className="text-rose-500">*</span></Label>
                                <Input type="date" value={form.date} onChange={e => setField("date", e.target.value)} className={`h-10 rounded-none ${errors.date ? "border-rose-500" : ""}`} />
                                {errors.date && <p className="text-[11px] text-rose-500">{errors.date}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Description</Label>
                            <Textarea value={form.desc} onChange={e => setField("desc", e.target.value)} placeholder="Brief description..." className="min-h-[80px] rounded-none" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save Changes" : "Submit"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Expenses</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStatusFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none text-white" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Expense Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-none border border-slate-100">
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Transaction ID</p>
                                        <p className="text-xl font-bold text-indigo-600">{selected.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Amount</p>
                                        <p className="text-xl font-bold text-slate-900">{fmt(selected.amount)}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Vendor</p><p className="text-sm font-bold text-slate-900">{selected.vendor}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none border-0 ${selected.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : selected.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{selected.status}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Category</p><Badge variant="outline" className="rounded-none">{selected.category}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Date</p><p className="text-sm font-bold text-slate-900">{selected.date}</p></div>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase">Description</p>
                                    <p className="text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-none border border-slate-100 italic">"{selected.desc || 'No description provided.'}"</p>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                {selected.status === 'Pending' && (
                                    <>
                                        <Button className="flex-1 h-10 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { handleApprove(selected.id); setIsDetailOpen(false) }}>Approve</Button>
                                        <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleReject(selected.id); setIsDetailOpen(false) }}>Reject</Button>
                                    </>
                                )}
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
