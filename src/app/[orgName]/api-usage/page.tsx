"use client";

import React, { useState, useMemo } from "react";
import {
    BarChart3,
    Search,
    Filter,
    Download,
    Clock,
    Activity,
    CheckCircle,
    Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

interface ApiEndpoint {
    id: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    requests: string;
    latency: string;
    errorRate: number;
    lastCalled: string;
}

type MethodFilter = "All" | "GET" | "POST" | "PUT" | "DELETE";

const initialData: ApiEndpoint[] = [
    { id: "1", endpoint: "/api/v1/users", method: "GET", requests: "245,120", latency: "45ms", errorRate: 0.2, lastCalled: "1 min ago" },
    { id: "2", endpoint: "/api/v1/users", method: "POST", requests: "12,450", latency: "120ms", errorRate: 1.5, lastCalled: "5 mins ago" },
    { id: "3", endpoint: "/api/v1/leads", method: "GET", requests: "189,300", latency: "65ms", errorRate: 0.1, lastCalled: "2 mins ago" },
    { id: "4", endpoint: "/api/v1/deals", method: "PUT", requests: "34,200", latency: "95ms", errorRate: 0.8, lastCalled: "10 mins ago" },
    { id: "5", endpoint: "/api/v1/contacts", method: "GET", requests: "156,780", latency: "52ms", errorRate: 0.3, lastCalled: "1 min ago" },
    { id: "6", endpoint: "/api/v1/reports", method: "POST", requests: "8,900", latency: "890ms", errorRate: 3.2, lastCalled: "15 mins ago" },
    { id: "7", endpoint: "/api/v1/auth/token", method: "POST", requests: "98,500", latency: "35ms", errorRate: 2.1, lastCalled: "30 secs ago" },
    { id: "8", endpoint: "/api/v1/webhooks", method: "DELETE", requests: "1,200", latency: "78ms", errorRate: 0.5, lastCalled: "1 hour ago" },
];

function getMethodBadgeClass(method: string): string {
    switch (method) {
        case "GET": return "bg-green-600 text-white border-none";
        case "POST": return "bg-primary text-white border-none";
        case "PUT": return "bg-amber-500 text-white border-none";
        case "DELETE": return "bg-red-600 text-white border-none";
        case "PATCH": return "bg-purple-600 text-white border-none";
        default: return "bg-zinc-500 text-white border-none";
    }
}

function getErrorRateClass(rate: number): string {
    if (rate < 1) return "text-green-600";
    if (rate < 3) return "text-amber-600";
    return "text-red-600";
}

function getLatencyClass(latency: string): string {
    const ms = parseInt(latency.replace("ms", ""), 10);
    if (ms < 100) return "text-green-600";
    if (ms < 500) return "text-amber-600";
    return "text-red-600";
}

export default function APIUsage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [methodFilter, setMethodFilter] = useState<MethodFilter>("All");

    const filteredEndpoints = useMemo(() => {
        return initialData.filter((item) => {
            const matchesSearch =
                searchQuery === "" ||
                item.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMethod =
                methodFilter === "All" || item.method === methodFilter;
            return matchesSearch && matchesMethod;
        });
    }, [searchQuery, methodFilter]);

    const cycleMethodFilter = () => {
        setMethodFilter((prev) => {
            if (prev === "All") return "GET";
            if (prev === "GET") return "POST";
            if (prev === "POST") return "PUT";
            if (prev === "PUT") return "DELETE";
            return "All";
        });
    };

    const handleExport = () => {
        showSuccess("API usage report exported successfully");
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">API Usage</h1>
                    <p className="text-sm text-gray-600">Track API request volumes, response times, and endpoint performance across your organization.</p>
                </div>
                <Button
                    onClick={handleExport}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Download size={16} /> Export Report
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="flex items-center justify-between">
                        <p className="text-white text-xs opacity-80">Total Requests 30d</p>
                        <Activity size={18} className="text-white opacity-60" />
                    </div>
                    <p className="text-white text-xl font-semibold mt-1">1.2M</p>
                    <p className="text-white text-[10px] mt-1">All endpoints combined</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-xs">Success Rate</p>
                        <CheckCircle size={18} className="text-green-500" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">99.4%</p>
                    <p className="text-green-600 text-[10px] mt-1">Across all endpoints</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-xs">Avg Response Time</p>
                        <Clock size={18} className="text-gray-400" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">124ms</p>
                    <p className="text-gray-500 text-[10px] mt-1">Median latency</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-xs">Active API Keys</p>
                        <Key size={18} className="text-gray-400" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">4</p>
                    <p className="text-gray-500 text-[10px] mt-1">Currently valid</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search by endpoint..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={cycleMethodFilter}
                            className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none"
                        >
                            <Filter size={14} /> Filter
                            {methodFilter !== "All" && (
                                <Badge className={`ml-1 rounded-none text-[10px] font-bold px-2 py-0.5 ${getMethodBadgeClass(methodFilter)}`}>
                                    {methodFilter}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Endpoint</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Method</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Requests (30d)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Avg Latency</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Error Rate</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Last Called</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredEndpoints.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <BarChart3 size={40} className="text-zinc-300" />
                                            <p className="text-sm font-bold text-gray-500">No endpoints found</p>
                                            <p className="text-xs text-gray-400">
                                                Try adjusting your search or filter criteria
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEndpoints.map((item) => (
                                    <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 text-primary rounded-none border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <BarChart3 size={18} />
                                                </div>
                                                <code className="text-sm font-bold text-gray-900 font-mono">{item.endpoint}</code>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`rounded-none text-[10px] font-bold px-2 py-0.5 ${getMethodBadgeClass(item.method)}`}>
                                                {item.method}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">{item.requests}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${getLatencyClass(item.latency)}`}>
                                                {item.latency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${getErrorRateClass(item.errorRate)}`}>
                                                {item.errorRate}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                                <Clock size={12} className="text-primary" /> {item.lastCalled}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {filteredEndpoints.length} of {initialData.length} endpoints</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Activity size={14} className="text-primary" />
                        Read-only monitoring view
                    </div>
                </div>
            </div>
        </div>
    );
}
