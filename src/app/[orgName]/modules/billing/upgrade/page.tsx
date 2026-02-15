"use client";

import React, { useState } from "react";
import {
    ArrowUpCircle,
    Check,
    Zap,
    ShieldCheck,
    Globe,
    ChevronRight,
    Info,
    HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function UpgradeDowngradePage() {
    const [isYearly, setIsYearly] = useState(true);

    const plans = [
        {
            name: "Standard Desk",
            tagline: "For small teams and startups",
            monthlyPrice: 99,
            yearlyPrice: 79,
            features: ["Up to 10 Users", "50GB Storage", "Standard CRM", "Email Support", "Basic Analytics"],
            isCurrent: false,
            isPopular: false,
            color: "border-zinc-200"
        },
        {
            name: "Global Business",
            tagline: "Advanced tools for growing firms",
            monthlyPrice: 249,
            yearlyPrice: 199,
            features: ["Up to 50 Users", "200GB Storage", "Full Sales Suite", "Priority Support", "Advanced Reporting", "Custom Workflows"],
            isCurrent: false,
            isPopular: true,
            color: "border-blue-600 shadow-blue-100"
        },
        {
            name: "Enterprise Pro",
            tagline: "Corporate scale and governance",
            monthlyPrice: 599,
            yearlyPrice: 499,
            features: ["Unlimited Users", "500GB Storage", "Full HRM + CRM", "Account Manager", "Custom Integration", "Audit Logs & Security", "SSO / SAML"],
            isCurrent: true,
            isPopular: false,
            color: "border-indigo-600 shadow-indigo-100"
        }
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex flex-col items-center text-center space-y-6 py-12 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white rounded-none shadow-2xl shadow-blue-200 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md rounded-none text-[10px] font-black uppercase tracking-[3px] py-1 px-4 mb-2 relative z-10">
                    SUBSCRIPTION GOVERNANCE
                </Badge>
                <h1 className="text-[42px] font-black tracking-tighter leading-none relative z-10">Scale Your Growth Matrix</h1>
                <p className="text-[15px] text-blue-100 max-w-2xl font-medium opacity-90 relative z-10">
                    Scale your operations globally with our enterprise-grade infrastructure. Whether you are a small desk or a multinational corporation, we have a plan for you.
                </p>

                <div className="flex items-center gap-6 pt-6 relative z-10">
                    <span className={`text-[12px] font-black uppercase tracking-widest ${!isYearly ? 'text-white' : 'text-blue-200 opacity-60'}`}>Monthly</span>
                    <Switch
                        checked={isYearly}
                        onCheckedChange={setIsYearly}
                        className="data-[state=checked]:bg-white data-[state=unchecked]:bg-blue-400 rounded-none h-7 w-12"
                    />
                    <div className="flex items-center gap-3 bg-white/10 p-2 border border-white/20 backdrop-blur-md">
                        <span className={`text-[12px] font-black uppercase tracking-widest ${isYearly ? 'text-white' : 'text-blue-200 opacity-60'}`}>Yearly</span>
                        <Badge className="bg-emerald-400 text-emerald-950 hover:bg-emerald-400 border-none rounded-none text-[10px] font-black uppercase py-0.5 shadow-sm">SAVE 20%</Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-200 shadow-2xl shadow-zinc-200/50">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className={`p-10 flex flex-col relative transition-all duration-300 ${plan.isCurrent
                                ? 'bg-zinc-50 z-10 ring-[6px] ring-blue-600/5'
                                : 'bg-white hover:bg-zinc-50/50'
                            } ${idx < plans.length - 1 ? 'border-r border-zinc-200' : ''}`}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[-50%] bg-blue-600 text-white text-[10px] px-4 py-1.5 font-black uppercase tracking-[3px] shadow-xl z-20">
                                RECOMMENDED NODE
                            </div>
                        )}

                        <div className="mb-10">
                            <h3 className="text-[20px] font-black uppercase tracking-tight text-zinc-900 mb-2">{plan.name}</h3>
                            <p className="text-[13px] text-zinc-400 h-8 font-bold leading-relaxed">{plan.tagline}</p>
                        </div>

                        <div className="mb-12 flex items-baseline gap-2">
                            <span className="text-[48px] font-black text-zinc-900 leading-none tracking-tighter">
                                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                            </span>
                            <span className="text-[16px] text-zinc-400 font-black uppercase">/mo</span>
                        </div>

                        <div className="mb-12 flex-grow space-y-6">
                            <p className="text-[11px] font-black uppercase text-zinc-400 tracking-[2pt] border-b border-zinc-100 pb-3 flex items-center justify-between">
                                Resource Allocation <ChevronRight size={14} />
                            </p>
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex gap-4 text-[14px] text-zinc-700 items-start">
                                        <Check size={18} className="text-blue-600 shrink-0 mt-0.5 bg-blue-50 p-0.5" />
                                        <span className="font-bold leading-tight">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            disabled={plan.isCurrent}
                            className={`w-full rounded-none font-black h-14 uppercase tracking-[1pt] text-[12px] shadow-xl transition-all ${plan.isCurrent
                                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:translate-y-[-2px]'
                                }`}
                        >
                            {plan.isCurrent ? (
                                <span className="flex items-center gap-3 cursor-not-allowed uppercase">
                                    <ShieldCheck size={18} className="stroke-[3px]" /> Currently Active
                                </span>
                            ) : (
                                `PROVISION ${plan.name}`
                            )}
                        </Button>

                        {plan.isCurrent && (
                            <p className="text-[11px] text-zinc-400 text-center mt-4 font-black uppercase tracking-[1pt] opacity-60">
                                Lifecycle Renewal: Oct 2026
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-white border border-zinc-200 p-10 rounded-none shadow-2xl shadow-zinc-100/50 mt-16 group hover:border-blue-200 transition-colors">
                <div className="flex flex-col lg:flex-row gap-12 justify-between">
                    <div className="max-w-lg space-y-6">
                        <h4 className="text-[20px] font-black text-zinc-900 flex items-center gap-3 uppercase tracking-tight">
                            <Zap size={24} className="text-blue-600 drop-shadow-sm" /> Infrastructure Add-ons
                        </h4>
                        <p className="text-[14px] text-zinc-500 leading-relaxed font-bold">
                            Need something more specific? We offer custom add-on bundles for dedicated API throughput, long-term data cold storage, and hands-on white-glove implementation.
                        </p>
                        <Button variant="outline" className="rounded-none border-zinc-300 font-black text-[12px] h-12 px-8 gap-3 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                            Configuration Gateway <ChevronRight size={16} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10 bg-zinc-50 p-8 border border-zinc-100">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Data Integrity</p>
                            <p className="text-[14px] font-black text-zinc-900 leading-tight">HARDWARE SECURITY MODULES (HSM)</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Storage Elasticity</p>
                            <p className="text-[14px] font-black text-zinc-900 leading-tight">PETABYTE COLD STORAGE NODES</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Regulatory Compliance</p>
                            <p className="text-[14px] font-black text-zinc-900 leading-tight">SOC2 TYPE II / HIPAA GATING</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Latency Control</p>
                            <p className="text-[14px] font-black text-zinc-900 leading-tight">MULTI-REGION DATA RESIDENCY</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-none flex items-center justify-between text-white shadow-2xl">
                <div className="flex items-center gap-4">
                    <HelpCircle className="text-blue-500" size={28} />
                    <div className="flex flex-col">
                        <span className="text-[14px] font-black uppercase tracking-widest text-white">Complex Implementation?</span>
                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">Our global solutions architects are ready to assist your scaling needs.</span>
                    </div>
                </div>
                <Button variant="link" className="text-blue-400 hover:text-blue-300 font-black text-[12px] uppercase tracking-[2pt] underline underline-offset-8">CONSULT SOLUTIONS TEAM</Button>
            </div>
        </div>
    );
}
