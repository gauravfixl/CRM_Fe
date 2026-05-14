"use client"

import React from "react"
import {
    FolderKanban,
    Workflow,
    Lock,
    ArrowRight,
    Activity,
    BarChart3,
    AlertTriangle,
    ShieldAlert,
    Building2,
    CheckCircle2,
    Settings
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

export default function ProjectGovernancePage() {
    const params = useParams()
    const router = useRouter()

    const slaStandards = [
        { priority: "Urgent (P0)", response: "30 Mins", resolution: "4 Hours", status: "Active" },
        { priority: "High (P1)", response: "2 Hours", resolution: "24 Hours", status: "Active" },
        { priority: "Medium (P2)", response: "1 Business Day", resolution: "3 Days", status: "Active" },
        { priority: "Low (P3)", response: "2 Business Days", resolution: "7 Days", status: "Review" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-outfit">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FolderKanban className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900 leading-none">Project Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Standardize execution frameworks, task delivery SLAs, and lifecycle monitoring.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-xl text-xs font-semibold border-slate-200">
                        Workflow Schema
                    </Button>
                    <Button className="h-9 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700">
                        Institutional Sync
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/project-management/projects`)}
                    className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Global Velocity</p>
                                <p className="text-white text-xl font-semibold mt-1">42</p>
                                <p className="text-white text-[10px] mt-1">Sprints Unified / Month</p>
                            </div>
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/sla`)}
                    className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Sla Compliance</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">88.2%</p>
                                <Progress value={88} className="h-1 mt-2 bg-slate-100 [&>div]:bg-blue-600" />
                            </div>
                            <ShieldAlert className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/projects/workspaces`)}
                    className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Units</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">32</p>
                                <p className="text-green-600 text-[10px] mt-1">Stable Nodes</p>
                            </div>
                            <Building2 className="w-5 h-5 text-green-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/projects/tasks`)}
                    className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Overdue Tasks</p>
                                <p className="text-xl font-semibold text-rose-500 mt-1">124</p>
                                <p className="text-rose-500 text-[10px] mt-1">Attention Needed</p>
                            </div>
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Institutional Response Standards (Sla)</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Governing maximum response and resolution times by priority.</p>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-xs font-semibold text-slate-500 px-5">Priority Level</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Response Target</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Resolution Target</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Governance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {slaStandards.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-sm font-semibold text-slate-700">{item.priority}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-slate-600">{item.response}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-slate-600">{item.resolution}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-full text-xs font-medium px-3 py-0.5 ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-slate-100 text-slate-400 border-none'}`}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Workflow className="w-4 h-4 text-blue-500" /> Master Workflow
                        </h3>
                        <div className="space-y-4">
                            {[
                                { stage: "Backlog", status: "Open" },
                                { stage: "Analysis", status: "Active" },
                                { stage: "Execution", status: "Active" },
                                { stage: "Institutional Qa", status: "Active" },
                                { stage: "Archive", status: "Locked" },
                            ].map((stage, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${stage.status === 'Open' ? 'bg-slate-300' : stage.status === 'Active' ? 'bg-blue-500' : 'bg-slate-900'}`} />
                                    <div className="flex-1 flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-600">{stage.stage}</span>
                                        <span className="text-xs font-medium text-slate-400">{stage.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-xs font-semibold text-blue-600 mt-6 hover:no-underline">Edit Master Schema <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500" /> Guardrails
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["Permissions", "Workspaces", "Archival", "Timesheets"].map((item) => (
                                <div key={item} className="p-3 rounded-lg border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                                    <p className="text-xs font-medium text-slate-500 group-hover:text-blue-500 leading-tight">{item}</p>
                                    <Settings className="w-3.5 h-3.5 text-slate-200 group-hover:text-blue-400 mt-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* System Integrity Ledger */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-slate-900 tracking-tight">System Integrity Ledger</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Last Archival", val: "12 Projects", meta: "Success - Jan 14" },
                        { title: "Permission Sync", val: "All Nodes", meta: "Nominal - 12m ago" },
                        { title: "Sla Violations", val: "08 Tasks", meta: "Review required" },
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
