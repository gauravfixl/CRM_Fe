"use client";

import React, { useState } from "react";
import {
    UserCheck,
    Search,
    Filter,
    Plus,
    UserMinus,
    ShieldAlert,
    MoreVertical,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function LicensesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const summary = [
        { label: "Total Licenses", value: "100", sub: "Enterprise Pro Plan", color: "text-white", isHighlight: true },
        { label: "Assigned", value: "84", sub: "Active Users", color: "text-blue-600", isHighlight: false },
        { label: "Available", value: "16", sub: "Ready to assign", color: "text-emerald-600", isHighlight: false },
        { label: "Pending Invitations", value: "5", sub: "Awaiting signup", color: "text-amber-600", isHighlight: false }
    ];

    const [licenseUsers, setLicenseUsers] = useState([
        { id: "1", name: "Sarah Miller", email: "sarah.m@fixlsolutions.com", role: "HR Admin", plan: "Enterprise Pro", status: "Active", assignedDate: "Oct 12, 2024" },
        { id: "2", name: "Robert Wilson", email: "robert.w@fixlsolutions.com", role: "Sales Manager", plan: "Enterprise Pro", status: "Active", assignedDate: "Oct 15, 2024" },
        { id: "3", name: "Elena Kostic", email: "elena.k@fixlsolutions.com", role: "Developer", plan: "Enterprise Pro", status: "Active", assignedDate: "Nov 01, 2024" },
        { id: "4", name: "James Chen", email: "james.c@fixlsolutions.com", role: "Marketing Lead", plan: "Enterprise Pro", status: "Pending", assignedDate: "Jan 10, 2025" },
        { id: "5", name: "Maria Garcia", email: "maria.g@fixlsolutions.com", role: "Accountant", plan: "Enterprise Pro", status: "Active", assignedDate: "Feb 22, 2025" },
    ]);

    const toggleUserStatus = (id: string) => {
        setLicenseUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" } : user
        ));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">License Management</h1>
                    <p className="text-[13px] text-zinc-500">Manage user quotas, assign seats, and monitor license utilization across business units.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none border-zinc-200 font-black text-[11px] h-10 gap-2 uppercase tracking-tight">
                        <Download size={14} /> Export List
                    </Button>
                    <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-[11px] h-10 gap-2 shadow-xl shadow-blue-100 uppercase tracking-tight px-6">
                        <Plus size={14} /> Assign New License
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summary.map((item, idx) => (
                    <div
                        key={idx}
                        className={`p-6 rounded-none shadow-xl transition-all duration-300 ${item.isHighlight
                            ? 'bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-blue-200 border-none'
                            : 'bg-white border border-zinc-200 text-zinc-900 shadow-zinc-100'
                            }`}
                    >
                        <p className={`text-sm mb-3 ${item.isHighlight ? 'text-white opacity-80' : 'text-gray-600'}`}>
                            {item.label}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-bold leading-none ${item.isHighlight ? 'text-white' : 'text-gray-900'}`}>
                                {item.value}
                            </span>
                        </div>
                        <p className={`text-xs mt-3 ${item.isHighlight ? 'text-white opacity-80' : item.color}`}>
                            {item.sub}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-2xl shadow-zinc-200/50 overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search by name, email or role..."
                            className="pl-11 rounded-none border-zinc-200 h-11 text-[13px] font-medium focus:ring-blue-600 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-none border-zinc-200 text-[11px] h-11 gap-2 flex-1 md:flex-none font-black uppercase tracking-tight bg-white">
                            <Filter size={14} /> Filter Roles
                        </Button>
                        <Button variant="outline" className="rounded-none border-zinc-200 text-[11px] h-11 gap-2 flex-1 md:flex-none font-black uppercase tracking-tight bg-white">
                            <ShieldAlert size={14} /> Status: All
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2px]">Core Identity</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2px]">license Tier</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2px]">Assigned Date</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2px]">Utilization</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {licenseUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-black text-zinc-900 leading-tight">{user.name}</span>
                                            <span className="text-[12px] text-zinc-500 font-medium">{user.email}</span>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="h-1 w-1 bg-blue-600 rounded-none rotate-45" />
                                                <span className="text-[10px] text-blue-600 font-black uppercase tracking-wider">{user.role}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-zinc-900 text-white border-none rounded-none px-2 py-0.5 text-[9px] font-black uppercase tracking-[1px]">
                                            {user.plan}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-zinc-600 font-black font-mono">
                                        {user.assignedDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.status === "Active" ? (
                                                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">
                                                    <CheckCircle2 size={12} className="stroke-[3px]" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{user.status}</span>
                                                </div>
                                            ) : user.status === "Pending" ? (
                                                <div className="flex items-center gap-2 px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-none">
                                                    <Clock size={12} className="stroke-[3px]" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{user.status}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-none">
                                                    <XCircle size={12} className="stroke-[3px]" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{user.status}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-9 w-9 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-2xl p-2 min-w-[160px]">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Governance</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-[12px] font-black uppercase tracking-tight p-2 focus:bg-blue-600 focus:text-white" onClick={() => toggleUserStatus(user.id)}>
                                                    {user.status === "Suspended" ? "Restore License" : "Cease Access"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-[12px] font-black uppercase tracking-tight p-2 focus:bg-blue-600 focus:text-white">Relocate Node</DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem className="text-[12px] font-black uppercase tracking-tight p-2 text-rose-600 focus:bg-rose-600 focus:text-white flex items-center gap-2">
                                                    <UserMinus size={14} /> Purge Records
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-zinc-500">DISPLAYING <span className="text-zinc-900 font-black">1-5</span> OF <span className="text-zinc-900 font-black tracking-widest">84 RECORDS</span></p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-none border-zinc-200 font-black text-[10px] h-9 px-6 uppercase tracking-widest bg-white" disabled>Backward</Button>
                        <Button variant="outline" className="rounded-none border-zinc-200 font-black text-[10px] h-9 px-6 uppercase tracking-widest bg-white">Forward <ChevronRight size={14} className="ml-1" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
