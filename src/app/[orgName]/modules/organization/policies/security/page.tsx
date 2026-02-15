"use client"

import React, { useState } from "react"
import {
    ShieldCheck,
    Lock,
    Fingerprint,
    Key,
    Save,
    Globe,
    ShieldAlert,
    Info,
    Smartphone,
    UserPlus,
    RotateCcw,
    ShieldBan,
    MonitorOff,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

const institutionalPolicies = [
    { id: 1, name: "Multi-Factor Authentication (MFA)", desc: "Enforce biometrics, TOTP, or Security Keys for all administrative and staff identities.", enabled: true, severity: "Critical", icon: Fingerprint, scope: "Identity" },
    { id: 2, name: "IP Pinning & Binding", desc: "Instantly invalidate sessions if a user's IP address changes during an active authentication window.", enabled: true, severity: "High", icon: Globe, scope: "Network" },
    { id: 3, name: "Session Concurrent Limit", desc: "Restrict identities to a maximum of 2 active concurrent sessions across all device types.", enabled: false, severity: "Medium", icon: ShieldBan, scope: "Identity" },
    { id: 4, name: "Hardware Key Enforcement", desc: "Mandate the use of physical YubiKeys for all Organization-level administrator accounts.", enabled: false, severity: "Critical", icon: Key, scope: "Hardware" },
    { id: 5, name: "Automatic Session Timeout", desc: "Sign out users after 4 hours of inactivity to prevent physical unauthorized access.", enabled: true, severity: "Medium", icon: MonitorOff, scope: "Policy" },
]

export default function SecurityPoliciesPage() {
    const handleDeploy = () => {
        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: "Propagating security protocols to all edge nodes...",
            success: "Global Security Baseline successfully deployed.",
            error: "Failed to sync policies."
        })
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Security Baseline</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure global cryptographic and identity mandates for the entire organization.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Reverting to corporate defaults...")}>
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                    <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-black uppercase text-[10px] tracking-widest shadow-xl px-6" onClick={handleDeploy}>
                        <ShieldCheck className="w-4 h-4" />
                        Deploy Protocols
                    </Button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-slate-900 to-indigo-950 border-none shadow-xl border-l-4 border-l-blue-500">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance Grade</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-3xl font-black text-white">A+</p>
                        <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3" /> NIST CSF Aligned
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Policies</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">12 / 14</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Global coverage</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity Score</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">98%</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3" /> MFA adoption
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Threat Level</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">LOW</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <Info className="w-3 h-3 text-blue-500" /> Normal monitoring
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* POLICY LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {institutionalPolicies.map((policy) => (
                        <Card key={policy.id} className="border-slate-200 shadow-sm hover:border-blue-200 transition-all group">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all ${policy.enabled ?
                                            'bg-blue-50 text-blue-600 border-blue-100 group-hover:scale-105' :
                                            'bg-slate-100 text-slate-400 border-slate-200'
                                        }`}>
                                        <policy.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{policy.name}</p>
                                            <Badge className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-none ${policy.severity === 'Critical' ? 'bg-red-600 text-white' :
                                                    policy.severity === 'High' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>
                                                {policy.severity}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-lg">{policy.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:flex flex-col items-end">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scope: {policy.scope}</p>
                                        <p className={`text-[10px] font-black mt-0.5 ${policy.enabled ? 'text-emerald-600' : 'text-slate-300'}`}>
                                            {policy.enabled ? 'ACTIVE' : 'OFF'}
                                        </p>
                                    </div>
                                    <Switch checked={policy.enabled} onCheckedChange={() => toast.success(`Security policy changed for ${policy.name}`)} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <ShieldAlert className="w-32 h-32 text-red-500" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <Badge className="bg-red-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 mb-2">Threat Vector Detected</Badge>
                            <h4 className="text-lg font-black tracking-tight leading-snug">Ransomware Protection</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans">
                                Our AI engine has detected a suspicious pattern of mass file encryption attempts in a sandbox environment. Anti-Ransomware shield is now in <span className="text-white font-bold">Aggressive Blocking</span> mode.
                            </p>
                            <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest h-10 mt-2 shadow-xl">
                                System Lockdown
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-slate-200 shadow-sm p-6 space-y-5">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Key className="w-4 h-4 text-blue-600" />
                            Emergency Bypass
                        </h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Generate a single-use "Glass-Break" code for identity recovery when MFA is unavailable.
                        </p>
                        <Button variant="outline" className="w-full h-10 border-slate-200 text-xs font-bold gap-2">
                            Authorize Recovery Code
                        </Button>
                    </Card>

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium text-amber-800 leading-relaxed italic">
                            Deploying protocols updates the <span className="font-bold">Security Envelope</span> across all 12 Firms. Note: Old browser sessions may be forcibly terminated.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
