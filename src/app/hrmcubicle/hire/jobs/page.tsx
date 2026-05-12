"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
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
import { useToast } from "@/shared/components/ui/use-toast";
import { useHireStore, type Job } from "@/shared/data/hire-store";
import { getAllDepartments, getAllPositions } from "@/modules/hrm/hooks/hrmHooks";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Plus,
    Copy,
    Edit,
    Trash2,
    Eye,
    Send,
    CheckCircle2,
    XCircle,
    Pause,
    Play,
    Download,
    Upload,
    Globe,
    Linkedin,
    Filter,
    Search,
    LayoutGrid,
    List,
    MoreHorizontal,
    Users,
    MapPin,
    Building2,
    IndianRupee,
    Clock,
    GripVertical,
    UserPlus,
    Award,
    Share2,
    X,
    ChevronRight,
    Settings2,
    FileText,
    Activity,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    Link2,
    Calendar,
    Target,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Job Templates
// ─────────────────────────────────────────────────────────────────────────────
type JobTemplate = {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    title: string;
    department: string;
    skills: string[];
    description: string;
};

const JOB_TEMPLATES: JobTemplate[] = [
    {
        id: "tmpl_fe",
        icon: LayoutGrid,
        accent: "violet",
        title: "Senior Frontend Engineer",
        department: "Engineering",
        skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
        description:
            "Lead frontend architecture, build performant UI components, and mentor juniors. Own quality, accessibility, and ship cadence.",
    },
    {
        id: "tmpl_be",
        icon: Settings2,
        accent: "indigo",
        title: "Backend Engineer",
        department: "Engineering",
        skills: ["Go", "Kubernetes", "PostgreSQL", "gRPC"],
        description:
            "Design scalable microservices, own data layers, and drive reliability for our core platform.",
    },
    {
        id: "tmpl_pm",
        icon: Target,
        accent: "emerald",
        title: "Product Manager",
        department: "Product",
        skills: ["Roadmapping", "Agile", "Analytics", "Stakeholder Mgmt"],
        description:
            "Define product vision, drive cross-functional execution, and ship customer-loved experiences.",
    },
    {
        id: "tmpl_des",
        icon: Sparkles,
        accent: "pink",
        title: "Product Designer",
        department: "Design",
        skills: ["Figma", "Design Systems", "Prototyping", "UX Research"],
        description:
            "Craft intuitive, beautiful experiences. Lead end-to-end design from research to polished shipping.",
    },
    {
        id: "tmpl_devops",
        icon: Activity,
        accent: "orange",
        title: "DevOps Engineer",
        department: "Engineering",
        skills: ["AWS", "Terraform", "Docker", "CI/CD"],
        description:
            "Automate infrastructure, ensure uptime, and enable the org to ship faster with confidence.",
    },
    {
        id: "tmpl_ds",
        icon: TrendingUp,
        accent: "blue",
        title: "Data Scientist",
        department: "Data",
        skills: ["Python", "ML", "SQL", "Statistics"],
        description:
            "Turn data into insights and ship ML-driven product features that drive revenue and retention.",
    },
    {
        id: "tmpl_hr",
        icon: UserPlus,
        accent: "rose",
        title: "HR Business Partner",
        department: "HR",
        skills: ["Employee Relations", "Performance", "L&D", "Policy"],
        description:
            "Partner with leaders, drive engagement, and own the people experience end to end.",
    },
    {
        id: "tmpl_sales",
        icon: Award,
        accent: "amber",
        title: "Account Executive",
        department: "Sales",
        skills: ["B2B Sales", "Negotiation", "CRM", "Pipeline"],
        description:
            "Close enterprise deals, own quota, and grow strategic accounts across the region.",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
    "Engineering",
    "Product",
    "Design",
    "Data",
    "HR",
    "Sales",
    "Marketing",
    "Operations",
    "Finance",
    "Legal",
];

const LOCATIONS = [
    "Remote",
    "Bangalore",
    "Mumbai",
    "Delhi NCR",
    "Hyderabad",
    "Pune",
    "Chennai",
    "Hybrid - Bangalore",
    "Hybrid - Mumbai",
];

const EMPLOYMENT_TYPES: Job["type"][] = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
];

const EXPERIENCE_LEVELS = [
    "Fresher",
    "1-3 Years",
    "3-5 Years",
    "5-8 Years",
    "8+ Years",
    "Executive",
];

const HIRING_MANAGERS = [
    { id: "EMP-002", name: "Rajesh Kumar", role: "VP Engineering" },
    { id: "EMP-005", name: "Sneha Iyer", role: "Design Lead" },
    { id: "EMP-008", name: "Arjun Mehta", role: "Engineering Manager" },
    { id: "EMP-011", name: "Priya Sharma", role: "Product Lead" },
    { id: "EMP-015", name: "Vikram Singh", role: "Sales Director" },
];

const RECRUITERS = [
    { id: "EMP-021", name: "Ananya Reddy" },
    { id: "EMP-022", name: "Karan Kapoor" },
    { id: "EMP-023", name: "Meera Nair" },
    { id: "EMP-024", name: "Rohan Joshi" },
];

const APPROVERS = [
    { id: "EMP-002", name: "Rajesh Kumar (VP Eng)" },
    { id: "EMP-001", name: "Sonia Mehra (CHRO)" },
    { id: "EMP-003", name: "Finance Head" },
    { id: "EMP-004", name: "CEO - Kartik Vaidya" },
];

const CLOSE_REASONS = [
    "Position Filled",
    "Hiring Freeze",
    "Role Redefined",
    "Budget Constraints",
    "Requirement Withdrawn",
    "Other",
];

// Type helpers
type WorkflowStatus = Job["workflowStatus"];
type ViewMode = "table" | "card";
type SortKey = "newest" | "oldest" | "applicants" | "views" | "title";

// ─────────────────────────────────────────────────────────────────────────────
// Zod: Job create/update form validation (backend integration)
// ─────────────────────────────────────────────────────────────────────────────
const jobFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    department: z.string().min(1, "Department is required"),
    position: z.string().min(1, "Position is required"),
    location: z.string().min(1, "Location is required"),
    type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
    skills: z.array(z.string()).optional(),
    closingDate: z.string().optional(),
    openingCount: z.number().min(1).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────────────────────────────────────
const statusStyles: Record<WorkflowStatus, string> = {
    Draft: "bg-slate-100 text-slate-700 border-slate-200",
    "Pending Approval": "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "On Hold": "bg-orange-50 text-orange-700 border-orange-200",
    Closed: "bg-rose-50 text-rose-700 border-rose-200",
};

const statusDot: Record<WorkflowStatus, string> = {
    Draft: "bg-slate-400",
    "Pending Approval": "bg-amber-500",
    Approved: "bg-emerald-500",
    Active: "bg-emerald-500",
    "On Hold": "bg-orange-500",
    Closed: "bg-rose-500",
};

const typeStyles: Record<Job["type"], string> = {
    "Full-time": "bg-violet-50 text-violet-700 border-violet-200",
    "Part-time": "bg-blue-50 text-blue-700 border-blue-200",
    Contract: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Internship: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

const templateAccent: Record<string, string> = {
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pink: "bg-pink-50 text-pink-600 border-pink-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
};

// ─────────────────────────────────────────────────────────────────────────────
// Small presentational components
// ─────────────────────────────────────────────────────────────────────────────
const StatusPill = ({ status }: { status: WorkflowStatus }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyles[status]}`}
    >
        <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
        {status}
    </span>
);

const TypePill = ({ type }: { type: Job["type"] }) => (
    <span
        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${typeStyles[type]}`}
    >
        {type}
    </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {children}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────
const JobOpeningsPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const {
        jobs,
        candidates,
        addJob,
        updateJob,
        deleteJob,
        submitJobForApproval,
    } = useHireStore();

    // ── Backend API actions ──
    const loadJobsFromApi = useHireStore((s) => s.loadJobsFromApi);
    const jobsLoading = useHireStore((s) => s.loading.jobs);
    const hasLoadedJobs = useHireStore((s) => s.hasLoaded.jobs);
    const addJobApi = useHireStore((s) => s.addJobApi);
    const updateJobApi = useHireStore((s) => s.updateJobApi);
    const closeJobApi = useHireStore((s) => s.closeJobApi);

    // Load jobs + dept/position lists once on mount
    useEffect(() => {
        if (!hasLoadedJobs) {
            loadJobsFromApi();
        }
        // Departments and positions for ObjectId-backed dropdowns
        (async () => {
            try {
                const [deptRes, posRes] = await Promise.all([
                    getAllDepartments().catch(() => null),
                    getAllPositions().catch(() => null),
                ]);
                const depts = (deptRes as any)?.data?.data ?? (deptRes as any)?.data ?? [];
                const positions = (posRes as any)?.data?.data ?? (posRes as any)?.data ?? [];
                if (Array.isArray(depts)) setDeptOptions(depts);
                if (Array.isArray(positions)) setPositionOptions(positions);
            } catch {
                // silent — dropdowns fall back to empty; toast handled by hooks
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // View & filters
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [activeTab, setActiveTab] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("newest");

    const [filterDept, setFilterDept] = useState<string>("all");
    const [filterLocation, setFilterLocation] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterExperience, setFilterExperience] = useState<string>("all");
    const [filterSalary, setFilterSalary] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterManager, setFilterManager] = useState<string>("all");

    // Selection
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createStep, setCreateStep] = useState<1 | 2 | 3>(1);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
    const [duplicatingJob, setDuplicatingJob] = useState<Job | null>(null);
    const [duplicateTitle, setDuplicateTitle] = useState("");

    const [isSubmitApprovalOpen, setIsSubmitApprovalOpen] = useState(false);
    const [approvalTargetJob, setApprovalTargetJob] = useState<Job | null>(null);

    const [isApproveRejectOpen, setIsApproveRejectOpen] = useState(false);
    const [approveRejectMode, setApproveRejectMode] = useState<"approve" | "reject">("approve");
    const [approveRejectJob, setApproveRejectJob] = useState<Job | null>(null);
    const [approveNotes, setApproveNotes] = useState("");

    const [isCloseOpen, setIsCloseOpen] = useState(false);
    const [closingJob, setClosingJob] = useState<Job | null>(null);
    const [closeReason, setCloseReason] = useState<string>(CLOSE_REASONS[0]);
    const [closeNotes, setCloseNotes] = useState("");

    const [isDistributeOpen, setIsDistributeOpen] = useState(false);
    const [distributeJob, setDistributeJob] = useState<Job | null>(null);
    const [distributeChannels, setDistributeChannels] = useState({
        linkedin: true,
        indeed: false,
        naukri: true,
        angellist: false,
        careerPage: true,
    });

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailJob, setDetailJob] = useState<Job | null>(null);
    const [detailTab, setDetailTab] = useState<"overview" | "applicants" | "approvals" | "activity">("overview");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);

    const [isImportOpen, setIsImportOpen] = useState(false);
    const [importText, setImportText] = useState("");

    // Form state
    const emptyForm = {
        title: "",
        department: "",        // ObjectId from backend (was free-text)
        position: "",           // ObjectId from backend (BE required)
        location: "Remote",
        type: "Full-time" as Job["type"],
        experience: "3-5 Years",
        salaryRange: "",
        remote: false,
        skills: [] as string[],
        skillInput: "",
        description: "",
        responsibilities: "",
        hiringManagerId: "EMP-002",
        recruiters: ["EMP-021"] as string[],
        approvalChain: ["EMP-002"] as string[],
        closingDate: "",
        openingCount: 1,
    };
    const [form, setForm] = useState(emptyForm);

    // Departments / Positions loaded from backend for the create form
    const [deptOptions, setDeptOptions] = useState<Array<{ _id: string; name: string }>>([]);
    const [positionOptions, setPositionOptions] = useState<Array<{ _id: string; name: string; department?: string }>>([]);

    // ── Live candidate count per job (required) ──
    const applicantsByJob = useMemo(() => {
        const map: Record<string, number> = {};
        candidates.forEach((c) => {
            map[c.jobId] = (map[c.jobId] || 0) + 1;
        });
        return map;
    }, [candidates]);

    const liveApplicants = (jobId: string) =>
        candidates.filter((c) => c.jobId === jobId).length;

    // ── Filtering, sorting, memoised ──
    const filteredJobs = useMemo(() => {
        let list = [...jobs];

        // Tab filter
        if (activeTab === "active") {
            list = list.filter((j) => j.workflowStatus === "Active" || j.workflowStatus === "Approved");
        } else if (activeTab === "pending") {
            list = list.filter((j) => j.workflowStatus === "Pending Approval");
        } else if (activeTab === "drafts") {
            list = list.filter((j) => j.workflowStatus === "Draft");
        } else if (activeTab === "hold") {
            list = list.filter((j) => j.workflowStatus === "On Hold");
        } else if (activeTab === "closed") {
            list = list.filter((j) => j.workflowStatus === "Closed");
        }

        // Search
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(
                (j) =>
                    j.title.toLowerCase().includes(q) ||
                    j.department.toLowerCase().includes(q),
            );
        }

        // Popover filters
        if (filterDept !== "all") list = list.filter((j) => j.department === filterDept);
        if (filterLocation !== "all") list = list.filter((j) => j.location === filterLocation);
        if (filterType !== "all") list = list.filter((j) => j.type === filterType);
        if (filterExperience !== "all") list = list.filter((j) => j.experience === filterExperience);
        if (filterStatus !== "all") list = list.filter((j) => j.workflowStatus === filterStatus);
        if (filterManager !== "all") list = list.filter((j) => j.hiringManagerId === filterManager);
        if (filterSalary !== "all") {
            list = list.filter((j) => {
                const s = j.salaryRange.toLowerCase();
                if (filterSalary === "lt10") return /[^\d]([0-9])l/.test(s) && !s.includes("₹1");
                if (filterSalary === "10_25") return s.includes("10") || s.includes("15") || s.includes("20") || s.includes("25");
                if (filterSalary === "25_50") return s.includes("25") || s.includes("30") || s.includes("40") || s.includes("50");
                if (filterSalary === "gt50") return s.includes("50") || s.includes("60") || s.includes("80") || s.includes("1cr");
                return true;
            });
        }

        // Sort
        list.sort((a, b) => {
            if (sortKey === "newest")
                return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
            if (sortKey === "oldest")
                return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
            if (sortKey === "applicants")
                return (liveApplicants(b.id) || 0) - (liveApplicants(a.id) || 0);
            if (sortKey === "views") return (b.views || 0) - (a.views || 0);
            if (sortKey === "title") return a.title.localeCompare(b.title);
            return 0;
        });

        return list;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        jobs,
        activeTab,
        searchTerm,
        filterDept,
        filterLocation,
        filterType,
        filterExperience,
        filterSalary,
        filterStatus,
        filterManager,
        sortKey,
        candidates,
    ]);

    // ── Stats (memoised) ──
    const stats = useMemo(() => {
        const total = jobs.length;
        const open = jobs.filter(
            (j) => j.workflowStatus === "Active" || j.workflowStatus === "Approved",
        ).length;
        const pending = jobs.filter((j) => j.workflowStatus === "Pending Approval").length;
        const closed = jobs.filter((j) => j.workflowStatus === "Closed").length;
        const views = jobs.reduce((acc, j) => acc + (j.views || 0), 0);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const applicantsThisWeek = candidates.filter((c) => {
            const d = new Date(c.appliedDate);
            return !Number.isNaN(d.getTime()) && d >= weekAgo;
        }).length;

        const fillRate = total === 0 ? 0 : Math.round((closed / total) * 100);

        return {
            open,
            pending,
            applicantsThisWeek,
            views,
            fillRate,
        };
    }, [jobs, candidates]);

    // ── Tab counts ──
    const tabCounts = useMemo(
        () => ({
            all: jobs.length,
            active: jobs.filter(
                (j) => j.workflowStatus === "Active" || j.workflowStatus === "Approved",
            ).length,
            pending: jobs.filter((j) => j.workflowStatus === "Pending Approval").length,
            drafts: jobs.filter((j) => j.workflowStatus === "Draft").length,
            hold: jobs.filter((j) => j.workflowStatus === "On Hold").length,
            closed: jobs.filter((j) => j.workflowStatus === "Closed").length,
        }),
        [jobs],
    );

    // ─────────────────────────────────────────────────────────────
    // Handlers
    // ─────────────────────────────────────────────────────────────
    const resetForm = () => {
        setForm(emptyForm);
        setCreateStep(1);
        setEditingId(null);
    };

    const openCreate = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    const openEdit = (job: Job) => {
        setForm({
            title: job.title,
            department: job.department, // may be ObjectId (API) or legacy name
            position: "",                // not round-tripped via FE Job type — user re-selects if needed
            location: job.location,
            type: job.type,
            experience: job.experience,
            salaryRange: job.salaryRange,
            remote: job.location.toLowerCase().includes("remote"),
            skills: [...job.skills],
            skillInput: "",
            description: job.description,
            responsibilities: "",
            hiringManagerId: job.hiringManagerId,
            recruiters: [...job.recruiters],
            approvalChain:
                job.approvalChain.length > 0
                    ? job.approvalChain.map((a) => a.approver)
                    : ["EMP-002"],
            closingDate: "",
            openingCount: 1,
        });
        setEditingId(job.id);
        setCreateStep(1);
        setIsCreateOpen(true);
    };

    const handleUseTemplate = (tmpl: JobTemplate) => {
        setForm({
            ...emptyForm,
            title: tmpl.title,
            // Template carries a department NAME, but API needs ObjectId. Leave empty so user picks.
            department: "",
            position: "",
            skills: [...tmpl.skills],
            description: tmpl.description,
        });
        setCreateStep(1);
        setEditingId(null);
        setIsCreateOpen(true);
        toast({
            title: "Template applied",
            description: `${tmpl.title} pre-filled. Pick a department and position to continue.`,
        });
    };

    const handleAddSkill = () => {
        const s = form.skillInput.trim();
        if (!s) return;
        if (form.skills.includes(s)) {
            setForm({ ...form, skillInput: "" });
            return;
        }
        setForm({ ...form, skills: [...form.skills, s], skillInput: "" });
    };

    const handleRemoveSkill = (s: string) =>
        setForm({ ...form, skills: form.skills.filter((x) => x !== s) });

    const handleToggleRecruiter = (id: string) => {
        setForm((f) => ({
            ...f,
            recruiters: f.recruiters.includes(id)
                ? f.recruiters.filter((r) => r !== id)
                : [...f.recruiters, id],
        }));
    };

    const handleToggleApprover = (id: string) => {
        setForm((f) => ({
            ...f,
            approvalChain: f.approvalChain.includes(id)
                ? f.approvalChain.filter((a) => a !== id)
                : [...f.approvalChain, id],
        }));
    };

    const handleSaveJob = async () => {
        // Zod validation for the primary create/update path
        const parsed = jobFormSchema.safeParse({
            title: form.title,
            description: form.description,
            department: form.department,
            position: form.position,
            location: form.location,
            type: form.type,
            skills: form.skills,
            closingDate: form.closingDate || undefined,
            openingCount: form.openingCount,
        });
        if (!parsed.success) {
            const firstError = parsed.error.errors[0];
            toast({
                title: "Validation failed",
                description: firstError.message,
                variant: "destructive",
            });
            setCreateStep(1);
            return;
        }

        if (editingId) {
            await updateJobApi(editingId, {
                title: form.title,
                description: form.description,
                location: form.location,
                type: form.type,
                experience: form.experience,
                salaryRange: form.salaryRange,
                skills: form.skills,
            });
            toast({
                title: "Requisition updated",
                description: `${form.title} saved successfully.`,
            });
        } else {
            const created = await addJobApi({
                title: form.title,
                description: form.description,
                department: form.department, // ObjectId from dropdown
                position: form.position,      // ObjectId from dropdown
                location: form.location,
                type: form.type,
                skills: form.skills,
                experience: form.experience,
                salaryRange: form.salaryRange,
                closingDate: form.closingDate || undefined,
                openingCount: form.openingCount ?? 1,
            });
            if (!created) return; // store already toasted on failure
            toast({
                title: "Requisition created",
                description: `${form.title} has been drafted.`,
            });
        }
        setIsCreateOpen(false);
        resetForm();
    };

    const openDuplicate = (job: Job) => {
        setDuplicatingJob(job);
        setDuplicateTitle(`${job.title} (Copy)`);
        setIsDuplicateOpen(true);
    };

    const handleDuplicate = () => {
        if (!duplicatingJob) return;
        if (!duplicateTitle.trim()) {
            toast({
                title: "Title required",
                description: "Enter a title for the duplicate.",
                variant: "destructive",
            });
            return;
        }
        addJob({
            title: duplicateTitle,
            department: duplicatingJob.department,
            location: duplicatingJob.location,
            type: duplicatingJob.type,
            experience: duplicatingJob.experience,
            salaryRange: duplicatingJob.salaryRange,
            description: duplicatingJob.description,
            skills: duplicatingJob.skills,
            hiringManagerId: duplicatingJob.hiringManagerId,
            recruiters: duplicatingJob.recruiters,
        });
        toast({
            title: "Requisition duplicated",
            description: `${duplicateTitle} created as draft.`,
        });
        setIsDuplicateOpen(false);
        setDuplicatingJob(null);
        setDuplicateTitle("");
    };

    const openSubmitApproval = (job: Job) => {
        setApprovalTargetJob(job);
        setIsSubmitApprovalOpen(true);
    };

    const handleSubmitApproval = () => {
        if (!approvalTargetJob) return;
        submitJobForApproval(approvalTargetJob.id);
        toast({
            title: "Submitted for approval",
            description: `${approvalTargetJob.title} is now pending approval.`,
        });
        setIsSubmitApprovalOpen(false);
        setApprovalTargetJob(null);
    };

    const openApproveReject = (job: Job, mode: "approve" | "reject") => {
        setApproveRejectJob(job);
        setApproveRejectMode(mode);
        setApproveNotes("");
        setIsApproveRejectOpen(true);
    };

    const handleApproveReject = () => {
        if (!approveRejectJob) return;
        if (approveRejectMode === "approve") {
            updateJob(approveRejectJob.id, {
                workflowStatus: "Active",
                approvalChain: approveRejectJob.approvalChain.map((a) => ({
                    ...a,
                    status: "Approved" as const,
                })),
            });
            toast({
                title: "Requisition approved",
                description: `${approveRejectJob.title} is now active.`,
            });
        } else {
            updateJob(approveRejectJob.id, {
                workflowStatus: "Draft",
                approvalChain: approveRejectJob.approvalChain.map((a) => ({
                    ...a,
                    status: "Rejected" as const,
                })),
            });
            toast({
                title: "Requisition rejected",
                description: approveNotes || "Sent back to draft.",
                variant: "destructive",
            });
        }
        setIsApproveRejectOpen(false);
        setApproveRejectJob(null);
        setApproveNotes("");
    };

    const openClose = (job: Job) => {
        setClosingJob(job);
        setCloseReason(CLOSE_REASONS[0]);
        setCloseNotes("");
        setIsCloseOpen(true);
    };

    const handleClose = async () => {
        if (!closingJob) return;
        await closeJobApi(closingJob.id);
        toast({
            title: "Requisition closed",
            description: `${closingJob.title} — Reason: ${closeReason}`,
        });
        setIsCloseOpen(false);
        setClosingJob(null);
    };

    const openDistribute = (job: Job) => {
        setDistributeJob(job);
        setIsDistributeOpen(true);
    };

    const openDetail = (job: Job) => {
        setDetailJob(job);
        setDetailTab("overview");
        setIsDetailOpen(true);
    };

    const openDelete = (ids: string[]) => {
        const label =
            ids.length === 1
                ? jobs.find((j) => j.id === ids[0])?.title ?? "this job"
                : `${ids.length} requisitions`;
        setDeleteTarget({ ids, label });
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        // Backend only supports Close (not hard delete) — map delete → close.
        await Promise.all(deleteTarget.ids.map((id) => closeJobApi(id)));
        toast({
            title: "Closed",
            description: `${deleteTarget.label} closed.`,
            variant: "destructive",
        });
        setSelectedIds((ids) => ids.filter((id) => !deleteTarget.ids.includes(id)));
        setIsDeleteOpen(false);
        setDeleteTarget(null);
    };

    // Selection helpers
    const allVisibleIds = filteredJobs.map((j) => j.id);
    const allSelectedOnPage =
        allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));
    const toggleSelectAll = () =>
        setSelectedIds(allSelectedOnPage ? [] : [...allVisibleIds]);
    const toggleSelect = (id: string) =>
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );

    // Bulk ops
    const handleBulkClose = async () => {
        const count = selectedIds.length;
        await Promise.all(selectedIds.map((id) => closeJobApi(id)));
        toast({
            title: "Bulk close",
            description: `${count} requisitions closed.`,
        });
        setSelectedIds([]);
    };

    const handleBulkDuplicate = () => {
        selectedIds.forEach((id) => {
            const j = jobs.find((x) => x.id === id);
            if (!j) return;
            addJob({
                title: `${j.title} (Copy)`,
                department: j.department,
                location: j.location,
                type: j.type,
                experience: j.experience,
                salaryRange: j.salaryRange,
                description: j.description,
                skills: j.skills,
                hiringManagerId: j.hiringManagerId,
                recruiters: j.recruiters,
            });
        });
        toast({
            title: "Bulk duplicate",
            description: `${selectedIds.length} requisitions duplicated.`,
        });
        setSelectedIds([]);
    };

    const handleBulkSubmitApproval = () => {
        selectedIds.forEach((id) => submitJobForApproval(id));
        toast({
            title: "Bulk submission",
            description: `${selectedIds.length} submitted for approval.`,
        });
        setSelectedIds([]);
    };

    // ── Import / Export ──
    const handleExportCSV = () => {
        const header = [
            "Title",
            "Department",
            "Location",
            "Type",
            "Status",
            "Applicants",
            "Posted",
        ];
        const rows = filteredJobs.map((j) => [
            `"${j.title.replace(/"/g, '""')}"`,
            j.department,
            j.location,
            j.type,
            j.workflowStatus,
            String(liveApplicants(j.id)),
            j.postedDate,
        ]);
        const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `job-openings-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
            title: "Export ready",
            description: `${rows.length} rows exported.`,
        });
    };

    const handleImport = () => {
        try {
            const data = JSON.parse(importText);
            if (!Array.isArray(data)) {
                throw new Error("Expected an array of jobs");
            }
            let count = 0;
            data.forEach((item: any) => {
                if (!item?.title) return;
                addJob({
                    title: String(item.title),
                    department: item.department || "Engineering",
                    location: item.location || "Remote",
                    type: (item.type || "Full-time") as Job["type"],
                    experience: item.experience || "3-5 Years",
                    salaryRange: item.salaryRange || "Not specified",
                    description: item.description || "",
                    skills: Array.isArray(item.skills) ? item.skills : [],
                    hiringManagerId: item.hiringManagerId || "EMP-002",
                    recruiters: Array.isArray(item.recruiters) ? item.recruiters : [],
                });
                count += 1;
            });
            toast({
                title: "Imported",
                description: `${count} requisitions imported.`,
            });
            setIsImportOpen(false);
            setImportText("");
        } catch (err: any) {
            toast({
                title: "Import failed",
                description: err?.message || "Invalid JSON",
                variant: "destructive",
            });
        }
    };

    // Clear selection when tab changes
    useEffect(() => {
        setSelectedIds([]);
    }, [activeTab]);

    // ─────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────
    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] font-sans">
            <div className="p-6 space-y-6">
                {/* ── Header ────────────────────────────────────────────── */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Job Openings
                        </h1>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            Create, approve, distribute and track all active requisitions.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsImportOpen(true)}
                            className="h-9 rounded-xl border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Upload className="mr-1.5 h-3.5 w-3.5" /> Import JSON
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExportCSV}
                            className="h-9 rounded-xl border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
                        </Button>
                        <div className="flex h-9 items-center rounded-xl border border-slate-200 bg-white p-1">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold transition ${viewMode === "table"
                                        ? "bg-violet-50 text-violet-700"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <List className="h-3.5 w-3.5" /> Table
                            </button>
                            <button
                                onClick={() => setViewMode("card")}
                                className={`flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold transition ${viewMode === "card"
                                        ? "bg-violet-50 text-violet-700"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <LayoutGrid className="h-3.5 w-3.5" /> Cards
                            </button>
                        </div>
                        <Button
                            onClick={openCreate}
                            className="h-9 rounded-xl bg-[#8B5CF6] px-4 text-[11px] font-semibold text-white shadow-sm hover:bg-[#7c4df0]"
                        >
                            <Plus className="mr-1.5 h-3.5 w-3.5" /> Post Requisition
                        </Button>
                    </div>
                </div>

                {/* ── Stats ─────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                    <StatCard
                        label="Total Open"
                        value={stats.open}
                        icon={<Briefcase className="h-3.5 w-3.5" />}
                        accent="violet"
                    />
                    <StatCard
                        label="Pending Approval"
                        value={stats.pending}
                        icon={<Clock className="h-3.5 w-3.5" />}
                        accent="amber"
                    />
                    <StatCard
                        label="Applicants / week"
                        value={stats.applicantsThisWeek}
                        icon={<Users className="h-3.5 w-3.5" />}
                        accent="emerald"
                    />
                    <StatCard
                        label="Total Views"
                        value={stats.views}
                        icon={<Eye className="h-3.5 w-3.5" />}
                        accent="blue"
                    />
                    <StatCard
                        label="Fill Rate"
                        value={`${stats.fillRate}%`}
                        icon={<TrendingUp className="h-3.5 w-3.5" />}
                        accent="indigo"
                    />
                </div>

                {/* ── Body grid: main + sidebar ─────────────────────────── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
                    <div className="space-y-4">
                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="h-10 rounded-xl border border-slate-200 bg-white p-1">
                                <TabTrigger id="all" label="All" count={tabCounts.all} />
                                <TabTrigger id="active" label="Active" count={tabCounts.active} />
                                <TabTrigger id="pending" label="Pending Approval" count={tabCounts.pending} />
                                <TabTrigger id="drafts" label="Drafts" count={tabCounts.drafts} />
                                <TabTrigger id="hold" label="On Hold" count={tabCounts.hold} />
                                <TabTrigger id="closed" label="Closed" count={tabCounts.closed} />
                            </TabsList>

                            <TabsContent value={activeTab} className="mt-0" />
                        </Tabs>

                        {/* Search / Filter / Sort */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search by title or department..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-9 rounded-xl border-slate-200 bg-white pl-9 text-[11px] font-medium"
                                />
                            </div>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-9 rounded-xl border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <Filter className="mr-1.5 h-3.5 w-3.5" /> Filters
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="end"
                                    className="w-[360px] rounded-2xl border-slate-200 bg-white p-4 shadow-xl"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                                                Filters
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setFilterDept("all");
                                                    setFilterLocation("all");
                                                    setFilterType("all");
                                                    setFilterExperience("all");
                                                    setFilterSalary("all");
                                                    setFilterStatus("all");
                                                    setFilterManager("all");
                                                }}
                                                className="h-7 rounded-md text-[10px] font-semibold text-violet-600 hover:text-violet-700"
                                            >
                                                Reset
                                            </Button>
                                        </div>

                                        <FilterRow label="Department">
                                            <Select value={filterDept} onValueChange={setFilterDept}>
                                                <SelectTrigger className="h-8 rounded-lg text-[11px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All departments</SelectItem>
                                                    {DEPARTMENTS.map((d) => (
                                                        <SelectItem key={d} value={d}>
                                                            {d}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FilterRow>

                                        <FilterRow label="Location">
                                            <Select value={filterLocation} onValueChange={setFilterLocation}>
                                                <SelectTrigger className="h-8 rounded-lg text-[11px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All locations</SelectItem>
                                                    {LOCATIONS.map((l) => (
                                                        <SelectItem key={l} value={l}>
                                                            {l}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FilterRow>

                                        <FilterRow label="Type">
                                            <Select value={filterType} onValueChange={setFilterType}>
                                                <SelectTrigger className="h-8 rounded-lg text-[11px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All types</SelectItem>
                                                    {EMPLOYMENT_TYPES.map((t) => (
                                                        <SelectItem key={t} value={t}>
                                                            {t}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FilterRow>

                                        <FilterRow label="Experience">
                                            <Select value={filterExperience} onValueChange={setFilterExperience}>
                                                <SelectTrigger className="h-8 rounded-lg text-[11px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All experience</SelectItem>
                                                    {EXPERIENCE_LEVELS.map((e) => (
                                                        <SelectItem key={e} value={e}>
                                                            {e}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FilterRow>

                                        <FilterRow label="Salary">
                                            <Select value={filterSalary} onValueChange={setFilterSalary}>
                                                <SelectTrigger className="h-8 rounded-lg text-[11px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Any salary</SelectItem>
                                                    <SelectItem value="lt10">Below ₹10L</SelectItem>
                                                    <SelectItem value="10_25">₹10L – ₹25L</SelectItem>
                                                    <SelectItem value="25_50">₹25L – ₹50L</SelectItem>
                                                    <SelectItem value="gt50">Above ₹50L</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FilterRow>

                                        <FilterRow label="Status">
                                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                <SelectTrigger className="h-8 rounded-lg text-[11px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All statuses</SelectItem>
                                                    <SelectItem value="Draft">Draft</SelectItem>
                                                    <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                                                    <SelectItem value="Approved">Approved</SelectItem>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="On Hold">On Hold</SelectItem>
                                                    <SelectItem value="Closed">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FilterRow>

                                        <FilterRow label="Hiring manager">
                                            <Select value={filterManager} onValueChange={setFilterManager}>
                                                <SelectTrigger className="h-8 rounded-lg text-[11px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All managers</SelectItem>
                                                    {HIRING_MANAGERS.map((m) => (
                                                        <SelectItem key={m.id} value={m.id}>
                                                            {m.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FilterRow>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                                <SelectTrigger className="h-9 w-[170px] rounded-xl border-slate-200 bg-white text-[11px] font-semibold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                    <SelectItem value="applicants">Most Applicants</SelectItem>
                                    <SelectItem value="views">Most Views</SelectItem>
                                    <SelectItem value="title">Title A – Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ── Main list area ─────────────────────────────── */}
                        {filteredJobs.length === 0 ? (
                            <EmptyState onCreate={openCreate} />
                        ) : viewMode === "table" ? (
                            <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
                                <Table>
                                    <TableHeader className="bg-slate-50/80">
                                        <TableRow className="border-slate-200 hover:bg-transparent">
                                            <TableHead className="w-10 pl-4">
                                                <Checkbox
                                                    checked={allSelectedOnPage}
                                                    onCheckedChange={toggleSelectAll}
                                                    className="h-3.5 w-3.5"
                                                />
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Position
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Type
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Experience
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Salary
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Applicants
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Views
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Posted
                                            </TableHead>
                                            <TableHead className="pr-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredJobs.map((job) => (
                                            <TableRow
                                                key={job.id}
                                                onClick={() => openDetail(job)}
                                                className="group border-slate-100 transition hover:bg-violet-50/30 cursor-pointer"
                                            >
                                                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                                                    <Checkbox
                                                        checked={selectedIds.includes(job.id)}
                                                        onCheckedChange={() => toggleSelect(job.id)}
                                                        className="h-3.5 w-3.5"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => openDetail(job)}
                                                        className="flex flex-col items-start gap-0.5 text-left"
                                                    >
                                                        <span className="text-sm font-semibold text-slate-900 group-hover:text-violet-700">
                                                            {job.title}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                                            <Building2 className="h-3 w-3" /> {job.department}
                                                            <span className="mx-1 text-slate-300">•</span>
                                                            <MapPin className="h-3 w-3" /> {job.location}
                                                        </span>
                                                    </button>
                                                </TableCell>
                                                <TableCell>
                                                    <TypePill type={job.type} />
                                                </TableCell>
                                                <TableCell className="text-[11px] font-medium text-slate-700">
                                                    {job.experience}
                                                </TableCell>
                                                <TableCell className="text-[11px] font-semibold tabular-nums text-slate-800">
                                                    {job.salaryRange}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-md bg-violet-50 px-2 text-[11px] font-bold tabular-nums text-violet-700">
                                                        {liveApplicants(job.id)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-[11px] font-semibold tabular-nums text-slate-700">
                                                    {job.views}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusPill status={job.workflowStatus} />
                                                </TableCell>
                                                <TableCell className="text-[11px] font-medium tabular-nums text-slate-600">
                                                    {job.postedDate}
                                                </TableCell>
                                                <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <RowActions
                                                        job={job}
                                                        onView={openDetail}
                                                        onEdit={openEdit}
                                                        onDuplicate={openDuplicate}
                                                        onSubmitApproval={openSubmitApproval}
                                                        onApprove={(j) => openApproveReject(j, "approve")}
                                                        onReject={(j) => openApproveReject(j, "reject")}
                                                        onClose={openClose}
                                                        onDistribute={openDistribute}
                                                        onDelete={(j) => openDelete([j.id])}
                                                        onViewCandidates={(j) =>
                                                            router.push(`/hrmcubicle/hire/candidates?jobId=${j.id}`)
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {filteredJobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        applicants={liveApplicants(job.id)}
                                        selected={selectedIds.includes(job.id)}
                                        onToggleSelect={() => toggleSelect(job.id)}
                                        onView={() => openDetail(job)}
                                        onEdit={() => openEdit(job)}
                                        onDuplicate={() => openDuplicate(job)}
                                        onSubmitApproval={() => openSubmitApproval(job)}
                                        onApprove={() => openApproveReject(job, "approve")}
                                        onReject={() => openApproveReject(job, "reject")}
                                        onClose={() => openClose(job)}
                                        onDistribute={() => openDistribute(job)}
                                        onDelete={() => openDelete([job.id])}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Templates sidebar (lg+) ───────────────────────── */}
                    <aside className="hidden lg:block">
                        <Card className="sticky top-4 rounded-2xl border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Job Templates
                                </div>
                                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                            </div>
                            <div className="space-y-2">
                                {JOB_TEMPLATES.map((tmpl) => {
                                    const Icon = tmpl.icon;
                                    return (
                                        <button
                                            key={tmpl.id}
                                            onClick={() => handleUseTemplate(tmpl)}
                                            className="group flex w-full items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-2.5 text-left transition hover:border-violet-200 hover:bg-violet-50/40"
                                        >
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${templateAccent[tmpl.accent]}`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-[11px] font-semibold text-slate-800 group-hover:text-violet-700">
                                                    {tmpl.title}
                                                </div>
                                                <div className="truncate text-[10px] font-medium text-slate-500">
                                                    {tmpl.department} • {tmpl.skills.slice(0, 2).join(", ")}
                                                </div>
                                            </div>
                                            <ChevronRight className="mt-1 h-3.5 w-3.5 text-slate-300 group-hover:text-violet-500" />
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-3">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                                    Pro tip
                                </div>
                                <p className="mt-1 text-[11px] font-medium text-slate-700">
                                    Templates pre-fill title, skills and description. You can edit any field before posting.
                                </p>
                            </div>
                        </Card>
                    </aside>
                </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                Floating Bulk Bar
            ───────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-xl"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-violet-600" />
                                <span className="text-[11px] font-bold tabular-nums text-violet-700">
                                    {selectedIds.length} selected
                                </span>
                            </div>
                            <div className="h-6 w-px bg-slate-200" />
                            <Button
                                variant="ghost"
                                onClick={handleBulkClose}
                                className="h-8 rounded-lg px-3 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                <XCircle className="mr-1 h-3.5 w-3.5" /> Close
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={handleBulkDuplicate}
                                className="h-8 rounded-lg px-3 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                <Copy className="mr-1 h-3.5 w-3.5" /> Duplicate
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={handleBulkSubmitApproval}
                                className="h-8 rounded-lg px-3 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                <Send className="mr-1 h-3.5 w-3.5" /> Submit
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => openDelete(selectedIds)}
                                className="h-8 rounded-lg px-3 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                            >
                                <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                            </Button>
                            <div className="h-6 w-px bg-slate-200" />
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedIds([])}
                                className="h-8 rounded-lg px-2 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────
                Dialog 1 — Create / Edit Job (3-step)
            ───────────────────────────────────────────────────────── */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-slate-200 bg-white p-0 sm:max-w-3xl">
                    <DialogHeader className="border-b border-slate-100 px-6 py-4">
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            {editingId ? "Edit Requisition" : "Post a New Requisition"}
                        </DialogTitle>
                        <DialogDescription className="text-[11px] font-medium text-slate-500">
                            Step {createStep} of 3 — {createStep === 1 ? "Basics" : createStep === 2 ? "Requirements" : "Workflow"}
                        </DialogDescription>

                        {/* Step indicator */}
                        <div className="mt-3 flex items-center gap-2">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex flex-1 items-center gap-2">
                                    <div
                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${s < createStep
                                                ? "bg-violet-600 text-white"
                                                : s === createStep
                                                    ? "bg-violet-100 text-violet-700 ring-2 ring-violet-300"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}
                                    >
                                        {s < createStep ? <CheckCircle2 className="h-3 w-3" /> : s}
                                    </div>
                                    <div
                                        className={`text-[10px] font-semibold uppercase tracking-wider ${s === createStep ? "text-slate-800" : "text-slate-400"
                                            }`}
                                    >
                                        {s === 1 ? "Basics" : s === 2 ? "Requirements" : "Workflow"}
                                    </div>
                                    {s < 3 && <div className="flex-1 border-t border-dashed border-slate-200" />}
                                </div>
                            ))}
                        </div>
                    </DialogHeader>

                    <div className="px-6 py-5">
                        {/* ── Step 1 — Basics ── */}
                        {createStep === 1 && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Job title *
                                    </Label>
                                    <Input
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="e.g. Senior Frontend Engineer"
                                        className="h-10 rounded-xl border-slate-200 bg-white text-xs font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Department *
                                    </Label>
                                    <Select
                                        value={form.department}
                                        onValueChange={(v) => setForm({ ...form, department: v, position: "" })}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200 text-xs font-medium">
                                            <SelectValue placeholder={deptOptions.length ? "Select department" : "Loading departments..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {deptOptions.length === 0 ? (
                                                <div className="px-2 py-1.5 text-[11px] text-slate-500">
                                                    No departments available
                                                </div>
                                            ) : (
                                                deptOptions.map((d) => (
                                                    <SelectItem key={d._id} value={d._id}>
                                                        {d.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Position *
                                    </Label>
                                    <Select
                                        value={form.position}
                                        onValueChange={(v) => setForm({ ...form, position: v })}
                                        disabled={!form.department}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200 text-xs font-medium">
                                            <SelectValue placeholder={form.department ? "Select position" : "Pick a department first"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(() => {
                                                const filtered = positionOptions.filter(
                                                    (p) => !form.department || !p.department || p.department === form.department,
                                                );
                                                if (filtered.length === 0) {
                                                    return (
                                                        <div className="px-2 py-1.5 text-[11px] text-slate-500">
                                                            No positions available
                                                        </div>
                                                    );
                                                }
                                                return filtered.map((p) => (
                                                    <SelectItem key={p._id} value={p._id}>
                                                        {p.name}
                                                    </SelectItem>
                                                ));
                                            })()}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Location
                                    </Label>
                                    <Select
                                        value={form.location}
                                        onValueChange={(v) => setForm({ ...form, location: v })}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200 text-xs font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LOCATIONS.map((l) => (
                                                <SelectItem key={l} value={l}>
                                                    {l}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Employment type
                                    </Label>
                                    <Select
                                        value={form.type}
                                        onValueChange={(v) => setForm({ ...form, type: v as Job["type"] })}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200 text-xs font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EMPLOYMENT_TYPES.map((t) => (
                                                <SelectItem key={t} value={t}>
                                                    {t}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Experience
                                    </Label>
                                    <Select
                                        value={form.experience}
                                        onValueChange={(v) => setForm({ ...form, experience: v })}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200 text-xs font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EXPERIENCE_LEVELS.map((e) => (
                                                <SelectItem key={e} value={e}>
                                                    {e}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Salary range *
                                    </Label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={form.salaryRange}
                                            onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
                                            placeholder="e.g. ₹25L – ₹40L"
                                            className="h-10 rounded-xl border-slate-200 bg-white pl-9 text-xs font-medium tabular-nums"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <div>
                                        <div className="text-[11px] font-semibold text-slate-800">
                                            Remote work allowed
                                        </div>
                                        <div className="text-[10px] font-medium text-slate-500">
                                            Display remote-friendly badge in listings.
                                        </div>
                                    </div>
                                    <Switch
                                        checked={form.remote}
                                        onCheckedChange={(v) => setForm({ ...form, remote: v })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Step 2 — Requirements ── */}
                        {createStep === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Skills
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={form.skillInput}
                                            onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddSkill();
                                                }
                                            }}
                                            placeholder="Type a skill and press Enter"
                                            className="h-10 rounded-xl border-slate-200 bg-white text-xs font-medium"
                                        />
                                        <Button
                                            onClick={handleAddSkill}
                                            className="h-10 rounded-xl bg-[#8B5CF6] px-4 text-[11px] font-semibold text-white hover:bg-[#7c4df0]"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    {form.skills.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {form.skills.map((s) => (
                                                <span
                                                    key={s}
                                                    className="inline-flex items-center gap-1 rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700"
                                                >
                                                    {s}
                                                    <button
                                                        onClick={() => handleRemoveSkill(s)}
                                                        className="rounded-sm hover:bg-violet-100"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Description
                                    </Label>
                                    <Textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="What does this role do? Who is a good fit?"
                                        className="min-h-[110px] rounded-xl border-slate-200 bg-white text-xs font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Key responsibilities
                                    </Label>
                                    <Textarea
                                        value={form.responsibilities}
                                        onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                                        placeholder="List top 4–6 responsibilities (one per line)"
                                        className="min-h-[110px] rounded-xl border-slate-200 bg-white text-xs font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Step 3 — Workflow ── */}
                        {createStep === 3 && (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Hiring manager
                                    </Label>
                                    <Select
                                        value={form.hiringManagerId}
                                        onValueChange={(v) => setForm({ ...form, hiringManagerId: v })}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200 text-xs font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {HIRING_MANAGERS.map((m) => (
                                                <SelectItem key={m.id} value={m.id}>
                                                    {m.name} — {m.role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Assigned recruiters
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {RECRUITERS.map((r) => {
                                            const active = form.recruiters.includes(r.id);
                                            return (
                                                <button
                                                    key={r.id}
                                                    onClick={() => handleToggleRecruiter(r.id)}
                                                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${active
                                                            ? "border-violet-300 bg-violet-50"
                                                            : "border-slate-200 bg-white hover:border-violet-200"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${active
                                                                    ? "bg-violet-600 text-white"
                                                                    : "bg-slate-100 text-slate-600"
                                                                }`}
                                                        >
                                                            {r.name.charAt(0)}
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-slate-700">
                                                            {r.name}
                                                        </span>
                                                    </div>
                                                    {active && (
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-violet-600" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        Approval chain (in order)
                                    </Label>
                                    <div className="space-y-1.5">
                                        {APPROVERS.map((a, idx) => {
                                            const active = form.approvalChain.includes(a.id);
                                            const step = form.approvalChain.indexOf(a.id) + 1;
                                            return (
                                                <button
                                                    key={a.id}
                                                    onClick={() => handleToggleApprover(a.id)}
                                                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition ${active
                                                            ? "border-violet-300 bg-violet-50"
                                                            : "border-slate-200 bg-white hover:border-violet-200"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <GripVertical className="h-3.5 w-3.5 text-slate-300" />
                                                        <div
                                                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${active
                                                                    ? "bg-violet-600 text-white"
                                                                    : "bg-slate-100 text-slate-500"
                                                                }`}
                                                        >
                                                            {active ? step : idx + 1}
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-slate-700">
                                                            {a.name}
                                                        </span>
                                                    </div>
                                                    {active && (
                                                        <span className="text-[10px] font-semibold text-violet-700">
                                                            Step {step}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="border-t border-slate-100 bg-slate-50/50 px-6 py-3">
                        <div className="flex w-full items-center justify-between gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsCreateOpen(false)}
                                className="h-9 rounded-xl px-4 text-[11px] font-semibold text-slate-500"
                            >
                                Cancel
                            </Button>
                            <div className="flex gap-2">
                                {createStep > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setCreateStep((s) => (s - 1) as 1 | 2 | 3)}
                                        className="h-9 rounded-xl border-slate-200 bg-white px-4 text-[11px] font-semibold text-slate-700"
                                    >
                                        Back
                                    </Button>
                                )}
                                {createStep < 3 ? (
                                    <Button
                                        onClick={() => setCreateStep((s) => (s + 1) as 1 | 2 | 3)}
                                        className="h-9 rounded-xl bg-[#8B5CF6] px-4 text-[11px] font-semibold text-white hover:bg-[#7c4df0]"
                                    >
                                        Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSaveJob}
                                        className="h-9 rounded-xl bg-[#8B5CF6] px-6 text-[11px] font-semibold text-white hover:bg-[#7c4df0]"
                                    >
                                        {editingId ? "Save changes" : "Create requisition"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─────────────────────────────────────────────────────────
                Dialog 2 — Duplicate Job
            ───────────────────────────────────────────────────────── */}
            <Dialog open={isDuplicateOpen} onOpenChange={setIsDuplicateOpen}>
                <DialogContent className="rounded-2xl border-slate-200 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Duplicate requisition
                        </DialogTitle>
                        <DialogDescription className="text-[11px] font-medium text-slate-500">
                            A copy will be created as a draft. You can edit it before publishing.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            New title
                        </Label>
                        <Input
                            value={duplicateTitle}
                            onChange={(e) => setDuplicateTitle(e.target.value)}
                            className="h-10 rounded-xl border-slate-200 text-xs font-medium"
                        />
                        {duplicatingJob && (
                            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] font-medium text-slate-600">
                                <div>Source: <span className="font-semibold text-slate-800">{duplicatingJob.title}</span></div>
                                <div>Dept: {duplicatingJob.department} • {duplicatingJob.location}</div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDuplicateOpen(false)}
                            className="h-9 rounded-xl text-[11px] font-semibold text-slate-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDuplicate}
                            className="h-9 rounded-xl bg-[#8B5CF6] px-4 text-[11px] font-semibold text-white hover:bg-[#7c4df0]"
                        >
                            <Copy className="mr-1.5 h-3.5 w-3.5" /> Duplicate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─────────────────────────────────────────────────────────
                Dialog 3 — Submit for Approval
            ───────────────────────────────────────────────────────── */}
            <Dialog open={isSubmitApprovalOpen} onOpenChange={setIsSubmitApprovalOpen}>
                <DialogContent className="rounded-2xl border-slate-200 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Submit for approval
                        </DialogTitle>
                        <DialogDescription className="text-[11px] font-medium text-slate-500">
                            Approvers will be notified in the order shown below.
                        </DialogDescription>
                    </DialogHeader>
                    {approvalTargetJob && (
                        <div className="space-y-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <div className="text-[11px] font-semibold text-slate-800">
                                    {approvalTargetJob.title}
                                </div>
                                <div className="text-[10px] font-medium text-slate-500">
                                    {approvalTargetJob.department} • {approvalTargetJob.location}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <SectionLabel>Approval chain</SectionLabel>
                                {approvalTargetJob.approvalChain.length > 0 ? (
                                    approvalTargetJob.approvalChain.map((a) => {
                                        const person = APPROVERS.find((x) => x.id === a.approver);
                                        return (
                                            <div
                                                key={a.step}
                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                                                        {a.step}
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-slate-700">
                                                        {person?.name ?? a.approver}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-semibold text-amber-600">
                                                    Pending
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-[11px] font-medium text-slate-500">
                                        No approvers configured. Default CHRO approval will be used.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsSubmitApprovalOpen(false)}
                            className="h-9 rounded-xl text-[11px] font-semibold text-slate-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitApproval}
                            className="h-9 rounded-xl bg-[#8B5CF6] px-4 text-[11px] font-semibold text-white hover:bg-[#7c4df0]"
                        >
                            <Send className="mr-1.5 h-3.5 w-3.5" /> Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─────────────────────────────────────────────────────────
                Dialog 4 — Approve / Reject
            ───────────────────────────────────────────────────────── */}
            <Dialog open={isApproveRejectOpen} onOpenChange={setIsApproveRejectOpen}>
                <DialogContent className="rounded-2xl border-slate-200 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            {approveRejectMode === "approve" ? "Approve requisition" : "Reject requisition"}
                        </DialogTitle>
                        <DialogDescription className="text-[11px] font-medium text-slate-500">
                            {approveRejectMode === "approve"
                                ? "Once approved, the job will become Active and visible to distribution channels."
                                : "The job will be sent back to Draft with your notes."}
                        </DialogDescription>
                    </DialogHeader>
                    {approveRejectJob && (
                        <div className="space-y-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px]">
                                <div className="font-semibold text-slate-800">{approveRejectJob.title}</div>
                                <div className="text-slate-500">{approveRejectJob.department}</div>
                            </div>
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Notes {approveRejectMode === "reject" ? "(required)" : "(optional)"}
                            </Label>
                            <Textarea
                                value={approveNotes}
                                onChange={(e) => setApproveNotes(e.target.value)}
                                placeholder={
                                    approveRejectMode === "approve"
                                        ? "Add any approval notes..."
                                        : "Why is this being rejected?"
                                }
                                className="min-h-[80px] rounded-xl border-slate-200 text-xs font-medium"
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsApproveRejectOpen(false)}
                            className="h-9 rounded-xl text-[11px] font-semibold text-slate-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApproveReject}
                            className={`h-9 rounded-xl px-4 text-[11px] font-semibold text-white ${approveRejectMode === "approve"
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : "bg-rose-600 hover:bg-rose-700"
                                }`}
                        >
                            {approveRejectMode === "approve" ? (
                                <>
                                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─────────────────────────────────────────────────────────
                Dialog 5 — Close Job
            ───────────────────────────────────────────────────────── */}
            <Dialog open={isCloseOpen} onOpenChange={setIsCloseOpen}>
                <DialogContent className="rounded-2xl border-slate-200 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Close requisition
                        </DialogTitle>
                        <DialogDescription className="text-[11px] font-medium text-slate-500">
                            Closing a requisition will remove it from active listings.
                        </DialogDescription>
                    </DialogHeader>
                    {closingJob && (
                        <div className="space-y-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px]">
                                <div className="font-semibold text-slate-800">{closingJob.title}</div>
                                <div className="text-slate-500">{closingJob.department}</div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Reason
                                </Label>
                                <Select value={closeReason} onValueChange={setCloseReason}>
                                    <SelectTrigger className="h-10 rounded-xl border-slate-200 text-xs font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CLOSE_REASONS.map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {r}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Notes (optional)
                                </Label>
                                <Textarea
                                    value={closeNotes}
                                    onChange={(e) => setCloseNotes(e.target.value)}
                                    placeholder="Additional context..."
                                    className="min-h-[70px] rounded-xl border-slate-200 text-xs font-medium"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsCloseOpen(false)}
                            className="h-9 rounded-xl text-[11px] font-semibold text-slate-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleClose}
                            className="h-9 rounded-xl bg-rose-600 px-4 text-[11px] font-semibold text-white hover:bg-rose-700"
                        >
                            <XCircle className="mr-1.5 h-3.5 w-3.5" /> Close requisition
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─────────────────────────────────────────────────────────
                Dialog 6 — Distribute
            ───────────────────────────────────────────────────────── */}
            <Dialog open={isDistributeOpen} onOpenChange={setIsDistributeOpen}>
                <DialogContent className="rounded-2xl border-slate-200 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Distribute to channels
                        </DialogTitle>
                        <DialogDescription className="text-[11px] font-medium text-slate-500">
                            Post this requisition to external job boards and your career page.
                        </DialogDescription>
                    </DialogHeader>
                    {distributeJob && (
                        <div className="space-y-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px]">
                                <div className="font-semibold text-slate-800">{distributeJob.title}</div>
                                <div className="text-slate-500">
                                    {distributeJob.department} • {distributeJob.location}
                                </div>
                            </div>

                            {/* Char count info */}
                            <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-2 text-[10px] font-semibold text-amber-700">
                                <div className="flex items-center gap-1.5">
                                    <AlertTriangle className="h-3 w-3" />
                                    Description: {distributeJob.description.length} / 2000 chars
                                </div>
                                <span>
                                    {distributeJob.description.length > 500 ? "OK" : "Short"}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <ChannelRow
                                    icon={<Linkedin className="h-4 w-4 text-[#0A66C2]" />}
                                    label="LinkedIn Jobs"
                                    subLabel="Posted within 10 minutes • ~1.2M professionals"
                                    checked={distributeChannels.linkedin}
                                    onChange={(v) =>
                                        setDistributeChannels((c) => ({ ...c, linkedin: v }))
                                    }
                                />
                                <ChannelRow
                                    icon={<Globe className="h-4 w-4 text-[#2164F3]" />}
                                    label="Indeed"
                                    subLabel="Global reach • Auto-cross-posted"
                                    checked={distributeChannels.indeed}
                                    onChange={(v) =>
                                        setDistributeChannels((c) => ({ ...c, indeed: v }))
                                    }
                                />
                                <ChannelRow
                                    icon={<Briefcase className="h-4 w-4 text-[#FF7555]" />}
                                    label="Naukri.com"
                                    subLabel="India's largest — tech & non-tech"
                                    checked={distributeChannels.naukri}
                                    onChange={(v) =>
                                        setDistributeChannels((c) => ({ ...c, naukri: v }))
                                    }
                                />
                                <ChannelRow
                                    icon={<Award className="h-4 w-4 text-violet-600" />}
                                    label="AngelList (Wellfound)"
                                    subLabel="Startup talent • best for early-stage"
                                    checked={distributeChannels.angellist}
                                    onChange={(v) =>
                                        setDistributeChannels((c) => ({ ...c, angellist: v }))
                                    }
                                />
                                <ChannelRow
                                    icon={<Globe className="h-4 w-4 text-emerald-600" />}
                                    label="Career Page"
                                    subLabel="fixlsolutions.com/careers"
                                    checked={distributeChannels.careerPage}
                                    onChange={(v) =>
                                        setDistributeChannels((c) => ({ ...c, careerPage: v }))
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                                    <Link2 className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="truncate">
                                        https://careers.fixlsolutions.com/{distributeJob.id}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        navigator?.clipboard?.writeText(
                                            `https://careers.fixlsolutions.com/${distributeJob.id}`,
                                        );
                                        toast({
                                            title: "Link copied",
                                            description: "Public share link ready to paste.",
                                        });
                                    }}
                                    className="h-7 rounded-md px-2 text-[10px] font-semibold text-violet-700 hover:bg-violet-50"
                                >
                                    <Copy className="mr-1 h-3 w-3" /> Copy
                                </Button>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDistributeOpen(false)}
                            className="h-9 rounded-xl text-[11px] font-semibold text-slate-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                const count = Object.values(distributeChannels).filter(Boolean).length;
                                toast({
                                    title: "Distribution scheduled",
                                    description: `Posting to ${count} channel${count === 1 ? "" : "s"}.`,
                                });
                                setIsDistributeOpen(false);
                            }}
                            className="h-9 rounded-xl bg-[#8B5CF6] px-4 text-[11px] font-semibold text-white hover:bg-[#7c4df0]"
                        >
                            <Share2 className="mr-1.5 h-3.5 w-3.5" /> Distribute
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─────────────────────────────────────────────────────────
                Dialog 7 — Detail Sheet
            ───────────────────────────────────────────────────────── */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent
                    side="right"
                    className="w-full overflow-y-auto bg-white p-0 sm:max-w-xl"
                >
                    {detailJob && (
                        <>
                            <SheetHeader className="border-b border-slate-100 px-6 py-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <SheetTitle className="text-lg font-bold text-slate-900">
                                            {detailJob.title}
                                        </SheetTitle>
                                        <SheetDescription className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="h-3 w-3" /> {detailJob.department}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {detailJob.location}
                                            </span>
                                            <span>•</span>
                                            <TypePill type={detailJob.type} />
                                        </SheetDescription>
                                    </div>
                                    <StatusPill status={detailJob.workflowStatus} />
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setIsDetailOpen(false);
                                            openEdit(detailJob);
                                        }}
                                        className="h-8 rounded-lg border-slate-200 text-[10px] font-semibold"
                                    >
                                        <Edit className="mr-1 h-3 w-3" /> Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setIsDetailOpen(false);
                                            openDuplicate(detailJob);
                                        }}
                                        className="h-8 rounded-lg border-slate-200 text-[10px] font-semibold"
                                    >
                                        <Copy className="mr-1 h-3 w-3" /> Duplicate
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setIsDetailOpen(false);
                                            openDistribute(detailJob);
                                        }}
                                        className="h-8 rounded-lg border-slate-200 text-[10px] font-semibold"
                                    >
                                        <Share2 className="mr-1 h-3 w-3" /> Distribute
                                    </Button>
                                </div>
                            </SheetHeader>

                            {/* Tabs */}
                            <div className="border-b border-slate-100 px-6">
                                <div className="flex gap-1">
                                    {(
                                        [
                                            { id: "overview", label: "Overview" },
                                            { id: "applicants", label: `Applicants (${liveApplicants(detailJob.id)})` },
                                            { id: "approvals", label: "Approval chain" },
                                            { id: "activity", label: "Activity" },
                                        ] as const
                                    ).map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setDetailTab(t.id)}
                                            className={`relative px-3 py-2.5 text-[11px] font-semibold transition ${detailTab === t.id
                                                    ? "text-violet-700"
                                                    : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            {t.label}
                                            {detailTab === t.id && (
                                                <motion.div
                                                    layoutId="detail-tab-underline"
                                                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-t-full bg-violet-600"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-6 py-5">
                                {/* Overview */}
                                {detailTab === "overview" && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-3 gap-3">
                                            <MiniStat label="Applicants" value={liveApplicants(detailJob.id)} />
                                            <MiniStat label="Views" value={detailJob.views} />
                                            <MiniStat label="Experience" value={detailJob.experience} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <SectionLabel>Salary</SectionLabel>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold tabular-nums text-slate-800">
                                                {detailJob.salaryRange}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <SectionLabel>Description</SectionLabel>
                                            <p className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] font-medium leading-relaxed text-slate-700">
                                                {detailJob.description || (
                                                    <span className="text-slate-400">No description provided.</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <SectionLabel>Skills</SectionLabel>
                                            <div className="flex flex-wrap gap-1.5">
                                                {detailJob.skills.length > 0 ? (
                                                    detailJob.skills.map((s) => (
                                                        <span
                                                            key={s}
                                                            className="inline-flex items-center rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[11px] font-medium text-slate-400">
                                                        No skills listed.
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <SectionLabel>Hiring manager</SectionLabel>
                                                <div className="text-[11px] font-semibold text-slate-700">
                                                    {HIRING_MANAGERS.find((h) => h.id === detailJob.hiringManagerId)
                                                        ?.name ?? detailJob.hiringManagerId}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <SectionLabel>Recruiters</SectionLabel>
                                                <div className="text-[11px] font-semibold text-slate-700">
                                                    {detailJob.recruiters
                                                        .map(
                                                            (r) =>
                                                                RECRUITERS.find((x) => x.id === r)?.name ?? r,
                                                        )
                                                        .join(", ") || "—"}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <SectionLabel>Posted</SectionLabel>
                                                <div className="text-[11px] font-semibold tabular-nums text-slate-700">
                                                    {detailJob.postedDate}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <SectionLabel>Job ID</SectionLabel>
                                                <div className="text-[11px] font-semibold tabular-nums text-slate-700">
                                                    {detailJob.id}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Applicants */}
                                {detailTab === "applicants" && (
                                    <div className="space-y-2">
                                        {candidates
                                            .filter((c) => c.jobId === detailJob.id)
                                            .map((c) => (
                                                <div
                                                    key={c.id}
                                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-[11px] font-bold text-violet-700">
                                                            {c.firstName.charAt(0)}
                                                            {c.lastName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] font-semibold text-slate-800">
                                                                {c.firstName} {c.lastName}
                                                            </div>
                                                            <div className="text-[10px] font-medium text-slate-500">
                                                                {c.email} • {c.location}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge className="rounded-md bg-emerald-50 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50">
                                                        {c.stage}
                                                    </Badge>
                                                </div>
                                            ))}
                                        {candidates.filter((c) => c.jobId === detailJob.id).length === 0 && (
                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-[11px] font-medium text-slate-500">
                                                No applicants yet.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Approval chain */}
                                {detailTab === "approvals" && (
                                    <div className="space-y-2">
                                        {detailJob.approvalChain.length === 0 ? (
                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-[11px] font-medium text-slate-500">
                                                No approval chain configured.
                                            </div>
                                        ) : (
                                            detailJob.approvalChain.map((a) => {
                                                const person = APPROVERS.find((x) => x.id === a.approver);
                                                const color =
                                                    a.status === "Approved"
                                                        ? "text-emerald-600 bg-emerald-50"
                                                        : a.status === "Rejected"
                                                            ? "text-rose-600 bg-rose-50"
                                                            : "text-amber-600 bg-amber-50";
                                                return (
                                                    <div
                                                        key={a.step}
                                                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                                                                {a.step}
                                                            </div>
                                                            <span className="text-[11px] font-semibold text-slate-800">
                                                                {person?.name ?? a.approver}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${color}`}
                                                        >
                                                            {a.status}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {/* Activity */}
                                {detailTab === "activity" && (
                                    <div className="space-y-2">
                                        {detailJob.logs.length === 0 ? (
                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-[11px] font-medium text-slate-500">
                                                No activity yet.
                                            </div>
                                        ) : (
                                            detailJob.logs.map((log) => (
                                                <div
                                                    key={log.id}
                                                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
                                                >
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                                        <Activity className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-semibold text-slate-800">
                                                                {log.action}
                                                            </span>
                                                            <span className="text-[10px] font-medium tabular-nums text-slate-400">
                                                                {new Date(log.timestamp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                                                            {log.details} • by {log.performer}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* ─────────────────────────────────────────────────────────
                Dialog 8 — Delete confirm (single + bulk)
            ───────────────────────────────────────────────────────── */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="rounded-2xl border-slate-200 sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50">
                                <AlertTriangle className="h-4 w-4 text-rose-600" />
                            </div>
                            Delete {deleteTarget?.ids.length === 1 ? "requisition" : "requisitions"}?
                        </DialogTitle>
                        <DialogDescription className="text-[11px] font-medium text-slate-500">
                            Permanently delete <strong className="text-slate-700">{deleteTarget?.label}</strong>.
                            This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteOpen(false)}
                            className="h-9 rounded-xl text-[11px] font-semibold text-slate-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="h-9 rounded-xl bg-rose-600 px-4 text-[11px] font-semibold text-white hover:bg-rose-700"
                        >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─────────────────────────────────────────────────────────
                Extra — Import JSON (auxiliary)
            ───────────────────────────────────────────────────────── */}
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogContent className="rounded-2xl border-slate-200 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Import jobs from JSON
                        </DialogTitle>
                        <DialogDescription className="text-[11px] font-medium text-slate-500">
                            Paste an array of job objects. Each must at minimum include a title.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder='[{"title": "Backend Engineer", "department": "Engineering", "location": "Bangalore"}]'
                        className="min-h-[180px] rounded-xl border-slate-200 font-mono text-[11px]"
                    />
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsImportOpen(false)}
                            className="h-9 rounded-xl text-[11px] font-semibold text-slate-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleImport}
                            className="h-9 rounded-xl bg-[#8B5CF6] px-4 text-[11px] font-semibold text-white hover:bg-[#7c4df0]"
                        >
                            <Upload className="mr-1.5 h-3.5 w-3.5" /> Import
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

const StatCard = ({
    label,
    value,
    icon,
    accent,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    accent: "violet" | "amber" | "emerald" | "blue" | "indigo";
}) => {
    const map: Record<string, string> = {
        violet: "text-violet-600 bg-violet-50",
        amber: "text-amber-600 bg-amber-50",
        emerald: "text-emerald-600 bg-emerald-50",
        blue: "text-blue-600 bg-blue-50",
        indigo: "text-indigo-600 bg-indigo-50",
    };
    return (
        <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {label}
                    </div>
                    <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                        {value}
                    </div>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${map[accent]}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

const TabTrigger = ({ id, label, count }: { id: string; label: string; count: number }) => (
    <TabsTrigger
        value={id}
        className="h-8 rounded-lg px-3 text-[11px] font-semibold text-slate-500 transition data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 data-[state=active]:shadow-none"
    >
        <span>{label}</span>
        <span className="ml-1.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-slate-600 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700">
            {count}
        </span>
    </TabsTrigger>
);

const FilterRow = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-1">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {label}
        </Label>
        {children}
    </div>
);

const MiniStat = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
            {label}
        </div>
        <div className="mt-0.5 text-sm font-bold tabular-nums text-slate-900">
            {value}
        </div>
    </div>
);

const ChannelRow = ({
    icon,
    label,
    subLabel,
    checked,
    onChange,
}: {
    icon: React.ReactNode;
    label: string;
    subLabel: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5">
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                {icon}
            </div>
            <div>
                <div className="text-[11px] font-semibold text-slate-800">{label}</div>
                <div className="text-[10px] font-medium text-slate-500">{subLabel}</div>
            </div>
        </div>
        <Switch checked={checked} onCheckedChange={onChange} />
    </div>
);

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
    <Card className="rounded-2xl border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
            <Briefcase className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">No requisitions found</h3>
        <p className="mt-1 text-[11px] font-medium text-slate-500">
            Try adjusting filters, or post your first requisition.
        </p>
        <Button
            onClick={onCreate}
            className="mt-4 h-9 rounded-xl bg-[#8B5CF6] px-5 text-[11px] font-semibold text-white hover:bg-[#7c4df0]"
        >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Post a requisition
        </Button>
    </Card>
);

const RowActions = ({
    job,
    onView,
    onEdit,
    onDuplicate,
    onSubmitApproval,
    onApprove,
    onReject,
    onClose,
    onDistribute,
    onDelete,
    onViewCandidates,
}: {
    job: Job;
    onView: (j: Job) => void;
    onEdit: (j: Job) => void;
    onDuplicate: (j: Job) => void;
    onSubmitApproval: (j: Job) => void;
    onApprove: (j: Job) => void;
    onReject: (j: Job) => void;
    onClose: (j: Job) => void;
    onDistribute: (j: Job) => void;
    onDelete: (j: Job) => void;
    onViewCandidates: (j: Job) => void;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-200 p-1">
            <DropdownMenuItem
                onClick={() => onView(job)}
                className="rounded-lg text-[11px] font-semibold"
            >
                <Eye className="mr-2 h-3.5 w-3.5" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => onEdit(job)}
                className="rounded-lg text-[11px] font-semibold"
            >
                <Edit className="mr-2 h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => onDuplicate(job)}
                className="rounded-lg text-[11px] font-semibold"
            >
                <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => onViewCandidates(job)}
                className="rounded-lg text-[11px] font-semibold"
            >
                <Users className="mr-2 h-3.5 w-3.5" /> View candidates
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {job.workflowStatus === "Draft" && (
                <DropdownMenuItem
                    onClick={() => onSubmitApproval(job)}
                    className="rounded-lg text-[11px] font-semibold text-violet-700"
                >
                    <Send className="mr-2 h-3.5 w-3.5" /> Submit for approval
                </DropdownMenuItem>
            )}
            {job.workflowStatus === "Pending Approval" && (
                <>
                    <DropdownMenuItem
                        onClick={() => onApprove(job)}
                        className="rounded-lg text-[11px] font-semibold text-emerald-700"
                    >
                        <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onReject(job)}
                        className="rounded-lg text-[11px] font-semibold text-rose-700"
                    >
                        <XCircle className="mr-2 h-3.5 w-3.5" /> Reject
                    </DropdownMenuItem>
                </>
            )}
            {(job.workflowStatus === "Active" || job.workflowStatus === "Approved") && (
                <DropdownMenuItem
                    onClick={() => onDistribute(job)}
                    className="rounded-lg text-[11px] font-semibold"
                >
                    <Share2 className="mr-2 h-3.5 w-3.5" /> Distribute
                </DropdownMenuItem>
            )}
            {job.workflowStatus !== "Closed" && (
                <DropdownMenuItem
                    onClick={() => onClose(job)}
                    className="rounded-lg text-[11px] font-semibold"
                >
                    {job.workflowStatus === "On Hold" ? (
                        <>
                            <Play className="mr-2 h-3.5 w-3.5" /> Close job
                        </>
                    ) : (
                        <>
                            <Pause className="mr-2 h-3.5 w-3.5" /> Close job
                        </>
                    )}
                </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={() => onDelete(job)}
                className="rounded-lg text-[11px] font-semibold text-rose-700 focus:bg-rose-50 focus:text-rose-700"
            >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const JobCard = ({
    job,
    applicants,
    selected,
    onToggleSelect,
    onView,
    onEdit,
    onDuplicate,
    onSubmitApproval,
    onApprove,
    onReject,
    onClose,
    onDistribute,
    onDelete,
}: {
    job: Job;
    applicants: number;
    selected: boolean;
    onToggleSelect: () => void;
    onView: () => void;
    onEdit: () => void;
    onDuplicate: () => void;
    onSubmitApproval: () => void;
    onApprove: () => void;
    onReject: () => void;
    onClose: () => void;
    onDistribute: () => void;
    onDelete: () => void;
}) => (
    <Card
        className={`group rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selected ? "border-violet-300 ring-2 ring-violet-100" : "border-slate-200"
            }`}
    >
        <div className="flex items-start justify-between gap-2 px-4 pt-4">
            <div className="flex items-start gap-2">
                <Checkbox
                    checked={selected}
                    onCheckedChange={onToggleSelect}
                    className="mt-0.5 h-3.5 w-3.5"
                />
                <StatusPill status={job.workflowStatus} />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 rounded-lg p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 p-1">
                    <DropdownMenuItem onClick={onView} className="rounded-lg text-[11px] font-semibold">
                        <Eye className="mr-2 h-3.5 w-3.5" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onEdit} className="rounded-lg text-[11px] font-semibold">
                        <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDuplicate} className="rounded-lg text-[11px] font-semibold">
                        <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {job.workflowStatus === "Draft" && (
                        <DropdownMenuItem onClick={onSubmitApproval} className="rounded-lg text-[11px] font-semibold text-violet-700">
                            <Send className="mr-2 h-3.5 w-3.5" /> Submit approval
                        </DropdownMenuItem>
                    )}
                    {job.workflowStatus === "Pending Approval" && (
                        <>
                            <DropdownMenuItem onClick={onApprove} className="rounded-lg text-[11px] font-semibold text-emerald-700">
                                <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onReject} className="rounded-lg text-[11px] font-semibold text-rose-700">
                                <XCircle className="mr-2 h-3.5 w-3.5" /> Reject
                            </DropdownMenuItem>
                        </>
                    )}
                    {(job.workflowStatus === "Active" || job.workflowStatus === "Approved") && (
                        <DropdownMenuItem onClick={onDistribute} className="rounded-lg text-[11px] font-semibold">
                            <Share2 className="mr-2 h-3.5 w-3.5" /> Distribute
                        </DropdownMenuItem>
                    )}
                    {job.workflowStatus !== "Closed" && (
                        <DropdownMenuItem onClick={onClose} className="rounded-lg text-[11px] font-semibold">
                            <Pause className="mr-2 h-3.5 w-3.5" /> Close
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="rounded-lg text-[11px] font-semibold text-rose-700 focus:bg-rose-50 focus:text-rose-700"
                    >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <button
            onClick={onView}
            className="mt-3 block w-full px-4 text-left"
        >
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-700">
                {job.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {job.department}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                </span>
            </div>
        </button>

        <div className="mt-3 flex flex-wrap gap-1.5 px-4">
            <TypePill type={job.type} />
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                {job.experience}
            </span>
            <span className="inline-flex items-center rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-emerald-700">
                {job.salaryRange}
            </span>
        </div>

        {job.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1 px-4">
                {job.skills.slice(0, 4).map((s) => (
                    <span
                        key={s}
                        className="rounded-md border border-violet-100 bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold text-violet-700"
                    >
                        {s}
                    </span>
                ))}
                {job.skills.length > 4 && (
                    <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                        +{job.skills.length - 4}
                    </span>
                )}
            </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3">
            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-violet-500" />
                    <span className="tabular-nums">{applicants}</span> apps
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-blue-500" />
                    <span className="tabular-nums">{job.views}</span> views
                </span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                <Calendar className="h-3 w-3" />
                <span className="tabular-nums">{job.postedDate}</span>
            </span>
        </div>
    </Card>
);

export default JobOpeningsPage;
