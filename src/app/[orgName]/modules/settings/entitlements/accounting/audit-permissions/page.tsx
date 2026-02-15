"use client";

import React from "react";
import { Shield, Users, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function AccountingAuditPermissionsPage() {
    const roles = [
        { id: "1", role: "Finance Admin", viewInvoices: true, createInvoices: true, editTax: true, deleteInvoices: true, viewReports: true },
        { id: "2", role: "Accountant", viewInvoices: true, createInvoices: true, editTax: false, deleteInvoices: false, viewReports: true },
        { id: "3", role: "Manager", viewInvoices: true, createInvoices: false, editTax: false, deleteInvoices: false, viewReports: true },
    ];

    const auditLogs = [
        { id: "1", action: "Created Invoice", user: "Admin", invoice: "INV-2024-156", timestamp: "2 mins ago", status: "Success" },
        { id: "2", action: "Modified Tax Rate", user: "Sarah M.", invoice: "Tax Config", timestamp: "15 mins ago", status: "Success" },
        { id: "3", action: "Deleted Invoice", user: "John D.", invoice: "INV-2024-089", timestamp: "1 hour ago", status: "Success" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Accounting Audit & Permissions</h1>
                    <p className="text-sm text-gray-600">Manage access control and track all accounting activities.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Roles Configured</p>
                    <h2 className="text-white text-2xl font-bold">{roles.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Permission sets</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Audit Events</p>
                    <h3 className="text-2xl font-bold text-gray-900">1,204</h3>
                    <p className="text-green-600 text-xs mt-1">Last 30 days</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Users</p>
                    <h3 className="text-2xl font-bold text-gray-900">24</h3>
                    <p className="text-blue-600 text-xs mt-1">With accounting access</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Compliance</p>
                    <h3 className="text-2xl font-bold text-gray-900">100%</h3>
                    <p className="text-green-600 text-xs mt-1">All actions logged</p>
                </div>
            </div>

            {/* Permissions */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-gray-900">Role Permissions</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">View Invoices</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Create Invoices</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Edit Tax</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Delete Invoices</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">View Reports</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Users size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{role.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Switch checked={role.viewInvoices} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={role.createInvoices} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={role.editTax} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={role.deleteInvoices} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={role.viewReports} className="data-[state=checked]:bg-green-600" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-gray-900">Recent Audit Logs</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Target</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 text-gray-600 rounded-none border border-gray-100 group-hover:bg-gray-600 group-hover:text-white transition-all">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{log.user}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{log.invoice}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock size={12} /> {log.timestamp}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-green-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit">
                                            <CheckCircle2 size={10} /> {log.status}
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
