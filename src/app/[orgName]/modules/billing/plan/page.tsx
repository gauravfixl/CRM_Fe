"use client";

import React, { useState } from "react";
import {
    BarChart3,
    Zap,
    Users,
    HardDrive,
    ArrowUpCircle,
    Clock,
    ShieldCheck,
    CheckCircle2,
    Info,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

export default function PlanUsagePage() {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showAddSeatsModal, setShowAddSeatsModal] = useState(false);
    const [newSeats, setNewSeats] = useState("5");

    const currentPlan = {
        name: "Enterprise Pro",
        status: "Active",
        billingCycle: "Yearly",
        nextBilling: "Oct 24, 2026",
        price: "$499/mo",
    };

    const usageStats = [
        { title: "Active Users", value: "42", limit: "100", percentage: 42, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Cloud Storage", value: "156 GB", limit: "500 GB", percentage: 31, icon: HardDrive, color: "text-indigo-600", bg: "bg-indigo-50" },
        { title: "API Monthly Calls", value: "850k", limit: "1M", percentage: 85, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
        { title: "Total Workspaces", value: "8", limit: "25", percentage: 32, icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" }
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex flex-col gap-1">
                <h1 className="text-[22px] font-bold tracking-tight">Plan & Usage</h1>
                <p className="text-[13px] text-zinc-500">Monitor your organization's resource consumption and subscription health.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 border-none rounded-none shadow-xl shadow-blue-200/50 overflow-hidden text-white">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <Badge className="bg-white text-blue-700 hover:bg-white rounded-none px-2 py-0.5 text-[10px] uppercase font-black tracking-wider shadow-sm">
                                    Subscription Tier
                                </Badge>
                                <div className="flex items-center gap-1.5 text-white text-xs opacity-80">
                                    <CheckCircle2 size={12} /> {currentPlan.status}
                                </div>
                            </div>
                            <h2 className="text-white text-2xl font-bold mb-1">
                                {currentPlan.name}
                            </h2>
                            <p className="text-white text-xs opacity-80">Billed {currentPlan.billingCycle}</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white opacity-80 flex items-center gap-2">
                                    <Clock size={14} /> Next Billing Date
                                </span>
                                <span className="text-white font-bold">{currentPlan.nextBilling}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white opacity-80 flex items-center gap-2">
                                    <ShieldCheck size={14} /> Secure Payments
                                </span>
                                <span className="text-white opacity-80">Visa •••• 4242</span>
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <Button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="w-full bg-white text-blue-600 hover:bg-zinc-50 rounded-none font-black text-sm h-11 shadow-md border-none"
                                >
                                    <ArrowUpCircle className="mr-2" size={16} /> Upgrade Subscription
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-white hover:bg-white/10 rounded-none font-bold text-sm h-11"
                                >
                                    Download Billing Statement
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-5 rounded-none shadow-lg shadow-zinc-100">
                        <div className="flex gap-3">
                            <Info className="text-blue-500 shrink-0" size={18} />
                            <div className="space-y-1">
                                <p className="text-[13px] font-bold text-zinc-900 uppercase tracking-wide">Auto-Scaling</p>
                                <p className="text-[12px] text-zinc-500 leading-relaxed">
                                    Plan configured to allow up to 10% overage for API calls before restrictions apply.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-none shadow-xl shadow-zinc-100">
                        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                            <h3 className="text-[15px] font-black text-zinc-900 uppercase tracking-tight">Resource Utilization</h3>
                            <span className="text-[10px] text-zinc-400 font-black tracking-widest">LIVE ANALYTICS</span>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {usageStats.map((stat, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`${stat.bg} ${stat.color} p-2.5 rounded-none border border-current/10`}>
                                                <stat.icon size={18} />
                                            </div>
                                            <span className="text-[13px] font-black text-zinc-700 tracking-tight">{stat.title}</span>
                                        </div>
                                        <span className="text-[12px] font-black text-zinc-900">
                                            {stat.value} <span className="text-zinc-400 font-normal">/ {stat.limit}</span>
                                        </span>
                                    </div>

                                    <Progress
                                        value={stat.percentage}
                                        className={`h-[6px] rounded-none ${idx === 2 ? 'bg-amber-100' : 'bg-zinc-100'} [&>div]:${idx === 2 ? 'bg-amber-500' : 'bg-blue-600'}`}
                                    />

                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className={idx === 2 ? "text-amber-600 font-black" : "text-zinc-400 font-bold"}>
                                            {idx === 2 ? "NEAR LIMIT" : "HEALTHY"}
                                        </span>
                                        <span className="font-black text-zinc-900">{stat.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                            <p className="text-[12px] text-zinc-500 font-medium italic">Scaling required for increasing team efficiency?</p>
                            <Button
                                onClick={() => setShowAddSeatsModal(true)}
                                variant="link"
                                className="text-blue-600 font-black text-[12px] p-0 h-auto gap-1 uppercase tracking-tighter"
                            >
                                Buy Extensions <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg shadow-zinc-100 overflow-hidden">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50/30">
                            <h3 className="text-[15px] font-black text-zinc-900 uppercase tracking-tight">Enterprise Feature Access</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                            {[
                                "Unlimited Global Projects",
                                "Advanced Sales Pipeline",
                                "Client Lifecycle Graph",
                                "Administrative Governance",
                                "Direct Account Manager",
                                "Gold Support Tier",
                                "Global Currency Engine",
                                "API Management Core"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-[12px] text-zinc-700 font-medium">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-none rotate-45" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Modal */}
            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent className="max-w-2xl rounded-none border-none p-0 overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-indigo-700 to-blue-600 p-8 text-white text-center">
                        <h2 className="text-2xl font-black mb-1 uppercase tracking-tight">Scale Your Potential</h2>
                        <p className="text-blue-100 text-[13px] font-medium opacity-80">Choose an infrastructure tier that matches your growth trajectory.</p>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-6 bg-white">
                        <div className="border border-zinc-200 p-6 rounded-none space-y-4 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group">
                            <h4 className="font-black text-[14px] text-zinc-900 uppercase tracking-tight">Standard Desk</h4>
                            <p className="text-[28px] font-black leading-none text-zinc-900">$199<span className="text-[12px] text-zinc-400 font-bold">/mo</span></p>
                            <ul className="text-[11px] text-zinc-500 space-y-2 pt-2 border-t border-zinc-100">
                                <li className="flex gap-2">✓ 25 Core Users</li>
                                <li className="flex gap-2">✓ 100GB Governance Storage</li>
                            </ul>
                            <Button variant="outline" className="w-full rounded-none font-black text-[11px] uppercase border-zinc-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">Select Tier</Button>
                        </div>
                        <div className="border-2 border-blue-600 p-6 rounded-none space-y-4 relative shadow-2xl bg-blue-50/20">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] px-3 py-1 font-black uppercase tracking-[2px] translate-y-[-50%]">Active Setup</div>
                            <h4 className="font-black text-[14px] text-zinc-900 uppercase tracking-tight">Enterprise Pro</h4>
                            <p className="text-[28px] font-black leading-none text-blue-700">$499<span className="text-[12px] text-blue-200 font-bold">/mo</span></p>
                            <ul className="text-[11px] text-zinc-700 space-y-2 pt-2 border-t border-blue-100">
                                <li className="flex gap-2 font-black">✓ Unlimited Global Users</li>
                                <li className="flex gap-2 font-black">✓ 500GB Vault Storage</li>
                            </ul>
                            <Button disabled className="w-full rounded-none bg-blue-100 text-blue-400 font-black text-[11px] uppercase">Current Plan</Button>
                        </div>
                    </div>
                    <DialogFooter className="p-6 border-t border-zinc-100 flex justify-center bg-zinc-50 rounded-none sm:justify-center">
                        <Button variant="ghost" onClick={() => setShowUpgradeModal(false)} className="text-zinc-500 font-black text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100">Maintain Current Allocation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
