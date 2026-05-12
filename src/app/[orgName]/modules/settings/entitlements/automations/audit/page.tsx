"use client";

import React, { useState } from "react";
import {
    FileText,
    Search,
    Filter,
    Clock,
    User,
    Download,
    ChevronRight,
    ChevronLeft,
    Activity,
    AlertCircle,
    CheckCircle2,
    Users,
    RefreshCw,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterAction, setFilterAction] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [logs] = useState([
        { id: "1", action: "Created Workflow", user: "Admin", workflow: "Lead Auto-Assignment", timestamp: "2 mins ago", status: "Success", ip: "192.168.1.10" },
        { id: "2", action: "Modified Rule", user: "Sarah M.", workflow: "Email Notification", timestamp: "15 mins ago", status: "Success", ip: "192.168.1.22" },
        { id: "3", action: "Deleted Template", user: "John D.", workflow: "Task Escalation", timestamp: "1 hour ago", status: "Success", ip: "192.168.1.15" },
        { id: "4", action: "Failed Execution", user: "System", workflow: "Deal Stage Update", timestamp: "2 hours ago", status: "Failed", ip: "10.0.0.1" },
        { id: "5", action: "Permission Changed", user: "Admin", workflow: "User Role Update", timestamp: "3 hours ago", status: "Success", ip: "192.168.1.10" },
        { id: "6", action: "Quota Exceeded", user: "System", workflow: "API Rate Limit", timestamp: "4 hours ago", status: "Warning", ip: "10.0.0.1" },
        { id: "7", action: "Template Deployed", user: "Mike R.", workflow: "Invoice Generator", timestamp: "5 hours ago", status: "Success", ip: "192.168.1.33" },
        { id: "8", action: "Error Handler Triggered", user: "System", workflow: "Data Sync", timestamp: "6 hours ago", status: "Failed", ip: "10.0.0.1" },
        { id: "9", action: "Workflow Enabled", user: "Lisa K.", workflow: "Lead Scoring", timestamp: "8 hours ago", status: "Success", ip: "192.168.1.45" },
        { id: "10", action: "Bulk Import", user: "Admin", workflow: "Contact Import", timestamp: "12 hours ago", status: "Success", ip: "192.168.1.10" },
        { id: "11", action: "Scheduled Task", user: "System", workflow: "Daily Report", timestamp: "1 day ago", status: "Success", ip: "10.0.0.1" },
        { id: "12", action: "API Key Rotated", user: "Admin", workflow: "Security Update", timestamp: "1 day ago", status: "Success", ip: "192.168.1.10" },
    ]);

    const handleExport = () => {
        const csvContent = "Action,User,Workflow,Timestamp,Status,IP\n" +
            logs.map(l => `${l.action},${l.user},${l.workflow},${l.timestamp},${l.status},${l.ip}`).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "audit_logs.csv";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Audit logs exported successfully");
    };

    const handleRefresh = () => {
        toast.success("Logs refreshed");
    };

    const filteredLogs = logs.filter(l => {
        const matchSearch = l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.workflow.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = filterStatus === "all" || l.status === filterStatus;
        const matchAction = filterAction === "all" || l.action.includes(filterAction);
        return matchSearch && matchStatus && matchAction;
    });

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const successCount = logs.filter(l => l.status === "Success").length;
    const failedCount = logs.filter(l => l.status === "Failed").length;
    const uniqueUsers = [...new Set(logs.map(l => l.user))].length;

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-outfit p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-slate-600 to-zinc-700 flex items-center justify-center text-white shadow-lg">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Automation Audit Logs</h1>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Track all automation-related activities and changes.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh} className="h-10 rounded-xl text-[11px] font-semibold border-zinc-200 dark:border-zinc-800">
                        <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
                    </Button>
                    <Button onClick={handleExport} className="h-10 rounded-xl text-[11px] font-semibold bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-1.5" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none rounded-none shadow-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white opacity-80">Total Events</p>
                            <p className="text-xl font-semibold text-white mt-1">1,204</p>
                            <p className="text-[10px] text-white/80 mt-1">Last 30 days</p>
                        </div>
                        <Activity className="w-6 h-6 text-white/80" />
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Successful</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{successCount}</span>
                            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Events logged</span>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-none flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Failed Actions</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{failedCount}</span>
                            <span className="text-[10px] text-amber-600 font-medium mt-1 block">Needs review</span>
                        </div>
                        <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-none flex items-center justify-center">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Active Users</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{uniqueUsers}</span>
                            <span className="text-[10px] text-blue-600 font-medium mt-1 block">This week</span>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-none flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Logs Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row gap-3 justify-between items-center bg-zinc-50/20 dark:bg-zinc-900/50">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="pl-10 rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800 w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Success">Success</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                                <SelectItem value="Warning">Warning</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterAction} onValueChange={(v) => { setFilterAction(v); setCurrentPage(1); }}>
                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800 w-[160px]">
                                <Filter size={14} className="mr-2 text-zinc-400" />
                                <SelectValue placeholder="Action type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="Created">Created</SelectItem>
                                <SelectItem value="Modified">Modified</SelectItem>
                                <SelectItem value="Deleted">Deleted</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                                <SelectItem value="Permission">Permission</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-5 py-3 text-[11px] font-medium text-zinc-500">Action</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">User</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Workflow</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Timestamp</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">IP Address</th>
                                <th className="py-3 pr-5 text-[11px] font-medium text-zinc-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl border transition-all ${log.status === "Failed" ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100 dark:border-rose-800" :
                                                log.status === "Warning" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800" :
                                                    "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-100 dark:border-zinc-700"
                                                }`}>
                                                <FileText size={16} />
                                            </div>
                                            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{log.action}</p>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                                            <User size={12} /> {log.user}
                                        </div>
                                    </td>
                                    <td className="py-3"><span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{log.workflow}</span></td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                                            <Clock size={12} /> {log.timestamp}
                                        </div>
                                    </td>
                                    <td className="py-3"><span className="text-[10px] text-zinc-400 font-mono">{log.ip}</span></td>
                                    <td className="py-3 pr-5">
                                        <Badge className={`rounded-full text-[9px] font-medium px-2 py-0.5 border-0 ${log.status === "Success" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" :
                                            log.status === "Warning" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600" :
                                                "bg-rose-50 dark:bg-rose-900/20 text-rose-600"
                                            }`}>
                                            {log.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <p className="text-[11px] text-zinc-500 font-medium">
                        Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0 rounded-xl border-zinc-200 dark:border-zinc-700"
                        >
                            <ChevronLeft size={14} />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 p-0 rounded-xl text-[11px] ${page === currentPage ? "bg-blue-600 text-white" : "border-zinc-200 dark:border-zinc-700"}`}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0 rounded-xl border-zinc-200 dark:border-zinc-700"
                        >
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
