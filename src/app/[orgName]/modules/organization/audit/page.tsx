"use client"

import React from "react"
import {
    FileText,
    Search,
    Filter,
    Download,
    Calendar,
    User,
    Shield,
    Info,
    CheckCircle2,
    AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function OrgAuditPage() {
    const auditLogs = [
        { id: 1, action: "Login Success", module: "AUTH", user: "admin@fixl.io", ip: "192.168.1.1", status: "Success", time: "2 mins ago", detail: "Successful login from Chrome Window" },
        { id: 2, action: "Create Firm", module: "FIRM", user: "jane.smith@fixl.io", ip: "10.0.0.45", status: "Success", time: "45 mins ago", detail: "New business unit 'Dubai Office' created" },
        { id: 3, action: "Update Billing", module: "COMMERCIAL", user: "admin@fixl.io", ip: "192.168.1.1", status: "Warning", time: "2 hours ago", detail: "Changed post-paid limit from $1000 to $5000" },
        { id: 4, action: "Delete User", module: "SECURITY", user: "admin@fixl.io", ip: "192.168.1.1", status: "Critical", time: "Yesterday", detail: "Permanently removed user 'test_temp_user'" },
        { id: 5, action: "Policy Change", module: "GOVERNANCE", user: "jane.smith@fixl.io", ip: "10.0.0.45", status: "Success", time: "2 days ago", detail: "Enforced MFA Policy across organization" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit & Activity Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">A non-repudiable record of all administrative actions performed within this tenant.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Select Range
                    </Button>
                    <Button variant="outline" className="h-9 gap-2">
                        <Download className="w-4 h-4 text-slate-400" />
                        Export Log (.CSV)
                    </Button>
                </div>
            </div>

            {/* AUDIT SUMMARY */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white border-slate-200 shadow-sm flex items-center p-6 gap-6">
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Normal Activities</p>
                        <p className="text-2xl font-black text-slate-900">4,284</p>
                    </div>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm flex items-center p-6 gap-6">
                    <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">System Warnings</p>
                        <p className="text-2xl font-black text-slate-900">12</p>
                    </div>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm flex items-center p-6 gap-6">
                    <div className="p-4 bg-red-50 rounded-2xl text-red-600 border border-red-100">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Security Alerts</p>
                        <p className="text-2xl font-black text-slate-900">01</p>
                    </div>
                </Card>
            </div>

            {/* AUDIT TABLE */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-4">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-semibold">Audit Stream</CardTitle>
                        <CardDescription className="text-xs">Filter and search through the detailed action history.</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input placeholder="Search logs..." className="pl-10 h-9 w-64 text-xs border-slate-200" />
                        </div>
                        <Button variant="outline" size="icon" className="h-9 w-9 text-slate-500 border-slate-200">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-slate-100">
                                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-6 py-3">Timestamp / Action</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-3">Actor (Admin)</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-3 text-center">Severity</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-3">Source IP</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-3">Detailed Log</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {auditLogs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-slate-50/30 transition-colors border-slate-50">
                                    <TableCell className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-bold text-slate-800">{log.action}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{log.time} in <span className="font-bold text-blue-600">{log.module}</span></p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-700">{log.user}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={`text-[9px] h-4 px-1.5 border-0 font-black uppercase tracking-tighter ${log.status === "Success" ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" :
                                                log.status === "Warning" ? "bg-amber-50 text-amber-600 ring-1 ring-amber-100" :
                                                    "bg-red-50 text-red-600 ring-1 ring-red-100"
                                            }`}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-[10px] text-slate-500">
                                        {log.ip}
                                    </TableCell>
                                    <TableCell className="group">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="text-xs text-slate-600 truncate max-w-[250px]">{log.detail}</p>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-200 group-hover:text-blue-600 transition-colors">
                                                <Info className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
