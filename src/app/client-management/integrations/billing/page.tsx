"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, RefreshCw, Download, CreditCard,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    DollarSign, AlertCircle, Activity, CheckCircle2, Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

type Gateway = {
    id: string
    name: string
    provider: 'Stripe' | 'Square' | 'PayPal' | 'Adyen' | 'Braintree' | 'Razorpay'
    mode: 'Live' | 'Sandbox'
    apiKey: string
    secret: string
    webhookUrl: string
    status: 'Active' | 'Inactive' | 'Error'
    enabled: boolean
    transactions: number
    volume: number
    feesPercent: number
    currency: string
}

const INITIAL: Gateway[] = [
    { id: "GW-001", name: "Stripe Production", provider: "Stripe", mode: "Live", apiKey: "pk_live_5z2x...8mq3", secret: "sk_live_h7d2...9fk3", webhookUrl: "https://api.fixl.io/webhooks/stripe", status: "Active", enabled: true, transactions: 4820, volume: 248320, feesPercent: 2.9, currency: "USD" },
    { id: "GW-002", name: "PayPal Checkout", provider: "PayPal", mode: "Live", apiKey: "AYi8...PQRz", secret: "ELvN...3xKf", webhookUrl: "https://api.fixl.io/webhooks/paypal", status: "Active", enabled: true, transactions: 1240, volume: 84120, feesPercent: 3.49, currency: "USD" },
    { id: "GW-003", name: "Square Point of Sale", provider: "Square", mode: "Live", apiKey: "sq0idp-...8x2k", secret: "sq0csp-...9pm4", webhookUrl: "https://api.fixl.io/webhooks/square", status: "Active", enabled: true, transactions: 890, volume: 32480, feesPercent: 2.6, currency: "USD" },
    { id: "GW-004", name: "Stripe Sandbox", provider: "Stripe", mode: "Sandbox", apiKey: "pk_test_zL7...4kj", secret: "sk_test_yX2...8vn", webhookUrl: "https://staging.fixl.io/webhooks/stripe", status: "Active", enabled: true, transactions: 124, volume: 0, feesPercent: 2.9, currency: "USD" },
    { id: "GW-005", name: "Razorpay India", provider: "Razorpay", mode: "Live", apiKey: "rzp_live_8j3k...2lm", secret: "RZP_S3CR3T...8x4", webhookUrl: "https://api.fixl.io/webhooks/razorpay", status: "Error", enabled: false, transactions: 0, volume: 0, feesPercent: 2.0, currency: "INR" },
]

const PROVIDERS: Gateway['provider'][] = ["Stripe", "Square", "PayPal", "Adyen", "Braintree", "Razorpay"]
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD"]

const PROVIDER_COLORS: Record<string, string> = {
    Stripe: "bg-violet-50 text-violet-600 border-violet-100",
    Square: "bg-slate-50 text-slate-600 border-slate-100",
    PayPal: "bg-blue-50 text-blue-600 border-blue-100",
    Adyen: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Braintree: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Razorpay: "bg-amber-50 text-amber-600 border-amber-100",
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    url: (v: string) => v && !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)/i.test(v) ? "Enter a valid URL" : "",
}

export default function BillingGatewaysPage() {
    const router = useRouter()
    const [gateways, setGateways] = React.useState<Gateway[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [modeFilter, setModeFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<Gateway | null>(null)

    const [form, setForm] = React.useState({
        name: "", provider: "Stripe" as Gateway['provider'], mode: "Live" as Gateway['mode'],
        apiKey: "", secret: "", webhookUrl: "", currency: "USD",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        active: gateways.filter(g => g.enabled).length,
        totalVolume: gateways.reduce((a, g) => a + g.volume, 0),
        totalTx: gateways.reduce((a, g) => a + g.transactions, 0),
        avgFee: gateways.length ? (gateways.reduce((a, g) => a + g.feesPercent, 0) / gateways.length).toFixed(2) : "0.00",
    }), [gateways])

    const filtered = React.useMemo(() => gateways.filter(g => {
        const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.provider.toLowerCase().includes(search.toLowerCase())
        const matchMode = modeFilter === "all" || g.mode === modeFilter
        return matchSearch && matchMode
    }), [gateways, search, modeFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.apiKey = validators.required(form.apiKey) || validators.minLen(6)(form.apiKey)
        errs.secret = validators.required(form.secret) || validators.minLen(6)(form.secret)
        errs.webhookUrl = validators.required(form.webhookUrl) || validators.url(form.webhookUrl)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", provider: "Stripe", mode: "Live", apiKey: "", secret: "", webhookUrl: "", currency: "USD" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (g: Gateway) => {
        setEditingId(g.id)
        setForm({ name: g.name, provider: g.provider, mode: g.mode, apiKey: g.apiKey, secret: g.secret, webhookUrl: g.webhookUrl, currency: g.currency })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setGateways(gateways.map(g => g.id === editingId ? { ...g, name: form.name.trim(), provider: form.provider, mode: form.mode, apiKey: form.apiKey, secret: form.secret, webhookUrl: form.webhookUrl, currency: form.currency } : g))
            toast.success("Gateway updated")
        } else {
            const g: Gateway = {
                id: `GW-${String(gateways.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), provider: form.provider, mode: form.mode,
                apiKey: form.apiKey, secret: form.secret, webhookUrl: form.webhookUrl,
                status: "Active", enabled: true, transactions: 0, volume: 0,
                feesPercent: form.provider === "Stripe" ? 2.9 : form.provider === "PayPal" ? 3.49 : 2.5,
                currency: form.currency,
            }
            setGateways([g, ...gateways])
            toast.success(`${g.provider} gateway configured`)
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setGateways(gateways.filter(g => g.id !== id))
        toast.success("Gateway removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setGateways(gateways.map(g => g.id === id ? { ...g, enabled: !current, status: !current ? "Active" : "Inactive" } : g))
        toast.success(current ? "Gateway disabled" : "Gateway enabled")
    }

    const handleTest = (g: Gateway) => {
        toast.success(`Testing ${g.provider} connection...`)
        setTimeout(() => toast.success(`${g.provider} connection successful`), 1200)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Provider", "Mode", "Status", "Transactions", "Volume", "Currency"], ...gateways.map(g => [g.id, g.name, g.provider, g.mode, g.status, g.transactions, g.volume, g.currency])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "billing-gateways.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Gateways exported")
    }

    const openDetail = (g: Gateway) => { setSelected(g); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Active Gateways", value: String(stats.active), subtitle: `${gateways.length} configured`, icon: CreditCard, color: "violet", trend: `+${stats.active}`, path: "/client-management/integrations/billing" },
        { title: "Total Volume", value: `$${(stats.totalVolume / 1000).toFixed(1)}k`, subtitle: "Across all gateways", icon: DollarSign, color: "emerald", trend: "+18%", path: "/client-management/revenue/overview" },
        { title: "Transactions", value: stats.totalTx.toLocaleString(), subtitle: "Last 30 days", icon: Activity, color: "indigo", trend: "+24%", path: "/client-management/subscriptions/contracts" },
        { title: "Avg. Fee", value: `${stats.avgFee}%`, subtitle: "Per transaction", icon: RefreshCw, color: "amber", trend: "-0.2%", path: "/client-management/integrations/billing" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Billing <span className="text-violet-600">Gateways</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Configure payment processors including Stripe, Square, PayPal, and more.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Add Gateway
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => {
                    const cc = colorMap[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                            <span className={`text-xs font-bold ${cc.text}`}>{kpi.trend}</span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-400">{kpi.subtitle}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${cc.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${cc.text}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">Configured Gateways</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} Total</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search gateways..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Gateway</th>
                                            <th className="px-6 py-3">Mode</th>
                                            <th className="px-6 py-3">Volume</th>
                                            <th className="px-6 py-3">Fee</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(g => (
                                            <tr key={g.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(g)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center ${PROVIDER_COLORS[g.provider]}`}>
                                                            <CreditCard className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{g.name}</p>
                                                            <p className="text-[11px] text-slate-500">{g.provider} • {g.currency}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${g.mode === "Live" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{g.mode}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">${g.volume.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{g.feesPercent}%</td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={g.enabled} onCheckedChange={() => handleToggle(g.id, g.enabled)} className="data-[state=checked]:bg-violet-600" />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleTest(g)}>
                                                                <Zap className="h-4 w-4" /> Test Connection
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(g)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(g)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(g.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No billing gateways match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Volume by Provider</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Processed payment volume distribution</p>
                            </div>
                            <DollarSign className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {PROVIDERS.map((p, idx) => {
                                const list = gateways.filter(g => g.provider === p)
                                const total = list.reduce((sum, g) => sum + g.volume, 0)
                                const max = Math.max(...gateways.map(g => g.volume), 1)
                                const progress = Math.min(100, total / max * 100)
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{p} <span className="text-slate-400 font-medium ml-2">{list.length} Gateways</span></span>
                                            <span className="text-slate-900">${total.toLocaleString()}</span>
                                        </div>
                                        <Progress value={progress} className="h-1.5 bg-slate-50" />
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Top Performers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...gateways].sort((a, b) => b.volume - a.volume).slice(0, 4).map((g, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(g)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center text-[10px] font-bold ${PROVIDER_COLORS[g.provider]}`}>
                                            {g.provider.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{g.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{g.transactions.toLocaleString()} txns</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">${(g.volume / 1000).toFixed(1)}k</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{g.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-violet-600 hover:text-violet-700 rounded-none mt-3" onClick={() => router.push('/client-management/revenue/overview')}>
                                View Revenue Reports
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-violet-100 bg-violet-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-violet-600 tracking-wider flex items-center gap-2 uppercase">
                                <AlertCircle className="h-4 w-4" /> Compliance Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-violet-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    PCI DSS Level 1 compliance is enforced across all <span className="text-violet-600 font-bold">Live</span> gateways.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-violet-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Rotate <span className="text-violet-600 font-bold">API secrets</span> every 90 days for security.
                                </p>
                            </div>
                            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={() => router.push('/client-management/integrations/api')}>
                                Manage API Keys
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-violet-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Gateway" : "Add Billing Gateway"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Connect a new payment processor.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Gateway Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Stripe Production" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Provider</Label>
                                <Select value={form.provider} onValueChange={(v: any) => setField("provider", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Mode</Label>
                                <Select value={form.mode} onValueChange={(v: any) => setField("mode", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Live">Live</SelectItem>
                                        <SelectItem value="Sandbox">Sandbox</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">API Key <span className="text-rose-500">*</span></Label>
                            <Input value={form.apiKey} onChange={e => setField("apiKey", e.target.value)} placeholder="pk_live_..." className={`h-10 rounded-none font-mono text-xs ${errors.apiKey ? "border-rose-500" : ""}`} />
                            {errors.apiKey && <p className="text-[11px] text-rose-500">{errors.apiKey}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Secret Key <span className="text-rose-500">*</span></Label>
                            <Input type="password" value={form.secret} onChange={e => setField("secret", e.target.value)} placeholder="sk_live_..." className={`h-10 rounded-none font-mono text-xs ${errors.secret ? "border-rose-500" : ""}`} />
                            {errors.secret && <p className="text-[11px] text-rose-500">{errors.secret}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Webhook URL <span className="text-rose-500">*</span></Label>
                            <Input value={form.webhookUrl} onChange={e => setField("webhookUrl", e.target.value)} placeholder="https://api.example.com/webhooks/stripe" className={`h-10 rounded-none ${errors.webhookUrl ? "border-rose-500" : ""}`} />
                            {errors.webhookUrl && <p className="text-[11px] text-rose-500">{errors.webhookUrl}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Currency</Label>
                            <Select value={form.currency} onValueChange={v => setField("currency", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Add Gateway"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Gateways</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Mode</Label>
                            <Select value={modeFilter} onValueChange={setModeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Modes</SelectItem>
                                    <SelectItem value="Live">Live</SelectItem>
                                    <SelectItem value="Sandbox">Sandbox</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setModeFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Gateway Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Gateway</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.provider}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Mode</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${selected.mode === "Live" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{selected.mode}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Volume</p><p className="font-semibold text-slate-900">${selected.volume.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Transactions</p><p className="font-semibold text-slate-900">{selected.transactions.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Fee</p><p className="font-semibold text-slate-900">{selected.feesPercent}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Currency</p><p className="font-semibold text-slate-900">{selected.currency}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">API Key</p><p className="font-mono text-xs text-slate-900 break-all">{selected.apiKey}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Webhook</p><p className="font-mono text-xs text-slate-900 break-all">{selected.webhookUrl}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Remove
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
