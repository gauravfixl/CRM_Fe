"use client";

import React, { useState } from "react";
import {
    Monitor,
    Smartphone,
    Laptop,
    ShieldCheck,
    ShieldAlert,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    MoreVertical,
    History,
    Lock,
    Zap,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Progress } from "@/shared/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function DeviceTrustPage() {
    const [strictMode, setStrictMode] = useState(true);

    const [devices, setDevices] = useState([
        { id: "1", name: "MacBook Pro M2 - IT-042", user: "Sarah Miller (Admin)", os: "macOS 14.2", type: "Laptop", status: "Managed", lastSync: "2 mins ago", health: 98 },
        { id: "2", name: "Dell XPS 15 - ENG-901", user: "Robert Wilson", os: "Windows 11", type: "Laptop", status: "Managed", lastSync: "1 hour ago", health: 95 },
        { id: "3", name: "iPhone 15 Pro - PER-001", user: "Elena Kostic", os: "iOS 17.1", type: "Mobile", status: "Unmanaged", lastSync: "5 mins ago", health: 70 },
        { id: "4", name: "Samsung S23 - SALES-02", user: "James Chen", os: "Android 14", type: "Mobile", status: "Managed", lastSync: "12 hours ago", health: 100 },
    ]);

    return (
        <div className="space-y-8 text-[#1A1A1A]">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[24px] font-black tracking-tight uppercase">Device Trust & Compliance</h1>
                    <p className="text-[13px] text-zinc-500 font-medium tracking-tight">Monitor and enforce endpoint security standards across all organizational hardware nodes.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-none border-zinc-200 font-black text-[11px] h-10 px-6 uppercase tracking-widest bg-white shadow-lg shadow-zinc-100">
                        Compliance Reports
                    </Button>
                    <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-[11px] h-10 px-8 uppercase tracking-widest shadow-xl shadow-blue-100 transition-all hover:-translate-y-1">
                        Enroll New Node
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Device Health Dashboard - Blue Gradient Page Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 rounded-none shadow-2xl shadow-blue-200/50 text-white space-y-8 transition-all duration-300 hover:shadow-blue-300/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="space-y-4 relative z-10">
                            <Badge className="bg-white/20 text-white border-white/30 rounded-none text-[9px] font-black uppercase tracking-[2pt] py-1 px-3">PROTECTION: ACTIVE</Badge>
                            <h2 className="text-[32px] font-black tracking-tighter leading-none">Endpoint Matrix</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-widest text-blue-100 italic">Managed Node Enforcement</span>
                                <Switch checked={strictMode} onCheckedChange={setStrictMode} className="data-[state=checked]:bg-white data-[state=unchecked]:bg-blue-400 h-7 w-12" />
                            </div>
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex justify-between text-[11px] font-black uppercase text-blue-100">
                                    <span>Trusted Ratio</span>
                                    <span>84%</span>
                                </div>
                                <Progress value={84} className="h-2 rounded-none bg-white/20 [&>div]:bg-white" />
                            </div>
                            <p className="text-[10px] text-blue-100 opacity-70 font-bold uppercase leading-relaxed tracking-wider pt-2">
                                {strictMode ? "STRICT MODE: Access restricted to compliant devices only." : "ADAPTIVE MODE: Risk-based access scoring active."}
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-8 rounded-none shadow-2xl text-white space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-900/40 relative overflow-hidden group border border-zinc-800">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldAlert size={80} className="text-blue-500" />
                        </div>
                        <div className="flex items-center gap-3 text-blue-400 relative z-10">
                            <Zap size={24} />
                            <h4 className="font-black text-[15px] uppercase tracking-[1.5pt]">Threat Sentinel</h4>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                <span className="text-zinc-500 italic">Risky Devices</span>
                                <span className="text-rose-500 font-bold underline underline-offset-4 decoration-rose-900">03 DETECTED</span>
                            </div>
                            <Button variant="outline" className="w-full rounded-none border-zinc-700 bg-transparent text-white font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 hover:border-rose-600 transition-all h-11">
                                Isolate Nodes Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Device Inventory List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-none shadow-xl shadow-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <Input placeholder="Search by Device ID, User or OS..." className="pl-11 rounded-none border-zinc-200 h-10 text-[13px] font-bold bg-white focus:ring-blue-600" />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button variant="outline" className="rounded-none border-zinc-200 h-10 font-black text-[11px] uppercase tracking-widest gap-2 bg-white flex-1 md:flex-none">
                                    <Filter size={14} /> Device Type
                                </Button>
                                <Button variant="outline" className="rounded-none border-zinc-200 h-10 font-black text-[11px] uppercase tracking-widest gap-2 bg-white flex-1 md:flex-none">
                                    <ShieldCheck size={14} /> Health: All
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Device Node Details</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Authorized Operator</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Trust Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Health Score</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {devices.map((device) => (
                                        <tr key={device.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 bg-zinc-100 text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all rounded-none border border-zinc-200 group-hover:border-blue-700">
                                                        {device.type === 'Laptop' ? <Laptop size={20} /> : <Smartphone size={20} />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[14px] font-black text-zinc-900 tracking-tight uppercase leading-none">{device.name}</span>
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                                            {device.os} <div className="w-1 h-1 bg-zinc-300 rounded-none rotate-45" /> {device.lastSync}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-black text-zinc-700 uppercase leading-none">{device.user}</span>
                                                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Identity Verified</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge className={`${device.status === 'Managed' ? 'bg-emerald-600' : 'bg-amber-500'} text-white border-none rounded-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5`}>
                                                    {device.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-2 w-32">
                                                    <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                                                        <span className={device.health < 80 ? 'text-rose-600' : 'text-zinc-400'}>{device.health}%</span>
                                                    </div>
                                                    <Progress value={device.health} className={`h-1.5 rounded-none bg-zinc-100 ${device.health < 80 ? '[&>div]:bg-rose-500' : '[&>div]:bg-emerald-500'}`} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200">
                                                            <MoreVertical size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-2xl p-2 min-w-[200px]">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Governance Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem className="text-[12px] font-black uppercase tracking-tight p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                            <History size={14} /> Full Audit History
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-[12px] font-black uppercase tracking-tight p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                            <ShieldCheck size={14} /> Validate Integrity
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="my-2" />
                                                        <DropdownMenuItem className="text-[12px] font-black uppercase tracking-tight p-2 text-rose-600 focus:bg-rose-600 focus:text-white flex items-center gap-2 cursor-pointer">
                                                            <Lock size={14} /> Isolate Node
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                                    <CheckCircle2 size={16} className="text-emerald-500" /> Compliant: 1,200
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                                    <XCircle size={16} className="text-rose-500" /> At Risk: 80
                                </div>
                            </div>
                            <Button variant="link" className="text-blue-600 font-black text-[11px] uppercase tracking-[2pt] flex items-center gap-1 group">
                                Scan Infrastructure Node Matrix <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
