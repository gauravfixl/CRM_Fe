"use client"

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
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
    Timer,
    Copy,
    Trash2,
    Search,
    StickyNote,
    TrendingUp,
    Eye,
    DollarSign,
    AlertCircle,
} from "lucide-react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

type TimesheetEntry = {
    id: string;
    project: string;
    task: string;
    hours: number[];
    billable: boolean;
    notes: string;
};

type TimesheetHistory = {
    id: string;
    week: string;
    totalHours: number;
    billableHours: number;
    submittedOn: string;
    status: "Draft" | "Submitted" | "Approved" | "Rejected";
};

type TeamTimesheet = {
    id: string;
    employee: string;
    initials: string;
    role: string;
    week: string;
    totalHours: number;
    billableHours: number;
    utilization: number;
    status: "Pending" | "Approved" | "Rejected";
};

type ProjectSummary = {
    project: string;
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    color: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PROJECT_OPTIONS = ["Project Phoenix", "Client Alpha", "Client Beta", "Internal", "Training", "Project Nova", "Client Gamma"];
const TASK_OPTIONS = ["Frontend Development", "Backend Development", "Code Reviews", "API Integration", "Testing", "Team Meetings", "Documentation", "Bug Fixes", "Design", "Planning"];
const STATUS_FILTERS = ["All", "Draft", "Submitted", "Approved", "Rejected"] as const;

const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
const getWeekStart = (d: Date) => {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const start = new Date(d);
    start.setDate(d.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
};
const getWeekDates = (start: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
};

const initialEntries: TimesheetEntry[] = [
    { id: "e1", project: "Project Phoenix", task: "Frontend Development", hours: [8, 7, 8, 6, 8, 0, 0], billable: true, notes: "Dashboard revamp and component library updates." },
    { id: "e2", project: "Project Phoenix", task: "Code Reviews", hours: [0, 1, 0, 2, 0, 0, 0], billable: true, notes: "" },
    { id: "e3", project: "Client Alpha", task: "API Integration", hours: [0, 0, 0, 0, 0, 4, 0], billable: true, notes: "Weekend urgent delivery." },
    { id: "e4", project: "Internal", task: "Team Meetings", hours: [1, 1, 1, 1, 1, 0, 0], billable: false, notes: "Daily standup." },
];

const mockHistory: TimesheetHistory[] = [
    { id: "TS-001", week: "Mar 30 - Apr 05", totalHours: 44, billableHours: 37, submittedOn: "Apr 06, 2026", status: "Draft" },
    { id: "TS-002", week: "Mar 23 - Mar 29", totalHours: 42, billableHours: 36, submittedOn: "Mar 30, 2026", status: "Approved" },
    { id: "TS-003", week: "Mar 16 - Mar 22", totalHours: 40, billableHours: 35, submittedOn: "Mar 23, 2026", status: "Approved" },
    { id: "TS-004", week: "Mar 09 - Mar 15", totalHours: 38, billableHours: 30, submittedOn: "Mar 16, 2026", status: "Approved" },
    { id: "TS-005", week: "Mar 02 - Mar 08", totalHours: 45, billableHours: 40, submittedOn: "Mar 09, 2026", status: "Approved" },
    { id: "TS-006", week: "Feb 23 - Mar 01", totalHours: 36, billableHours: 28, submittedOn: "Mar 02, 2026", status: "Rejected" },
    { id: "TS-007", week: "Feb 16 - Feb 22", totalHours: 40, billableHours: 34, submittedOn: "Feb 23, 2026", status: "Approved" },
    { id: "TS-008", week: "Feb 09 - Feb 15", totalHours: 41, billableHours: 36, submittedOn: "Feb 16, 2026", status: "Approved" },
];

const mockTeamTimesheets: TeamTimesheet[] = [
    { id: "T-01", employee: "Priya Sharma", initials: "PS", role: "Senior Developer", week: "Mar 30 - Apr 05", totalHours: 42, billableHours: 36, utilization: 105, status: "Pending" },
    { id: "T-02", employee: "Amit Joshi", initials: "AJ", role: "UI Designer", week: "Mar 30 - Apr 05", totalHours: 40, billableHours: 32, utilization: 100, status: "Pending" },
    { id: "T-03", employee: "Sneha Rao", initials: "SR", role: "QA Engineer", week: "Mar 30 - Apr 05", totalHours: 38, billableHours: 30, utilization: 95, status: "Pending" },
    { id: "T-04", employee: "Arjun Reddy", initials: "AR", role: "Backend Developer", week: "Mar 30 - Apr 05", totalHours: 44, billableHours: 40, utilization: 110, status: "Approved" },
    { id: "T-05", employee: "Kavita Patel", initials: "KP", role: "Product Analyst", week: "Mar 30 - Apr 05", totalHours: 41, billableHours: 33, utilization: 102, status: "Rejected" },
    { id: "T-06", employee: "Rahul Iyer", initials: "RI", role: "DevOps Engineer", week: "Mar 30 - Apr 05", totalHours: 39, billableHours: 31, utilization: 97, status: "Pending" },
];

const mockProjectSummary: ProjectSummary[] = [
    { project: "Project Phoenix", totalHours: 120, billableHours: 110, nonBillableHours: 10, color: "#8B5CF6" },
    { project: "Client Alpha", totalHours: 45, billableHours: 45, nonBillableHours: 0, color: "#3B82F6" },
    { project: "Client Beta", totalHours: 32, billableHours: 30, nonBillableHours: 2, color: "#10B981" },
    { project: "Internal", totalHours: 25, billableHours: 0, nonBillableHours: 25, color: "#F59E0B" },
    { project: "Training", totalHours: 10, billableHours: 0, nonBillableHours: 10, color: "#EC4899" },
];

const utilizationTrend = [
    { week: "W1", utilization: 92, billable: 78 },
    { week: "W2", utilization: 98, billable: 84 },
    { week: "W3", utilization: 105, billable: 90 },
    { week: "W4", utilization: 102, billable: 88 },
    { week: "W5", utilization: 95, billable: 82 },
    { week: "W6", utilization: 108, billable: 92 },
    { week: "W7", utilization: 110, billable: 94 },
    { week: "W8", utilization: 122, billable: 92 },
];

const teamUtilization = [
    { name: "Arjun Reddy", utilization: 110, billable: 91 },
    { name: "Priya Sharma", utilization: 105, billable: 86 },
    { name: "Kavita Patel", utilization: 102, billable: 80 },
    { name: "Amit Joshi", utilization: 100, billable: 80 },
    { name: "Rahul Iyer", utilization: 97, billable: 79 },
    { name: "Sneha Rao", utilization: 95, billable: 79 },
];

const TimesheetsPage = () => {
    const { toast } = useToast();

    // Core state
    const [weekStart, setWeekStart] = useState<Date>(getWeekStart(new Date(2026, 2, 30)));
    const [entries, setEntries] = useState<TimesheetEntry[]>(initialEntries);
    const [timesheetStatus, setTimesheetStatus] = useState<"Draft" | "Submitted" | "Approved" | "Rejected">("Draft");
    const targetHours = 40;

    // Dialog state
    const [notesOpen, setNotesOpen] = useState(false);
    const [notesEntryId, setNotesEntryId] = useState<string | null>(null);
    const [notesDraft, setNotesDraft] = useState("");

    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<TeamTimesheet | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailTarget, setDetailTarget] = useState<TeamTimesheet | null>(null);

    const [historyFilter, setHistoryFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
    const [historySearch, setHistorySearch] = useState("");

    const [teamSearch, setTeamSearch] = useState("");
    const [teamFilter, setTeamFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

    const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
    const weekLabel = `${fmtDate(weekDates[0])} - ${fmtDate(weekDates[6])}, ${weekDates[6].getFullYear()}`;

    const updateHour = (rowId: string, dayIdx: number, value: string) => {
        const num = parseFloat(value);
        const safe = isNaN(num) ? 0 : Math.max(0, Math.min(24, num));
        setEntries(prev => prev.map(e => e.id !== rowId ? e : { ...e, hours: e.hours.map((h, i) => i === dayIdx ? safe : h) }));
    };

    const updateField = (rowId: string, field: keyof TimesheetEntry, value: string | boolean) => {
        setEntries(prev => prev.map(e => e.id !== rowId ? e : { ...e, [field]: value }));
    };

    const addRow = () => {
        const newId = `e${Date.now()}`;
        setEntries([...entries, { id: newId, project: PROJECT_OPTIONS[0], task: TASK_OPTIONS[0], hours: [0, 0, 0, 0, 0, 0, 0], billable: true, notes: "" }]);
    };

    const deleteRow = (rowId: string) => {
        setEntries(prev => prev.filter(e => e.id !== rowId));
        toast({ title: "Row removed", description: "Entry deleted from timesheet." });
    };

    const copyLastWeek = () => {
        toast({ title: "Copied from last week", description: "Previous week's entries have been loaded." });
    };

    const rowTotal = (hours: number[]) => hours.reduce((s, h) => s + h, 0);
    const dayTotal = (dayIdx: number) => entries.reduce((s, e) => s + e.hours[dayIdx], 0);
    const weeklyTotal = entries.reduce((s, e) => s + rowTotal(e.hours), 0);
    const billableTotal = entries.filter(e => e.billable).reduce((s, e) => s + rowTotal(e.hours), 0);
    const nonBillableTotal = weeklyTotal - billableTotal;
    const utilizationPct = Math.round((weeklyTotal / targetHours) * 100);
    const billablePct = weeklyTotal > 0 ? Math.round((billableTotal / weeklyTotal) * 100) : 0;
    const pendingApprovals = mockTeamTimesheets.filter(t => t.status === "Pending").length;

    const handleSubmit = () => {
        if (weeklyTotal === 0) {
            toast({ title: "Cannot submit empty timesheet", description: "Log at least some hours before submitting.", variant: "destructive" });
            return;
        }
        setTimesheetStatus("Submitted");
        toast({ title: "Timesheet Submitted", description: `${weeklyTotal}h sent for approval.` });
    };

    const handleExport = () => {
        const header = ["Project", "Task", "Billable", ...DAYS, "Total", "Notes"];
        const rows = entries.map(e => [e.project, e.task, e.billable ? "Yes" : "No", ...e.hours.map(String), String(rowTotal(e.hours)), `"${e.notes.replace(/"/g, '""')}"`]);
        const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `timesheet-${weekDates[0].toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Export Complete", description: "Timesheet downloaded as CSV." });
    };

    const shiftWeek = (delta: number) => {
        const next = new Date(weekStart);
        next.setDate(weekStart.getDate() + delta * 7);
        setWeekStart(next);
    };

    const openNotes = (entry: TimesheetEntry) => {
        setNotesEntryId(entry.id);
        setNotesDraft(entry.notes);
        setNotesOpen(true);
    };
    const saveNotes = () => {
        if (notesEntryId) updateField(notesEntryId, "notes", notesDraft);
        setNotesOpen(false);
        toast({ title: "Notes saved" });
    };

    const openDetail = (t: TeamTimesheet) => { setDetailTarget(t); setDetailOpen(true); };
    const openReject = (t: TeamTimesheet) => { setRejectTarget(t); setRejectReason(""); setRejectOpen(true); };
    const confirmReject = () => {
        if (!rejectReason.trim()) {
            toast({ title: "Reason required", description: "Please provide a reason for rejection.", variant: "destructive" });
            return;
        }
        toast({ title: "Timesheet Rejected", description: `${rejectTarget?.employee}'s timesheet rejected with note.` });
        setRejectOpen(false);
    };
    const handleApprove = (t: TeamTimesheet) => {
        toast({ title: "Approved", description: `${t.employee}'s timesheet approved.` });
    };

    const filteredHistory = useMemo(() => {
        return mockHistory.filter(h => {
            const matchStatus = historyFilter === "All" || h.status === historyFilter;
            const matchSearch = h.week.toLowerCase().includes(historySearch.toLowerCase()) || h.id.toLowerCase().includes(historySearch.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [historyFilter, historySearch]);

    const filteredTeam = useMemo(() => {
        return mockTeamTimesheets.filter(t => {
            const matchStatus = teamFilter === "All" || t.status === teamFilter;
            const matchSearch = t.employee.toLowerCase().includes(teamSearch.toLowerCase()) || t.role.toLowerCase().includes(teamSearch.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [teamFilter, teamSearch]);

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            Draft: "bg-slate-50 text-slate-600 border-slate-200",
            Submitted: "bg-blue-50 text-blue-600 border-blue-200",
            Approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
            Rejected: "bg-rose-50 text-rose-600 border-rose-200",
            Pending: "bg-amber-50 text-amber-600 border-amber-200",
        };
        return <Badge variant="outline" className={`${styles[status] || ""} font-semibold`}>{status}</Badge>;
    };

    const kpiCards = [
        { label: "Weekly Hours Logged", value: `${weeklyTotal}h`, sub: `Target ${targetHours}h`, icon: Clock, cardBg: "bg-[#CB9DF0]" },
        { label: "Billable Rate", value: `${billablePct}%`, sub: `${billableTotal}h billable`, icon: DollarSign, cardBg: "bg-[#F0C1E1]" },
        { label: "Pending Approvals", value: pendingApprovals.toString(), sub: `${pendingApprovals} team members`, icon: AlertCircle, cardBg: "bg-[#FFF9BF]" },
        { label: "Utilization", value: `${utilizationPct}%`, sub: utilizationPct >= 100 ? "On track" : "Below target", icon: Target, cardBg: "bg-[#FDDBBB]" },
    ];

    const projectKpi = useMemo(() => {
        const totalH = mockProjectSummary.reduce((s, p) => s + p.totalHours, 0);
        const totalBill = mockProjectSummary.reduce((s, p) => s + p.billableHours, 0);
        const top = [...mockProjectSummary].sort((a, b) => b.totalHours - a.totalHours)[0];
        const billRate = totalH > 0 ? Math.round((totalBill / totalH) * 100) : 0;
        return { totalH, totalBill, top, billRate };
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#8B5CF6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
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
                    {timesheetStatus === "Draft" ? (
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold shadow-lg shadow-purple-200" onClick={handleSubmit}>
                            <Send size={16} className="mr-2" /> Submit Timesheet
                        </Button>
                    ) : (
                        <Badge variant="outline" className="h-10 px-4 bg-blue-50 text-blue-600 border-blue-200 font-bold">
                            <CheckCircle2 size={14} className="mr-2" /> {timesheetStatus}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="p-8 space-y-6">
                    {/* KPI stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {kpiCards.map((k, i) => (
                            <motion.div
                                key={k.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className={`${k.cardBg} rounded-2xl border-0 shadow-sm overflow-hidden`}>
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="h-10 w-10 rounded-xl bg-white/60 flex items-center justify-center">
                                                <k.icon size={18} className="text-slate-800" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800/80 mb-1">{k.label}</p>
                                        <p className="text-3xl font-bold text-slate-900">{k.value}</p>
                                        <p className="text-xs font-medium text-slate-700/70 mt-1">{k.sub}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <Tabs defaultValue="timesheet" className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 inline-flex shadow-sm">
                            <TabsList className="bg-transparent gap-1">
                                <TabsTrigger value="timesheet" className="font-bold data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">My Timesheet</TabsTrigger>
                                <TabsTrigger value="history" className="font-bold data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">History</TabsTrigger>
                                <TabsTrigger value="team" className="font-bold data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">Team Approvals</TabsTrigger>
                                <TabsTrigger value="projects" className="font-bold data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">Project Summary</TabsTrigger>
                                <TabsTrigger value="utilization" className="font-bold data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">Utilization</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* My Timesheet */}
                        <TabsContent value="timesheet" className="space-y-5 mt-0">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200" onClick={() => shiftWeek(-1)}>
                                            <ChevronLeft size={16} />
                                        </Button>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase">Week</p>
                                            <h3 className="text-base font-bold text-slate-900">{weekLabel}</h3>
                                        </div>
                                        <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200" onClick={() => shiftWeek(1)}>
                                            <ChevronRight size={16} />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="font-bold text-xs text-slate-500" onClick={() => setWeekStart(getWeekStart(new Date(2026, 2, 30)))}>
                                            This Week
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {statusBadge(timesheetStatus)}
                                        <Button variant="outline" size="sm" className="font-bold text-xs" onClick={copyLastWeek}>
                                            <Copy size={14} className="mr-1.5" /> Copy Last Week
                                        </Button>
                                        <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs" onClick={addRow}>
                                            <Plus size={14} className="mr-1.5" /> Add Row
                                        </Button>
                                    </div>
                                </div>

                                {/* Progress strip */}
                                <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <Target size={16} className="text-[#8B5CF6]" />
                                            <span className="text-sm font-bold text-slate-800">Weekly Progress</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#8B5CF6]">{weeklyTotal}h / {targetHours}h</span>
                                    </div>
                                    <div className="h-2.5 bg-white rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(utilizationPct, 100)}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider w-[200px]">Project</TableHead>
                                                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider w-[180px]">Task</TableHead>
                                                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center w-[80px]">Billable</TableHead>
                                                {DAYS.map((d, i) => {
                                                    const isWeekend = i >= 5;
                                                    return (
                                                        <TableHead key={d} className={`font-bold uppercase text-[10px] text-center w-[80px] ${isWeekend ? "text-slate-300" : "text-slate-500"}`}>
                                                            <div className="tracking-wider">{d}</div>
                                                            <div className="text-[10px] font-normal opacity-70">{weekDates[i].getDate()}</div>
                                                        </TableHead>
                                                    );
                                                })}
                                                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center w-[70px]">Total</TableHead>
                                                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center w-[90px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {entries.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={12} className="text-center py-12">
                                                        <Timer size={32} className="mx-auto text-slate-300 mb-2" />
                                                        <p className="text-sm font-bold text-slate-500">No entries yet</p>
                                                        <p className="text-xs text-slate-400 mt-1">Click "Add Row" to start logging hours</p>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {entries.map((entry) => {
                                                const total = rowTotal(entry.hours);
                                                return (
                                                    <TableRow key={entry.id} className="hover:bg-slate-50/50">
                                                        <TableCell>
                                                            <Select value={entry.project} onValueChange={(v) => updateField(entry.id, "project", v)} disabled={timesheetStatus !== "Draft"}>
                                                                <SelectTrigger className="h-9 border-slate-200 font-semibold text-sm">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {PROJECT_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select value={entry.task} onValueChange={(v) => updateField(entry.id, "task", v)} disabled={timesheetStatus !== "Draft"}>
                                                                <SelectTrigger className="h-9 border-slate-200 text-sm">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {TASK_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <button
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${entry.billable ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"}`}
                                                                onClick={() => updateField(entry.id, "billable", !entry.billable)}
                                                                disabled={timesheetStatus !== "Draft"}
                                                            >
                                                                <DollarSign size={10} />
                                                                {entry.billable ? "YES" : "NO"}
                                                            </button>
                                                        </TableCell>
                                                        {entry.hours.map((h, dayIdx) => {
                                                            const isWeekend = dayIdx >= 5;
                                                            const isOvertime = h > 8;
                                                            return (
                                                                <TableCell key={dayIdx} className={`text-center p-1 ${isWeekend ? "bg-slate-50/40" : ""}`}>
                                                                    <Input
                                                                        type="number"
                                                                        min={0}
                                                                        max={24}
                                                                        step={0.5}
                                                                        value={h || ""}
                                                                        onChange={e => updateHour(entry.id, dayIdx, e.target.value)}
                                                                        className={`w-16 h-9 text-center mx-auto font-bold text-sm border-slate-200 ${isOvertime ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50"}`}
                                                                        disabled={timesheetStatus !== "Draft"}
                                                                    />
                                                                </TableCell>
                                                            );
                                                        })}
                                                        <TableCell className={`text-center font-bold ${total > 40 ? "text-amber-600" : "text-slate-900"}`}>
                                                            {total}h
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-center gap-1">
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className={`h-7 w-7 ${entry.notes ? "text-[#8B5CF6]" : "text-slate-400"}`}
                                                                    onClick={() => openNotes(entry)}
                                                                    disabled={timesheetStatus !== "Draft"}
                                                                >
                                                                    <StickyNote size={14} />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-7 w-7 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                                                                    onClick={() => deleteRow(entry.id)}
                                                                    disabled={timesheetStatus !== "Draft"}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {/* Daily totals */}
                                            <TableRow className="bg-slate-50 border-t-2 border-slate-200">
                                                <TableCell colSpan={3} className="font-bold text-slate-900 text-sm">Daily Total</TableCell>
                                                {DAYS.map((_, dayIdx) => {
                                                    const t = dayTotal(dayIdx);
                                                    const isWeekend = dayIdx >= 5;
                                                    return (
                                                        <TableCell key={dayIdx} className={`text-center font-bold ${isWeekend ? "text-slate-400" : "text-slate-900"}`}>
                                                            {t > 0 ? `${t}h` : "-"}
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell className="text-center font-bold text-lg text-[#8B5CF6]">{weeklyTotal}h</TableCell>
                                                <TableCell />
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>

                        {/* History */}
                        <TabsContent value="history" className="space-y-5 mt-0">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[260px]">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        placeholder="Search by week or ID..."
                                        value={historySearch}
                                        onChange={e => setHistorySearch(e.target.value)}
                                        className="pl-9 h-10 border-slate-200"
                                    />
                                </div>
                                <Select value={historyFilter} onValueChange={(v) => setHistoryFilter(v as typeof historyFilter)}>
                                    <SelectTrigger className="w-[180px] h-10 border-slate-200 font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_FILTERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="font-bold border-slate-200" onClick={handleExport}>
                                    <Download size={16} className="mr-2 text-slate-400" /> Export
                                </Button>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">ID</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Week</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Submitted</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Total Hours</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Billable</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Billable %</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Status</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHistory.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-12">
                                                    <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                                                    <p className="text-sm font-bold text-slate-500">No records match your filters</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredHistory.map(h => {
                                            const pct = h.totalHours > 0 ? Math.round((h.billableHours / h.totalHours) * 100) : 0;
                                            return (
                                                <TableRow
                                                    key={h.id}
                                                    onClick={() => toast({ title: "Timesheet Details", description: `Viewing ${h.id} for ${h.week}.` })}
                                                    className="hover:bg-slate-50/50 cursor-pointer"
                                                >
                                                    <TableCell className="font-mono text-xs text-slate-500">{h.id}</TableCell>
                                                    <TableCell className="font-bold text-slate-700">{h.week}</TableCell>
                                                    <TableCell className="text-sm text-slate-500">{h.submittedOn}</TableCell>
                                                    <TableCell className="text-sm font-semibold text-slate-700">{h.totalHours}h</TableCell>
                                                    <TableCell className="text-sm text-slate-600">{h.billableHours}h</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-600">{pct}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{statusBadge(h.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" className="font-bold text-xs text-[#8B5CF6] hover:bg-purple-50">
                                                            <Eye size={14} className="mr-1" /> View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        {/* Team Approvals */}
                        <TabsContent value="team" className="space-y-5 mt-0">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[260px]">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        placeholder="Search employees..."
                                        value={teamSearch}
                                        onChange={e => setTeamSearch(e.target.value)}
                                        className="pl-9 h-10 border-slate-200"
                                    />
                                </div>
                                <Select value={teamFilter} onValueChange={(v) => setTeamFilter(v as typeof teamFilter)}>
                                    <SelectTrigger className="w-[180px] h-10 border-slate-200 font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Status</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 ml-auto">
                                    <Users size={14} />
                                    <span>{filteredTeam.length} of {mockTeamTimesheets.length} shown</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Employee</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Week</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Total Hours</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Billable</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Utilization</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Status</TableHead>
                                            <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTeam.map(t => (
                                            <TableRow key={t.id} className="hover:bg-slate-50/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-white font-bold text-xs">
                                                            {t.initials}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm">{t.employee}</p>
                                                            <p className="text-xs text-slate-400">{t.role}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600">{t.week}</TableCell>
                                                <TableCell className="text-sm font-semibold text-slate-700">{t.totalHours}h</TableCell>
                                                <TableCell className="text-sm text-slate-600">{t.billableHours}h</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${t.utilization > 100 ? "bg-emerald-500" : t.utilization >= 90 ? "bg-[#8B5CF6]" : "bg-amber-500"}`}
                                                                style={{ width: `${Math.min(t.utilization, 120)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-600">{t.utilization}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{statusBadge(t.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="ghost" className="font-bold text-xs text-slate-500" onClick={() => openDetail(t)}>
                                                            <Eye size={13} className="mr-1" /> View
                                                        </Button>
                                                        {t.status === "Pending" && (
                                                            <>
                                                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs" onClick={() => handleApprove(t)}>
                                                                    <CheckCircle2 size={13} className="mr-1" /> Approve
                                                                </Button>
                                                                <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold text-xs" onClick={() => openReject(t)}>
                                                                    <XCircle size={13} className="mr-1" /> Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        {/* Project Summary */}
                        <TabsContent value="projects" className="space-y-5 mt-0">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center"><Briefcase size={16} className="text-[#8B5CF6]" /></div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Total Hours</p>
                                        </div>
                                        <p className="text-3xl font-bold text-slate-900">{projectKpi.totalH}h</p>
                                        <p className="text-xs text-slate-400 mt-1">Across {mockProjectSummary.length} projects</p>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center"><DollarSign size={16} className="text-emerald-600" /></div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Billable Hours</p>
                                        </div>
                                        <p className="text-3xl font-bold text-slate-900">{projectKpi.totalBill}h</p>
                                        <p className="text-xs text-emerald-600 font-semibold mt-1">{projectKpi.billRate}% billable</p>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center"><TrendingUp size={16} className="text-blue-600" /></div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Top Project</p>
                                        </div>
                                        <p className="text-base font-bold text-slate-900 truncate">{projectKpi.top.project}</p>
                                        <p className="text-xs text-slate-400 mt-1">{projectKpi.top.totalHours}h logged</p>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center"><AlertCircle size={16} className="text-amber-600" /></div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Non-Billable</p>
                                        </div>
                                        <p className="text-3xl font-bold text-slate-900">{projectKpi.totalH - projectKpi.totalBill}h</p>
                                        <p className="text-xs text-slate-400 mt-1">{100 - projectKpi.billRate}% of total</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-5">
                                            <BarChart3 size={18} className="text-[#8B5CF6]" />
                                            <h3 className="text-base font-bold text-slate-900">Hours by Project</h3>
                                        </div>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={mockProjectSummary} layout="vertical" margin={{ left: 30 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
                                                <YAxis type="category" dataKey="project" tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }} width={120} />
                                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                                                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
                                                <Bar dataKey="billableHours" name="Billable" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
                                                <Bar dataKey="nonBillableHours" name="Non-Billable" stackId="a" fill="#CBD5E1" radius={[0, 8, 8, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-5">
                                            <Briefcase size={18} className="text-[#8B5CF6]" />
                                            <h3 className="text-base font-bold text-slate-900">Project Breakdown</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {mockProjectSummary.map(p => {
                                                const pct = projectKpi.totalH > 0 ? Math.round((p.totalHours / projectKpi.totalH) * 100) : 0;
                                                return (
                                                    <div key={p.project}>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                                                <span className="text-sm font-semibold text-slate-700">{p.project}</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-500">{p.totalHours}h · {pct}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className="h-full rounded-full"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${pct}%` }}
                                                                transition={{ duration: 0.6 }}
                                                                style={{ backgroundColor: p.color }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Utilization */}
                        <TabsContent value="utilization" className="space-y-5 mt-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-5">
                                            <Target size={18} className="text-[#8B5CF6]" />
                                            <h3 className="text-base font-bold text-slate-900">Weekly Utilization</h3>
                                        </div>
                                        <div className="relative w-48 h-48 mx-auto my-4">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                                <motion.circle
                                                    cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="10"
                                                    strokeLinecap="round" transform="rotate(-90 50 50)"
                                                    initial={{ strokeDasharray: "0 251" }}
                                                    animate={{ strokeDasharray: `${Math.min(utilizationPct, 100) * 2.51} 251` }}
                                                    transition={{ duration: 0.8 }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-bold text-slate-900">{utilizationPct}%</span>
                                                <span className="text-xs font-semibold text-slate-500 uppercase mt-1">Utilization</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center mt-4">
                                            <div className="p-2 rounded-lg bg-slate-50">
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Target</p>
                                                <p className="text-sm font-bold text-slate-900">{targetHours}h</p>
                                            </div>
                                            <div className="p-2 rounded-lg bg-purple-50">
                                                <p className="text-[10px] font-semibold text-purple-500 uppercase">Actual</p>
                                                <p className="text-sm font-bold text-[#8B5CF6]">{weeklyTotal}h</p>
                                            </div>
                                            <div className="p-2 rounded-lg bg-emerald-50">
                                                <p className="text-[10px] font-semibold text-emerald-500 uppercase">Billable</p>
                                                <p className="text-sm font-bold text-emerald-600">{billableTotal}h</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={18} className="text-[#8B5CF6]" />
                                                <h3 className="text-base font-bold text-slate-900">8-Week Utilization Trend</h3>
                                            </div>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 font-semibold text-xs">
                                                <TrendingUp size={12} className="mr-1" /> +8% vs last 8 weeks
                                            </Badge>
                                        </div>
                                        <ResponsiveContainer width="100%" height={240}>
                                            <LineChart data={utilizationTrend}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} />
                                                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                                                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
                                                <Line type="monotone" dataKey="utilization" name="Utilization %" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" dataKey="billable" name="Billable %" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-5">
                                        <Users size={18} className="text-[#8B5CF6]" />
                                        <h3 className="text-base font-bold text-slate-900">Team Utilization Leaderboard</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {teamUtilization.map((t, i) => (
                                            <motion.div
                                                key={t.name}
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    #{i + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-sm font-bold text-slate-800">{t.name}</span>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs font-semibold text-emerald-600">Billable: {t.billable}%</span>
                                                            <span className="text-sm font-bold text-[#8B5CF6] w-12 text-right">{t.utilization}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full absolute"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(t.utilization, 120) / 1.2}%` }}
                                                            transition={{ duration: 0.6, delay: i * 0.05 }}
                                                        />
                                                        <div className="absolute top-0 bottom-0 w-0.5 bg-emerald-500" style={{ left: `${100 / 1.2}%` }} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#8B5CF6]" /> Utilization</span>
                                        <span className="flex items-center gap-1.5"><span className="h-3 w-0.5 bg-emerald-500" /> 100% target line</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Notes Dialog */}
            <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <StickyNote size={18} className="text-[#8B5CF6]" /> Entry Notes
                        </DialogTitle>
                        <DialogDescription>Add context, comments, or explanations for this time entry.</DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <Label htmlFor="notes" className="text-xs font-bold uppercase text-slate-500">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notesDraft}
                            onChange={e => setNotesDraft(e.target.value)}
                            placeholder="What did you work on? Any blockers or context..."
                            className="mt-2 min-h-[120px] border-slate-200"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNotesOpen(false)} className="font-bold">Cancel</Button>
                        <Button onClick={saveNotes} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold">Save Notes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-600">
                            <XCircle size={18} /> Reject Timesheet
                        </DialogTitle>
                        <DialogDescription>
                            Rejecting <span className="font-bold">{rejectTarget?.employee}</span>'s timesheet for {rejectTarget?.week}. Please provide a reason.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <Label htmlFor="reason" className="text-xs font-bold uppercase text-slate-500">Reason for Rejection</Label>
                        <Textarea
                            id="reason"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Explain why this timesheet is being rejected..."
                            className="mt-2 min-h-[120px] border-slate-200"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectOpen(false)} className="font-bold">Cancel</Button>
                        <Button onClick={confirmReject} className="bg-rose-500 hover:bg-rose-600 text-white font-bold">
                            <XCircle size={14} className="mr-1.5" /> Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye size={18} className="text-[#8B5CF6]" /> Timesheet Details
                        </DialogTitle>
                        <DialogDescription>Review the full timesheet submission before taking action.</DialogDescription>
                    </DialogHeader>
                    {detailTarget && (
                        <div className="py-2 space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-white font-bold">
                                    {detailTarget.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{detailTarget.employee}</p>
                                    <p className="text-xs text-slate-500">{detailTarget.role}</p>
                                </div>
                                <div className="ml-auto">{statusBadge(detailTarget.status)}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-purple-50">
                                    <p className="text-[10px] font-bold text-purple-500 uppercase">Total</p>
                                    <p className="text-lg font-bold text-[#8B5CF6]">{detailTarget.totalHours}h</p>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-50">
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase">Billable</p>
                                    <p className="text-lg font-bold text-emerald-600">{detailTarget.billableHours}h</p>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-50">
                                    <p className="text-[10px] font-bold text-amber-500 uppercase">Util.</p>
                                    <p className="text-lg font-bold text-amber-600">{detailTarget.utilization}%</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-200">
                                <p className="text-xs font-bold uppercase text-slate-500 mb-2">Week</p>
                                <p className="text-sm font-semibold text-slate-800">{detailTarget.week}</p>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-200">
                                <p className="text-xs font-bold uppercase text-slate-500 mb-3">Project Breakdown (sample)</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between"><span className="text-slate-600">Project Phoenix</span><span className="font-bold text-slate-800">28h</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">Client Alpha</span><span className="font-bold text-slate-800">10h</span></div>
                                    <div className="flex justify-between"><span className="text-slate-600">Internal</span><span className="font-bold text-slate-800">4h</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailOpen(false)} className="font-bold">Close</Button>
                        {detailTarget?.status === "Pending" && (
                            <>
                                <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold" onClick={() => { setDetailOpen(false); openReject(detailTarget); }}>
                                    <XCircle size={14} className="mr-1.5" /> Reject
                                </Button>
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold" onClick={() => { setDetailOpen(false); handleApprove(detailTarget); }}>
                                    <CheckCircle2 size={14} className="mr-1.5" /> Approve
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TimesheetsPage;
