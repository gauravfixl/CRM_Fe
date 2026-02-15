"use client"

import React, { useMemo } from "react";
import {
    DollarSign,
    Users,
    Scale,
    ShieldCheck,
    TrendingUp,
    AlertCircle,
    Download,
    ChevronRight,
    Activity,
    Zap,
    Briefcase
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { usePayrollStore } from "@/shared/data/payroll-store";
import { cn } from "@/lib/utils";

const PayrollDashboard = () => {
    const { payRuns, claims, declarations } = usePayrollStore();

    // Active run is the one in Draft or Processing, else the latest one
    const activeRun = useMemo(() =>
        payRuns.find(r => r.status === 'Draft' || r.status === 'Processing') || payRuns[0],
        [payRuns]);

    // Derived Stats
    const stats = useMemo(() => {
        const totalPayout = (activeRun?.totalNetPay || 0) + (activeRun?.totalDeductions || 0);
        const liability = (activeRun?.totalTDS || 0);
        const pendingClaims = claims.filter(c => c.status === 'Pending').length;
        const verifiedDocs = declarations.filter(d => d.status === 'Verified').length;

        return {
            totalCost: `₹${(totalPayout / 10000000).toFixed(2)} Cr`,
            netPay: `₹${(activeRun?.totalNetPay / 10000000).toFixed(2)} Cr`,
            liability: `₹${(liability / 100000).toFixed(2)} L`,
            compliance: "98.4%", // Mocked for now (could be derived if we had employee compliance data)
            inclusionRate: `${Math.round((activeRun?.inclusionCount || 0) / (activeRun?.totalEmployees || 1) * 100)}%`,
            inclusionText: `${activeRun?.inclusionCount || 0} Employees`,
            pendingClaims,
            verifiedDocs
        };
    }, [activeRun, claims, declarations]);

    // Mock Department Data (Would ideally come from Employee Store)
    const departmentData = [
        { name: "Engineering", cost: "₹45.2L", count: 42, color: "bg-[#CB9DF0]" },
        { name: "Marketing", cost: "₹22.8L", count: 28, color: "bg-[#F0C1E1]" },
        { name: "Operations", cost: "₹18.5L", count: 35, color: "bg-[#FDDBBB]" },
        { name: "HR", cost: "₹12.4L", count: 12, color: "bg-[#FFF9BF]" },
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payroll Dashboard</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider">{activeRun?.month || 'Current'} Cycle • Fiscal Intelligence</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50 text-slate-600">
                        <Download size={14} /> Variance Report
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none">
                        Run Payroll <ChevronRight size={14} className="ml-1" />
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 space-y-8 pb-32">
                    {/* KPI Tiles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total Cost", val: stats.totalCost, icon: DollarSign, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", trend: "+4.2%" },
                            { label: "Compliance", val: stats.compliance, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50", trend: "Perfect" },
                            { label: "Liability", val: stats.liability, icon: Scale, color: "text-amber-500", bg: "bg-amber-50", trend: "On Track" },
                            { label: "Inclusion", val: stats.inclusionRate, icon: Users, color: "text-blue-500", bg: "bg-blue-50", trend: stats.inclusionText }
                        ].map((stat, i) => (
                            <Card key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <Badge variant="outline" className="font-bold text-[9px] text-slate-400 border-slate-100 bg-slate-50">{stat.trend}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-500 capitalize tracking-wide">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.val}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Center Stage: Active Run */}
                        <Card className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
                            <CardContent className="p-0 h-full">
                                <div className="flex flex-col md:flex-row h-full">
                                    <div className="flex-1 p-6 space-y-4 flex flex-col justify-center">
                                        <div className="space-y-1.5 text-start">
                                            <Badge className={cn(
                                                "border-none font-bold text-[10px] capitalize px-3 py-1",
                                                activeRun?.status === 'Draft' ? "bg-slate-100 text-slate-500" :
                                                    activeRun?.status === 'Processing' ? "bg-blue-50 text-blue-600" :
                                                        "bg-emerald-50 text-emerald-600"
                                            )}>
                                                Active Cycle: {activeRun?.status || 'Idle'}
                                            </Badge>
                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-start leading-none mt-1">Current Processing State</h2>
                                            <p className="text-xs font-medium text-slate-500 text-start">
                                                Reconciling attendance data for <span className="text-slate-900 font-bold">{activeRun?.totalEmployees || 0} employees</span>.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-start">
                                                <span className="text-[10px] font-bold text-slate-400 capitalize tracking-wide block">Est. Payout</span>
                                                <p className="text-lg font-bold text-slate-900">{stats.netPay}</p>
                                            </div>
                                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-start">
                                                <span className="text-[10px] font-bold text-slate-400 capitalize tracking-wide block">Processed</span>
                                                <p className="text-lg font-bold text-slate-900">{activeRun?.inclusionCount} / {activeRun?.totalEmployees}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-1 text-start">
                                            <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-xl h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none transition-all">Preview Payrun</Button>
                                            <Button variant="outline" className="h-10 border-slate-200 rounded-xl px-6 font-bold text-xs hover:bg-slate-50 text-slate-600">Flag Exceptions</Button>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-[260px] bg-slate-50 p-6 flex flex-col items-center justify-center border-l border-slate-100">
                                        <div className="relative h-40 w-40 rounded-full border-[6px] border-white flex items-center justify-center shadow-inner bg-white">
                                            <div className="text-center z-10 flex flex-col items-center">
                                                <span className="text-3xl font-bold text-[#8B5CF6] tracking-tighter">92%</span>
                                                <span className="text-[9px] font-bold text-slate-400 capitalize block tracking-wide leading-none mt-1">Calculated</span>
                                            </div>
                                            {/* Circular Progress Overlay */}
                                            <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="46"
                                                    fill="none"
                                                    stroke="#8B5CF6"
                                                    strokeWidth="5"
                                                    strokeDasharray="289"
                                                    strokeDashoffset="23"
                                                    strokeLinecap="round"
                                                    className="opacity-20"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="46"
                                                    fill="none"
                                                    stroke="#8B5CF6"
                                                    strokeWidth="5"
                                                    strokeDasharray="289"
                                                    strokeDashoffset="23" // Mock progress
                                                    strokeLinecap="round"
                                                    className="transition-all duration-1000"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Side Panels */}
                        <div className="lg:col-span-4 space-y-4">
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold text-slate-900 capitalize tracking-wide">Departmental Cost</h4>
                                        <Badge className="bg-amber-50 text-amber-600 border-none font-bold text-[9px] capitalize px-2 h-5">FY 25-26</Badge>
                                    </div>
                                    <div className="space-y-4">
                                        {departmentData.map((dept, i) => (
                                            <div key={i} className="space-y-1.5">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase size={12} className="text-slate-400" />
                                                        <span className="text-[10px] font-bold text-slate-700">{dept.name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-900">{dept.cost}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={cn("h-full opacity-100 rounded-full", dept.color)} style={{ width: i === 0 ? '85%' : i === 1 ? '45%' : i === 2 ? '30%' : '15%' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#8B5CF6] to-[#7c4dff] p-5 text-white shadow-lg shadow-[#8B5CF6]/20 relative overflow-hidden group">
                                <div className="relative z-10 space-y-3">
                                    <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center mb-3 border border-white/20 shadow-sm">
                                        <AlertCircle size={18} className="text-white" />
                                    </div>
                                    <h4 className="text-base font-bold leading-tight">Critical <br />Exceptions</h4>
                                    <p className="text-[10px] font-medium text-white/70">
                                        {stats.pendingClaims} pending claims require approval before disbursement.
                                    </p>
                                    <Button className="w-full mt-1.5 h-9 bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest hover:bg-white/90 shadow-md border-none flex items-center justify-between px-4 rounded-xl">
                                        Resolve Now <ChevronRight size={12} />
                                    </Button>
                                </div>
                                <Zap size={100} className="absolute -right-8 -bottom-8 text-white opacity-10 group-hover:scale-110 transition-transform" />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollDashboard;
