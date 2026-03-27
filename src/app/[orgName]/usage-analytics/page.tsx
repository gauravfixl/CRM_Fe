"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Filter,
    Download,
    TrendingUp,
    TrendingDown,
    Minus,
    Users,
    Activity,
    BarChart3,
    PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { showSuccess } from "@/utils/toast";

interface ModuleUsage {
    id: string;
    module: string;
    users: number;
    sessions: string;
    avgTime: string;
    adoption: number;
    trend: "up" | "stable" | "down";
}

const initialData: ModuleUsage[] = [
    { id: "1", module: "CRM", users: 1845, sessions: "45,230", avgTime: "24 mins", adoption: 95, trend: "up" },
    { id: "2", module: "Project Management", users: 1230, sessions: "32,100", avgTime: "35 mins", adoption: 88, trend: "up" },
    { id: "3", module: "HRM", users: 980, sessions: "18,450", avgTime: "18 mins", adoption: 82, trend: "stable" },
    { id: "4", module: "Finance", users: 560, sessions: "12,800", avgTime: "22 mins", adoption: 75, trend: "up" },
    { id: "5", module: "Support Desk", users: 445, sessions: "28,900", avgTime: "15 mins", adoption: 68, trend: "down" },
    { id: "6", module: "Marketing", users: 320, sessions: "8,500", avgTime: "20 mins", adoption: 55, trend: "stable" },
    { id: "7", module: "Analytics", users: 210, sessions: "5,200", avgTime: "30 mins", adoption: 42, trend: "up" },
    { id: "8", module: "Inventory", users: 150, sessions: "3,800", avgTime: "12 mins", adoption: 35, trend: "down" },
];

const trendCycle: ("all" | "up" | "stable" | "down")[] = ["all", "up", "stable", "down"];

function getAdoptionColor(adoption: number): string {
    if (adoption >= 80) return "text-green-600";
    if (adoption >= 60) return "text-primary";
    if (adoption >= 40) return "text-amber-500";
    return "text-red-500";
}

function getAdoptionBarColor(adoption: number): string {
    if (adoption >= 80) return "bg-green-500";
    if (adoption >= 60) return "bg-primary";
    if (adoption >= 40) return "bg-amber-500";
    return "bg-red-500";
}

function TrendIndicator({ trend }: { trend: "up" | "stable" | "down" }) {
    if (trend === "up") {
        return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    if (trend === "down") {
        return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
}

export default function UsageAnalytics() {
    const [search, setSearch] = useState("");
    const [trendIndex, setTrendIndex] = useState(0);

    const trendFilter = trendCycle[trendIndex];

    const filteredData = useMemo(() => {
        return initialData.filter((item) => {
            const matchesSearch = item.module.toLowerCase().includes(search.toLowerCase());
            const matchesTrend = trendFilter === "all" || item.trend === trendFilter;
            return matchesSearch && matchesTrend;
        });
    }, [search, trendFilter]);

    const handleExport = () => {
        showSuccess("Usage analytics report exported successfully");
    };

    const cycleTrend = () => {
        setTrendIndex((prev) => (prev + 1) % trendCycle.length);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Usage Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Analyze user engagement, module adoption rates, and overall platform utilization.
                    </p>
                </div>
                <Button className="rounded-none" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users - gradient primary */}
                <div className="rounded-none bg-gradient-to-br from-primary to-primary/80 text-white p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-white text-xs opacity-80">Total Users</span>
                        <Users className="h-5 w-5 text-white/70" />
                    </div>
                    <p className="text-white text-xl font-semibold mt-1">2,847</p>
                </div>

                {/* Daily Active Users - white, green */}
                <div className="rounded-none border bg-white p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600 text-xs">Daily Active Users</span>
                        <Activity className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">1,245</p>
                </div>

                {/* Most Used Module - white */}
                <div className="rounded-none border bg-white p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600 text-xs">Most Used Module</span>
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">CRM</p>
                </div>

                {/* Platform Adoption - white, green */}
                <div className="rounded-none border bg-white p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600 text-xs">Platform Adoption</span>
                        <PieChart className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">87.5%</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-none border bg-white">
                {/* Toolbar */}
                <div className="flex items-center gap-3 p-4 border-b">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search modules..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 rounded-none"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-none"
                        onClick={cycleTrend}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Trend: {trendFilter.charAt(0).toUpperCase() + trendFilter.slice(1)}
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 font-medium">Module Name</th>
                                <th className="p-3 font-medium">Active Users</th>
                                <th className="p-3 font-medium">Sessions (30d)</th>
                                <th className="p-3 font-medium">Avg. Session Time</th>
                                <th className="p-3 font-medium">Adoption Rate %</th>
                                <th className="p-3 font-medium">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30">
                                    <td className="p-3">{item.module}</td>
                                    <td className="p-3 font-bold">{item.users.toLocaleString()}</td>
                                    <td className="p-3">{item.sessions}</td>
                                    <td className="p-3">{item.avgTime}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-medium ${getAdoptionColor(item.adoption)}`}>
                                                {item.adoption}%
                                            </span>
                                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getAdoptionBarColor(item.adoption)}`}
                                                    style={{ width: `${item.adoption}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <TrendIndicator trend={item.trend} />
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No modules found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t text-sm text-muted-foreground">
                    Showing {filteredData.length} of {initialData.length} modules
                </div>
            </div>
        </div>
    );
}
