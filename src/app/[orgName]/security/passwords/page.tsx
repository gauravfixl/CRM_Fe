"use client";

import React, { useState } from "react";
import {
    KeyRound,
    Save,
    ShieldCheck,
    RefreshCw,
    AlertCircle,
    HelpCircle,
    Lock,
    Eye,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function PasswordPoliciesPage() {
    const [isSaving, setIsSaving] = useState(false);

    const [policies, setPolicies] = useState({
        minLength: "12",
        requireSpecial: true,
        requireNumbers: true,
        requireUpper: true,
        expirationDays: "90",
        blockPwned: true,
        historyCheck: "5",
        mfaGracePeriod: "0"
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Password policies committed to global configuration!");
        }, 1000);
    };

    return (
        <div className="space-y-8 text-[#1A1A1A]">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[24px] font-black tracking-tight uppercase">Password Governance</h1>
                    <p className="text-[13px] text-zinc-500 font-medium tracking-tight">Configure enterprise-grade password complexity and rotation standards.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-[12px] h-10 gap-2 shadow-xl shadow-blue-100 uppercase tracking-widest px-8 transition-all hover:-translate-y-1"
                >
                    <Save size={14} /> {isSaving ? "COMMITING..." : "COMMIT CHANGES"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Core Complexity - Blue Gradient Header */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-none shadow-xl shadow-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <div className="p-8 border-b border-zinc-100 bg-gradient-to-br from-blue-700 to-indigo-800 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-[16px] font-black uppercase tracking-[2pt] flex items-center gap-3">
                                        <Lock size={20} className="text-blue-300" /> Complexity Standards
                                    </h3>
                                    <p className="text-[11px] text-blue-100 font-bold uppercase tracking-widest opacity-80">Define the baseline for user credentials</p>
                                </div>
                                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5">EN-SC-01</Badge>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            <div className="space-y-3">
                                <Label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Minimum Character Length</Label>
                                <Input
                                    type="number"
                                    value={policies.minLength}
                                    onChange={(e) => setPolicies({ ...policies, minLength: e.target.value })}
                                    className="rounded-none border-zinc-200 h-11 text-[15px] font-black focus:ring-blue-600 bg-zinc-50/50"
                                />
                                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight italic">Recommended: 12 or more</p>
                            </div>

                            <div className="space-y-3 flex flex-col justify-center">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">Require Special Symbols</Label>
                                    <Switch
                                        checked={policies.requireSpecial}
                                        onCheckedChange={(v) => setPolicies({ ...policies, requireSpecial: v })}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>
                                <p className="text-[11px] text-zinc-500 font-medium pr-12">Examples: ! @ # $ % ^ & * ( )</p>
                            </div>

                            <div className="space-y-3 flex flex-col justify-center">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">Require Numbers (0-9)</Label>
                                    <Switch
                                        checked={policies.requireNumbers}
                                        onCheckedChange={(v) => setPolicies({ ...policies, requireNumbers: v })}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 flex flex-col justify-center">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">Require Uppercase</Label>
                                    <Switch
                                        checked={policies.requireUpper}
                                        onCheckedChange={(v) => setPolicies({ ...policies, requireUpper: v })}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expiration & History */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-xl shadow-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                            <h3 className="text-[14px] font-black text-zinc-900 uppercase tracking-[2pt] flex items-center gap-3">
                                <RefreshCw size={18} className="text-blue-600" /> Lifecycle & Rotation
                            </h3>
                            <Badge variant="outline" className="border-zinc-200 text-zinc-400 rounded-none text-[9px] font-black uppercase tracking-widest">POLICY-REF: ROT-04</Badge>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Credential Lifetime (Days)</Label>
                                    <Input
                                        type="number"
                                        value={policies.expirationDays}
                                        onChange={(e) => setPolicies({ ...policies, expirationDays: e.target.value })}
                                        className="rounded-none border-zinc-200 h-11 text-[15px] font-black focus:ring-blue-600"
                                    />
                                </div>
                                <div className="p-3 bg-amber-50 border border-amber-100 flex gap-3">
                                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                                    <p className="text-[10px] text-amber-700 font-bold uppercase leading-relaxed tracking-tight">Active Warning: Expired passwords will block API node access until renewed.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Password History Check</Label>
                                    <Input
                                        type="number"
                                        value={policies.historyCheck}
                                        onChange={(e) => setPolicies({ ...policies, historyCheck: e.target.value })}
                                        className="rounded-none border-zinc-200 h-11 text-[15px] font-black focus:ring-blue-600"
                                    />
                                    <p className="text-[10px] text-zinc-500 font-medium pt-1">User cannot reuse last N passwords</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Intelligence & Guardrails */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 p-8 rounded-none shadow-2xl text-white space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-900/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <ShieldCheck size={120} />
                        </div>
                        <div className="flex items-center gap-3 text-blue-400 relative z-10">
                            <Eye size={24} />
                            <h4 className="font-black text-[15px] uppercase tracking-[1.5pt]">Credential Intelligence</h4>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-black uppercase tracking-tight">Pwned Database Check</p>
                                    <p className="text-[11px] text-zinc-400 font-medium">Auto-block passwords leaked in data breaches.</p>
                                </div>
                                <Switch
                                    checked={policies.blockPwned}
                                    onCheckedChange={(v) => setPolicies({ ...policies, blockPwned: v })}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>
                            <div className="pt-4 border-t border-zinc-800">
                                <Button variant="outline" className="w-full rounded-none border-zinc-700 bg-transparent text-white font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 transition-all">
                                    View Threat intelligence
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-8 rounded-none shadow-xl shadow-zinc-100 space-y-6 transition-all duration-300 hover:shadow-2xl">
                        <div className="flex items-center gap-3 text-zinc-900">
                            <Settings size={20} className="text-blue-600" />
                            <h4 className="font-black text-[13px] uppercase tracking-[1.5pt]">Audit Parameters</h4>
                        </div>
                        <div className="space-y-4">
                            {[
                                "Notify user N days before expiry",
                                "Enable pattern-based weak detection",
                                "Lock account after 5 failed attempts",
                                "Audit password resets in real-time"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-4 h-4 border-2 border-zinc-200 flex-shrink-0 mt-0.5" />
                                    <span className="text-[12px] text-zinc-600 font-bold leading-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-none space-y-4">
                        <div className="flex items-center gap-2 text-blue-700">
                            <HelpCircle size={18} />
                            <h4 className="font-black text-[12px] uppercase tracking-widest underline underline-offset-4 decoration-blue-200">Global Standards</h4>
                        </div>
                        <p className="text-[11px] text-blue-600/80 font-medium leading-relaxed italic">
                            Configured policies comply with NIST 800-63B standards for enterprise digital identity and authentication.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
