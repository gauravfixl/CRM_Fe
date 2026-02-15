"use client";

import React from "react";
import { Send, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Progress } from "@/shared/components/ui/progress";

export default function DailySendLimitsPage() {
    const limits = [
        { id: "1", channel: "Email", dailyLimit: 10000, currentUsage: 7420, percentage: 74, status: "Active", throttle: true },
        { id: "2", channel: "SMS", dailyLimit: 5000, currentUsage: 3200, percentage: 64, status: "Active", throttle: true },
        { id: "3", channel: "Push Notifications", dailyLimit: 50000, currentUsage: 42000, percentage: 84, status: "Active", throttle: false },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Daily Send Limits</h1>
                    <p className="text-sm text-gray-600">Manage sending limits to prevent spam and ensure deliverability.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Active Channels</p>
                    <h2 className="text-white text-2xl font-bold">{limits.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">With limits</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Sent Today</p>
                    <h3 className="text-2xl font-bold text-gray-900">{limits.reduce((sum, l) => sum + l.currentUsage, 0).toLocaleString()}</h3>
                    <p className="text-blue-600 text-xs mt-1">Messages</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Usage</p>
                    <h3 className="text-2xl font-bold text-gray-900">74%</h3>
                    <p className="text-amber-600 text-xs mt-1">Of daily limits</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Throttling</p>
                    <h3 className="text-2xl font-bold text-gray-900">{limits.filter(l => l.throttle).length}</h3>
                    <p className="text-green-600 text-xs mt-1">Channels protected</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-gray-900">Channel Send Limits</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Channel</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Daily Limit</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Current Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Usage %</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Throttling</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {limits.map((limit) => (
                                <tr key={limit.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-none border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Send size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{limit.channel}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{limit.dailyLimit.toLocaleString()}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-gray-500" />
                                            <span className="text-sm font-bold text-gray-900">{limit.currentUsage.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2 min-w-[200px]">
                                            <div className="flex justify-between text-xs">
                                                <span className={`font-bold ${limit.percentage >= 90 ? 'text-red-600' : limit.percentage >= 75 ? 'text-amber-600' : 'text-green-600'}`}>
                                                    {limit.percentage}%
                                                </span>
                                                {limit.percentage >= 90 && (
                                                    <Badge className="bg-red-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                                                        <AlertTriangle size={10} /> Near Limit
                                                    </Badge>
                                                )}
                                            </div>
                                            <Progress
                                                value={limit.percentage}
                                                className={`h-2 rounded-none ${limit.percentage >= 90 ? 'bg-red-100' : limit.percentage >= 75 ? 'bg-amber-100' : 'bg-zinc-100'} [&>div]:${limit.percentage >= 90 ? 'bg-red-600' : limit.percentage >= 75 ? 'bg-amber-600' : 'bg-green-600'}`}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {limit.throttle ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Disabled</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Switch checked={limit.status === "Active"} className="data-[state=checked]:bg-green-600" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
