"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { FileText, Download, BarChart3, PieChart, Calendar, Search, Filter, Clock, CheckCircle2, FileJson } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const TimeAttendReportsPage = () => {
    const [activeTab, setActiveTab] = useState("attendance");
    const [searchTerm, setSearchTerm] = useState("");
    const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);
    const { toast } = useToast();

    // Mock Data for Charts (Simple visual representation)
    const attendanceTrend = [65, 78, 85, 82, 90, 88, 95];
    const deptData = [
        { name: "Tech", value: 92, color: "bg-blue-500" },
        { name: "Sales", value: 85, color: "bg-emerald-500" },
        { name: "Ops", value: 78, color: "bg-amber-500" },
        { name: "HR", value: 95, color: "bg-rose-500" }
    ];

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
        const list = reports[tab as keyof typeof reports] || [];
        if (!searchTerm) return list;
        return list.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const handleDownload = (report: any) => {
        // Simulate CSV generation
        const headers = ["Report ID", "Name", "Type", "Frequency", "Generated On"];
        const row = [report.id, report.name, report.type, report.frequency, new Date().toLocaleDateString()];

        const csvContent = "data:text/csv;charset=utf-8," +
            headers.join(",") + "\n" +
            row.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Download Started",
            description: `${report.name} is downloading...`,
            className: "bg-emerald-50 border-emerald-100 text-emerald-800"
        });
    };

    const handleRun = (report: any) => {
        toast({
            title: "Processing Request",
            description: `Generating fresh data for ${report.name}...`,
        });
        setTimeout(() => {
            toast({
                title: "Report Ready",
                description: "Data updated successfully.",
                className: "bg-indigo-50 border-indigo-100 text-indigo-800"
            });
        }, 1500);
    };

    const handleExportAll = () => {
        toast({ title: "Bulk Export", description: "Zipping all reports across modules..." });
        setTimeout(() => {
            const link = document.createElement("a");
            link.href = "#"; // Simulation
            link.download = "All_Reports_Bundle.zip";
            link.click();
        }, 2000);
    };

    return (
        <div className="flex-1 bg-[#fcfdff] overflow-x-hidden overflow-y-auto min-h-screen">
            <div style={{ zoom: '0.6' }} className="p-12 space-y-10">

                {/* Header */}
                <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
                        <p className="text-slate-500 font-bold text-lg mt-2">Data-driven insights for workforce management.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 shadow-sm" onClick={() => setIsCustomReportOpen(true)}>
                            <BarChart3 className="mr-2 h-5 w-5" /> Custom Report
                        </Button>
                        <Button className="bg-[#6366f1] hover:bg-[#5558e6] h-12 px-8 rounded-2xl font-bold shadow-2xl shadow-indigo-200" onClick={handleExportAll}>
                            <FileJson className="mr-2 h-5 w-5" /> Export All Data
                        </Button>
                    </div>
                </div>

                {/* KPI Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Attendance KPI */}
                    <Card className="border-none shadow-2xl shadow-emerald-100 bg-emerald-50 rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                                    <PieChart size={28} />
                                </div>
                                <Badge className="bg-emerald-500 text-white border-none font-bold px-3 py-1.5 rounded-lg text-xs">+2.4%</Badge>
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-sm mb-1 tracking-wide">Avg. attendance</p>
                                <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">94.2%</h3>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-all duration-700" />
                    </Card>

                    {/* Overtime KPI */}
                    <Card className="border-none shadow-2xl shadow-indigo-100 bg-indigo-50 rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
                                    <Clock size={28} />
                                </div>
                                <Badge className="bg-indigo-500 text-white border-none font-bold px-3 py-1.5 rounded-lg text-xs">-1.2%</Badge>
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-sm mb-1 tracking-wide">Total overtime</p>
                                <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">142h</h3>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-all duration-700" />
                    </Card>

                    {/* Leaves KPI */}
                    <Card className="border-none shadow-2xl shadow-rose-100 bg-rose-50 rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                                    <Calendar size={28} />
                                </div>
                                <Badge className="bg-rose-500 text-white border-none font-bold px-3 py-1.5 rounded-lg text-xs">High</Badge>
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-sm mb-1 tracking-wide">Leave utilization</p>
                                <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">12%</h3>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-rose-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-all duration-700" />
                    </Card>

                    {/* Late Coming KPI */}
                    <Card className="border-none shadow-2xl shadow-amber-100 bg-amber-50 rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                                    <Filter size={28} />
                                </div>
                                <Badge className="bg-amber-500 text-white border-none font-bold px-3 py-1.5 rounded-lg text-xs">Alert</Badge>
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-sm mb-1 tracking-wide">Frequent lates</p>
                                <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">18</h3>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-200 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-all duration-700" />
                    </Card>
                </div>

                {/* Charts Section (Visual Content) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Departmental Consurency</h3>
                                <p className="text-slate-400 font-bold text-sm mt-1">Real-time shift adherence by department</p>
                            </div>
                            <Button variant="ghost" className="text-indigo-500 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-xl" onClick={() => toast({ title: "View Report", description: "Redirecting to detailed Department view..." })}>View Report</Button>
                        </div>

                        {/* CSS Chart Bar Representation */}
                        <div className="space-y-6">
                            {deptData.map((dept) => (
                                <div key={dept.name}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-slate-700">{dept.name} Dept</span>
                                        <span className="font-bold text-slate-900">{dept.value}%</span>
                                    </div>
                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${dept.value}%` }}
                                            transition={{ duration: 1 }}
                                            className={`h-full ${dept.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-indigo-100/50 rounded-[3rem] bg-[#6366f1] text-white p-10 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Trend Insight</h3>
                            <p className="text-indigo-200 font-bold text-sm mb-8">Weekly attendance volume</p>

                            <div className="flex items-end gap-2 h-40">
                                {attendanceTrend.map((val, i) => (
                                    <div key={i} className="flex-1 bg-white/20 rounded-t-xl hover:bg-white/40 transition-all cursor-pointer relative group" style={{ height: `${val}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-indigo-600 px-2 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            {val}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 font-bold text-center text-indigo-100 text-sm">Last 7 Days (Mon - Sun)</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    </Card>
                </div>

                {/* Reports Repository */}
                <div className="bg-white rounded-[3rem] p-10 shadow-3xl shadow-slate-200/50">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                            <TabsList className="bg-slate-100/80 p-1.5 rounded-[1.5rem] gap-2 h-auto inline-flex order-2 md:order-1 border border-slate-200/50">
                                {["Attendance", "Leave", "OT", "Shift"].map((tab) => (
                                    <TabsTrigger
                                        key={tab.toLowerCase()}
                                        value={tab.toLowerCase()}
                                        className="px-8 py-3 rounded-2xl font-bold text-sm text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#6366f1] data-[state=active]:shadow-lg transition-all"
                                    >
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <div className="relative order-1 md:order-2 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6366f1] transition-all" size={20} />
                                <Input
                                    className="pl-12 h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#6366f1] font-bold w-full md:w-80 transition-all"
                                    placeholder="Search report repository..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50/80">
                                    <TableRow className="border-slate-100">
                                        <TableHead className="p-6 font-bold text-xs uppercase tracking-widest text-slate-400">Report Name</TableHead>
                                        <TableHead className="p-6 font-bold text-xs uppercase tracking-widest text-slate-400">Classification</TableHead>
                                        <TableHead className="p-6 font-bold text-xs uppercase tracking-widest text-slate-400">Frequency</TableHead>
                                        <TableHead className="p-6 font-bold text-xs uppercase tracking-widest text-slate-400">Last Generated</TableHead>
                                        <TableHead className="p-6 font-bold text-xs uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getTabReports(activeTab).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center font-bold text-slate-400">
                                                No reports found matching your search.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        getTabReports(activeTab).map((report, i) => (
                                            <TableRow key={report.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                                <TableCell className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                                            <FileText size={20} />
                                                        </div>
                                                        <span className="font-bold text-slate-700 text-base">{report.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-6">
                                                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold px-4 py-1.5 rounded-lg text-xs">{report.type}</Badge>
                                                </TableCell>
                                                <TableCell className="p-6 font-bold text-slate-500">{report.frequency}</TableCell>
                                                <TableCell className="p-6 font-bold text-slate-500">{report.lastGenerated}</TableCell>
                                                <TableCell className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" className="h-10 px-5 rounded-xl font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700" onClick={() => handleRun(report)}>Run</Button>
                                                        <Button variant="ghost" className="h-10 w-10 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50" onClick={() => handleDownload(report)}>
                                                            <Download size={18} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Tabs>
                </div>
            </div>

            {/* Custom Report Dialog */}
            <Dialog open={isCustomReportOpen} onOpenChange={setIsCustomReportOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl p-8 bg-white border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900">Custom Report Builder</DialogTitle>
                        <DialogDescription className="font-semibold text-slate-500">
                            Configure parameters for a new report.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="font-bold text-slate-700">Report Type</Label>
                            <Select defaultValue="summary">
                                <SelectTrigger className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 font-bold text-slate-600">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-xl font-bold">
                                    <SelectItem value="summary">Attendance Summary</SelectItem>
                                    <SelectItem value="detailed">Detailed Logs</SelectItem>
                                    <SelectItem value="exception">Exception Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="range" className="font-bold text-slate-700">Date Range</Label>
                            <div className="flex gap-2">
                                <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold text-slate-600" />
                                <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold text-slate-600" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full h-12 rounded-xl bg-[#6366f1] hover:bg-[#5558e6] font-bold text-lg shadow-lg shadow-indigo-200" onClick={() => { setIsCustomReportOpen(false); toast({ title: "Report Queued", description: "Your custom report is being generated." }); }}>
                            Generate Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TimeAttendReportsPage;
