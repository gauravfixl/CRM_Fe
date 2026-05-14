"use client";

import React, { useState, useMemo } from "react";
import {
    AlertTriangle,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    XCircle,
    CheckCircle2,
    AlertOctagon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning } from "@/utils/toast";

interface ErrorAlert {
    id: string;
    timestamp: string;
    message: string;
    severity: "Critical" | "Error" | "Warning";
    source: string;
    status: "Open" | "Acknowledged" | "Resolved";
}

const initialData: ErrorAlert[] = [
    { id: "1", timestamp: "Mar 27, 2026 10:20 AM", message: "Database connection timeout", severity: "Critical", source: "Database Cluster", status: "Open" },
    { id: "2", timestamp: "Mar 27, 2026 10:15 AM", message: "API rate limit exceeded", severity: "Warning", source: "API Gateway", status: "Open" },
    { id: "3", timestamp: "Mar 27, 2026 09:58 AM", message: "Email delivery failed - SMTP timeout", severity: "Critical", source: "Email Service", status: "Acknowledged" },
    { id: "4", timestamp: "Mar 27, 2026 09:45 AM", message: "High memory usage detected (92%)", severity: "Warning", source: "App Server", status: "Open" },
    { id: "5", timestamp: "Mar 27, 2026 09:30 AM", message: "SSL certificate expiring in 7 days", severity: "Warning", source: "Load Balancer", status: "Acknowledged" },
    { id: "6", timestamp: "Mar 27, 2026 09:12 AM", message: "Failed webhook delivery after 3 retries", severity: "Error", source: "Webhook Service", status: "Resolved" },
    { id: "7", timestamp: "Mar 27, 2026 08:55 AM", message: "Disk space below 10% threshold", severity: "Critical", source: "File Storage", status: "Open" },
    { id: "8", timestamp: "Mar 27, 2026 08:30 AM", message: "Authentication service latency spike", severity: "Warning", source: "Auth Service", status: "Resolved" },
];

function getSeverityBadge(severity: ErrorAlert["severity"]) {
    switch (severity) {
        case "Critical":
            return "bg-red-100 text-red-700 border-0";
        case "Error":
            return "bg-orange-100 text-orange-700 border-0";
        case "Warning":
            return "bg-amber-100 text-amber-700 border-0";
    }
}

function getStatusBadge(status: ErrorAlert["status"]) {
    switch (status) {
        case "Open":
            return "bg-transparent text-red-600 border-red-300";
        case "Acknowledged":
            return "bg-transparent text-amber-600 border-amber-300";
        case "Resolved":
            return "bg-transparent text-green-600 border-green-300";
    }
}

export default function ErrorsAlertsPage() {
    const [alerts, setAlerts] = useState<ErrorAlert[]>(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [severityFilter, setSeverityFilter] = useState<"All" | "Critical" | "Error" | "Warning">("All");

    const filteredAlerts = useMemo(() => {
        return alerts.filter((a) => {
            const matchesSearch =
                searchQuery === "" ||
                a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.source.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSeverity =
                severityFilter === "All" || a.severity === severityFilter;
            return matchesSearch && matchesSeverity;
        });
    }, [alerts, searchQuery, severityFilter]);

    const totalCount = alerts.length;
    const criticalCount = alerts.filter((a) => a.severity === "Critical").length;
    const warningCount = alerts.filter((a) => a.severity === "Warning").length;
    const resolvedCount = alerts.filter((a) => a.status === "Resolved").length;

    const cycleSeverityFilter = () => {
        setSeverityFilter((prev) => {
            if (prev === "All") return "Critical";
            if (prev === "Critical") return "Error";
            if (prev === "Error") return "Warning";
            return "All";
        });
    };

    const handleClearResolved = () => {
        const resolvedItems = alerts.filter((a) => a.status === "Resolved");
        if (resolvedItems.length === 0) {
            showWarning("No resolved items to clear");
            return;
        }
        setAlerts((prev) => prev.filter((a) => a.status !== "Resolved"));
        showSuccess(`Cleared ${resolvedItems.length} resolved item${resolvedItems.length > 1 ? "s" : ""}`);
    };

    const handleAcknowledge = (id: string) => {
        setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "Acknowledged" as const } : a))
        );
        showSuccess("Alert acknowledged");
    };

    const handleResolve = (id: string) => {
        setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "Resolved" as const } : a))
        );
        showSuccess("Alert resolved");
    };

    const handleReopen = (id: string) => {
        setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "Open" as const } : a))
        );
        showWarning("Alert reopened");
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Errors & Alerts</h1>
                    <p className="text-sm text-gray-600">
                        View recent system errors, integration failures, and platform health alerts.
                    </p>
                </div>
                <Button
                    onClick={handleClearResolved}
                    className="rounded-none bg-primary hover:bg-primary/90 text-white"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Resolved
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Errors 24h - gradient primary */}
                <button
                    type="button"
                    onClick={() => setSeverityFilter("All")}
                    className={`rounded-none bg-gradient-to-br from-primary to-primary/80 p-5 text-white text-left cursor-pointer transition-all hover:shadow-lg ${severityFilter === "All" ? "ring-2 ring-primary/60 ring-offset-2" : ""}`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <AlertOctagon className="h-4 w-4 opacity-80" />
                        <span className="text-white text-xs opacity-80">Total Errors 24h</span>
                    </div>
                    <p className="text-white text-xl font-semibold mt-1">{totalCount}</p>
                </button>

                {/* Critical */}
                <button
                    type="button"
                    onClick={() => setSeverityFilter("Critical")}
                    className={`rounded-none border bg-white p-5 text-left cursor-pointer transition-all hover:shadow-md ${severityFilter === "Critical" ? "ring-2 ring-red-500" : ""}`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-gray-600 text-xs">Critical</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{criticalCount}</p>
                </button>

                {/* Warnings */}
                <button
                    type="button"
                    onClick={() => setSeverityFilter("Warning")}
                    className={`rounded-none border bg-white p-5 text-left cursor-pointer transition-all hover:shadow-md ${severityFilter === "Warning" ? "ring-2 ring-amber-500" : ""}`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-gray-600 text-xs">Warnings</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{warningCount}</p>
                </button>

                {/* Resolved */}
                <div className="rounded-none border bg-white p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600 text-xs">Resolved</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{resolvedCount}</p>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by message or source..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 rounded-none"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={cycleSeverityFilter}
                    className="rounded-none gap-2"
                >
                    <Filter className="h-4 w-4" />
                    {severityFilter}
                </Button>
            </div>

            {/* Table */}
            <div className="border rounded-none overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b text-left">
                            <th className="px-4 py-3 font-semibold text-gray-700">Timestamp</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Error Message</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Severity</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Source</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAlerts.map((alert) => (
                            <tr
                                key={alert.id}
                                className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                    {alert.timestamp}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {alert.message}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge className={`rounded-none font-medium ${getSeverityBadge(alert.severity)}`}>
                                        {alert.severity}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {alert.source}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline" className={`rounded-none font-medium ${getStatusBadge(alert.status)}`}>
                                        {alert.status}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-none">
                                            {alert.status === "Open" && (
                                                <DropdownMenuItem
                                                    onClick={() => handleAcknowledge(alert.id)}
                                                    className="rounded-none cursor-pointer"
                                                >
                                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                                    Acknowledge
                                                </DropdownMenuItem>
                                            )}
                                            {(alert.status === "Open" || alert.status === "Acknowledged") && (
                                                <DropdownMenuItem
                                                    onClick={() => handleResolve(alert.id)}
                                                    className="rounded-none cursor-pointer"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Resolve
                                                </DropdownMenuItem>
                                            )}
                                            {alert.status === "Resolved" && (
                                                <DropdownMenuItem
                                                    onClick={() => handleReopen(alert.id)}
                                                    className="rounded-none cursor-pointer"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reopen
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                        {filteredAlerts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                    No errors or alerts match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-500">
                Showing {filteredAlerts.length} of {alerts.length} errors & alerts
            </div>
        </div>
    );
}
