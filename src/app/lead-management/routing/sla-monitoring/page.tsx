"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    ChevronLeft,
    Clock,
    Filter,
    Flame,
    PieChart,
    Search,
    ShieldAlert,
    TrendingUp,
    Zap,
    ArrowUpRight,
    Gauge,
    Timer,
    History,
    RefreshCw,
    X,
    UserCheck,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"

type RiskLead = { id: string; lead: string; timeRemaining: string; policy: string; owner: string; score: number }

const AT_RISK_LEADS: RiskLead[] = [
    { id: "1", lead: "Alex Rivera", timeRemaining: "4m 20s", policy: "Enterprise First Response", owner: "Sarah J.", score: 92 },
    { id: "2", lead: "Jordan Lee", timeRemaining: "12m 45s", policy: "Standard Inbound", owner: "Mike R.", score: 74 },
    { id: "3", lead: "Casey Chen", timeRemaining: "18m 10s", policy: "High Intent Follow-up", owner: "Unassigned", score: 88 },
]

const RECENT_BREACHES = [
    { id: "b1", lead: "Taylor Smith", delay: "+14m", policy: "First Response", owner: "James K.", severity: "Critical" },
    { id: "b2", lead: "Morgan Day", delay: "+2.5h", policy: "Next Step Follow-up", owner: "Sarah J.", severity: "Moderate" },
]

const POLICIES = ["Enterprise First Response", "Standard Inbound", "High Intent Follow-up"]

type ReassignForm = { newOwner: string; reason: string }
type ReassignErrors = Partial<Record<keyof ReassignForm, string>>

export default function SLAMonitoringPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [searchTerm, setSearchTerm] = useState("")
    const [policyFilter, setPolicyFilter] = useState<string>("all")

    const [reassignOpen, setReassignOpen] = useState(false)
    const [activeLead, setActiveLead] = useState<RiskLead | null>(null)
    const [reassignForm, setReassignForm] = useState<ReassignForm>({ newOwner: "", reason: "" })
    const [reassignErrors, setReassignErrors] = useState<ReassignErrors>({})

    useEffect(() => { setIsClient(true) }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast({ title: "Monitoring sync", description: "Fetching latest incident heartbeats..." })
        setTimeout(() => setIsRefreshing(false), 1500)
    }

    const openReassign = (lead: RiskLead) => {
        setActiveLead(lead)
        setReassignForm({ newOwner: "", reason: "" })
        setReassignErrors({})
        setReassignOpen(true)
    }

    const validateReassign = (s: ReassignForm): ReassignErrors => {
        const e: ReassignErrors = {}
        if (!s.newOwner.trim()) e.newOwner = "New owner is required"
        else if (s.newOwner.trim().length < 2) e.newOwner = "Owner name too short"
        if (!s.reason.trim()) e.reason = "Reason is required"
        else if (s.reason.trim().length < 4) e.reason = "Reason too short"
        return e
    }

    const submitReassign = (e: React.FormEvent) => {
        e.preventDefault()
        const v = validateReassign(reassignForm)
        setReassignErrors(v)
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please fix highlighted fields.", variant: "destructive" })
            return
        }
        toast({ title: "Lead reassigned", description: `${activeLead?.lead} routed to ${reassignForm.newOwner}.` })
        setReassignOpen(false)
    }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return AT_RISK_LEADS.filter(l => {
            if (term && !l.lead.toLowerCase().includes(term) && !l.owner.toLowerCase().includes(term)) return false
            if (policyFilter !== "all" && l.policy !== policyFilter) return false
            return true
        })
    }, [searchTerm, policyFilter])

    const clearFilters = () => { setSearchTerm(""); setPolicyFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-indigo-50 p-6 rounded-none border border-indigo-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-indigo-700"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                SLA Live Monitoring
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Real-time view of response discipline. Monitor leads at risk of breach and track incident intensity across the pipeline.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-10 border-indigo-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin text-indigo-600" : "text-indigo-500"}`} />
                        {isRefreshing ? "Syncing..." : "Sync Monitor"}
                    </Button>
                    <Badge className="h-10 px-4 bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-2 font-semibold text-[11px] uppercase tracking-wider rounded-none">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Global Engine: Healthy
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Real-time Compliance Gauges - colored fills */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border border-indigo-100 shadow-sm rounded-none bg-indigo-50 p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-semibold text-indigo-700 tracking-wider uppercase">Global Compliance</p>
                                <Gauge size={18} className="text-indigo-600" />
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-[36px] font-semibold tabular-nums text-slate-900 tracking-tighter">88.4%</h3>
                                <div className="h-1.5 w-full bg-white rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-indigo-600 w-[88.4%]" />
                                </div>
                                <p className="text-[11px] font-semibold text-emerald-600 mt-3 flex items-center gap-1">
                                    <ArrowUpRight size={14} /> +2.1% improvement
                                </p>
                            </div>
                        </Card>

                        <Card className="border border-rose-100 shadow-sm rounded-none bg-rose-50 p-6 space-y-4 text-center">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-semibold text-rose-700 tracking-wider uppercase">Active Incidents</p>
                                <Zap size={18} className="text-rose-500 fill-rose-500" />
                            </div>
                            <h3 className="text-[36px] font-semibold tabular-nums text-rose-600 tracking-tighter mt-2">12</h3>
                            <p className="text-[11px] font-medium text-slate-600">Breaches requiring resolution</p>
                            <Button
                                onClick={() => toast({ title: "Incident Queue", description: "Redirecting to active breach resolution log." })}
                                className="w-full bg-white text-rose-600 hover:bg-rose-100 border border-rose-200 font-semibold text-[10px] uppercase tracking-wider h-8 mt-2 rounded-none"
                            >
                                Jump to Resolution
                            </Button>
                        </Card>

                        <Card className="border border-cyan-100 shadow-sm rounded-none bg-cyan-50 p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-semibold text-cyan-700 tracking-wider uppercase">Avg. Response</p>
                                <Timer size={18} className="text-cyan-600" />
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-[36px] font-semibold tabular-nums text-slate-900 tracking-tighter">12.4m</h3>
                                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mt-2">
                                    Target <span className="text-cyan-700">15m</span>
                                </div>
                                <p className="text-[11px] font-semibold text-emerald-600 mt-3 flex items-center gap-1">
                                    <ShieldAlert size={14} /> 98% within SLA
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[400px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search at-risk leads by name or owner..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={policyFilter} onValueChange={setPolicyFilter}>
                                <SelectTrigger className="h-10 w-[200px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                    <Filter className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Policies</SelectItem>
                                    {POLICIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {(searchTerm || policyFilter !== "all") && (
                                <Button variant="ghost" onClick={clearFilters} className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none">
                                    <X className="h-3.5 w-3.5 mr-1" /> Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Leads At Risk */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                                Leads At Immediate Risk
                                <Badge className="bg-rose-100 text-rose-700 border-none font-semibold px-2 h-5 text-[10px]">{filtered.length}</Badge>
                            </h2>
                        </div>

                        {filtered.length === 0 ? (
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                                <CardContent className="p-10 text-center">
                                    <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                    <p className="text-[14px] font-semibold text-slate-700">No at-risk leads match your filters</p>
                                    <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {filtered.map((lead) => (
                                    <Card key={lead.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white group hover:ring-rose-200 transition-all overflow-hidden relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 animate-pulse" />
                                        <CardContent className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="p-3 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                                                    <Flame size={20} />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h4 className="text-[15px] font-semibold text-slate-900">{lead.lead}</h4>
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 flex-wrap">
                                                        <span>Policy: <span className="text-slate-900 font-semibold">{lead.policy}</span></span>
                                                        <span>•</span>
                                                        <span>Owner: <span className="text-indigo-600 font-semibold">{lead.owner}</span></span>
                                                        <span>•</span>
                                                        <span>Score: <span className="text-emerald-600 font-semibold">{lead.score}</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right flex flex-col items-end gap-1">
                                                    <span className="text-[10px] font-semibold text-rose-600 tracking-wider">Time Remaining</span>
                                                    <Badge className="bg-rose-50 text-rose-700 border border-rose-100 font-semibold text-[14px] tabular-nums px-3 h-8 flex items-center gap-2 rounded-none">
                                                        <Clock size={14} /> {lead.timeRemaining}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    onClick={() => openReassign(lead)}
                                                    className="h-9 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] uppercase tracking-wider px-4 rounded-none"
                                                >
                                                    <UserCheck className="h-3.5 w-3.5 mr-1" /> Reassign
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Side-bars */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/10">
                            <CardTitle className="text-[16px] font-semibold">Recent Breaches</CardTitle>
                            <CardDescription className="text-[11px] font-medium text-slate-500 tracking-wider">Last 60 Minutes</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {RECENT_BREACHES.map((b) => (
                                <div key={b.id} className="p-3 rounded-none bg-slate-50 border border-slate-100 space-y-3 group hover:bg-white hover:shadow-sm transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5 min-w-0">
                                            <h5 className="text-[13px] font-semibold text-slate-900 truncate">{b.lead}</h5>
                                            <p className="text-[10px] font-medium text-slate-500">{b.policy}</p>
                                        </div>
                                        <Badge className={`border-none font-semibold text-[9px] h-4.5 px-1.5 uppercase ${b.severity === 'Critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>{b.severity}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-[12px] font-semibold">
                                        <span className="text-slate-500">Total Delay</span>
                                        <span className="text-rose-600 tabular-nums">{b.delay}</span>
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                onClick={() => router.push("/lead-management/routing/breach-log")}
                                className="w-full text-indigo-600 font-semibold tracking-wider uppercase text-[10px] h-9 hover:bg-indigo-50 flex items-center justify-center gap-2 mt-2 rounded-none"
                            >
                                <History size={14} /> View Full Breach Log
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-emerald-50 text-emerald-900 p-6 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-white text-emerald-600">
                                <TrendingUp size={20} />
                            </div>
                            <h4 className="text-[16px] font-semibold">SLA Performance Delta</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-emerald-700 tracking-wider">This Week</p>
                                <h4 className="text-[20px] font-semibold text-emerald-700 tabular-nums">94.2%</h4>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-emerald-700 tracking-wider">Last Week</p>
                                <h4 className="text-[20px] font-semibold text-emerald-700/60 line-through decoration-rose-300 tabular-nums">88.1%</h4>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="text-[12px] text-emerald-700 leading-relaxed font-medium italic">
                                "Consistency is improving. High-Intent leads are being picked up 15% faster since Tuesday's rule update."
                            </p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50 border-indigo-100 p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-semibold text-indigo-900">Compliance by Segment</h4>
                            <PieChart size={16} className="text-indigo-600" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Enterprise", val: 98, color: "bg-indigo-500" },
                                { label: "SMB / Mid-Market", val: 74, color: "bg-amber-500" },
                                { label: "General Inbound", val: 82, color: "bg-emerald-500" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-semibold tracking-wider text-indigo-900">
                                        <span>{s.label}</span>
                                        <span className="tabular-nums">{s.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color}`} style={{ width: `${s.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>

            {/* Reassign Side Form */}
            <SideFormSheet
                open={reassignOpen}
                onOpenChange={setReassignOpen}
                title={activeLead ? `Reassign ${activeLead.lead}` : "Reassign Lead"}
                description="Move this at-risk lead to a different owner before SLA breach."
                icon={<UserCheck className="h-5 w-5" />}
                accentColor="#e11d48"
                onSubmit={submitReassign}
                submitLabel="Reassign Lead"
                width="md"
            >
                <div className="space-y-5">
                    {activeLead && (
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-none space-y-1">
                            <p className="text-[11px] font-semibold text-slate-500">Current Owner: <span className="text-slate-900">{activeLead.owner}</span></p>
                            <p className="text-[11px] font-semibold text-slate-500">Policy: <span className="text-slate-900">{activeLead.policy}</span></p>
                            <p className="text-[11px] font-semibold text-rose-600">Time Left: {activeLead.timeRemaining}</p>
                        </div>
                    )}

                    <Field label="New Owner" required error={reassignErrors.newOwner} hint="Rep name or email.">
                        <Input
                            name="newOwner"
                            value={reassignForm.newOwner}
                            onChange={(e) => setReassignForm({ ...reassignForm, newOwner: e.target.value })}
                            placeholder="e.g., Sarah Jenkins"
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Reason" required error={reassignErrors.reason} hint="Why this manual reassignment is needed.">
                        <Input
                            name="reason"
                            value={reassignForm.reason}
                            onChange={(e) => setReassignForm({ ...reassignForm, reason: e.target.value })}
                            placeholder="e.g., Original owner offline"
                            className="h-10 rounded-none"
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    )
}
