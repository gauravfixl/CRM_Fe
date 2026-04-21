"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    UserPlus,
    Upload,
    Download,
    Mail,
    Phone,
    MapPin,
    Star,
    Linkedin,
    Tag,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Send,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Calendar,
    Briefcase,
    LayoutGrid,
    List,
    Table2,
    Plus,
    X,
    MessageSquare,
    Activity,
    FileText,
    Sparkles,
    ArrowUpDown,
    AlertCircle,
    ChevronDown,
    SlidersHorizontal,
    Copy,
    UserCheck,
    Globe,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { Slider } from "@/shared/components/ui/slider";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/shared/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";

import { useHireStore, type Candidate } from "@/shared/data/hire-store";
import { z } from "zod";

// ============================================================
// Validation schema (Add/Edit candidate form)
// ============================================================

const candidateFormSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().or(z.literal("")),
    jobId: z.string().min(1, "Please select a job"),
    source: z.string().optional(),
    location: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

// ============================================================
// Constants & Types
// ============================================================

type ViewMode = "kanban" | "table" | "list";
type SortMode = "newest" | "oldest" | "rating" | "name";
type StageId = Candidate["stage"];

interface StageDef {
    id: StageId;
    title: string;
    headerBg: string;
    headerText: string;
    dot: string;
    col: string;
    border: string;
    badge: string;
    soft: string;
    chipBg: string;
    chipText: string;
}

const STAGES: StageDef[] = [
    {
        id: "New",
        title: "New",
        headerBg: "bg-slate-50",
        headerText: "text-slate-600",
        dot: "bg-slate-400",
        col: "bg-slate-50/40",
        border: "border-slate-200",
        badge: "bg-slate-100 text-slate-600",
        soft: "bg-slate-50 text-slate-700 border-slate-200",
        chipBg: "bg-slate-100",
        chipText: "text-slate-700",
    },
    {
        id: "Screening",
        title: "Screening",
        headerBg: "bg-blue-50",
        headerText: "text-blue-600",
        dot: "bg-blue-400",
        col: "bg-blue-50/40",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-700",
        soft: "bg-blue-50 text-blue-700 border-blue-200",
        chipBg: "bg-blue-100",
        chipText: "text-blue-700",
    },
    {
        id: "Interview",
        title: "Interview",
        headerBg: "bg-indigo-50",
        headerText: "text-indigo-600",
        dot: "bg-indigo-400",
        col: "bg-indigo-50/40",
        border: "border-indigo-200",
        badge: "bg-indigo-100 text-indigo-700",
        soft: "bg-indigo-50 text-indigo-700 border-indigo-200",
        chipBg: "bg-indigo-100",
        chipText: "text-indigo-700",
    },
    {
        id: "Offer",
        title: "Offer",
        headerBg: "bg-amber-50",
        headerText: "text-amber-600",
        dot: "bg-amber-400",
        col: "bg-amber-50/40",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-700",
        soft: "bg-amber-50 text-amber-700 border-amber-200",
        chipBg: "bg-amber-100",
        chipText: "text-amber-700",
    },
    {
        id: "Hired",
        title: "Hired",
        headerBg: "bg-emerald-50",
        headerText: "text-emerald-600",
        dot: "bg-emerald-400",
        col: "bg-emerald-50/40",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700",
        soft: "bg-emerald-50 text-emerald-700 border-emerald-200",
        chipBg: "bg-emerald-100",
        chipText: "text-emerald-700",
    },
    {
        id: "Rejected",
        title: "Rejected",
        headerBg: "bg-rose-50",
        headerText: "text-rose-600",
        dot: "bg-rose-400",
        col: "bg-rose-50/40",
        border: "border-rose-200",
        badge: "bg-rose-100 text-rose-700",
        soft: "bg-rose-50 text-rose-700 border-rose-200",
        chipBg: "bg-rose-100",
        chipText: "text-rose-700",
    },
];

const STAGE_ORDER: StageId[] = ["New", "Screening", "Interview", "Offer", "Hired"];

const SOURCES = [
    "LinkedIn",
    "Referral",
    "Career Page",
    "Agency",
    "Indeed",
    "Naukri",
    "Resume Parser",
    "Direct",
    "Other",
];

const COMMON_TAGS = [
    "Top Choice",
    "Immediate Joiner",
    "Referred",
    "Senior",
    "Urgent",
    "Shortlist",
    "Follow-Up",
    "Tech Review",
    "Culture Fit",
    "Hold",
];

const REJECT_REASONS = [
    "Skills Mismatch",
    "Experience Mismatch",
    "Salary Expectation",
    "Position Filled",
    "Failed Tech Round",
    "Culture Fit",
    "No Response",
    "Withdrew Application",
    "Other",
];

const EMAIL_TEMPLATES = [
    {
        id: "invite",
        name: "Interview Invitation",
        subject: "Interview Invitation — {{role}} at Fixl Solutions",
        body: "Hi {{firstName}},\n\nWe were impressed with your application for the {{role}} role and would like to invite you to an interview.\n\nPlease reply with your availability for a 45-minute conversation.\n\nBest regards,\nThe Hiring Team",
    },
    {
        id: "offer",
        name: "Offer Letter",
        subject: "Offer Letter — Welcome to Fixl Solutions, {{firstName}}",
        body: "Dear {{firstName}},\n\nWe are delighted to extend an offer for the {{role}} position.\n\nYour detailed offer letter is attached to this email. Please review and share your acceptance by {{date}}.\n\nWelcome aboard,\nThe Hiring Team",
    },
    {
        id: "rejection",
        name: "Rejection",
        subject: "Update on your application at Fixl Solutions",
        body: "Hi {{firstName}},\n\nThank you for investing your time in our hiring process for the {{role}} role. After careful consideration we have decided to move forward with other candidates whose profiles more closely match the current requirements.\n\nWe wish you the very best in your search.\n\nRegards,\nThe Hiring Team",
    },
    {
        id: "custom",
        name: "Custom",
        subject: "",
        body: "",
    },
];

const CSV_COLUMNS = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "source", label: "Source" },
    { key: "stage", label: "Stage" },
    { key: "rating", label: "Rating" },
    { key: "tags", label: "Tags" },
    { key: "parsedSkills", label: "Skills" },
    { key: "appliedDate", label: "Applied Date" },
    { key: "jobId", label: "Job ID" },
];

// ============================================================
// Small helpers
// ============================================================

const getInitials = (first: string, last: string) =>
    `${(first?.[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}`;

const stageOf = (id: StageId) => STAGES.find((s) => s.id === id) ?? STAGES[0];

const nextStageOf = (stage: StageId): StageId | null => {
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx === -1 || idx === STAGE_ORDER.length - 1) return null;
    return STAGE_ORDER[idx + 1];
};

const parseAppliedDate = (s: string): number => {
    if (!s) return 0;
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.getTime();
    // try DD/MM/YYYY
    const parts = s.split("/");
    if (parts.length === 3) {
        const d2 = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        if (!isNaN(d2.getTime())) return d2.getTime();
    }
    return 0;
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const mergeTemplate = (tpl: string, ctx: Record<string, string>) =>
    tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => ctx[k] ?? `{{${k}}}`);

// ============================================================
// Reusable small components
// ============================================================

const StarRating: React.FC<{
    value: number;
    onChange?: (v: number) => void;
    size?: number;
    readOnly?: boolean;
}> = ({ value, onChange, size = 14, readOnly }) => {
    const [hover, setHover] = useState<number>(0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => {
                const active = (hover || value) >= i;
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={readOnly}
                        onMouseEnter={() => !readOnly && setHover(i)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!readOnly) onChange?.(i === value ? 0 : i);
                        }}
                        className={`transition-transform ${readOnly ? "cursor-default" : "hover:scale-110 cursor-pointer"}`}
                        aria-label={`Rate ${i}`}
                    >
                        <Star
                            style={{ width: size, height: size }}
                            className={`${active ? "text-amber-400 fill-amber-400" : "text-slate-200"} transition-colors`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

const TagChip: React.FC<{ label: string; onRemove?: () => void; tone?: "violet" | "slate" }> = ({
    label,
    onRemove,
    tone = "slate",
}) => {
    const toneCls =
        tone === "violet"
            ? "bg-violet-50 text-violet-700 border-violet-200"
            : "bg-slate-50 text-slate-700 border-slate-200";
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${toneCls}`}
        >
            {label}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="hover:text-rose-500 transition-colors"
                    aria-label={`Remove ${label}`}
                >
                    <X className="h-2.5 w-2.5" />
                </button>
            )}
        </span>
    );
};

const SectionLabel: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({
    children,
    icon,
}) => (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {icon}
        {children}
    </div>
);

const StatCard: React.FC<{
    label: string;
    value: number | string;
    sub?: string;
    icon: React.ReactNode;
    tone: "violet" | "emerald" | "indigo" | "amber" | "rose" | "blue";
}> = ({ label, value, sub, icon, tone }) => {
    const TONE_MAP: Record<string, { iconBg: string; iconText: string; accent: string }> = {
        violet: {
            iconBg: "bg-violet-50",
            iconText: "text-violet-600",
            accent: "from-violet-500/10 to-transparent",
        },
        emerald: {
            iconBg: "bg-emerald-50",
            iconText: "text-emerald-600",
            accent: "from-emerald-500/10 to-transparent",
        },
        indigo: {
            iconBg: "bg-indigo-50",
            iconText: "text-indigo-600",
            accent: "from-indigo-500/10 to-transparent",
        },
        amber: {
            iconBg: "bg-amber-50",
            iconText: "text-amber-600",
            accent: "from-amber-500/10 to-transparent",
        },
        rose: {
            iconBg: "bg-rose-50",
            iconText: "text-rose-600",
            accent: "from-rose-500/10 to-transparent",
        },
        blue: {
            iconBg: "bg-blue-50",
            iconText: "text-blue-600",
            accent: "from-blue-500/10 to-transparent",
        },
    };
    const t = TONE_MAP[tone];
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <div
                className={`absolute inset-0 bg-gradient-to-br ${t.accent} pointer-events-none`}
            />
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {label}
                    </p>
                    <p className="mt-1.5 text-2xl font-bold text-slate-900 tracking-tight">
                        {value}
                    </p>
                    {sub && <p className="mt-1 text-[10px] text-slate-400 font-medium">{sub}</p>}
                </div>
                <div className={`h-9 w-9 rounded-xl ${t.iconBg} ${t.iconText} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// ============================================================
// Main Page
// ============================================================

const CandidatesPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jobIdParam = searchParams?.get("jobId") ?? "";
    const { toast } = useToast();

    // ------------- Store -------------
    const candidates = useHireStore((s) => s.candidates);
    const jobs = useHireStore((s) => s.jobs);
    const interviews = useHireStore((s) => s.interviews);
    const offers = useHireStore((s) => s.offers);
    const addCandidate = useHireStore((s) => s.addCandidate);
    const updateCandidate = useHireStore((s) => s.updateCandidate);
    const deleteCandidate = useHireStore((s) => s.deleteCandidate);
    const moveCandidateStage = useHireStore((s) => s.moveCandidateStage);
    const addCandidateNote = useHireStore((s) => s.addCandidateNote);

    // ------------- API actions -------------
    const loadCandidatesFromApi = useHireStore((s) => s.loadCandidatesFromApi);
    const loadJobsFromApi = useHireStore((s) => s.loadJobsFromApi);
    const candsLoading = useHireStore((s) => s.loading.candidates);
    const hasLoadedCands = useHireStore((s) => s.hasLoaded.candidates);
    const hasLoadedJobs = useHireStore((s) => s.hasLoaded.jobs);
    const updateCandidateApi = useHireStore((s) => s.updateCandidateApi);
    const deleteCandidateApi = useHireStore((s) => s.deleteCandidateApi);
    const moveCandidateStageApi = useHireStore((s) => s.moveCandidateStageApi);

    useEffect(() => {
        if (!hasLoadedCands) loadCandidatesFromApi();
        if (!hasLoadedJobs) loadJobsFromApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ------------- View / filters -------------
    const [viewMode, setViewMode] = useState<ViewMode>("kanban");
    const [search, setSearch] = useState("");
    const [stageFilter, setStageFilter] = useState<StageId[]>([]);
    const [jobFilter, setJobFilter] = useState<string[]>(jobIdParam ? [jobIdParam] : []);
    const [sourceFilter, setSourceFilter] = useState<string[]>([]);
    const [tagFilter, setTagFilter] = useState<string[]>([]);
    const [ratingMin, setRatingMin] = useState<number>(0);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [sort, setSort] = useState<SortMode>("newest");

    // ------------- Selection -------------
    const [selected, setSelected] = useState<string[]>([]);

    // ------------- Dialog state -------------
    const [addEditOpen, setAddEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [moveOpen, setMoveOpen] = useState(false);
    const [moveTargetId, setMoveTargetId] = useState<string | null>(null);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
    const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
    const [tagOpen, setTagOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [emailTargetIds, setEmailTargetIds] = useState<string[]>([]);
    const [importOpen, setImportOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

    // ------------- Initial param -------------
    useEffect(() => {
        if (jobIdParam && !jobFilter.includes(jobIdParam)) {
            setJobFilter([jobIdParam]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobIdParam]);

    // ============================================================
    // Derived
    // ============================================================

    const allTags = useMemo(() => {
        const set = new Set<string>();
        candidates.forEach((c) => (c.tags ?? []).forEach((t) => set.add(t)));
        COMMON_TAGS.forEach((t) => set.add(t));
        return Array.from(set);
    }, [candidates]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const from = dateFrom ? new Date(dateFrom).getTime() : 0;
        const to = dateTo ? new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 : Infinity;

        const list = candidates.filter((c) => {
            // Search
            if (q) {
                const hay = [
                    c.firstName,
                    c.lastName,
                    c.email,
                    ...(c.parsedSkills ?? []),
                    ...(c.tags ?? []),
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                if (!hay.includes(q)) return false;
            }
            if (stageFilter.length && !stageFilter.includes(c.stage)) return false;
            if (jobFilter.length && !jobFilter.includes(c.jobId)) return false;
            if (sourceFilter.length && !sourceFilter.includes(c.source)) return false;
            if (tagFilter.length && !tagFilter.some((t) => (c.tags ?? []).includes(t)))
                return false;
            if (c.rating < ratingMin) return false;
            const ts = parseAppliedDate(c.appliedDate);
            if (ts && (ts < from || ts > to)) return false;
            return true;
        });

        list.sort((a, b) => {
            switch (sort) {
                case "oldest":
                    return parseAppliedDate(a.appliedDate) - parseAppliedDate(b.appliedDate);
                case "rating":
                    return (b.rating ?? 0) - (a.rating ?? 0);
                case "name":
                    return `${a.firstName} ${a.lastName}`.localeCompare(
                        `${b.firstName} ${b.lastName}`
                    );
                case "newest":
                default:
                    return parseAppliedDate(b.appliedDate) - parseAppliedDate(a.appliedDate);
            }
        });
        return list;
    }, [
        candidates,
        search,
        stageFilter,
        jobFilter,
        sourceFilter,
        tagFilter,
        ratingMin,
        dateFrom,
        dateTo,
        sort,
    ]);

    const grouped = useMemo(() => {
        const map: Record<StageId, Candidate[]> = {
            New: [],
            Screening: [],
            Interview: [],
            Offer: [],
            Hired: [],
            Rejected: [],
        };
        filtered.forEach((c) => {
            map[c.stage].push(c);
        });
        return map;
    }, [filtered]);

    const stats = useMemo(() => {
        const now = Date.now();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
        const total = candidates.length;
        const newThisWeek = candidates.filter(
            (c) => parseAppliedDate(c.appliedDate) >= weekAgo
        ).length;
        const inInterview = candidates.filter((c) => c.stage === "Interview").length;
        const offerSent = candidates.filter((c) => c.stage === "Offer").length;
        const hiredYtd = candidates.filter(
            (c) => c.stage === "Hired" && parseAppliedDate(c.appliedDate) >= yearStart
        ).length;
        return { total, newThisWeek, inInterview, offerSent, hiredYtd };
    }, [candidates]);

    const activeFilterCount =
        stageFilter.length +
        jobFilter.length +
        sourceFilter.length +
        tagFilter.length +
        (ratingMin > 0 ? 1 : 0) +
        (dateFrom ? 1 : 0) +
        (dateTo ? 1 : 0);

    const clearFilters = () => {
        setStageFilter([]);
        setJobFilter([]);
        setSourceFilter([]);
        setTagFilter([]);
        setRatingMin(0);
        setDateFrom("");
        setDateTo("");
    };

    // ============================================================
    // Actions
    // ============================================================

    const toggleSelect = (id: string) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const selectAllVisible = () => {
        if (selected.length === filtered.length) setSelected([]);
        else setSelected(filtered.map((c) => c.id));
    };

    const openAdd = () => {
        setEditingId(null);
        setAddEditOpen(true);
    };
    const openEdit = (id: string) => {
        setEditingId(id);
        setAddEditOpen(true);
    };
    const openProfile = (id: string) => {
        setProfileId(id);
        setProfileOpen(true);
    };
    const openMove = (id: string) => {
        setMoveTargetId(id);
        setMoveOpen(true);
    };
    const openReject = (id: string) => {
        setRejectTargetId(id);
        setRejectOpen(true);
    };
    const openDelete = (ids: string[]) => {
        setDeleteTargetIds(ids);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            await Promise.all(deleteTargetIds.map((id) => deleteCandidateApi(id)));
            toast({
                title:
                    deleteTargetIds.length > 1
                        ? `${deleteTargetIds.length} candidates removed`
                        : "Candidate removed",
                description: "Profile(s) deleted from pipeline.",
            });
        } catch (err: any) {
            toast({
                title: "Delete failed",
                description: err?.message ?? "Could not delete candidate(s).",
                variant: "destructive",
            });
        }
        setSelected((prev) => prev.filter((x) => !deleteTargetIds.includes(x)));
        setDeleteOpen(false);
        setDeleteTargetIds([]);
        if (profileId && deleteTargetIds.includes(profileId)) {
            setProfileOpen(false);
            setProfileId(null);
        }
    };

    const handleNextStage = async (id: string) => {
        const c = candidates.find((x) => x.id === id);
        if (!c) return;
        const nxt = nextStageOf(c.stage);
        if (!nxt) return;
        try {
            await moveCandidateStageApi(id, nxt);
            toast({ title: "Stage advanced", description: `Moved to ${nxt}.` });
        } catch (err: any) {
            toast({
                title: "Stage update failed",
                description: err?.message ?? "Could not move candidate.",
                variant: "destructive",
            });
        }
    };

    const openEmail = (ids: string[]) => {
        setEmailTargetIds(ids);
        setEmailOpen(true);
    };

    // ============================================================
    // Render helpers
    // ============================================================

    const renderCandidateCard = (c: Candidate) => {
        const stage = stageOf(c.stage);
        const job = jobs.find((j) => j.id === c.jobId);
        const next = nextStageOf(c.stage);
        const isChecked = selected.includes(c.id);

        return (
            <motion.div
                key={c.id}
                layoutId={`candidate-${c.id}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="group relative rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-violet-200 transition-all cursor-pointer"
                onClick={() => openProfile(c.id)}
            >
                <div className="p-3">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                            <div
                                className={`absolute top-2 left-2 ${isChecked ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity z-10`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => toggleSelect(c.id)}
                                    className="h-3.5 w-3.5 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                                />
                            </div>
                            <Avatar className={`h-9 w-9 rounded-xl ${isChecked ? "ml-5" : ""} transition-all`}>
                                <AvatarFallback
                                    className={`${stage.chipBg} ${stage.chipText} font-semibold text-[11px] rounded-xl`}
                                >
                                    {getInitials(c.firstName, c.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-slate-900 text-[12px] leading-tight truncate">
                                    {c.firstName} {c.lastName}
                                </h4>
                                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                    {job?.title ?? "No Job"}
                                </p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button
                                    variant="ghost"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-44 rounded-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DropdownMenuItem onClick={() => openProfile(c.id)} className="text-[11px]">
                                    <Eye className="h-3.5 w-3.5 mr-2" /> View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(c.id)} className="text-[11px]">
                                    <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openMove(c.id)} className="text-[11px]">
                                    <ArrowUpDown className="h-3.5 w-3.5 mr-2" /> Move Stage
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => openReject(c.id)}
                                    className="text-[11px] text-rose-600 focus:text-rose-700"
                                >
                                    <XCircle className="h-3.5 w-3.5 mr-2" /> Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => openDelete([c.id])}
                                    className="text-[11px] text-rose-600 focus:text-rose-700"
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-2">
                        <StarRating
                            value={c.rating || 0}
                            onChange={async (v) => {
                                try {
                                    await updateCandidateApi(c.id, { rating: v });
                                    toast({ title: "Rating updated", description: `Set to ${v}.` });
                                } catch (err: any) {
                                    toast({
                                        title: "Rating failed",
                                        description: err?.message ?? "Could not update rating.",
                                        variant: "destructive",
                                    });
                                }
                            }}
                            size={12}
                        />
                        {job && (
                            <span className="text-[9px] font-medium text-slate-400 truncate max-w-[80px]">
                                {job.department}
                            </span>
                        )}
                    </div>

                    {/* Tags */}
                    {(c.tags?.length || 0) > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {c.tags.slice(0, 3).map((tag) => (
                                <TagChip key={tag} label={tag} tone="violet" />
                            ))}
                            {c.tags.length > 3 && (
                                <span className="text-[9px] text-slate-400 font-medium px-1">
                                    +{c.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Contact row */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
                        {c.email && (
                            <a
                                href={`mailto:${c.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 hover:text-violet-600 transition-colors max-w-[110px]"
                            >
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate">{c.email}</span>
                            </a>
                        )}
                        {c.phone && (
                            <a
                                href={`tel:${c.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 hover:text-violet-600 transition-colors"
                            >
                                <Phone className="h-3 w-3" />
                            </a>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                            <Badge
                                variant="outline"
                                className="text-[9px] font-medium px-1.5 h-4 rounded-md border-slate-200 bg-slate-50 text-slate-600"
                            >
                                {c.source}
                            </Badge>
                            <span className="text-[9px] text-slate-400 font-medium">
                                {c.appliedDate}
                            </span>
                        </div>
                        {next && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextStage(c.id);
                                }}
                                className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-violet-600 hover:text-violet-700 hover:bg-violet-50 px-1.5 py-0.5 rounded-md transition-all"
                            >
                                {next} <ChevronRight className="h-2.5 w-2.5" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    // ============================================================
    // Render
    // ============================================================

    return (
        <div className="flex-1 min-h-screen bg-slate-50/40 font-sans">
            <div className="p-4 md:p-6 space-y-4 max-w-[1800px] mx-auto">
                {/* ========== Header ========== */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <Users className="h-5 w-5 text-violet-600" />
                            Candidates
                            {jobIdParam && (
                                <Badge
                                    variant="outline"
                                    className="ml-2 bg-violet-50 border-violet-200 text-violet-700 font-medium text-[10px] rounded-md"
                                >
                                    Filtered by Job
                                </Badge>
                            )}
                        </h1>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Manage your talent pipeline across all hiring stages.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* View toggle */}
                        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white shadow-sm p-0.5">
                            {(
                                [
                                    { id: "kanban", icon: LayoutGrid, label: "Kanban" },
                                    { id: "table", icon: Table2, label: "Table" },
                                    { id: "list", icon: List, label: "List" },
                                ] as { id: ViewMode; icon: any; label: string }[]
                            ).map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setViewMode(id)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${viewMode === id
                                            ? "bg-violet-600 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                        }`}
                                    aria-label={label}
                                >
                                    <Icon className="h-3 w-3" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => router.push("/hrmcubicle/hire/resume-parser")}
                            className="h-8 rounded-xl border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-violet-500" /> Parse Resume
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setImportOpen(true)}
                            className="h-8 rounded-xl border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Upload className="h-3.5 w-3.5 mr-1.5" /> Import
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setExportOpen(true)}
                            className="h-8 rounded-xl border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" /> Export
                        </Button>
                        <Button
                            onClick={openAdd}
                            className="h-8 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                            <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Add Candidate
                        </Button>
                    </div>
                </div>

                {/* ========== Stats ========== */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <StatCard
                        label="Total Pipeline"
                        value={stats.total}
                        sub="All stages"
                        icon={<Users className="h-4 w-4" />}
                        tone="violet"
                    />
                    <StatCard
                        label="New this week"
                        value={stats.newThisWeek}
                        sub="Last 7 days"
                        icon={<UserPlus className="h-4 w-4" />}
                        tone="blue"
                    />
                    <StatCard
                        label="In Interview"
                        value={stats.inInterview}
                        sub="Active rounds"
                        icon={<Calendar className="h-4 w-4" />}
                        tone="indigo"
                    />
                    <StatCard
                        label="Offer Sent"
                        value={stats.offerSent}
                        sub="Awaiting response"
                        icon={<Send className="h-4 w-4" />}
                        tone="amber"
                    />
                    <StatCard
                        label="Hired YTD"
                        value={stats.hiredYtd}
                        sub={`Year ${new Date().getFullYear()}`}
                        icon={<CheckCircle2 className="h-4 w-4" />}
                        tone="emerald"
                    />
                </div>

                {/* ========== Search + Filter + Sort ========== */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, skill or tag..."
                            className="pl-9 h-9 rounded-xl border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700 focus-visible:ring-2 focus-visible:ring-violet-200"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Filter popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-9 rounded-xl border-slate-200 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 gap-1.5"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                                    {activeFilterCount > 0 && (
                                        <Badge className="ml-1 h-4 px-1.5 bg-violet-600 text-white text-[9px] rounded-md">
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="end"
                                className="w-[380px] rounded-2xl border border-slate-200 shadow-xl p-0"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                        Filter candidates
                                    </div>
                                    {activeFilterCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="text-[10px] font-semibold text-violet-600 hover:text-violet-700"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                <ScrollArea className="max-h-[480px]">
                                    <div className="p-4 space-y-5">
                                        {/* Stage */}
                                        <div>
                                            <SectionLabel icon={<Tag className="h-3 w-3" />}>
                                                Stage
                                            </SectionLabel>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {STAGES.map((s) => {
                                                    const active = stageFilter.includes(s.id);
                                                    return (
                                                        <button
                                                            key={s.id}
                                                            type="button"
                                                            onClick={() =>
                                                                setStageFilter((p) =>
                                                                    active
                                                                        ? p.filter((x) => x !== s.id)
                                                                        : [...p, s.id]
                                                                )
                                                            }
                                                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all border ${active
                                                                    ? `${s.chipBg} ${s.chipText} ${s.border}`
                                                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                                                }`}
                                                        >
                                                            {s.title}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Jobs */}
                                        <div>
                                            <SectionLabel icon={<Briefcase className="h-3 w-3" />}>
                                                Job Role
                                            </SectionLabel>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {jobs.map((j) => {
                                                    const active = jobFilter.includes(j.id);
                                                    return (
                                                        <button
                                                            key={j.id}
                                                            type="button"
                                                            onClick={() =>
                                                                setJobFilter((p) =>
                                                                    active
                                                                        ? p.filter((x) => x !== j.id)
                                                                        : [...p, j.id]
                                                                )
                                                            }
                                                            className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all border ${active
                                                                    ? "bg-violet-50 text-violet-700 border-violet-200"
                                                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                                }`}
                                                        >
                                                            {j.title}
                                                        </button>
                                                    );
                                                })}
                                                {jobs.length === 0 && (
                                                    <span className="text-[10px] text-slate-400 italic">
                                                        No jobs yet
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Source */}
                                        <div>
                                            <SectionLabel icon={<Globe className="h-3 w-3" />}>
                                                Source
                                            </SectionLabel>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {SOURCES.map((src) => {
                                                    const active = sourceFilter.includes(src);
                                                    return (
                                                        <button
                                                            key={src}
                                                            type="button"
                                                            onClick={() =>
                                                                setSourceFilter((p) =>
                                                                    active
                                                                        ? p.filter((x) => x !== src)
                                                                        : [...p, src]
                                                                )
                                                            }
                                                            className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all border ${active
                                                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                                }`}
                                                        >
                                                            {src}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div>
                                            <SectionLabel icon={<Star className="h-3 w-3" />}>
                                                Min Rating: {ratingMin.toFixed(1)}
                                            </SectionLabel>
                                            <div className="mt-3 px-1">
                                                <Slider
                                                    value={[ratingMin]}
                                                    min={0}
                                                    max={5}
                                                    step={0.5}
                                                    onValueChange={(v) => setRatingMin(v[0])}
                                                />
                                                <div className="flex justify-between text-[9px] text-slate-400 mt-1.5">
                                                    <span>0</span>
                                                    <span>5</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <SectionLabel icon={<Tag className="h-3 w-3" />}>
                                                Tags
                                            </SectionLabel>
                                            <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto">
                                                {allTags.map((t) => {
                                                    const active = tagFilter.includes(t);
                                                    return (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            onClick={() =>
                                                                setTagFilter((p) =>
                                                                    active
                                                                        ? p.filter((x) => x !== t)
                                                                        : [...p, t]
                                                                )
                                                            }
                                                            className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all border ${active
                                                                    ? "bg-violet-50 text-violet-700 border-violet-200"
                                                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                                }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Date range */}
                                        <div>
                                            <SectionLabel icon={<Calendar className="h-3 w-3" />}>
                                                Applied Date
                                            </SectionLabel>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <Input
                                                    type="date"
                                                    value={dateFrom}
                                                    onChange={(e) => setDateFrom(e.target.value)}
                                                    className="h-8 rounded-lg text-[10px] border-slate-200"
                                                />
                                                <Input
                                                    type="date"
                                                    value={dateTo}
                                                    onChange={(e) => setDateTo(e.target.value)}
                                                    className="h-8 rounded-lg text-[10px] border-slate-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>

                        {/* Sort */}
                        <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
                            <SelectTrigger className="w-[150px] h-9 rounded-xl border-slate-200 bg-white text-[11px] font-semibold text-slate-700">
                                <ArrowUpDown className="h-3 w-3 mr-1 text-slate-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="newest" className="text-[11px]">
                                    Newest first
                                </SelectItem>
                                <SelectItem value="oldest" className="text-[11px]">
                                    Oldest first
                                </SelectItem>
                                <SelectItem value="rating" className="text-[11px]">
                                    Highest rated
                                </SelectItem>
                                <SelectItem value="name" className="text-[11px]">
                                    Name A-Z
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 pl-1">
                            {filtered.length} result{filtered.length === 1 ? "" : "s"}
                        </div>
                    </div>
                </div>

                {/* ========== Active filter chips ========== */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                        {stageFilter.map((s) => (
                            <TagChip
                                key={`sf-${s}`}
                                label={`Stage: ${s}`}
                                tone="violet"
                                onRemove={() =>
                                    setStageFilter((p) => p.filter((x) => x !== s))
                                }
                            />
                        ))}
                        {jobFilter.map((j) => {
                            const job = jobs.find((x) => x.id === j);
                            return (
                                <TagChip
                                    key={`jf-${j}`}
                                    label={`Job: ${job?.title ?? j}`}
                                    tone="violet"
                                    onRemove={() =>
                                        setJobFilter((p) => p.filter((x) => x !== j))
                                    }
                                />
                            );
                        })}
                        {sourceFilter.map((s) => (
                            <TagChip
                                key={`sr-${s}`}
                                label={`Source: ${s}`}
                                tone="violet"
                                onRemove={() =>
                                    setSourceFilter((p) => p.filter((x) => x !== s))
                                }
                            />
                        ))}
                        {tagFilter.map((t) => (
                            <TagChip
                                key={`tg-${t}`}
                                label={`Tag: ${t}`}
                                tone="violet"
                                onRemove={() => setTagFilter((p) => p.filter((x) => x !== t))}
                            />
                        ))}
                        {ratingMin > 0 && (
                            <TagChip
                                label={`Rating ≥ ${ratingMin}`}
                                tone="violet"
                                onRemove={() => setRatingMin(0)}
                            />
                        )}
                        {dateFrom && (
                            <TagChip
                                label={`From ${dateFrom}`}
                                tone="violet"
                                onRemove={() => setDateFrom("")}
                            />
                        )}
                        {dateTo && (
                            <TagChip
                                label={`To ${dateTo}`}
                                tone="violet"
                                onRemove={() => setDateTo("")}
                            />
                        )}
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-[10px] font-semibold text-slate-500 hover:text-violet-600 px-2 py-0.5 rounded-full hover:bg-violet-50 transition-all"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* ========== Views ========== */}
                {viewMode === "kanban" && (
                    <div className="overflow-x-auto pb-2">
                        <div className="flex gap-3 min-w-max">
                            {STAGES.map((stage) => {
                                const list = grouped[stage.id] ?? [];
                                return (
                                    <div
                                        key={stage.id}
                                        className="w-[290px] flex flex-col"
                                    >
                                        {/* Column header */}
                                        <div
                                            className={`rounded-t-2xl px-3 py-2 ${stage.headerBg} border ${stage.border} border-b-0 flex items-center justify-between`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`h-1.5 w-1.5 rounded-full ${stage.dot}`} />
                                                <span
                                                    className={`text-[10px] font-bold uppercase tracking-wider ${stage.headerText}`}
                                                >
                                                    {stage.title}
                                                </span>
                                                <Badge
                                                    className={`${stage.badge} border-0 h-4 px-1.5 rounded-md text-[9px] font-semibold`}
                                                >
                                                    {list.length}
                                                </Badge>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={openAdd}
                                                className={`h-5 w-5 rounded-md flex items-center justify-center ${stage.headerText} hover:bg-white/80 transition-colors`}
                                                aria-label="Add candidate"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>

                                        {/* Column body */}
                                        <div
                                            className={`flex-1 min-h-[480px] max-h-[calc(100vh-340px)] overflow-y-auto ${stage.col} rounded-b-2xl border ${stage.border} border-t-0 p-2 space-y-2`}
                                        >
                                            <AnimatePresence>
                                                {list.map((c) => renderCandidateCard(c))}
                                            </AnimatePresence>
                                            {list.length === 0 && (
                                                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                                    <div className="h-10 w-10 rounded-full bg-white/60 flex items-center justify-center mb-2">
                                                        <Users className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-[10px] font-medium">
                                                        No candidates
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {viewMode === "table" && (
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/60">
                                    <TableRow className="hover:bg-transparent border-slate-200">
                                        <TableHead className="w-8 pl-4">
                                            <Checkbox
                                                checked={
                                                    filtered.length > 0 &&
                                                    selected.length === filtered.length
                                                }
                                                onCheckedChange={selectAllVisible}
                                                className="h-3.5 w-3.5 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                                            />
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            Candidate
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            Applying For
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            Stage
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            Rating
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            Source
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            Tags
                                        </TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            Applied
                                        </TableHead>
                                        <TableHead className="text-right pr-4" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((c) => {
                                        const job = jobs.find((j) => j.id === c.jobId);
                                        const stage = stageOf(c.stage);
                                        const isChecked = selected.includes(c.id);
                                        return (
                                            <TableRow
                                                key={c.id}
                                                className="group cursor-pointer border-slate-100 hover:bg-violet-50/30"
                                                onClick={() => openProfile(c.id)}
                                            >
                                                <TableCell
                                                    className="pl-4"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={() => toggleSelect(c.id)}
                                                        className="h-3.5 w-3.5 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-2.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar className="h-8 w-8 rounded-lg">
                                                            <AvatarFallback
                                                                className={`${stage.chipBg} ${stage.chipText} font-semibold text-[10px] rounded-lg`}
                                                            >
                                                                {getInitials(c.firstName, c.lastName)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-semibold text-slate-900">
                                                                {c.firstName} {c.lastName}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 font-medium">
                                                                {c.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-[11px] font-medium text-slate-700">
                                                    {job?.title ?? "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`${stage.soft} border text-[9px] font-semibold uppercase tracking-wider h-5 rounded-md`}
                                                    >
                                                        {stage.title}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <StarRating
                                                        value={c.rating}
                                                        size={12}
                                                        onChange={(v) =>
                                                            updateCandidateApi(c.id, { rating: v })
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[9px] font-medium border-slate-200 bg-slate-50 text-slate-600 h-5 rounded-md"
                                                    >
                                                        {c.source}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {(c.tags ?? []).slice(0, 2).map((t) => (
                                                            <TagChip key={t} label={t} tone="violet" />
                                                        ))}
                                                        {(c.tags?.length ?? 0) > 2 && (
                                                            <span className="text-[9px] text-slate-400 font-medium">
                                                                +{(c.tags?.length ?? 0) - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-[10px] text-slate-500 font-medium">
                                                    {c.appliedDate}
                                                </TableCell>
                                                <TableCell
                                                    className="pr-4 text-right"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700"
                                                            >
                                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-44 rounded-xl"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => openProfile(c.id)}
                                                                className="text-[11px]"
                                                            >
                                                                <Eye className="h-3.5 w-3.5 mr-2" /> View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => openEdit(c.id)}
                                                                className="text-[11px]"
                                                            >
                                                                <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => openMove(c.id)}
                                                                className="text-[11px]"
                                                            >
                                                                <ArrowUpDown className="h-3.5 w-3.5 mr-2" />{" "}
                                                                Move Stage
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => openReject(c.id)}
                                                                className="text-[11px] text-rose-600"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5 mr-2" />{" "}
                                                                Reject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => openDelete([c.id])}
                                                                className="text-[11px] text-rose-600"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5 mr-2" />{" "}
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} className="py-10 text-center">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Users className="h-6 w-6" />
                                                    <p className="text-[11px] font-medium">
                                                        No candidates found
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}

                {viewMode === "list" && (
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="divide-y divide-slate-100">
                            {filtered.map((c) => {
                                const job = jobs.find((j) => j.id === c.jobId);
                                const stage = stageOf(c.stage);
                                const isChecked = selected.includes(c.id);
                                return (
                                    <div
                                        key={c.id}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50/30 transition-colors cursor-pointer group"
                                        onClick={() => openProfile(c.id)}
                                    >
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={() => toggleSelect(c.id)}
                                                className="h-3.5 w-3.5 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                                            />
                                        </div>
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarFallback
                                                className={`${stage.chipBg} ${stage.chipText} font-semibold text-[10px] rounded-lg`}
                                            >
                                                {getInitials(c.firstName, c.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[12px] font-semibold text-slate-900 truncate">
                                                    {c.firstName} {c.lastName}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-medium truncate">
                                                    · {job?.title ?? "No job"}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge
                                            className={`${stage.soft} border text-[9px] font-semibold uppercase tracking-wider h-5 rounded-md`}
                                        >
                                            {stage.title}
                                        </Badge>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <StarRating
                                                value={c.rating}
                                                size={12}
                                                onChange={(v) => updateCandidateApi(c.id, { rating: v })}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium hidden md:block w-20 text-right">
                                            {c.appliedDate}
                                        </span>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 rounded-xl">
                                                    <DropdownMenuItem
                                                        onClick={() => openEdit(c.id)}
                                                        className="text-[11px]"
                                                    >
                                                        <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openMove(c.id)}
                                                        className="text-[11px]"
                                                    >
                                                        <ArrowUpDown className="h-3.5 w-3.5 mr-2" /> Move
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => openReject(c.id)}
                                                        className="text-[11px] text-rose-600"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5 mr-2" /> Reject
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDelete([c.id])}
                                                        className="text-[11px] text-rose-600"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                );
                            })}
                            {filtered.length === 0 && (
                                <div className="flex flex-col items-center gap-2 text-slate-400 py-10">
                                    <Users className="h-6 w-6" />
                                    <p className="text-[11px] font-medium">No candidates</p>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {/* ============================================================
                Bulk action bar
            ============================================================ */}
            <AnimatePresence>
                {selected.length > 0 && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 flex items-center gap-1 p-1.5 pr-2"
                    >
                        <div className="px-3 py-1.5 text-[11px] font-semibold">
                            {selected.length} selected
                        </div>
                        <Separator orientation="vertical" className="h-5 bg-slate-700" />
                        <Button
                            variant="ghost"
                            onClick={() => setBulkMoveOpen(true)}
                            className="h-7 rounded-lg text-[10px] font-semibold text-white hover:bg-slate-800 px-2"
                        >
                            <ArrowUpDown className="h-3 w-3 mr-1" /> Move
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setTagOpen(true)}
                            className="h-7 rounded-lg text-[10px] font-semibold text-white hover:bg-slate-800 px-2"
                        >
                            <Tag className="h-3 w-3 mr-1" /> Tag
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => openEmail(selected)}
                            className="h-7 rounded-lg text-[10px] font-semibold text-white hover:bg-slate-800 px-2"
                        >
                            <Mail className="h-3 w-3 mr-1" /> Email
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={async () => {
                                try {
                                    await Promise.all(
                                        selected.map((id) => moveCandidateStageApi(id, "Rejected"))
                                    );
                                    toast({
                                        title: "Rejected",
                                        description: `${selected.length} candidates rejected.`,
                                    });
                                    setSelected([]);
                                } catch (err: any) {
                                    toast({
                                        title: "Reject failed",
                                        description: err?.message ?? "Could not reject candidates.",
                                        variant: "destructive",
                                    });
                                }
                            }}
                            className="h-7 rounded-lg text-[10px] font-semibold text-rose-300 hover:bg-rose-500/10 px-2"
                        >
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => openDelete(selected)}
                            className="h-7 rounded-lg text-[10px] font-semibold text-rose-300 hover:bg-rose-500/10 px-2"
                        >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                        <Separator orientation="vertical" className="h-5 bg-slate-700" />
                        <Button
                            variant="ghost"
                            onClick={() => setSelected([])}
                            className="h-7 rounded-lg text-[10px] font-semibold text-slate-300 hover:bg-slate-800 px-2"
                        >
                            <X className="h-3 w-3 mr-1" /> Clear
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ============================================================
                DIALOGS
            ============================================================ */}
            <AddEditCandidateDialog
                open={addEditOpen}
                onOpenChange={setAddEditOpen}
                editingId={editingId}
                defaultJobId={jobIdParam}
            />
            <CandidateProfileSheet
                open={profileOpen}
                onOpenChange={(o) => {
                    setProfileOpen(o);
                    if (!o) setProfileId(null);
                }}
                candidateId={profileId}
                onEdit={() => {
                    if (profileId) openEdit(profileId);
                }}
                onMove={() => {
                    if (profileId) openMove(profileId);
                }}
                onReject={() => {
                    if (profileId) openReject(profileId);
                }}
                onDelete={() => {
                    if (profileId) openDelete([profileId]);
                }}
            />
            <MoveStageDialog
                open={moveOpen}
                onOpenChange={setMoveOpen}
                candidateId={moveTargetId}
            />
            <RejectDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                candidateId={rejectTargetId}
            />
            <BulkMoveDialog
                open={bulkMoveOpen}
                onOpenChange={(o) => {
                    setBulkMoveOpen(o);
                    if (!o) setSelected([]);
                }}
                candidateIds={selected}
            />
            <AddTagDialog
                open={tagOpen}
                onOpenChange={(o) => {
                    setTagOpen(o);
                }}
                candidateIds={selected}
                existingTags={allTags}
            />
            <SendEmailDialog
                open={emailOpen}
                onOpenChange={setEmailOpen}
                candidateIds={emailTargetIds}
            />
            <ImportCsvDialog open={importOpen} onOpenChange={setImportOpen} />
            <ExportCsvDialog
                open={exportOpen}
                onOpenChange={setExportOpen}
                candidates={filtered}
            />
            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                ids={deleteTargetIds}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default CandidatesPage;

// ============================================================
// Dialog 1: Add/Edit Candidate
// ============================================================

const AddEditCandidateDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    editingId: string | null;
    defaultJobId?: string;
}> = ({ open, onOpenChange, editingId, defaultJobId }) => {
    const candidates = useHireStore((s) => s.candidates);
    const jobs = useHireStore((s) => s.jobs);
    const addCandidate = useHireStore((s) => s.addCandidate);
    const updateCandidate = useHireStore((s) => s.updateCandidate);
    const addCandidateApi = useHireStore((s) => s.addCandidateApi);
    const updateCandidateApi = useHireStore((s) => s.updateCandidateApi);
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    const editing = editingId ? candidates.find((c) => c.id === editingId) : null;

    const [tab, setTab] = useState<"personal" | "professional" | "stage">("personal");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [jobId, setJobId] = useState("");
    const [source, setSource] = useState("LinkedIn");
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [resumeName, setResumeName] = useState("");
    const [resumeSize, setResumeSize] = useState(0);
    const [stage, setStage] = useState<StageId>("New");
    const [notes, setNotes] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!open) return;
        if (editing) {
            setFirstName(editing.firstName);
            setLastName(editing.lastName);
            setEmail(editing.email);
            setPhone(editing.phone);
            setLocation(editing.location ?? "");
            setJobId(editing.jobId);
            setSource(editing.source);
            setSkills(editing.parsedSkills ?? []);
            setTags(editing.tags ?? []);
            setResumeUrl(editing.resumeUrl ?? "");
            setResumeName(editing.resumeUrl ? "existing-resume.pdf" : "");
            setResumeSize(0);
            setStage(editing.stage);
            setNotes("");
        } else {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setLocation("");
            setJobId(defaultJobId ?? "");
            setSource("LinkedIn");
            setSkills([]);
            setTags([]);
            setResumeUrl("");
            setResumeName("");
            setResumeSize(0);
            setStage("New");
            setNotes("");
        }
        setSkillInput("");
        setTagInput("");
        setEmailTouched(false);
        setTab("personal");
    }, [open, editing, defaultJobId]);

    const duplicate = useMemo(() => {
        if (!email) return null;
        return candidates.find(
            (c) => c.email.toLowerCase() === email.toLowerCase() && c.id !== editingId
        );
    }, [email, candidates, editingId]);

    const emailError =
        emailTouched && email && !isEmail(email) ? "Please enter a valid email." : null;

    const addChip = (value: string, list: string[], set: (v: string[]) => void, clear: () => void) => {
        const v = value.trim();
        if (!v) return;
        if (list.includes(v)) return;
        set([...list, v]);
        clear();
    };

    const onFile = (f: File | null) => {
        if (!f) return;
        const url = URL.createObjectURL(f);
        setResumeUrl(url);
        setResumeName(f.name);
        setResumeSize(f.size);
    };

    const canSave =
        firstName.trim() &&
        email.trim() &&
        isEmail(email) &&
        jobId &&
        (!duplicate || editing);

    const handleSave = async () => {
        // Zod validation — runs before API call
        const result = candidateFormSchema.safeParse({
            firstName,
            lastName,
            email,
            phone,
            jobId,
            source,
            location,
            tags,
        });
        if (!result.success) {
            const firstError = result.error.errors[0];
            toast({
                title: "Validation failed",
                description: firstError.message,
                variant: "destructive",
            });
            return;
        }
        if (duplicate && !editing) {
            toast({
                title: "Duplicate email",
                description: "A candidate with this email already exists.",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);
        try {
            if (editing) {
                await updateCandidateApi(editing.id, {
                    firstName,
                    lastName,
                    email,
                    phone,
                    location,
                    jobId,
                    source,
                    parsedSkills: skills,
                    tags,
                    resumeUrl: resumeUrl || undefined,
                    stage,
                });
                toast({
                    title: "Candidate updated",
                    description: `${firstName} ${lastName}'s profile saved.`,
                });
            } else {
                const created = await addCandidateApi({
                    jobId,
                    firstName,
                    lastName,
                    email,
                    phone,
                    location,
                    source,
                    resumeUrl: resumeUrl || undefined,
                    skills,
                    tags,
                    stage,
                });
                if (!created) {
                    toast({
                        title: "Create failed",
                        description: "Could not add candidate. Please try again.",
                        variant: "destructive",
                    });
                    setSaving(false);
                    return;
                }
                toast({
                    title: "Candidate added",
                    description: `${firstName} joined the ${stage} stage.`,
                });
            }
            onOpenChange(false);
        } catch (err: any) {
            toast({
                title: editing ? "Update failed" : "Create failed",
                description: err?.message ?? "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden border-slate-200 bg-white shadow-2xl">
                <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100">
                    <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                        {editing ? "Edit candidate" : "Add new candidate"}
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        {editing
                            ? "Update candidate information across personal, professional, and stage tabs."
                            : "Create a new candidate entry and choose the starting stage."}
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="flex-1">
                    <div className="px-6 pt-3 border-b border-slate-100">
                        <TabsList className="bg-transparent h-9 p-0 gap-5">
                            <TabsTrigger
                                value="personal"
                                className="px-0 h-full rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[11px] font-semibold text-slate-500"
                            >
                                Personal
                            </TabsTrigger>
                            <TabsTrigger
                                value="professional"
                                className="px-0 h-full rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[11px] font-semibold text-slate-500"
                            >
                                Professional
                            </TabsTrigger>
                            <TabsTrigger
                                value="stage"
                                className="px-0 h-full rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[11px] font-semibold text-slate-500"
                            >
                                Initial Stage
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="max-h-[60vh]">
                        <TabsContent value="personal" className="px-6 py-5 mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        First name *
                                    </Label>
                                    <Input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Jane"
                                        className="h-9 rounded-lg border-slate-200 text-[11px]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Last name
                                    </Label>
                                    <Input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Doe"
                                        className="h-9 rounded-lg border-slate-200 text-[11px]"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Email *
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                        <Input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onBlur={() => setEmailTouched(true)}
                                            type="email"
                                            placeholder="jane@example.com"
                                            className="h-9 rounded-lg border-slate-200 text-[11px] pl-9"
                                        />
                                    </div>
                                    {emailError && (
                                        <p className="text-[10px] text-rose-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> {emailError}
                                        </p>
                                    )}
                                    {duplicate && !editing && (
                                        <p className="text-[10px] text-amber-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            Duplicate: {duplicate.firstName} {duplicate.lastName} already
                                            exists.
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Phone
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+91 98765 43210"
                                            className="h-9 rounded-lg border-slate-200 text-[11px] pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Location
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                        <Input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="City, Country"
                                            className="h-9 rounded-lg border-slate-200 text-[11px] pl-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="professional" className="px-6 py-5 mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Applying for *
                                    </Label>
                                    <Select value={jobId} onValueChange={setJobId}>
                                        <SelectTrigger className="h-9 rounded-lg border-slate-200 text-[11px]">
                                            <SelectValue placeholder="Select job" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {jobs.map((j) => (
                                                <SelectItem
                                                    key={j.id}
                                                    value={j.id}
                                                    className="text-[11px]"
                                                >
                                                    {j.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Source
                                    </Label>
                                    <Select value={source} onValueChange={setSource}>
                                        <SelectTrigger className="h-9 rounded-lg border-slate-200 text-[11px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {SOURCES.map((s) => (
                                                <SelectItem key={s} value={s} className="text-[11px]">
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Skills
                                    </Label>
                                    <div className="rounded-lg border border-slate-200 bg-white p-2 flex flex-wrap gap-1.5">
                                        {skills.map((s) => (
                                            <TagChip
                                                key={s}
                                                label={s}
                                                tone="violet"
                                                onRemove={() =>
                                                    setSkills((p) => p.filter((x) => x !== s))
                                                }
                                            />
                                        ))}
                                        <input
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === ",") {
                                                    e.preventDefault();
                                                    addChip(skillInput, skills, setSkills, () =>
                                                        setSkillInput("")
                                                    );
                                                }
                                            }}
                                            placeholder="Type skill + Enter"
                                            className="flex-1 min-w-[140px] text-[11px] bg-transparent outline-none px-1"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Tags
                                    </Label>
                                    <div className="rounded-lg border border-slate-200 bg-white p-2 flex flex-wrap gap-1.5">
                                        {tags.map((t) => (
                                            <TagChip
                                                key={t}
                                                label={t}
                                                tone="violet"
                                                onRemove={() =>
                                                    setTags((p) => p.filter((x) => x !== t))
                                                }
                                            />
                                        ))}
                                        <input
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === ",") {
                                                    e.preventDefault();
                                                    addChip(tagInput, tags, setTags, () => setTagInput(""));
                                                }
                                            }}
                                            placeholder="Type tag + Enter"
                                            className="flex-1 min-w-[140px] text-[11px] bg-transparent outline-none px-1"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        {COMMON_TAGS.filter((t) => !tags.includes(t))
                                            .slice(0, 6)
                                            .map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setTags((p) => [...p, t])}
                                                    className="text-[10px] px-2 py-0.5 rounded-full border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50"
                                                >
                                                    + {t}
                                                </button>
                                            ))}
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Resume
                                    </Label>
                                    <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                                        />
                                        {resumeName ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center">
                                                    <FileText className="h-4 w-4 text-violet-600" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-[11px] font-semibold text-slate-800 truncate">
                                                        {resumeName}
                                                    </p>
                                                    {resumeSize > 0 && (
                                                        <p className="text-[10px] text-slate-500">
                                                            {formatFileSize(resumeSize)}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setResumeUrl("");
                                                        setResumeName("");
                                                        setResumeSize(0);
                                                        if (fileRef.current) fileRef.current.value = "";
                                                    }}
                                                    className="h-7 text-[10px] text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => fileRef.current?.click()}
                                                className="w-full flex flex-col items-center gap-1.5 py-2 text-slate-500 hover:text-violet-600 transition-colors"
                                            >
                                                <Upload className="h-5 w-5" />
                                                <span className="text-[11px] font-semibold">
                                                    Click to upload resume
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    PDF, DOC, DOCX
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="stage" className="px-6 py-5 mt-0">
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-[11px] font-semibold text-slate-600 mb-2 block">
                                        Initial stage
                                    </Label>
                                    <RadioGroup
                                        value={stage}
                                        onValueChange={(v) => setStage(v as StageId)}
                                        className="grid grid-cols-2 gap-2"
                                    >
                                        {STAGES.map((s) => (
                                            <label
                                                key={s.id}
                                                htmlFor={`stg-${s.id}`}
                                                className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${stage === s.id
                                                        ? `${s.soft} border`
                                                        : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <RadioGroupItem value={s.id} id={`stg-${s.id}`} />
                                                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                                                <span className="text-[11px] font-semibold">
                                                    {s.title}
                                                </span>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-600">
                                        Initial notes
                                    </Label>
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any initial screening notes or context..."
                                        className="min-h-[100px] rounded-lg border-slate-200 text-[11px]"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>

                <DialogFooter className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!canSave || saving}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold disabled:opacity-50"
                    >
                        {saving ? "Saving..." : editing ? "Save changes" : "Add candidate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================
// Dialog 2: Candidate Profile Sheet
// ============================================================

const CandidateProfileSheet: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    candidateId: string | null;
    onEdit: () => void;
    onMove: () => void;
    onReject: () => void;
    onDelete: () => void;
}> = ({ open, onOpenChange, candidateId, onEdit, onMove, onReject, onDelete }) => {
    const router = useRouter();
    const { toast } = useToast();
    const candidates = useHireStore((s) => s.candidates);
    const jobs = useHireStore((s) => s.jobs);
    const interviews = useHireStore((s) => s.interviews);
    const offers = useHireStore((s) => s.offers);
    const updateCandidate = useHireStore((s) => s.updateCandidate);
    const updateCandidateApi = useHireStore((s) => s.updateCandidateApi);
    const addCandidateNote = useHireStore((s) => s.addCandidateNote);

    const candidate = candidateId ? candidates.find((c) => c.id === candidateId) : null;
    const [noteText, setNoteText] = useState("");
    const [tab, setTab] = useState("overview");

    if (!candidate) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-[60vw] p-0">
                    <div className="p-6 text-slate-400 text-[11px]">No candidate selected.</div>
                </SheetContent>
            </Sheet>
        );
    }

    const stage = stageOf(candidate.stage);
    const job = jobs.find((j) => j.id === candidate.jobId);
    const candidateInterviews = interviews.filter((i) => i.candidateId === candidate.id);
    const candidateOffers = offers.filter((o) => o.candidateId === candidate.id);

    const handleAddNote = () => {
        if (!noteText.trim()) return;
        addCandidateNote(candidate.id, noteText.trim());
        toast({ title: "Note added" });
        setNoteText("");
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[60vw] p-0 bg-white border-l border-slate-200">
                {/* Header */}
                <SheetHeader className="p-0">
                    <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-violet-50/60 to-white">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <Avatar className="h-14 w-14 rounded-2xl">
                                    <AvatarFallback
                                        className={`${stage.chipBg} ${stage.chipText} font-bold text-base rounded-2xl`}
                                    >
                                        {getInitials(candidate.firstName, candidate.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight truncate">
                                        {candidate.firstName} {candidate.lastName}
                                    </SheetTitle>
                                    <SheetDescription className="text-[11px] text-slate-500 font-medium">
                                        {job?.title ?? "No role"} · {candidate.source}
                                    </SheetDescription>
                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        <Badge
                                            className={`${stage.soft} border text-[9px] font-semibold uppercase tracking-wider h-5 rounded-md`}
                                        >
                                            {stage.title}
                                        </Badge>
                                        <StarRating
                                            value={candidate.rating}
                                            size={12}
                                            onChange={(v) =>
                                                updateCandidateApi(candidate.id, { rating: v })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                <Button
                                    variant="outline"
                                    onClick={onMove}
                                    className="h-8 rounded-lg text-[10px] font-semibold border-slate-200"
                                >
                                    <ArrowUpDown className="h-3 w-3 mr-1" /> Move
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        router.push(
                                            `/hrmcubicle/hire/interviews?candidateId=${candidate.id}`
                                        )
                                    }
                                    className="h-8 rounded-lg text-[10px] font-semibold border-slate-200"
                                >
                                    <Calendar className="h-3 w-3 mr-1" /> Schedule
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        router.push(
                                            `/hrmcubicle/hire/offers?candidateId=${candidate.id}`
                                        )
                                    }
                                    className="h-8 rounded-lg text-[10px] font-semibold border-slate-200"
                                >
                                    <FileText className="h-3 w-3 mr-1" /> Offer
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0 rounded-lg border-slate-200"
                                        >
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44 rounded-xl">
                                        <DropdownMenuItem onClick={onEdit} className="text-[11px]">
                                            <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={onReject}
                                            className="text-[11px] text-rose-600"
                                        >
                                            <XCircle className="h-3.5 w-3.5 mr-2" /> Reject
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={onDelete}
                                            className="text-[11px] text-rose-600"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                {/* Tabs */}
                <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col h-[calc(100vh-130px)]">
                    <div className="px-5 border-b border-slate-100">
                        <TabsList className="bg-transparent h-10 p-0 gap-5">
                            {[
                                { id: "overview", icon: Eye, label: "Overview" },
                                { id: "activity", icon: Activity, label: "Activity" },
                                { id: "notes", icon: MessageSquare, label: "Notes" },
                                { id: "interviews", icon: Calendar, label: "Interviews" },
                                { id: "offers", icon: FileText, label: "Offers" },
                            ].map(({ id, icon: Icon, label }) => (
                                <TabsTrigger
                                    key={id}
                                    value={id}
                                    className="px-0 h-full rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[11px] font-semibold text-slate-500"
                                >
                                    <Icon className="h-3.5 w-3.5 mr-1.5" /> {label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1">
                        {/* Overview */}
                        <TabsContent value="overview" className="mt-0 p-5 space-y-5">
                            {/* Contact */}
                            <div className="rounded-2xl border border-slate-200 p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <SectionLabel icon={<Mail className="h-3 w-3" />}>Email</SectionLabel>
                                    <a
                                        href={`mailto:${candidate.email}`}
                                        className="text-[12px] font-medium text-slate-700 hover:text-violet-600 mt-1 block truncate"
                                    >
                                        {candidate.email || "—"}
                                    </a>
                                </div>
                                <div>
                                    <SectionLabel icon={<Phone className="h-3 w-3" />}>Phone</SectionLabel>
                                    <a
                                        href={`tel:${candidate.phone}`}
                                        className="text-[12px] font-medium text-slate-700 hover:text-violet-600 mt-1 block truncate"
                                    >
                                        {candidate.phone || "—"}
                                    </a>
                                </div>
                                <div>
                                    <SectionLabel icon={<MapPin className="h-3 w-3" />}>
                                        Location
                                    </SectionLabel>
                                    <p className="text-[12px] font-medium text-slate-700 mt-1 truncate">
                                        {candidate.location || "—"}
                                    </p>
                                </div>
                                <div>
                                    <SectionLabel icon={<Calendar className="h-3 w-3" />}>
                                        Applied
                                    </SectionLabel>
                                    <p className="text-[12px] font-medium text-slate-700 mt-1">
                                        {candidate.appliedDate}
                                    </p>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <SectionLabel icon={<Sparkles className="h-3 w-3" />}>
                                    Skills
                                </SectionLabel>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {(candidate.parsedSkills ?? []).length === 0 && (
                                        <span className="text-[11px] text-slate-400 italic">
                                            No skills listed
                                        </span>
                                    )}
                                    {(candidate.parsedSkills ?? []).map((s) => (
                                        <TagChip key={s} label={s} tone="violet" />
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <SectionLabel icon={<Tag className="h-3 w-3" />}>Tags</SectionLabel>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {(candidate.tags ?? []).length === 0 && (
                                        <span className="text-[11px] text-slate-400 italic">
                                            No tags yet
                                        </span>
                                    )}
                                    {(candidate.tags ?? []).map((t) => (
                                        <TagChip key={t} label={t} tone="violet" />
                                    ))}
                                </div>
                            </div>

                            {/* Resume */}
                            {candidate.resumeUrl && (
                                <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-violet-600" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold text-slate-800">
                                                Resume attached
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                                Click to open in new tab
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            window.open(candidate.resumeUrl, "_blank", "noopener")
                                        }
                                        className="h-8 rounded-lg text-[10px] font-semibold border-slate-200"
                                    >
                                        <Eye className="h-3 w-3 mr-1" /> View
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        {/* Activity */}
                        <TabsContent value="activity" className="mt-0 p-5">
                            {candidate.communicationLog.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <Activity className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-[11px] font-medium">No activity yet</p>
                                </div>
                            ) : (
                                <div className="relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-px before:bg-slate-200 space-y-4">
                                    {candidate.communicationLog.map((log) => (
                                        <div key={log.id} className="relative pl-10">
                                            <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                                                <Activity className="h-3.5 w-3.5 text-violet-600" />
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-[11px] font-semibold text-slate-800">
                                                        {log.action}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-600 mt-1">
                                                    {log.details}
                                                </p>
                                                <p className="text-[10px] text-violet-600 font-semibold mt-1.5">
                                                    by {log.performer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Notes */}
                        <TabsContent value="notes" className="mt-0 p-5 space-y-4">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <Textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add a note about this candidate..."
                                    className="min-h-[80px] rounded-lg border-slate-200 text-[11px]"
                                />
                                <div className="flex justify-end mt-2">
                                    <Button
                                        onClick={handleAddNote}
                                        disabled={!noteText.trim()}
                                        className="h-8 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold disabled:opacity-50"
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add note
                                    </Button>
                                </div>
                            </div>
                            {candidate.notes.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-[11px] font-medium">No notes yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {[...candidate.notes].reverse().map((n) => (
                                        <div
                                            key={n.id}
                                            className="rounded-xl border border-slate-200 bg-white p-3"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] font-semibold text-slate-800">
                                                    {n.author}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(n.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 whitespace-pre-wrap">
                                                {n.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Interviews */}
                        <TabsContent value="interviews" className="mt-0 p-5">
                            {candidateInterviews.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-[11px] font-medium">No interviews scheduled</p>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            router.push(
                                                `/hrmcubicle/hire/interviews?candidateId=${candidate.id}`
                                            )
                                        }
                                        className="h-8 rounded-lg text-[10px] font-semibold border-slate-200 mt-3"
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Schedule Interview
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {candidateInterviews.map((i) => (
                                        <div
                                            key={i.id}
                                            className="rounded-xl border border-slate-200 bg-white p-3 flex items-start justify-between"
                                        >
                                            <div>
                                                <p className="text-[12px] font-semibold text-slate-800">
                                                    {i.title}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">
                                                    {i.date} · {i.time} · {i.mode}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-[9px] font-semibold uppercase tracking-wider h-5 rounded-md border-indigo-200 bg-indigo-50 text-indigo-700"
                                            >
                                                {i.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {/* Offers */}
                        <TabsContent value="offers" className="mt-0 p-5">
                            {candidateOffers.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <FileText className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-[11px] font-medium">No offers generated</p>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            router.push(
                                                `/hrmcubicle/hire/offers?candidateId=${candidate.id}`
                                            )
                                        }
                                        className="h-8 rounded-lg text-[10px] font-semibold border-slate-200 mt-3"
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Generate Offer
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {candidateOffers.map((o) => (
                                        <div
                                            key={o.id}
                                            className="rounded-xl border border-slate-200 bg-white p-3 flex items-start justify-between"
                                        >
                                            <div>
                                                <p className="text-[12px] font-semibold text-slate-800">
                                                    {o.role}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">
                                                    CTC: {o.ctc} · Joining {o.joiningDate}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-[9px] font-semibold uppercase tracking-wider h-5 rounded-md border-amber-200 bg-amber-50 text-amber-700"
                                            >
                                                {o.approvalStatus}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
};

// ============================================================
// Dialog 3: Move Stage
// ============================================================

const MoveStageDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    candidateId: string | null;
}> = ({ open, onOpenChange, candidateId }) => {
    const candidates = useHireStore((s) => s.candidates);
    const moveCandidateStageApi = useHireStore((s) => s.moveCandidateStageApi);
    const { toast } = useToast();
    const c = candidateId ? candidates.find((x) => x.id === candidateId) : null;
    const [target, setTarget] = useState<StageId>("Screening");
    const [reason, setReason] = useState("");
    const [moving, setMoving] = useState(false);

    useEffect(() => {
        if (open && c) {
            const nxt = nextStageOf(c.stage) ?? "Screening";
            setTarget(nxt);
            setReason("");
        }
    }, [open, c]);

    if (!c) return null;
    const from = stageOf(c.stage);
    const to = stageOf(target);

    const handleMove = async () => {
        setMoving(true);
        try {
            await moveCandidateStageApi(c.id, target);
            toast({
                title: "Stage updated",
                description: `${c.firstName} moved to ${target}.`,
            });
            onOpenChange(false);
        } catch (err: any) {
            toast({
                title: "Move failed",
                description: err?.message ?? "Could not update stage.",
                variant: "destructive",
            });
        } finally {
            setMoving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-2xl border-slate-200 bg-white shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-900">
                        Move candidate stage
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        {c.firstName} {c.lastName}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center gap-3 py-4">
                    <div
                        className={`flex-1 rounded-xl border ${from.border} ${from.col} p-3 text-center`}
                    >
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                            From
                        </p>
                        <p className={`text-sm font-bold mt-1 ${from.headerText}`}>
                            {from.title}
                        </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                    <div
                        className={`flex-1 rounded-xl border ${to.border} ${to.col} p-3 text-center`}
                    >
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                            To
                        </p>
                        <p className={`text-sm font-bold mt-1 ${to.headerText}`}>{to.title}</p>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-slate-600">
                        Select new stage
                    </Label>
                    <Select value={target} onValueChange={(v) => setTarget(v as StageId)}>
                        <SelectTrigger className="h-9 rounded-lg border-slate-200 text-[11px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {STAGES.map((s) => (
                                <SelectItem key={s.id} value={s.id} className="text-[11px]">
                                    {s.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {target === "Rejected" && (
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold text-slate-600">
                            Reason (optional)
                        </Label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Why is this candidate being rejected?"
                            className="min-h-[70px] rounded-lg border-slate-200 text-[11px]"
                        />
                    </div>
                )}

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleMove}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        Move to {target}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================
// Dialog 4: Reject
// ============================================================

const RejectDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    candidateId: string | null;
}> = ({ open, onOpenChange, candidateId }) => {
    const candidates = useHireStore((s) => s.candidates);
    const moveCandidateStage = useHireStore((s) => s.moveCandidateStage);
    const updateCandidate = useHireStore((s) => s.updateCandidate);
    const addCandidateNote = useHireStore((s) => s.addCandidateNote);
    const { toast } = useToast();
    const c = candidateId ? candidates.find((x) => x.id === candidateId) : null;
    const [reason, setReason] = useState(REJECT_REASONS[0]);
    const [notes, setNotes] = useState("");
    const [addRejectTag, setAddRejectTag] = useState(true);

    useEffect(() => {
        if (open) {
            setReason(REJECT_REASONS[0]);
            setNotes("");
            setAddRejectTag(true);
        }
    }, [open]);

    if (!c) return null;

    const handleReject = () => {
        moveCandidateStage(c.id, "Rejected");
        if (addRejectTag) {
            const newTags = Array.from(new Set([...(c.tags ?? []), `Rejected: ${reason}`]));
            updateCandidate(c.id, { tags: newTags });
        }
        if (notes.trim()) {
            addCandidateNote(c.id, `Rejection reason: ${reason}\n${notes}`);
        }
        toast({
            title: "Candidate rejected",
            description: `${c.firstName} marked as rejected.`,
            variant: "destructive",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl border-slate-200 bg-white shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-600" />
                        Reject candidate
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        Reject {c.firstName} {c.lastName}. This action is reversible.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold text-slate-600">
                            Reason
                        </Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 text-[11px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {REJECT_REASONS.map((r) => (
                                    <SelectItem key={r} value={r} className="text-[11px]">
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold text-slate-600">
                            Additional notes
                        </Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Feedback for the hiring team..."
                            className="min-h-[80px] rounded-lg border-slate-200 text-[11px]"
                        />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={addRejectTag}
                            onCheckedChange={(v) => setAddRejectTag(!!v)}
                            className="h-3.5 w-3.5 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                        />
                        <span className="text-[11px] text-slate-600 font-medium">
                            Add tag "Rejected: {reason}" to candidate
                        </span>
                    </label>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReject}
                        className="h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold"
                    >
                        Reject candidate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================
// Dialog 5: Bulk Move Stage
// ============================================================

const BulkMoveDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    candidateIds: string[];
}> = ({ open, onOpenChange, candidateIds }) => {
    const moveCandidateStage = useHireStore((s) => s.moveCandidateStage);
    const addCandidateNote = useHireStore((s) => s.addCandidateNote);
    const { toast } = useToast();
    const [target, setTarget] = useState<StageId>("Screening");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (open) {
            setTarget("Screening");
            setNote("");
        }
    }, [open]);

    const handleMove = () => {
        candidateIds.forEach((id) => {
            moveCandidateStage(id, target);
            if (note.trim()) addCandidateNote(id, `Bulk move: ${note}`);
        });
        toast({
            title: "Stages updated",
            description: `${candidateIds.length} candidates moved to ${target}.`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl border-slate-200 bg-white shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-900">
                        Bulk move stage
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        Move {candidateIds.length} selected candidates to a new stage.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold text-slate-600">
                            Target stage
                        </Label>
                        <Select value={target} onValueChange={(v) => setTarget(v as StageId)}>
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 text-[11px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {STAGES.map((s) => (
                                    <SelectItem key={s.id} value={s.id} className="text-[11px]">
                                        {s.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold text-slate-600">
                            Shared note (optional)
                        </Label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Added to each candidate's notes..."
                            className="min-h-[70px] rounded-lg border-slate-200 text-[11px]"
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleMove}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        Move {candidateIds.length} to {target}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================
// Dialog 6: Add Tag
// ============================================================

const AddTagDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    candidateIds: string[];
    existingTags: string[];
}> = ({ open, onOpenChange, candidateIds, existingTags }) => {
    const candidates = useHireStore((s) => s.candidates);
    const updateCandidate = useHireStore((s) => s.updateCandidate);
    const { toast } = useToast();
    const [selected, setSelected] = useState<string[]>([]);
    const [custom, setCustom] = useState("");

    useEffect(() => {
        if (open) {
            setSelected([]);
            setCustom("");
        }
    }, [open]);

    const handleApply = () => {
        const all = [...selected];
        if (custom.trim()) all.push(custom.trim());
        if (all.length === 0) {
            toast({
                title: "Pick a tag",
                description: "Select at least one tag to apply.",
                variant: "destructive",
            });
            return;
        }
        candidateIds.forEach((id) => {
            const c = candidates.find((x) => x.id === id);
            if (!c) return;
            const merged = Array.from(new Set([...(c.tags ?? []), ...all]));
            updateCandidate(id, { tags: merged });
        });
        toast({
            title: "Tags applied",
            description: `${all.length} tag(s) added to ${candidateIds.length} candidates.`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl border-slate-200 bg-white shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-900">
                        Add tags
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        Apply tags to {candidateIds.length} selected candidates.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <div>
                        <Label className="text-[11px] font-semibold text-slate-600 mb-2 block">
                            Common tags
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                            {Array.from(new Set([...COMMON_TAGS, ...existingTags])).map((t) => {
                                const active = selected.includes(t);
                                return (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() =>
                                            setSelected((p) =>
                                                active ? p.filter((x) => x !== t) : [...p, t]
                                            )
                                        }
                                        className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all border ${active
                                                ? "bg-violet-50 text-violet-700 border-violet-200"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        {active && <CheckCircle2 className="h-2.5 w-2.5 inline mr-1" />}
                                        {t}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold text-slate-600">
                            Custom tag
                        </Label>
                        <Input
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                            placeholder="Type a custom tag"
                            className="h-9 rounded-lg border-slate-200 text-[11px]"
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        Apply tags
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================
// Dialog 7: Send Email
// ============================================================

const SendEmailDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    candidateIds: string[];
}> = ({ open, onOpenChange, candidateIds }) => {
    const candidates = useHireStore((s) => s.candidates);
    const jobs = useHireStore((s) => s.jobs);
    const { toast } = useToast();
    const targets = useMemo(
        () => candidates.filter((c) => candidateIds.includes(c.id)),
        [candidates, candidateIds]
    );
    const [templateId, setTemplateId] = useState("invite");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [tab, setTab] = useState("compose");

    useEffect(() => {
        if (!open) return;
        const tpl = EMAIL_TEMPLATES.find((t) => t.id === templateId) ?? EMAIL_TEMPLATES[0];
        setSubject(tpl.subject);
        setBody(tpl.body);
    }, [open, templateId]);

    const preview = useMemo(() => {
        if (targets.length === 0)
            return { subject, body, to: "—" };
        const first = targets[0];
        const job = jobs.find((j) => j.id === first.jobId);
        const ctx: Record<string, string> = {
            firstName: first.firstName,
            lastName: first.lastName,
            email: first.email,
            role: job?.title ?? "the role",
            date: new Date(Date.now() + 7 * 24 * 3600 * 1000).toLocaleDateString(),
        };
        return {
            subject: mergeTemplate(subject, ctx),
            body: mergeTemplate(body, ctx),
            to: first.email,
        };
    }, [subject, body, targets, jobs]);

    const handleSend = () => {
        if (!subject.trim() || !body.trim()) {
            toast({
                title: "Missing content",
                description: "Please add both subject and body.",
                variant: "destructive",
            });
            return;
        }
        toast({
            title: "Email queued",
            description: `${targets.length} email(s) prepared for sending.`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-2xl border-slate-200 bg-white shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100">
                    <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-violet-600" />
                        Send email
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        Compose an email to {targets.length} candidate(s). Use merge tags like
                        <code className="bg-slate-100 text-violet-700 px-1 py-0.5 rounded ml-1">
                            {"{{firstName}}"}
                        </code>
                        .
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={tab} onValueChange={setTab}>
                    <div className="px-6 pt-3 border-b border-slate-100">
                        <TabsList className="bg-transparent h-9 p-0 gap-5">
                            <TabsTrigger
                                value="compose"
                                className="px-0 h-full rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[11px] font-semibold text-slate-500"
                            >
                                Compose
                            </TabsTrigger>
                            <TabsTrigger
                                value="preview"
                                className="px-0 h-full rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[11px] font-semibold text-slate-500"
                            >
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="compose" className="px-6 py-4 mt-0 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">
                                    Template
                                </Label>
                                <Select value={templateId} onValueChange={setTemplateId}>
                                    <SelectTrigger className="h-9 rounded-lg border-slate-200 text-[11px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {EMAIL_TEMPLATES.map((t) => (
                                            <SelectItem
                                                key={t.id}
                                                value={t.id}
                                                className="text-[11px]"
                                            >
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">
                                    Recipients
                                </Label>
                                <div className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 flex items-center text-[11px] text-slate-600 font-medium">
                                    {targets.length} candidate{targets.length === 1 ? "" : "s"}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold text-slate-600">
                                Subject
                            </Label>
                            <Input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email subject"
                                className="h-9 rounded-lg border-slate-200 text-[11px]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold text-slate-600">
                                Body
                            </Label>
                            <Textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Email body..."
                                className="min-h-[160px] rounded-lg border-slate-200 text-[11px] font-mono"
                            />
                            <p className="text-[10px] text-slate-500">
                                Merge tags available:{" "}
                                <code className="bg-slate-100 px-1 rounded">{"{{firstName}}"}</code>{" "}
                                <code className="bg-slate-100 px-1 rounded">{"{{lastName}}"}</code>{" "}
                                <code className="bg-slate-100 px-1 rounded">{"{{role}}"}</code>{" "}
                                <code className="bg-slate-100 px-1 rounded">{"{{date}}"}</code>
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="px-6 py-4 mt-0">
                        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                        To
                                    </p>
                                    <p className="text-[11px] font-semibold text-slate-800">
                                        {preview.to}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="text-[9px] font-semibold border-violet-200 bg-violet-50 text-violet-700 h-5 rounded-md"
                                >
                                    Preview for first recipient
                                </Badge>
                            </div>
                            <div className="py-3 border-b border-slate-200">
                                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                    Subject
                                </p>
                                <p className="text-[12px] font-semibold text-slate-900 mt-1">
                                    {preview.subject}
                                </p>
                            </div>
                            <div className="pt-3">
                                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">
                                    Body
                                </p>
                                <pre className="text-[11px] text-slate-700 font-sans whitespace-pre-wrap">
                                    {preview.body}
                                </pre>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSend}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        <Send className="h-3 w-3 mr-1" /> Send {targets.length} email
                        {targets.length === 1 ? "" : "s"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================
// Dialog 8: Import CSV
// ============================================================

const ImportCsvDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
}> = ({ open, onOpenChange }) => {
    const candidates = useHireStore((s) => s.candidates);
    const jobs = useHireStore((s) => s.jobs);
    const addCandidate = useHireStore((s) => s.addCandidate);
    const { toast } = useToast();

    const [file, setFile] = useState<File | null>(null);
    const [rows, setRows] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [step, setStep] = useState<"upload" | "map" | "preview">("upload");
    const fileRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!open) {
            setFile(null);
            setRows([]);
            setHeaders([]);
            setMapping({});
            setStep("upload");
        }
    }, [open]);

    const parseCsv = (text: string): string[][] => {
        return text
            .split(/\r?\n/)
            .filter(Boolean)
            .map((line) => {
                const cells: string[] = [];
                let cur = "";
                let inQ = false;
                for (let i = 0; i < line.length; i++) {
                    const ch = line[i];
                    if (ch === '"') {
                        if (inQ && line[i + 1] === '"') {
                            cur += '"';
                            i++;
                        } else inQ = !inQ;
                    } else if (ch === "," && !inQ) {
                        cells.push(cur);
                        cur = "";
                    } else cur += ch;
                }
                cells.push(cur);
                return cells.map((c) => c.trim());
            });
    };

    const onFile = (f: File | null) => {
        if (!f) return;
        setFile(f);
        const reader = new FileReader();
        reader.onload = () => {
            const text = String(reader.result ?? "");
            const parsed = parseCsv(text);
            if (parsed.length === 0) return;
            const h = parsed[0];
            setHeaders(h);
            setRows(parsed.slice(1));
            const auto: Record<string, string> = {};
            CSV_COLUMNS.forEach((col) => {
                const found = h.findIndex((x) =>
                    x.toLowerCase().replace(/\s+/g, "").includes(col.key.toLowerCase())
                );
                if (found !== -1) auto[col.key] = h[found];
            });
            setMapping(auto);
            setStep("map");
        };
        reader.readAsText(f);
    };

    const previewCandidates = useMemo(() => {
        const idx = (key: string) => headers.indexOf(mapping[key] ?? "");
        return rows.slice(0, 20).map((r) => {
            const get = (k: string) => {
                const i = idx(k);
                return i === -1 ? "" : r[i] ?? "";
            };
            const email = get("email");
            const duplicate =
                !!email && candidates.some((c) => c.email.toLowerCase() === email.toLowerCase());
            return {
                firstName: get("firstName") || get("email"),
                lastName: get("lastName"),
                email,
                phone: get("phone"),
                location: get("location"),
                source: get("source") || "Imported",
                tags: (get("tags") || "").split(/[,;]/).map((s) => s.trim()).filter(Boolean),
                skills: (get("parsedSkills") || "")
                    .split(/[,;]/)
                    .map((s) => s.trim())
                    .filter(Boolean),
                jobId: get("jobId") || jobs[0]?.id || "",
                duplicate,
                validEmail: isEmail(email),
            };
        });
    }, [rows, headers, mapping, candidates, jobs]);

    const validCount = previewCandidates.filter((r) => !r.duplicate && r.validEmail).length;

    const handleImport = () => {
        let imported = 0;
        previewCandidates.forEach((r) => {
            if (r.duplicate || !r.validEmail) return;
            addCandidate({
                jobId: r.jobId,
                firstName: r.firstName,
                lastName: r.lastName,
                email: r.email,
                phone: r.phone,
                location: r.location,
                source: r.source,
                tags: r.tags,
            } as any);
            imported++;
        });
        toast({
            title: "Import complete",
            description: `Imported ${imported} candidates.`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-2xl border-slate-200 bg-white shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100">
                    <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Upload className="h-4 w-4 text-violet-600" />
                        Import candidates (CSV)
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        Upload a CSV file, map columns, and preview before importing.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <div className="px-6 py-4">
                        {step === "upload" && (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                                />
                                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-[12px] font-semibold text-slate-700">
                                    Upload a CSV file
                                </p>
                                <p className="text-[10px] text-slate-500 mt-1">
                                    First row must contain column headers.
                                </p>
                                <Button
                                    onClick={() => fileRef.current?.click()}
                                    className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold mt-4"
                                >
                                    Choose file
                                </Button>
                            </div>
                        )}
                        {step === "map" && (
                            <div className="space-y-3">
                                <div className="rounded-lg bg-slate-50 p-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-800">
                                            {file?.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            {rows.length} rows detected · {headers.length} columns
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setStep("upload")}
                                        className="h-7 text-[10px] font-semibold"
                                    >
                                        Change file
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                        Map columns
                                    </p>
                                    {CSV_COLUMNS.map((col) => (
                                        <div
                                            key={col.key}
                                            className="grid grid-cols-2 gap-3 items-center"
                                        >
                                            <Label className="text-[11px] font-medium text-slate-700">
                                                {col.label}
                                            </Label>
                                            <Select
                                                value={mapping[col.key] ?? "__none__"}
                                                onValueChange={(v) =>
                                                    setMapping((p) => ({
                                                        ...p,
                                                        [col.key]: v === "__none__" ? "" : v,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="h-8 rounded-lg border-slate-200 text-[11px]">
                                                    <SelectValue placeholder="— Not mapped —" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem
                                                        value="__none__"
                                                        className="text-[11px]"
                                                    >
                                                        — Not mapped —
                                                    </SelectItem>
                                                    {headers.map((h) => (
                                                        <SelectItem
                                                            key={h}
                                                            value={h}
                                                            className="text-[11px]"
                                                        >
                                                            {h}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {step === "preview" && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 rounded-lg bg-violet-50 border border-violet-200 p-3">
                                    <CheckCircle2 className="h-4 w-4 text-violet-600" />
                                    <p className="text-[11px] font-medium text-slate-800">
                                        {validCount} of {previewCandidates.length} rows will be
                                        imported. Duplicates and invalid emails are skipped.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead className="text-[10px] font-bold uppercase h-8">
                                                    Status
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase h-8">
                                                    Name
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase h-8">
                                                    Email
                                                </TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase h-8">
                                                    Phone
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewCandidates.map((r, i) => (
                                                <TableRow key={i} className="border-slate-100">
                                                    <TableCell className="py-1.5">
                                                        {r.duplicate ? (
                                                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] font-semibold h-5 rounded-md">
                                                                Duplicate
                                                            </Badge>
                                                        ) : !r.validEmail ? (
                                                            <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[9px] font-semibold h-5 rounded-md">
                                                                Invalid email
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-semibold h-5 rounded-md">
                                                                Ready
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-[11px] py-1.5">
                                                        {r.firstName} {r.lastName}
                                                    </TableCell>
                                                    <TableCell className="text-[10px] py-1.5">
                                                        {r.email}
                                                    </TableCell>
                                                    <TableCell className="text-[10px] py-1.5">
                                                        {r.phone}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    {step === "map" && (
                        <Button
                            onClick={() => setStep("preview")}
                            className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                        >
                            Preview
                        </Button>
                    )}
                    {step === "preview" && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setStep("map")}
                                className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleImport}
                                disabled={validCount === 0}
                                className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold disabled:opacity-50"
                            >
                                Import {validCount} candidates
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================
// Dialog 9: Export CSV
// ============================================================

const ExportCsvDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    candidates: Candidate[];
}> = ({ open, onOpenChange, candidates }) => {
    const { toast } = useToast();
    const [columns, setColumns] = useState<string[]>(CSV_COLUMNS.map((c) => c.key));

    useEffect(() => {
        if (open) setColumns(CSV_COLUMNS.map((c) => c.key));
    }, [open]);

    const toggleCol = (key: string) =>
        setColumns((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));

    const handleExport = () => {
        if (columns.length === 0) {
            toast({
                title: "Select at least one column",
                variant: "destructive",
            });
            return;
        }
        const header = CSV_COLUMNS.filter((c) => columns.includes(c.key)).map((c) => c.label);
        const esc = (v: any) => {
            const s = String(v ?? "");
            if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
            return s;
        };
        const rows = candidates.map((c) =>
            columns
                .map((k) => {
                    switch (k) {
                        case "firstName":
                            return c.firstName;
                        case "lastName":
                            return c.lastName;
                        case "email":
                            return c.email;
                        case "phone":
                            return c.phone;
                        case "location":
                            return c.location;
                        case "source":
                            return c.source;
                        case "stage":
                            return c.stage;
                        case "rating":
                            return c.rating;
                        case "tags":
                            return (c.tags ?? []).join(";");
                        case "parsedSkills":
                            return (c.parsedSkills ?? []).join(";");
                        case "appliedDate":
                            return c.appliedDate;
                        case "jobId":
                            return c.jobId;
                        default:
                            return "";
                    }
                })
                .map(esc)
                .join(",")
        );
        const csv = [header.map(esc).join(","), ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `candidates-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast({
            title: "Export complete",
            description: `${candidates.length} candidates downloaded.`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl border-slate-200 bg-white shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Download className="h-4 w-4 text-violet-600" />
                        Export candidates
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        Select which columns to include in your CSV download ({candidates.length}{" "}
                        candidates).
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                    {CSV_COLUMNS.map((col) => (
                        <label
                            key={col.key}
                            className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2.5 cursor-pointer hover:bg-slate-50"
                        >
                            <span className="text-[11px] font-medium text-slate-700">
                                {col.label}
                            </span>
                            <Checkbox
                                checked={columns.includes(col.key)}
                                onCheckedChange={() => toggleCol(col.key)}
                                className="h-3.5 w-3.5 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                            />
                        </label>
                    ))}
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleExport}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        <Download className="h-3 w-3 mr-1" /> Download CSV
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ============================================================
// Dialog 10: Delete Confirm
// ============================================================

const DeleteConfirmDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    ids: string[];
    onConfirm: () => void;
}> = ({ open, onOpenChange, ids, onConfirm }) => {
    const candidates = useHireStore((s) => s.candidates);
    const targets = candidates.filter((c) => ids.includes(c.id));
    const bulk = ids.length > 1;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl border-slate-200 bg-white shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-rose-600" />
                        Delete {bulk ? `${ids.length} candidates` : "candidate"}?
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500">
                        This action cannot be undone. The candidate profile(s) will be permanently
                        removed from the pipeline.
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 max-h-40 overflow-y-auto">
                    {targets.slice(0, 10).map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center gap-2 text-[11px] text-slate-700 py-0.5"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            {c.firstName} {c.lastName}
                            <span className="text-slate-400">— {c.email}</span>
                        </div>
                    ))}
                    {targets.length > 10 && (
                        <p className="text-[10px] text-slate-500 font-medium mt-1">
                            + {targets.length - 10} more
                        </p>
                    )}
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold"
                    >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete {bulk ? `${ids.length}` : ""}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
