"use client";

import React from "react";
import { AlertCircle, Clock, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function StagnationAlertsPage() {
    const alerts = [
        { id: "1", rule: "30 Days No Activity", threshold: "30 days", affectedDeals: 12, severity: "High", autoNotify: true, status: "Active" },
        { id: "2", rule: "Stuck in Proposal", threshold: "14 days", affectedDeals: 8, severity: "Medium", autoNotify: true, status: "Active" },
        { id: "3", rule: "No Contact Attempt", threshold: "7 days", affectedDeals: 24, severity: "Low", autoNotify: false, status: "Active" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Stagnation Alerts</h1>
                    <p className="text-sm text-gray-600">Monitor and alert on deals that are not progressing.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">Create Alert Rule</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Alert Rules</p>
                    <h2 className="text-white text-2xl font-bold">{alerts.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Active</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Stagnant Deals</p>
                    <h3 className="text-2xl font-bold text-gray-900">{alerts.reduce((sum, a) => sum + a.affectedDeals, 0)}</h3>
                    <p className="text-amber-600 text-xs mt-1">Needs attention</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Alerts Sent</p>
                    <h3 className="text-2xl font-bold text-gray-900">156</h3>
                    <p className="text-blue-600 text-xs mt-1">This month</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Recovery Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">68%</h3>
                    <p className="text-green-600 text-xs mt-1">Deals reactivated</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50"><h3 className="text-sm font-bold text-gray-900">Alert Rules</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Threshold</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Affected Deals</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Severity</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Auto Notify</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {alerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 text-red-600 rounded-none border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                <AlertCircle size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{alert.rule}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-gray-500" />
                                            <span className="text-sm text-gray-700">{alert.threshold}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingDown size={12} className="text-amber-600" />
                                            <span className="text-sm font-bold text-gray-900">{alert.affectedDeals}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${alert.severity === "High" ? "bg-red-600" : alert.severity === "Medium" ? "bg-amber-600" : "bg-blue-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {alert.severity}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {alert.autoNotify ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Disabled</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><Switch checked={alert.status === "Active"} className="data-[state=checked]:bg-green-600" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
