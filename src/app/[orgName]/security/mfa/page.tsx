"use client";

import React, { useState } from "react";
import {
    Smartphone,
    ShieldCheck,
    Fingerprint,
    Mail,
    Key,
    Plus,
    Trash2,
    ChevronRight,
    ShieldAlert,
    AlertCircle,
    Clock,
    Unlock,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";

export default function MFAPage() {
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [globalMFA, setGlobalMFA] = useState(true);

    const mfaMethods = [
        { name: "Authenticator App (TOTP)", description: "Google Authenticator, Microsoft Authenticator, or Authy.", icon: Smartphone, status: "Mandatory", color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Security Keys (FIDO2)", description: "Hardware keys like YubiKey or Titan security keys.", icon: Key, status: "Recommended", color: "text-indigo-600", bg: "bg-indigo-50" },
        { name: "Push Notifications", description: "One-tap approval via mobile enterprise app.", icon: Fingerprint, status: "Enabled", color: "text-emerald-600", bg: "bg-emerald-50" },
        { name: "Email OTP", description: "Six-digit code sent to registered business email.", icon: Mail, status: "Optional", color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-8 text-[#1A1A1A]">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[24px] font-black tracking-tight uppercase">Multi-Factor Authentication</h1>
                    <p className="text-[13px] text-zinc-500 font-medium tracking-tight">Reinforce identity verification with adaptive Second-Factor layers.</p>
                </div>
                <div className="flex items-center gap-6 bg-zinc-50 p-4 border border-zinc-200 rounded-none shadow-lg shadow-zinc-100/50">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-400">Global Enforcement</span>
                        <span className={`text-[12px] font-black uppercase ${globalMFA ? 'text-blue-600' : 'text-zinc-400'}`}>
                            {globalMFA ? 'STRICT MODE ACTIVE' : 'RELAXED MODE'}
                        </span>
                    </div>
                    <Switch
                        checked={globalMFA}
                        onCheckedChange={setGlobalMFA}
                        className="data-[state=checked]:bg-blue-600 h-7 w-12"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* MFA Methods Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-none shadow-xl shadow-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <div className="p-8 border-b border-zinc-100 bg-gradient-to-br from-blue-700 to-indigo-800 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <h3 className="text-[16px] font-black uppercase tracking-[2pt] flex items-center gap-3 relative z-10">
                                <ShieldCheck size={20} className="text-blue-300" /> Authorized Verification Nodes
                            </h3>
                            <p className="text-[11px] text-blue-100 font-bold uppercase tracking-widest mt-1 opacity-80 relative z-10">Select methods allowed for organization-wide identity proofing</p>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mfaMethods.map((method, i) => (
                                <div key={i} className="group p-6 border border-zinc-100 hover:border-blue-200 hover:bg-zinc-50/50 transition-all duration-300 relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`${method.bg} ${method.color} p-3 rounded-none border border-current/10 group-hover:bg-white transition-colors`}>
                                            <method.icon size={22} className="stroke-[2.5px]" />
                                        </div>
                                        <Badge className={`${method.status === 'Mandatory' ? 'bg-rose-600' : 'bg-zinc-900'} text-white border-none rounded-none text-[9px] font-black uppercase px-2 py-0.5 tracking-widest`}>
                                            {method.status}
                                        </Badge>
                                    </div>
                                    <h4 className="text-[14px] font-black text-zinc-900 uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{method.name}</h4>
                                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed italic">{method.description}</p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <Button variant="link" className="p-0 h-auto text-blue-600 font-black text-[11px] uppercase tracking-widest group-hover:gap-2 transition-all">
                                            Configure Node <ChevronRight size={14} />
                                        </Button>
                                        <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trusted Recovery */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-xl shadow-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                            <h3 className="text-[14px] font-black text-zinc-900 uppercase tracking-[2pt] flex items-center gap-3">
                                <Unlock size={18} className="text-blue-600" /> Recovery Protocols
                            </h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-blue-50/30 p-6 border border-blue-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <History size={80} className="text-blue-600" />
                                </div>
                                <div className="space-y-2 relative z-10 flex-grow">
                                    <h4 className="text-[14px] font-black text-blue-900 uppercase tracking-tight">Backup Recovery Codes</h4>
                                    <p className="text-[12px] text-blue-700/70 font-bold leading-relaxed">System generates 10 single-use fallback codes per user. Require explicit admin approval for code generation?</p>
                                </div>
                                <div className="flex gap-4 relative z-10 w-full md:w-auto">
                                    <Button variant="outline" className="flex-1 rounded-none border-blue-200 bg-white text-blue-600 font-black text-[11px] uppercase tracking-widest h-10 px-6">Review Logs</Button>
                                    <Button className="flex-1 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-widest h-10 px-6">Configure Policy</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Index: Logic Cards */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 p-8 rounded-none shadow-2xl text-white space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-900/40 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                            <ShieldAlert size={100} className="text-blue-500" />
                        </div>
                        <div className="flex items-center gap-3 text-blue-400 relative z-10">
                            <Clock size={24} />
                            <h4 className="font-black text-[15px] uppercase tracking-[1.5pt]">Enforcement Grace</h4>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <p className="text-[13px] text-zinc-400 font-black uppercase tracking-widest">Enrollment Window</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[42px] font-black leading-none">72</span>
                                <span className="text-[14px] font-bold text-zinc-500 uppercase tracking-widest">Hours</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">New hires have 72 hours to link an MFA device before account suspension triggers.</p>
                            <Button variant="link" className="p-0 text-blue-400 font-black text-[11px] uppercase tracking-[2pt] underline underline-offset-8">Modify Access Logic</Button>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-8 rounded-none shadow-xl shadow-zinc-100 space-y-6 transition-all duration-300 hover:shadow-2xl">
                        <div className="flex items-center gap-3 text-zinc-900">
                            <Smartphone size={20} className="text-blue-600" />
                            <h4 className="font-black text-[13px] uppercase tracking-[1.5pt]">Active Enrollment</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-zinc-50 pb-4">
                                <div className="space-y-1">
                                    <p className="text-[28px] font-black text-zinc-900 leading-none">94.2%</p>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Enrolled Identity Nodes</p>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-none text-[9px] mb-1">HEALTHY</Badge>
                            </div>
                            <div className="space-y-1 mt-6">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-1">
                                    <span>Coverage Matrix</span>
                                    <span>1,204 / 1,280</span>
                                </div>
                                <Progress value={94} className="h-1.5 rounded-none bg-zinc-100" />
                            </div>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full rounded-none border-zinc-200 font-black text-[11px] uppercase tracking-widest h-10 hover:border-blue-500 hover:text-blue-600">Download Non-Compliant List</Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 bg-amber-50 border border-amber-100 p-5 rounded-none">
                        <AlertCircle className="text-amber-600 shrink-0" size={18} />
                        <p className="text-[11px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">Warning: Disabling global enforcement will immediately trigger security audits across all sub-regions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
