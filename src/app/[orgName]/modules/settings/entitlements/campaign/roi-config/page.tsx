"use client";

import React from "react";
import { DollarSign, TrendingUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Progress } from "@/shared/components/ui/progress";

export default function ROIConfigPage() {
    const configs = [
        { id: "1", metric: "Cost Per Lead", formula: "Total Spend / Leads", target: "$50", current: "$42", performance: 84, status: "Active" },
        { id: "2", metric: "Return on Ad Spend", formula: "Revenue / Ad Spend", target: "5:1", current: "6.2:1", performance: 124, status: "Active" },
        { id: "3", metric: "Customer Acquisition Cost", formula: "Total Spend / Customers", target: "$500", current: "$420", performance: 84, status: "Active" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">ROI Configuration</h1>
                    <p className="text-sm text-gray-600">Configure ROI metrics and targets for campaign performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">ROI Metrics</p>
                    <h2 className="text-white text-2xl font-bold">{configs.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Tracked</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Performance</p>
                    <h3 className="text-2xl font-bold text-gray-900">97%</h3>
                    <p className="text-green-600 text-xs mt-1">Of targets</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total ROI</p>
                    <h3 className="text-2xl font-bold text-gray-900">$2.4M</h3>
                    <p className="text-blue-600 text-xs mt-1">This quarter</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Best Performer</p>
                    <h3 className="text-2xl font-bold text-gray-900">ROAS</h3>
                    <p className="text-green-600 text-xs mt-1">124% of target</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-gray-900">ROI Metrics & Targets</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Metric</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Formula</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Target</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Current</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Performance</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {configs.map((config) => (
                                <tr key={config.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-none border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                <DollarSign size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{config.metric}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {config.formula}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Target size={12} className="text-gray-500" />
                                            <span className="text-sm font-bold text-gray-900">{config.target}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingUp size={12} className="text-green-600" />
                                            <span className="text-sm font-bold text-green-600">{config.current}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 min-w-[150px]">
                                            <Progress value={config.performance > 100 ? 100 : config.performance} className="h-2 rounded-none flex-1" />
                                            <span className={`text-xs font-bold ${config.performance >= 100 ? 'text-green-600' : config.performance >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>
                                                {config.performance}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Switch checked={config.status === "Active"} className="data-[state=checked]:bg-green-600" />
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
