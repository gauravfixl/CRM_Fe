"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    CreditCard, DollarSign, ArrowUpRight, Search, Filter, MoreVertical, Download, CheckCircle2,
    AlertCircle, ArrowRight, TrendingUp, Plus, Trash2, PencilLine, Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { toast } from "@/shared/utils/toast"

interface Invoice {
    id: string
    client: string
    amount: string
    status: 'Paid' | 'Sent' | 'Past Due' | 'Failed' | 'Draft'
    date: string
    method: string
}

const initial: Invoice[] = [
    { id: 'INV-4201', client: 'Tesla Inc', amount: '$850.00', status: 'Paid', date: 'Sep 30, 2024', method: 'Visa •••• 4242' },
    { id: 'INV-4202', client: 'SpaceX', amount: '$2,450.00', status: 'Sent', date: 'Oct 01, 2024', method: 'Bank Transfer' },
    { id: 'INV-4203', client: 'Adobe', amount: '$850.00', status: 'Past Due', date: 'Sep 15, 2024', method: 'Amex •••• 1005' },
    { id: 'INV-4204', client: 'Netflix', amount: '$4,200.00', status: 'Paid', date: 'Sep 02, 2024', method: 'Visa •••• 8812' },
    { id: 'INV-4205', client: 'Slack', amount: '$120.00', status: 'Failed', date: 'Oct 05, 2024', method: 'Mast. •••• 5521' },
]

const validators = {
    required: (v: string) => !v || !v.trim() ? "This field is required" : "",
    money: (v: string) => v && !/^\$?[\d,]+(\.\d{1,2})?$/.test(v.trim()) ? "Enter a valid amount (e.g., $850.00)" : "",
}

export default function InvoicesPayments() {
    const router = useRouter()
    const [invoices, setInvoices] = React.useState<Invoice[]>(initial)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<Invoice | null>(null)

    const [form, setForm] = React.useState({ client: "", amount: "", status: "Sent" as Invoice['status'], date: "", method: "" })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const filtered = React.useMemo(() => invoices.filter(i => {
        const matchSearch = !search || i.id.toLowerCase().includes(search.toLowerCase()) || i.client.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "all" || i.status === statusFilter
        return matchSearch && matchStatus
    }), [invoices, search, statusFilter])

    const setField = (f: string, v: any) => {
        setForm(p => ({ ...p, [f]: v }))
        if (errors[f]) setErrors(p => { const c = { ...p }; delete c[f]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client)
        errs.amount = validators.required(form.amount) || validators.money(form.amount)
        errs.date = validators.required(form.date)
        errs.method = validators.required(form.method)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", amount: "", status: "Draft", date: "", method: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (i: Invoice) => {
        setEditingId(i.id)
        setForm({ client: i.client, amount: i.amount, status: i.status, date: i.date, method: i.method })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const amount = form.amount.startsWith("$") ? form.amount : `$${form.amount}`
        if (editingId) {
            setInvoices(invoices.map(i => i.id === editingId ? { ...i, client: form.client.trim(), amount, status: form.status, date: form.date, method: form.method.trim() } : i))
            toast.success("Invoice updated")
        } else {
            const newId = `INV-${Math.floor(Math.random() * 9000) + 1000}`
            setInvoices([{ id: newId, client: form.client.trim(), amount, status: form.status, date: form.date, method: form.method.trim() }, ...invoices])
            toast.success("Invoice created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => { setInvoices(invoices.filter(i => i.id !== id)); toast.success("Invoice removed") }
    const openDetail = (i: Invoice) => { setSelected(i); setIsDetailOpen(true) }
    const handleMarkPaid = (id: string) => {
        setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'Paid' as const } : i))
        toast.success("Marked as paid")
    }

    const kpis = [
        { title: "Total Collected (MTD)", value: "$412.5k", icon: CheckCircle2, color: "emerald", trend: "+12.4%", path: "/client-management/finance/overview" },
        { title: "Outstanding Revenue", value: "$42.8k", icon: DollarSign, color: "indigo", trend: "", path: "/client-management/finance/accounting" },
        { title: "Failed Payments", value: "$1,240", icon: AlertCircle, color: "rose", trend: "", path: "/client-management/automation/notifications" },
    ]
    const cm: Record<string, string> = { emerald: "bg-emerald-50 text-emerald-600", indigo: "bg-indigo-50 text-indigo-600", rose: "bg-rose-50 text-rose-600" }

    return (
        <div className="space-y-6 pb-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice <span className="text-slate-500">& Transactions</span></h1>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl">Full ledger of subscription payments, billing adjustments and history.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => toast.success("Financial export started")}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />New Invoice
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpis.map((k, i) => {
                    const Icon = k.icon
                    return (
                        <Card key={i} className="rounded-none cursor-pointer hover:shadow-md transition" onClick={() => router.push(k.path)}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`h-11 w-11 rounded-none flex items-center justify-center ${cm[k.color]}`}><Icon size={22} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{k.title}</p>
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{k.value}</h3>
                                    </div>
                                </div>
                                {k.trend && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                        <TrendingUp size={12} />{k.trend}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-none">
                    <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold uppercase tracking-tight">Financial Ledger</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <Input placeholder="ID or Account..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-none h-9 w-48" />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-none h-9 w-9" onClick={() => setIsFilterOpen(true)}><Filter className="h-4 w-4" /></Button>
                        </div>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-3">Invoice ID</th>
                                    <th className="px-6 py-3">Account</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Method</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.length > 0 ? filtered.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/80 cursor-pointer" onClick={() => openDetail(inv)}>
                                        <td className="px-6 py-4"><span className="text-xs font-bold text-indigo-600 border-b border-indigo-100">{inv.id}</span></td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{inv.client}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{inv.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase border ${
                                                inv.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                inv.status === 'Sent' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                inv.status === 'Past Due' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                inv.status === 'Draft' ? "bg-slate-50 text-slate-600 border-slate-100" :
                                                "bg-rose-50 text-rose-600 border-rose-100"
                                            }`}>{inv.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500">{inv.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                                <CreditCard size={14} />{inv.method}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-none"><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none">
                                                    <DropdownMenuItem onClick={() => openDetail(inv)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEdit(inv)}><PencilLine className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                                    {inv.status !== 'Paid' && <DropdownMenuItem onClick={() => handleMarkPaid(inv.id)}><CheckCircle2 className="h-4 w-4 mr-2" />Mark Paid</DropdownMenuItem>}
                                                    <DropdownMenuItem onClick={() => toast.success("Invoice downloaded")}><Download className="h-4 w-4 mr-2" />Download PDF</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-rose-500" onClick={() => handleDelete(inv.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">No invoices match your filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-none border-indigo-100 bg-indigo-50/20">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Dunning Activity</CardTitle>
                            <ArrowRight size={14} className="text-indigo-400" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="border-l-2 border-indigo-200 pl-4 py-1 cursor-pointer hover:bg-white/50 transition" onClick={() => toast.success("Opening recovery details")}>
                                <p className="text-[11px] font-bold text-slate-900 uppercase">Recovery Initiated</p>
                                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Automated retry for Apple Inc (INV-4182) in progress.</p>
                            </div>
                            <div className="border-l-2 border-emerald-200 pl-4 py-1 cursor-pointer hover:bg-white/50 transition" onClick={() => toast.success("Payment resolved")}>
                                <p className="text-[11px] font-bold text-emerald-600 uppercase">Payment Resolved</p>
                                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Netflix processed outstanding balance of $4,200.</p>
                            </div>
                            <Button variant="outline" className="w-full rounded-none border-indigo-200 text-indigo-600 text-[10px] font-bold uppercase tracking-widest" onClick={() => router.push('/client-management/automation/notifications')}>
                                Manage Dunning Rules
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Tax Sync</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-slate-50 rounded-none border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition" onClick={() => router.push('/client-management/finance/tax')}>
                                <span className="text-[11px] font-bold text-slate-800 uppercase">VAT Verification</span>
                                <div className="h-5 w-10 bg-emerald-100 flex items-center justify-end px-1"><div className="h-3 w-3 bg-emerald-600" /></div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-none border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition" onClick={() => toast.success("Receipt automation active")}>
                                <span className="text-[11px] font-bold text-slate-800 uppercase">Automated Receipts</span>
                                <div className="h-5 w-10 bg-emerald-100 flex items-center justify-end px-1"><div className="h-3 w-3 bg-emerald-600" /></div>
                            </div>
                            <Button variant="ghost" className="rounded-none w-full text-indigo-600 text-[10px] font-bold uppercase tracking-widest" onClick={() => router.push('/client-management/automation/logs')}>
                                Audit Trail <ArrowUpRight className="h-3 w-3 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingId ? "Edit Invoice" : "New Invoice"}</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client <span className="text-rose-500">*</span></Label>
                            <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., Tesla Inc" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Amount <span className="text-rose-500">*</span></Label>
                                <Input value={form.amount} onChange={e => setField("amount", e.target.value)} placeholder="$850.00" className={`h-10 rounded-none ${errors.amount ? "border-rose-500" : ""}`} />
                                {errors.amount && <p className="text-[11px] text-rose-500">{errors.amount}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Sent">Sent</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                        <SelectItem value="Past Due">Past Due</SelectItem>
                                        <SelectItem value="Failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Billing Date <span className="text-rose-500">*</span></Label>
                            <Input value={form.date} onChange={e => setField("date", e.target.value)} placeholder="Sep 30, 2024" className={`h-10 rounded-none ${errors.date ? "border-rose-500" : ""}`} />
                            {errors.date && <p className="text-[11px] text-rose-500">{errors.date}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Payment Method <span className="text-rose-500">*</span></Label>
                            <Input value={form.method} onChange={e => setField("method", e.target.value)} placeholder="Visa •••• 4242" className={`h-10 rounded-none ${errors.method ? "border-rose-500" : ""}`} />
                            {errors.method && <p className="text-[11px] text-rose-500">{errors.method}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save" : "Create"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Invoices</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Sent">Sent</SelectItem>
                                    <SelectItem value="Past Due">Past Due</SelectItem>
                                    <SelectItem value="Failed">Failed</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStatusFilter("all"); toast.success("Reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Invoice Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Invoice ID</p>
                                    <p className="text-lg font-semibold text-indigo-600">{selected.id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Client</p><p className="font-semibold text-slate-900">{selected.client}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Amount</p><p className="font-semibold text-slate-900">{selected.amount}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p><Badge className="rounded-none">{selected.status}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Date</p><p className="font-semibold text-slate-900">{selected.date}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Payment Method</p><p className="font-semibold text-slate-900">{selected.method}</p></div>
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
