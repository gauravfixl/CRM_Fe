"use client"

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { FileText, Download, CalendarRange, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { Badge } from "@/shared/components/ui/badge";

const StatutoryReportsPage = () => {
    const [timeRange, setTimeRange] = useState("this_month");
    const { toast } = useToast();

    const reports = [
        {
            id: "PF",
            title: "PF (Provident Fund) Report",
            description: "Monthly PF contribution report for all employees",
            lastGenerated: "Jan 30, 2024",
            status: "Generated",
            employees: 235,
            amount: "₹ 12.5 L"
        },
        {
            id: "ESI",
            title: "ESI (Employee State Insurance) Report",
            description: "ESI contribution and compliance report",
            lastGenerated: "Jan 30, 2024",
            status: "Generated",
            employees: 187,
            amount: "₹ 3.2 L"
        },
        {
            id: "PT",
            title: "PT (Professional Tax) Report",
            description: "State-wise professional tax deduction report",
            lastGenerated: "Jan 30, 2024",
            status: "Generated",
            employees: 235,
            amount: "₹ 47,000"
        },
        {
            id: "TDS",
            title: "TDS (Tax Deducted at Source) Report",
            description: "Monthly TDS deduction and Form 24Q data",
            lastGenerated: "Jan 30, 2024",
            status: "Generated",
            employees: 235,
            amount: "₹ 18.3 L"
        }
    ];

    const challans = [
        { type: "PF Challan", dueDate: "Feb 15, 2024", status: "Pending", amount: "₹ 12.5 L" },
        { type: "ESI Challan", dueDate: "Feb 21, 2024", status: "Pending", amount: "₹ 3.2 L" },
        { type: "PT Challan", dueDate: "Feb 10, 2024", status: "Filed", amount: "₹ 47,000" },
        { type: "TDS Challan", dueDate: "Feb 07, 2024", status: "Filed", amount: "₹ 18.3 L" }
    ];

    const handleDownload = (reportName: string) => {
        toast({ title: "Downloading Report", description: `Downloading ${reportName}...` });
    };

    const handleGenerate = (reportName: string) => {
        toast({ title: "Generating Report", description: `${reportName} is being generated. This may take a few moments.` });
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Statutory Reports</h2>
                    <p className="text-slate-500 text-sm mt-1">Compliance reports and statutory filings.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select defaultValue="this_month" onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px] bg-white border-slate-200">
                            <CalendarRange className="mr-2 h-4 w-4 text-slate-400" />
                            <SelectValue placeholder="Select Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this_month">This Month</SelectItem>
                            <SelectItem value="last_month">Last Month</SelectItem>
                            <SelectItem value="this_quarter">This Quarter</SelectItem>
                            <SelectItem value="this_year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {reports.map((report) => (
                    <Card key={report.id} className="shadow-sm border-slate-200">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{report.title}</CardTitle>
                                        <CardDescription className="text-xs mt-1">{report.description}</CardDescription>
                                    </div>
                                </div>
                                <Badge className="bg-green-100 text-green-700 border-none">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    {report.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500 text-xs">Employees</span>
                                    <p className="font-bold text-slate-900">{report.employees}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs">Amount</span>
                                    <p className="font-bold text-slate-900">{report.amount}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs">Last Generated</span>
                                    <p className="font-medium text-slate-700 text-xs">{report.lastGenerated}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button size="sm" className="flex-1 bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => handleDownload(report.title)}>
                                    <Download className="mr-2 h-3 w-3" /> Download
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleGenerate(report.title)}>
                                    Regenerate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Challan Status */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Challan Filing Status</CardTitle>
                    <CardDescription>Upcoming and filed statutory challans.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {challans.map((challan, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${challan.status === "Filed" ? "bg-green-100" : "bg-amber-100"}`}>
                                        {challan.status === "Filed" ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-amber-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{challan.type}</p>
                                        <p className="text-xs text-slate-500">Due: {challan.dueDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{challan.amount}</p>
                                        <Badge className={`text-xs mt-1 ${challan.status === "Filed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} border-none`}>
                                            {challan.status}
                                        </Badge>
                                    </div>
                                    {challan.status === "Pending" && (
                                        <Button size="sm" onClick={() => toast({ title: "Filing Challan", description: `Filing ${challan.type}...` })}>
                                            File Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatutoryReportsPage;
