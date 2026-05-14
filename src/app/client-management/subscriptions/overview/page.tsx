"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    CreditCard, Users, UserMinus, ArrowUpRight, TrendingDown, AlertCircle,
    ArrowRight, Plus, Calendar, Filter, Download,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"

const subTrendData = [
    { name: 'Jan', active: 280, churn: 12 },
    { name: 'Feb', active: 310, churn: 8 },
    { name: 'Mar', active: 335, churn: 15 },
    { name: 'Apr', active: 360, churn: 10 },
    { name: 'May', active: 390, churn: 5 },
    { name: 'Jun', active: 420, churn: 7 },
]

const subTypeData = [
    { name: 'Monthly', value: 240, color: '#8b5cf6' },
    { name: 'Annual', value: 180, color: '#c084fc' },
]

const validators = {
    required: (v: string) => !v || !v.trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    email: (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "Enter a valid email" : "",
}

export default function SubscriptionsOverview() {
    const router = useRouter()
    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [form, setForm] = React.useState({ client: "", plan: "Monthly", email: "" })
    const [errors, setErrors] = React.useState<Record<string, string>>({})
    const [period, setPeriod] = React.useState("Last 6 Months")

    const setField = (f: string, v: any) => {
        setForm(p => ({ ...p, [f]: v }))
        if (errors[f]) setErrors(p => { const c = { ...p }; delete c[f]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.email = validators.required(form.email) || validators.email(form.email)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        toast.success(`Subscription added for ${form.client}`)
        setIsAddOpen(false)
        setForm({ client: "", plan: "Monthly", email: "" })
    }

    const kpis = [
        { title: "Active Subscriptions", value: "420", subtext: "Net +32 this month", trend: "+8.5%", isPositive: true, icon: Users, color: "violet", path: "/client-management/subscriptions/active" },
        { title: "Net Revenue Churn", value: "1.42%", subtext: "Industry Avg: < 3%", trend: "-0.2%", isPositive: true, icon: UserMinus, color: "rose", path: "/client-management/analytics/retention" },
        { title: "Expiring (Next 30d)", value: "24", subtext: "Value: $184k", trend: "Needs Review", isPositive: false, icon: AlertCircle, color: "amber", path: "/client-management/subscriptions/contracts" },
        { title: "Failed Payments", value: "$12,450", subtext: "Recoverable via dunning", trend: "4.2% Rate", isPositive: false, icon: CreditCard, color: "indigo", path: "/client-management/subscriptions/invoices" },
    ]

    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
    }

    return (
        <div className="space-y-6 pb-10">
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-purple-500" />
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Global Ops</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subscriptions <span className="text-purple-600">Strategic Overview</span></h1>
                    <p className="text-sm font-medium text-slate-500">Monitor subscription health, churn velocity and MRR movements.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-none px-3 py-1.5 shadow-sm">
                        <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                        <select className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-700 outline-none"
                            value={period} onChange={(e) => { setPeriod(e.target.value); toast.success(`Updated for ${e.target.value}`) }}>
                            <option>Last 6 Months</option><option>Last Quarter</option><option>YTD</option><option>Last Year</option>
                        </select>
                    </div>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => toast.success("Subscription report exported")}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-none h-10" onClick={() => setIsAddOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />New Subscription
                    </Button>
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => {
                    const cc = colorMap[k.color]
                    const Icon = k.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(k.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${cc.iconBg} ${cc.text}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-bold tracking-tighter ${k.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                                        {k.isPositive ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                                        {k.trend}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-[10px] font-bold text-slate-400 pb-1 mb-1 uppercase tracking-widest">{k.title}</h3>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{k.value}</p>
                                    <p className="mt-1 text-[11px] font-medium text-slate-500">{k.subtext}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-none">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Lifecycle Trends</CardTitle>
                            <p className="text-xs text-slate-500">Monthly active vs churned subscription volume</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                            <div className="flex items-center gap-1.5"><div className="h-2 w-2 bg-purple-500" />ACTIVE</div>
                            <div className="flex items-center gap-1.5"><div className="h-2 w-2 bg-rose-400" />CHURNED</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={subTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="active" fill="#8b5cf6" barSize={24} />
                                <Bar dataKey="churn" fill="#f43f5e" fillOpacity={0.6} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="rounded-none flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Contract Type</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="h-[200px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={subTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                                        {subTypeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <div className="text-2xl font-bold text-slate-900">420</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Total Subs</div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {subTypeData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between text-[11px] font-bold cursor-pointer hover:bg-slate-50 p-1 -m-1" onClick={() => router.push('/client-management/subscriptions/active')}>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2" style={{ backgroundColor: item.color }} />
                                        <span className="text-slate-500">{item.name.toUpperCase()}</span>
                                    </div>
                                    <span className="text-slate-900">{item.value} ({Math.round(item.value / 420 * 100)}%)</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 rounded-none uppercase text-[11px] tracking-widest" onClick={() => router.push('/client-management/reports/financial')}>
                            Detailed Reports <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links Card */}
            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Quick Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                            { title: "Plans & Pricing", path: "/client-management/subscriptions/plans" },
                            { title: "Active Subscriptions", path: "/client-management/subscriptions/active" },
                            { title: "Usage Billing", path: "/client-management/subscriptions/usage" },
                            { title: "Contracts", path: "/client-management/subscriptions/contracts" },
                            { title: "Invoices", path: "/client-management/subscriptions/invoices" },
                        ].map((q, i) => (
                            <Card key={i} className="rounded-none cursor-pointer hover:shadow-md hover:bg-slate-50 transition" onClick={() => router.push(q.path)}>
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm font-semibold text-slate-700">{q.title}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Add Subscription Sheet */}
            <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-violet-50 to-purple-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">New Subscription</SheetTitle>
                        <p className="text-[12px] text-slate-500">Start a new client subscription.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client / Account <span className="text-rose-500">*</span></Label>
                            <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., Acme Corp" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Billing Email <span className="text-rose-500">*</span></Label>
                            <Input type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="billing@example.com" className={`h-10 rounded-none ${errors.email ? "border-rose-500" : ""}`} />
                            {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Billing Plan</Label>
                            <Select value={form.plan} onValueChange={v => setField("plan", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Annual">Annual</SelectItem>
                                    <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-none" onClick={handleSave}>Create</Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Subscriptions</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <p className="text-sm text-slate-500">Use the sub-pages (Active, Contracts, etc.) for granular filtering.</p>
                    </div>
                    <div className="p-5 border-t bg-white">
                        <Button className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filter applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
