"use client";

import React, { useState } from "react";
import { Lock, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState([
        { id: "1", role: "Admin", createWorkflow: true, editWorkflow: true, deleteWorkflow: true, viewLogs: true },
        { id: "2", role: "Manager", createWorkflow: true, editWorkflow: true, deleteWorkflow: false, viewLogs: true },
        { id: "3", role: "User", createWorkflow: false, editWorkflow: false, deleteWorkflow: false, viewLogs: false },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Automation Permissions</h1>
                    <p className="text-sm text-gray-600">Control who can create and manage automations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Roles Configured</p>
                    <h2 className="text-white text-2xl font-bold">{permissions.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Permission sets</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Full Access</p>
                    <h3 className="text-2xl font-bold text-gray-900">1</h3>
                    <p className="text-green-600 text-xs mt-1">Admin role</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Partial Access</p>
                    <h3 className="text-2xl font-bold text-gray-900">1</h3>
                    <p className="text-blue-600 text-xs mt-1">Manager role</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">No Access</p>
                    <h3 className="text-2xl font-bold text-gray-900">1</h3>
                    <p className="text-gray-600 text-xs mt-1">User role</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search roles..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Create Workflow</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Edit Workflow</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Delete Workflow</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">View Logs</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {permissions.map((perm) => (
                                <tr key={perm.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Users size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{perm.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Switch checked={perm.createWorkflow} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={perm.editWorkflow} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={perm.deleteWorkflow} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={perm.viewLogs} className="data-[state=checked]:bg-green-600" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
