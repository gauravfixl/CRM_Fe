"use client"

import React from "react"
import {
    Users,
    Building2,
    UserCircle,
    Award,
    Clock,
    Lock,
    ArrowRight,
    Activity,
    AlertCircle,
    MoreHorizontal,
    FileText,
    ShieldCheck
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
import { toast } from "sonner"

export default function HRMGovernancePage() {

    const complianceChecks = [
        { task: "Legal Right to Work Verification", status: "Active", risk: "Low" },
        { task: "Monthly Payroll Tax Filing", status: "Pending", risk: "High" },
        { task: "Annual Skills Gap Assessment", status: "Active", risk: "Medium" },
        { task: "Gdpr Employee Consent Sync", status: "Overdue", risk: "Critical" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-outfit">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900 leading-none">Hrm Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Monitor workforce health, institutional compliance, and policy standards.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-xl text-xs font-semibold border-slate-200" onClick={() => toast.success("Audit report exported successfully")}>
                        Export Audit
                    </Button>
                    <Button className="h-9 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("Governance update published")}>
                        Publish Update
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Compliance Rate</p>
                                <p className="text-white text-xl font-semibold mt-1">92.4%</p>
                                <Progress value={92} className="h-1 mt-2 bg-blue-400 [&>div]:bg-white" />
                            </div>
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Pending Onboarding</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">14</p>
                                <p className="text-blue-500 text-[10px] mt-1">4 High Priority</p>
                            </div>
                            <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Policies</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">28</p>
                                <p className="text-green-600 text-[10px] mt-1">Stable</p>
                            </div>
                            <FileText className="w-5 h-5 text-green-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Security Risks</p>
                                <p className="text-xl font-semibold text-rose-500 mt-1">02</p>
                                <p className="text-rose-500 text-[10px] mt-1">Requires Action</p>
                            </div>
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Governance Compliance Checklist</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Monitor critical Hr legal and organizational tasks.</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4 text-slate-400" /></Button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-xs font-semibold text-slate-500 px-5">Standard Task</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Risk Level</TableHead>
                                    <TableHead className="text-right px-5"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {complianceChecks.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-sm font-semibold text-slate-700">{item.task}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-full text-xs font-medium px-3 py-0.5 ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none' :
                                                    item.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-none' :
                                                        'bg-rose-50 text-rose-600 border-none'
                                                }`}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.risk === 'Low' ? 'bg-emerald-500' :
                                                        item.risk === 'Medium' ? 'bg-amber-500' :
                                                            'bg-rose-500'
                                                    }`} />
                                                <span className="text-xs text-slate-500 font-medium">{item.risk}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right px-5">
                                            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 font-semibold hover:bg-blue-50/50" onClick={() => toast.info(`Viewing details for: ${item.task}`)}>Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500" /> Hr Access Control
                        </h3>
                        <div className="space-y-3">
                            {["Permissions", "Retention", "Archival"].map((item) => (
                                <div key={item} className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                                    <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600">{item} Settings</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" /> Recent Policy Logs
                        </h3>
                        <div className="space-y-4">
                            {[
                                { user: "Admin", action: "Updated Leave Policy", time: "2h ago" },
                                { user: "Hr Lead", action: "Created Job Template", time: "5h ago" },
                                { user: "System", action: "Auto-synced Skills Db", time: "1d ago" },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-700 leading-tight">{log.action}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{log.user} - {log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-xs font-semibold text-blue-600 mt-6 hover:no-underline" onClick={() => toast.info("Opening full policy ledger...")}>View Full Ledger <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
                {[
                    { title: "Departments", icon: Building2, count: "08" },
                    { title: "Job Roles", icon: UserCircle, count: "24" },
                    { title: "Skills", icon: Award, count: "112" },
                    { title: "Shift Rules", icon: Clock, count: "04" },
                ].map((std, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <std.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{std.title}</p>
                                <p className="text-xl font-semibold text-slate-900 leading-tight">{std.count}</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                ))}
            </div>
        </div>
    )
}
