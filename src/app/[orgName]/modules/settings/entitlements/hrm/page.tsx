"use client"

import React from "react"
import {
    Users,
    Building2,
    UserCircle,
    Award,
    Clock,
    Calendar,
    CalendarClock,
    Lock,
    Shield,
    ArrowRight,
    Activity,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    FileText,
    ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
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

export default function HRMGovernancePage() {
    const params = useParams()
    const router = useRouter()

    const complianceChecks = [
        { task: "Legal Right to Work Verification", status: "Active", risk: "Low" },
        { task: "Monthly Payroll Tax Filing", status: "Pending", risk: "High" },
        { task: "Annual Skills GAP Assessment", status: "Active", risk: "Medium" },
        { task: "GDPR Employee Consent Sync", status: "Overdue", risk: "Critical" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">HRM Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Monitor workforce health, institutional compliance, and policy standards.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest border-slate-200">
                        Export Audit
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700">
                        Publish Update
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Compliance Rate</p>
                        <ShieldCheck className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-white">92.4%</p>
                        <Progress value={92} className="h-1 mt-2 bg-blue-400 [&>div]:bg-white" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Onboarding</p>
                        <Activity className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">14</p>
                        <p className="text-[10px] text-blue-500 font-bold mt-1">4 High Priority</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Policies</p>
                        <FileText className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">28</p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase italic">Stable</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Risks</p>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-rose-500">02</p>
                        <p className="text-[10px] text-rose-400 font-bold mt-1 uppercase italic">Requires Action</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COMPLIANCE STATUS TABLE */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-none shadow-sm flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Governance Compliance Checklist</h3>
                            <p className="text-[11px] text-slate-500">Monitor critical HR legal and organizational tasks.</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 h-4 text-slate-400" /></Button>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5">Standard Task</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Level</TableHead>
                                    <TableHead className="text-right px-5"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {complianceChecks.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700">{item.task}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-none text-[9px] font-black uppercase tracking-tighter px-2 leading-tight ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none' :
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
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">{item.risk}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right px-5">
                                            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-blue-600 font-bold uppercase hover:bg-blue-50/50">Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* POLICY NAVIGATION / RECENT UPDATES */}
                <div className="space-y-6">
                    {/* QUICK ACCESS TITLES (MINIFIED) */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500" /> HR Access Control
                        </h3>
                        <div className="space-y-3">
                            {["Permissions", "Retention", "Archival"].map((item) => (
                                <div key={item} className="group flex items-center justify-between p-3 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 uppercase">{item} Settings</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RECENT POLICY LOGS */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" /> Recent Policy Logs
                        </h3>
                        <div className="space-y-4">
                            {[
                                { user: "Admin", action: "Updated Leave Policy", time: "2h ago" },
                                { user: "HR Lead", action: "Created Job Template", time: "5h ago" },
                                { user: "System", action: "Auto-synced Skills DB", time: "1d ago" },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-700 leading-tight">{log.action}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{log.user} • {log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-6 hover:no-underline">View Full Ledger <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: OPERATIONAL STANDARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
                {[
                    { title: "Departments", icon: Building2, count: "08" },
                    { title: "Job Roles", icon: UserCircle, count: "24" },
                    { title: "Skills", icon: Award, count: "112" },
                    { title: "Shift Rules", icon: Clock, count: "04" },
                ].map((std, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-none p-5 flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <std.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{std.title}</p>
                                <p className="text-xl font-bold text-slate-900 leading-tight">{std.count}</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                ))}
            </div>
        </div>
    )
}
