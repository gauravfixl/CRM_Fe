"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    Download,
    Filter,
    Search,
    Calendar,
    User,
    Activity,
    AlertCircle,
    CheckCircle2,
    Info,
    AlertTriangle
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAuditLogsStore, type AuditLog, type AuditModule, type AuditAction } from "@/shared/data/audit-logs-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const AuditLogsPage = () => {
    const { toast } = useToast();
    const { logs, exportLogs } = useAuditLogsStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterModule, setFilterModule] = useState<AuditModule | 'All'>('All');
    const [filterSeverity, setFilterSeverity] = useState<AuditLog['severity'] | 'All'>('All');

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = filterModule === 'All' || log.module === filterModule;
        const matchesSeverity = filterSeverity === 'All' || log.severity === filterSeverity;
        return matchesSearch && matchesModule && matchesSeverity;
    });

    const handleExport = () => {
        const data = exportLogs();
        toast({ title: "Export Started", description: `Exporting ${data.length} audit logs...` });
        // In production, trigger CSV download
    };

    const getSeverityColor = (severity: AuditLog['severity']) => {
        const colors = {
            'Low': 'bg-slate-100 text-slate-600',
            'Medium': 'bg-blue-100 text-blue-700',
            'High': 'bg-amber-100 text-amber-700',
            'Critical': 'bg-rose-100 text-rose-700'
        };
        return colors[severity];
    };

    const getSeverityIcon = (severity: AuditLog['severity']) => {
        const icons = {
            'Low': <Info size={14} />,
            'Medium': <CheckCircle2 size={14} />,
            'High': <AlertTriangle size={14} />,
            'Critical': <AlertCircle size={14} />
        };
        return icons[severity];
    };

    const stats = [
        { label: "Total Logs", value: logs.length, color: "bg-[#CB9DF0]", icon: <Activity className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Critical Events", value: logs.filter(l => l.severity === 'Critical').length, color: "bg-rose-100", icon: <AlertCircle className="text-rose-600" />, textColor: "text-rose-900" },
        { label: "Unique Users", value: new Set(logs.map(l => l.userId)).size, color: "bg-[#F0C1E1]", icon: <User className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Today's Activity", value: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, color: "bg-emerald-100", icon: <Calendar className="text-emerald-600" />, textColor: "text-emerald-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
                    <p className="text-slate-500 font-medium">Monitor system activity and user actions for compliance.</p>
                </div>

                <Button
                    variant="outline"
                    className="rounded-xl h-12 border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                    onClick={handleExport}
                >
                    <Download className="mr-2 h-4 w-4" /> Export Logs
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search logs by user or description..."
                        className="pl-12 h-12 rounded-xl bg-white border-none shadow-sm font-medium"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterModule} onValueChange={(v) => setFilterModule(v as AuditModule | 'All')}>
                    <SelectTrigger className="rounded-xl h-12 bg-white border-none shadow-sm font-bold w-full md:w-48">
                        <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Modules</SelectItem>
                        <SelectItem value="Authentication">Authentication</SelectItem>
                        <SelectItem value="Roles & Permissions">Roles & Permissions</SelectItem>
                        <SelectItem value="Employees">Employees</SelectItem>
                        <SelectItem value="Attendance">Attendance</SelectItem>
                        <SelectItem value="Leave">Leave</SelectItem>
                        <SelectItem value="Payroll">Payroll</SelectItem>
                        <SelectItem value="Settings">Settings</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterSeverity} onValueChange={(v) => setFilterSeverity(v as AuditLog['severity'] | 'All')}>
                    <SelectTrigger className="rounded-xl h-12 bg-white border-none shadow-sm font-bold w-full md:w-40">
                        <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Levels</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Logs Table */}
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left p-4 font-black text-slate-900 uppercase tracking-wider text-xs">Timestamp</th>
                                <th className="text-left p-4 font-black text-slate-900 uppercase tracking-wider text-xs">User</th>
                                <th className="text-left p-4 font-black text-slate-900 uppercase tracking-wider text-xs">Action</th>
                                <th className="text-left p-4 font-black text-slate-900 uppercase tracking-wider text-xs">Module</th>
                                <th className="text-left p-4 font-black text-slate-900 uppercase tracking-wider text-xs">Description</th>
                                <th className="text-left p-4 font-black text-slate-900 uppercase tracking-wider text-xs">Severity</th>
                                <th className="text-left p-4 font-black text-slate-900 uppercase tracking-wider text-xs">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log, index) => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">
                                                {new Date(log.timestamp).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{log.userName}</span>
                                            <span className="text-xs text-slate-400 font-medium">{log.userRole}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge className="bg-indigo-100 text-indigo-700 border-none font-bold text-xs">
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-medium text-slate-600">{log.module}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-slate-700 font-medium line-clamp-2">{log.description}</span>
                                    </td>
                                    <td className="p-4">
                                        <Badge className={`${getSeverityColor(log.severity)} border-none font-bold text-xs flex items-center gap-1 w-fit`}>
                                            {getSeverityIcon(log.severity)}
                                            {log.severity}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs text-slate-400 font-mono">{log.ipAddress}</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {filteredLogs.length === 0 && (
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm">
                    <p className="text-slate-400 font-bold">No logs found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default AuditLogsPage;
