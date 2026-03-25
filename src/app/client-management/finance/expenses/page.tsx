"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Filter,
    Download,
    Edit,
    Trash2,
    Eye,
    Receipt,
    CreditCard,
    CheckCircle,
    Clock,
    RefreshCw,
    XCircle,
    ArrowUpRight,
    SearchCheck,
    PieChart as PieIcon,
    Wallet,
    Calendar,
    ChevronDown,
    FileText
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const INITIAL_EXPENSES = [
    { id: "EXP-001", vendor: "AWS Infrastructure", category: "Cloud", amount: 15400, date: "Oct 01, 2024", status: "Approved", desc: "Monthly scalable instances settlement" },
    { id: "EXP-002", vendor: "Slack Technologies", category: "SaaS", amount: 2400, date: "Oct 04, 2024", status: "Pending", desc: "Enterprise plan annual renewal" },
    { id: "EXP-003", vendor: "Marketing Agency X", category: "Growth", amount: 12500, date: "Oct 05, 2024", status: "Rejected", desc: "Ad-hoc campaign management fee" }
]

const CATEGORIES = [
    { name: "Cloud Infrastructure", budget: 50000, spent: 35000 },
    { name: "SaaS & Operations", budget: 30000, spent: 12000 },
    { name: "Growth & Marketing", budget: 100000, spent: 85000 }
]

export default function Expenses() {
    const [searchQuery, setSearchQuery] = useState("")
    const [expenses, setExpenses] = useState(INITIAL_EXPENSES)
    const [isCreateExpenseOpen, setIsCreateExpenseOpen] = useState(false)
    const [newExpense, setNewExpense] = useState({ vendor: '', category: 'SaaS', amount: '', desc: '' })
    const [selectedExpense, setSelectedExpense] = useState<any>(null)

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Synchronizing expense records...',
            success: msg,
            error: 'Failed to update records'
        })
    }

    const handleCreateExpense = () => {
        if (!newExpense.vendor || !newExpense.amount) {
            toast.error("Please fill in required fields")
            return
        }
        const expense = {
            id: `EXP-00${expenses.length + 1}`,
            vendor: newExpense.vendor,
            category: newExpense.category,
            amount: parseFloat(newExpense.amount),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'Pending',
            desc: newExpense.desc
        }
        setExpenses([expense, ...expenses])
        setIsCreateExpenseOpen(false)
        setNewExpense({ vendor: '', category: 'SaaS', amount: '', desc: '' })
        toast.success("Expense logged successfully")
    }

    const handleApprove = (id: string) => {
        setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status: 'Approved' } : exp))
        toast.success(`Expense ${id} approved`)
    }

    const handleReject = (id: string) => {
        setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status: 'Rejected' } : exp))
        toast.error(`Expense ${id} rejected`)
    }

    const handleDelete = (id: string) => {
        setExpenses(expenses.filter(exp => exp.id !== id))
        toast.success(`Record ${id} removed`)
    }

    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp =>
            exp.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [expenses, searchQuery])

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Expense <span className="text-indigo-600">Architect</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Monitor organizational burn, manage approvals, and optimize fiscal categories</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => handleAction("Expense auditing report generated")}>
                        <FileText className="w-4 h-4 text-slate-400" /> Audit Logs
                    </Button>
                    <Dialog open={isCreateExpenseOpen} onOpenChange={setIsCreateExpenseOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> Log Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Log <span className="text-indigo-600">Expense</span></DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Vendor Name</Label>
                                    <Input value={newExpense.vendor} onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })} placeholder="e.g. AWS" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Amount (USD)</Label>
                                    <Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} placeholder="1250" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Category</Label>
                                    <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold shadow-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Cloud">Cloud Infrastructure</SelectItem>
                                            <SelectItem value="SaaS">SaaS & Operations</SelectItem>
                                            <SelectItem value="Growth">Growth & Marketing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20" onClick={handleCreateExpense}>Submit Request</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Burn (Mtd)", value: "$324.2k", change: "+8.3%", trend: "up", icon: Wallet, color: "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100/50 text-rose-600" },
                    { label: "Pending Approval", value: "12 Assets", change: "+3", trend: "up", icon: Clock, color: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100/50 text-amber-600" },
                    { label: "Rejected Requests", value: "05 Assets", icon: XCircle, color: "bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-100/50 text-slate-600" },
                    { label: "Budget Efficiency", value: "84.2%", icon: CheckCircle, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600" }
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.color} p-6 rounded-3xl border shadow-sm group hover:shadow-md transition-all`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-current opacity-20">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && (
                                <Badge variant="outline" className="font-semibold text-[10px] bg-white border-emerald-100 text-emerald-600 tracking-tight">{stat.change} ↑</Badge>
                            )}
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="list" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-14 w-fit shadow-sm">
                    <TabsTrigger value="list" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Expense Register</TabsTrigger>
                    <TabsTrigger value="budget" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Budget Allocation</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Expense Audit Register</CardTitle>
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                                <Input
                                    placeholder="Search vendor or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4 text-slate-900">
                            {filteredExpenses.map((exp, idx) => (
                                <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group">
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                            <Receipt className="w-7 h-7 text-indigo-600 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-semibold group-hover:text-indigo-600 transition-colors tracking-tight text-slate-900">{exp.vendor}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${exp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    exp.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-rose-100 text-rose-700'
                                                    }`}>{exp.status}</Badge>
                                                <Badge variant="outline" className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 border-slate-200 text-slate-400">{exp.category}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Logged: {exp.date}</span>
                                                <span className="flex items-center gap-1.5"><SearchCheck className="w-3 h-3" /> Transaction: {exp.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 ml-auto lg:ml-0">
                                        <div className="text-right">
                                            <p className="text-xl font-semibold text-slate-900 tracking-tight">{fmt(exp.amount)}</p>
                                            <p className="text-[10px] font-medium text-slate-400">Gross Settlement</p>
                                        </div>
                                        <div className="flex items-center gap-2 border-l border-slate-200 pl-6 shrink-0 text-slate-900">
                                            {exp.status === 'Pending' ? (
                                                <>
                                                    <Button size="sm" className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold" onClick={() => handleApprove(exp.id)}>Approve</Button>
                                                    <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl border-rose-200 text-rose-600 font-semibold hover:bg-rose-50" onClick={() => handleReject(exp.id)}>Reject</Button>
                                                </>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600" onClick={() => setSelectedExpense(exp)}><Eye className="w-4 h-4" /></Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600" onClick={() => handleDelete(exp.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="budget">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-900">
                        {CATEGORIES.map((cat, i) => (
                            <Card key={i} className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-6 hover:shadow-2xl transition-all bg-white border border-slate-100 group">
                                <div className="flex items-center justify-between">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <PieIcon className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                                    </div>
                                    <Badge className="bg-slate-100 text-slate-500 font-semibold text-[10px] border-0">{Math.round((cat.spent / cat.budget) * 100)}% Burned</Badge>
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
                                    <Progress value={(cat.spent / cat.budget) * 100} className="h-2 bg-slate-100 rounded-full overflow-hidden" />
                                    <div className="flex justify-between text-[11px] font-medium text-slate-400">
                                        <span>Total Vault: {fmt(cat.budget)}</span>
                                        <span>Delta: {fmt(cat.budget - cat.spent)}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* View Expense Modal */}
            <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Expense <span className="text-indigo-600">Audit</span></DialogTitle>
                    </DialogHeader>
                    {selectedExpense && (
                        <div className="space-y-6 py-4 text-slate-900">
                            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaction ID</p>
                                    <p className="text-xl font-bold text-indigo-600">{selectedExpense.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Amount</p>
                                    <p className="text-xl font-bold text-slate-900">{fmt(selectedExpense.amount)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-400">Vendor</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedExpense.vendor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-400">Status</p>
                                    <Badge className={`text-[10px] font-bold border-0 ${selectedExpense.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                        selectedExpense.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-rose-100 text-rose-700'
                                        }`}>{selectedExpense.status}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-400">Category</p>
                                    <Badge variant="outline" className="text-[10px] font-bold bg-slate-100 border-slate-200 text-slate-500">{selectedExpense.category}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-400">Logged Date</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedExpense.date}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-400">Narrative Description</p>
                                <p className="text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{selectedExpense.desc || 'No additional narrative provided for this structural burn.'}"</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
