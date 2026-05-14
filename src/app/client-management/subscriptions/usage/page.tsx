"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Zap, Database, Activity, TrendingUp, Cpu, Network, Search, MoreVertical, Clock, AlertCircle,
    ArrowRight, Plus, Trash2, PencilLine,
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { toast } from "@/shared/utils/toast"

const usageTrend = [
    { name: '01 Sep', consumption: 45000 },
    { name: '05 Sep', consumption: 52000 },
    { name: '10 Sep', consumption: 48000 },
    { name: '15 Sep', consumption: 61000 },
    { name: '20 Sep', consumption: 75000 },
    { name: '25 Sep', consumption: 82000 },
    { name: '30 Sep', consumption: 94000 },
]

interface UsageRecord {
    id: number
    client: string
    metric: string
    current: string
    limit: string
    overflow: string
    revenue: string
    status: 'Stable' | 'Warning' | 'Critical'
    progress: number
}

const initial: UsageRecord[] = [
    { id: 1, client: 'SpaceX', metric: 'API Requests', current: '12.4M', limit: '15M', overflow: '0', revenue: '$4,250', status: 'Stable', progress: 82 },
    { id: 2, client: 'Tesla Inc', metric: 'Data Storage', current: '8.2 TB', limit: '10 TB', overflow: '0', revenue: '$1,800', status: 'Stable', progress: 82 },
    { id: 3, client: 'Adobe', metric: 'Compute Units', current: '42k', limit: '35k', overflow: '7k', revenue: '$540+', status: 'Critical', progress: 120 },
    { id: 4, client: 'Netflix', metric: 'Network BW', current: '984 TB', limit: '1 PB', overflow: '0', revenue: '$12,800', status: 'Warning', progress: 96 },
]

const validators = {
    required: (v: string) => !v || !v.trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function UsageBilling() {
    const router = useRouter()
    const [records, setRecords] = React.useState<UsageRecord[]>(initial)
    const [search, setSearch] = React.useState("")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<UsageRecord | null>(null)

    const [form, setForm] = React.useState({ client: "", metric: "API Requests", current: "", limit: "", revenue: "", status: "Stable" as UsageRecord['status'] })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const filtered = React.useMemo(() => {
        return records.filter(r => !search || r.client.toLowerCase().includes(search.toLowerCase()) || r.metric.toLowerCase().includes(search.toLowerCase()))
    }, [records, search])

    const setField = (f: string, v: any) => {
        setForm(p => ({ ...p, [f]: v }))
        if (errors[f]) setErrors(p => { const c = { ...p }; delete c[f]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.metric = validators.required(form.metric)
        errs.current = validators.required(form.current)
        errs.limit = validators.required(form.limit)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", metric: "API Requests", current: "", limit: "", revenue: "", status: "Stable" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (r: UsageRecord) => {
        setEditingId(r.id)
        setForm({ client: r.client, metric: r.metric, current: r.current, limit: r.limit, revenue: r.revenue, status: r.status })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: UsageRecord = {
            id: editingId || Date.now(),
            client: form.client.trim(), metric: form.metric, current: form.current.trim(),
            limit: form.limit.trim(), overflow: '0',
            revenue: form.revenue.startsWith("$") ? form.revenue : (form.revenue ? `$${form.revenue}` : "$0"),
            status: form.status, progress: form.status === 'Critical' ? 105 : form.status === 'Warning' ? 90 : 60,
        }
        if (editingId) { setRecords(records.map(r => r.id === editingId ? data : r)); toast.success("Record updated") }
        else { setRecords([data, ...records]); toast.success("Record added") }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => { setRecords(records.filter(r => r.id !== id)); toast.success("Record removed") }
    const openDetail = (r: UsageRecord) => { setSelected(r); setIsDetailOpen(true) }

    const kpis = [
        { title: "Global API Velocity", value: "842", unit: "req/sec", icon: Activity, color: "indigo", trend: "+12%", path: "/client-management/analytics/revenue" },
        { title: "Total Data Flux", value: "1.2", unit: "PB", icon: Database, color: "violet", trend: "+5.4%", path: "/client-management/integrations/data-sync" },
        { title: "Compute Grid Usage", value: "94.2", unit: "%", icon: Cpu, color: "amber", trend: "+2.1%", path: "/client-management/integrations/api" },
        { title: "Avg Latency", value: "42", unit: "ms", icon: Network, color: "emerald", trend: "-8%", path: "/client-management/support/sla" },
    ]
    const cm: Record<string, string> = { indigo: "bg-indigo-50 text-indigo-600", violet: "bg-violet-50 text-violet-600", amber: "bg-amber-50 text-amber-600", emerald: "bg-emerald-50 text-emerald-600" }

    return (
        <div className="space-y-6 pb-10">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-none bg-orange-100 flex items-center justify-center"><Zap size={14} className="text-orange-600" /></div>
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Real-time Metering</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Usage <span className="text-orange-600">Billing Engine</span></h1>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl">Track metered consumption across API, storage and compute resources.</p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-none h-10" onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" />New Meter
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => {
                    const Icon = k.icon
                    return (
                        <Card key={i} className="rounded-none cursor-pointer hover:shadow-md hover:border-indigo-100 transition" onClick={() => router.push(k.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`h-9 w-9 rounded-none flex items-center justify-center ${cm[k.color]}`}><Icon size={18} /></div>
                                    <Badge className="rounded-none bg-emerald-50 text-emerald-600 hover:bg-emerald-50 text-[10px]"><TrendingUp size={10} className="mr-1" />{k.trend}</Badge>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{k.value} <span className="text-sm font-bold text-slate-400">{k.unit}</span></h3>
                                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{k.title}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-none">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Platform Consumption Trend</CardTitle>
                            <p className="text-xs text-slate-500">Aggregated utilization across all clusters</p>
                        </div>
                        <Badge className="rounded-none bg-emerald-50 text-emerald-600 hover:bg-emerald-50 text-[10px]">REAL-TIME SYNC</Badge>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={usageTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                                <Tooltip />
                                <Line type="monotone" dataKey="consumption" stroke="#ec4899" strokeWidth={3} dot={{ r: 5, fill: '#ec4899' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-none border-rose-100 bg-rose-50/20 cursor-pointer hover:shadow-md transition" onClick={() => toast.success("Opening overage mitigation tool")}>
                        <CardContent className="p-5 flex flex-col items-center text-center">
                            <div className="h-14 w-14 rounded-none bg-rose-100 flex items-center justify-center text-rose-600 mb-3"><AlertCircle size={28} /></div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Overage Alerts</h3>
                            <p className="text-xs text-slate-500 mt-2">4 enterprise accounts exceeded soft-limits in last 24h.</p>
                            <Button className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white rounded-none text-xs font-bold uppercase tracking-widest">Mitigate <ArrowRight className="h-4 w-4 ml-2" /></Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">Recent Usage Spikes <Clock size={14} className="text-slate-300" /></CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { client: 'Adobe', spike: '+420%', time: '2h ago' },
                                { client: 'Swift Apps', spike: '+85%', time: '5h ago' },
                                { client: 'Netflix', spike: '+12%', time: '12h ago' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 -m-2 transition" onClick={() => toast(`${s.client} spike: ${s.spike}`)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-rose-500" />
                                        <span className="text-[11px] font-bold text-slate-800 uppercase">{s.client}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-rose-600">{s.spike}</span>
                                        <span className="text-[10px] font-medium text-slate-400">{s.time}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="rounded-none">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">Metered Accounts Overview</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-none h-9 w-64" />
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/30 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-3">Account</th>
                                <th className="px-6 py-3">Metric</th>
                                <th className="px-6 py-3">Current</th>
                                <th className="px-6 py-3">Quota</th>
                                <th className="px-6 py-3">Revenue</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length > 0 ? filtered.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => openDetail(u)}>
                                    <td className="px-6 py-4 font-bold text-sm text-slate-900">{u.client}</td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">{u.metric}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{u.current}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 w-24 bg-slate-100 overflow-hidden">
                                                <div className={`h-full ${u.status === 'Critical' ? 'bg-rose-500' : u.status === 'Warning' ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, u.progress)}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">/ {u.limit}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{u.revenue}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase ${u.status === 'Stable' ? "bg-emerald-50 text-emerald-600" : u.status === 'Warning' ? "bg-orange-50 text-orange-600" : "bg-rose-50 text-rose-600"}`}>{u.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-none"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none">
                                                <DropdownMenuItem onClick={() => openEdit(u)}><PencilLine className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-500" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">No metered accounts found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-orange-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingId ? "Edit Meter" : "New Meter"}</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client <span className="text-rose-500">*</span></Label>
                            <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., SpaceX" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Metric</Label>
                            <Select value={form.metric} onValueChange={v => setField("metric", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="API Requests">API Requests</SelectItem>
                                    <SelectItem value="Data Storage">Data Storage</SelectItem>
                                    <SelectItem value="Compute Units">Compute Units</SelectItem>
                                    <SelectItem value="Network BW">Network BW</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Current <span className="text-rose-500">*</span></Label>
                                <Input value={form.current} onChange={e => setField("current", e.target.value)} placeholder="12.4M" className={`h-10 rounded-none ${errors.current ? "border-rose-500" : ""}`} />
                                {errors.current && <p className="text-[11px] text-rose-500">{errors.current}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Limit <span className="text-rose-500">*</span></Label>
                                <Input value={form.limit} onChange={e => setField("limit", e.target.value)} placeholder="15M" className={`h-10 rounded-none ${errors.limit ? "border-rose-500" : ""}`} />
                                {errors.limit && <p className="text-[11px] text-rose-500">{errors.limit}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Revenue</Label>
                                <Input value={form.revenue} onChange={e => setField("revenue", e.target.value)} placeholder="$4,250" className="h-10 rounded-none" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Stable">Stable</SelectItem>
                                        <SelectItem value="Warning">Warning</SelectItem>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save" : "Add"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-orange-50">
                        <SheetTitle className="text-[18px] font-semibold">Usage Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p><p className="text-lg font-semibold text-slate-900">{selected.client}</p></div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Metric</p><p className="font-semibold text-slate-900">{selected.metric}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded-none text-[10px] font-bold uppercase ${selected.status === 'Stable' ? "bg-emerald-50 text-emerald-600" : selected.status === 'Warning' ? "bg-orange-50 text-orange-600" : "bg-rose-50 text-rose-600"}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Current</p><p className="font-semibold text-slate-900">{selected.current}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Limit</p><p className="font-semibold text-slate-900">{selected.limit}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Overflow</p><p className="font-semibold text-slate-900">{selected.overflow}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Revenue</p><p className="font-semibold text-emerald-600">{selected.revenue}</p></div>
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
