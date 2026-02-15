"use client"

import React, { useState } from "react";
import {
    Activity,
    Users,
    Clock,
    UserCheck,
    TrendingUp,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase,
    Calendar,
    PieChart,
    BarChart3
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useHireStore } from "@/shared/data/hire-store";
import { Badge } from "@/shared/components/ui/badge";

// Mock Charts Components (CSS-based for reliability)
const FunnelChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    return (
        <div className="flex flex-col items-center space-y-1.5 py-2">
            {data.map((item, index) => (
                <div key={index} className="w-full flex items-center group relative">
                    <div className="w-20 text-right pr-3 text-[10px] font-bold text-slate-400">{item.label}</div>
                    <div className="flex-1 flex justify-center">
                        <div
                            className={`h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-md transition-all hover:scale-105 ${item.color}`}
                            style={{ width: `${(item.value / maxVal) * 100}%`, minWidth: '40px' }}
                        >
                            <span className="text-[10px]">{item.value}</span>
                        </div>
                    </div>
                    <div className="w-20 pl-3 text-[9px] font-bold text-slate-300">
                        {index > 0 && data[index - 1].value > 0 ? `${Math.round((item.value / data[index - 1].value) * 100)}% conv` : index > 0 ? '0% conv' : '-'}
                    </div>
                </div>
            ))}
        </div>
    );
};

const BarChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    return (
        <div className="flex items-end justify-between h-48 space-x-2 px-4">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group">
                    <div className="font-bold text-slate-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs">{item.value}</div>
                    <div
                        className={`w-full rounded-t-xl transition-all hover:opacity-90 ${item.color}`}
                        style={{ height: `${(item.value / maxVal) * 100}%` }}
                    />
                    <div className="mt-2 text-[10px] font-bold text-slate-400 text-center truncate w-full">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const HiringReportsPage = () => {
    const { jobs, candidates, offers, interviews } = useHireStore();
    const [timeRange, setTimeRange] = useState("this_quarter");

    // KPI Calculations
    const totalHired = candidates.filter(c => c.stage === 'Hired').length;
    const activeOpenings = jobs.filter(j => j.workflowStatus === 'Active').length;
    const offerAcceptanceRate = offers.length > 0
        ? Math.round((offers.filter(o => o.approvalStatus === 'Accepted').length / offers.length) * 100)
        : 0;

    // Mock Cost per Hire (Randomize slightly for demo)
    const costPerHire = "₹45,200";

    // Funnel Data
    const funnelData = [
        { label: "Applied", value: candidates.length, color: "bg-indigo-500 shadow-indigo-200" },
        { label: "Screening", value: candidates.filter(c => c.stage !== 'New').length, color: "bg-blue-500 shadow-blue-200" },
        { label: "Interview", value: candidates.filter(c => ['Interview', 'Offer', 'Hired'].includes(c.stage)).length, color: "bg-purple-500 shadow-purple-200" },
        { label: "Offer", value: candidates.filter(c => ['Offer', 'Hired'].includes(c.stage)).length, color: "bg-pink-500 shadow-pink-200" },
        { label: "Hired", value: totalHired, color: "bg-emerald-500 shadow-emerald-200" }
    ];

    // Unified filtering for data accuracy
    const sourceData = [
        { label: "LinkedIn", value: candidates.filter(c => c.source === 'LinkedIn').length, color: "bg-blue-400" },
        { label: "Agency", value: candidates.filter(c => c.source === 'Agency').length, color: "bg-purple-400" },
        { label: "Referral", value: candidates.filter(c => c.source === 'Referral').length, color: "bg-emerald-400" },
        { label: "Career Page", value: candidates.filter(c => c.source === 'CareerPage').length, color: "bg-amber-400" },
        { label: "Others", value: candidates.filter(c => !['LinkedIn', 'Agency', 'Referral', 'CareerPage'].includes(c.source)).length, color: "bg-slate-300" }
    ];

    // Generate Activities from real data
    const recentActivities = [
        ...candidates.slice(-2).map(c => ({
            type: 'Candidate',
            title: `New application: ${c.firstName} ${c.lastName}`,
            subtitle: `${c.stage} Stage • ${c.source}`,
            time: 'Just now'
        })),
        ...offers.slice(-1).map(o => ({
            type: 'Offer',
            title: `Offer generated for ${o.candidateName}`,
            subtitle: `${o.role} • ${o.approvalStatus}`,
            time: 'Today'
        }))
    ].reverse();

    // Prevent body scroll on this page
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const generateReport = () => {
        // Mock export
        alert("Generating PDF Report... Download will start shortly.");
    };

    return (
        <div className="flex-1 h-full max-h-screen overflow-hidden space-y-4 p-4 flex flex-col bg-[#fcfdff]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Recruitment Analytics</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Insights into hiring velocity, costs, and pipeline health.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[150px] h-9 rounded-lg bg-white border border-slate-100 font-bold px-3 shadow-sm text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-xl font-bold">
                            <SelectItem value="this_month">This Month</SelectItem>
                            <SelectItem value="this_quarter">This Quarter</SelectItem>
                            <SelectItem value="this_year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={generateReport}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 px-4 shadow-lg font-bold text-[10px] border-none transition-all hover:scale-105"
                    >
                        <Download className="mr-2 h-3.5 w-3.5" /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-none bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 shadow-lg shadow-indigo-50 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-white/70">Total Hired</p>
                            <Badge className="bg-white/20 text-white border-none text-[9px] font-bold">+12%</Badge>
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight mt-1">{totalHired}</h3>
                        <p className="text-xs font-medium text-white/70 mt-1">Candidates onboarded</p>
                    </div>
                </Card>

                <Card className="rounded-2xl border-none bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 shadow-lg shadow-purple-50 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-white/70">Active Jobs</p>
                            <Activity className="h-4 w-4 text-white/60" />
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight mt-1">{activeOpenings}</h3>
                        <p className="text-xs font-medium text-white/70 mt-1">Open positions</p>
                    </div>
                </Card>

                <Card className="rounded-2xl border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 shadow-lg shadow-emerald-50 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-white/70">Offer Acceptance</p>
                            <UserCheck className="h-4 w-4 text-white/60" />
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight mt-1">{offerAcceptanceRate}%</h3>
                        <p className="text-xs font-medium text-white/70 mt-1">Conversion rate</p>
                    </div>
                </Card>

                <Card className="rounded-2xl border-none bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 shadow-lg shadow-amber-50 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-white/70">Cost per Hire</p>
                            <TrendingUp className="h-4 w-4 text-white/60" />
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight mt-1">{costPerHire}</h3>
                        <p className="text-xs font-medium text-white/70 mt-1">Avg. acquisition cost</p>
                    </div>
                </Card>
            </div>

            {/* Activities and Detailed Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Pipeline Funnel */}
                <Card className="lg:col-span-2 rounded-2xl border-none shadow-sm bg-white p-5 ring-1 ring-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Conversion Funnel</h3>
                            <p className="text-slate-400 font-bold text-[10px] mt-0.5">Candidate progression through stages</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><ArrowUpRight className="h-4 w-4 text-slate-300" /></Button>
                    </div>
                    <FunnelChart data={funnelData} />
                </Card>

                {/* Sourcing Channels */}
                <Card className="rounded-2xl border-none shadow-sm bg-white p-5 ring-1 ring-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Sourcing Channels</h3>
                            <p className="text-slate-400 font-bold text-[10px] mt-0.5">Top talent origins</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sourceData.map((d, i) => {
                            const percentage = candidates.length > 0 ? (d.value / candidates.length) * 100 : 0;
                            return (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="flex items-center gap-2 font-bold text-slate-600">
                                            <div className={`w-1.5 h-1.5 rounded-full ${d.color.split(' ')[0]}`} />
                                            {d.label}
                                        </span>
                                        <span className="font-bold text-slate-900">{d.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${d.color.split(' ')[0]}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Recent Activity Table */}
            <div className="max-w-xl">
                <Card className="rounded-2xl border-none shadow-sm bg-white p-2.5 ring-1 ring-slate-100">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-slate-400" />
                            <h3 className="font-bold text-slate-900 text-[11px]">Recent Hiring Activities</h3>
                        </div>
                        <Button variant="link" className="text-indigo-600 font-bold text-[9px] h-auto p-0">View Full Log</Button>
                    </div>
                    <div className="space-y-1">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity, i) => (
                                <div key={i} className="flex items-center justify-between p-1.5 bg-slate-50/50 rounded-lg border border-slate-50 transition-colors hover:bg-slate-50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                                            {activity.type === 'Candidate' ? <UserCheck className="h-3 w-3 text-indigo-400" /> : <Briefcase className="h-3 w-3 text-emerald-400" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-[9px]">{activity.title}</p>
                                            <p className="text-[7.5px] font-bold text-slate-300">{activity.time} • {activity.subtitle}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-white text-slate-400 border-none font-bold text-[7px] px-1.5 h-3.5">{activity.type}</Badge>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-2 text-slate-400 font-bold text-[9px]">No recent activity found.</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HiringReportsPage;
