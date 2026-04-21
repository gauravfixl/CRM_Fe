"use client"

import React, { useMemo, useState } from "react";
import {
    BarChart3,
    Download,
    Calendar,
    Users,
    Layers,
    Plane,
    ShieldCheck,
    ChevronRight,
    Eye,
    Filter,
    Receipt,
    X,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { useExpenseStore, type ExpenseCategory } from "@/shared/data/expense-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";

type ReportType = 'monthly' | 'department' | 'category' | 'employee' | 'travel' | 'compliance';

interface ReportConfig {
    key: ReportType;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bg: string;
}

const reports: ReportConfig[] = [
    { key: 'monthly', title: 'Monthly Expense Summary', description: 'Total expenses broken down by month with trends', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { key: 'department', title: 'Department-wise Report', description: 'Expense distribution across departments', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'category', title: 'Category-wise Report', description: 'Breakdown of expenses by category type', icon: Layers, color: 'text-green-600', bg: 'bg-green-50' },
    { key: 'employee', title: 'Employee-wise Report', description: 'Individual employee expense analysis', icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50' },
    { key: 'travel', title: 'Travel Expense Report', description: 'Travel-specific expense details and budgets', icon: Plane, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { key: 'compliance', title: 'Policy Compliance Report', description: 'Claims compliance rate and violation summary', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const categoryColors: Record<ExpenseCategory, string> = {
    Travel: '#8B5CF6',
    Food: '#F59E0B',
    Accommodation: '#3B82F6',
    Transport: '#10B981',
    Communication: '#EC4899',
    Medical: '#EF4444',
    Other: '#6B7280',
};

const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const esc = (v: string | number) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/\s+/g, '_').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

const ExpenseReportsPage = () => {
    const { toast } = useToast();
    const { claims, travelRequests, policies } = useExpenseStore();
    const [activeReport, setActiveReport] = useState<ReportType | null>(null);
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-03-31');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const dateRangeInvalid = useMemo(() => {
        if (!dateFrom || !dateTo) return false;
        return new Date(dateFrom) > new Date(dateTo);
    }, [dateFrom, dateTo]);

    const filteredClaims = useMemo(() => {
        if (dateRangeInvalid) return [];
        return claims.filter(c => c.date >= dateFrom && c.date <= dateTo);
    }, [claims, dateFrom, dateTo, dateRangeInvalid]);

    const monthlyData = useMemo(() => {
        const months: Record<string, number> = {};
        filteredClaims.forEach(c => {
            const m = c.date.substring(0, 7);
            months[m] = (months[m] || 0) + c.amount;
        });
        return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([month, amount]) => ({ month, amount }));
    }, [filteredClaims]);

    const departmentData = useMemo(() => [
        { dept: 'Engineering', total: 28500, claims: 12, avg: 2375 },
        { dept: 'Sales', total: 22000, claims: 8, avg: 2750 },
        { dept: 'Marketing', total: 15000, claims: 6, avg: 2500 },
        { dept: 'HR', total: 8500, claims: 4, avg: 2125 },
        { dept: 'Operations', total: 6000, claims: 3, avg: 2000 },
    ], []);

    const categoryData = useMemo(() => {
        const map: Record<string, { count: number; total: number }> = {};
        filteredClaims.forEach(c => {
            if (!map[c.category]) map[c.category] = { count: 0, total: 0 };
            map[c.category].count++;
            map[c.category].total += c.amount;
        });
        return Object.entries(map).map(([cat, data]) => ({
            category: cat as ExpenseCategory,
            count: data.count,
            total: data.total,
            avg: Math.round(data.total / data.count),
        })).sort((a, b) => b.total - a.total);
    }, [filteredClaims]);

    const employeeData = useMemo(() => {
        const map: Record<string, { name: string; count: number; total: number }> = {};
        filteredClaims.forEach(c => {
            if (!map[c.employeeId]) map[c.employeeId] = { name: c.employeeName, count: 0, total: 0 };
            map[c.employeeId].count++;
            map[c.employeeId].total += c.amount;
        });
        return Object.entries(map).map(([id, data]) => ({
            id,
            name: data.name,
            count: data.count,
            total: data.total,
        })).sort((a, b) => b.total - a.total);
    }, [filteredClaims]);

    const complianceData = useMemo(() => {
        let totalClaims = filteredClaims.length;
        let violations = 0;
        filteredClaims.forEach(c => {
            const policy = policies.find(p => p.category === c.category && p.isActive);
            if (policy) {
                if (c.amount > policy.maxAmount || (policy.requiresReceipt && !c.receiptUrl)) violations++;
            }
        });
        const complianceRate = totalClaims > 0 ? Math.round(((totalClaims - violations) / totalClaims) * 100) : 100;
        return { totalClaims, violations, compliant: totalClaims - violations, complianceRate };
    }, [filteredClaims, policies]);

    const topSpenders = useMemo(() => employeeData.slice(0, 5), [employeeData]);

    const exportReport = (type: ReportType) => {
        if (dateRangeInvalid) {
            toast({ title: "Invalid range", description: "Please fix the date range before exporting.", variant: "destructive" });
            return;
        }
        const title = reports.find(r => r.key === type)?.title || 'report';
        let headers: string[] = [];
        let rows: (string | number)[][] = [];
        switch (type) {
            case 'monthly':
                headers = ['Month', 'Total Amount (INR)'];
                rows = monthlyData.map(m => [m.month, m.amount]);
                break;
            case 'department':
                headers = ['Department', 'Total (INR)', 'Claims', 'Average (INR)'];
                rows = departmentData.map(d => [d.dept, d.total, d.claims, d.avg]);
                break;
            case 'category':
                headers = ['Category', 'Claims', 'Total (INR)', 'Average (INR)'];
                rows = categoryData.map(c => [c.category, c.count, c.total, c.avg]);
                break;
            case 'employee':
                headers = ['Employee ID', 'Name', 'Claims', 'Total (INR)'];
                rows = employeeData.map(e => [e.id, e.name, e.count, e.total]);
                break;
            case 'travel':
                headers = ['ID', 'Employee', 'Destination', 'Budget (INR)', 'Actual Spent (INR)', 'Status'];
                rows = travelRequests.map(t => [t.id, t.employeeName, t.destination, t.estimatedBudget, t.actualSpent, t.status]);
                break;
            case 'compliance':
                headers = ['Metric', 'Value'];
                rows = [
                    ['Total Claims', complianceData.totalClaims],
                    ['Compliant', complianceData.compliant],
                    ['Violations', complianceData.violations],
                    ['Compliance Rate (%)', complianceData.complianceRate],
                ];
                break;
        }
        if (rows.length === 0) {
            toast({ title: "No data", description: "Nothing to export for selected range.", variant: "destructive" });
            return;
        }
        downloadCSV(title, headers, rows);
        toast({ title: "Export Complete", description: `${title} has been exported.` });
    };

    const openReport = (type: ReportType) => {
        setActiveReport(type);
        setIsPreviewOpen(true);
    };

    const totalExpenses = filteredClaims.reduce((s, c) => s + c.amount, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Reports</h1>
                        <p className="text-sm text-slate-500">Generate and download expense analysis reports</p>
                    </div>
                </div>
            </div>

            {/* Date Filters */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <div className="flex items-center gap-2">
                            <Label className="text-xs font-bold text-slate-500">From</Label>
                            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[160px]" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs font-bold text-slate-500">To</Label>
                            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[160px]" />
                        </div>
                        <Button size="sm" variant="ghost" className="gap-1 text-slate-500" onClick={() => { setDateFrom('2026-01-01'); setDateTo('2026-03-31'); }}>
                            <X className="h-3 w-3" /> Reset
                        </Button>
                        <div className="ml-auto flex items-center gap-3 text-sm">
                            {dateRangeInvalid ? (
                                <span className="text-red-600 font-medium">From date must be on or before To date</span>
                            ) : (
                                <>
                                    <span className="text-slate-500">Total:</span>
                                    <span className="font-bold text-slate-900">₹{totalExpenses.toLocaleString()}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-slate-500">{filteredClaims.length} claims</span>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                    <Card key={report.key} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => openReport(report.key)}>
                        <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", report.bg)}>
                                    <report.icon className={cn("h-5 w-5", report.color)} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-slate-900">{report.title}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{report.description}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 mt-1" />
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={(e) => { e.stopPropagation(); openReport(report.key); }}>
                                    <Eye className="h-3 w-3" /> Preview
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={(e) => { e.stopPropagation(); exportReport(report.key); }}>
                                    <Download className="h-3 w-3" /> Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Top Spenders */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900">Top Spenders</h3>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => exportReport('employee')}>
                            <Download className="h-3 w-3" /> Export
                        </Button>
                    </div>
                    {topSpenders.length === 0 ? (
                        <p className="text-sm text-slate-400 py-4 text-center">No data in the selected date range.</p>
                    ) : (
                        <div className="space-y-3">
                            {topSpenders.map((emp, idx) => (
                                <div key={emp.id} className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-900">{emp.name}</span>
                                            <span className="text-sm font-bold text-slate-900">₹{emp.total.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(emp.total / (topSpenders[0]?.total || 1)) * 100}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">{emp.count} claims</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Policy Compliance Card */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Policy Compliance Rate</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-500 mb-1">Total Claims</p>
                            <p className="text-2xl font-bold text-slate-900">{complianceData.totalClaims}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <p className="text-xs text-green-600 mb-1">Compliant</p>
                            <p className="text-2xl font-bold text-green-700">{complianceData.compliant}</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                            <p className="text-xs text-red-600 mb-1">Violations</p>
                            <p className="text-2xl font-bold text-red-700">{complianceData.violations}</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <p className="text-xs text-purple-600 mb-1">Compliance Rate</p>
                            <p className="text-2xl font-bold text-purple-700">{complianceData.complianceRate}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Report Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>{reports.find(r => r.key === activeReport)?.title || 'Report'}</DialogTitle>
                        <DialogDescription>Period: {dateFrom} to {dateTo}</DialogDescription>
                    </DialogHeader>

                    {activeReport === 'monthly' && (
                        monthlyData.length === 0 ? (
                            <p className="text-sm text-slate-400 py-8 text-center">No data in the selected date range.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs font-bold text-slate-500">Month</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Total Amount</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Visual</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {monthlyData.map(m => (
                                        <TableRow key={m.month}>
                                            <TableCell className="text-sm font-medium text-slate-900">{m.month}</TableCell>
                                            <TableCell className="text-sm font-bold text-slate-900 text-right">₹{m.amount.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden w-40 ml-auto">
                                                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(m.amount / (monthlyData[0]?.amount || 1)) * 100}%` }} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    )}

                    {activeReport === 'department' && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs font-bold text-slate-500">Department</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Total</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Claims</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Average</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departmentData.map(d => (
                                    <TableRow key={d.dept}>
                                        <TableCell className="text-sm font-medium text-slate-900">{d.dept}</TableCell>
                                        <TableCell className="text-sm font-bold text-slate-900 text-right">₹{d.total.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm text-slate-600 text-right">{d.claims}</TableCell>
                                        <TableCell className="text-sm text-slate-600 text-right">₹{d.avg.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {activeReport === 'category' && (
                        categoryData.length === 0 ? (
                            <p className="text-sm text-slate-400 py-8 text-center">No data in the selected date range.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs font-bold text-slate-500">Category</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Claims</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Total</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Average</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categoryData.map(c => (
                                        <TableRow key={c.category}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColors[c.category] }} />
                                                    <span className="text-sm font-medium text-slate-900">{c.category}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600 text-right">{c.count}</TableCell>
                                            <TableCell className="text-sm font-bold text-slate-900 text-right">₹{c.total.toLocaleString()}</TableCell>
                                            <TableCell className="text-sm text-slate-600 text-right">₹{c.avg.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    )}

                    {activeReport === 'employee' && (
                        employeeData.length === 0 ? (
                            <p className="text-sm text-slate-400 py-8 text-center">No data in the selected date range.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs font-bold text-slate-500">Employee</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Claims</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Total Spent</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employeeData.map(e => (
                                        <TableRow key={e.id}>
                                            <TableCell className="text-sm font-medium text-slate-900">{e.name}</TableCell>
                                            <TableCell className="text-sm text-slate-600 text-right">{e.count}</TableCell>
                                            <TableCell className="text-sm font-bold text-slate-900 text-right">₹{e.total.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    )}

                    {activeReport === 'travel' && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs font-bold text-slate-500">ID</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500">Employee</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500">Destination</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Budget</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Actual</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-500">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {travelRequests.map(t => (
                                    <TableRow key={t.id}>
                                        <TableCell className="text-sm font-medium text-slate-700">{t.id}</TableCell>
                                        <TableCell className="text-sm text-slate-900">{t.employeeName}</TableCell>
                                        <TableCell className="text-sm text-slate-600">{t.destination}</TableCell>
                                        <TableCell className="text-sm font-medium text-slate-900 text-right">₹{t.estimatedBudget.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm font-medium text-slate-900 text-right">₹{t.actualSpent.toLocaleString()}</TableCell>
                                        <TableCell><Badge variant="secondary" className="text-xs">{t.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {activeReport === 'compliance' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-green-700">{complianceData.complianceRate}%</p>
                                    <p className="text-xs text-green-600">Compliance Rate</p>
                                </div>
                                <div className="bg-red-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-red-700">{complianceData.violations}</p>
                                    <p className="text-xs text-red-600">Total Violations</p>
                                </div>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs font-bold text-slate-500">Policy Category</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Max Amount</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Receipt Required</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {policies.filter(p => p.isActive).map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell className="text-sm font-medium text-slate-900">{p.category}</TableCell>
                                            <TableCell className="text-sm text-slate-600 text-right">₹{p.maxAmount.toLocaleString()}</TableCell>
                                            <TableCell className="text-sm text-slate-600 text-right">{p.requiresReceipt ? 'Yes' : 'No'}</TableCell>
                                            <TableCell><Badge variant="secondary" className="text-xs bg-green-50 text-green-700">Active</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => activeReport && exportReport(activeReport)}>
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExpenseReportsPage;
