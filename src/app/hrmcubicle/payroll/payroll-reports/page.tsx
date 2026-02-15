"use client"

import React, { useState, useEffect } from "react";
import {
    BarChart3,
    FileSpreadsheet,
    Download,
    Calendar as CalendarIcon,
    Scale,
    Users,
    TrendingUp,
    ShieldCheck,
    Building2,
    History,
    ChevronRight,
    Activity,
    FileText,
    Check,
    ChevronLeft
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths, setMonth, getMonth, getYear } from "date-fns";

// --- Mock Data Generator ---
const generateMonthData = (date: Date) => {
    const monthIndex = date.getMonth(); // 0-11
    // Deterministic randomish data based on month
    const baseAmount = 14.28 + (monthIndex * 0.5);
    const isAuditReady = monthIndex % 3 !== 0; // Some months pending

    return {
        totalDisbursement: `₹${baseAmount.toFixed(2)} Cr`,
        growth: 4.2 + (monthIndex * 0.1),
        monthlyAvg: `₹${(1.19 + (monthIndex * 0.02)).toFixed(2)} Cr`,
        employees: 342 + monthIndex * 5,
        isAuditReady,
        chartData: Array.from({ length: 12 }, (_, i) => {
            // Random heights but consistent for the index
            return 30 + (i * 5) % 60 + (i === monthIndex ? 20 : 0);
        })
    };
};

const PayrollReportsPage = () => {
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 1)); // Jan 2026
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [stats, setStats] = useState(generateMonthData(selectedDate));

    // Update stats when date changes
    useEffect(() => {
        setStats(generateMonthData(selectedDate));
    }, [selectedDate]);

    // --- Mock Download Handler ---
    const simulateDownload = (filename: string, type: 'csv' | 'pdf' | 'zip' = 'csv') => {
        // Create dummy content
        const content = `Mock data for ${filename}\nGenerated on: ${new Date().toLocaleString()}\n\nThis is a placeholder file for demonstration purposes.`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.${type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleBatchExport = () => {
        toast({ title: "Processing Batch Export...", description: "Please wait while we aggregate your files." });

        // Simulate network delay
        setTimeout(() => {
            const fileName = `Payroll_Batch_${format(selectedDate, 'MMMM_yyyy')}`;
            simulateDownload(fileName, 'zip');
            toast({ title: "Export Complete", description: `${fileName}.zip has been downloaded.` });
        }, 1500);
    };

    const handleDownload = (reportName: string, ext: 'csv' | 'pdf' | 'xls' = 'csv') => {
        const cleanName = reportName.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${cleanName}_${format(selectedDate, 'MMM_yyyy')}`;

        toast({ title: "Downloading...", description: `Fetching ${fileName}.${ext}` });

        setTimeout(() => {
            simulateDownload(fileName, ext as any);
        }, 1000);
    };

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = setMonth(selectedDate, monthIndex);
        setSelectedDate(newDate);
        setIsCalendarOpen(false);
        toast({ title: "Period Updated", description: `Viewing data for ${format(newDate, 'MMMM yyyy')}` });
    };

    const changeYear = (increment: number) => {
        const newDate = increment > 0 ? addMonths(selectedDate, 12) : subMonths(selectedDate, 12);
        setSelectedDate(newDate);
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const statutoryReports = [
        { id: "PF", name: "Provident Fund (EPF)", desc: "ECR & Monthly Return", amount: "₹4.25L", status: "Generated", color: "text-[#CB9DF0]", bg: "bg-[#CB9DF0]/10" },
        { id: "ESI", name: "ESI Contribution", desc: "Monthly Compliance", amount: "₹85.5K", status: "Generated", color: "text-[#F0C1E1]", bg: "bg-[#F0C1E1]/10" },
        { id: "PT", name: "Professional Tax", desc: "State Liability", amount: "₹12.4K", status: stats.isAuditReady ? "Generated" : "Pending", color: "text-[#FDDBBB]", bg: "bg-[#FDDBBB]/20" },
        { id: "TDS", name: "TDS / Income Tax", desc: "Form 24Q & Quarterly", amount: "₹1.12L", status: "Verified", color: "text-[#CB9DF0]", bg: "bg-[#CB9DF0]/10" },
    ];

    const operationalReports = [
        { name: "Payroll Register", group: "Operational", desc: "Full breakdown per employee", format: "XLS / PDF", icon: FileSpreadsheet },
        { name: "Variance Report", group: "Audit", desc: "MoM disbursement delta", format: "XLS", icon: Scale },
        { name: "Bank Transfer JV", group: "Finance", desc: "Accounting journal", format: "XLSM", icon: Building2 },
        { name: "YTD Statement", group: "Yearly", desc: "Cumulative earnings", format: "PDF", icon: History },
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-6 px-8 flex items-center justify-between shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-4 text-start">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                        <BarChart3 size={20} />
                    </div>
                    <div className="text-start">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight text-start leading-none">Fiscal Intelligence</h1>
                        <p className="text-xs font-semibold text-slate-500 tracking-wide text-start italic mt-1.5 leading-none">Statutory & Operational Reports Hub</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <div className="h-10 px-4 bg-slate-50 hover:bg-slate-100 cursor-pointer rounded-lg flex items-center gap-2 border border-slate-100 transition-colors">
                                <CalendarIcon size={14} className="text-[#8B5CF6]" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{format(selectedDate, 'MMM yyyy')}</span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="end">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => changeYear(-12)}>
                                        <ChevronLeft size={14} />
                                    </Button>
                                    <span className="text-sm font-bold text-slate-700">{format(selectedDate, 'yyyy')}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => changeYear(12)}>
                                        <ChevronRight size={14} />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {months.map((month, index) => (
                                        <div
                                            key={month}
                                            onClick={() => handleMonthSelect(index)}
                                            className={cn(
                                                "cursor-pointer rounded-md px-2 py-1.5 text-center text-xs font-medium transition-all hover:bg-slate-100",
                                                getMonth(selectedDate) === index
                                                    ? "bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90 font-bold shadow-sm"
                                                    : "text-slate-600"
                                            )}
                                        >
                                            {month.slice(0, 3)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button onClick={handleBatchExport} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none transition-all">
                        <Download size={14} className="mr-2" /> Batch Export
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 pb-32 space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md h-full">
                            <CardContent className="p-4 h-full flex flex-col justify-center">
                                <div className="flex justify-between items-center w-full">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-500">Total Disbursement</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats.totalDisbursement}</p>
                                        <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] mt-1">
                                            <TrendingUp size={12} /> +{stats.growth.toFixed(1)}% Growth
                                        </div>
                                    </div>
                                    <div className="h-12 w-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center shadow-sm text-[#8B5CF6]">
                                        <BarChart3 size={24} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-emerald-500/20 bg-emerald-50 shadow-sm overflow-hidden transition-all hover:shadow-md h-full">
                            <CardContent className="p-4 h-full flex flex-col justify-center">
                                <div className="flex justify-between items-center w-full">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-emerald-700">Monthly Average</p>
                                        <p className="text-2xl font-bold text-emerald-900 tracking-tight">{stats.monthlyAvg}</p>
                                    </div>
                                    <div className="h-12 w-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm text-emerald-600">
                                        <Activity size={24} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-blue-500/20 bg-blue-50 shadow-sm overflow-hidden transition-all hover:shadow-md h-full">
                            <CardContent className="p-4 h-full flex flex-col justify-center">
                                <div className="flex justify-between items-center w-full">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-blue-700">Total Employees</p>
                                        <p className="text-2xl font-bold text-blue-900 tracking-tight">{stats.employees}</p>
                                    </div>
                                    <div className="h-12 w-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                                        <Users size={24} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#8B5CF6] to-[#7c4dff] p-3.5 text-white relative overflow-hidden group shadow-lg shadow-[#8B5CF6]/20 h-full flex flex-col justify-center">
                            <div className="relative z-10 flex flex-col items-start space-y-2 w-full">
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 bg-white/20 rounded-lg flex items-center justify-center border border-white/20 shadow-sm">
                                            <ShieldCheck size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold tracking-tight leading-none">Compliance Lighthouse</h3>
                                            <p className="text-[9px] font-medium text-white/70 italic mt-0.5">
                                                {stats.isAuditReady ? "All markers verified" : "Pending verifications"}
                                            </p>
                                        </div>
                                    </div>
                                    {stats.isAuditReady ? (
                                        <Badge className="bg-emerald-500 text-white border-none font-bold text-[9px] px-2 leading-none h-5 shadow-md">Ready</Badge>
                                    ) : (
                                        <Badge className="bg-amber-500 text-white border-none font-bold text-[9px] px-2 leading-none h-5 shadow-md">Pending</Badge>
                                    )}
                                </div>
                                <Button onClick={() => handleDownload("Compliance_Audit_Logs", "pdf")} className="w-full h-8 bg-white text-slate-900 font-bold text-[10px] rounded-lg hover:bg-white/90 border-none transition-all shadow-md mt-1">
                                    Export Logs
                                </Button>
                            </div>
                            <Activity size={80} className="absolute -right-6 -bottom-6 text-white opacity-10 group-hover:scale-110 transition-transform" />
                        </Card>
                    </div>

                    {/* Bar Chart Section */}
                    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden p-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none font-bold text-[10px] px-3 mb-2 leading-none h-6 shadow-sm">Metric Pulse</Badge>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Annual Disbursement Trend</h2>
                                    <p className="text-xs font-medium text-slate-400 mt-2 italic">Projected vs actual expenditure flow for {getYear(selectedDate)}</p>
                                </div>
                            </div>

                            <div className="flex items-end gap-3 px-4 py-6 h-48 relative">
                                {stats.chartData.map((h, i) => {
                                    const isSelected = getMonth(selectedDate) === i;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.05 }}
                                            onClick={() => handleMonthSelect(i)}
                                            className={cn(
                                                "flex-1 rounded-t-xl transition-all cursor-pointer group/bar relative",
                                                isSelected
                                                    ? "bg-[#8B5CF6] shadow-xl shadow-[#8B5CF6]/30"
                                                    : "bg-slate-100 hover:bg-[#8B5CF6]/20"
                                            )}
                                        >
                                            {/* Tooltip on hover */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {months[i].slice(0, 3)}: {h}%
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 pt-3 border-t border-slate-100">
                                <span>Jan {getYear(selectedDate)}</span>
                                <span>Dec {getYear(selectedDate)}</span>
                            </div>
                        </div>
                    </Card>

                    <Tabs defaultValue="statutory" className="space-y-6">
                        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12 shadow-sm inline-flex">
                            <TabsTrigger value="statutory" className="rounded-lg px-8 font-semibold text-xs data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white h-10 transition-all">Statutory Trace</TabsTrigger>
                            <TabsTrigger value="operational" className="rounded-lg px-8 font-semibold text-xs data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white h-10 transition-all">Operational Logs</TabsTrigger>
                        </TabsList>

                        <TabsContent value="statutory" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
                                {statutoryReports.map((report) => (
                                    <Card key={report.id} className="rounded-3xl border border-slate-200 bg-white p-7 space-y-6 shadow-sm hover:shadow-md transition-all group text-start">
                                        <div className="flex justify-between items-start text-start">
                                            <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", report.bg, report.color)}>
                                                <FileText size={20} />
                                            </div>
                                            <Badge className={cn("bg-white border-none text-[9px] font-bold h-5 px-2 uppercase tracking-wider shadow-sm", report.status === 'Pending' ? 'text-amber-500' : 'text-emerald-500')}>
                                                {report.status}
                                            </Badge>
                                        </div>
                                        <div className="text-start space-y-2">
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight text-start leading-none">{report.name}</h4>
                                            <p className="text-[10px] font-medium text-slate-500 tracking-wide mt-1 block text-start leading-tight">{report.desc}</p>
                                        </div>
                                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-start">
                                            <div className="text-start">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block text-start leading-none">Liability</span>
                                                <span className="text-sm font-bold text-slate-900 leading-none mt-2 block text-start">{report.amount}</span>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-xl text-slate-300 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 border-none transition-colors" onClick={() => handleDownload(report.name)}>
                                                <Download size={16} />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="operational" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
                                {operationalReports.map((report, i) => (
                                    <Card key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#8B5CF6]/30 transition-all cursor-pointer group text-start">
                                        <div className="flex items-center gap-5 text-start">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#8B5CF6]/10 group-hover:text-[#8B5CF6] transition-colors">
                                                <report.icon size={24} />
                                            </div>
                                            <div className="flex-1 text-start">
                                                <div className="flex justify-between items-start text-start">
                                                    <h4 className="text-sm font-bold text-slate-900 tracking-tight text-start leading-none">{report.name}</h4>
                                                    <Badge className="bg-slate-50 text-[8px] font-bold text-slate-500 uppercase border-none h-4 px-1.5 leading-none">{report.format}</Badge>
                                                </div>
                                                <p className="text-[10px] font-medium text-slate-500 tracking-wide mt-1.5 block text-start leading-none italic">{report.desc}</p>
                                                <div className="flex items-center gap-1.5 mt-3 text-[9px] font-bold text-[#8B5CF6] uppercase tracking-widest leading-none" onClick={() => handleDownload(report.name)}>
                                                    Initiate Trace <ChevronRight size={10} className="transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default PayrollReportsPage;
