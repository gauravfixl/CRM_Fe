"use client";

import React from "react";
import { Eye, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function VisibilityRulesPage() {
    const rules = [
        { id: "1", name: "Team Visibility", scope: "Team Members", canView: true, canEdit: false, canDelete: false, status: "Active" },
        { id: "2", name: "Manager Override", scope: "Managers", canView: true, canEdit: true, canDelete: false, status: "Active" },
        { id: "3", name: "Admin Full Access", scope: "Admins", canView: true, canEdit: true, canDelete: true, status: "Active" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Visibility Rules</h1>
                    <p className="text-sm text-gray-600">Control who can view and edit pipeline deals.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Visibility Rules</p>
                    <h2 className="text-white text-2xl font-bold">{rules.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Protected Deals</p>
                    <h3 className="text-2xl font-bold text-gray-900">1,204</h3>
                    <p className="text-green-600 text-xs mt-1">Access controlled</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">User Groups</p>
                    <h3 className="text-2xl font-bold text-gray-900">8</h3>
                    <p className="text-blue-600 text-xs mt-1">With permissions</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Compliance</p>
                    <h3 className="text-2xl font-bold text-gray-900">100%</h3>
                    <p className="text-green-600 text-xs mt-1">All rules enforced</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50"><h3 className="text-sm font-bold text-gray-900">Access Control Rules</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Scope</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Can View</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Can Edit</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Can Delete</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Eye size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{rule.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit">
                                            <Users size={10} /> {rule.scope}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4"><Switch checked={rule.canView} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={rule.canEdit} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={rule.canDelete} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={rule.status === "Active"} className="data-[state=checked]:bg-green-600" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
