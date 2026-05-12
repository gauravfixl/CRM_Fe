"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

/* ----------------------------------------------------------------------- */
/*  Zod schemas for BE-integrated forms                                    */
/* ----------------------------------------------------------------------- */
const interviewScheduleSchema = z.object({
    candidateId: z.string().min(1, "Candidate is required"),
    jobId: z.string().min(1, "Job is required"),
    interviewerId: z.string().min(1, "Interviewer is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    mode: z.enum(["Phone", "Video", "In-person"]),
});

const feedbackSchema = z.object({
    rating: z.number().min(1, "Rating required").max(5, "Max 5"),
    comments: z.string().min(10, "Please provide at least 10 characters of feedback"),
});
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    useHireStore,
    type Interview,
    type InterviewPanelMember,
    type InterviewRound,
    type Candidate,
    type Job,
} from "@/shared/data/hire-store";
import { getAllEmployees } from "@/modules/hrm/hooks/hrmHooks";
import {
    Calendar,
    Clock,
    Users,
    Video,
    Phone,
    MapPin,
    Link as LinkIcon,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ThumbsUp,
    Bell,
    BellRing,
    RefreshCw,
    Copy,
    Plus,
    X,
    Star,
    LayoutList,
    CalendarDays,
    Briefcase,
    UserCircle2,
    Sparkles,
    FileText,
    ListChecks,
} from "lucide-react";

/* ----------------------------------------------------------------------- */
/*  Types + constants                                                      */
/* ----------------------------------------------------------------------- */

type EmployeeLite = {
    _id: string;
    employeeCode?: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
};

const ROUND_OPTIONS: InterviewRound[] = [
    "HR Screening",
    "Technical",
    "Managerial",
    "Final",
    "Culture Fit",
    "Custom",
];

const DURATIONS = ["30 mins", "45 mins", "1 hour", "1.5 hours", "2 hours"];

const OUTCOME_OPTIONS: NonNullable<Interview["outcome"]>[] = [
    "Strong Hire",
    "Hire",
    "No Hire",
    "Strong No Hire",
    "Hold",
];

const CRITERIA_BY_ROUND: Record<InterviewRound, string[]> = {
    "HR Screening": ["Communication", "Culture Fit", "Motivation"],
    Technical: ["Problem Solving", "Coding", "System Design", "Communication"],
    Managerial: [
        "Leadership",
        "Decision Making",
        "Stakeholder Mgmt",
        "Clarity",
    ],
    Final: ["Culture", "Ownership", "Strategic Thinking"],
    "Culture Fit": ["Values Alignment", "Team Fit", "Integrity"],
    Custom: ["Overall Impression", "Fit", "Strengths"],
};

const MOCK_EMPLOYEES: EmployeeLite[] = [
    {
        _id: "EMP-001",
        employeeCode: "E001",
        firstName: "Ishaan",
        lastName: "Mehta",
        email: "ishaan.mehta@fixlsolutions.com",
        department: "Engineering",
    },
    {
        _id: "EMP-002",
        employeeCode: "E002",
        firstName: "Kavya",
        lastName: "Nair",
        email: "kavya.nair@fixlsolutions.com",
        department: "Product",
    },
    {
        _id: "EMP-003",
        employeeCode: "E003",
        firstName: "Rahul",
        lastName: "Verma",
        email: "rahul.verma@fixlsolutions.com",
        department: "Engineering",
    },
    {
        _id: "EMP-004",
        employeeCode: "E004",
        firstName: "Tanvi",
        lastName: "Kapoor",
        email: "tanvi.kapoor@fixlsolutions.com",
        department: "Design",
    },
    {
        _id: "EMP-005",
        employeeCode: "E005",
        firstName: "Arjun",
        lastName: "Singh",
        email: "arjun.singh@fixlsolutions.com",
        department: "HR",
    },
    {
        _id: "EMP-006",
        employeeCode: "E006",
        firstName: "Neha",
        lastName: "Shah",
        email: "neha.shah@fixlsolutions.com",
        department: "Engineering",
    },
    {
        _id: "EMP-007",
        employeeCode: "E007",
        firstName: "Saurabh",
        lastName: "Pillai",
        email: "saurabh.pillai@fixlsolutions.com",
        department: "Leadership",
    },
    {
        _id: "EMP-008",
        employeeCode: "E008",
        firstName: "Aditi",
        lastName: "Rao",
        email: "aditi.rao@fixlsolutions.com",
        department: "Design",
    },
];

type ViewMode = "list" | "calendar";
type ListTab = "all" | "scheduled" | "completed" | "cancelled" | "rescheduled";
type CalendarScope = "month" | "week";

/* ----------------------------------------------------------------------- */
/*  Utilities                                                              */
/* ----------------------------------------------------------------------- */

const today = () => new Date().toISOString().slice(0, 10);

const formatDate = (d: string) => {
    if (!d) return "-";
    try {
        return new Date(d).toLocaleDateString(undefined, {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    } catch {
        return d;
    }
};

const shortDate = (d: string) => {
    if (!d) return "-";
    try {
        return new Date(d).toLocaleDateString(undefined, {
            month: "short",
            day: "2-digit",
        });
    } catch {
        return d;
    }
};

const initials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return (
        (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
    ).toUpperCase();
};

const randomAlpha = (len: number) =>
    Array.from({ length: len }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join("");

const generateZoomLink = () =>
    `https://zoom.us/j/${Math.floor(Math.random() * 999_999_999)}?pwd=${randomAlpha(6)}`;

const generateMeetLink = () =>
    `https://meet.google.com/${randomAlpha(3)}-${randomAlpha(4)}-${randomAlpha(3)}`;

const addDays = (iso: string, days: number) => {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};

const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

const startOfMonth = (year: number, month: number) =>
    new Date(year, month, 1);

const monthName = (m: number) =>
    [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ][m];

const modeIcon = (mode: Interview["mode"]) => {
    if (mode === "Video") return Video;
    if (mode === "Phone") return Phone;
    return MapPin;
};

const statusStyles: Record<Interview["status"], string> = {
    Scheduled: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
    Completed: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
    Cancelled: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
    "No Show": "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
    Rescheduled: "bg-violet-50 text-violet-600 ring-1 ring-violet-100",
};

const outcomeStyles: Record<NonNullable<Interview["outcome"]>, string> = {
    "Strong Hire": "bg-emerald-600 text-white",
    Hire: "bg-emerald-50 text-emerald-700",
    "No Hire": "bg-rose-50 text-rose-700",
    "Strong No Hire": "bg-rose-600 text-white",
    Hold: "bg-amber-50 text-amber-700",
};

const avatarColors = [
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
];

const colorForName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
    return avatarColors[Math.abs(hash) % avatarColors.length];
};

/* ----------------------------------------------------------------------- */
/*  Main Page                                                              */
/* ----------------------------------------------------------------------- */

export default function InterviewsPage() {
    const {
        interviews,
        candidates,
        jobs,
        scheduleInterview,
        updateInterview,
        deleteInterview,
        submitFeedback,
        rescheduleInterview,
        markInterviewOutcome,
        sendInterviewReminder,
        bulkRescheduleInterviews,
        detectInterviewConflicts,
        moveCandidateStage,
    } = useHireStore();

    /* --------------------- API actions from store ----------------------- */
    const loadInterviewsFromApi = useHireStore((s) => s.loadInterviewsFromApi);
    const loadCandidatesFromApi = useHireStore((s) => s.loadCandidatesFromApi);
    const loadJobsFromApi = useHireStore((s) => s.loadJobsFromApi);
    const hasLoadedIVs = useHireStore((s) => s.hasLoaded.interviews);
    const hasLoadedCands = useHireStore((s) => s.hasLoaded.candidates);
    const hasLoadedJobs = useHireStore((s) => s.hasLoaded.jobs);
    const ivsLoading = useHireStore((s) => s.loading.interviews);

    const scheduleInterviewApi = useHireStore((s) => s.scheduleInterviewApi);
    const updateInterviewStatusApi = useHireStore((s) => s.updateInterviewStatusApi);
    const submitInterviewFeedbackApi = useHireStore((s) => s.submitInterviewFeedbackApi);
    const deleteInterviewApi = useHireStore((s) => s.deleteInterviewApi);

    useEffect(() => {
        if (!hasLoadedIVs) loadInterviewsFromApi();
        if (!hasLoadedCands) loadCandidatesFromApi();
        if (!hasLoadedJobs) loadJobsFromApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { toast } = useToast();
    const searchParams = useSearchParams();

    /* --------------------- Employees for panel picker ------------------- */
    const [employees, setEmployees] = useState<EmployeeLite[]>(MOCK_EMPLOYEES);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAllEmployees();
                const list: any[] = res?.data?.employees ?? res?.data?.data ?? [];
                if (Array.isArray(list) && list.length > 0) {
                    const mapped: EmployeeLite[] = list.map((e: any) => ({
                        _id: e._id ?? e.id ?? "",
                        employeeCode: e.employeeCode ?? "",
                        firstName: e.firstName ?? "",
                        lastName: e.lastName ?? "",
                        email: e.email ?? "",
                        department:
                            typeof e.departmentId === "object"
                                ? e.departmentId?.name ?? ""
                                : typeof e.departmentId === "string"
                                  ? e.departmentId
                                  : e.department ?? "",
                    }));
                    setEmployees(mapped);
                }
            } catch {
                /* fallback keeps mock list */
            }
        })();
    }, []);

    /* --------------------- View + filter state -------------------------- */
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [activeTab, setActiveTab] = useState<ListTab>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRound, setFilterRound] = useState<string>("all");
    const [filterMode, setFilterMode] = useState<string>("all");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");
    const [filterInterviewer, setFilterInterviewer] = useState<string>("all");

    /* --------------------- Calendar state ------------------------------- */
    const now = new Date();
    const [calYear, setCalYear] = useState(now.getFullYear());
    const [calMonth, setCalMonth] = useState(now.getMonth());
    const [calWeekStart, setCalWeekStart] = useState<string>(() => {
        const d = new Date();
        const day = d.getDay(); // 0 Sun
        const diff = (day === 0 ? -6 : 1 - day); // Monday start
        d.setDate(d.getDate() + diff);
        return d.toISOString().slice(0, 10);
    });
    const [calendarScope, setCalendarScope] = useState<CalendarScope>("month");
    const [dayPanelDate, setDayPanelDate] = useState<string | null>(null);

    /* --------------------- Selection & dialogs -------------------------- */
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [outcomeOpen, setOutcomeOpen] = useState(false);
    const [bulkRescheduleOpen, setBulkRescheduleOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);

    const [activeInterview, setActiveInterview] = useState<Interview | null>(null);

    /* ------------------- Stats ---------------------------------------- */
    const stats = useMemo(() => {
        const todayStr = today();
        const in7 = addDays(todayStr, 7);
        const todayCount = interviews.filter((i) => i.date === todayStr).length;
        const weekCount = interviews.filter(
            (i) => i.date >= todayStr && i.date <= in7
        ).length;
        const pending = interviews.filter(
            (i) => i.status === "Completed" && (!i.scorecards || i.scorecards.length === 0)
        ).length;
        const rescheduledCount = interviews.filter(
            (i) => (i.rescheduleCount ?? 0) > 0
        ).length;
        const reschedulePct =
            interviews.length > 0
                ? Math.round((rescheduledCount / interviews.length) * 100)
                : 0;
        return { todayCount, weekCount, pending, reschedulePct };
    }, [interviews]);

    /* ------------------- Filter + search helpers ----------------------- */
    const candidateById = useCallback(
        (id: string) => candidates.find((c) => c.id === id),
        [candidates]
    );
    const jobById = useCallback(
        (id: string) => jobs.find((j) => j.id === id),
        [jobs]
    );

    const filteredInterviews = useMemo(() => {
        return interviews.filter((i) => {
            if (activeTab !== "all") {
                const map: Record<string, Interview["status"]> = {
                    scheduled: "Scheduled",
                    completed: "Completed",
                    cancelled: "Cancelled",
                    rescheduled: "Rescheduled",
                };
                if (i.status !== map[activeTab]) return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const cand = candidateById(i.candidateId);
                const candidateName = cand
                    ? `${cand.firstName} ${cand.lastName}`.toLowerCase()
                    : "";
                const hit =
                    candidateName.includes(q) ||
                    i.title.toLowerCase().includes(q) ||
                    (i.round ?? "").toLowerCase().includes(q);
                if (!hit) return false;
            }
            if (filterRound !== "all" && i.round !== filterRound) return false;
            if (filterMode !== "all" && i.mode !== filterMode) return false;
            if (filterDateFrom && i.date < filterDateFrom) return false;
            if (filterDateTo && i.date > filterDateTo) return false;
            if (filterInterviewer !== "all") {
                const members = (i.panel?.map((p) => p.employeeId) ?? []).concat(
                    i.interviewers ?? []
                );
                if (!members.includes(filterInterviewer)) return false;
            }
            return true;
        });
    }, [
        interviews,
        activeTab,
        searchQuery,
        filterRound,
        filterMode,
        filterDateFrom,
        filterDateTo,
        filterInterviewer,
        candidateById,
    ]);

    /* ------------------- Calendar grid -------------------------------- */
    const monthGrid = useMemo(() => {
        const first = startOfMonth(calYear, calMonth);
        const firstDay = first.getDay(); // 0 Sun
        const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
        const nDays = daysInMonth(calYear, calMonth);
        const cells: { date: string | null; day: number | null }[] = [];
        for (let i = 0; i < offset; i++) cells.push({ date: null, day: null });
        for (let d = 1; d <= nDays; d++) {
            const iso = new Date(calYear, calMonth, d).toISOString().slice(0, 10);
            cells.push({ date: iso, day: d });
        }
        while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
        return cells;
    }, [calYear, calMonth]);

    const weekGrid = useMemo(() => {
        const cells: { date: string; day: number }[] = [];
        for (let i = 0; i < 7; i++) {
            const iso = addDays(calWeekStart, i);
            const d = new Date(iso);
            cells.push({ date: iso, day: d.getDate() });
        }
        return cells;
    }, [calWeekStart]);

    const interviewsByDate = useMemo(() => {
        const map: Record<string, Interview[]> = {};
        filteredInterviews.forEach((i) => {
            if (!map[i.date]) map[i.date] = [];
            map[i.date].push(i);
        });
        return map;
    }, [filteredInterviews]);

    /* ------------------- Selection helpers ---------------------------- */
    const allSelected =
        filteredInterviews.length > 0 &&
        filteredInterviews.every((i) => selectedIds.includes(i.id));

    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds([]);
        else setSelectedIds(filteredInterviews.map((i) => i.id));
    };

    const toggleSelect = (id: string) =>
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    /* ------------------- Query-param deep link ------------------------- */
    useEffect(() => {
        const candidateParam = searchParams.get("candidate");
        if (candidateParam && candidates.length > 0) {
            const target = candidates.find(
                (c) =>
                    `${c.firstName} ${c.lastName}`.toLowerCase() ===
                    decodeURIComponent(candidateParam).toLowerCase()
            );
            if (target) {
                setScheduleOpen(true);
                setScheduleForm((f) => ({ ...f, candidateId: target.id, jobId: target.jobId }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, candidates.length]);

    /* =================================================================== */
    /*  Schedule Form state                                                */
    /* =================================================================== */

    type ScheduleForm = {
        candidateId: string;
        jobId: string;
        round: InterviewRound;
        roundOrder: number;
        title: string;
        panel: InterviewPanelMember[];
        date: string;
        time: string;
        duration: string;
        timeZone: string;
        mode: Interview["mode"];
        meetingLink: string;
        location: string;
        preparationNotes: string;
        questions: string[];
    };

    const defaultTz = useMemo(() => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
            return "UTC";
        }
    }, []);

    const blankSchedule = (): ScheduleForm => ({
        candidateId: "",
        jobId: "",
        round: "Technical",
        roundOrder: 1,
        title: "Technical Round",
        panel: [],
        date: "",
        time: "",
        duration: "1 hour",
        timeZone: defaultTz,
        mode: "Video",
        meetingLink: "",
        location: "",
        preparationNotes: "",
        questions: [],
    });

    const [scheduleForm, setScheduleForm] = useState<ScheduleForm>(blankSchedule());
    const [scheduleTab, setScheduleTab] = useState<"role" | "panel" | "prep">("role");
    const [conflictList, setConflictList] = useState<
        { employeeId: string; conflictingTitle: string; conflictingTime: string }[]
    >([]);
    const [conflictsChecked, setConflictsChecked] = useState(false);
    const [overrideConflicts, setOverrideConflicts] = useState(false);
    const [panelSearch, setPanelSearch] = useState("");
    const [newQuestion, setNewQuestion] = useState("");

    /* Edit form reuses same shape */
    const [editForm, setEditForm] = useState<ScheduleForm>(blankSchedule());
    const [editTab, setEditTab] = useState<"role" | "panel" | "prep">("role");
    const [editConflicts, setEditConflicts] = useState<
        { employeeId: string; conflictingTitle: string; conflictingTime: string }[]
    >([]);
    const [editOverride, setEditOverride] = useState(false);
    const [editConflictsChecked, setEditConflictsChecked] = useState(false);

    /* Reschedule form */
    const [reschedForm, setReschedForm] = useState({
        date: "",
        time: "",
        reason: "",
    });
    const [reschedConflicts, setReschedConflicts] = useState<
        { employeeId: string; conflictingTitle: string; conflictingTime: string }[]
    >([]);
    const [reschedOverride, setReschedOverride] = useState(false);

    /* Feedback form — scorecard recommendations exclude 'Hold' */
    type ScorecardRecommendation = 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire';
    const [feedbackForm, setFeedbackForm] = useState<{
        ratings: Record<string, number>;
        recommendation: ScorecardRecommendation;
        strengths: string;
        concerns: string;
    }>({
        ratings: {},
        recommendation: "Hire",
        strengths: "",
        concerns: "",
    });

    /* Outcome form */
    const [outcomeForm, setOutcomeForm] = useState<{
        outcome: NonNullable<Interview["outcome"]>;
        notes: string;
        moveToOffer: boolean;
    }>({
        outcome: "Hire",
        notes: "",
        moveToOffer: false,
    });

    /* Bulk reschedule */
    const [bulkResched, setBulkResched] = useState({ date: "", reason: "" });

    /* =================================================================== */
    /*  Auto-fill helpers                                                  */
    /* =================================================================== */

    const autoTitleForRound = (round: InterviewRound, order: number) =>
        round === "Custom" ? "Custom Round" : `${round} Round ${order}`;

    const suggestRoundOrder = (candidateId: string) => {
        if (!candidateId) return 1;
        const count = interviews.filter((i) => i.candidateId === candidateId).length;
        return count + 1;
    };

    const openSchedule = () => {
        setScheduleForm({
            ...blankSchedule(),
            roundOrder: 1,
        });
        setScheduleTab("role");
        setConflictList([]);
        setConflictsChecked(false);
        setOverrideConflicts(false);
        setPanelSearch("");
        setNewQuestion("");
        setScheduleOpen(true);
    };

    const openEdit = (iv: Interview) => {
        setActiveInterview(iv);
        setEditForm({
            candidateId: iv.candidateId,
            jobId: iv.jobId,
            round: iv.round ?? "Custom",
            roundOrder: iv.roundOrder ?? 1,
            title: iv.title,
            panel:
                iv.panel ??
                (iv.interviewers ?? []).map((id) => {
                    const e = employees.find((x) => x._id === id);
                    return {
                        employeeId: id,
                        name: e ? `${e.firstName} ${e.lastName}` : id,
                        email: e?.email,
                        role: e?.department,
                    };
                }),
            date: iv.date,
            time: iv.time,
            duration: iv.duration || "1 hour",
            timeZone: iv.timeZone ?? defaultTz,
            mode: iv.mode,
            meetingLink: iv.meetingLink ?? "",
            location: iv.location ?? "",
            preparationNotes: iv.preparationNotes ?? "",
            questions: [],
        });
        setEditTab("role");
        setEditConflicts([]);
        setEditConflictsChecked(false);
        setEditOverride(false);
        setEditOpen(true);
    };

    const openReschedule = (iv: Interview) => {
        setActiveInterview(iv);
        setReschedForm({ date: iv.date, time: iv.time, reason: "" });
        setReschedConflicts([]);
        setReschedOverride(false);
        setRescheduleOpen(true);
    };

    const openFeedback = (iv: Interview) => {
        setActiveInterview(iv);
        const round = iv.round ?? "Custom";
        const criteria = CRITERIA_BY_ROUND[round] ?? CRITERIA_BY_ROUND.Custom;
        const ratings: Record<string, number> = {};
        criteria.forEach((c) => (ratings[c] = 0));
        setFeedbackForm({
            ratings,
            recommendation: "Hire",
            strengths: "",
            concerns: "",
        });
        setFeedbackOpen(true);
    };

    const openOutcome = (iv: Interview) => {
        setActiveInterview(iv);
        setOutcomeForm({
            outcome: iv.outcome ?? "Hire",
            notes: "",
            moveToOffer: false,
        });
        setOutcomeOpen(true);
    };

    const openDetail = (iv: Interview) => {
        setActiveInterview(iv);
        setDetailOpen(true);
    };

    /* =================================================================== */
    /*  Validation + Submit: Schedule                                      */
    /* =================================================================== */

    const handleCheckConflicts = () => {
        if (!scheduleForm.date || !scheduleForm.time || scheduleForm.panel.length === 0) {
            toast({
                title: "Missing details",
                description: "Add panel members, date and time first.",
                variant: "destructive",
            });
            return;
        }
        const list = detectInterviewConflicts(
            scheduleForm.panel.map((p) => p.employeeId),
            scheduleForm.date,
            scheduleForm.time,
            scheduleForm.duration
        );
        setConflictList(list);
        setConflictsChecked(true);
        if (list.length === 0) {
            toast({
                title: "No conflicts",
                description: "All panelists are free at this slot.",
            });
        } else {
            toast({
                title: `${list.length} conflict${list.length > 1 ? "s" : ""} detected`,
                description: "Review the list below.",
                variant: "destructive",
            });
        }
    };

    const handleSchedule = async () => {
        if (!scheduleForm.candidateId) {
            toast({ title: "Pick a candidate", variant: "destructive" });
            setScheduleTab("role");
            return;
        }
        if (!scheduleForm.date || !scheduleForm.time) {
            toast({ title: "Date and time required", variant: "destructive" });
            setScheduleTab("panel");
            return;
        }
        if (scheduleForm.panel.length === 0) {
            toast({ title: "Add at least one panel member", variant: "destructive" });
            setScheduleTab("panel");
            return;
        }
        if (conflictList.length > 0 && !overrideConflicts) {
            toast({
                title: "Resolve conflicts",
                description: "Check override to submit anyway.",
                variant: "destructive",
            });
            return;
        }

        const primaryInterviewerId = scheduleForm.panel[0].employeeId;
        const parsed = interviewScheduleSchema.safeParse({
            candidateId: scheduleForm.candidateId,
            jobId: scheduleForm.jobId,
            interviewerId: primaryInterviewerId,
            date: scheduleForm.date,
            time: scheduleForm.time,
            mode: scheduleForm.mode,
        });
        if (!parsed.success) {
            toast({
                title: "Validation failed",
                description: parsed.error.issues[0]?.message ?? "Invalid input",
                variant: "destructive",
            });
            return;
        }

        try {
            const created = await scheduleInterviewApi({
                candidateId: scheduleForm.candidateId,
                jobId: scheduleForm.jobId,
                interviewerId: primaryInterviewerId,
                date: scheduleForm.date,
                time: scheduleForm.time,
                mode: scheduleForm.mode,
                panel: scheduleForm.panel.map((p) => p.employeeId),
                // TODO: backend — preparationNotes/followUp mapping. Using preparationNotes as followUp hint.
                followUp: scheduleForm.preparationNotes || undefined,
            });
            if (!created) {
                toast({
                    title: "Failed to schedule interview",
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Interview scheduled",
                description: `${scheduleForm.title} set for ${formatDate(scheduleForm.date)} at ${scheduleForm.time}.`,
            });
            setScheduleOpen(false);
        } catch (err: any) {
            toast({
                title: "Failed to schedule interview",
                description: err?.message ?? "Please try again.",
                variant: "destructive",
            });
        }
    };

    /* =================================================================== */
    /*  Submit: Edit                                                       */
    /* =================================================================== */

    const handleEditCheckConflicts = () => {
        if (!activeInterview) return;
        const list = detectInterviewConflicts(
            editForm.panel.map((p) => p.employeeId),
            editForm.date,
            editForm.time,
            editForm.duration,
            activeInterview.id
        );
        setEditConflicts(list);
        setEditConflictsChecked(true);
    };

    const handleEdit = () => {
        // TODO: backend — no update-interview endpoint available. Kept local-only.
        if (!activeInterview) return;
        if (editConflicts.length > 0 && !editOverride) {
            toast({
                title: "Resolve conflicts",
                description: "Check override to save anyway.",
                variant: "destructive",
            });
            return;
        }
        updateInterview(activeInterview.id, {
            title: editForm.title,
            interviewers: editForm.panel.map((p) => p.employeeId),
            panel: editForm.panel,
            date: editForm.date,
            time: editForm.time,
            duration: editForm.duration,
            timeZone: editForm.timeZone,
            mode: editForm.mode,
            meetingLink: editForm.mode === "Video" ? editForm.meetingLink : undefined,
            location: editForm.mode === "In-person" ? editForm.location : undefined,
            round: editForm.round,
            roundOrder: editForm.roundOrder,
            preparationNotes: editForm.preparationNotes,
        });
        toast({ title: "Interview updated" });
        setEditOpen(false);
    };

    /* =================================================================== */
    /*  Submit: Reschedule                                                 */
    /* =================================================================== */

    const handleReschedCheckConflicts = () => {
        if (!activeInterview) return;
        const panelIds =
            activeInterview.panel?.map((p) => p.employeeId) ?? activeInterview.interviewers;
        const list = detectInterviewConflicts(
            panelIds,
            reschedForm.date,
            reschedForm.time,
            activeInterview.duration || "1 hour",
            activeInterview.id
        );
        setReschedConflicts(list);
    };

    const handleReschedule = async () => {
        if (!activeInterview) return;
        if (!reschedForm.date || !reschedForm.time) {
            toast({ title: "Date and time required", variant: "destructive" });
            return;
        }
        if (reschedConflicts.length > 0 && !reschedOverride) {
            toast({
                title: "Resolve conflicts",
                variant: "destructive",
            });
            return;
        }
        // Local update retains date/time/reason since BE has no dedicated reschedule endpoint.
        rescheduleInterview(
            activeInterview.id,
            reschedForm.date,
            reschedForm.time,
            reschedForm.reason
        );
        // TODO: backend — no dedicated reschedule endpoint. Using status update to refresh server-side state.
        try {
            await updateInterviewStatusApi(activeInterview.id, "Scheduled");
        } catch {
            /* swallow — local update already applied */
        }
        toast({ title: "Interview rescheduled" });
        setRescheduleOpen(false);
    };

    /* =================================================================== */
    /*  Submit: Feedback                                                   */
    /* =================================================================== */

    const handleFeedback = async () => {
        if (!activeInterview) return;
        const ratings = feedbackForm.ratings;
        const skillsRating = Object.entries(ratings).map(([skill, score]) => ({
            skill,
            score,
        }));
        const overall =
            skillsRating.length > 0
                ? Math.round(
                    skillsRating.reduce((a, b) => a + b.score, 0) / skillsRating.length
                )
                : 0;

        const comments = `Strengths: ${feedbackForm.strengths}\n\nConcerns: ${feedbackForm.concerns}\n\nOverall: ${feedbackForm.recommendation}`;
        const rating = Math.max(1, Math.min(5, Math.round(overall || 0)));
        const interviewerId =
            activeInterview.panel?.[0]?.employeeId ??
            activeInterview.interviewers?.[0] ??
            "current-user";

        const parsed = feedbackSchema.safeParse({ rating, comments });
        if (!parsed.success) {
            toast({
                title: "Feedback validation failed",
                description: parsed.error.issues[0]?.message ?? "Invalid input",
                variant: "destructive",
            });
            return;
        }

        // Local mirror (scorecard shape) — retained for UI continuity.
        submitFeedback(activeInterview.id, {
            interviewerId,
            interviewerName: "You",
            skillsRating,
            overallScore: overall,
            feedback: `Strengths: ${feedbackForm.strengths}\n\nConcerns: ${feedbackForm.concerns}`,
            recommendation: feedbackForm.recommendation,
            submittedAt: new Date().toISOString(),
        });

        try {
            await submitInterviewFeedbackApi(activeInterview.id, {
                interviewerId,
                comments,
                rating,
            });
            toast({ title: "Feedback submitted" });
            setFeedbackOpen(false);
        } catch (err: any) {
            toast({
                title: "Failed to submit feedback",
                description: err?.message ?? "Please try again.",
                variant: "destructive",
            });
        }
    };

    /* =================================================================== */
    /*  Submit: Outcome                                                    */
    /* =================================================================== */

    const handleOutcome = () => {
        // TODO: backend — no outcome field supported by API. Kept local-only.
        if (!activeInterview) return;
        markInterviewOutcome(
            activeInterview.id,
            outcomeForm.outcome,
            outcomeForm.notes
        );
        if (
            outcomeForm.moveToOffer &&
            (outcomeForm.outcome === "Hire" || outcomeForm.outcome === "Strong Hire")
        ) {
            moveCandidateStage(activeInterview.candidateId, "Offer");
            toast({
                title: "Outcome recorded",
                description: "Candidate moved to Offer stage.",
            });
        } else {
            toast({ title: "Outcome recorded" });
        }
        setOutcomeOpen(false);
    };

    /* =================================================================== */
    /*  Submit: Bulk reschedule                                            */
    /* =================================================================== */

    // TODO: backend — no bulk reschedule endpoint. Kept local-only.
    const handleBulkReschedule = () => {
        if (!bulkResched.date) {
            toast({ title: "Pick a date", variant: "destructive" });
            return;
        }
        const res = bulkRescheduleInterviews(selectedIds, bulkResched.date);
        toast({
            title: `Rescheduled ${res.updated} interviews`,
            description: `All moved to ${formatDate(bulkResched.date)}.`,
        });
        setBulkRescheduleOpen(false);
        setSelectedIds([]);
        setBulkResched({ date: "", reason: "" });
    };

    /* =================================================================== */
    /*  Reminder + Delete actions                                          */
    /* =================================================================== */

    const handleReminder = (iv: Interview) => {
        sendInterviewReminder(iv.id);
        const panelEmails =
            iv.panel?.map((p) => p.email).filter(Boolean).join(", ") ||
            "panel members";
        toast({
            title: "Reminder sent",
            description: `Email reminder sent to ${panelEmails}.`,
        });
    };

    const handleDelete = async (iv: Interview) => {
        if (!confirm(`Delete interview "${iv.title}"?`)) return;
        // BE only allows delete when status is Completed or Cancelled.
        try {
            await deleteInterviewApi(iv.id);
            toast({ title: "Interview deleted" });
        } catch (err: any) {
            toast({
                title: "Cannot delete interview",
                description:
                    err?.message ??
                    "Backend only allows deletion of Completed or Cancelled interviews.",
                variant: "destructive",
            });
        }
    };

    /* =================================================================== */
    /*  Panel toggle (used inside schedule + edit)                         */
    /* =================================================================== */

    const togglePanelMember = (
        formSetter: React.Dispatch<React.SetStateAction<ScheduleForm>>,
        emp: EmployeeLite
    ) => {
        formSetter((prev) => {
            const exists = prev.panel.some((p) => p.employeeId === emp._id);
            return {
                ...prev,
                panel: exists
                    ? prev.panel.filter((p) => p.employeeId !== emp._id)
                    : [
                        ...prev.panel,
                        {
                            employeeId: emp._id,
                            name: `${emp.firstName} ${emp.lastName}`,
                            email: emp.email,
                            role: emp.department,
                        },
                    ],
            };
        });
    };

    /* =================================================================== */
    /*  RENDER                                                             */
    /* =================================================================== */

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] font-sans p-5 space-y-5 overflow-y-auto custom-scrollbar">
            {/* ============== HEADER ============== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                        Interviews
                    </h1>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Schedule rounds, coordinate panels, and capture feedback.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`h-8 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition ${
                                viewMode === "list"
                                    ? "bg-violet-500 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <LayoutList className="h-3.5 w-3.5" />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={`h-8 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition ${
                                viewMode === "calendar"
                                    ? "bg-violet-500 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <CalendarDays className="h-3.5 w-3.5" />
                            Calendar
                        </button>
                    </div>

                    <Button
                        variant="outline"
                        disabled={selectedIds.length === 0}
                        onClick={() => {
                            setBulkResched({ date: "", reason: "" });
                            setBulkRescheduleOpen(true);
                        }}
                        className="h-9 rounded-xl border-slate-200 text-[11px] font-semibold"
                    >
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        Bulk reschedule
                        {selectedIds.length > 0 && (
                            <Badge className="ml-1.5 bg-violet-100 text-violet-700 border-transparent text-[10px] px-1.5">
                                {selectedIds.length}
                            </Badge>
                        )}
                    </Button>

                    <Button
                        onClick={openSchedule}
                        className="h-9 rounded-xl bg-[#8B5CF6] hover:bg-violet-600 text-white shadow-sm text-[11px] font-semibold"
                    >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Schedule Interview
                    </Button>
                </div>
            </div>

            {/* ============== STATS ROW ============== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Calendar className="h-4 w-4 text-violet-600" />}
                    tint="violet"
                    label="Today's Interviews"
                    value={stats.todayCount}
                    hint="Scheduled for today"
                />
                <StatCard
                    icon={<CalendarDays className="h-4 w-4 text-blue-600" />}
                    tint="blue"
                    label="This Week"
                    value={stats.weekCount}
                    hint="Next 7 days"
                />
                <StatCard
                    icon={<FileText className="h-4 w-4 text-amber-600" />}
                    tint="amber"
                    label="Pending Feedback"
                    value={stats.pending}
                    hint="Completed without scorecard"
                />
                <StatCard
                    icon={<RefreshCw className="h-4 w-4 text-rose-600" />}
                    tint="rose"
                    label="Reschedule Rate"
                    value={`${stats.reschedulePct}%`}
                    hint="Of all interviews"
                />
            </div>

            {/* ============== MAIN CONTENT ============== */}
            {viewMode === "list" ? (
                <ListView
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterRound={filterRound}
                    setFilterRound={setFilterRound}
                    filterMode={filterMode}
                    setFilterMode={setFilterMode}
                    filterDateFrom={filterDateFrom}
                    setFilterDateFrom={setFilterDateFrom}
                    filterDateTo={filterDateTo}
                    setFilterDateTo={setFilterDateTo}
                    filterInterviewer={filterInterviewer}
                    setFilterInterviewer={setFilterInterviewer}
                    employees={employees}
                    filteredInterviews={filteredInterviews}
                    candidateById={candidateById}
                    jobById={jobById}
                    selectedIds={selectedIds}
                    toggleSelect={toggleSelect}
                    toggleSelectAll={toggleSelectAll}
                    allSelected={allSelected}
                    onView={openDetail}
                    onEdit={openEdit}
                    onReschedule={openReschedule}
                    onReminder={handleReminder}
                    onOutcome={openOutcome}
                    onFeedback={openFeedback}
                    onDelete={handleDelete}
                />
            ) : (
                <CalendarView
                    calendarScope={calendarScope}
                    setCalendarScope={setCalendarScope}
                    calYear={calYear}
                    calMonth={calMonth}
                    setCalYear={setCalYear}
                    setCalMonth={setCalMonth}
                    calWeekStart={calWeekStart}
                    setCalWeekStart={setCalWeekStart}
                    monthGrid={monthGrid}
                    weekGrid={weekGrid}
                    interviewsByDate={interviewsByDate}
                    candidateById={candidateById}
                    onSelectDay={(iso) => setDayPanelDate(iso)}
                    onOpenInterview={openDetail}
                />
            )}

            {/* ============== Floating Bulk Bar ============== */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-2xl bg-slate-900 text-white shadow-2xl px-4 py-2.5 flex items-center gap-4 text-[11px] font-semibold">
                    <span className="text-violet-300">
                        {selectedIds.length} selected
                    </span>
                    <span className="text-slate-600">·</span>
                    <button
                        onClick={() => setBulkRescheduleOpen(true)}
                        className="flex items-center gap-1.5 hover:text-violet-300"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> Reschedule
                    </button>
                    <button
                        onClick={() => {
                            if (!confirm(`Delete ${selectedIds.length} interviews?`)) return;
                            selectedIds.forEach((id) => deleteInterview(id));
                            setSelectedIds([]);
                            toast({ title: "Deleted" });
                        }}
                        className="flex items-center gap-1.5 hover:text-rose-300"
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                    <button
                        onClick={() => setSelectedIds([])}
                        className="flex items-center gap-1.5 hover:text-slate-300"
                    >
                        <X className="h-3.5 w-3.5" /> Clear
                    </button>
                </div>
            )}

            {/* =========================================================== */}
            {/*  DIALOG 1: Schedule Interview                              */}
            {/* =========================================================== */}
            <SideFormSheet
                open={scheduleOpen}
                onOpenChange={setScheduleOpen}
                title="Schedule Interview"
                description="Pick candidate, coordinate panel, and confirm schedule."
                icon={<Calendar className="h-5 w-5" />}
                accentColor="#4f46e5"
                width="xl"
                hideFooter
            >
                <Tabs value={scheduleTab} onValueChange={(v) => setScheduleTab(v as any)}>
                    <TabsList className="bg-slate-100 p-1 h-10 rounded-xl">
                            <TabsTrigger
                                value="role"
                                className="h-8 px-4 text-[11px] font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm"
                            >
                                1. Candidate & Role
                            </TabsTrigger>
                            <TabsTrigger
                                value="panel"
                                className="h-8 px-4 text-[11px] font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm"
                            >
                                2. Panel & Schedule
                            </TabsTrigger>
                            <TabsTrigger
                                value="prep"
                                className="h-8 px-4 text-[11px] font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm"
                            >
                                3. Prep & Confirm
                            </TabsTrigger>
                        </TabsList>

                        {/* ----- Tab 1 ----- */}
                        <TabsContent value="role" className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Candidate">
                                    <Select
                                        value={scheduleForm.candidateId}
                                        onValueChange={(v) => {
                                            const c = candidates.find((x) => x.id === v);
                                            setScheduleForm((prev) => ({
                                                ...prev,
                                                candidateId: v,
                                                jobId: c?.jobId ?? "",
                                                roundOrder: suggestRoundOrder(v),
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className="h-9 text-[11px]">
                                            <SelectValue placeholder="Select candidate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {candidates.map((c) => (
                                                <SelectItem key={c.id} value={c.id} className="text-[11px]">
                                                    {c.firstName} {c.lastName} · {c.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="Job">
                                    <Input
                                        value={
                                            jobs.find((j) => j.id === scheduleForm.jobId)?.title ??
                                            "—"
                                        }
                                        readOnly
                                        className="h-9 text-[11px] bg-slate-50"
                                    />
                                </FormField>

                                <FormField label="Round">
                                    <Select
                                        value={scheduleForm.round}
                                        onValueChange={(v) =>
                                            setScheduleForm((prev) => ({
                                                ...prev,
                                                round: v as InterviewRound,
                                                title: autoTitleForRound(
                                                    v as InterviewRound,
                                                    prev.roundOrder
                                                ),
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="h-9 text-[11px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROUND_OPTIONS.map((r) => (
                                                <SelectItem key={r} value={r} className="text-[11px]">
                                                    {r}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="Round Order (auto-suggested)">
                                    <Input
                                        type="number"
                                        min={1}
                                        value={scheduleForm.roundOrder}
                                        onChange={(e) =>
                                            setScheduleForm((prev) => ({
                                                ...prev,
                                                roundOrder: Number(e.target.value) || 1,
                                                title: autoTitleForRound(
                                                    prev.round,
                                                    Number(e.target.value) || 1
                                                ),
                                            }))
                                        }
                                        className="h-9 text-[11px]"
                                    />
                                </FormField>

                                <div className="col-span-2">
                                    <FormField label="Round Title">
                                        <Input
                                            value={scheduleForm.title}
                                            onChange={(e) =>
                                                setScheduleForm((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                            placeholder={scheduleForm.round === "Custom"
                                                ? "Custom round title"
                                                : undefined}
                                            className="h-9 text-[11px]"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setScheduleTab("panel")}
                                    className="bg-[#8B5CF6] hover:bg-violet-600 text-white h-9 rounded-xl text-[11px] font-semibold"
                                >
                                    Next: Panel & Schedule
                                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                </Button>
                            </div>
                        </TabsContent>

                        {/* ----- Tab 2 ----- */}
                        <TabsContent value="panel" className="px-6 py-5 space-y-4">
                            <PanelPicker
                                employees={employees}
                                panel={scheduleForm.panel}
                                search={panelSearch}
                                setSearch={setPanelSearch}
                                onToggle={(e) => togglePanelMember(setScheduleForm, e)}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Date">
                                    <Input
                                        type="date"
                                        value={scheduleForm.date}
                                        onChange={(e) =>
                                            setScheduleForm((prev) => ({ ...prev, date: e.target.value }))
                                        }
                                        className="h-9 text-[11px]"
                                    />
                                </FormField>
                                <FormField
                                    label={`Time (${scheduleForm.timeZone})`}
                                >
                                    <Input
                                        type="time"
                                        value={scheduleForm.time}
                                        onChange={(e) =>
                                            setScheduleForm((prev) => ({ ...prev, time: e.target.value }))
                                        }
                                        className="h-9 text-[11px]"
                                    />
                                </FormField>
                                <FormField label="Duration">
                                    <Select
                                        value={scheduleForm.duration}
                                        onValueChange={(v) =>
                                            setScheduleForm((prev) => ({ ...prev, duration: v }))
                                        }
                                    >
                                        <SelectTrigger className="h-9 text-[11px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DURATIONS.map((d) => (
                                                <SelectItem key={d} value={d} className="text-[11px]">
                                                    {d}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Time Zone">
                                    <Input
                                        value={scheduleForm.timeZone}
                                        onChange={(e) =>
                                            setScheduleForm((prev) => ({
                                                ...prev,
                                                timeZone: e.target.value,
                                            }))
                                        }
                                        className="h-9 text-[11px]"
                                    />
                                </FormField>
                            </div>

                            <FormField label="Mode">
                                <div className="grid grid-cols-3 gap-3">
                                    {(["Video", "In-person", "Phone"] as const).map((m) => {
                                        const Icon = modeIcon(m);
                                        const active = scheduleForm.mode === m;
                                        return (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() =>
                                                    setScheduleForm((prev) => ({ ...prev, mode: m }))
                                                }
                                                className={`rounded-xl border px-3 py-3 text-left transition ${
                                                    active
                                                        ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                                                        : "border-slate-200 hover:border-slate-300"
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-4 w-4 mb-1.5 ${
                                                        active ? "text-violet-600" : "text-slate-400"
                                                    }`}
                                                />
                                                <div
                                                    className={`text-[11px] font-semibold ${
                                                        active ? "text-violet-700" : "text-slate-700"
                                                    }`}
                                                >
                                                    {m}
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">
                                                    {m === "Video"
                                                        ? "Zoom / Meet link"
                                                        : m === "In-person"
                                                          ? "Office location"
                                                          : "Phone call"}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </FormField>

                            {scheduleForm.mode === "Video" && (
                                <FormField label="Meeting Link">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                            <Input
                                                value={scheduleForm.meetingLink}
                                                onChange={(e) =>
                                                    setScheduleForm((prev) => ({
                                                        ...prev,
                                                        meetingLink: e.target.value,
                                                    }))
                                                }
                                                placeholder="Paste or generate…"
                                                className="h-9 text-[11px] pl-8"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setScheduleForm((prev) => ({
                                                    ...prev,
                                                    meetingLink: generateZoomLink(),
                                                }))
                                            }
                                            className="h-9 text-[11px] font-semibold"
                                        >
                                            Generate Zoom
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setScheduleForm((prev) => ({
                                                    ...prev,
                                                    meetingLink: generateMeetLink(),
                                                }))
                                            }
                                            className="h-9 text-[11px] font-semibold"
                                        >
                                            Generate Meet
                                        </Button>
                                    </div>
                                </FormField>
                            )}

                            {scheduleForm.mode === "In-person" && (
                                <FormField label="Location">
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                        <Input
                                            value={scheduleForm.location}
                                            onChange={(e) =>
                                                setScheduleForm((prev) => ({
                                                    ...prev,
                                                    location: e.target.value,
                                                }))
                                            }
                                            placeholder="e.g., HQ Conference Room B"
                                            className="h-9 text-[11px] pl-8"
                                        />
                                    </div>
                                </FormField>
                            )}

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setScheduleTab("role")}
                                    className="h-9 rounded-xl text-[11px] font-semibold"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                                    Back
                                </Button>
                                <Button
                                    onClick={() => setScheduleTab("prep")}
                                    className="bg-[#8B5CF6] hover:bg-violet-600 text-white h-9 rounded-xl text-[11px] font-semibold"
                                >
                                    Next: Prep & Confirm
                                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                </Button>
                            </div>
                        </TabsContent>

                        {/* ----- Tab 3 ----- */}
                        <TabsContent value="prep" className="px-6 py-5 space-y-4">
                            <FormField label="Preparation Notes">
                                <Textarea
                                    rows={4}
                                    value={scheduleForm.preparationNotes}
                                    onChange={(e) =>
                                        setScheduleForm((prev) => ({
                                            ...prev,
                                            preparationNotes: e.target.value,
                                        }))
                                    }
                                    placeholder="Focus areas, reading material…"
                                    className="text-[11px] resize-none"
                                />
                            </FormField>

                            <FormField label="Shared Questions">
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newQuestion}
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                            placeholder="Add a question and press Enter…"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && newQuestion.trim()) {
                                                    e.preventDefault();
                                                    setScheduleForm((prev) => ({
                                                        ...prev,
                                                        questions: [...prev.questions, newQuestion.trim()],
                                                    }));
                                                    setNewQuestion("");
                                                }
                                            }}
                                            className="h-9 text-[11px]"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (!newQuestion.trim()) return;
                                                setScheduleForm((prev) => ({
                                                    ...prev,
                                                    questions: [...prev.questions, newQuestion.trim()],
                                                }));
                                                setNewQuestion("");
                                            }}
                                            className="h-9 text-[11px] font-semibold"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    {scheduleForm.questions.length > 0 && (
                                        <ul className="space-y-1.5">
                                            {scheduleForm.questions.map((q, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-2 text-[11px] bg-slate-50 rounded-lg px-3 py-2"
                                                >
                                                    <span className="font-semibold text-slate-400 w-5">
                                                        {idx + 1}.
                                                    </span>
                                                    <span className="flex-1 text-slate-700">{q}</span>
                                                    <button
                                                        onClick={() =>
                                                            setScheduleForm((prev) => ({
                                                                ...prev,
                                                                questions: prev.questions.filter(
                                                                    (_, i) => i !== idx
                                                                ),
                                                            }))
                                                        }
                                                    >
                                                        <X className="h-3 w-3 text-slate-400 hover:text-rose-500" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </FormField>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                        Conflict Detection
                                    </Label>
                                    <Button
                                        variant="outline"
                                        onClick={handleCheckConflicts}
                                        className="h-8 text-[11px] font-semibold"
                                    >
                                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                                        Check conflicts
                                    </Button>
                                </div>
                                {conflictsChecked && conflictList.length === 0 && (
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] text-emerald-700 flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        No scheduling conflicts — all panelists are available.
                                    </div>
                                )}
                                {conflictList.length > 0 && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 space-y-1.5">
                                        <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            {conflictList.length} conflict
                                            {conflictList.length > 1 ? "s" : ""} detected
                                        </div>
                                        <ul className="space-y-1">
                                            {conflictList.map((c, idx) => {
                                                const emp = employees.find(
                                                    (e) => e._id === c.employeeId
                                                );
                                                return (
                                                    <li
                                                        key={idx}
                                                        className="text-[11px] text-amber-800 flex items-start gap-1.5"
                                                    >
                                                        <span className="text-amber-500">⚠</span>
                                                        <span>
                                                            <span className="font-semibold">
                                                                {emp
                                                                    ? `${emp.firstName} ${emp.lastName}`
                                                                    : c.employeeId}
                                                            </span>{" "}
                                                            has <span className="italic">"{c.conflictingTitle}"</span>{" "}
                                                            at {c.conflictingTime}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <label className="flex items-center gap-2 mt-2 text-[11px] text-amber-800 font-semibold">
                                            <Checkbox
                                                checked={overrideConflicts}
                                                onCheckedChange={(v) => setOverrideConflicts(!!v)}
                                            />
                                            Override conflicts and schedule anyway
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setScheduleTab("panel")}
                                    className="h-9 rounded-xl text-[11px] font-semibold"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                                    Back
                                </Button>
                                <Button
                                    disabled={conflictList.length > 0 && !overrideConflicts}
                                    onClick={handleSchedule}
                                    className="bg-[#8B5CF6] hover:bg-violet-600 text-white h-9 rounded-xl text-[11px] font-semibold disabled:opacity-50"
                                >
                                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                    Schedule Interview
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
            </SideFormSheet>

            {/* =========================================================== */}
            {/*  DIALOG 2: Edit                                             */}
            {/* =========================================================== */}
            <SideFormSheet
                open={editOpen}
                onOpenChange={setEditOpen}
                title="Edit Interview"
                description="Modify round, panel, or schedule."
                icon={<Edit className="h-5 w-5" />}
                accentColor="#7c3aed"
                width="xl"
                hideFooter
            >
                <Tabs value={editTab} onValueChange={(v) => setEditTab(v as any)}>
                    <TabsList className="bg-slate-100 p-1 h-10 rounded-xl">
                            <TabsTrigger
                                value="role"
                                className="h-8 px-4 text-[11px] font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-violet-600"
                            >
                                1. Candidate & Role
                            </TabsTrigger>
                            <TabsTrigger
                                value="panel"
                                className="h-8 px-4 text-[11px] font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-violet-600"
                            >
                                2. Panel & Schedule
                            </TabsTrigger>
                            <TabsTrigger
                                value="prep"
                                className="h-8 px-4 text-[11px] font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-violet-600"
                            >
                                3. Prep
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="role" className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Candidate">
                                    <Input
                                        readOnly
                                        value={
                                            (() => {
                                                const c = candidateById(editForm.candidateId);
                                                return c ? `${c.firstName} ${c.lastName}` : "—";
                                            })()
                                        }
                                        className="h-9 text-[11px] bg-slate-50"
                                    />
                                </FormField>
                                <FormField label="Job">
                                    <Input
                                        readOnly
                                        value={jobById(editForm.jobId)?.title ?? "—"}
                                        className="h-9 text-[11px] bg-slate-50"
                                    />
                                </FormField>
                                <FormField label="Round">
                                    <Select
                                        value={editForm.round}
                                        onValueChange={(v) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                round: v as InterviewRound,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="h-9 text-[11px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROUND_OPTIONS.map((r) => (
                                                <SelectItem key={r} value={r} className="text-[11px]">
                                                    {r}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Round Order">
                                    <Input
                                        type="number"
                                        min={1}
                                        value={editForm.roundOrder}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                roundOrder: Number(e.target.value) || 1,
                                            }))
                                        }
                                        className="h-9 text-[11px]"
                                    />
                                </FormField>
                                <div className="col-span-2">
                                    <FormField label="Title">
                                        <Input
                                            value={editForm.title}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                            className="h-9 text-[11px]"
                                        />
                                    </FormField>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setEditTab("panel")}
                                    className="bg-[#8B5CF6] hover:bg-violet-600 text-white h-9 rounded-xl text-[11px] font-semibold"
                                >
                                    Next
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="panel" className="px-6 py-5 space-y-4">
                            <PanelPicker
                                employees={employees}
                                panel={editForm.panel}
                                search={panelSearch}
                                setSearch={setPanelSearch}
                                onToggle={(e) => togglePanelMember(setEditForm, e)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Date">
                                    <Input
                                        type="date"
                                        value={editForm.date}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                date: e.target.value,
                                            }))
                                        }
                                        className="h-9 text-[11px]"
                                    />
                                </FormField>
                                <FormField label="Time">
                                    <Input
                                        type="time"
                                        value={editForm.time}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                time: e.target.value,
                                            }))
                                        }
                                        className="h-9 text-[11px]"
                                    />
                                </FormField>
                                <FormField label="Duration">
                                    <Select
                                        value={editForm.duration}
                                        onValueChange={(v) =>
                                            setEditForm((prev) => ({ ...prev, duration: v }))
                                        }
                                    >
                                        <SelectTrigger className="h-9 text-[11px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DURATIONS.map((d) => (
                                                <SelectItem key={d} value={d} className="text-[11px]">
                                                    {d}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Mode">
                                    <Select
                                        value={editForm.mode}
                                        onValueChange={(v) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                mode: v as Interview["mode"],
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="h-9 text-[11px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Video" className="text-[11px]">
                                                Video
                                            </SelectItem>
                                            <SelectItem value="In-person" className="text-[11px]">
                                                In-person
                                            </SelectItem>
                                            <SelectItem value="Phone" className="text-[11px]">
                                                Phone
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                            {editForm.mode === "Video" && (
                                <FormField label="Meeting Link">
                                    <div className="flex gap-2">
                                        <Input
                                            value={editForm.meetingLink}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    meetingLink: e.target.value,
                                                }))
                                            }
                                            className="h-9 text-[11px]"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    meetingLink: generateZoomLink(),
                                                }))
                                            }
                                            className="h-9 text-[11px] font-semibold"
                                        >
                                            Zoom
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    meetingLink: generateMeetLink(),
                                                }))
                                            }
                                            className="h-9 text-[11px] font-semibold"
                                        >
                                            Meet
                                        </Button>
                                    </div>
                                </FormField>
                            )}
                            {editForm.mode === "In-person" && (
                                <FormField label="Location">
                                    <Input
                                        value={editForm.location}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                location: e.target.value,
                                            }))
                                        }
                                        className="h-9 text-[11px]"
                                    />
                                </FormField>
                            )}
                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setEditTab("role")}
                                    className="h-9 text-[11px] font-semibold rounded-xl"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={() => setEditTab("prep")}
                                    className="bg-[#8B5CF6] hover:bg-violet-600 text-white h-9 rounded-xl text-[11px] font-semibold"
                                >
                                    Next
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="prep" className="px-6 py-5 space-y-4">
                            <FormField label="Preparation Notes">
                                <Textarea
                                    rows={4}
                                    value={editForm.preparationNotes}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            preparationNotes: e.target.value,
                                        }))
                                    }
                                    className="text-[11px] resize-none"
                                />
                            </FormField>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                        Conflict Detection
                                    </Label>
                                    <Button
                                        variant="outline"
                                        onClick={handleEditCheckConflicts}
                                        className="h-8 text-[11px] font-semibold"
                                    >
                                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                                        Check conflicts
                                    </Button>
                                </div>
                                {editConflictsChecked && editConflicts.length === 0 && (
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] text-emerald-700 flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        No conflicts detected.
                                    </div>
                                )}
                                {editConflicts.length > 0 && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 space-y-1.5">
                                        <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            {editConflicts.length} conflict
                                            {editConflicts.length > 1 ? "s" : ""} detected
                                        </div>
                                        <ul className="space-y-1">
                                            {editConflicts.map((c, idx) => {
                                                const emp = employees.find((e) => e._id === c.employeeId);
                                                return (
                                                    <li
                                                        key={idx}
                                                        className="text-[11px] text-amber-800"
                                                    >
                                                        ⚠{" "}
                                                        <span className="font-semibold">
                                                            {emp
                                                                ? `${emp.firstName} ${emp.lastName}`
                                                                : c.employeeId}
                                                        </span>{" "}
                                                        has "{c.conflictingTitle}" at {c.conflictingTime}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <label className="flex items-center gap-2 mt-2 text-[11px] text-amber-800 font-semibold">
                                            <Checkbox
                                                checked={editOverride}
                                                onCheckedChange={(v) => setEditOverride(!!v)}
                                            />
                                            Override conflicts
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setEditTab("panel")}
                                    className="h-9 text-[11px] font-semibold rounded-xl"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleEdit}
                                    disabled={editConflicts.length > 0 && !editOverride}
                                    className="bg-[#8B5CF6] hover:bg-violet-600 text-white h-9 rounded-xl text-[11px] font-semibold disabled:opacity-50"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
            </SideFormSheet>

            {/* =========================================================== */}
            {/*  DIALOG 3: Reschedule                                       */}
            {/* =========================================================== */}
            <SideFormSheet
                open={rescheduleOpen}
                onOpenChange={setRescheduleOpen}
                title="Reschedule Interview"
                description={`${activeInterview?.title ?? ""} · current: ${formatDate(activeInterview?.date ?? "")} ${activeInterview?.time ?? ""}`}
                icon={<Calendar className="h-5 w-5" />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Reschedule"
                onSubmit={(e) => { e.preventDefault(); handleReschedule(); }}
            >
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="New Date">
                                <Input
                                    type="date"
                                    value={reschedForm.date}
                                    onChange={(e) =>
                                        setReschedForm((prev) => ({ ...prev, date: e.target.value }))
                                    }
                                    className="h-9 text-[11px]"
                                />
                            </FormField>
                            <FormField label="New Time">
                                <Input
                                    type="time"
                                    value={reschedForm.time}
                                    onChange={(e) =>
                                        setReschedForm((prev) => ({ ...prev, time: e.target.value }))
                                    }
                                    className="h-9 text-[11px]"
                                />
                            </FormField>
                        </div>
                        <FormField label="Reason">
                            <Textarea
                                rows={2}
                                value={reschedForm.reason}
                                onChange={(e) =>
                                    setReschedForm((prev) => ({ ...prev, reason: e.target.value }))
                                }
                                placeholder="Why is this being rescheduled?"
                                className="text-[11px] resize-none"
                            />
                        </FormField>
                        <Button
                            variant="outline"
                            onClick={handleReschedCheckConflicts}
                            className="h-8 w-full text-[11px] font-semibold"
                        >
                            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                            Check conflicts
                        </Button>
                        {reschedConflicts.length > 0 && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 space-y-1.5">
                                <div className="text-[11px] font-bold text-amber-800">
                                    {reschedConflicts.length} conflict
                                    {reschedConflicts.length > 1 ? "s" : ""}:
                                </div>
                                <ul className="space-y-1 text-[11px] text-amber-800">
                                    {reschedConflicts.map((c, idx) => {
                                        const emp = employees.find((e) => e._id === c.employeeId);
                                        return (
                                            <li key={idx}>
                                                ⚠ {emp ? `${emp.firstName} ${emp.lastName}` : c.employeeId} ·{" "}
                                                {c.conflictingTitle} @ {c.conflictingTime}
                                            </li>
                                        );
                                    })}
                                </ul>
                                <label className="flex items-center gap-2 mt-2 text-[11px] text-amber-800 font-semibold">
                                    <Checkbox
                                        checked={reschedOverride}
                                        onCheckedChange={(v) => setReschedOverride(!!v)}
                                    />
                                    Override conflicts
                                </label>
                            </div>
                        )}
                    </div>
            </SideFormSheet>

            {/* =========================================================== */}
            {/*  DIALOG 4: Submit Feedback                                  */}
            {/* =========================================================== */}
            <SideFormSheet
                open={feedbackOpen}
                onOpenChange={setFeedbackOpen}
                title="Submit Feedback"
                description={`${activeInterview?.title ?? ""}${activeInterview && candidateById(activeInterview.candidateId)
                    ? ` · ${candidateById(activeInterview.candidateId)?.firstName} ${candidateById(activeInterview.candidateId)?.lastName}`
                    : ""}`}
                icon={<Star className="h-5 w-5" />}
                accentColor="#059669"
                width="lg"
                submitLabel="Submit Feedback"
                onSubmit={(e) => { e.preventDefault(); handleFeedback(); }}
            >
                    <div className="space-y-3">
                        {Object.keys(feedbackForm.ratings).map((criterion) => (
                            <div key={criterion}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-700">
                                        {criterion}
                                    </Label>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {feedbackForm.ratings[criterion]}/5
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((n) => {
                                        const active = feedbackForm.ratings[criterion] >= n;
                                        return (
                                            <button
                                                key={n}
                                                onClick={() =>
                                                    setFeedbackForm((prev) => ({
                                                        ...prev,
                                                        ratings: { ...prev.ratings, [criterion]: n },
                                                    }))
                                                }
                                                className={`flex-1 h-8 rounded-md border text-[11px] font-bold transition ${
                                                    active
                                                        ? "bg-amber-400 border-amber-400 text-white shadow-sm"
                                                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                                }`}
                                            >
                                                <Star className="h-3 w-3 mx-auto" fill={active ? "currentColor" : "none"} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <FormField label="Overall Recommendation">
                            <RadioGroup
                                value={feedbackForm.recommendation}
                                onValueChange={(v) =>
                                    setFeedbackForm((prev) => ({
                                        ...prev,
                                        recommendation: v as ScorecardRecommendation,
                                    }))
                                }
                                className="grid grid-cols-2 gap-2"
                            >
                                {(["Strong Hire", "Hire", "No Hire", "Strong No Hire"] as const).map(
                                    (o) => (
                                        <label
                                            key={o}
                                            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] cursor-pointer transition ${
                                                feedbackForm.recommendation === o
                                                    ? "border-violet-400 bg-violet-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                            }`}
                                        >
                                            <RadioGroupItem value={o} />
                                            <span className="font-semibold text-slate-700">{o}</span>
                                        </label>
                                    )
                                )}
                            </RadioGroup>
                        </FormField>

                        <FormField label="Strengths">
                            <Textarea
                                rows={2}
                                value={feedbackForm.strengths}
                                onChange={(e) =>
                                    setFeedbackForm((prev) => ({
                                        ...prev,
                                        strengths: e.target.value,
                                    }))
                                }
                                className="text-[11px] resize-none"
                            />
                        </FormField>
                        <FormField label="Concerns">
                            <Textarea
                                rows={2}
                                value={feedbackForm.concerns}
                                onChange={(e) =>
                                    setFeedbackForm((prev) => ({
                                        ...prev,
                                        concerns: e.target.value,
                                    }))
                                }
                                className="text-[11px] resize-none"
                            />
                        </FormField>
                    </div>
            </SideFormSheet>

            {/* =========================================================== */}
            {/*  DIALOG 5: Mark Outcome                                     */}
            {/* =========================================================== */}
            <SideFormSheet
                open={outcomeOpen}
                onOpenChange={setOutcomeOpen}
                title="Mark Outcome"
                description="Record the decision for this round."
                icon={<CheckCircle2 className="h-5 w-5" />}
                accentColor="#4f46e5"
                width="md"
                submitLabel="Save Outcome"
                onSubmit={(e) => { e.preventDefault(); handleOutcome(); }}
            >
                    <div className="space-y-3">
                        <FormField label="Outcome">
                            <RadioGroup
                                value={outcomeForm.outcome}
                                onValueChange={(v) =>
                                    setOutcomeForm((prev) => ({
                                        ...prev,
                                        outcome: v as NonNullable<Interview["outcome"]>,
                                    }))
                                }
                                className="space-y-1.5"
                            >
                                {OUTCOME_OPTIONS.map((o) => (
                                    <label
                                        key={o}
                                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] cursor-pointer transition ${
                                            outcomeForm.outcome === o
                                                ? "border-violet-400 bg-violet-50"
                                                : "border-slate-200 hover:border-slate-300"
                                        }`}
                                    >
                                        <RadioGroupItem value={o} />
                                        <span className="font-semibold text-slate-700">{o}</span>
                                    </label>
                                ))}
                            </RadioGroup>
                        </FormField>
                        <FormField label="Notes">
                            <Textarea
                                rows={3}
                                value={outcomeForm.notes}
                                onChange={(e) =>
                                    setOutcomeForm((prev) => ({
                                        ...prev,
                                        notes: e.target.value,
                                    }))
                                }
                                className="text-[11px] resize-none"
                            />
                        </FormField>
                        {(outcomeForm.outcome === "Hire" ||
                            outcomeForm.outcome === "Strong Hire") && (
                            <label className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] font-semibold text-emerald-800 cursor-pointer">
                                <Checkbox
                                    checked={outcomeForm.moveToOffer}
                                    onCheckedChange={(v) =>
                                        setOutcomeForm((prev) => ({
                                            ...prev,
                                            moveToOffer: !!v,
                                        }))
                                    }
                                />
                                Also move candidate to Offer stage
                            </label>
                        )}
                    </div>
            </SideFormSheet>

            {/* =========================================================== */}
            {/*  DIALOG 6: Bulk Reschedule                                  */}
            {/* =========================================================== */}
            <SideFormSheet
                open={bulkRescheduleOpen}
                onOpenChange={setBulkRescheduleOpen}
                title="Bulk Reschedule"
                description={`Moving ${selectedIds.length} interview${selectedIds.length === 1 ? "" : "s"} to the same date.`}
                icon={<Calendar className="h-5 w-5" />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Reschedule All"
                onSubmit={(e) => { e.preventDefault(); handleBulkReschedule(); }}
            >
                    <div className="space-y-3">
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
                            {selectedIds.slice(0, 5).map((id) => {
                                const iv = interviews.find((x) => x.id === id);
                                if (!iv) return null;
                                const cand = candidateById(iv.candidateId);
                                return (
                                    <div
                                        key={id}
                                        className="text-[11px] flex items-center justify-between"
                                    >
                                        <span className="text-slate-700 font-semibold truncate">
                                            {cand
                                                ? `${cand.firstName} ${cand.lastName}`
                                                : "Unknown"}{" "}
                                            · {iv.title}
                                        </span>
                                        <span className="text-slate-400">
                                            {shortDate(iv.date)} {iv.time}
                                        </span>
                                    </div>
                                );
                            })}
                            {selectedIds.length > 5 && (
                                <div className="text-[11px] text-slate-400 font-semibold">
                                    + {selectedIds.length - 5} more
                                </div>
                            )}
                        </div>
                        <FormField label="New Date">
                            <Input
                                type="date"
                                value={bulkResched.date}
                                onChange={(e) =>
                                    setBulkResched((prev) => ({ ...prev, date: e.target.value }))
                                }
                                className="h-9 text-[11px]"
                            />
                        </FormField>
                        <FormField label="Reason">
                            <Textarea
                                rows={2}
                                value={bulkResched.reason}
                                onChange={(e) =>
                                    setBulkResched((prev) => ({ ...prev, reason: e.target.value }))
                                }
                                className="text-[11px] resize-none"
                            />
                        </FormField>
                    </div>
            </SideFormSheet>

            {/* =========================================================== */}
            {/*  DIALOG 7: Interview Detail Sheet                           */}
            {/* =========================================================== */}
            <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-xl p-0 bg-white overflow-y-auto"
                >
                    {activeInterview && (
                        <InterviewDetail
                            interview={activeInterview}
                            candidate={candidateById(activeInterview.candidateId)}
                            job={jobById(activeInterview.jobId)}
                            employees={employees}
                            onEdit={() => {
                                setDetailOpen(false);
                                openEdit(activeInterview);
                            }}
                            onReschedule={() => {
                                setDetailOpen(false);
                                openReschedule(activeInterview);
                            }}
                            onReminder={() => handleReminder(activeInterview)}
                            onOutcome={() => {
                                setDetailOpen(false);
                                openOutcome(activeInterview);
                            }}
                            onFeedback={() => {
                                setDetailOpen(false);
                                openFeedback(activeInterview);
                            }}
                            onCancel={() => {
                                updateInterview(activeInterview.id, { status: "Cancelled" });
                                toast({ title: "Interview cancelled" });
                                setDetailOpen(false);
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>

            {/* =========================================================== */}
            {/*  Calendar Day Panel (side sheet)                            */}
            {/* =========================================================== */}
            <Sheet open={!!dayPanelDate} onOpenChange={(v) => !v && setDayPanelDate(null)}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-md p-0 bg-white overflow-y-auto"
                >
                    {dayPanelDate && (
                        <div>
                            <SheetHeader className="px-5 py-4 border-b border-slate-100">
                                <SheetTitle className="text-base font-bold text-slate-900">
                                    {formatDate(dayPanelDate)}
                                </SheetTitle>
                                <SheetDescription className="text-[11px] text-slate-500">
                                    {(interviewsByDate[dayPanelDate] ?? []).length} interview
                                    {(interviewsByDate[dayPanelDate] ?? []).length === 1 ? "" : "s"}{" "}
                                    scheduled
                                </SheetDescription>
                            </SheetHeader>
                            <div className="p-5 space-y-2">
                                {(interviewsByDate[dayPanelDate] ?? []).length === 0 && (
                                    <p className="text-[11px] text-slate-400">
                                        Nothing on this day.
                                    </p>
                                )}
                                {(interviewsByDate[dayPanelDate] ?? []).map((iv) => {
                                    const cand = candidateById(iv.candidateId);
                                    const Mode = modeIcon(iv.mode);
                                    return (
                                        <button
                                            key={iv.id}
                                            onClick={() => {
                                                setDayPanelDate(null);
                                                openDetail(iv);
                                            }}
                                            className="w-full text-left rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm transition p-3"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-[11px] font-bold text-slate-900">
                                                    {iv.time} · {iv.duration}
                                                </div>
                                                <Badge
                                                    className={`${statusStyles[iv.status]} border-transparent text-[9px] font-bold`}
                                                >
                                                    {iv.status}
                                                </Badge>
                                            </div>
                                            <div className="text-[11px] text-slate-700 font-semibold">
                                                {cand
                                                    ? `${cand.firstName} ${cand.lastName}`
                                                    : "Unknown"}{" "}
                                                · {iv.title}
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                                                <Mode className="h-3 w-3" /> {iv.mode}
                                                <span>·</span>
                                                <Users className="h-3 w-3" />{" "}
                                                {(iv.panel?.length ?? iv.interviewers?.length ?? 0)}{" "}
                                                panelist
                                                {(iv.panel?.length ?? iv.interviewers?.length ?? 0) === 1
                                                    ? ""
                                                    : "s"}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

/* ======================================================================= */
/*  Sub-components                                                         */
/* ======================================================================= */

function StatCard({
    icon,
    label,
    value,
    hint,
    tint,
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    hint: string;
    tint: "violet" | "blue" | "amber" | "rose" | "emerald";
}) {
    const tintBg: Record<string, string> = {
        violet: "bg-violet-50",
        blue: "bg-blue-50",
        amber: "bg-amber-50",
        rose: "bg-rose-50",
        emerald: "bg-emerald-50",
    };
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex items-start gap-3">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${tintBg[tint]}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {value}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{hint}</div>
            </div>
        </div>
    );
}

function FormField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                {label}
            </Label>
            {children}
        </div>
    );
}

/* ---------- Panel Picker (used inside Schedule + Edit dialogs) ---------- */

function PanelPicker({
    employees,
    panel,
    search,
    setSearch,
    onToggle,
}: {
    employees: EmployeeLite[];
    panel: InterviewPanelMember[];
    search: string;
    setSearch: (v: string) => void;
    onToggle: (emp: EmployeeLite) => void;
}) {
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return employees;
        return employees.filter((e) =>
            (`${e.firstName} ${e.lastName} ${e.email} ${e.department ?? ""}`)
                .toLowerCase()
                .includes(q)
        );
    }, [employees, search]);

    return (
        <FormField label="Panel (multi-select)">
            <div className="space-y-2">
                {panel.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {panel.map((p) => (
                            <span
                                key={p.employeeId}
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${colorForName(
                                    p.name
                                )}`}
                            >
                                <span>{p.name}</span>
                                <button
                                    onClick={() => {
                                        const emp = employees.find((e) => e._id === p.employeeId);
                                        if (emp) onToggle(emp);
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search employees…"
                        className="h-9 pl-8 text-[11px]"
                    />
                </div>
                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 divide-y divide-slate-100">
                    {filtered.length === 0 && (
                        <div className="px-3 py-4 text-center text-[11px] text-slate-400">
                            No employees match.
                        </div>
                    )}
                    {filtered.map((e) => {
                        const picked = panel.some((p) => p.employeeId === e._id);
                        return (
                            <button
                                key={e._id}
                                onClick={() => onToggle(e)}
                                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left transition ${
                                    picked ? "bg-violet-50" : "hover:bg-white"
                                }`}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ${colorForName(
                                            `${e.firstName} ${e.lastName}`
                                        )}`}
                                    >
                                        {initials(`${e.firstName} ${e.lastName}`)}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-semibold text-slate-800 truncate">
                                            {e.firstName} {e.lastName}
                                        </div>
                                        <div className="text-[10px] text-slate-400 truncate">
                                            {e.department || "—"} · {e.email}
                                        </div>
                                    </div>
                                </div>
                                <Checkbox checked={picked} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </FormField>
    );
}

/* ---------- List View ---------------------------------------------------- */

function ListView(props: {
    activeTab: ListTab;
    setActiveTab: (t: ListTab) => void;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    filterRound: string;
    setFilterRound: (v: string) => void;
    filterMode: string;
    setFilterMode: (v: string) => void;
    filterDateFrom: string;
    setFilterDateFrom: (v: string) => void;
    filterDateTo: string;
    setFilterDateTo: (v: string) => void;
    filterInterviewer: string;
    setFilterInterviewer: (v: string) => void;
    employees: EmployeeLite[];
    filteredInterviews: Interview[];
    candidateById: (id: string) => Candidate | undefined;
    jobById: (id: string) => Job | undefined;
    selectedIds: string[];
    toggleSelect: (id: string) => void;
    toggleSelectAll: () => void;
    allSelected: boolean;
    onView: (iv: Interview) => void;
    onEdit: (iv: Interview) => void;
    onReschedule: (iv: Interview) => void;
    onReminder: (iv: Interview) => void;
    onOutcome: (iv: Interview) => void;
    onFeedback: (iv: Interview) => void;
    onDelete: (iv: Interview) => void;
}) {
    const {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        filterRound,
        setFilterRound,
        filterMode,
        setFilterMode,
        filterDateFrom,
        setFilterDateFrom,
        filterDateTo,
        setFilterDateTo,
        filterInterviewer,
        setFilterInterviewer,
        employees,
        filteredInterviews,
        candidateById,
        jobById,
        selectedIds,
        toggleSelect,
        toggleSelectAll,
        allSelected,
        onView,
        onEdit,
        onReschedule,
        onReminder,
        onOutcome,
        onFeedback,
        onDelete,
    } = props;

    return (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ListTab)}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100">
                    <TabsList className="bg-slate-100 p-1 h-9 rounded-xl">
                        {(
                            [
                                "all",
                                "scheduled",
                                "completed",
                                "cancelled",
                                "rescheduled",
                            ] as ListTab[]
                        ).map((t) => (
                            <TabsTrigger
                                key={t}
                                value={t}
                                className="h-7 px-3 text-[11px] font-semibold rounded-lg capitalize data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm"
                            >
                                {t}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="flex items-center gap-2">
                        <div className="relative w-56">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder="Search by name or round…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 pl-8 text-[11px]"
                            />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-9 rounded-xl text-[11px] font-semibold"
                                >
                                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                                    Filter
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-4 rounded-2xl" align="end">
                                <div className="space-y-3">
                                    <FormField label="Round">
                                        <Select value={filterRound} onValueChange={setFilterRound}>
                                            <SelectTrigger className="h-9 text-[11px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all" className="text-[11px]">
                                                    All
                                                </SelectItem>
                                                {ROUND_OPTIONS.map((r) => (
                                                    <SelectItem
                                                        key={r}
                                                        value={r}
                                                        className="text-[11px]"
                                                    >
                                                        {r}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField label="Mode">
                                        <Select value={filterMode} onValueChange={setFilterMode}>
                                            <SelectTrigger className="h-9 text-[11px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all" className="text-[11px]">
                                                    All
                                                </SelectItem>
                                                <SelectItem value="Video" className="text-[11px]">
                                                    Video
                                                </SelectItem>
                                                <SelectItem value="In-person" className="text-[11px]">
                                                    In-person
                                                </SelectItem>
                                                <SelectItem value="Phone" className="text-[11px]">
                                                    Phone
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <div className="grid grid-cols-2 gap-2">
                                        <FormField label="From">
                                            <Input
                                                type="date"
                                                value={filterDateFrom}
                                                onChange={(e) => setFilterDateFrom(e.target.value)}
                                                className="h-9 text-[11px]"
                                            />
                                        </FormField>
                                        <FormField label="To">
                                            <Input
                                                type="date"
                                                value={filterDateTo}
                                                onChange={(e) => setFilterDateTo(e.target.value)}
                                                className="h-9 text-[11px]"
                                            />
                                        </FormField>
                                    </div>
                                    <FormField label="Interviewer">
                                        <Select
                                            value={filterInterviewer}
                                            onValueChange={setFilterInterviewer}
                                        >
                                            <SelectTrigger className="h-9 text-[11px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all" className="text-[11px]">
                                                    All
                                                </SelectItem>
                                                {employees.map((e) => (
                                                    <SelectItem
                                                        key={e._id}
                                                        value={e._id}
                                                        className="text-[11px]"
                                                    >
                                                        {e.firstName} {e.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setFilterRound("all");
                                            setFilterMode("all");
                                            setFilterDateFrom("");
                                            setFilterDateTo("");
                                            setFilterInterviewer("all");
                                        }}
                                        className="w-full h-8 text-[11px] font-semibold"
                                    >
                                        Reset filters
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <TabsContent value={activeTab} className="m-0">
                    <Table>
                        <TableHeader className="bg-slate-50 sticky top-0 z-10">
                            <TableRow className="border-slate-100 hover:bg-slate-50">
                                <TableHead className="w-10 pl-5">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                    Candidate / Role
                                </TableHead>
                                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                    Round
                                </TableHead>
                                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                    Panel
                                </TableHead>
                                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                    Date / Time
                                </TableHead>
                                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                    Mode
                                </TableHead>
                                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                    Status
                                </TableHead>
                                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                    Outcome
                                </TableHead>
                                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right pr-5">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInterviews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Calendar className="h-10 w-10 text-slate-200" />
                                            <p className="text-[12px] font-semibold text-slate-400">
                                                No interviews found
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredInterviews.map((iv) => {
                                const cand = candidateById(iv.candidateId);
                                const job = jobById(iv.jobId);
                                const Mode = modeIcon(iv.mode);
                                const panelList =
                                    iv.panel ??
                                    (iv.interviewers ?? []).map((id) => ({
                                        employeeId: id,
                                        name: id,
                                    }));
                                const selected = selectedIds.includes(iv.id);
                                const pendingFb =
                                    iv.status === "Completed" &&
                                    (iv.scorecards?.length ?? 0) === 0;
                                return (
                                    <TableRow
                                        key={iv.id}
                                        onClick={() => setActiveInterview(iv)}
                                        className={`border-slate-100 hover:bg-slate-50/50 cursor-pointer ${selected ? "bg-violet-50/40" : ""}`}
                                    >
                                        <TableCell className="pl-5" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selected}
                                                onCheckedChange={() => toggleSelect(iv.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-bold text-slate-900">
                                                    {cand
                                                        ? `${cand.firstName} ${cand.lastName}`
                                                        : "Unknown"}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-semibold">
                                                    {job?.title ?? "—"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <Badge className="bg-violet-50 text-violet-700 border-transparent text-[10px] font-bold">
                                                    {iv.round ?? "Custom"}
                                                </Badge>
                                                {typeof iv.roundOrder === "number" && (
                                                    <span className="text-[10px] text-slate-400 font-semibold">
                                                        #{iv.roundOrder}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <PanelAvatars panel={panelList} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 text-violet-500" />
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-semibold text-slate-800">
                                                        {shortDate(iv.date)}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <Clock className="h-2.5 w-2.5" />
                                                        {iv.time} · {iv.duration}
                                                    </span>
                                                </div>
                                                {iv.reminderSentAt && (
                                                    <BellRing
                                                        className="h-3 w-3 text-amber-500"
                                                        aria-label="Reminder sent"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-slate-50 text-slate-600 border border-slate-200 font-semibold text-[10px] gap-1">
                                                <Mode className="h-3 w-3" />
                                                {iv.mode}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`${statusStyles[iv.status]} border-transparent text-[10px] font-bold`}
                                            >
                                                {iv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {iv.outcome ? (
                                                <Badge
                                                    className={`${outcomeStyles[iv.outcome]} border-transparent text-[10px] font-bold`}
                                                >
                                                    {iv.outcome}
                                                </Badge>
                                            ) : (
                                                <span className="text-[10px] text-slate-300">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-5">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:bg-slate-100"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-52 rounded-xl p-1"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => onView(iv)}
                                                        className="text-[11px] rounded-lg"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 mr-2" />
                                                        View details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onEdit(iv)}
                                                        className="text-[11px] rounded-lg"
                                                    >
                                                        <Edit className="h-3.5 w-3.5 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onReschedule(iv)}
                                                        className="text-[11px] rounded-lg"
                                                    >
                                                        <RefreshCw className="h-3.5 w-3.5 mr-2" />
                                                        Reschedule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onReminder(iv)}
                                                        className="text-[11px] rounded-lg"
                                                    >
                                                        <Bell className="h-3.5 w-3.5 mr-2" />
                                                        Send reminder
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => onOutcome(iv)}
                                                        className="text-[11px] rounded-lg"
                                                    >
                                                        <ThumbsUp className="h-3.5 w-3.5 mr-2" />
                                                        Mark outcome
                                                    </DropdownMenuItem>
                                                    {pendingFb && (
                                                        <DropdownMenuItem
                                                            onClick={() => onFeedback(iv)}
                                                            className="text-[11px] rounded-lg text-violet-700 bg-violet-50"
                                                        >
                                                            <Sparkles className="h-3.5 w-3.5 mr-2" />
                                                            Submit feedback
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(iv)}
                                                        className="text-[11px] rounded-lg text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </Card>
    );
}

function PanelAvatars({ panel }: { panel: { employeeId: string; name: string }[] }) {
    if (!panel || panel.length === 0) {
        return <span className="text-[10px] text-slate-300">—</span>;
    }
    const shown = panel.slice(0, 3);
    const extra = panel.length - shown.length;
    return (
        <div className="flex -space-x-1.5">
            {shown.map((p) => (
                <span
                    key={p.employeeId}
                    title={p.name}
                    className={`h-7 w-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold ${colorForName(
                        p.name
                    )}`}
                >
                    {initials(p.name)}
                </span>
            ))}
            {extra > 0 && (
                <span className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-bold">
                    +{extra}
                </span>
            )}
        </div>
    );
}

/* ---------- Calendar View ----------------------------------------------- */

function CalendarView(props: {
    calendarScope: CalendarScope;
    setCalendarScope: (s: CalendarScope) => void;
    calYear: number;
    calMonth: number;
    setCalYear: (y: number) => void;
    setCalMonth: (m: number) => void;
    calWeekStart: string;
    setCalWeekStart: (d: string) => void;
    monthGrid: { date: string | null; day: number | null }[];
    weekGrid: { date: string; day: number }[];
    interviewsByDate: Record<string, Interview[]>;
    candidateById: (id: string) => Candidate | undefined;
    onSelectDay: (iso: string) => void;
    onOpenInterview: (iv: Interview) => void;
}) {
    const {
        calendarScope,
        setCalendarScope,
        calYear,
        calMonth,
        setCalYear,
        setCalMonth,
        calWeekStart,
        setCalWeekStart,
        monthGrid,
        weekGrid,
        interviewsByDate,
        candidateById,
        onSelectDay,
        onOpenInterview,
    } = props;
    const todayIso = today();

    const navigateMonth = (delta: number) => {
        let m = calMonth + delta;
        let y = calYear;
        if (m < 0) {
            m = 11;
            y -= 1;
        }
        if (m > 11) {
            m = 0;
            y += 1;
        }
        setCalMonth(m);
        setCalYear(y);
    };

    const navigateWeek = (delta: number) => setCalWeekStart(addDays(calWeekStart, delta * 7));

    return (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    {calendarScope === "month" ? (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigateMonth(-1)}
                                className="h-8 w-8 p-0 rounded-lg"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h3 className="text-sm font-bold text-slate-900 min-w-[160px] text-center">
                                {monthName(calMonth)} {calYear}
                            </h3>
                            <Button
                                variant="outline"
                                onClick={() => navigateMonth(1)}
                                className="h-8 w-8 p-0 rounded-lg"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigateWeek(-1)}
                                className="h-8 w-8 p-0 rounded-lg"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h3 className="text-sm font-bold text-slate-900 min-w-[200px] text-center">
                                Week of {formatDate(calWeekStart)}
                            </h3>
                            <Button
                                variant="outline"
                                onClick={() => navigateWeek(1)}
                                className="h-8 w-8 p-0 rounded-lg"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
                <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5">
                    {(["month", "week"] as CalendarScope[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setCalendarScope(s)}
                            className={`h-7 px-3 rounded-lg text-[11px] font-semibold capitalize transition ${
                                calendarScope === s
                                    ? "bg-violet-500 text-white"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <div
                            key={d}
                            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center py-1"
                        >
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {(calendarScope === "month" ? monthGrid : weekGrid).map((cell, idx) => {
                        if (!cell.date) {
                            return (
                                <div
                                    key={idx}
                                    className="h-24 rounded-xl bg-slate-50/40"
                                />
                            );
                        }
                        const dayIvs = interviewsByDate[cell.date] ?? [];
                        const isToday = cell.date === todayIso;
                        const shown = dayIvs.slice(0, 3);
                        const more = dayIvs.length - shown.length;
                        return (
                            <button
                                key={idx}
                                onClick={() => onSelectDay(cell.date!)}
                                className={`h-24 rounded-xl border text-left p-2 transition ${
                                    isToday
                                        ? "border-violet-400 ring-2 ring-violet-100 bg-white"
                                        : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-sm"
                                }`}
                            >
                                <div
                                    className={`text-[11px] font-bold ${
                                        isToday ? "text-violet-700" : "text-slate-700"
                                    }`}
                                >
                                    {cell.day}
                                </div>
                                <div className="mt-1 space-y-0.5">
                                    {shown.map((iv) => {
                                        const cand = candidateById(iv.candidateId);
                                        return (
                                            <div
                                                key={iv.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onOpenInterview(iv);
                                                }}
                                                className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold truncate ${
                                                    statusStyles[iv.status]
                                                }`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                                                <span className="truncate">
                                                    {iv.time}{" "}
                                                    {cand
                                                        ? `${cand.firstName.slice(0, 10)}`
                                                        : iv.title.slice(0, 10)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {more > 0 && (
                                        <div className="text-[9px] font-bold text-slate-400">
                                            +{more} more
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}

/* ---------- Interview Detail Sheet -------------------------------------- */

function InterviewDetail(props: {
    interview: Interview;
    candidate?: Candidate;
    job?: Job;
    employees: EmployeeLite[];
    onEdit: () => void;
    onReschedule: () => void;
    onReminder: () => void;
    onOutcome: () => void;
    onFeedback: () => void;
    onCancel: () => void;
}) {
    const { interview, candidate, job, onEdit, onReschedule, onReminder, onOutcome, onFeedback, onCancel } = props;
    const Mode = modeIcon(interview.mode);
    const panel =
        interview.panel ??
        (interview.interviewers ?? []).map((id) => ({
            employeeId: id,
            name: id,
            email: undefined,
            role: undefined,
        }));

    const copyLink = () => {
        if (interview.meetingLink) {
            try {
                navigator.clipboard.writeText(interview.meetingLink);
            } catch {
                /* ignore */
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            <SheetHeader className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Badge className="bg-violet-50 text-violet-700 border-transparent font-bold text-[10px]">
                        {interview.round ?? "Custom"}
                    </Badge>
                    <Badge
                        className={`${statusStyles[interview.status]} border-transparent font-bold text-[10px]`}
                    >
                        {interview.status}
                    </Badge>
                    {interview.outcome && (
                        <Badge
                            className={`${outcomeStyles[interview.outcome]} border-transparent font-bold text-[10px]`}
                        >
                            {interview.outcome}
                        </Badge>
                    )}
                </div>
                <SheetTitle className="text-lg font-bold text-slate-900 mt-2">
                    {interview.title}
                </SheetTitle>
                <SheetDescription className="text-[11px] text-slate-500">
                    {candidate
                        ? `${candidate.firstName} ${candidate.lastName}`
                        : "Unknown candidate"}{" "}
                    · {job?.title ?? "—"}
                </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                <DetailSection icon={<UserCircle2 className="h-3.5 w-3.5" />} title="Candidate">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <DetailRow
                            label="Name"
                            value={
                                candidate
                                    ? `${candidate.firstName} ${candidate.lastName}`
                                    : "—"
                            }
                        />
                        <DetailRow label="Email" value={candidate?.email ?? "—"} />
                        <DetailRow label="Phone" value={candidate?.phone ?? "—"} />
                        <DetailRow label="Stage" value={candidate?.stage ?? "—"} />
                    </div>
                </DetailSection>

                <DetailSection icon={<Briefcase className="h-3.5 w-3.5" />} title="Job">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <DetailRow label="Title" value={job?.title ?? "—"} />
                        <DetailRow label="Department" value={job?.department ?? "—"} />
                        <DetailRow label="Location" value={job?.location ?? "—"} />
                        <DetailRow label="Type" value={job?.type ?? "—"} />
                    </div>
                </DetailSection>

                <DetailSection icon={<Calendar className="h-3.5 w-3.5" />} title="Schedule">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <DetailRow label="Date" value={formatDate(interview.date)} />
                        <DetailRow label="Time" value={interview.time} />
                        <DetailRow label="Duration" value={interview.duration} />
                        <DetailRow label="Time Zone" value={interview.timeZone ?? "—"} />
                        <DetailRow
                            label="Round Order"
                            value={
                                typeof interview.roundOrder === "number"
                                    ? `#${interview.roundOrder}`
                                    : "—"
                            }
                        />
                        <DetailRow
                            label="Reschedules"
                            value={String(interview.rescheduleCount ?? 0)}
                        />
                    </div>
                </DetailSection>

                <DetailSection icon={<Users className="h-3.5 w-3.5" />} title="Panel">
                    <div className="space-y-1.5">
                        {panel.length === 0 && (
                            <span className="text-[11px] text-slate-400">No panel set.</span>
                        )}
                        {panel.map((p) => (
                            <div
                                key={p.employeeId}
                                className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5"
                            >
                                <span
                                    className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ${colorForName(
                                        p.name
                                    )}`}
                                >
                                    {initials(p.name)}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-semibold text-slate-800 truncate">
                                        {p.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                        {p.role ?? ""} {p.email ? `· ${p.email}` : ""}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DetailSection>

                <DetailSection icon={<Mode className="h-3.5 w-3.5" />} title="Meeting">
                    <div className="text-[11px] space-y-2">
                        <DetailRow label="Mode" value={interview.mode} />
                        {interview.mode === "Video" && (
                            <div className="flex items-center gap-2">
                                <LinkIcon className="h-3 w-3 text-slate-400" />
                                <span className="text-[11px] font-mono text-violet-700 truncate flex-1">
                                    {interview.meetingLink || "—"}
                                </span>
                                {interview.meetingLink && (
                                    <button
                                        onClick={copyLink}
                                        className="text-slate-400 hover:text-slate-700"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        )}
                        {interview.mode === "In-person" && (
                            <DetailRow label="Location" value={interview.location ?? "—"} />
                        )}
                    </div>
                </DetailSection>

                {interview.preparationNotes && (
                    <DetailSection icon={<ListChecks className="h-3.5 w-3.5" />} title="Preparation Notes">
                        <p className="text-[11px] text-slate-700 whitespace-pre-wrap">
                            {interview.preparationNotes}
                        </p>
                    </DetailSection>
                )}

                <DetailSection icon={<Sparkles className="h-3.5 w-3.5" />} title="Scorecards">
                    {(interview.scorecards?.length ?? 0) === 0 ? (
                        <p className="text-[11px] text-slate-400">No scorecards submitted yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {interview.scorecards.map((s, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-[11px] font-bold text-slate-800">
                                            {s.interviewerName ?? s.interviewerId}
                                        </div>
                                        {s.recommendation && (
                                            <Badge
                                                className={`${outcomeStyles[s.recommendation]} border-transparent text-[10px] font-bold`}
                                            >
                                                {s.recommendation}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                        <span>Overall: {s.overallScore}/5</span>
                                        <span>·</span>
                                        <span>{new Date(s.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-700 whitespace-pre-wrap">
                                        {s.feedback}
                                    </div>
                                    {s.skillsRating && s.skillsRating.length > 0 && (
                                        <div className="grid grid-cols-2 gap-1">
                                            {s.skillsRating.map((r) => (
                                                <div
                                                    key={r.skill}
                                                    className="flex items-center justify-between text-[10px] text-slate-500"
                                                >
                                                    <span>{r.skill}</span>
                                                    <span className="font-bold">{r.score}/5</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </DetailSection>

                <DetailSection icon={<RefreshCw className="h-3.5 w-3.5" />} title="Activity">
                    <ul className="space-y-1.5 text-[11px] text-slate-600">
                        <li>
                            <span className="font-semibold">Scheduled</span> ·{" "}
                            {formatDate(interview.date)} at {interview.time}
                        </li>
                        {(interview.rescheduleCount ?? 0) > 0 && (
                            <li>
                                <span className="font-semibold">Rescheduled</span> ·{" "}
                                {interview.rescheduleCount} time
                                {(interview.rescheduleCount ?? 0) === 1 ? "" : "s"}
                            </li>
                        )}
                        {interview.reminderSentAt && (
                            <li>
                                <span className="font-semibold">Reminder sent</span> ·{" "}
                                {new Date(interview.reminderSentAt).toLocaleString()}
                            </li>
                        )}
                        {interview.outcome && (
                            <li>
                                <span className="font-semibold">Outcome recorded</span> ·{" "}
                                {interview.outcome}
                            </li>
                        )}
                    </ul>
                </DetailSection>
            </div>

            <div className="border-t border-slate-100 p-4 flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    onClick={onEdit}
                    className="h-9 rounded-xl text-[11px] font-semibold"
                >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                </Button>
                <Button
                    variant="outline"
                    onClick={onReschedule}
                    className="h-9 rounded-xl text-[11px] font-semibold"
                >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Reschedule
                </Button>
                <Button
                    variant="outline"
                    onClick={onReminder}
                    className="h-9 rounded-xl text-[11px] font-semibold"
                >
                    <Bell className="h-3.5 w-3.5 mr-1.5" />
                    Reminder
                </Button>
                <Button
                    variant="outline"
                    onClick={onOutcome}
                    className="h-9 rounded-xl text-[11px] font-semibold"
                >
                    <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                    Outcome
                </Button>
                <Button
                    variant="outline"
                    onClick={onFeedback}
                    className="h-9 rounded-xl text-[11px] font-semibold"
                >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Feedback
                </Button>
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="h-9 rounded-xl text-[11px] font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

function DetailSection({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                {icon}
                {title}
            </div>
            {children}
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {label}
            </div>
            <div className="text-[11px] font-semibold text-slate-800 truncate">{value}</div>
        </div>
    );
}
