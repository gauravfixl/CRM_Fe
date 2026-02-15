"use client";

import React from "react";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Progress } from "@/shared/components/ui/progress";

export default function SpamProtectionPage() {
    const protections = [
        { id: "1", rule: "Unsubscribe Link Required", type: "Compliance", severity: "Critical", violations: 0, compliance: 100, status: "Active" },
        { id: "2", rule: "Spam Word Filter", type: "Content", severity: "High", violations: 12, compliance: 94, status: "Active" },
        { id: "3", rule: "Bounce Rate Monitor", type: "Deliverability", severity: "Medium", violations: 3, compliance: 98, status: "Active" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Spam Protection</h1>
                    <p className="text-sm text-gray-600">Ensure compliance and protect sender reputation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Protection Rules</p>
                    <h2 className="text-white text-2xl font-bold">{protections.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Active</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Compliance</p>
                    <h3 className="text-2xl font-bold text-gray-900">97%</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Violations</p>
                    <h3 className="text-2xl font-bold text-gray-900">{protections.reduce((sum, p) => sum + p.violations, 0)}</h3>
                    <p className="text-amber-600 text-xs mt-1">This month</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Sender Score</p>
                    <h3 className="text-2xl font-bold text-gray-900">98</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent reputation</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-gray-900">Spam Protection Rules</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Severity</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Violations</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Compliance</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {protections.map((protection) => (
                                <tr key={protection.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-none border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <Shield size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{protection.rule}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {protection.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${protection.severity === "Critical" ? "bg-red-600" :
                                                protection.severity === "High" ? "bg-amber-600" :
                                                    "bg-blue-600"
                                            } text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit`}>
                                            {protection.severity === "Critical" && <AlertTriangle size={10} />} {protection.severity}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {protection.violations === 0 ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit">
                                                <CheckCircle2 size={10} /> None
                                            </Badge>
                                        ) : (
                                            <span className="text-sm font-bold text-amber-600">{protection.violations}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 min-w-[150px]">
                                            <Progress value={protection.compliance} className="h-2 rounded-none flex-1" />
                                            <span className={`text-xs font-bold ${protection.compliance >= 95 ? 'text-green-600' : 'text-amber-600'}`}>
                                                {protection.compliance}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Switch checked={protection.status === "Active"} className="data-[state=checked]:bg-green-600" />
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
