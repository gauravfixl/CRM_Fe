"use client";

import React, { useState } from "react";
import { FileText, Search, Filter, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([
        { id: "1", action: "Created Workflow", user: "Admin", workflow: "Lead Auto-Assignment", timestamp: "2 mins ago", status: "Success" },
        { id: "2", action: "Modified Rule", user: "Sarah M.", workflow: "Email Notification", timestamp: "15 mins ago", status: "Success" },
        { id: "3", action: "Deleted Template", user: "John D.", workflow: "Task Escalation", timestamp: "1 hour ago", status: "Success" },
        { id: "4", action: "Failed Execution", user: "System", workflow: "Deal Stage Update", timestamp: "2 hours ago", status: "Failed" },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Automation Audit Logs</h1>
                    <p className="text-sm text-gray-600">Track all automation-related activities and changes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Events</p>
                    <h2 className="text-white text-2xl font-bold">1,204</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Last 30 days</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Today's Activity</p>
                    <h3 className="text-2xl font-bold text-gray-900">42</h3>
                    <p className="text-blue-600 text-xs mt-1">Events logged</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Failed Actions</p>
                    <h3 className="text-2xl font-bold text-gray-900">8</h3>
                    <p className="text-amber-600 text-xs mt-1">Needs review</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Users</p>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-green-600 text-xs mt-1">This week</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search logs..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none">
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Workflow</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 text-gray-600 rounded-none border border-gray-100 group-hover:bg-gray-600 group-hover:text-white transition-all">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                            <User size={12} /> {log.user}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{log.workflow}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock size={12} /> {log.timestamp}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${log.status === "Success" ? "bg-green-600" : "bg-red-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {log.status}
                                        </Badge>
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
