"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    Clock,
    Plus,
    Send,
    Download,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Users,
    Target,
    FileText,
    Briefcase,
    Timer
} from "lucide-react";

type TimesheetEntry = {
    project: string;
    task: string;
    hours: number[];
};

type TimesheetHistory = {
    id: string;
    week: string;
    totalHours: number;
    billableHours: number;
    status: "Draft" | "Submitted" | "Approved" | "Rejected";
};

type TeamTimesheet = {
    employee: string;
    initials: string;
    week: string;
    totalHours: number;
    status: "Pending" | "Approved" | "Rejected";
};

type ProjectSummary = {
    project: string;
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekDates = ["Mar 30", "Mar 31", "Apr 01", "Apr 02", "Apr 03", "Apr 04", "Apr 05"];

const initialEntries: TimesheetEntry[] = [
    { project: "Project Phoenix", task: "Frontend Development", hours: [8, 7, 8, 6, 8, 0, 0] },
    { project: "Project Phoenix", task: "Code Reviews", hours: [0, 1, 0, 2, 0, 0, 0] },
    { project: "Client Alpha", task: "API Integration", hours: [0, 0, 0, 0, 0, 4, 0] },
    { project: "Internal", task: "Team Meetings", hours: [1, 1, 1, 1, 1, 0, 0] },
];

const mockHistory: TimesheetHistory[] = [
    { id: "TS-001", week: "Mar 30 - Apr 05", totalHours: 44, billableHours: 37, status: "Draft" },
    { id: "TS-002", week: "Mar 23 - Mar 29", totalHours: 42, billableHours: 36, status: "Approved" },
    { id: "TS-003", week: "Mar 16 - Mar 22", totalHours: 40, billableHours: 35, status: "Approved" },
    { id: "TS-004", week: "Mar 09 - Mar 15", totalHours: 38, billableHours: 30, status: "Approved" },
    { id: "TS-005", week: "Mar 02 - Mar 08", totalHours: 45, billableHours: 40, status: "Approved" },
    { id: "TS-006", week: "Feb 23 - Mar 01", totalHours: 36, billableHours: 28, status: "Rejected" },
];

const mockTeamTimesheets: TeamTimesheet[] = [
    { employee: "Priya Sharma", initials: "PS", week: "Mar 30 - Apr 05", totalHours: 42, status: "Pending" },
    { employee: "Amit Joshi", initials: "AJ", week: "Mar 30 - Apr 05", totalHours: 40, status: "Pending" },
    { employee: "Sneha Rao", initials: "SR", week: "Mar 30 - Apr 05", totalHours: 38, status: "Pending" },
    { employee: "Arjun Reddy", initials: "AR", week: "Mar 30 - Apr 05", totalHours: 44, status: "Approved" },
    { employee: "Kavita Patel", initials: "KP", week: "Mar 30 - Apr 05", totalHours: 41, status: "Rejected" },
];

const mockProjectSummary: ProjectSummary[] = [
    { project: "Project Phoenix", totalHours: 120, billableHours: 110, nonBillableHours: 10 },
    { project: "Client Alpha", totalHours: 45, billableHours: 45, nonBillableHours: 0 },
    { project: "Internal", totalHours: 25, billableHours: 0, nonBillableHours: 25 },
    { project: "Training", totalHours: 10, billableHours: 0, nonBillableHours: 10 },
];

const TimesheetsPage = () => {
    const { toast } = useToast();
    const [entries, setEntries] = useState(initialEntries);
    const [timesheetStatus, setTimesheetStatus] = useState<"Draft" | "Submitted" | "Approved" | "Rejected">("Draft");
    const targetHours = 40;

    const updateHour = (rowIdx: number, dayIdx: number, value: string) => {
        const num = parseFloat(value) || 0;
        const updated = entries.map((e, i) => {
            if (i !== rowIdx) return e;
            const hours = [...e.hours];
            hours[dayIdx] = num;
            return { ...e, hours };
        });
        setEntries(updated);
    };

    const addRow = () => {
        setEntries([...entries, { project: "New Project", task: "New Task", hours: [0, 0, 0, 0, 0, 0, 0] }]);
    };

    const rowTotal = (hours: number[]) => hours.reduce((s, h) => s + h, 0);
    const dayTotal = (dayIdx: number) => entries.reduce((s, e) => s + e.hours[dayIdx], 0);
    const weeklyTotal = entries.reduce((s, e) => s + rowTotal(e.hours), 0);

    const handleSubmit = () => {
        setTimesheetStatus("Submitted");
        toast({ title: "Timesheet Submitted", description: "Your timesheet has been sent for approval." });
    };

    const handleExport = () => {
        toast({ title: "Export Started", description: "Downloading timesheet as CSV..." });
    };

    const handleTeamAction = (employee: string, action: "approve" | "reject") => {
        toast({ title: action === "approve" ? "Approved" : "Rejected", description: `${employee}'s timesheet has been ${action}d.` });
    };

    const utilizationPct = Math.round((weeklyTotal / targetHours) * 100);

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            Draft: "bg-slate-50 text-slate-500 border-slate-200",
            Submitted: "bg-blue-50 text-blue-600 border-blue-200",
            Approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
            Rejected: "bg-rose-50 text-rose-600 border-rose-200",
            Pending: "bg-amber-50 text-amber-600 border-amber-200",
        };
        return <Badge variant="outline" className={styles[status] || ""}>{status}</Badge>;
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#8B5CF6] rounded-xl flex items-center justify-center text-white">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Timesheets</h1>
                        <p className="text-sm font-medium text-slate-500">Log project hours, track utilization, and manage approvals.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-slate-200" onClick={handleExport}>
                        <Download size={16} className="mr-2 text-slate-400" /> Export CSV
                    </Button>
                    {timesheetStatus === "Draft" && (
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleSubmit}>
                            <Send size={16} className="mr-2" /> Submit Timesheet
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Tabs defaultValue="timesheet" className="h-full flex flex-col">
                    <div className="px-8 pt-4 bg-white border-b border-slate-200">
                        <TabsList className="bg-slate-100">
                            <TabsTrigger value="timesheet" className="font-bold">My Timesheet</TabsTrigger>
                            <TabsTrigger value="history" className="font-bold">History</TabsTrigger>
                            <TabsTrigger value="team" className="font-bold">Team Approvals</TabsTrigger>
                            <TabsTrigger value="projects" className="font-bold">Project Summary</TabsTrigger>
                            <TabsTrigger value="utilization" className="font-bold">Utilization</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Weekly Timesheet */}
                    <TabsContent value="timesheet" className="flex-1 p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft size={16} /></Button>
                                <h3 className="text-sm font-bold text-slate-900">Week: Mar 30 - Apr 05, 2026</h3>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight size={16} /></Button>
                            </div>
                            <div className="flex items-center gap-3">
                                {statusBadge(timesheetStatus)}
                                <Button variant="outline" size="sm" className="font-bold text-xs" onClick={addRow}>
                                    <Plus size={14} className="mr-1" /> Add Row
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs w-[200px]">Project / Task</TableHead>
                                        {days.map((d, i) => (
                                            <TableHead key={d} className="font-bold text-slate-500 uppercase text-xs text-center w-[90px]">
                                                <div>{d}</div>
                                                <div className="text-[10px] font-normal text-slate-400">{weekDates[i]}</div>
                                            </TableHead>
                                        ))}
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs text-center w-[80px]">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entries.map((entry, rowIdx) => (
                                        <TableRow key={rowIdx} className="hover:bg-slate-50/50">
                                            <TableCell>
                                                <div>
                                                    <p className="font-bold text-slate-700 text-sm">{entry.project}</p>
                                                    <p className="text-xs text-slate-400">{entry.task}</p>
                                                </div>
                                            </TableCell>
                                            {entry.hours.map((h, dayIdx) => (
                                                <TableCell key={dayIdx} className="text-center p-1">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={24}
                                                        step={0.5}
                                                        value={h || ""}
                                                        onChange={e => updateHour(rowIdx, dayIdx, e.target.value)}
                                                        className="w-16 h-9 text-center mx-auto bg-slate-50 border-slate-200 font-bold text-sm"
                                                        disabled={timesheetStatus !== "Draft"}
                                                    />
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-center font-bold text-slate-900">{rowTotal(entry.hours)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {/* Daily totals */}
                                    <TableRow className="bg-slate-50 border-t-2 border-slate-200">
                                        <TableCell className="font-bold text-slate-900 text-sm">Daily Total</TableCell>
                                        {days.map((_, dayIdx) => (
                                            <TableCell key={dayIdx} className="text-center font-bold text-slate-900">{dayTotal(dayIdx)}</TableCell>
                                        ))}
                                        <TableCell className="text-center font-bold text-lg text-[#8B5CF6]">{weeklyTotal}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* History */}
                    <TabsContent value="history" className="flex-1 p-8">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Week</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Total Hours</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Billable</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockHistory.map(h => (
                                        <TableRow key={h.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-bold text-slate-700">{h.week}</TableCell>
                                            <TableCell className="text-sm text-slate-600">{h.totalHours}h</TableCell>
                                            <TableCell className="text-sm text-slate-600">{h.billableHours}h</TableCell>
                                            <TableCell>{statusBadge(h.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Team Approvals */}
                    <TabsContent value="team" className="flex-1 p-8">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Employee</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Week</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Total Hours</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockTeamTimesheets.map(t => (
                                        <TableRow key={t.employee} className="hover:bg-slate-50/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">{t.initials}</div>
                                                    <span className="font-bold text-slate-700">{t.employee}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">{t.week}</TableCell>
                                            <TableCell className="text-sm text-slate-600">{t.totalHours}h</TableCell>
                                            <TableCell>{statusBadge(t.status)}</TableCell>
                                            <TableCell className="text-right">
                                                {t.status === "Pending" && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs" onClick={() => handleTeamAction(t.employee, "approve")}>
                                                            <CheckCircle2 size={14} className="mr-1" /> Approve
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 font-bold text-xs" onClick={() => handleTeamAction(t.employee, "reject")}>
                                                            <XCircle size={14} className="mr-1" /> Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* Project Summary */}
                    <TabsContent value="projects" className="flex-1 p-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {mockProjectSummary.map(p => (
                                <Card key={p.project} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Briefcase size={16} className="text-[#8B5CF6]" />
                                            <p className="text-sm font-bold text-slate-900">{p.project}</p>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{p.totalHours}h</p>
                                        <div className="flex gap-4 mt-2 text-xs">
                                            <span className="text-emerald-600 font-medium">Billable: {p.billableHours}h</span>
                                            <span className="text-slate-400 font-medium">Non-billable: {p.nonBillableHours}h</span>
                                        </div>
                                        <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.totalHours > 0 ? (p.billableHours / p.totalHours) * 100 : 0}%` }} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Utilization */}
                    <TabsContent value="utilization" className="flex-1 p-8">
                        <div className="max-w-md">
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardContent className="p-8 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Target size={20} className="text-[#8B5CF6]" />
                                        <h3 className="text-lg font-bold text-slate-900">Weekly Utilization</h3>
                                    </div>
                                    <div className="relative w-40 h-40 mx-auto mb-4">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="8"
                                                strokeDasharray={`${utilizationPct * 2.51} 251`}
                                                strokeLinecap="round" transform="rotate(-90 50 50)" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-bold text-slate-900">{utilizationPct}%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-8 text-sm">
                                        <div>
                                            <p className="text-slate-400 font-medium">Target</p>
                                            <p className="text-lg font-bold text-slate-900">{targetHours}h</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-medium">Actual</p>
                                            <p className="text-lg font-bold text-[#8B5CF6]">{weeklyTotal}h</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default TimesheetsPage;
