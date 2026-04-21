"use client"

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Receipt,
    TrendingUp,
    Clock,
    Plane,
    Plus,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Download,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useExpenseStore, type ExpenseCategory, type ClaimStatus } from "@/shared/data/expense-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";

const categoryColors: Record<ExpenseCategory, string> = {
    Travel: '#8B5CF6',
    Food: '#F59E0B',
    Accommodation: '#3B82F6',
    Transport: '#10B981',
    Communication: '#EC4899',
    Medical: '#EF4444',
    Other: '#6B7280',
};

const statusConfig: Record<ClaimStatus, { color: string; bg: string }> = {
    Draft: { color: 'text-slate-600', bg: 'bg-slate-100' },
    Submitted: { color: 'text-blue-700', bg: 'bg-blue-50' },
    Approved: { color: 'text-green-700', bg: 'bg-green-50' },
    Rejected: { color: 'text-red-700', bg: 'bg-red-50' },
    Paid: { color: 'text-purple-700', bg: 'bg-purple-50' },
};

const ExpenseDashboard = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { claims, travelRequests } = useExpenseStore();
    const [selectedMonth, setSelectedMonth] = useState('2026-03');

    const stats = useMemo(() => {
        const monthClaims = claims.filter(c => c.date.startsWith(selectedMonth));
        const totalThisMonth = monthClaims.reduce((sum, c) => sum + c.amount, 0);
        const pendingApprovals = claims.filter(c => c.status === 'Submitted').length;
        const totalTravelBudget = travelRequests.reduce((s, t) => s + t.estimatedBudget, 0);
        const travelSpent = travelRequests.reduce((s, t) => s + t.actualSpent, 0);
        const travelBudgetPct = totalTravelBudget > 0 ? Math.round((travelSpent / totalTravelBudget) * 100) : 0;
        const avgProcessing = 2.4;
        return { totalThisMonth, pendingApprovals, travelBudgetPct, avgProcessing, travelSpent, totalTravelBudget };
    }, [claims, travelRequests, selectedMonth]);

    const categoryBreakdown = useMemo(() => {
        const map: Record<string, number> = {};
        claims.forEach(c => { map[c.category] = (map[c.category] || 0) + c.amount; });
        const total = Object.values(map).reduce((a, b) => a + b, 0);
        return Object.entries(map).map(([cat, amt]) => ({
            category: cat as ExpenseCategory,
            amount: amt,
            pct: total > 0 ? Math.round((amt / total) * 100) : 0,
        })).sort((a, b) => b.amount - a.amount);
    }, [claims]);

    const deptBreakdown = useMemo(() => {
        const depts = [
            { name: 'Engineering', amount: 28500, color: '#8B5CF6' },
            { name: 'Sales', amount: 22000, color: '#3B82F6' },
            { name: 'Marketing', amount: 15000, color: '#10B981' },
            { name: 'HR', amount: 8500, color: '#F59E0B' },
            { name: 'Operations', amount: 6000, color: '#EC4899' },
        ];
        const max = Math.max(...depts.map(d => d.amount));
        return depts.map(d => ({ ...d, pct: Math.round((d.amount / max) * 100) }));
    }, []);

    const recentClaims = useMemo(() => {
        return [...claims].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    }, [claims]);

    const kpiCards = [
        { label: 'Total Claims This Month', value: `₹${stats.totalThisMonth.toLocaleString()}`, icon: Receipt, change: '+12%', up: true, cardBg: 'bg-[#CB9DF0]' },
        { label: 'Pending Approvals', value: stats.pendingApprovals.toString(), icon: Clock, change: `${stats.pendingApprovals} awaiting`, up: false, cardBg: 'bg-[#F0C1E1]' },
        { label: 'Travel Budget Used', value: `${stats.travelBudgetPct}%`, icon: Plane, change: `₹${stats.travelSpent.toLocaleString()} / ₹${stats.totalTravelBudget.toLocaleString()}`, up: stats.travelBudgetPct > 75, cardBg: 'bg-[#FFF9BF]' },
        { label: 'Avg Processing Time', value: `${stats.avgProcessing} days`, icon: TrendingUp, change: '-0.3 days', up: false, cardBg: 'bg-[#FDDBBB]' },
    ];

    const handleExportRecent = () => {
        const headers = ['ID', 'Employee', 'Date', 'Category', 'Project', 'Amount', 'Status'];
        const rows = recentClaims.map(c => [c.id, c.employeeName, c.date, c.category, c.project || '-', c.amount.toString(), c.status]);
        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recent_claims_${selectedMonth}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Exported", description: "Recent claims downloaded as CSV." });
    };

    // Donut chart SVG
    const donutSegments = useMemo(() => {
        let offset = 0;
        const total = categoryBreakdown.reduce((s, c) => s + c.pct, 0);
        return categoryBreakdown.map(c => {
            const dashArray = (c.pct / total) * 283;
            const dashOffset = -offset;
            offset += dashArray;
            return { ...c, dashArray, dashOffset };
        });
    }, [categoryBreakdown]);

    const monthTrend = [
        { month: 'Oct', amount: 45000 },
        { month: 'Nov', amount: 52000 },
        { month: 'Dec', amount: 38000 },
        { month: 'Jan', amount: 61000 },
        { month: 'Feb', amount: 48000 },
        { month: 'Mar', amount: stats.totalThisMonth || 57000 },
    ];
    const trendMax = Math.max(...monthTrend.map(m => m.amount));

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                        <Receipt className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Management</h1>
                        <p className="text-sm text-slate-500">Track, manage and approve expense claims</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push('/hrmcubicle/expenses/settings')}>
                        <FileText className="h-4 w-4" /> View Policies
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push('/hrmcubicle/expenses/travel')}>
                        <Plane className="h-4 w-4" /> Travel Request
                    </Button>
                    <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => router.push('/hrmcubicle/expenses/claims')}>
                        <Plus className="h-4 w-4" /> New Claim
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => (
                    <Card key={i} className={`rounded-2xl border-none ${kpi.cardBg} shadow-sm`}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{kpi.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        {kpi.up ? <ArrowUpRight className="h-3 w-3 text-red-500" /> : <ArrowDownRight className="h-3 w-3 text-green-500" />}
                                        <span className={cn("text-xs font-medium", kpi.up ? "text-red-500" : "text-green-500")}>{kpi.change}</span>
                                    </div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/30 backdrop-blur-sm">
                                    <kpi.icon className="h-5 w-5 text-slate-800" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Donut Chart */}
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Claims by Category</h3>
                        <div className="flex items-center gap-6">
                            <div className="relative w-32 h-32 flex-shrink-0">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {donutSegments.map((seg, i) => (
                                        <circle
                                            key={i}
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke={categoryColors[seg.category]}
                                            strokeWidth="10"
                                            strokeDasharray={`${seg.dashArray} ${283 - seg.dashArray}`}
                                            strokeDashoffset={seg.dashOffset}
                                        />
                                    ))}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-slate-900">{claims.length}</span>
                                    <span className="text-[10px] text-slate-500">Claims</span>
                                </div>
                            </div>
                            <div className="space-y-2 flex-1">
                                {categoryBreakdown.map((c) => (
                                    <div key={c.category} className="flex items-center gap-2 text-xs">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColors[c.category] }} />
                                        <span className="text-slate-600 flex-1">{c.category}</span>
                                        <span className="font-semibold text-slate-900">{c.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Department Breakdown */}
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Department-wise Expenses</h3>
                        <div className="space-y-3">
                            {deptBreakdown.map((dept) => (
                                <div key={dept.name}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">{dept.name}</span>
                                        <span className="font-semibold text-slate-900">₹{dept.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dept.pct}%`, backgroundColor: dept.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Month Trend */}
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Monthly Trend</h3>
                        <div className="flex items-end gap-3 h-32">
                            {monthTrend.map((m) => (
                                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-medium text-slate-500">₹{(m.amount / 1000).toFixed(0)}k</span>
                                    <div className="w-full bg-slate-100 rounded-t-md overflow-hidden" style={{ height: '100%' }}>
                                        <div
                                            className="w-full rounded-t-md transition-all duration-500"
                                            style={{
                                                height: `${(m.amount / trendMax) * 100}%`,
                                                backgroundColor: m.month === 'Mar' ? '#8B5CF6' : '#C4B5FD',
                                                marginTop: `${100 - (m.amount / trendMax) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-500">{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Claims */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900">Recent Claims</h3>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={handleExportRecent}>
                                <Download className="h-3 w-3" /> Export
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs text-purple-600 hover:text-purple-700" onClick={() => router.push('/hrmcubicle/expenses/claims')}>
                                View All <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {recentClaims.map((claim) => (
                            <div key={claim.id} className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${categoryColors[claim.category]}15` }}>
                                    <Receipt className="h-4 w-4" style={{ color: categoryColors[claim.category] }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-900 truncate">{claim.employeeName}</span>
                                        <span className="text-xs text-slate-400">-</span>
                                        <span className="text-xs text-slate-500 truncate">{claim.description}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-slate-400">{claim.date}</span>
                                        <span className="text-xs text-slate-400">|</span>
                                        <span className="text-xs text-slate-500">{claim.category}</span>
                                        {claim.project && (
                                            <>
                                                <span className="text-xs text-slate-400">|</span>
                                                <span className="text-xs text-purple-600">{claim.project}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-900 whitespace-nowrap">₹{claim.amount.toLocaleString()}</span>
                                <Badge variant="secondary" className={cn("text-[10px] px-2 py-0.5", statusConfig[claim.status].bg, statusConfig[claim.status].color)}>
                                    {claim.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/hrmcubicle/expenses/claims')}>
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                            <Plus className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">New Expense Claim</p>
                            <p className="text-xs text-slate-500">Submit a new expense for reimbursement</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 ml-auto" />
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/hrmcubicle/expenses/travel')}>
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                            <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Travel Request</p>
                            <p className="text-xs text-slate-500">Plan and request travel approval</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 ml-auto" />
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/hrmcubicle/expenses/settings')}>
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                            <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Expense Policies</p>
                            <p className="text-xs text-slate-500">Review company expense guidelines</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 ml-auto" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ExpenseDashboard;
