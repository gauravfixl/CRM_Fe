"use client"

import React from "react"
import {
    Workflow,
    ArrowRight,
    Network,
    CheckCircle2,
    Settings,
    Timer,
    AlertCircle,
    History,
    Lock,
    BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { useParams, useRouter } from "next/navigation"

export default function PipelineGovernancePage() {
    const params = useParams()
    const router = useRouter()

    const stagnationRules = [
        { stage: "Initial Capture", maxDays: "2 Days", alertTier: "L1 (Team)", action: "Auto-Reassign" },
        { stage: "Discovery Call", maxDays: "5 Days", alertTier: "L2 (Manager)", action: "Notification" },
        { stage: "Proposal Phase", maxDays: "10 Days", alertTier: "L3 (Executive)", action: "Manual Review" },
        { stage: "Closed Won", maxDays: "Indefinite", alertTier: "None", action: "None" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-outfit">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Workflow className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900 leading-none">Pipeline & Process Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Standardize institutional workflow stages, stagnation alerts, and cross-firm stage-probability rules.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-xl text-xs font-semibold border-slate-200">
                        Flow Schema
                    </Button>
                    <Button className="h-9 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700">
                        Validate Flows
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Global Workflows</p>
                                <p className="text-white text-xl font-semibold mt-1">124</p>
                                <p className="text-white text-[10px] mt-1">Active Institutional Nodes</p>
                            </div>
                            <Network className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Process Velocity</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">14d</p>
                                <Progress value={65} className="h-1 mt-2 bg-slate-100 [&>div]:bg-blue-600" />
                            </div>
                            <Timer className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Health State</p>
                                <p className="text-xl font-semibold text-emerald-600 mt-1">Optimal</p>
                                <p className="text-[10px] text-gray-500 mt-1">0 Flow Deadlocks</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Stagnation Alerts</p>
                                <p className="text-xl font-semibold text-rose-500 mt-1">08</p>
                                <p className="text-rose-500 text-[10px] mt-1">Review Required</p>
                            </div>
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Stagnation Monitoring Table */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Stage Stagnation Guardrails</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Governing institutional time limits per lifecycle stage.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-xs font-semibold text-slate-500 px-5">Standard Stage</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Max Hold Time</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Alert Tier</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Enforcement Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stagnationRules.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-sm font-semibold text-slate-700">{item.stage}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-slate-600">{item.maxDays}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-slate-500">{item.alertTier}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-full text-xs font-medium px-3 py-0.5 ${item.action === 'Auto-Reassign' ? 'bg-blue-600 text-white' :
                                                    item.action === 'None' ? 'bg-slate-100 text-slate-400 border-none' :
                                                        'bg-blue-50 text-blue-600 border-none'
                                                }`}>
                                                {item.action}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Automation Health */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-blue-500" /> Automation Status
                        </h3>
                        <div className="space-y-4">
                            {[
                                { protocol: "Stage Probability Sync", ok: true },
                                { protocol: "Trigger Validation", ok: true },
                                { protocol: "Cross-Firm Stages", ok: true },
                                { protocol: "Deadlock Detection", ok: true },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-medium text-slate-600">{p.protocol}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-xs font-semibold text-blue-600 mt-6 hover:no-underline">Configure Protocols <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    {/* Quick Access */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500" /> Visibility Guardrails
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {["Identity Scopes", "Stage Permissions", "Global Stage Mapping"].map((item) => (
                                <div key={item} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer group transition-all">
                                    <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600">{item}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Flow Integrity Ledger */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <History className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Institutional Flow Integrity Ledger</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Stage Compliance", val: "100%", meta: "All firms using master stages" },
                        { title: "Avg. Bottleneck", val: "0.2 Days", meta: "Discovery to proposal" },
                        { title: "Automation Sync", val: "Active", meta: "Propagated to 32 nodes" },
                    ].map((log, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-xs text-slate-500 font-medium">{log.title}</span>
                            <span className="text-lg font-semibold text-slate-900 mt-1">{log.val}</span>
                            <span className="text-[10px] text-blue-500 font-medium mt-1">{log.meta}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
