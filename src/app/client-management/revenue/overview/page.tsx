"use client"

import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useRouter } from "next/navigation"
import {
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    DollarSign,
    Target,
    RefreshCw,
    Plus,
    Download,
    Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Progress } from "@/shared/components/ui/progress"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/utils/toast"

const performanceData = [
    { month: 'Jan', actual: 320, forecast: 310 },
    { month: 'Feb', actual: 340, forecast: 330 },
    { month: 'Mar', actual: 360, forecast: 350 },
    { month: 'Apr', actual: 380, forecast: 370 },
    { month: 'May', actual: 400, forecast: 390 },
    { month: 'Jun', actual: 420, forecast: 410 },
    { month: 'Jul', actual: 440, forecast: 430 },
    { month: 'Aug', actual: 460, forecast: 450 },
    { month: 'Sep', forecast: 480 },
    { month: 'Oct', forecast: 500 },
    { month: 'Nov', forecast: 520 },
    { month: 'Dec', forecast: 540 }
]

const initialPipeline = [
    { id: 1, title: "New Opportunities", value: 640, progress: 75, owner: "Sales Team", color: "orange" },
    { id: 2, title: "Expansion Engine", value: 312, progress: 60, owner: "CSM Team", color: "cyan" },
    { id: 3, title: "Renewal Push", value: 425, progress: 82, owner: "Account Mgr", color: "indigo" },
]

const initialRiskAccounts = [
    { id: 1, name: "Acme Corp", arr: "$48k", risk: "High", reason: "Contract expiring soon", csm: "John Doe" },
    { id: 2, name: "Stark Industries", arr: "$120k", risk: "Critical", reason: "Payment overdue 30 days", csm: "Sarah Smith" },
    { id: 3, name: "Wayne Enterprises", arr: "$78k", risk: "High", reason: "Low platform engagement", csm: "Alex Wong" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    number: (v: string) => v && !/^\d+(\.\d{1,2})?$/.test(v.toString().trim()) ? "Enter a valid number" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function RevenueOverviewPage() {
    const router = useRouter()
    const [pipeline, setPipeline] = React.useState(initialPipeline)
    const [riskAccounts, setRiskAccounts] = React.useState(initialRiskAccounts)
    const [period, setPeriod] = React.useState("This Year")

    // Sheets
    const [isAddPipelineOpen, setIsAddPipelineOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [detailData, setDetailData] = React.useState<any>(null)
    const [detailType, setDetailType] = React.useState<"pipeline" | "risk" | null>(null)
    const [editingId, setEditingId] = React.useState<number | null>(null)

    const [form, setForm] = React.useState({ title: "", value: "", owner: "", color: "indigo", notes: "" })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const kpiStats = [
        { title: "Annual Recurring (ARR)", value: "$4.62M", change: "+19.2%", trend: "up" as const, subtitle: "Next 12 Month Projection", color: "emerald", icon: DollarSign, path: "/client-management/revenue/renewals" },
        { title: "Monthly Recurring (MRR)", value: "$385k", change: "+13.2%", trend: "up" as const, subtitle: "Aug $1.37/Client", color: "indigo", icon: TrendingUp, path: "/client-management/analytics/revenue" },
        { title: "Net Revenue Retention", value: "112%", change: "+2.8%", trend: "up" as const, subtitle: "Over Last Quarter", color: "violet", icon: Target, path: "/client-management/analytics/retention" },
        { title: "Renewal Pipeline", value: "$1.24M", change: "Stable", trend: "stable" as const, subtitle: "Next 90 Days", color: "amber", icon: RefreshCw, path: "/client-management/revenue/renewals" },
    ]

    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    const openAddPipeline = () => {
        setEditingId(null)
        setForm({ title: "", value: "", owner: "", color: "indigo", notes: "" })
        setErrors({})
        setIsAddPipelineOpen(true)
    }

    const openEditPipeline = (item: typeof initialPipeline[0]) => {
        setEditingId(item.id)
        setForm({ title: item.title, value: String(item.value), owner: item.owner, color: item.color, notes: "" })
        setErrors({})
        setIsAddPipelineOpen(true)
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.title = validators.required(form.title) || validators.minLen(3)(form.title)
        errs.value = validators.required(form.value) || validators.number(form.value)
        errs.owner = validators.required(form.owner)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const setField = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const handleSavePipeline = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setPipeline(pipeline.map(p => p.id === editingId ? { ...p, title: form.title, value: parseFloat(form.value), owner: form.owner, color: form.color } : p))
            toast.success("Pipeline item updated")
        } else {
            setPipeline([{ id: Date.now(), title: form.title, value: parseFloat(form.value), owner: form.owner, color: form.color, progress: 50 }, ...pipeline])
            toast.success("Pipeline item added")
        }
        setIsAddPipelineOpen(false)
    }

    const handleDeletePipeline = (id: number) => {
        setPipeline(pipeline.filter(p => p.id !== id))
        toast.success("Pipeline item removed")
    }

    const handleDismissRisk = (id: number) => {
        setRiskAccounts(riskAccounts.filter(r => r.id !== id))
        toast.success("Risk account dismissed")
    }

    const openDetail = (type: typeof detailType, data: any) => {
        setDetailType(type)
        setDetailData(data)
        setIsDetailOpen(true)
    }

    const handleExport = () => toast.success("Report exported to CSV")

    return (
        <div className="min-h-screen bg-slate-50 text-sm">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Revenue <span className="text-indigo-600">Strategic Control Center</span>
                        </h1>
                        <p className="text-[14px] text-slate-500 mt-1">High-level visibility into commercial performance, MRR tracking and growth forecasting.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-slate-200 rounded-none px-3 py-1.5 shadow-sm">
                            <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                            <select className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-700 outline-none"
                                value={period} onChange={(e) => { setPeriod(e.target.value); toast.success(`Data updated for ${e.target.value}`) }}>
                                <option>This Year</option>
                                <option>Last Quarter</option>
                                <option>Last 6 Months</option>
                                <option>YTD</option>
                            </select>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-none h-10" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2" />Export
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-none h-10" onClick={openAddPipeline}>
                            <Plus className="h-4 w-4 mr-2" />Add Pipeline
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-8 py-6 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiStats.map((stat, i) => {
                        const cc = colorMap[stat.color] || colorMap.indigo
                        const Icon = stat.icon
                        return (
                            <Card key={i} className={`rounded-none cursor-pointer transition hover:shadow-md ${cc.bg} ${cc.border} border`} onClick={() => router.push(stat.path)}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-slate-400 tracking-wide mb-1">{stat.title}</p>
                                            <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                                            <p className="text-xs text-slate-400">{stat.subtitle}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`p-2 rounded-none ${cc.iconBg}`}>
                                                <Icon className={`h-4 w-4 ${cc.text}`} />
                                            </div>
                                            <div className={`flex items-center space-x-1 ${cc.text}`}>
                                                {stat.trend !== "stable" && <ArrowUpRight className={`h-3 w-3 ${stat.trend === 'down' ? 'rotate-90' : ''}`} />}
                                                <span className="text-xs font-medium">{stat.change}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Revenue Performance Chart */}
                    <Card className="lg:col-span-2 rounded-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Revenue Performance & Forecast</CardTitle>
                            <p className="text-xs text-slate-500">Actual performance vs projected growth trajectory</p>
                        </CardHeader>
                        <CardContent className="pt-1">
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" className="text-[10px]" axisLine={false} tickLine={false} />
                                    <YAxis className="text-[10px]" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}k`} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', fontSize: '10px' }} />
                                    <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 1, r: 2 }} name="Actual" />
                                    <Line type="monotone" dataKey="forecast" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" dot={{ fill: '#94a3b8', strokeWidth: 1, r: 2 }} name="Forecast" />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1"><div className="w-2 h-2 bg-indigo-500"></div><span className="text-[10px] text-slate-500">Actual</span></div>
                                <div className="flex items-center space-x-1"><div className="w-2 h-[2px] bg-gray-400"></div><span className="text-[10px] text-slate-500">Forecast</span></div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {/* At-Risk Revenue */}
                        <Card className="rounded-none border-rose-200 bg-rose-50/30 cursor-pointer hover:shadow-md transition" onClick={() => router.push('/client-management/customers/health')}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center space-x-1">
                                    <AlertCircle className="h-3 w-3 text-rose-500" />
                                    <CardTitle className="text-rose-700 text-xs">At-Risk Revenue</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-1">
                                <p className="text-lg font-bold text-rose-700">$245.6k</p>
                                <p className="text-[10px] text-rose-600">Found in 8 high-priority accounts</p>
                                <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] text-rose-600">Risk Level</span>
                                        <span className="text-[9px] text-rose-700 font-medium">15.3% Of Total ARR</span>
                                    </div>
                                    <Progress value={15.3} className="h-1 bg-rose-100" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Commercial Pipeline */}
                        <Card className="rounded-none">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-xs font-semibold">Commercial Pipeline</CardTitle>
                                <Button variant="ghost" size="sm" className="h-6 text-[10px] rounded-none" onClick={openAddPipeline}>
                                    <Plus className="h-3 w-3 mr-1" />Add
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-1 space-y-3">
                                {pipeline.map((item) => (
                                    <div key={item.id} className="space-y-1 cursor-pointer hover:bg-slate-50 p-1 -m-1 transition" onClick={() => openDetail("pipeline", item)}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1">
                                                <div className={`w-2 h-2 bg-${item.color}-500`}></div>
                                                <span className="text-[10px] font-medium text-slate-700">{item.title}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-900">${item.value}k</span>
                                        </div>
                                        <Progress value={item.progress} className="h-1" />
                                    </div>
                                ))}
                                {pipeline.length === 0 && <p className="text-[10px] text-slate-400 text-center py-3">No pipeline items.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Risk Accounts List */}
                <Card className="rounded-none">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold">High-Risk Accounts</CardTitle>
                        <Badge variant="destructive" className="rounded-none">{riskAccounts.length}</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {riskAccounts.map((r) => (
                                <div key={r.id}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-none cursor-pointer hover:bg-slate-100 transition group"
                                    onClick={() => openDetail("risk", r)}>
                                    <div>
                                        <p className="font-medium text-slate-900">{r.name}</p>
                                        <p className="text-xs text-slate-500">{r.reason}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`rounded-none ${r.risk === 'Critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>{r.risk}</Badge>
                                        <span className="text-sm font-semibold text-slate-900 w-20 text-right">{r.arr}</span>
                                        <Button variant="ghost" size="sm" className="rounded-none opacity-0 group-hover:opacity-100"
                                            onClick={(e) => { e.stopPropagation(); handleDismissRisk(r.id) }}>
                                            Dismiss
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {riskAccounts.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No high-risk accounts.</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Pipeline Bar Chart */}
                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Pipeline Value Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={pipeline.map(p => ({ name: p.title, value: p.value }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(v) => `$${v}k`} />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Pipeline Sheet */}
            <Sheet open={isAddPipelineOpen} onOpenChange={setIsAddPipelineOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Pipeline" : "Add Pipeline Item"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track a new commercial pipeline segment.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Title <span className="text-rose-500">*</span></Label>
                            <Input value={form.title} onChange={e => setField("title", e.target.value)} placeholder="e.g., Q3 Expansion Push" className={`h-10 rounded-none ${errors.title ? "border-rose-500" : ""}`} />
                            {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Value (in $k) <span className="text-rose-500">*</span></Label>
                            <Input type="number" value={form.value} onChange={e => setField("value", e.target.value)} placeholder="e.g., 500" className={`h-10 rounded-none ${errors.value ? "border-rose-500" : ""}`} />
                            {errors.value && <p className="text-[11px] text-rose-500">{errors.value}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Owner <span className="text-rose-500">*</span></Label>
                            <Input value={form.owner} onChange={e => setField("owner", e.target.value)} placeholder="e.g., Sales Team" className={`h-10 rounded-none ${errors.owner ? "border-rose-500" : ""}`} />
                            {errors.owner && <p className="text-[11px] text-rose-500">{errors.owner}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Color Tag</Label>
                            <Select value={form.color} onValueChange={v => setField("color", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="indigo">Indigo</SelectItem>
                                    <SelectItem value="cyan">Cyan</SelectItem>
                                    <SelectItem value="orange">Orange</SelectItem>
                                    <SelectItem value="emerald">Emerald</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Notes</Label>
                            <Textarea value={form.notes} onChange={e => setField("notes", e.target.value)} placeholder="Optional context..." className="rounded-none min-h-[80px]" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsAddPipelineOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={handleSavePipeline}>{editingId ? "Save" : "Add"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900 capitalize">{detailType} Details</SheetTitle>
                        <p className="text-[12px] text-slate-500">Quick info on the selected record.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {detailData && detailType === "pipeline" && (
                            <>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Pipeline</p>
                                    <p className="text-lg font-semibold text-slate-900">{detailData.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Value</p><p className="font-semibold text-slate-900">${detailData.value}k</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Progress</p><p className="font-semibold text-slate-900">{detailData.progress}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Owner</p><p className="font-semibold text-slate-900">{detailData.owner}</p></div>
                                </div>
                                <div className="flex gap-2 pt-3 border-t">
                                    <Button variant="outline" className="flex-1 rounded-none" onClick={() => { setIsDetailOpen(false); openEditPipeline(detailData) }}>Edit</Button>
                                    <Button variant="outline" className="flex-1 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeletePipeline(detailData.id); setIsDetailOpen(false) }}>Delete</Button>
                                </div>
                            </>
                        )}
                        {detailData && detailType === "risk" && (
                            <>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{detailData.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ARR</p><p className="font-semibold text-slate-900">{detailData.arr}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Risk Level</p>
                                        <Badge className={`rounded-none ${detailData.risk === 'Critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>{detailData.risk}</Badge>
                                    </div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">CSM</p><p className="font-semibold text-slate-900">{detailData.csm}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Reason</p><p className="text-sm text-slate-700">{detailData.reason}</p></div>
                                </div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsDetailOpen(false); router.push('/client-management/customers/health') }}>View Health Dashboard</Button>
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
