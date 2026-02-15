"use client"

import React, { useState } from "react";
import {
    FileText,
    Download,
    CalendarRange,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    BarChart3,
    ArrowUpRight,
    ShieldCheck,
    History,
    MoreHorizontal,
    Search,
    Filter,
    Activity,
    Scale
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion } from "framer-motion";

const StatutoryReportsPage = () => {
    const [timeRange, setTimeRange] = useState("this_month");
    const { toast } = useToast();

    const reports = [
        {
            id: "PF",
            title: "Provident Fund (EPF)",
            description: "Monthly contribution & ECR file generation",
            lastGenerated: "Jan 30, 2026",
            status: "Generated",
            employees: 235,
            amount: "₹12.5L",
            color: "text-[#CB9DF0]",
            bg: "bg-[#CB9DF0]/10"
        },
        {
            id: "ESI",
            title: "ESI Contribution",
            description: "Insurance contribution & compliance report",
            lastGenerated: "Jan 30, 2026",
            status: "Generated",
            employees: 187,
            amount: "₹3.2L",
            color: "text-[#F0C1E1]",
            bg: "bg-[#F0C1E1]/10"
        },
        {
            id: "PT",
            title: "Professional Tax",
            description: "State-wise professional tax deduction",
            lastGenerated: "Jan 30, 2026",
            status: "Generated",
            employees: 235,
            amount: "₹47K",
            color: "text-[#FDDBBB]",
            bg: "bg-[#FDDBBB]/20"
        },
        {
            id: "TDS",
            title: "Income Tax (TDS)",
            description: "Monthly deduction & Form 24Q prep",
            lastGenerated: "Jan 30, 2026",
            status: "Generated",
            employees: 235,
            amount: "₹18.3L",
            color: "text-[#CB9DF0]",
            bg: "bg-[#CB9DF0]/10"
        }
    ];

    const challans = [
        { type: "PF Challan", dueDate: "Feb 15, 2026", status: "Pending", amount: "₹12.5L", criticality: "High" },
        { type: "ESI Challan", dueDate: "Feb 21, 2026", status: "Pending", amount: "₹3.2L", criticality: "Medium" },
        { type: "PT Challan", dueDate: "Feb 10, 2026", status: "Filed", amount: "₹47,000", criticality: "Low" },
        { type: "TDS Challan", dueDate: "Feb 07, 2026", status: "Filed", amount: "₹18.3L", criticality: "High" }
    ];

    const handleDownload = (reportName: string) => {
        toast({ title: "Downloading Report", description: `Fetching ${reportName} archive...` });
    };

    const handleGenerate = (reportName: string) => {
        toast({ title: "Generation Triggered", description: `${reportName} is being compiled in the background.` });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#FDDBBB]/20 rounded-xl flex items-center justify-center text-[#e6b48a]">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight text-start">Compliance Repository</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider text-start">Statutory Filings • FY 2025-26</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select defaultValue="this_month" onValueChange={setTimeRange}>
                        <SelectTrigger className="h-10 w-48 bg-white border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50">
                            <CalendarRange size={14} className="text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-sans">
                            <SelectItem value="this_month">This Month</SelectItem>
                            <SelectItem value="last_month">Last Month</SelectItem>
                            <SelectItem value="this_quarter">This Quarter</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="bg-[#CB9DF0] hover:bg-[#b088e0] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-sm border-none">
                        Run Batch Compliance <ChevronRight size={14} className="ml-1" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-6">
                    {/* Audit Pulse Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total Liability", val: "₹34.45L", icon: Scale, color: "text-[#CB9DF0]", bg: "bg-[#CB9DF0]/10", meta: "Total FYTD" },
                            { label: "Compliance Score", val: "100%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", meta: "All Filings Up" },
                            { label: "Pending Challans", val: "02", icon: AlertCircle, color: "text-[#FDDBBB]", bg: "bg-[#FDDBBB]/20", meta: "Due In 5 Days" },
                            { label: "Report Artifacts", val: "148", icon: FileText, color: "text-slate-400", bg: "bg-slate-50", meta: "Generated" }
                        ].map((stat, i) => (
                            <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-start">
                                <CardContent className="p-5 text-start">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className={`h-8 w-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                                            <stat.icon size={16} />
                                        </div>
                                        <Badge className="bg-slate-50 text-slate-400 border-none font-bold text-[8px] capitalize tracking-widest leading-none px-2">{stat.meta}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest leading-none mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{stat.val}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Reports Ledger */}
                        <div className="lg:col-span-8 space-y-6">
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between text-start">
                                    <div className="text-start">
                                        <CardTitle className="text-lg font-bold text-slate-800 tracking-tight text-start leading-none mb-1">Generated Artifacts</CardTitle>
                                        <CardDescription className="text-xs font-semibold text-slate-500 capitalize tracking-widest text-start leading-none p-0 mt-1">Audit-ready statutory documents</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative w-48">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <Input placeholder="Search records..." className="pl-9 h-9 bg-slate-50 border-none rounded-lg text-xs" />
                                        </div>
                                        <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-100 text-slate-500 font-bold text-[10px] capitalize">
                                            <Filter size={14} className="mr-2" /> Filter
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-slate-50">
                                        {reports.map((report) => (
                                            <div key={report.id} className="p-6 hover:bg-slate-50/30 transition-all group cursor-pointer text-start">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`h-10 w-10 ${report.bg} ${report.color} rounded-xl flex items-center justify-center`}>
                                                        <FileText size={18} />
                                                    </div>
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black h-5 px-3 capitalize tracking-widest shadow-sm">Verified</Badge>
                                                </div>
                                                <div className="space-y-1 mb-6 text-start">
                                                    <h3 className="text-base font-black text-slate-900 tracking-tight capitalize leading-none mb-1 text-start">{report.title}</h3>
                                                    <p className="text-[10px] font-bold text-slate-400 capitalize tracking-widest leading-relaxed text-start">{report.description}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-start mb-6 pt-4 border-t border-slate-50">
                                                    <div className="text-start">
                                                        <span className="text-[9px] font-black text-slate-400 capitalize tracking-widest block text-start">Registry</span>
                                                        <p className="text-xs font-black text-slate-700 text-start">{report.employees} Profiles</p>
                                                    </div>
                                                    <div className="text-start">
                                                        <span className="text-[9px] font-black text-slate-400 capitalize tracking-widest block text-start">Liability</span>
                                                        <p className="text-xs font-black text-slate-700 text-start">{report.amount}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 text-start">
                                                    <Button size="sm" className="flex-1 h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-black text-[9px] capitalize tracking-widest border-none" onClick={() => handleDownload(report.title)}>
                                                        <Download size={12} className="mr-2" /> Download
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg text-slate-300 hover:text-[#CB9DF0] hover:bg-slate-100" onClick={() => handleGenerate(report.title)}>
                                                        <Activity size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Challan Filing Status Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-start">
                                <CardHeader className="p-6 pb-2 text-start">
                                    <div className="flex justify-between items-center text-start">
                                        <CardTitle className="text-[10px] font-black text-slate-400 capitalize tracking-[0.2em] text-start">Filing Pulse</CardTitle>
                                        <History size={14} className="text-slate-300" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 w-full text-start">
                                    <div className="space-y-4">
                                        {challans.map((challan, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 group hover:border-[#F0C1E1] transition-all text-start">
                                                <div className="flex items-center gap-4 text-start">
                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${challan.status === "Filed" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"}`}>
                                                        {challan.status === "Filed" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                                    </div>
                                                    <div className="text-start">
                                                        <p className="text-[11px] font-black text-slate-900 capitalize tracking-tight text-start leading-none mb-1">{challan.type}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest text-start leading-none italic">Due: {challan.dueDate}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-slate-900 tabular-nums">{challan.amount}</p>
                                                    {challan.status === 'Pending' && (
                                                        <button className="text-[9px] font-black text-[#CB9DF0] capitalize tracking-widest hover:underline mt-1" onClick={() => toast({ title: "Filing Manual Triggered" })}>File Now</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-4 rounded-xl bg-[#FFF9BF]/20 border border-[#FFF9BF]/50 flex items-start gap-3">
                                        <Activity size={16} className="text-[#e6d08a] shrink-0" />
                                        <p className="text-[10px] font-bold text-[#b09e5a] leading-relaxed capitalize tracking-widest text-start italic">Ensure DSC tokens are plugged-in before initiating bulk ECR filings.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white relative overflow-hidden group">
                                <div className="relative z-10 text-start space-y-6">
                                    <div className="flex justify-between items-start text-start">
                                        <div className="text-start">
                                            <h4 className="text-[10px] font-bold capitalize tracking-[0.2em] text-white/50 mb-2 text-start">Compliance Health</h4>
                                            <p className="text-3xl font-black text-[#CB9DF0] text-start">99.8%</p>
                                        </div>
                                        <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                            <BarChart3 size={16} />
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-start">
                                        <div className="flex justify-between items-center text-start">
                                            <span className="text-[10px] font-black capitalize text-white/40 tracking-widest text-start">Audit Risk</span>
                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[9px]">ZERO</Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-start">
                                            <span className="text-[10px] font-black capitalize text-white/40 tracking-widest text-start">Missing Tokens</span>
                                            <Badge className="bg-rose-500/20 text-rose-400 border-none font-black text-[9px]">NONE</Badge>
                                        </div>
                                    </div>
                                    <Button className="w-full h-10 bg-white text-slate-900 font-bold text-[10px] capitalize tracking-widest rounded-lg hover:bg-slate-100 transition-all border-none">Export Audit Log</Button>
                                </div>
                                <ShieldCheck size={120} className="absolute -right-8 -bottom-8 text-white opacity-[0.05] group-hover:scale-110 transition-transform" />
                            </Card>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default StatutoryReportsPage;
