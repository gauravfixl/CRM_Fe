"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    CheckCircle2, Search, Filter, MoreVertical, Building2, Calendar, ArrowUpRight, ArrowRight, ArrowDownRight,
    Settings2, Zap, History, Plus, Trash2, PencilLine, Pause, Play,
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

interface Subscription {
    id: number
    client: string
    plan: string
    status: 'Active' | 'Expiring' | 'Inactive' | 'Paused'
    mrr: string
    nextBilling: string
    health: number
}

const initial: Subscription[] = [
    { id: 1, client: 'SpaceX', plan: 'Enterprise', status: 'Active', mrr: '$2,450', nextBilling: 'Oct 15, 2024', health: 88 },
    { id: 2, client: 'Tesla Inc', plan: 'Professional', status: 'Active', mrr: '$850', nextBilling: 'Oct 22, 2024', health: 94 },
    { id: 3, client: 'Adobe', plan: 'Professional', status: 'Expiring', mrr: '$850', nextBilling: 'Oct 10, 2024', health: 42 },
    { id: 4, client: 'Netflix', plan: 'Enterprise+', status: 'Active', mrr: '$4,200', nextBilling: 'Nov 02, 2024', health: 75 },
    { id: 5, client: 'Slack', plan: 'Starter', status: 'Inactive', mrr: '$0', nextBilling: 'Past Due', health: 12 },
]

const healthColor = (h: number) => h >= 70 ? 'text-emerald-500' : h >= 40 ? 'text-amber-500' : 'text-rose-500'
const healthBg = (h: number) => h >= 70 ? 'bg-emerald-500' : h >= 40 ? 'bg-amber-500' : 'bg-rose-500'
const statusBg = (s: Subscription['status']) =>
    s === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
    s === 'Expiring' ? "bg-rose-50 text-rose-600 border-rose-100" :
    s === 'Paused' ? "bg-amber-50 text-amber-600 border-amber-100" :
    "bg-slate-100 text-slate-500 border-slate-200"

const validators = {
    required: (v: string) => !v || !v.trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    money: (v: string) => v && !/^\$?[\d,]+(\.\d{1,2})?$/.test(v.trim()) ? "Enter a valid amount (e.g., $850)" : "",
}

export default function ActiveSubscriptions() {
    const router = useRouter()
    const [subs, setSubs] = React.useState<Subscription[]>(initial)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Subscription | null>(null)

    const [form, setForm] = React.useState({ client: "", plan: "Professional", status: "Active" as Subscription['status'], mrr: "", nextBilling: "", health: "80" })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const filtered = React.useMemo(() => {
        return subs.filter(s => {
            const matchSearch = !search || s.client.toLowerCase().includes(search.toLowerCase()) || s.plan.toLowerCase().includes(search.toLowerCase())
            const matchStatus = statusFilter === "all" || s.status === statusFilter
            return matchSearch && matchStatus
        })
    }, [subs, search, statusFilter])

    const setField = (f: string, v: any) => {
        setForm(p => ({ ...p, [f]: v }))
        if (errors[f]) setErrors(p => { const c = { ...p }; delete c[f]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.plan = validators.required(form.plan)
        errs.mrr = validators.required(form.mrr) || validators.money(form.mrr)
        errs.nextBilling = validators.required(form.nextBilling)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", plan: "Professional", status: "Active", mrr: "", nextBilling: "", health: "80" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (s: Subscription) => {
        setEditingId(s.id)
        setForm({ client: s.client, plan: s.plan, status: s.status, mrr: s.mrr, nextBilling: s.nextBilling, health: String(s.health) })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: Subscription = {
            id: editingId || Date.now(),
            client: form.client.trim(), plan: form.plan, status: form.status,
            mrr: form.mrr.startsWith("$") ? form.mrr : `$${form.mrr}`,
            nextBilling: form.nextBilling, health: Number(form.health),
        }
        if (editingId) { setSubs(subs.map(s => s.id === editingId ? data : s)); toast.success("Subscription updated") }
        else { setSubs([data, ...subs]); toast.success("Subscription added") }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => { setSubs(subs.filter(s => s.id !== id)); toast.success("Subscription cancelled") }
    const handleTogglePause = (id: number) => {
        setSubs(subs.map(s => s.id === id ? { ...s, status: s.status === 'Paused' ? 'Active' : 'Paused' } : s))
        toast.success("Status updated")
    }
    const openDetail = (s: Subscription) => { setSelected(s); setIsDetailOpen(true) }

    const kpis = [
        { title: "Live Accounts", value: String(subs.filter(s => s.status === 'Active').length + subs.filter(s => s.status === 'Expiring').length), icon: CheckCircle2, color: "emerald", path: "/client-management/customers" },
        { title: "Net Expansion", value: "+$12.4k", icon: ArrowUpRight, color: "indigo", path: "/client-management/revenue/expansion" },
        { title: "Renewal Risk", value: "12%", icon: ArrowDownRight, color: "rose", path: "/client-management/revenue/renewals" },
        { title: "Pending Upgrades", value: "8", icon: Zap, color: "amber", path: "/client-management/subscriptions/plans" },
    ]
    const cm: Record<string, string> = { emerald: "bg-emerald-50 text-emerald-600", indigo: "bg-indigo-50 text-indigo-600", rose: "bg-rose-50 text-rose-600", amber: "bg-amber-50 text-amber-600" }

    return (
        <div className="space-y-6 pb-10">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active <span className="text-emerald-600">Subscriptions</span></h1>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl">Real-time lifecycle management of billable accounts.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none h-10" onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" />New Subscription
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {kpis.map((k, i) => {
                    const Icon = k.icon
                    return (
                        <Card key={i} className="rounded-none cursor-pointer hover:shadow-md transition" onClick={() => router.push(k.path)}>
                            <CardContent className="p-5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-3">{k.title}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-slate-900">{k.value}</span>
                                    <div className={`h-9 w-9 rounded-none flex items-center justify-center ${cm[k.color]}`}>
                                        <Icon size={18} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card className="rounded-none">
                <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input placeholder="Search by client or plan..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-none h-9" />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40 rounded-none h-9"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Expiring">Expiring</SelectItem>
                                <SelectItem value="Paused">Paused</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-none h-9 text-[11px]" onClick={() => toast.success("Sorting applied")}>
                            <Filter className="h-3 w-3 mr-1" /> Sort
                        </Button>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-9 text-[11px]" onClick={() => toast.success("Bulk action menu opened")}>
                            <Settings2 className="h-3 w-3 mr-1" /> Bulk
                        </Button>
                    </div>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">MRR</th>
                                <th className="px-6 py-3">Next Invoice</th>
                                <th className="px-6 py-3">Health</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length > 0 ? filtered.map((s) => (
                                <tr key={s.id} className="group hover:bg-slate-50/50 cursor-pointer" onClick={() => openDetail(s)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center"><Building2 className="h-4 w-4 text-emerald-600" /></div>
                                            <div className="text-sm font-bold text-slate-900">{s.client}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2"><div className="h-2 w-2 bg-indigo-500" /><span className="text-[11px] font-bold text-slate-700">{s.plan.toUpperCase()}</span></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase border ${statusBg(s.status)}`}>{s.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{s.mrr}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500"><Calendar size={14} className="text-slate-400" />{s.nextBilling}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1.5 w-16 bg-slate-100 overflow-hidden">
                                                <div className={`h-full ${healthBg(s.health)}`} style={{ width: `${s.health}%` }} />
                                            </div>
                                            <span className={`text-[11px] font-bold ${healthColor(s.health)}`}>{s.health}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-none"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none">
                                                <DropdownMenuItem onClick={() => openEdit(s)}><PencilLine className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTogglePause(s.id)}>
                                                    {s.status === 'Paused' ? <><Play className="h-4 w-4 mr-2" />Resume</> : <><Pause className="h-4 w-4 mr-2" />Pause</>}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push('/client-management/subscriptions/invoices')}><History className="h-4 w-4 mr-2" />View Invoices</DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-500" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 mr-2" />Cancel</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">No subscriptions match your filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top accounts displayed first</p>
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" className="rounded-none text-[11px] font-bold text-indigo-600 uppercase tracking-widest" onClick={() => router.push('/client-management/subscriptions/plans')}>
                            Migration Engine <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                        <Button variant="ghost" className="rounded-none text-[11px] font-bold text-rose-600 uppercase tracking-widest" onClick={() => router.push('/client-management/analytics/retention')}>
                            Churn Recovery <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingId ? "Edit Subscription" : "New Subscription"}</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client <span className="text-rose-500">*</span></Label>
                            <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., SpaceX" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Plan</Label>
                                <Select value={form.plan} onValueChange={v => setField("plan", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Starter">Starter</SelectItem>
                                        <SelectItem value="Professional">Professional</SelectItem>
                                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                                        <SelectItem value="Enterprise+">Enterprise+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Expiring">Expiring</SelectItem>
                                        <SelectItem value="Paused">Paused</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">MRR <span className="text-rose-500">*</span></Label>
                                <Input value={form.mrr} onChange={e => setField("mrr", e.target.value)} placeholder="$850" className={`h-10 rounded-none ${errors.mrr ? "border-rose-500" : ""}`} />
                                {errors.mrr && <p className="text-[11px] text-rose-500">{errors.mrr}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Health (%)</Label>
                                <Input type="number" min="0" max="100" value={form.health} onChange={e => setField("health", e.target.value)} className="h-10 rounded-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Next Billing <span className="text-rose-500">*</span></Label>
                            <Input value={form.nextBilling} onChange={e => setField("nextBilling", e.target.value)} placeholder="e.g., Oct 15, 2024" className={`h-10 rounded-none ${errors.nextBilling ? "border-rose-500" : ""}`} />
                            {errors.nextBilling && <p className="text-[11px] text-rose-500">{errors.nextBilling}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save" : "Add"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Subscription Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Client</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.client}</p>
                                    <p className="text-sm text-slate-500">{selected.plan}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p><span className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-bold uppercase border ${statusBg(selected.status)}`}>{selected.status}</span></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">MRR</p><p className="font-semibold text-slate-900">{selected.mrr}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Next Billing</p><p className="font-semibold text-slate-900">{selected.nextBilling}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Health</p><span className={`font-semibold ${healthColor(selected.health)}`}>{selected.health}%</span></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
