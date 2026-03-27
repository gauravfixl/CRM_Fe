"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Filter,
    Download,
    Shield,
    Activity,
    LogIn,
    Settings,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

interface AuditEvent {
    id: string;
    timestamp: string;
    activity: string;
    category: "Authentication" | "Configuration" | "Security" | "Data";
    user: string;
    ip: string;
    status: "Success" | "Failed" | "Warning" | "Alert";
}

const initialEvents: AuditEvent[] = [
    { id: "1", timestamp: "Mar 27, 2026 10:23 AM", activity: "User Login", category: "Authentication", user: "admin@company.com", ip: "192.168.1.100", status: "Success" },
    { id: "2", timestamp: "Mar 27, 2026 10:15 AM", activity: "Role Updated", category: "Configuration", user: "hr.manager@company.com", ip: "192.168.1.105", status: "Success" },
    { id: "3", timestamp: "Mar 27, 2026 09:58 AM", activity: "Failed Login Attempt", category: "Security", user: "unknown@external.com", ip: "45.33.22.11", status: "Failed" },
    { id: "4", timestamp: "Mar 27, 2026 09:45 AM", activity: "Permission Changed", category: "Configuration", user: "admin@company.com", ip: "192.168.1.100", status: "Success" },
    { id: "5", timestamp: "Mar 27, 2026 09:30 AM", activity: "Data Export", category: "Data", user: "analyst@company.com", ip: "192.168.1.112", status: "Success" },
    { id: "6", timestamp: "Mar 27, 2026 09:12 AM", activity: "API Key Generated", category: "Security", user: "dev@company.com", ip: "192.168.1.108", status: "Success" },
    { id: "7", timestamp: "Mar 27, 2026 08:55 AM", activity: "User Login", category: "Authentication", user: "sales@company.com", ip: "10.0.0.55", status: "Success" },
    { id: "8", timestamp: "Mar 27, 2026 08:40 AM", activity: "Module Disabled", category: "Configuration", user: "admin@company.com", ip: "192.168.1.100", status: "Success" },
    { id: "9", timestamp: "Mar 27, 2026 08:22 AM", activity: "Bulk Delete", category: "Data", user: "admin@company.com", ip: "192.168.1.100", status: "Warning" },
    { id: "10", timestamp: "Mar 27, 2026 08:05 AM", activity: "Suspicious IP Blocked", category: "Security", user: "system", ip: "103.45.67.89", status: "Alert" },
];

type CategoryFilter = "All" | "Authentication" | "Configuration" | "Security" | "Data";

const categoryBadgeStyles: Record<AuditEvent["category"], string> = {
    Authentication: "bg-primary/10 text-primary border-primary/20",
    Configuration: "bg-purple-100 text-purple-700 border-purple-200",
    Security: "bg-red-100 text-red-700 border-red-200",
    Data: "bg-amber-100 text-amber-700 border-amber-200",
};

const statusStyles: Record<AuditEvent["status"], string> = {
    Success: "text-green-600",
    Failed: "text-red-600",
    Warning: "text-amber-600",
    Alert: "text-red-600",
};

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");

    const filteredEvents = useMemo(() => {
        return initialEvents.filter((event) => {
            const matchesSearch =
                searchQuery === "" ||
                event.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.ip.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                categoryFilter === "All" || event.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, categoryFilter]);

    const cycleCategoryFilter = () => {
        setCategoryFilter((prev) => {
            if (prev === "All") return "Authentication";
            if (prev === "Authentication") return "Configuration";
            if (prev === "Configuration") return "Security";
            if (prev === "Security") return "Data";
            return "All";
        });
    };

    const handleExport = () => {
        showSuccess("Audit logs exported successfully");
    };

    const totalEvents = initialEvents.length;
    const loginEvents = initialEvents.filter((e) => e.category === "Authentication").length;
    const configChanges = initialEvents.filter((e) => e.category === "Configuration").length;
    const securityAlerts = initialEvents.filter((e) => e.category === "Security").length;

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-sm text-gray-600">Monitor all system activities, user actions, and security events across your organization.</p>
                </div>
                <Button
                    onClick={handleExport}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Download size={16} /> Export
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-xs opacity-80">Total Events</p>
                    <p className="text-white text-xl font-semibold mt-1">{totalEvents}</p>
                    <p className="text-white text-[10px] mt-1">All recorded activities</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Login Events</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{loginEvents}</p>
                    <p className="text-green-600 text-[10px] mt-1">Authentication activity</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Config Changes</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{configChanges}</p>
                    <p className="text-purple-600 text-[10px] mt-1">System modifications</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Security Alerts</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{securityAlerts}</p>
                    <p className="text-amber-600 text-[10px] mt-1">Require attention</p>
                </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search by activity, user, IP address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={cycleCategoryFilter}
                            className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none"
                        >
                            <Filter size={14} /> Filter
                            {categoryFilter !== "All" && (
                                <Badge className={`ml-1 rounded-none text-[10px] font-bold px-2 py-0.5 border-none text-white ${
                                    categoryFilter === "Authentication" ? "bg-primary" :
                                    categoryFilter === "Configuration" ? "bg-purple-600" :
                                    categoryFilter === "Security" ? "bg-red-600" :
                                    "bg-amber-500"
                                }`}>
                                    {categoryFilter}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Activity</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Initiated By</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">IP Address</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Activity size={40} className="text-zinc-300" />
                                            <p className="text-sm font-bold text-gray-500">No audit events found</p>
                                            <p className="text-xs text-gray-400">
                                                {searchQuery || categoryFilter !== "All"
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "No events have been recorded yet"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{event.timestamp}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-none border transition-all ${
                                                    event.category === "Authentication" ? "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-white" :
                                                    event.category === "Configuration" ? "bg-purple-100 text-purple-600 border-purple-200 group-hover:bg-purple-600 group-hover:text-white" :
                                                    event.category === "Security" ? "bg-red-100 text-red-600 border-red-200 group-hover:bg-red-600 group-hover:text-white" :
                                                    "bg-amber-100 text-amber-600 border-amber-200 group-hover:bg-amber-600 group-hover:text-white"
                                                }`}>
                                                    {event.category === "Authentication" && <LogIn size={18} />}
                                                    {event.category === "Configuration" && <Settings size={18} />}
                                                    {event.category === "Security" && <Shield size={18} />}
                                                    {event.category === "Data" && <Activity size={18} />}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{event.activity}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`rounded-none text-[10px] font-bold px-2 py-0.5 border ${categoryBadgeStyles[event.category]}`}>
                                                {event.category}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{event.user}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500 font-mono">{event.ip}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${statusStyles[event.status]}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
                    <p className="text-xs text-gray-500">
                        Showing {filteredEvents.length} of {totalEvents} audit events
                    </p>
                </div>
            </div>
        </div>
    );
}
