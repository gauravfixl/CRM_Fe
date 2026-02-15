"use client";

import React, { useState } from "react";
import {
    ShieldCheck,
    AlertTriangle,
    Users,
    Globe,
    Activity,
    History,
    ChevronRight,
    ShieldAlert,
    Fingerprint,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function SecurityOverviewPage() {
    const [securityScore, setSecurityScore] = useState(82);

    const securityAlerts = [
        { title: "Multiple Failed Logins", user: "j.smith@fixl.com", time: "2 mins ago", severity: "High", color: "text-rose-600", bg: "bg-rose-50" },
        { title: "New IP Detected", user: "Admin (S. Miller)", time: "15 mins ago", severity: "Medium", color: "text-amber-600", bg: "bg-amber-50" },
        { title: "MFA Disabled for Guest", user: "v.kumar@external.com", time: "1 hour ago", severity: "Low", color: "text-blue-600", bg: "bg-blue-50" },
    ];

    const statCards = [
        { title: "Active Sessions", value: "248", sub: "Currently Authenticated", icon: Users, color: "text-gray-900", bg: "bg-blue-50" },
        { title: "MFA Adoption", value: "94%", sub: "Enterprise Enforced", icon: Fingerprint, color: "text-gray-900", bg: "bg-indigo-50" },
        { title: "Filtered IPs", value: "1,204", sub: "Blocked Attack Vectors", icon: Globe, color: "text-gray-900", bg: "bg-emerald-50" },
        { title: "Threat Score", value: "Low", sub: "Global Protection Active", icon: ShieldAlert, color: "text-gray-900", bg: "bg-blue-50" },
    ];

    return (
        <div className="space-y-8 text-[#1A1A1A]">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-[24px] font-black tracking-tight uppercase">Security Governance Overview</h1>
                <p className="text-[13px] text-zinc-500 font-medium tracking-tight">System-wide security posture, active threats, and authentication health monitoring.</p>
            </div>

            {/* Main Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Security Score - Blue Gradient Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 rounded-none shadow-2xl shadow-blue-200/50 text-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-300/50 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 space-y-6">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md rounded-none text-[10px] font-black uppercase tracking-[2pt] py-1 px-3">
                            Organization Health
                        </Badge>
                        <div>
                            <p className="text-white text-sm opacity-80">Overall Security Score</p>
                            <h2 className="text-white text-2xl font-bold">{securityScore}<span className="text-white text-xl opacity-60">/100</span></h2>
                            <p className="text-white text-xs mt-1">Compliance Rating: 82% Excellent</p>
                        </div>
                        <div className="space-y-2">
                            <Progress value={82} className="h-2 rounded-none bg-white/20 [&>div]:bg-white" />
                        </div>
                    </div>
                    <Button variant="link" className="text-white p-0 h-auto justify-start text-xs mt-4 hover:gap-2 transition-all">
                        Review Optimization Path <ChevronRight size={14} />
                    </Button>
                </div>

                {/* Live Alerts - 3D Card Effect */}
                <div className="lg:col-span-2 bg-white border border-zinc-200 p-8 rounded-none shadow-xl shadow-zinc-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-200 group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[16px] font-black text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                                <Activity className="text-blue-600" size={20} /> Real-Time Security Feed
                            </h3>
                            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">Active nodes monitoring enabled</p>
                        </div>
                        <Button variant="outline" className="rounded-none border-zinc-200 font-black text-[11px] h-9 uppercase tracking-widest px-6 shadow-sm group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                            Threat Map
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {securityAlerts.map((alert, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 hover:border-blue-200 hover:bg-white transition-all duration-200">
                                <div className="flex items-center gap-4">
                                    <div className={`${alert.bg} ${alert.color} p-2.5 rounded-none border border-current/10`}>
                                        <ShieldAlert size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-black text-zinc-900">{alert.title}</h4>
                                        <p className="text-[11px] text-zinc-500 font-medium">Identity: <span className="text-zinc-900 font-bold underline decoration-zinc-200">{alert.user}</span></p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge className={`${alert.bg} ${alert.color} border-none rounded-none text-[9px] font-black uppercase px-2 py-0.5`}>
                                        {alert.severity} Risk
                                    </Badge>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{alert.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid of Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg shadow-zinc-50 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5 italic font-black text-[42px] leading-none text-zinc-900 border-none select-none pointer-events-none">
                            0{i + 1}
                        </div>
                        <div className={`${card.bg} ${card.color} p-3 w-fit rounded-none border border-current/10`}>
                            <card.icon size={20} />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                            <p className="text-blue-600 text-xs mt-1">{card.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Security Actions */}
            <div className="bg-zinc-900 p-8 rounded-none shadow-2xl relative overflow-hidden group border border-zinc-800">
                <div className="absolute top-0 right-0 w-[500px] h-full bg-blue-600/5 -skew-x-12 translate-x-32 group-hover:translate-x-24 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <h3 className="text-white text-[20px] font-black uppercase tracking-tight flex items-center gap-3">
                            <Zap className="text-blue-500" /> Global Security Enforcement
                        </h3>
                        <p className="text-zinc-400 text-[13px] font-medium leading-relaxed">
                            Enable strict authentication protocols across all nodes. This action will enforce MFA globally and terminate any non-compliant active sessions instantly.
                        </p>
                    </div>
                    <div className="flex gap-4 w-full lg:w-auto">
                        <Button variant="outline" className="flex-1 lg:flex-none h-11 rounded-none border-zinc-700 bg-transparent text-white font-black text-[12px] uppercase tracking-widest hover:bg-white hover:text-black">
                            Review Policies
                        </Button>
                        <Button className="flex-1 lg:flex-none h-11 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-black text-[12px] uppercase tracking-widest px-10 shadow-xl shadow-blue-900/50">
                            Enforce Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
