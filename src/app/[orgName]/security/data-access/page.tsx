"use client";

import React, { useState } from "react";
import {
    Lock,
    ShieldCheck,
    Eye,
    Unlock,
    Search,
    Filter,
    Save,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Database,
    ShieldAlert,
    ChevronRight,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/components/ui/table";

export default function DataAccessControlPage() {
    const [isSaving, setIsSaving] = useState(false);

    const [accessRules, setAccessRules] = useState([
        { id: "1", module: "HRM Core", sensitive: "Salary Data", group: "HR Admins", accessType: "Full Access", restriction: "IP Bundled", status: "Active" },
        { id: "2", module: "CRM Enterprise", sensitive: "Client Financials", group: "Sales Leads", accessType: "Read-Only", restriction: "MFA Required", status: "Active" },
        { id: "3", module: "Financial Ledger", sensitive: "Bank Master Flow", group: "Accountants", accessType: "Granular", restriction: "Approval Needed", status: "Active" },
        { id: "4", module: "Identity Vault", sensitive: "Admin Credentials", group: "Org Admins", accessType: "Strict Access", restriction: "Global Gating", status: "Active" },
    ]);

    const handleCommit = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Data access matrix synchronized across all nodes!");
        }, 1000);
    };

    return (
        <div className="space-y-8 text-[#1A1A1A]">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[24px] font-black tracking-tight uppercase">Data Access & Governance</h1>
                    <p className="text-[13px] text-zinc-500 font-medium tracking-tight">Configure granular authorization vectors for sensitive organizational data nodes.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-none border-zinc-200 font-black text-[11px] h-11 px-6 uppercase tracking-widest bg-white shadow-xl shadow-zinc-100/50 transition-all hover:-translate-y-1">
                        Access Audit Log
                    </Button>
                    <Button
                        onClick={handleCommit}
                        disabled={isSaving}
                        className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-[11px] h-11 px-10 uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1"
                    >
                        <Save size={16} className="mr-2" /> {isSaving ? "SYNCING..." : "COMMIT MATRIX"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Governance Strategy - Blue Gradient Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 rounded-none shadow-2xl shadow-blue-200/50 text-white space-y-8 transition-all duration-300 hover:shadow-blue-300/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="space-y-4 relative z-10">
                            <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 w-fit rounded-none group-hover:bg-white group-hover:text-blue-700 transition-all">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-[28px] font-black tracking-tighter leading-none mb-1">Authorization Layer</h2>
                            <p className="text-[11px] text-blue-100 font-bold uppercase tracking-widest opacity-80">Encryption Level: AES-256</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-widest text-blue-100">Global Data Gating</span>
                                <Switch defaultChecked className="data-[state=checked]:bg-white data-[state=unchecked]:bg-blue-400 h-7 w-12" />
                            </div>
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[2pt] text-blue-100/60">Protection Magnitude</p>
                                    <p className="text-[13px] font-black text-white italic underline underline-offset-8 decoration-white/20">ENTERPRISE CRITICAL ZONE</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-8 rounded-none shadow-xl shadow-zinc-100 space-y-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="flex items-center gap-3 text-zinc-900">
                            <ShieldAlert size={20} className="text-rose-600" />
                            <h4 className="font-black text-[13px] uppercase tracking-[1.5pt]">DLP Sentinel</h4>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight leading-relaxed italic">
                            Data Loss Prevention (DLP) protocols are currently active for the following exports:
                        </p>
                        <div className="space-y-3">
                            {["Client Contact Matrix", "Revenue Forecasts", "Employee PII Data"].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-100 text-[11px] font-black text-zinc-600 uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-emerald-500" /> {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-none text-white space-y-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-900/10">
                        <div className="flex items-center gap-3 text-blue-500">
                            <Database size={20} />
                            <h4 className="font-black text-[13px] uppercase tracking-[1.5pt]">Access Logic</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-zinc-400">
                                <span>Just-In-Time Access</span>
                                <Switch className="data-[state=checked]:bg-blue-600" />
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-zinc-400">
                                <span>Approval Required</span>
                                <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Access Matrix Table */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-none shadow-2xl shadow-zinc-200/50 overflow-hidden transition-all duration-300 hover:shadow-zinc-300/50">
                        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <Input placeholder="Search module or risk type..." className="pl-11 rounded-none border-zinc-200 h-11 text-[13px] font-black bg-white focus:ring-blue-600 uppercase tracking-tight" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="rounded-none border-zinc-300 h-11 font-black text-[11px] uppercase tracking-widest gap-2 bg-white">
                                    <Filter size={14} /> Sensitivity
                                </Button>
                                <Button className="rounded-none bg-zinc-900 hover:bg-black text-white px-6 h-11 font-black text-[11px] uppercase tracking-widest gap-2">
                                    <Plus size={16} /> New Boundary
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table className="rounded-none">
                                <TableHeader className="bg-zinc-100/50 border-b border-zinc-200">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[2pt]">Data Cluster Node</TableHead>
                                        <TableHead className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[2pt]">Sensitive Dimension</TableHead>
                                        <TableHead className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[2pt]">Principal Role</TableHead>
                                        <TableHead className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[2pt]">Auth Type</TableHead>
                                        <TableHead className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[2pt]">Access Gating</TableHead>
                                        <TableHead className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[2pt] text-right">Records</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accessRules.map((rule) => (
                                        <TableRow key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-zinc-100 text-zinc-400 rounded-none group-hover:bg-blue-600 group-hover:text-white transition-all border border-zinc-200 group-hover:border-blue-700">
                                                        <FileText size={18} />
                                                    </div>
                                                    <span className="text-[14px] font-black text-zinc-900 tracking-tight uppercase leading-none">{rule.module}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-none rotate-45" />
                                                    <span className="text-[12px] font-black text-zinc-700 uppercase tracking-tight">{rule.sensitive}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <Badge className="bg-zinc-900 text-white rounded-none border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                                                    {rule.group}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <span className="text-[11px] font-black text-blue-600 uppercase tracking-wider underline decoration-blue-100 underline-offset-4 decoration-2">{rule.accessType}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <span className="text-[11px] font-bold text-zinc-500 uppercase italic flex items-center gap-1.5">
                                                    <AlertTriangle size={14} className="text-amber-500" /> {rule.restriction}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <Button variant="ghost" className="h-9 w-9 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 transition-all border border-transparent hover:border-zinc-200">
                                                    <Plus className="rotate-45" size={18} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                                    <CheckCircle2 size={16} className="text-emerald-500" /> Auth Synced Across 12 Nodes
                                </div>
                            </div>
                            <Button variant="link" className="text-blue-600 font-black text-[11px] uppercase tracking-[2pt] flex items-center gap-2 group">
                                Review Global Entitlements Matrix <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-none flex items-start gap-4">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20} />
                        <div className="space-y-1">
                            <h4 className="text-[13px] font-black text-amber-900 uppercase tracking-tight">Governance Alert: Inconsistent Access Pointers</h4>
                            <p className="text-[12px] text-amber-800/70 font-bold leading-relaxed">
                                Some nodes in the 'HRM Core' module are using legacy authorization tokens. It is highly recommended to perform a mandatory token refresh.
                            </p>
                            <Button className="mt-3 bg-amber-600 hover:bg-amber-700 text-white rounded-none font-black text-[10px] uppercase h-9 px-6 tracking-widest shadow-xl shadow-amber-200">
                                REFRESH TOKENS
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
