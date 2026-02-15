"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { FileText, Download, BarChart3, PieChart, Calendar, Search, Filter } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";

const TimeAttendReportsPage = () => {
    const [activeTab, setActiveTab] = useState("attendance");
    const { toast } = useToast();

    const reports = {
        attendance: [
            { id: "REP-ATT-01", name: "Monthly Attendance Summary", type: "Summary", frequency: "Monthly", lastGenerated: "Jan 1, 2024" },
            { id: "REP-ATT-02", name: "Daily Attendance Details", type: "Detailed", frequency: "Daily", lastGenerated: "Jan 19, 2024" },
            { id: "REP-ATT-03", name: "Late Coming Report", type: "Exception", frequency: "Monthly", lastGenerated: "Jan 1, 2024" }
        ],
        leave: [
            { id: "REP-LV-01", name: "Leave Balance Report", type: "Summary", frequency: "Monthly", lastGenerated: "Jan 1, 2024" },
            { id: "REP-LV-02", name: "Leave Calendar View", type: "Visual", frequency: "Monthly", lastGenerated: "Jan 1, 2024" },
            { id: "REP-LV-03", name: "Encashment History", type: "Financial", frequency: "Yearly", lastGenerated: "Dec 31, 2023" }
        ],
        ot: [
            { id: "REP-OT-01", name: "Overtime Payout Report", type: "Financial", frequency: "Monthly", lastGenerated: "Jan 1, 2024" },
            { id: "REP-OT-02", name: "Department-wise OT Trends", type: "Analytical", frequency: "Quarterly", lastGenerated: "Jan 1, 2024" }
        ],
        shift: [
            { id: "REP-SH-01", name: "Shift Roster Report", type: "Schedule", frequency: "Weekly", lastGenerated: "Jan 15, 2024" },
            { id: "REP-SH-02", name: "Allowance Eligibility Report", type: "Financial", frequency: "Monthly", lastGenerated: "Jan 1, 2024" }
        ]
    };

    const getTabReports = (tab: string) => {
        return reports[tab as keyof typeof reports] || [];
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50 overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Time & Attend Reports</h2>
                    <p className="text-slate-500 text-sm mt-1">Analytics and data exports for all attendance modules.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Custom Report", description: "Opening report customizer..." })}>
                        <BarChart3 className="mr-2 h-4 w-4" /> Custom Report
                    </Button>
                    <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => toast({ title: "Export All", description: "Preparing all reports for export..." })}>
                        <Download className="mr-2 h-4 w-4" /> Export All
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full overflow-x-auto justify-start h-auto rounded-none">
                    {["Attendance", "Leave", "OT", "Shift"].map((tab) => (
                        <TabsTrigger
                            key={tab.toLowerCase()}
                            value={tab.toLowerCase()}
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap"
                        >
                            {tab} Reports
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="md:col-span-1 shadow-sm border-slate-200 h-fit">
                        <CardHeader>
                            <CardTitle className="text-base">Quick Access</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-[#6366f1] hover:bg-indigo-50" size="sm">
                                <PieChart className="mr-2 h-4 w-4" /> Last 30 Days Trends
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-[#6366f1] hover:bg-indigo-50" size="sm">
                                <Download className="mr-2 h-4 w-4" /> Export History
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-[#6366f1] hover:bg-indigo-50" size="sm">
                                <Calendar className="mr-2 h-4 w-4" /> Scheduled Reports
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3 shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics</CardTitle>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search reports..."
                                            className="pl-9 h-9 w-48 text-sm rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Report Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Frequency</TableHead>
                                        <TableHead>Last Generated</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getTabReports(activeTab).map((report) => (
                                        <TableRow key={report.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-semibold text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-slate-400" />
                                                    {report.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-none">{report.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-600">{report.frequency}</TableCell>
                                            <TableCell className="text-slate-500">{report.lastGenerated}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-[#6366f1] hover:bg-indigo-50"
                                                        onClick={() => toast({ title: "Generating Report", description: `Please wait while we generate ${report.name}...` })}
                                                    >
                                                        Run
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toast({ title: "Download", description: "Downloading report file..." })}>
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </Tabs>
        </div>
    );
};

export default TimeAttendReportsPage;
