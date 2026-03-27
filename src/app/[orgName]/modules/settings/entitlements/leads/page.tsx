"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Target,
    ListTree,
    Trash2,
    PieChart,
    Globe,
    CheckCircle,
    Settings,
    Download,
    UserCheck,
    ChartBar,
    Copy,
    Lock,
    Clock,
    ArrowRight,
    Activity,
    ShieldCheck,
    RefreshCcw,
    Workflow,
    Zap,
    Users,
    MousePointer2,
    Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { getLeadListByOrg } from "@/hooks/leadHooks"

interface Lead {
    _id: string
    LeadId: string
    name: string
    email: string
    company: string
    stage: string
    source: string
    estimatedValue: number
    assignedTo?: { email: string; name: string }
    isDeleted: boolean
    createdAt: string
}

export default function LeadGovernancePage() {
    const params = useParams()
    const router = useRouter()
    const [isSyncing, setIsSyncing] = useState(false)
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch leads on mount
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await getLeadListByOrg()
                setLeads(res?.data?.data || [])
            } catch (error) {
                console.error("Failed to fetch leads for governance:", error)
                setLeads([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchLeads()
    }, [])

    // Computed stats from real lead data
    const stats = useMemo(() => {
        const totalLeads = leads.length

        // Format total count for display (e.g. 14200 -> "14.2k")
        const formatCount = (count: number): string => {
            if (count >= 1000) {
                const val = (count / 1000).toFixed(1)
                return `${val}k`
            }
            return count.toString()
        }

        // Leads created in the last 24 hours
        const now = new Date()
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const recentLeads = leads.filter(
            (lead) => new Date(lead.createdAt) > twentyFourHoursAgo
        ).length

        // Avg. Conversion = percentage of "Won" or "Closed Won" leads
        const wonLeads = leads.filter(
            (lead) => lead.stage === "Won" || lead.stage === "Closed Won"
        ).length
        const conversionRate = totalLeads > 0
            ? ((wonLeads / totalLeads) * 100).toFixed(1)
            : "0.0"

        // Pipeline stage distribution for sidebar
        const stageCounts: Record<string, number> = {}
        leads.forEach((lead) => {
            const stage = lead.stage || "Unknown"
            stageCounts[stage] = (stageCounts[stage] || 0) + 1
        })

        return {
            masterRecords: formatCount(totalLeads),
            globalIngestion: recentLeads.toLocaleString(),
            conversionRate: `${conversionRate}%`,
            conversionValue: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
            stageCounts,
            totalLeads,
        }
    }, [leads])

    // Pipeline integrity stats derived from real stage data
    const pipelineIntegrity = useMemo(() => {
        const { totalLeads } = stats

        // "Standardized Stages" - percentage of leads that have a known/valid stage
        const knownStages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost", "Hold", "Closed Won", "Closed Lost"]
        const leadsWithKnownStage = leads.filter((l) => knownStages.includes(l.stage)).length
        const standardizedPct = totalLeads > 0 ? Math.round((leadsWithKnownStage / totalLeads) * 100) : 100

        // "Orphaned Leads" - leads with no assignedTo
        const orphanedCount = leads.filter((l) => !l.assignedTo).length

        return [
            { label: "Standardized Stages", val: `${standardizedPct}%`, ok: standardizedPct >= 90 },
            { label: "Custom Layouts Sync", val: "94%", ok: true },
            { label: "Field Mapping", val: "Clean", ok: true },
            { label: "Orphaned Leads", val: `${orphanedCount}`, ok: orphanedCount === 0 },
        ]
    }, [leads, stats])

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(res => setTimeout(res, 1200)), {
            loading: "Propagating leads governance to all units...",
            success: () => {
                setIsSyncing(false)
                return "Global lead standards synchronized."
            },
            error: "Sync failed."
        })
    }

    const assignmentRules = [
        { name: "Global Round Robin", scope: "International", status: "Active", volume: "42%" },
        { name: "Enterprise Territory", scope: "Americas", status: "Active", volume: "28%" },
        { name: "Direct Source Match", scope: "APAC", status: "Active", volume: "15%" },
        { name: "SDR Overflow", scope: "Global", status: "Standby", volume: "5%" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900 leading-none">Lead Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Govern lead capture, global distribution logic, and conversion standards across all firms.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className={`h-9 rounded-xl border-slate-200 text-xs font-medium px-6 shadow-sm hover:bg-slate-50 ${isSyncing ? 'animate-pulse' : ''}`}
                        onClick={handleSync}
                        disabled={isSyncing}
                    >
                        <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        Sync Standards
                    </Button>
                    <Button className="h-9 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700" onClick={() => toast.info("Capture API endpoint configured")}>
                        Capture Api
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Master Records</p>
                                <p className="text-white text-xl font-semibold mt-1">{isLoading ? "..." : stats.masterRecords}</p>
                                <p className="text-[10px] text-blue-100 font-medium mt-1">Cross-Firm Nexus</p>
                            </div>
                            <Users className="w-4 h-4 text-blue-200" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Global Ingestion</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{isLoading ? "..." : stats.globalIngestion}</p>
                                <p className="text-[10px] text-emerald-600 font-medium mt-1">Last 24 Hours</p>
                            </div>
                            <Activity className="w-4 h-4 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Duplicate Rate</p>
                                <p className="text-xl font-semibold text-rose-500 mt-1">2.1%</p>
                                <p className="text-[10px] text-gray-500 font-medium mt-1">Within Margin</p>
                            </div>
                            <Copy className="w-4 h-4 text-rose-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Avg. Conversion</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{isLoading ? "..." : stats.conversionRate}</p>
                                <Progress value={isLoading ? 0 : stats.conversionValue} className="h-1 mt-2 bg-slate-100 [&>div]:bg-blue-600" />
                            </div>
                            <MousePointer2 className="w-4 h-4 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN GOVERNANCE SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ASSIGNMENT RULES TABLE */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Lead Distribution Guardrails</h3>
                            <p className="text-[11px] text-slate-500">Governing how leads are routed to institutional sales nodes.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[11px] font-medium text-gray-500 px-5">Rule Protocol</TableHead>
                                    <TableHead className="text-[11px] font-medium text-gray-500">Institutional Scope</TableHead>
                                    <TableHead className="text-[11px] font-medium text-gray-500">Throughput</TableHead>
                                    <TableHead className="text-[11px] font-medium text-gray-500">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignmentRules.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-medium text-slate-700">{item.name}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-medium">{item.scope}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: item.volume }} />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-medium">{item.volume}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-xl text-[9px] font-medium px-2 leading-tight ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-slate-100 text-slate-400 border-none'
                                                }`}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* SIDEBAR WIDGETS */}
                <div className="lg:col-span-4 space-y-6">
                    {/* PIPELINE INTEGRITY */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Workflow className="w-4 h-4 text-blue-500" /> Pipeline Integrity
                        </h3>
                        <div className="space-y-4">
                            {pipelineIntegrity.map((stat, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-600">{stat.label}</span>
                                    <span className={`text-[10px] font-semibold ${stat.ok ? 'text-blue-500' : 'text-rose-500'}`}>{stat.val}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-xs font-medium text-blue-600 mt-6 hover:no-underline" onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/leads/pipelines`)}>Edit Master Pipelines <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    {/* SOURCE STANDARDS */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-blue-500" /> Lead Source Map
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["Direct Email", "Web Forms", "Zapier Sync", "CSV Imports"].map((item) => (
                                <div key={item} className="p-3 border border-slate-100 rounded-xl hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group" onClick={() => toast.info(`Configuring ${item} source settings`)}>
                                    <p className="text-[10px] font-medium text-slate-400 group-hover:text-blue-500 leading-tight">{item}</p>
                                    <Settings className="w-3.5 h-3.5 text-slate-200 group-hover:text-blue-400 mt-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AUDIT & COMPLIANCE */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <h3 className="text-sm font-medium text-gray-900">Privacy & Security Ledger</h3>
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-medium rounded-xl px-3 py-1">Standardized</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "PII Scrubbing", val: "Automated", meta: "GDPR Compliant" },
                        { title: "Retention Limit", val: "2 Years", meta: "Global Standard" },
                        { title: "Permission Sync", val: "Active", meta: "IdentityForge Linked" },
                    ].map((log, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[10px] font-medium text-slate-400">{log.title}</span>
                            <span className="text-lg font-semibold text-slate-900 mt-1">{log.val}</span>
                            <span className="text-[10px] text-blue-500 font-medium mt-1">{log.meta}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
