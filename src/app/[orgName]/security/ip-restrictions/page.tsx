"use client";

import React, { useState } from "react";
import {
    Globe,
    Plus,
    Trash2,
    ShieldCheck,
    ShieldAlert,
    Search,
    Filter,
    MapPin,
    Clock,
    ArrowRight,
    ChevronRight,
    Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";

export default function IPRestrictionsPage() {
    const [showAddIPModal, setShowAddIPModal] = useState(false);
    const [ipList, setIpList] = useState([
        { id: "1", range: "115.124.98.0/24", label: "Mumbai HQ - Primary VPN", type: "Whitelist", status: "Active", addedOn: "Oct 12, 2024" },
        { id: "2", range: "203.0.113.42", label: "AWS Production Bridge", type: "Whitelist", status: "Active", addedOn: "Nov 01, 2024" },
        { id: "3", range: "45.12.8.201", label: "Brute Force Suspect", type: "Blacklist", status: "Blocked", addedOn: "Feb 10, 2025" },
    ]);

    const removeIP = (id: string) => {
        setIpList(prev => prev.filter(ip => ip.id !== id));
    };

    return (
        <div className="space-y-8 text-[#1A1A1A]">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[24px] font-black tracking-tight uppercase">IP Network Governance</h1>
                    <p className="text-[13px] text-zinc-500 font-medium tracking-tight">Configure ingress boundary protocols through Whitelisting and Blacklisting node vectors.</p>
                </div>
                <Button
                    onClick={() => setShowAddIPModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-[12px] h-10 gap-2 shadow-xl shadow-blue-100 uppercase tracking-widest px-8 transition-all hover:-translate-y-1"
                >
                    <Plus size={14} /> Add Network Boundary
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Logic Controls - Right Sidebar style but on top/left for focus */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 rounded-none shadow-2xl shadow-blue-200/50 text-white space-y-8 transition-all duration-300 hover:shadow-blue-300/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="space-y-2 relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[3pt] text-blue-100/70">Boundary Logic</p>
                            <h3 className="text-[22px] font-black tracking-tighter leading-none">Strict IP Gating</h3>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-widest text-blue-100">Restrict to Whitelist</span>
                                <Switch defaultChecked className="data-[state=checked]:bg-white data-[state=unchecked]:bg-blue-400" />
                            </div>
                            <p className="text-[11px] text-blue-100/70 font-medium leading-relaxed italic">When enabled, only connections originating from defined whitelist ranges will be authorized for session creation.</p>
                            <div className="pt-4 flex flex-col gap-3">
                                <div className="p-3 bg-white/10 border border-white/20 backdrop-blur-md">
                                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Global Node Status</p>
                                    <p className="text-[13px] font-black text-white flex items-center gap-2 mt-1">
                                        <ShieldCheck size={14} className="text-emerald-400" /> CLOUD DEPLOYED
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-8 rounded-none shadow-xl shadow-zinc-100 transition-all duration-300 hover:shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 text-zinc-900 border-b border-zinc-100 pb-4">
                            <Database size={20} className="text-blue-600 font-black" />
                            <h4 className="font-black text-[13px] uppercase tracking-[1.5pt]">Access Analytics</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                                    <span>Denied Connections</span>
                                    <span className="text-rose-600">↑ 12.4%</span>
                                </div>
                                <p className="text-[24px] font-black text-zinc-900 leading-none">8,402</p>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase">Last 24 Hours</p>
                            </div>
                            <div className="pt-4">
                                <Button variant="link" className="p-0 h-auto text-blue-600 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                                    View Raw Traffic Logs <ArrowRight size={14} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IP List Table */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-none shadow-xl shadow-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <Input placeholder="Search IP ranges or labels..." className="pl-11 rounded-none border-zinc-200 h-10 text-[13px] font-medium bg-white" />
                            </div>
                            <Button variant="outline" className="rounded-none border-zinc-200 h-10 font-black text-[11px] uppercase tracking-widest gap-2 bg-white">
                                <Filter size={14} /> All Filters
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Network Boundary Range</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Descriptor Node</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Vector Type</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Operational Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {ipList.map((ip) => (
                                        <tr key={ip.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-blue-600/30 group-hover:text-blue-600 transition-colors">
                                                        <Globe size={18} />
                                                    </div>
                                                    <span className="text-[14px] font-black text-zinc-900 font-mono tracking-tighter uppercase">{ip.range}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-black text-zinc-900 tracking-tight uppercase leading-none">{ip.label}</span>
                                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight mt-1 flex items-center gap-1">
                                                        <Clock size={10} /> Added: {ip.addedOn}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge className={`${ip.type === 'Whitelist' ? 'bg-emerald-600' : 'bg-rose-600'} text-white border-none rounded-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5`}>
                                                    {ip.type}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-none rotate-45 ${ip.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                                                    <span className="text-[11px] font-black uppercase text-zinc-900 tracking-widest">{ip.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => removeIP(ip.id)}
                                                    className="h-9 w-9 p-0 rounded-none hover:bg-rose-50 text-zinc-400 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-[11px] text-zinc-500 font-medium flex items-center gap-3 uppercase tracking-tight">
                            <ShieldAlert className="text-amber-500" size={16} />
                            <span>Organization Admin access is currently <span className="text-blue-600 font-black underline underline-offset-4 decoration-blue-200">EXEMPT</span> from IP restrictions to prevent lockout.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add IP Modal */}
            <Dialog open={showAddIPModal} onOpenChange={setShowAddIPModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Globe size={80} />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Plus size={24} className="text-blue-300" /> DEFINE BOUNDARY
                        </h2>
                        <p className="text-[11px] text-blue-100 font-bold uppercase tracking-[1.5pt] mt-2 opacity-80">Provision new access vector to the network matrix.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-400">IP ADDRESS / CIDR RANGE</Label>
                            <div className="relative">
                                <Input placeholder="e.g., 192.168.1.0/24" className="pl-12 rounded-none border-zinc-200 h-12 text-[15px] font-black focus:ring-blue-600 bg-zinc-50/50" />
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-400">DESCRIPTOR LABEL</Label>
                            <Input placeholder="e.g., Corporate VPN - HQ" className="rounded-none border-zinc-200 h-12 text-[14px] font-black uppercase tracking-tight" />
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <button className="flex items-center justify-center gap-3 p-4 border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all font-black text-[11px] uppercase tracking-widest">
                                <ShieldCheck size={18} /> WHITELIST
                            </button>
                            <button className="flex items-center justify-center gap-3 p-4 border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all font-black text-[11px] uppercase tracking-widest">
                                <ShieldAlert size={18} /> BLACKLIST
                            </button>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowAddIPModal(false)} className="rounded-none font-black text-[11px] uppercase tracking-widest text-zinc-400">CANCEL</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-none font-black text-[11px] px-10 h-12 uppercase tracking-widest shadow-xl shadow-blue-100 underline underline-offset-4 decoration-blue-400">PROVISION BOUNDARY</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
