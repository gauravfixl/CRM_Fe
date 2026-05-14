"use client";

import React, { useState, useMemo } from "react";
import {
    HeartPulse,
    Search,
    Filter,
    MoreVertical,
    RefreshCw,
    Activity,
    AlertTriangle,
    XCircle,
    CheckCircle2,
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
import { showSuccess } from "@/utils/toast";

interface Service {
    id: string;
    name: string;
    status: "Operational" | "Degraded" | "Down";
    uptime: number;
    responseTime: string;
    lastChecked: string;
}

const initialServices: Service[] = [
    { id: "1", name: "Authentication Service", status: "Operational", uptime: 99.99, responseTime: "45ms", lastChecked: "1 min ago" },
    { id: "2", name: "Database Cluster", status: "Operational", uptime: 99.98, responseTime: "12ms", lastChecked: "1 min ago" },
    { id: "3", name: "API Gateway", status: "Operational", uptime: 99.95, responseTime: "78ms", lastChecked: "2 mins ago" },
    { id: "4", name: "Email Service", status: "Degraded", uptime: 98.50, responseTime: "350ms", lastChecked: "3 mins ago" },
    { id: "5", name: "File Storage (S3)", status: "Operational", uptime: 99.99, responseTime: "22ms", lastChecked: "1 min ago" },
    { id: "6", name: "Search Engine", status: "Operational", uptime: 99.90, responseTime: "55ms", lastChecked: "2 mins ago" },
    { id: "7", name: "Cache (Redis)", status: "Operational", uptime: 100.00, responseTime: "3ms", lastChecked: "1 min ago" },
    { id: "8", name: "Notification Service", status: "Down", uptime: 95.20, responseTime: "Timeout", lastChecked: "5 mins ago" },
];

function getStatusColor(status: Service["status"]) {
    switch (status) {
        case "Operational":
            return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" };
        case "Degraded":
            return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" };
        case "Down":
            return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
    }
}

function getUptimeColor(uptime: number): string {
    if (uptime >= 99.9) return "text-green-600";
    if (uptime >= 99) return "text-primary";
    if (uptime >= 98) return "text-amber-600";
    return "text-red-600";
}

function getResponseTimeColor(responseTime: string): string {
    if (responseTime === "Timeout") return "text-red-600";
    const ms = parseInt(responseTime);
    if (isNaN(ms)) return "text-gray-600";
    if (ms < 100) return "text-green-600";
    if (ms < 300) return "text-amber-600";
    return "text-red-600";
}

export default function SystemHealthPage() {
    const [services] = useState<Service[]>(initialServices);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Operational" | "Degraded" | "Down">("All");

    const filteredServices = useMemo(() => {
        return services.filter((s) => {
            const matchesSearch =
                searchQuery === "" ||
                s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [services, searchQuery, statusFilter]);

    const operationalCount = services.filter((s) => s.status === "Operational").length;
    const degradedCount = services.filter((s) => s.status === "Degraded").length;
    const downCount = services.filter((s) => s.status === "Down").length;

    const cycleStatusFilter = () => {
        setStatusFilter((prev) => {
            if (prev === "All") return "Operational";
            if (prev === "Operational") return "Degraded";
            if (prev === "Degraded") return "Down";
            return "All";
        });
    };

    const handleCheckAll = () => {
        showSuccess("Health check initiated for all services");
    };

    const handleCheckNow = (name: string) => {
        showSuccess(`Health check initiated for ${name}`);
    };

    const handleViewLogs = (name: string) => {
        showSuccess(`Viewing logs for ${name}`);
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">System Health</h1>
                    <p className="text-sm text-gray-600">
                        Monitor the real-time status and uptime of core platform services and dependencies.
                    </p>
                </div>
                <Button
                    onClick={handleCheckAll}
                    className="rounded-none bg-primary hover:bg-primary/90 text-white"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check All
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Overall Uptime - gradient primary */}
                <button
                    type="button"
                    onClick={() => setStatusFilter("All")}
                    className={`bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white text-left cursor-pointer transition-all hover:shadow-2xl ${statusFilter === "All" ? "ring-2 ring-primary/60 ring-offset-2" : ""}`}
                >
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 opacity-80" />
                        <span className="text-white text-xs opacity-80">Overall Uptime</span>
                    </div>
                    <p className="text-white text-xl font-semibold mt-1">99.97%</p>
                </button>

                {/* Services Operational */}
                <button
                    type="button"
                    onClick={() => setStatusFilter("Operational")}
                    className={`bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl ${statusFilter === "Operational" ? "ring-2 ring-green-500" : ""}`}
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600 text-xs">Services Operational</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{operationalCount}</p>
                </button>

                {/* Degraded */}
                <button
                    type="button"
                    onClick={() => setStatusFilter("Degraded")}
                    className={`bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl ${statusFilter === "Degraded" ? "ring-2 ring-amber-500" : ""}`}
                >
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-gray-600 text-xs">Degraded</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{degradedCount}</p>
                </button>

                {/* Down */}
                <button
                    type="button"
                    onClick={() => setStatusFilter("Down")}
                    className={`bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl ${statusFilter === "Down" ? "ring-2 ring-red-500" : ""}`}
                >
                    <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-gray-600 text-xs">Down</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{downCount}</p>
                </button>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 rounded-none"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={cycleStatusFilter}
                    className="rounded-none gap-2"
                >
                    <Filter className="h-4 w-4" />
                    {statusFilter}
                </Button>
            </div>

            {/* Table */}
            <div className="border rounded-none overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b text-left">
                            <th className="px-4 py-3 font-semibold text-gray-700">Service Name</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Uptime %</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Response Time</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Last Checked</th>
                            <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((service) => {
                            const statusColor = getStatusColor(service.status);
                            const uptimeColor = getUptimeColor(service.uptime);
                            const rtColor = getResponseTimeColor(service.responseTime);

                            return (
                                <tr
                                    key={service.id}
                                    className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
                                >
                                    {/* Service Name with dot */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full shrink-0 ${statusColor.dot}`} />
                                            <span className="font-medium">{service.name}</span>
                                        </div>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={`rounded-none ${statusColor.bg} ${statusColor.text} border-0 font-medium`}
                                        >
                                            {service.status}
                                        </Badge>
                                    </td>

                                    {/* Uptime */}
                                    <td className={`px-4 py-3 font-medium ${uptimeColor}`}>
                                        {service.uptime.toFixed(2)}%
                                    </td>

                                    {/* Response Time */}
                                    <td className={`px-4 py-3 font-medium ${rtColor}`}>
                                        {service.responseTime}
                                    </td>

                                    {/* Last Checked */}
                                    <td className="px-4 py-3 text-gray-500">
                                        {service.lastChecked}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none">
                                                <DropdownMenuItem
                                                    onClick={() => handleCheckNow(service.name)}
                                                    className="rounded-none cursor-pointer"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Check Now
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleViewLogs(service.name)}
                                                    className="rounded-none cursor-pointer"
                                                >
                                                    <HeartPulse className="h-4 w-4 mr-2" />
                                                    View Logs
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredServices.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                    No services match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-500">
                Showing {filteredServices.length} of {services.length} services
            </div>
        </div>
    );
}
