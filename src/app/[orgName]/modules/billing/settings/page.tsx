"use client";

import React, { useState } from "react";
import {
    FileText,
    Save,
    MapPin,
    Building2,
    Mail,
    Globe,
    Briefcase,
    AlertCircle,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

export default function BillingSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Enterprise metadata updated!");
        }, 1000);
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Billing Configuration</h1>
                    <p className="text-[13px] text-zinc-500">Manage your organization's legal and tax information for invoice generation.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-[11px] h-10 gap-2 shadow-xl shadow-blue-100 uppercase tracking-widest px-8"
                >
                    <Save size={14} /> {isSaving ? "SYNCING..." : "COMMIT CHANGES"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-zinc-200 rounded-none shadow-2xl shadow-zinc-200/50 overflow-hidden">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                            <h3 className="text-[13px] font-black text-zinc-900 uppercase tracking-[2pt] flex items-center gap-3">
                                <Building2 size={18} className="text-blue-600" /> Legal Entity Node
                            </h3>
                            <span className="text-[10px] font-black text-zinc-400">EN-504 TYPE SPEC</span>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[1.5pt] text-zinc-400">Enterprise Legal Name</Label>
                                    <Input defaultValue="Fixl Solutions Private Limited" className="rounded-none border-zinc-200 focus:ring-blue-600 h-11 text-[14px] font-black tracking-tight" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[1.5pt] text-zinc-400">Tax Vault ID (GST/VAT)</Label>
                                    <Input defaultValue="29AAAAA0000A1Z5" className="rounded-none border-zinc-200 focus:ring-blue-600 h-11 text-[14px] font-mono font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[1.5pt] text-zinc-400">Ledger Email Vector</Label>
                                    <div className="relative">
                                        <Input defaultValue="accounts@fixlsolutions.com" className="pl-12 rounded-none border-zinc-200 focus:ring-blue-600 h-11 text-[14px] font-bold" />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[1.5pt] text-zinc-400">Sector Classification</Label>
                                    <Input defaultValue="Software Engineering & Cloud" className="rounded-none border-zinc-200 focus:ring-blue-600 h-11 text-[14px] font-bold" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[1.5pt] text-zinc-400">Primary Compliance Address</Label>
                                <div className="relative">
                                    <Textarea
                                        defaultValue="102, Innovation Hub, Outer Ring Road, Bangalore, Karnataka, 560103, India"
                                        className="pl-12 rounded-none border-zinc-200 focus:ring-blue-600 min-h-[100px] text-[14px] pt-4 font-bold leading-relaxed"
                                    />
                                    <MapPin className="absolute left-4 top-4 text-zinc-400" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-none shadow-2xl shadow-zinc-200/50 overflow-hidden">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                            <h3 className="text-[13px] font-black text-zinc-900 uppercase tracking-[2pt] flex items-center gap-3">
                                <Globe size={18} className="text-blue-600" /> Global Region Matrix
                            </h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[1.5pt] text-zinc-400">Primary Settlement Currency</Label>
                                <Input defaultValue="USD - United States Dollar" readOnly className="bg-zinc-50 rounded-none border-zinc-200 h-11 text-[14px] font-black cursor-not-allowed text-zinc-500" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[1.5pt] text-zinc-400">Fiscal Period Initialization</Label>
                                <Input defaultValue="April Lifecycle" className="rounded-none border-zinc-200 focus:ring-blue-600 h-11 text-[14px] font-black" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 rounded-none shadow-2xl shadow-blue-200/50 text-white space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-none">
                                <FileText size={24} />
                            </div>
                            <h4 className="font-black text-[15px] uppercase tracking-[1pt]">Document Logic</h4>
                        </div>
                        <p className="text-[13px] text-blue-100 leading-relaxed font-medium">
                            Enterprise metadata provided here is strictly validated and injected into all PDF nodes and tax filings in real-time.
                        </p>
                        <div className="pt-2">
                            <button className="text-[11px] font-black uppercase tracking-[2pt] hover:underline flex items-center gap-2">
                                VERIFY TEMPLATE <ChevronRight size={14} className="text-blue-300" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-8 rounded-none shadow-2xl shadow-zinc-300 text-white space-y-5">
                        <div className="flex items-center gap-3 text-blue-400">
                            <ShieldCheck size={20} />
                            <h4 className="font-black text-[13px] uppercase tracking-[1.5pt]">Compliance Guard</h4>
                        </div>
                        <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
                            Address vectors are cross-referenced with local financial authorities to ensure seamless high-value transactions.
                        </p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-xl shadow-zinc-100 space-y-5">
                        <div className="flex items-center gap-3 text-zinc-900">
                            <Briefcase size={20} className="text-blue-600" />
                            <h4 className="font-black text-[13px] uppercase tracking-[1.5pt]">Resources</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { label: "Audit Log Trail", icon: Save },
                                { label: "Tax Certificates", icon: Globe },
                                { label: "PO Management", icon: Building2 }
                            ].map((link, i) => (
                                <li key={i}>
                                    <a href="#" className="group flex items-center justify-between p-3 border border-zinc-50 hover:border-blue-100 hover:bg-blue-50/50 transition-all">
                                        <span className="text-[12px] text-zinc-600 font-black uppercase tracking-tight group-hover:text-blue-700">{link.label}</span>
                                        <link.icon size={14} className="text-zinc-300 group-hover:text-blue-400" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
