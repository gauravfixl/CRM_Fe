"use client";

import React, { useState } from "react";
import { CreditCard, Users, Download, AlertTriangle, CheckCircle2, ChevronRight, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";

export default function LicenseManagementPage() {
    const [users, setUsers] = useState([
        { id: "1", name: "Sarah Miller", role: "Admin", sales: true, marketing: true, service: true, lastActive: "2 mins ago", status: "Active" },
        { id: "2", name: "John Doe", role: "Sales Rep", sales: true, marketing: false, service: false, lastActive: "1 hour ago", status: "Active" },
        { id: "3", name: "Jane Smith", role: "Support Agent", sales: false, marketing: false, service: true, lastActive: "Yesterday", status: "Active" },
        { id: "4", name: "Mike Ross", role: "Marketing Lead", sales: false, marketing: true, service: false, lastActive: "3 days ago", status: "Inactive" },
    ]);

    const licenses = [
        { name: "Sales Cloud", used: 12, total: 15, color: "text-blue-600", bg: "bg-blue-600", bar: "bg-blue-600" },
        { name: "Marketing Cloud", used: 5, total: 10, color: "text-pink-600", bg: "bg-pink-600", bar: "bg-pink-600" },
        { name: "Service Cloud", used: 8, total: 8, color: "text-purple-600", bg: "bg-purple-600", bar: "bg-purple-600" },
        { name: "Platform Starter", used: 24, total: 50, color: "text-green-600", bg: "bg-green-600", bar: "bg-green-600" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">License Management</h1>
                    <p className="text-sm text-gray-600">Allocate licenses and manage user access seats.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <CreditCard size={16} /> Buy More Licenses
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Usage Overview */}
                <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">License Utilization</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {licenses.map((lic, idx) => (
                            <div key={idx} className="bg-zinc-50 border border-zinc-100 p-4 rounded-none">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-700">{lic.name}</span>
                                    <span className={`text-xs font-bold ${lic.used >= lic.total ? "text-red-600" : "text-gray-500"}`}>
                                        {lic.used} / {lic.total} Seats
                                    </span>
                                </div>
                                <Progress value={(lic.used / lic.total) * 100} className="h-2 rounded-none bg-zinc-200" indicatorClassName={lic.bar} />
                                <div className="flex justify-end mt-2">
                                    {lic.used >= lic.total ? (
                                        <span className="text-[10px] text-red-600 font-bold flex items-center gap-1"><AlertTriangle size={10} /> Fully Utilized</span>
                                    ) : (
                                        <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> {lic.total - lic.used} Available</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white flex flex-col justify-between">
                    <div>
                        <p className="text-white text-sm opacity-80 mb-1">Total Monthly Cost</p>
                        <h2 className="text-4xl font-bold mb-6">$1,240<span className="text-lg opacity-60 font-medium">.00</span></h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <span className="text-sm opacity-80">Next Billing Date</span>
                                <span className="font-bold">Feb 01, 2026</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <span className="text-sm opacity-80">Payment Method</span>
                                <span className="font-bold">Visa •••• 4242</span>
                            </div>
                        </div>
                    </div>
                    <Button className="w-full bg-white text-blue-900 font-bold rounded-none hover:bg-blue-50 mt-6">View Invoices</Button>
                </div>
            </div>

            {/* User Assignment Table */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search users..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                    <Button variant="outline" className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white"><Download size={14} /> Export Report</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-center">Sales</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-center">Marketing</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-center">Service</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
                                            <span className="text-sm font-bold text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-600">{user.role}</span></td>
                                    <td className="px-6 py-4 text-center">
                                        {user.sales ? <CheckCircle2 size={18} className="text-green-600 mx-auto" /> : <div className="w-4 h-4 rounded-full bg-zinc-100 border border-zinc-300 mx-auto"></div>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {user.marketing ? <CheckCircle2 size={18} className="text-green-600 mx-auto" /> : <div className="w-4 h-4 rounded-full bg-zinc-100 border border-zinc-300 mx-auto"></div>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {user.service ? <CheckCircle2 size={18} className="text-green-600 mx-auto" /> : <div className="w-4 h-4 rounded-full bg-zinc-100 border border-zinc-300 mx-auto"></div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"} border-none rounded-none text-[10px] px-2 py-0.5`}>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" className="text-blue-600 hover:text-blue-800 text-xs font-bold rounded-none h-8 px-2">Edit Access</Button>
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
