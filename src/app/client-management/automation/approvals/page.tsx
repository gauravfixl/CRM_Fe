"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Gavel,
    ShieldCheck,
    Clock,
    ClipboardCheck,
    Activity,
    Plus,
    Search,
    Filter,
    RefreshCw,
    Download,
    MoreVertical,
    Trash2,
    PencilLine,
    Eye,
    User,
    DollarSign,
    CheckSquare,
    XSquare,
    History,
    Hammer,
    Scale,
    Sparkles,
    Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { toast } from "@/shared/utils/toast"

interface ApprovalRequest {
    id: string
    type: string
    requestor: string
    client: string
    amount: string
    priority: "High" | "Medium" | "Low"
    date: string
    status: "Pending" | "Approved" | "Rejected"
}

interface ApprovalRule {
    id: string
    name: string
    threshold: string
    type: string
    status: "Active" | "Inactive"
}

const INITIAL_REQUESTS: ApprovalRequest[] = [
    { id: "APP-01", type: "Discount Approval", requestor: "John Doe", client: "Acme Corp", amount: "$2,400", priority: "High", date: "Oct 04", status: "Pending" },
    { id: "APP-02", type: "Contract Amendment", requestor: "Sarah Smith", client: "TechFlow Solutions", amount: "$15,000", priority: "Medium", date: "Oct 04", status: "Pending" },
    { id: "APP-03", type: "Refund Request", requestor: "Mike Johnson", client: "BlueSky Inc", amount: "$1,200", priority: "Low", date: "Oct 03", status: "Pending" },
    { id: "APP-04", type: "Pricing Override", requestor: "Emma Wilson", client: "Globex", amount: "$8,000", priority: "High", date: "Oct 02", status: "Pending" },
]

const INITIAL_RULES: ApprovalRule[] = [
    { id: "AR-01", name: "High-Value Acquisition", threshold: "> $10,000", type: "Strategic", status: "Active" },
    { id: "AR-02", name: "Discount Sentinel", threshold: "> 20%", type: "Financial", status: "Active" },
    { id: "AR-03", name: "Contract Renewal Guard", threshold: "Auto-renew > 12mo", type: "Lifecycle", status: "Active" },
    { id: "AR-04", name: "Refund Policy Check", threshold: "> $500", type: "Financial", status: "Inactive" },
]

const PRIORITY_COLORS: Record<string, string> = {
    High: "bg-rose-50 text-rose-600 border-rose-100",
    Medium: "bg-amber-50 text-amber-600 border-amber-100",
    Low: "bg-slate-50 text-slate-500 border-slate-100",
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function ApprovalsPage() {
    const router = useRouter()
    const [requests, setRequests] = React.useState<ApprovalRequest[]>(INITIAL_REQUESTS)
    const [rules, setRules] = React.useState<ApprovalRule[]>(INITIAL_RULES)
    const [search, setSearch] = React.useState("")
    const [activeTab, setActiveTab] = React.useState<"pending" | "rules">("pending")
    const [filterPriority, setFilterPriority] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<ApprovalRule | ApprovalRequest | null>(null)
    const [selectedKind, setSelectedKind] = React.useState<"rule" | "request" | null>(null)
    const [isSyncing, setIsSyncing] = React.useState(false)

    // Form for rules
    const [form, setForm] = React.useState({ name: "", threshold: "", type: "Financial", status: "Active" as ApprovalRule["status"] })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => {
        const pending = requests.filter(r => r.status === "Pending").length
        const approved = requests.filter(r => r.status === "Approved").length
        const successRate = requests.length ? Math.round((approved / requests.length) * 100) : 0
        const activeRules = rules.filter(r => r.status === "Active").length
        return { pending, approved, successRate, activeRules }
    }, [requests, rules])

    const filteredRequests = React.useMemo(() => {
        return requests.filter(r => {
            const matchSearch = !search || r.client.toLowerCase().includes(search.toLowerCase()) || r.requestor.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
            const matchPriority = filterPriority === "all" || r.priority === filterPriority
            return matchSearch && matchPriority
        })
    }, [requests, search, filterPriority])

    const filteredRules = React.useMemo(() => {
        return rules.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()))
    }, [rules, search])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.threshold = validators.required(form.threshold)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreateRule = () => {
        setEditingId(null)
        setForm({ name: "", threshold: "", type: "Financial", status: "Active" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEditRule = (r: ApprovalRule) => {
        setEditingId(r.id)
        setForm({ name: r.name, threshold: r.threshold, type: r.type, status: r.status })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSaveRule = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setRules(prev => prev.map(r => r.id === editingId ? {
                ...r, name: form.name.trim(), threshold: form.threshold.trim(), type: form.type, status: form.status,
            } : r))
            toast.success("Rule updated")
        } else {
            const r: ApprovalRule = {
                id: `AR-${String(rules.length + 1).padStart(2, "0")}`,
                name: form.name.trim(),
                threshold: form.threshold.trim(),
                type: form.type,
                status: form.status,
            }
            setRules(prev => [r, ...prev])
            toast.success("Rule created")
        }
        setIsFormOpen(false)
    }

    const handleDeleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id))
        toast.success("Rule removed")
    }

    const handleApprove = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Approved" } : r))
        toast.success(`Request ${id} approved`)
    }

    const handleReject = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Rejected" } : r))
        toast.success(`Request ${id} rejected`)
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: "Syncing approvals...",
            success: "Approvals synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1200)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Type", "Requestor", "Client", "Amount", "Priority", "Status"],
            ...requests.map(r => [r.id, r.type, r.requestor, r.client, r.amount, r.priority, r.status]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "approvals.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Approvals exported")
    }

    const openRequestDetail = (req: ApprovalRequest) => {
        setSelected(req); setSelectedKind("request"); setIsDetailOpen(true)
    }

    const openRuleDetail = (r: ApprovalRule) => {
        setSelected(r); setSelectedKind("rule"); setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Pending Queue", value: String(stats.pending), subtitle: "Awaiting governance", icon: Clock, color: "indigo", trend: `+${stats.pending}`, path: "/client-management/automation/workflows" },
        { title: "Approval Success", value: `${stats.successRate}%`, subtitle: "Approved vs total", icon: ClipboardCheck, color: "emerald", trend: "+2%", path: "/client-management/analytics/overview" },
        { title: "Active Rules", value: String(stats.activeRules), subtitle: "Governance policies", icon: ShieldCheck, color: "violet", trend: `+${stats.activeRules}`, path: "/client-management/automation/triggers" },
        { title: "Approved Requests", value: String(stats.approved), subtitle: "Cleared this cycle", icon: Activity, color: "amber", trend: `+${stats.approved}`, path: "/client-management/automation/logs" },
    ]

    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Governance <span className="text-indigo-600">Approvals</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Multi-stage approval workflows, compliance gates, and strategic override management.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={handleSync}>
                        {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        {isSyncing ? "Syncing" : "Sync"}
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <History className="h-4 w-4 mr-2" /> Audit Log
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreateRule}>
                        <Scale className="h-4 w-4 mr-2" /> Create Rule
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
                                            <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>
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

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-4">
                <TabsList className="rounded-none bg-white border border-slate-200 p-1 w-fit">
                    <TabsTrigger value="pending" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Pending Queue</TabsTrigger>
                    <TabsTrigger value="rules" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6">Governance Rules</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === "pending" && (
                        <Card className="rounded-none">
                            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
                                    <Badge className="rounded-none bg-slate-100 text-slate-600">{filteredRequests.length} Results</Badge>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50">
                                    {filteredRequests.length > 0 ? filteredRequests.map(req => (
                                        <div key={req.id} className="px-6 py-4 hover:bg-slate-50/80 transition cursor-pointer group flex items-center gap-4" onClick={() => openRequestDetail(req)}>
                                            <div className="h-10 w-10 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                <Gavel className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-slate-800">{req.client}</p>
                                                    <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-semibold border ${PRIORITY_COLORS[req.priority]}`}>{req.priority}</span>
                                                    <Badge className={`rounded-none text-[10px] ${req.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" : req.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"} border`}>{req.status}</Badge>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-1">{req.type}</p>
                                                <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-400 font-semibold">
                                                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {req.requestor}</span>
                                                    <span className="flex items-center gap-1 text-slate-700"><DollarSign className="h-3 w-3" /> {req.amount}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {req.date}</span>
                                                </div>
                                            </div>
                                            {req.status === "Pending" ? (
                                                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="outline" className="rounded-none h-9 text-rose-600 hover:bg-rose-50 border-rose-200" onClick={() => handleReject(req.id)}>
                                                        <XSquare className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                    <Button className="rounded-none h-9 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleApprove(req.id)}>
                                                        <CheckSquare className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Badge className={`rounded-none ${req.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{req.status}</Badge>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="px-6 py-12 text-center text-sm text-slate-500">No requests match your filters.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "rules" && (
                        <Card className="rounded-none">
                            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-base font-semibold">Governance Rules</CardTitle>
                                    <Badge className="rounded-none bg-slate-100 text-slate-600">{filteredRules.length} Results</Badge>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search rules..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50">
                                    {filteredRules.map(rule => (
                                        <div key={rule.id} className="px-6 py-4 hover:bg-slate-50/80 transition cursor-pointer group flex items-center gap-4" onClick={() => openRuleDetail(rule)}>
                                            <div className="h-10 w-10 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                <Hammer className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-slate-800">{rule.name}</p>
                                                    <Badge className={`rounded-none text-[10px] ${rule.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"} border`}>{rule.status}</Badge>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-0.5">{rule.type} enforcement</p>
                                                <p className="text-[11px] font-bold text-slate-700 mt-0.5">Threshold: {rule.threshold}</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-none">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEditRule(rule)}>
                                                            <PencilLine className="h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => openRuleDetail(rule)}>
                                                            <Eye className="h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDeleteRule(rule.id)}>
                                                            <Trash2 className="h-4 w-4" /> Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Priority Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(["High", "Medium", "Low"] as const).map(p => {
                                const list = requests.filter(r => r.priority === p && r.status === "Pending")
                                return (
                                    <div key={p} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-none transition" onClick={() => setFilterPriority(p)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-none flex items-center justify-center border ${PRIORITY_COLORS[p]}`}>
                                                <Gavel className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 leading-none">{p} Priority</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{list.length} pending</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{list.length}</span>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> Governance Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    <span className="text-indigo-600 font-bold">{stats.activeRules} active rules</span> currently guard against unauthorized overrides.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    {stats.pending} requests in queue awaiting approval.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none mt-2" onClick={() => { toast.success("Opening triggers"); router.push('/client-management/automation/triggers') }}>
                                Connect Triggers
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Rule Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Governance Rule" : "Create Governance Rule"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define a threshold-based approval policy.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Rule Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. High-Value Acquisition" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Threshold <span className="text-rose-500">*</span></Label>
                            <Input value={form.threshold} onChange={e => setField("threshold", e.target.value)} placeholder="e.g. > $10,000" className={`h-10 rounded-none ${errors.threshold ? "border-rose-500" : ""}`} />
                            {errors.threshold && <p className="text-[11px] text-rose-500">{errors.threshold}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={(v) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Financial">Financial</SelectItem>
                                        <SelectItem value="Strategic">Strategic</SelectItem>
                                        <SelectItem value="Lifecycle">Lifecycle</SelectItem>
                                        <SelectItem value="Security">Security</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveRule}>
                            {editingId ? "Save Changes" : "Create Rule"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Approvals</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Priority</Label>
                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All priorities</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterPriority("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">{selectedKind === "rule" ? "Rule Details" : "Request Details"}</SheetTitle>
                    </SheetHeader>
                    {selected && selectedKind === "request" && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Request</p>
                                    <p className="text-lg font-semibold text-slate-900">{(selected as ApprovalRequest).type}</p>
                                    <p className="text-sm text-slate-500">{(selected as ApprovalRequest).id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Client</p><p className="font-semibold text-slate-900">{(selected as ApprovalRequest).client}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Requestor</p><p className="font-semibold text-slate-900">{(selected as ApprovalRequest).requestor}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Amount</p><p className="font-semibold text-slate-900">{(selected as ApprovalRequest).amount}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Priority</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${PRIORITY_COLORS[(selected as ApprovalRequest).priority]}`}>{(selected as ApprovalRequest).priority}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Filed</p><p className="font-semibold text-slate-900">{(selected as ApprovalRequest).date}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none ${(selected as ApprovalRequest).status === "Pending" ? "bg-amber-50 text-amber-700" : (selected as ApprovalRequest).status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{(selected as ApprovalRequest).status}</Badge>
                                    </div>
                                </div>
                            </div>
                            {(selected as ApprovalRequest).status === "Pending" && (
                                <div className="p-5 border-t flex gap-3 bg-white">
                                    <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-600 hover:bg-rose-50 border-rose-200" onClick={() => { handleReject((selected as ApprovalRequest).id); setIsDetailOpen(false) }}>
                                        <XSquare className="h-4 w-4 mr-2" />Reject
                                    </Button>
                                    <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => { handleApprove((selected as ApprovalRequest).id); setIsDetailOpen(false) }}>
                                        <CheckSquare className="h-4 w-4 mr-2" />Approve
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                    {selected && selectedKind === "rule" && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Rule</p>
                                    <p className="text-lg font-semibold text-slate-900">{(selected as ApprovalRule).name}</p>
                                    <p className="text-sm text-slate-500">{(selected as ApprovalRule).id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><p className="font-semibold text-slate-900">{(selected as ApprovalRule).type}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none ${(selected as ApprovalRule).status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{(selected as ApprovalRule).status}</Badge>
                                    </div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Threshold</p><p className="font-semibold text-slate-900">{(selected as ApprovalRule).threshold}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEditRule(selected as ApprovalRule) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteRule((selected as ApprovalRule).id); setIsDetailOpen(false) }}>
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
