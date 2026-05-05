"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
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
import {
    useHireStore,
    type Offer,
    type OfferTemplate,
    type OfferTemplateType,
    type OfferCounter,
} from "@/shared/data/hire-store";
import {
    FileText,
    Send,
    Copy,
    Download,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Sparkles,
    FileSignature,
    History,
    ArrowLeftRight,
    Mail,
    IndianRupee,
    Plus,
    X,
    Calendar,
    Building2,
    User,
    Award,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckSquare,
    Square,
    Layers,
} from "lucide-react";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Zod schema — Generate Offer form                                    */
/* ------------------------------------------------------------------ */

const offerFormSchema = z.object({
    candidateId: z.string().min(1, "Candidate is required"),
    jobId: z.string().min(1, "Job is required"),
    offerDate: z.string().min(1, "Offer date is required"),
    baseSalary: z.number().positive("Base salary must be > 0"),
    bonus: z.number().min(0).optional(),
    currency: z.string().optional(),
    payFrequency: z.enum(["Monthly", "Annually"]).optional(),
    jobTitle: z.string().optional(),
    location: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatINR = (n: number) => {
    if (!n && n !== 0) return "—";
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString("en-IN")}`;
};

const formatINRFull = (n: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(n || 0);

const formatDate = (d?: string) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const daysBetween = (target?: string) => {
    if (!target) return null;
    const t = new Date(target).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    return Math.round((t - now) / (1000 * 60 * 60 * 24));
};

const isExpired = (o: Offer) => {
    if (!o.expiryDate) return false;
    const d = daysBetween(o.expiryDate);
    return d !== null && d < 0 && o.signatureStatus !== "Signed";
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const inDaysISO = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

const approvalStyles: Record<Offer["approvalStatus"], string> = {
    Draft: "bg-slate-100 text-slate-700 border-slate-200",
    "Pending Approval":
        "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-blue-50 text-blue-700 border-blue-200",
    Sent: "bg-violet-50 text-violet-700 border-violet-200",
    Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const approvalIcons: Record<Offer["approvalStatus"], React.ReactNode> = {
    Draft: <FileText className="h-3 w-3" />,
    "Pending Approval": <Clock className="h-3 w-3" />,
    Approved: <CheckCircle2 className="h-3 w-3" />,
    Sent: <Send className="h-3 w-3" />,
    Accepted: <CheckCircle2 className="h-3 w-3" />,
    Rejected: <XCircle className="h-3 w-3" />,
};

const ApprovalBadge: React.FC<{ status: Offer["approvalStatus"] }> = ({
    status,
}) => (
    <Badge
        variant="outline"
        className={`${approvalStyles[status]} border px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider inline-flex items-center gap-1`}
    >
        {approvalIcons[status]}
        {status}
    </Badge>
);

const signatureStyles: Record<string, string> = {
    "Not Sent": "bg-slate-100 text-slate-600 border-slate-200",
    Sent: "bg-amber-50 text-amber-700 border-amber-200",
    Signed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Declined: "bg-rose-50 text-rose-700 border-rose-200",
    Expired: "bg-slate-100 text-slate-500 border-slate-200",
};

const SignatureBadge: React.FC<{ status?: string }> = ({
    status = "Not Sent",
}) => (
    <Badge
        variant="outline"
        className={`${signatureStyles[status] || signatureStyles["Not Sent"]} border px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider inline-flex items-center gap-1`}
    >
        <FileSignature className="h-3 w-3" />
        {status}
    </Badge>
);

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */

const OfferLettersPage: React.FC = () => {
    const {
        offers,
        offerTemplates,
        candidates,
        jobs,
        addOffer,
        updateOffer,
        deleteOffer,
        submitOfferForApproval,
        createOfferVersion,
        sendOfferForSignature,
        markOfferSigned,
        markOfferDeclined,
        submitCounterOffer,
        respondToCounterOffer,
        sendOfferEmail,
        bulkSendOffers,
        addOfferTemplate,
        updateOfferTemplate,
        deleteOfferTemplate,
    } = useHireStore();

    // API actions (backend-integrated)
    const loadOffersFromApi = useHireStore((s) => s.loadOffersFromApi);
    const loadCandidatesFromApi = useHireStore((s) => s.loadCandidatesFromApi);
    const loadJobsFromApi = useHireStore((s) => s.loadJobsFromApi);
    const hasLoadedOffers = useHireStore((s) => s.hasLoaded.offers);
    const hasLoadedCands = useHireStore((s) => s.hasLoaded.candidates);
    const hasLoadedJobs = useHireStore((s) => s.hasLoaded.jobs);
    const offersLoading = useHireStore((s) => s.loading.offers);
    const addOfferApi = useHireStore((s) => s.addOfferApi);
    const updateOfferApi = useHireStore((s) => s.updateOfferApi);
    const updateOfferStatusApi = useHireStore((s) => s.updateOfferStatusApi);
    const deleteOfferApi = useHireStore((s) => s.deleteOfferApi);

    useEffect(() => {
        if (!hasLoadedOffers) loadOffersFromApi();
        if (!hasLoadedCands) loadCandidatesFromApi();
        if (!hasLoadedJobs) loadJobsFromApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { toast } = useToast();

    /* ---------------- State ---------------- */
    const [activeTab, setActiveTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [, setTick] = useState(0);

    // Dialog open states
    const [genOpen, setGenOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [versionOpen, setVersionOpen] = useState(false);
    const [signatureOpen, setSignatureOpen] = useState(false);
    const [markSignedOpen, setMarkSignedOpen] = useState(false);
    const [markDeclinedOpen, setMarkDeclinedOpen] = useState(false);
    const [counterOpen, setCounterOpen] = useState(false);
    const [templatesOpen, setTemplatesOpen] = useState(false);
    const [bulkSendOpen, setBulkSendOpen] = useState(false);

    // Active offer for various dialogs
    const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
    const activeOffer = useMemo(
        () => offers.find((o) => o.id === activeOfferId) || null,
        [offers, activeOfferId]
    );

    /* Auto-refresh for expiry countdowns */
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 60000);
        return () => clearInterval(id);
    }, []);

    /* ---------------- Stats ---------------- */
    const stats = useMemo(() => {
        const draft = offers.filter((o) => o.approvalStatus === "Draft").length;
        const pending = offers.filter(
            (o) => o.approvalStatus === "Pending Approval"
        ).length;
        const sent = offers.filter(
            (o) =>
                o.approvalStatus === "Sent" &&
                o.signatureStatus !== "Signed" &&
                !isExpired(o)
        ).length;
        const accepted = offers.filter(
            (o) =>
                o.approvalStatus === "Accepted" ||
                o.signatureStatus === "Signed"
        ).length;
        const rejected = offers.filter(
            (o) => o.approvalStatus === "Rejected"
        ).length;
        const totalFinal = sent + accepted + rejected;
        const declineRate =
            totalFinal === 0
                ? 0
                : Math.round((rejected / totalFinal) * 100);
        return { draft, pending, sent, accepted, rejected, declineRate };
    }, [offers]);

    /* ---------------- Filtering ---------------- */
    const filteredOffers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return offers.filter((o) => {
            if (q) {
                const hay = `${o.candidateName} ${o.role} ${o.department} ${o.candidateEmail ?? ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            const expired = isExpired(o);
            switch (activeTab) {
                case "draft":
                    return o.approvalStatus === "Draft";
                case "pending":
                    return o.approvalStatus === "Pending Approval";
                case "sent":
                    return (
                        o.approvalStatus === "Sent" &&
                        o.signatureStatus !== "Signed" &&
                        !expired
                    );
                case "accepted":
                    return (
                        o.approvalStatus === "Accepted" ||
                        o.signatureStatus === "Signed"
                    );
                case "declined":
                    return (
                        o.approvalStatus === "Rejected" ||
                        o.signatureStatus === "Declined"
                    );
                case "expired":
                    return expired;
                default:
                    return true;
            }
        });
    }, [offers, activeTab, searchQuery]);

    /* ---------------- Handlers ---------------- */
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredOffers.length) setSelectedIds([]);
        else setSelectedIds(filteredOffers.map((o) => o.id));
    };

    const handleSubmitApproval = (id: string) => {
        // TODO: backend approval workflow (BE has no approval state — local only)
        submitOfferForApproval(id);
        toast({
            title: "Submitted",
            description: "Offer submitted for approval",
        });
    };

    const handleSendForSignature = () => {
        if (!activeOffer) return;
        // TODO: backend signature flow (BE has no signature field — local only)
        const { acceptanceLink } = sendOfferForSignature(activeOffer.id);
        sendOfferEmail(activeOffer.id);
        toast({
            title: "Sent for signature",
            description: `Candidate notified. Link: ${acceptanceLink.slice(0, 40)}…`,
        });
        setSignatureOpen(false);
    };

    const handleEmailCandidate = (id: string) => {
        const r = sendOfferEmail(id);
        toast({
            title: r.success ? "Email sent" : "Email bounced",
            description: r.success
                ? "Candidate notified"
                : "Delivery failed — please retry",
            variant: r.success ? "default" : "destructive",
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this offer letter?")) return;
        try {
            await deleteOfferApi(id);
            toast({
                title: "Deleted",
                description: "Offer removed",
                variant: "destructive",
            });
        } catch (err: any) {
            // BE rejects delete for Pending/Accepted offers
            toast({
                title: "Cannot delete",
                description: err?.message || "Offer cannot be deleted in its current status",
                variant: "destructive",
            });
        }
    };

    const handleMarkSigned = async () => {
        if (!activeOffer) return;
        await updateOfferStatusApi(
            activeOffer.id,
            "Accepted",
            new Date().toISOString()
        );
        // keep local signature flag in sync
        markOfferSigned(activeOffer.id, "127.0.0.1");
        toast({
            title: "Marked as signed",
            description: `${activeOffer.candidateName} accepted the offer`,
        });
        setMarkSignedOpen(false);
    };

    const handleDownloadPDF = (offer: Offer) => {
        const html = buildOfferHTML(offer);
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Offer_${offer.candidateName.replace(/\s+/g, "_")}_v${offer.version}.html`;
        a.click();
        URL.revokeObjectURL(url);
        toast({
            title: "Downloaded",
            description: `Offer letter for ${offer.candidateName}`,
        });
    };

    /* ------------------------------------------------------------------ */
    /* Render                                                              */
    /* ------------------------------------------------------------------ */
    return (
        <div className="flex-1 min-h-screen flex flex-col bg-[#fafbff] p-6 gap-5 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
                        Offer Letters
                    </h1>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        Generate, send for signature, track acceptance
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setTemplatesOpen(true)}
                        className="h-9 rounded-xl border-slate-200 text-slate-700 font-semibold text-[11px] px-3"
                    >
                        <Layers className="h-3.5 w-3.5 mr-1.5" />
                        Templates
                    </Button>
                    <Button
                        variant="outline"
                        disabled={selectedIds.length === 0}
                        onClick={() => setBulkSendOpen(true)}
                        className="h-9 rounded-xl border-slate-200 text-slate-700 font-semibold text-[11px] px-3 disabled:opacity-50"
                    >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Bulk send {selectedIds.length > 0 && `(${selectedIds.length})`}
                    </Button>
                    <Button
                        onClick={() => setGenOpen(true)}
                        className="h-9 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-[11px] px-4 shadow-sm shadow-violet-200"
                    >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Generate offer
                    </Button>
                </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <StatCard
                    label="Draft"
                    value={stats.draft}
                    icon={<FileText className="h-4 w-4" />}
                    tone="slate"
                />
                <StatCard
                    label="Pending Approval"
                    value={stats.pending}
                    icon={<Clock className="h-4 w-4" />}
                    tone="amber"
                />
                <StatCard
                    label="Awaiting Signature"
                    value={stats.sent}
                    icon={<FileSignature className="h-4 w-4" />}
                    tone="violet"
                />
                <StatCard
                    label="Accepted"
                    value={stats.accepted}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    tone="emerald"
                />
                <StatCard
                    label="Decline Rate"
                    value={`${stats.declineRate}%`}
                    icon={<XCircle className="h-4 w-4" />}
                    tone="rose"
                />
            </div>

            {/* Main card */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <TabsList className="bg-slate-50 p-1 rounded-xl h-9">
                            {[
                                { v: "all", l: "All" },
                                { v: "draft", l: "Draft" },
                                { v: "pending", l: "Pending Approval" },
                                { v: "sent", l: "Sent" },
                                { v: "accepted", l: "Accepted" },
                                { v: "declined", l: "Declined" },
                                { v: "expired", l: "Expired" },
                            ].map((t) => (
                                <TabsTrigger
                                    key={t.v}
                                    value={t.v}
                                    className="rounded-lg px-3 h-7 font-semibold text-[11px] text-slate-500 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm"
                                >
                                    {t.l}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder="Search candidate, role, email…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 rounded-lg border border-slate-200 bg-slate-50 h-9 text-[11px] font-medium focus-visible:ring-2 focus-visible:ring-violet-100"
                            />
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="m-0 flex-1 overflow-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                                <TableRow className="border-slate-100 hover:bg-transparent">
                                    <TableHead className="w-10 pl-5">
                                        <button
                                            onClick={toggleSelectAll}
                                            className="text-slate-400 hover:text-violet-600 transition"
                                        >
                                            {selectedIds.length > 0 && selectedIds.length === filteredOffers.length ? (
                                                <CheckSquare className="h-4 w-4 text-violet-600" />
                                            ) : (
                                                <Square className="h-4 w-4" />
                                            )}
                                        </button>
                                    </TableHead>
                                    {[
                                        "Candidate",
                                        "Role",
                                        "CTC",
                                        "Joining",
                                        "Expiry",
                                        "Approval",
                                        "Signature",
                                        "Version",
                                        "",
                                    ].map((h, i) => (
                                        <TableHead
                                            key={i}
                                            className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider h-11"
                                        >
                                            {h}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOffers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="h-60 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <FileText className="h-10 w-10 text-slate-200" />
                                                <p className="font-semibold text-sm">No offers found</p>
                                                <p className="text-[11px]">Generate your first offer letter</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOffers.map((offer) => {
                                        const exp = daysBetween(offer.expiryDate);
                                        const join = daysBetween(offer.joiningDate);
                                        const expired = isExpired(offer);
                                        const sig = expired ? "Expired" : offer.signatureStatus ?? "Not Sent";
                                        return (
                                            <TableRow
                                                key={offer.id}
                                                className="border-slate-100 hover:bg-slate-50/50 group"
                                            >
                                                <TableCell className="pl-5">
                                                    <button
                                                        onClick={() => toggleSelect(offer.id)}
                                                        className="text-slate-400 hover:text-violet-600"
                                                    >
                                                        {selectedIds.includes(offer.id) ? (
                                                            <CheckSquare className="h-4 w-4 text-violet-600" />
                                                        ) : (
                                                            <Square className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-[10px] font-bold">
                                                            {offer.candidateName
                                                                .split(" ")
                                                                .map((s) => s[0])
                                                                .slice(0, 2)
                                                                .join("")
                                                                .toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-slate-900 text-xs">
                                                                {offer.candidateName}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-medium">
                                                                {offer.candidateEmail || "—"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-700 text-xs">
                                                            {offer.role}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                            {offer.department}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <span className="font-bold text-slate-900 text-sm tabular-nums">
                                                        {formatINR(offer.totalCtc)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <span
                                                        className={`text-[11px] font-semibold tabular-nums ${join !== null && join >= 0 && join <= 30
                                                                ? "text-amber-600"
                                                                : "text-slate-600"
                                                            }`}
                                                    >
                                                        {formatDate(offer.joiningDate)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    {offer.expiryDate ? (
                                                        <span
                                                            className={`text-[11px] font-semibold ${exp !== null && exp < 0
                                                                    ? "text-rose-600"
                                                                    : exp !== null && exp < 7
                                                                        ? "text-rose-500"
                                                                        : "text-slate-500"
                                                                }`}
                                                        >
                                                            {exp !== null && exp < 0
                                                                ? "Expired"
                                                                : exp !== null
                                                                    ? `Expires in ${exp}d`
                                                                    : formatDate(offer.expiryDate)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-300">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <ApprovalBadge status={offer.approvalStatus} />
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <SignatureBadge status={sig} />
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <button
                                                        onClick={() => {
                                                            setActiveOfferId(offer.id);
                                                            setPreviewOpen(true);
                                                        }}
                                                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
                                                    >
                                                        v{offer.version}
                                                        {offer.versions && offer.versions.length > 0 && (
                                                            <span className="ml-1 text-indigo-400">
                                                                +{offer.versions.length}
                                                            </span>
                                                        )}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="py-3 pr-5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-56 rounded-xl shadow-xl border border-slate-200 p-1 font-semibold text-[11px]"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setActiveOfferId(offer.id);
                                                                    setPreviewOpen(true);
                                                                }}
                                                                className="rounded-lg h-8 gap-2"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                                View / Preview
                                                            </DropdownMenuItem>
                                                            {(offer.approvalStatus === "Draft" ||
                                                                offer.approvalStatus === "Pending Approval") && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActiveOfferId(offer.id);
                                                                            setEditOpen(true);
                                                                        }}
                                                                        className="rounded-lg h-8 gap-2"
                                                                    >
                                                                        <Edit className="h-3.5 w-3.5" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                )}
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setActiveOfferId(offer.id);
                                                                    setVersionOpen(true);
                                                                }}
                                                                className="rounded-lg h-8 gap-2"
                                                            >
                                                                <History className="h-3.5 w-3.5" />
                                                                Create new version
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            {offer.approvalStatus === "Draft" && (
                                                                <DropdownMenuItem
                                                                    onClick={() => handleSubmitApproval(offer.id)}
                                                                    className="rounded-lg h-8 gap-2 text-amber-700"
                                                                >
                                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                                    Submit for approval
                                                                </DropdownMenuItem>
                                                            )}
                                                            {offer.approvalStatus === "Approved" && (
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setActiveOfferId(offer.id);
                                                                        setSignatureOpen(true);
                                                                    }}
                                                                    className="rounded-lg h-8 gap-2 text-violet-700"
                                                                >
                                                                    <Send className="h-3.5 w-3.5" />
                                                                    Send for signature
                                                                </DropdownMenuItem>
                                                            )}
                                                            {(offer.approvalStatus === "Sent" ||
                                                                offer.approvalStatus === "Accepted") && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleEmailCandidate(offer.id)}
                                                                        className="rounded-lg h-8 gap-2"
                                                                    >
                                                                        <Mail className="h-3.5 w-3.5" />
                                                                        Email to candidate
                                                                    </DropdownMenuItem>
                                                                )}
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setActiveOfferId(offer.id);
                                                                    setMarkSignedOpen(true);
                                                                }}
                                                                className="rounded-lg h-8 gap-2 text-emerald-700"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                Mark signed
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setActiveOfferId(offer.id);
                                                                    setMarkDeclinedOpen(true);
                                                                }}
                                                                className="rounded-lg h-8 gap-2 text-rose-700"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" />
                                                                Mark declined
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setActiveOfferId(offer.id);
                                                                    setCounterOpen(true);
                                                                }}
                                                                className="rounded-lg h-8 gap-2"
                                                            >
                                                                <ArrowLeftRight className="h-3.5 w-3.5" />
                                                                Counter offers
                                                                {offer.counterOffers && offer.counterOffers.length > 0 && (
                                                                    <span className="ml-auto text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                                                                        {offer.counterOffers.length}
                                                                    </span>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDownloadPDF(offer)}
                                                                className="rounded-lg h-8 gap-2"
                                                            >
                                                                <Download className="h-3.5 w-3.5" />
                                                                Download PDF
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(offer.id)}
                                                                className="rounded-lg h-8 gap-2 text-rose-600 focus:bg-rose-50"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </Card>

            {/* Dialogs */}
            <GenerateOfferDialog
                open={genOpen}
                onOpenChange={setGenOpen}
                candidates={candidates}
                jobs={jobs}
                templates={offerTemplates}
                onCreate={(data) => {
                    addOffer(data);
                    toast({
                        title: "Offer drafted",
                        description: `${data.candidateName} — ${formatINR(data.totalCtc)} CTC`,
                    });
                }}
            />

            <EditOfferDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                offer={activeOffer}
                templates={offerTemplates}
                onSave={(id, updates) => {
                    updateOffer(id, updates);
                    toast({
                        title: "Offer updated",
                        description: "Changes saved",
                    });
                }}
            />

            <PreviewOfferDialog
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                offer={activeOffer}
                onDownload={handleDownloadPDF}
                onSendForSignature={() => {
                    setPreviewOpen(false);
                    setSignatureOpen(true);
                }}
            />

            <NewVersionDialog
                open={versionOpen}
                onOpenChange={setVersionOpen}
                onSubmit={(changes) => {
                    if (!activeOffer) return;
                    createOfferVersion(activeOffer.id, changes, "HR Manager");
                    toast({
                        title: "New version created",
                        description: `${activeOffer.candidateName} • v${activeOffer.version + 1}`,
                    });
                }}
            />

            <SendSignatureDialog
                open={signatureOpen}
                onOpenChange={setSignatureOpen}
                offer={activeOffer}
                onConfirm={handleSendForSignature}
            />

            <MarkSignedDialog
                open={markSignedOpen}
                onOpenChange={setMarkSignedOpen}
                offer={activeOffer}
                onConfirm={handleMarkSigned}
            />

            <MarkDeclinedDialog
                open={markDeclinedOpen}
                onOpenChange={setMarkDeclinedOpen}
                offer={activeOffer}
                onConfirm={(reason, recordCounter) => {
                    if (!activeOffer) return;
                    markOfferDeclined(activeOffer.id, reason);
                    toast({
                        title: "Marked declined",
                        description: reason || "No reason provided",
                        variant: "destructive",
                    });
                    setMarkDeclinedOpen(false);
                    if (recordCounter) {
                        setTimeout(() => setCounterOpen(true), 200);
                    }
                }}
            />

            <CounterOfferDialog
                open={counterOpen}
                onOpenChange={setCounterOpen}
                offer={activeOffer}
                onSubmit={(counter) => {
                    if (!activeOffer) return;
                    submitCounterOffer(activeOffer.id, counter);
                    toast({
                        title: "Counter offer submitted",
                        description: counter.notes || "—",
                    });
                }}
                onRespond={(counterId, accept, notes) => {
                    respondToCounterOffer(counterId, accept, notes);
                    toast({
                        title: accept ? "Counter accepted" : "Counter rejected",
                        description: notes || "—",
                    });
                }}
            />

            <TemplatesDialog
                open={templatesOpen}
                onOpenChange={setTemplatesOpen}
                templates={offerTemplates}
                onAdd={(t) => {
                    addOfferTemplate(t);
                    toast({ title: "Template created", description: t.name });
                }}
                onUpdate={(id, updates) => {
                    updateOfferTemplate(id, updates);
                    toast({ title: "Template updated" });
                }}
                onDelete={(id) => {
                    deleteOfferTemplate(id);
                    toast({
                        title: "Template deleted",
                        variant: "destructive",
                    });
                }}
            />

            <BulkSendDialog
                open={bulkSendOpen}
                onOpenChange={setBulkSendOpen}
                offers={offers.filter((o) => selectedIds.includes(o.id))}
                onConfirm={() => {
                    const r = bulkSendOffers(selectedIds);
                    toast({
                        title: "Bulk send complete",
                        description: `${r.sent} sent, ${r.failed} failed`,
                    });
                    setSelectedIds([]);
                    setBulkSendOpen(false);
                }}
            />
        </div>
    );
};

export default OfferLettersPage;

/* ------------------------------------------------------------------ */
/* StatCard                                                            */
/* ------------------------------------------------------------------ */

const toneMap: Record<string, { bg: string; text: string; icon: string }> = {
    slate: { bg: "bg-slate-50", text: "text-slate-700", icon: "text-slate-500" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-500" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", icon: "text-violet-500" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "text-emerald-500" },
    rose: { bg: "bg-rose-50", text: "text-rose-700", icon: "text-rose-500" },
};

const StatCard: React.FC<{
    label: string;
    value: number | string;
    icon: React.ReactNode;
    tone: keyof typeof toneMap;
}> = ({ label, value, icon, tone }) => {
    const t = toneMap[tone];
    return (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl ${t.bg} ${t.icon} flex items-center justify-center`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    {label}
                </p>
                <p className={`text-xl font-bold tabular-nums ${t.text}`}>{value}</p>
            </div>
        </Card>
    );
};

/* ------------------------------------------------------------------ */
/* Generate Offer Dialog (multi-step)                                  */
/* ------------------------------------------------------------------ */

interface CompLine {
    component: string;
    amount: number;
    isTaxable: boolean;
    percentOfCtc?: number;
}

interface OfferFormState {
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    jobId: string;
    role: string;
    department: string;
    templateId: string;
    totalCtc: number;
    salaryBreakdown: CompLine[];
    joiningBonus: number;
    variablePay: number;
    stockOptions: number;
    joiningDate: string;
    expiryDate: string;
    noticePeriod: string;
    benefits: string[];
    customClauses: { title: string; body: string }[];
}

const blankForm = (): OfferFormState => ({
    candidateId: "",
    candidateName: "",
    candidateEmail: "",
    jobId: "",
    role: "",
    department: "",
    templateId: "",
    totalCtc: 0,
    salaryBreakdown: [],
    joiningBonus: 0,
    variablePay: 0,
    stockOptions: 0,
    joiningDate: inDaysISO(30),
    expiryDate: inDaysISO(14),
    noticePeriod: "60 days",
    benefits: [],
    customClauses: [],
});

const GenerateOfferDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    candidates: any[];
    jobs: any[];
    templates: OfferTemplate[];
    onCreate: (data: any) => void;
}> = ({ open, onOpenChange, candidates, jobs, templates, onCreate }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<OfferFormState>(blankForm());

    useEffect(() => {
        if (!open) {
            setStep(1);
            setForm(blankForm());
        }
    }, [open]);

    const eligibleCandidates = candidates.filter(
        (c) => c.stage === "Interview" || c.stage === "Offer"
    );

    const selectCandidate = (id: string) => {
        const c = candidates.find((x) => x.id === id);
        if (!c) return;
        const job = jobs.find((j) => j.id === c.jobId);
        setForm((f) => ({
            ...f,
            candidateId: c.id,
            candidateName: `${c.firstName} ${c.lastName}`.trim(),
            candidateEmail: c.email,
            jobId: c.jobId,
            role: job?.title || "",
            department: job?.department || "",
        }));
    };

    const selectTemplate = (tid: string) => {
        const t = templates.find((x) => x.id === tid);
        if (!t) return;
        setForm((f) => ({
            ...f,
            templateId: tid,
            benefits: [...t.defaultBenefits],
            customClauses: t.defaultClauses.map((c) => ({ ...c })),
            salaryBreakdown: computeBreakdown(t, f.totalCtc),
        }));
    };

    const setCtc = (v: number) => {
        const t = templates.find((x) => x.id === form.templateId);
        setForm((f) => ({
            ...f,
            totalCtc: v,
            salaryBreakdown: t ? computeBreakdown(t, v) : f.salaryBreakdown,
        }));
    };

    const canSubmit = form.candidateId && form.templateId && form.totalCtc > 0 && form.joiningDate;

    const submit = () => {
        if (!canSubmit) return;
        const ctcDisplay = formatINR(form.totalCtc);
        onCreate({
            candidateId: form.candidateId,
            candidateName: form.candidateName,
            candidateEmail: form.candidateEmail,
            jobId: form.jobId,
            role: form.role,
            department: form.department,
            ctc: ctcDisplay,
            totalCtc: form.totalCtc,
            salaryBreakdown: form.salaryBreakdown.map((s) => ({
                component: s.component,
                amount: s.amount,
                isTaxable: s.isTaxable,
            })),
            joiningBonus: form.joiningBonus,
            variablePay: form.variablePay,
            stockOptions: form.stockOptions,
            joiningDate: form.joiningDate,
            expiryDate: form.expiryDate,
            templateId: form.templateId,
            noticePeriod: form.noticePeriod,
            benefits: form.benefits,
            customClauses: form.customClauses,
            signatureStatus: "Not Sent",
            emailStatus: "Not Sent",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 p-0 max-w-3xl shadow-2xl overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-3 border-b border-slate-100">
                    <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                        Generate Offer
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500 font-medium">
                        Step {step} of 4 — {["Candidate", "Template", "Compensation", "Terms"][step - 1]}
                    </DialogDescription>
                    {/* Stepper */}
                    <div className="flex items-center gap-2 pt-3">
                        {[1, 2, 3, 4].map((s) => (
                            <React.Fragment key={s}>
                                <div
                                    className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold ${s <= step
                                            ? "bg-violet-600 text-white"
                                            : "bg-slate-100 text-slate-400"
                                        }`}
                                >
                                    {s}
                                </div>
                                {s < 4 && (
                                    <div
                                        className={`h-1 flex-1 rounded-full ${s < step ? "bg-violet-600" : "bg-slate-100"
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </DialogHeader>

                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                    Candidate
                                </Label>
                                <Select
                                    value={form.candidateId}
                                    onValueChange={selectCandidate}
                                >
                                    <SelectTrigger className="h-10 rounded-lg border-slate-200 mt-1.5 text-xs">
                                        <SelectValue placeholder="Select a candidate in Interview/Offer stage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eligibleCandidates.length === 0 ? (
                                            <div className="p-4 text-xs text-slate-400 text-center">
                                                No eligible candidates
                                            </div>
                                        ) : (
                                            eligibleCandidates.map((c) => (
                                                <SelectItem key={c.id} value={c.id} className="text-xs">
                                                    {c.firstName} {c.lastName} • {c.email}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            {form.candidateId && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-700">
                                        <User className="h-3.5 w-3.5 text-violet-500" />
                                        <span className="font-semibold">{form.candidateName}</span>
                                        <span className="text-slate-400">•</span>
                                        <span>{form.candidateEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-700">
                                        <Building2 className="h-3.5 w-3.5 text-violet-500" />
                                        <span className="font-semibold">{form.role}</span>
                                        <span className="text-slate-400">•</span>
                                        <span>{form.department}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-3">
                            {templates.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => selectTemplate(t.id)}
                                    className={`text-left rounded-xl border p-4 transition ${form.templateId === t.id
                                            ? "border-violet-500 bg-violet-50/60 ring-2 ring-violet-200"
                                            : "border-slate-200 bg-white hover:border-violet-300"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <Badge
                                            variant="outline"
                                            className="text-[9px] uppercase tracking-wider font-semibold bg-violet-50 text-violet-700 border-violet-200 rounded-md"
                                        >
                                            {t.type}
                                        </Badge>
                                        {t.isDefault && (
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                        {t.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2.5 text-[10px] text-slate-400 font-medium">
                                        <span>{t.salaryStructure.length} components</span>
                                        <span>•</span>
                                        <span>{t.defaultBenefits.length} benefits</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                    Total Annual CTC (₹)
                                </Label>
                                <div className="relative mt-1.5">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                                    <Input
                                        type="number"
                                        value={form.totalCtc || ""}
                                        onChange={(e) => setCtc(Number(e.target.value))}
                                        placeholder="e.g. 1500000"
                                        className="pl-9 h-10 rounded-lg border-slate-200 bg-emerald-50/40 text-sm font-semibold tabular-nums"
                                    />
                                </div>
                            </div>

                            {form.salaryBreakdown.length > 0 && (
                                <div className="rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="grid grid-cols-[1fr_120px_70px] gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        <span>Component</span>
                                        <span className="text-right">Amount</span>
                                        <span className="text-center">Tax</span>
                                    </div>
                                    {form.salaryBreakdown.map((line, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-[1fr_120px_70px] gap-2 px-3 py-2 items-center border-b border-slate-100 last:border-0"
                                        >
                                            <Input
                                                value={line.component}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setForm((f) => ({
                                                        ...f,
                                                        salaryBreakdown: f.salaryBreakdown.map((l, j) =>
                                                            j === i ? { ...l, component: v } : l
                                                        ),
                                                    }));
                                                }}
                                                className="h-8 rounded-md border-slate-200 text-xs"
                                            />
                                            <Input
                                                type="number"
                                                value={line.amount || ""}
                                                onChange={(e) => {
                                                    const v = Number(e.target.value);
                                                    setForm((f) => ({
                                                        ...f,
                                                        salaryBreakdown: f.salaryBreakdown.map((l, j) =>
                                                            j === i ? { ...l, amount: v } : l
                                                        ),
                                                    }));
                                                }}
                                                className="h-8 rounded-md border-slate-200 text-xs text-right tabular-nums"
                                            />
                                            <div className="flex justify-center">
                                                <Checkbox
                                                    checked={line.isTaxable}
                                                    onCheckedChange={(c) => {
                                                        setForm((f) => ({
                                                            ...f,
                                                            salaryBreakdown: f.salaryBreakdown.map(
                                                                (l, j) =>
                                                                    j === i ? { ...l, isTaxable: !!c } : l
                                                            ),
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-[1fr_120px_70px] gap-2 px-3 py-2 bg-slate-50 font-bold text-xs">
                                        <span>Total</span>
                                        <span className="text-right tabular-nums">
                                            {formatINRFull(
                                                form.salaryBreakdown.reduce((s, l) => s + l.amount, 0)
                                            )}
                                        </span>
                                        <span />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Joining bonus
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.joiningBonus || ""}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                joiningBonus: Number(e.target.value),
                                            }))
                                        }
                                        className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs tabular-nums"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Variable pay
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.variablePay || ""}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                variablePay: Number(e.target.value),
                                            }))
                                        }
                                        className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs tabular-nums"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Stock options
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.stockOptions || ""}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                stockOptions: Number(e.target.value),
                                            }))
                                        }
                                        className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs tabular-nums"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Joining date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={form.joiningDate}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, joiningDate: e.target.value }))
                                        }
                                        className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Expiry date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={form.expiryDate}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, expiryDate: e.target.value }))
                                        }
                                        className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Notice period
                                    </Label>
                                    <Select
                                        value={form.noticePeriod}
                                        onValueChange={(v) =>
                                            setForm((f) => ({ ...f, noticePeriod: v }))
                                        }
                                    >
                                        <SelectTrigger className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30 days">30 days</SelectItem>
                                            <SelectItem value="60 days">60 days</SelectItem>
                                            <SelectItem value="90 days">90 days</SelectItem>
                                            <SelectItem value="Custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Benefits
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-6 px-2 text-[10px] font-semibold text-violet-600"
                                        onClick={() =>
                                            setForm((f) => ({
                                                ...f,
                                                benefits: [...f.benefits, ""],
                                            }))
                                        }
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-1.5">
                                    {form.benefits.map((b, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <Input
                                                value={b}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setForm((f) => ({
                                                        ...f,
                                                        benefits: f.benefits.map((x, j) =>
                                                            j === i ? v : x
                                                        ),
                                                    }));
                                                }}
                                                className="h-8 rounded-md border-slate-200 text-xs"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
                                                onClick={() =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        benefits: f.benefits.filter((_, j) => j !== i),
                                                    }))
                                                }
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Custom clauses
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-6 px-2 text-[10px] font-semibold text-violet-600"
                                        onClick={() =>
                                            setForm((f) => ({
                                                ...f,
                                                customClauses: [
                                                    ...f.customClauses,
                                                    { title: "", body: "" },
                                                ],
                                            }))
                                        }
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add clause
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {form.customClauses.map((c, i) => (
                                        <div
                                            key={i}
                                            className="rounded-lg border border-slate-200 p-2 space-y-1.5"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={c.title}
                                                    placeholder="Title"
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setForm((f) => ({
                                                            ...f,
                                                            customClauses: f.customClauses.map((x, j) =>
                                                                j === i ? { ...x, title: v } : x
                                                            ),
                                                        }));
                                                    }}
                                                    className="h-8 rounded-md border-slate-200 text-xs font-semibold"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
                                                    onClick={() =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            customClauses: f.customClauses.filter(
                                                                (_, j) => j !== i
                                                            ),
                                                        }))
                                                    }
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                            <Textarea
                                                value={c.body}
                                                placeholder="Body"
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setForm((f) => ({
                                                        ...f,
                                                        customClauses: f.customClauses.map((x, j) =>
                                                            j === i ? { ...x, body: v } : x
                                                        ),
                                                    }));
                                                }}
                                                className="min-h-[60px] rounded-md border-slate-200 text-xs"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2 sm:justify-between">
                    <Button
                        variant="outline"
                        disabled={step === 1}
                        onClick={() => setStep((s) => s - 1)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                        Back
                    </Button>
                    {step < 4 ? (
                        <Button
                            onClick={() => setStep((s) => s + 1)}
                            disabled={
                                (step === 1 && !form.candidateId) ||
                                (step === 2 && !form.templateId)
                            }
                            className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                        >
                            Next
                            <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            onClick={submit}
                            disabled={!canSubmit}
                            className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold disabled:opacity-50"
                        >
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            Create draft offer
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* Helper: compute breakdown from template */
function computeBreakdown(t: OfferTemplate, totalCtc: number): CompLine[] {
    return t.salaryStructure.map((s) => ({
        component: s.component,
        amount: s.percentOfCtc
            ? Math.round((totalCtc * s.percentOfCtc) / 100)
            : s.fixedAmount || 0,
        isTaxable: s.isTaxable,
        percentOfCtc: s.percentOfCtc,
    }));
}

/* ------------------------------------------------------------------ */
/* Edit Offer Dialog                                                    */
/* ------------------------------------------------------------------ */

const EditOfferDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    offer: Offer | null;
    templates: OfferTemplate[];
    onSave: (id: string, updates: Partial<Offer>) => void;
}> = ({ open, onOpenChange, offer, templates, onSave }) => {
    const [form, setForm] = useState<Partial<Offer>>({});

    useEffect(() => {
        if (offer) {
            setForm({
                role: offer.role,
                department: offer.department,
                totalCtc: offer.totalCtc,
                salaryBreakdown: offer.salaryBreakdown,
                joiningDate: offer.joiningDate,
                expiryDate: offer.expiryDate,
                noticePeriod: offer.noticePeriod,
                benefits: offer.benefits || [],
                customClauses: offer.customClauses || [],
                joiningBonus: offer.joiningBonus,
                variablePay: offer.variablePay,
                stockOptions: offer.stockOptions,
            });
        }
    }, [offer]);

    if (!offer) return null;

    const save = () => {
        const update: Partial<Offer> = {
            ...form,
            ctc: formatINR(form.totalCtc || 0),
        };
        onSave(offer.id, update);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 p-0 max-w-2xl shadow-2xl">
                <DialogHeader className="px-6 pt-6 pb-3 border-b border-slate-100">
                    <DialogTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                        <Edit className="h-4 w-4 text-violet-600" />
                        Edit Offer
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500 font-medium">
                        {offer.candidateName} • v{offer.version}
                    </DialogDescription>
                </DialogHeader>
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                Role
                            </Label>
                            <Input
                                value={form.role || ""}
                                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                                className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                Department
                            </Label>
                            <Input
                                value={form.department || ""}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, department: e.target.value }))
                                }
                                className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                Total CTC
                            </Label>
                            <Input
                                type="number"
                                value={form.totalCtc || ""}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, totalCtc: Number(e.target.value) }))
                                }
                                className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs tabular-nums"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                Joining date
                            </Label>
                            <Input
                                type="date"
                                value={form.joiningDate || ""}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, joiningDate: e.target.value }))
                                }
                                className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                Expiry
                            </Label>
                            <Input
                                type="date"
                                value={form.expiryDate || ""}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                                }
                                className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                Joining bonus
                            </Label>
                            <Input
                                type="number"
                                value={form.joiningBonus || ""}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        joiningBonus: Number(e.target.value),
                                    }))
                                }
                                className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs tabular-nums"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                Variable pay
                            </Label>
                            <Input
                                type="number"
                                value={form.variablePay || ""}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        variablePay: Number(e.target.value),
                                    }))
                                }
                                className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs tabular-nums"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                Notice period
                            </Label>
                            <Select
                                value={form.noticePeriod || "60 days"}
                                onValueChange={(v) =>
                                    setForm((f) => ({ ...f, noticePeriod: v }))
                                }
                            >
                                <SelectTrigger className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30 days">30 days</SelectItem>
                                    <SelectItem value="60 days">60 days</SelectItem>
                                    <SelectItem value="90 days">90 days</SelectItem>
                                    <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter className="px-6 py-4 border-t border-slate-100">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={save}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* Preview Dialog (PDF-style)                                          */
/* ------------------------------------------------------------------ */

const PreviewOfferDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    offer: Offer | null;
    onDownload: (offer: Offer) => void;
    onSendForSignature: () => void;
}> = ({ open, onOpenChange, offer, onDownload, onSendForSignature }) => {
    const [selectedVersion, setSelectedVersion] = useState<number | "current">(
        "current"
    );

    useEffect(() => {
        if (open) setSelectedVersion("current");
    }, [open, offer?.id]);

    if (!offer) return null;

    const displayData =
        selectedVersion === "current"
            ? {
                totalCtc: offer.totalCtc,
                joiningDate: offer.joiningDate,
                label: `v${offer.version} (current)`,
            }
            : (() => {
                const v = offer.versions?.find((x) => x.version === selectedVersion);
                return v
                    ? {
                        totalCtc: v.totalCtc,
                        joiningDate: v.joiningDate,
                        label: `v${v.version} — ${v.changes}`,
                    }
                    : {
                        totalCtc: offer.totalCtc,
                        joiningDate: offer.joiningDate,
                        label: `v${offer.version} (current)`,
                    };
            })();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 p-0 max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
                <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                            <FileText className="h-4 w-4 text-violet-600" />
                            Offer Letter Preview
                        </DialogTitle>
                        <DialogDescription className="text-[11px] text-slate-500 font-medium">
                            {offer.candidateName}
                        </DialogDescription>
                    </div>
                    {offer.versions && offer.versions.length > 0 && (
                        <Select
                            value={String(selectedVersion)}
                            onValueChange={(v) =>
                                setSelectedVersion(v === "current" ? "current" : Number(v))
                            }
                        >
                            <SelectTrigger className="h-8 w-44 rounded-lg text-[11px] font-semibold border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="current" className="text-[11px]">
                                    v{offer.version} (current)
                                </SelectItem>
                                {offer.versions.map((v) => (
                                    <SelectItem
                                        key={v.version}
                                        value={String(v.version)}
                                        className="text-[11px]"
                                    >
                                        v{v.version} — {formatDate(v.createdAt)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
                    <div
                        className="mx-auto bg-white shadow-lg rounded-sm border border-slate-200 p-10"
                        style={{ maxWidth: 780, minHeight: 1000, fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        {/* Letterhead */}
                        <div className="flex items-start justify-between pb-4 border-b-2 border-violet-600">
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-2xl">
                                    F
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Fixl Solutions Pvt Ltd
                                    </h2>
                                    <p className="text-[10px] text-slate-500">
                                        Building the next-gen CRM
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        hr@fixlsolutions.com
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                    Date
                                </p>
                                <p className="text-xs font-semibold text-slate-700">
                                    {formatDate(offer.createdAt)}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1.5">
                                    Version
                                </p>
                                <p className="text-xs font-semibold text-slate-700">
                                    {displayData.label}
                                </p>
                            </div>
                        </div>

                        {/* Greeting */}
                        <div className="mt-6">
                            <p className="text-sm text-slate-700">
                                Dear <span className="font-bold">{offer.candidateName}</span>,
                            </p>
                            <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                                We are pleased to extend this offer of employment to join{" "}
                                <strong>Fixl Solutions Pvt Ltd</strong> as{" "}
                                <strong>{offer.role}</strong> in our{" "}
                                <strong>{offer.department}</strong> team. This letter outlines
                                the terms and conditions of your employment with us.
                            </p>
                        </div>

                        {/* Position details */}
                        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-700 mt-6 mb-2">
                            Position Details
                        </h3>
                        <table className="w-full text-xs border border-slate-200 border-collapse">
                            <tbody>
                                {[
                                    ["Position", offer.role],
                                    ["Department", offer.department],
                                    ["Joining Date", formatDate(displayData.joiningDate)],
                                    ["Offer Expiry", formatDate(offer.expiryDate)],
                                    ["Notice Period", offer.noticePeriod || "60 days"],
                                ].map(([k, v]) => (
                                    <tr key={k} className="border-b border-slate-100 last:border-0">
                                        <td className="py-2 px-3 bg-slate-50 font-semibold text-slate-600 w-40">
                                            {k}
                                        </td>
                                        <td className="py-2 px-3 text-slate-800">{v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Compensation */}
                        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-700 mt-6 mb-2">
                            Compensation Structure
                        </h3>
                        <table className="w-full text-xs border border-slate-200 border-collapse">
                            <thead>
                                <tr className="bg-violet-50">
                                    <th className="py-2 px-3 text-left font-semibold text-slate-600 border-b border-slate-200">
                                        Component
                                    </th>
                                    <th className="py-2 px-3 text-right font-semibold text-slate-600 border-b border-slate-200">
                                        Annual (₹)
                                    </th>
                                    <th className="py-2 px-3 text-center font-semibold text-slate-600 border-b border-slate-200">
                                        Taxability
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {offer.salaryBreakdown?.map((s, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        <td className="py-2 px-3 text-slate-800">{s.component}</td>
                                        <td className="py-2 px-3 text-right font-semibold tabular-nums text-slate-900">
                                            {formatINRFull(s.amount)}
                                        </td>
                                        <td className="py-2 px-3 text-center text-slate-600">
                                            {s.isTaxable ? "Taxable" : "Non-taxable"}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-slate-50 font-bold">
                                    <td className="py-2 px-3">Total CTC</td>
                                    <td className="py-2 px-3 text-right tabular-nums text-emerald-700">
                                        {formatINRFull(displayData.totalCtc)}
                                    </td>
                                    <td className="py-2 px-3 text-center">—</td>
                                </tr>
                            </tbody>
                        </table>

                        {(offer.joiningBonus || offer.variablePay || offer.stockOptions) ? (
                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                {offer.joiningBonus ? (
                                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2">
                                        <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
                                            Joining Bonus
                                        </p>
                                        <p className="font-bold text-emerald-800 tabular-nums">
                                            {formatINRFull(offer.joiningBonus)}
                                        </p>
                                    </div>
                                ) : null}
                                {offer.variablePay ? (
                                    <div className="rounded-md border border-blue-200 bg-blue-50 p-2">
                                        <p className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold">
                                            Variable Pay
                                        </p>
                                        <p className="font-bold text-blue-800 tabular-nums">
                                            {formatINRFull(offer.variablePay)}
                                        </p>
                                    </div>
                                ) : null}
                                {offer.stockOptions ? (
                                    <div className="rounded-md border border-amber-200 bg-amber-50 p-2">
                                        <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">
                                            Stock Options (ESOP)
                                        </p>
                                        <p className="font-bold text-amber-800 tabular-nums">
                                            {formatINRFull(offer.stockOptions)}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        {/* Benefits */}
                        {offer.benefits && offer.benefits.length > 0 && (
                            <>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-700 mt-6 mb-2">
                                    Benefits
                                </h3>
                                <ul className="text-xs text-slate-700 list-disc pl-5 space-y-1">
                                    {offer.benefits.map((b, i) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* Custom clauses */}
                        {offer.customClauses && offer.customClauses.length > 0 && (
                            <>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-700 mt-6 mb-2">
                                    Terms &amp; Conditions
                                </h3>
                                <div className="space-y-3">
                                    {offer.customClauses.map((c, i) => (
                                        <div key={i} className="text-xs">
                                            <p className="font-bold text-slate-800">
                                                {i + 1}. {c.title}
                                            </p>
                                            <p className="text-slate-600 mt-1 leading-relaxed">
                                                {c.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Signatory block */}
                        <div className="mt-10 grid grid-cols-2 gap-8 pt-5 border-t border-slate-200">
                            <div>
                                <p className="text-xs text-slate-600 mb-6">
                                    For <strong>Fixl Solutions Pvt Ltd</strong>
                                </p>
                                <div className="border-b border-slate-400 pb-1 mb-1">
                                    <p className="italic text-slate-700 text-sm">
                                        Priya Verma
                                    </p>
                                </div>
                                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                    Head of Human Resources
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 mb-6">
                                    Accepted by candidate
                                </p>
                                <div className="border-b border-slate-400 pb-1 mb-1">
                                    {offer.signatureStatus === "Signed" ? (
                                        <p className="italic text-emerald-700 text-sm">
                                            ✓ Digitally signed • {formatDate(offer.signedAt)}
                                        </p>
                                    ) : (
                                        <p className="italic text-slate-300 text-sm">
                                            [Awaiting signature]
                                        </p>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                    {offer.candidateName}
                                </p>
                                {offer.signatureStatus === "Signed" && offer.signedIp && (
                                    <p className="text-[9px] text-slate-400 mt-1">
                                        IP: {offer.signedIp}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-slate-100 flex items-center gap-2 sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        Close
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onDownload(offer)}
                            className="h-9 rounded-lg text-[11px] font-semibold"
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Download PDF
                        </Button>
                        {offer.approvalStatus === "Approved" && (
                            <Button
                                onClick={onSendForSignature}
                                className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                            >
                                <Send className="h-3.5 w-3.5 mr-1.5" />
                                Send for signature
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* New Version Dialog                                                   */
/* ------------------------------------------------------------------ */

const NewVersionDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    onSubmit: (changes: string) => void;
}> = ({ open, onOpenChange, onSubmit }) => {
    const [changes, setChanges] = useState("");
    useEffect(() => {
        if (!open) setChanges("");
    }, [open]);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                        <History className="h-4 w-4 text-violet-600" />
                        Create new version
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500 font-medium">
                        Document what has changed in this version
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                        What changed?
                    </Label>
                    <Textarea
                        value={changes}
                        onChange={(e) => setChanges(e.target.value)}
                        placeholder="e.g. Revised CTC from ₹15L to ₹18L based on counter offer"
                        className="mt-1.5 min-h-[100px] rounded-lg border-slate-200 text-xs"
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!changes.trim()}
                        onClick={() => {
                            onSubmit(changes.trim());
                            onOpenChange(false);
                        }}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        Create version
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* Send for Signature Dialog                                            */
/* ------------------------------------------------------------------ */

const SendSignatureDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    offer: Offer | null;
    onConfirm: () => void;
}> = ({ open, onOpenChange, offer, onConfirm }) => {
    if (!offer) return null;
    const fakeLink = `https://fixlsolutions.com/offer/accept/${offer.id}?token=XXXX`;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                        <FileSignature className="h-4 w-4 text-violet-600" />
                        Send for e-signature
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500 font-medium">
                        The candidate will receive an email with an acceptance link
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 space-y-3">
                    <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                            <Mail className="h-3.5 w-3.5 text-violet-500" />
                            <span className="font-semibold">
                                {offer.candidateEmail || "No email on file"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <Copy className="h-3 w-3" />
                            <span className="font-mono truncate">{fakeLink}</span>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        Clicking send will notify the candidate and mark this offer as
                        &quot;Sent&quot;. They can sign digitally, decline, or submit a
                        counter offer.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Send now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* Mark Signed Dialog                                                  */
/* ------------------------------------------------------------------ */

const MarkSignedDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    offer: Offer | null;
    onConfirm: () => void;
}> = ({ open, onOpenChange, offer, onConfirm }) => {
    if (!offer) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Mark as signed
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500 font-medium">
                        Confirm that the candidate has accepted this offer
                    </DialogDescription>
                </DialogHeader>
                <div className="py-3">
                    <p className="text-xs text-slate-700">
                        Has <strong>{offer.candidateName}</strong> accepted the offer for{" "}
                        <strong>{offer.role}</strong>?
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                        This will mark the signature as complete and move the offer to
                        &quot;Accepted&quot;.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Confirm signed
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* Mark Declined Dialog                                                */
/* ------------------------------------------------------------------ */

const MarkDeclinedDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    offer: Offer | null;
    onConfirm: (reason: string, recordCounter: boolean) => void;
}> = ({ open, onOpenChange, offer, onConfirm }) => {
    const [reason, setReason] = useState("");
    const [record, setRecord] = useState(false);
    useEffect(() => {
        if (!open) {
            setReason("");
            setRecord(false);
        }
    }, [open]);
    if (!offer) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-600" />
                        Mark as declined
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500 font-medium">
                        Record why the candidate declined
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 space-y-3">
                    <div>
                        <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                            Reason
                        </Label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Accepted another offer, compensation too low"
                            className="mt-1.5 min-h-[80px] rounded-lg border-slate-200 text-xs"
                        />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <Checkbox
                            checked={record}
                            onCheckedChange={(c) => setRecord(!!c)}
                        />
                        <span>Record as counter offer opportunity</span>
                    </label>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onConfirm(reason, record)}
                        className="h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold"
                    >
                        <XCircle className="h-3.5 w-3.5 mr-1.5" />
                        Mark declined
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* Counter Offer Dialog                                                */
/* ------------------------------------------------------------------ */

const counterStatusStyles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
    Withdrawn: "bg-slate-100 text-slate-600 border-slate-200",
};

const CounterOfferDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    offer: Offer | null;
    onSubmit: (counter: Omit<OfferCounter, "id" | "offerId" | "status" | "createdAt">) => void;
    onRespond: (counterId: string, accept: boolean, notes?: string) => void;
}> = ({ open, onOpenChange, offer, onSubmit, onRespond }) => {
    const [showForm, setShowForm] = useState(false);
    const [requestedCtc, setRequestedCtc] = useState<number>(0);
    const [requestedDate, setRequestedDate] = useState("");
    const [notes, setNotes] = useState("");
    const [respondCounterId, setRespondCounterId] = useState<string | null>(null);
    const [respondNotes, setRespondNotes] = useState("");

    useEffect(() => {
        if (!open) {
            setShowForm(false);
            setRequestedCtc(0);
            setRequestedDate("");
            setNotes("");
            setRespondCounterId(null);
            setRespondNotes("");
        }
    }, [open]);

    if (!offer) return null;

    const submit = () => {
        onSubmit({
            requestedBy: "Candidate",
            requestedCtc: requestedCtc || undefined,
            requestedJoiningDate: requestedDate || undefined,
            notes: notes.trim(),
        });
        setShowForm(false);
        setRequestedCtc(0);
        setRequestedDate("");
        setNotes("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                        <ArrowLeftRight className="h-4 w-4 text-violet-600" />
                        Counter Offers
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500 font-medium">
                        {offer.candidateName} • Current CTC {formatINR(offer.totalCtc)}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto space-y-3 py-2">
                    {offer.counterOffers && offer.counterOffers.length > 0 ? (
                        offer.counterOffers.map((c) => (
                            <Card
                                key={c.id}
                                className="rounded-xl border border-slate-200 p-3 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className={`${counterStatusStyles[c.status]} text-[10px] uppercase tracking-wider font-semibold rounded-md`}
                                            >
                                                {c.status}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                By {c.requestedBy} • {formatDate(c.createdAt)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-xs mt-1.5">
                                            {c.requestedCtc && (
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                                        Requested CTC
                                                    </p>
                                                    <p className="font-bold text-slate-800 tabular-nums">
                                                        {formatINR(c.requestedCtc)}
                                                    </p>
                                                </div>
                                            )}
                                            {c.requestedJoiningDate && (
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                                        Requested joining
                                                    </p>
                                                    <p className="font-semibold text-slate-800">
                                                        {formatDate(c.requestedJoiningDate)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {c.notes && (
                                            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed whitespace-pre-wrap">
                                                {c.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {c.status === "Pending" && (
                                    <>
                                        {respondCounterId === c.id ? (
                                            <div className="mt-3 space-y-2">
                                                <Textarea
                                                    value={respondNotes}
                                                    onChange={(e) => setRespondNotes(e.target.value)}
                                                    placeholder="Add notes for your response (optional)"
                                                    className="min-h-[60px] rounded-md border-slate-200 text-xs"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        onClick={() => {
                                                            onRespond(c.id, true, respondNotes);
                                                            setRespondCounterId(null);
                                                            setRespondNotes("");
                                                        }}
                                                        className="h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                                                    >
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            onRespond(c.id, false, respondNotes);
                                                            setRespondCounterId(null);
                                                            setRespondNotes("");
                                                        }}
                                                        className="h-8 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold"
                                                    >
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setRespondCounterId(null);
                                                            setRespondNotes("");
                                                        }}
                                                        className="h-8 rounded-md text-[11px] font-semibold"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2 flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setRespondCounterId(c.id)}
                                                    className="h-7 rounded-md text-[10px] font-semibold"
                                                >
                                                    Respond
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <ArrowLeftRight className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                            <p className="text-xs font-semibold">No counter offers yet</p>
                        </div>
                    )}

                    {showForm ? (
                        <Card className="rounded-xl border-2 border-dashed border-violet-300 bg-violet-50/40 p-3 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Requested CTC
                                    </Label>
                                    <Input
                                        type="number"
                                        value={requestedCtc || ""}
                                        onChange={(e) => setRequestedCtc(Number(e.target.value))}
                                        className="mt-1 h-8 rounded-md border-slate-200 text-xs tabular-nums"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Requested joining
                                    </Label>
                                    <Input
                                        type="date"
                                        value={requestedDate}
                                        onChange={(e) => setRequestedDate(e.target.value)}
                                        className="mt-1 h-8 rounded-md border-slate-200 text-xs"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                    Notes
                                </Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Reason for counter offer"
                                    className="mt-1 min-h-[60px] rounded-md border-slate-200 text-xs"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowForm(false)}
                                    className="h-8 rounded-md text-[11px] font-semibold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={!notes.trim()}
                                    onClick={submit}
                                    className="h-8 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                                >
                                    Submit counter
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setShowForm(true)}
                            className="w-full h-9 rounded-lg border-dashed border-violet-300 text-violet-700 text-[11px] font-semibold"
                        >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Submit counter offer
                        </Button>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* Templates Management Dialog                                         */
/* ------------------------------------------------------------------ */

const blankTemplate = (): Omit<OfferTemplate, "id" | "createdAt"> => ({
    name: "",
    type: "Permanent",
    description: "",
    salaryStructure: [{ component: "", percentOfCtc: 100, isTaxable: true }],
    defaultBenefits: [],
    defaultClauses: [],
    isDefault: false,
    isActive: true,
    createdBy: "HR Manager",
});

const TemplatesDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    templates: OfferTemplate[];
    onAdd: (t: Omit<OfferTemplate, "id" | "createdAt">) => void;
    onUpdate: (id: string, updates: Partial<OfferTemplate>) => void;
    onDelete: (id: string) => void;
}> = ({ open, onOpenChange, templates, onAdd, onUpdate, onDelete }) => {
    const [mode, setMode] = useState<"list" | "edit">("list");
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<Omit<OfferTemplate, "id" | "createdAt">>(blankTemplate());

    useEffect(() => {
        if (!open) {
            setMode("list");
            setEditId(null);
            setForm(blankTemplate());
        }
    }, [open]);

    const openAdd = () => {
        setEditId(null);
        setForm(blankTemplate());
        setMode("edit");
    };

    const openEdit = (t: OfferTemplate) => {
        setEditId(t.id);
        setForm({
            name: t.name,
            type: t.type,
            description: t.description,
            salaryStructure: [...t.salaryStructure],
            defaultBenefits: [...t.defaultBenefits],
            defaultClauses: t.defaultClauses.map((c) => ({ ...c })),
            isDefault: t.isDefault,
            isActive: t.isActive,
            createdBy: t.createdBy,
        });
        setMode("edit");
    };

    const save = () => {
        if (editId) onUpdate(editId, form);
        else onAdd(form);
        setMode("list");
        setEditId(null);
    };

    const setDefault = (id: string) => {
        templates.forEach((t) => {
            if (t.isDefault && t.id !== id) onUpdate(t.id, { isDefault: false });
        });
        onUpdate(id, { isDefault: true });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                            <Layers className="h-4 w-4 text-violet-600" />
                            Offer Templates
                        </DialogTitle>
                        <DialogDescription className="text-[11px] text-slate-500 font-medium">
                            {mode === "list"
                                ? `${templates.length} templates`
                                : editId
                                    ? "Edit template"
                                    : "Create template"}
                        </DialogDescription>
                    </div>
                    {mode === "list" && (
                        <Button
                            onClick={openAdd}
                            className="h-8 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                        >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add template
                        </Button>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {mode === "list" ? (
                        <div className="grid grid-cols-2 gap-3 py-2">
                            {templates.map((t) => (
                                <Card
                                    key={t.id}
                                    className="rounded-xl border border-slate-200 p-4 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge
                                            variant="outline"
                                            className="text-[9px] uppercase tracking-wider font-semibold bg-violet-50 text-violet-700 border-violet-200 rounded-md"
                                        >
                                            {t.type}
                                        </Badge>
                                        {t.isDefault && (
                                            <Badge className="text-[9px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-700 rounded-md">
                                                Default
                                            </Badge>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                        {t.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400 font-medium">
                                        <span>{t.salaryStructure.length} components</span>
                                        <span>•</span>
                                        <span>{t.defaultBenefits.length} benefits</span>
                                    </div>
                                    <Separator className="my-3" />
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            variant="outline"
                                            onClick={() => openEdit(t)}
                                            className="h-7 rounded-md text-[10px] font-semibold"
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        {!t.isDefault && (
                                            <Button
                                                variant="outline"
                                                onClick={() => setDefault(t.id)}
                                                className="h-7 rounded-md text-[10px] font-semibold"
                                            >
                                                <Award className="h-3 w-3 mr-1" />
                                                Default
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (confirm("Delete this template?")) onDelete(t.id);
                                            }}
                                            className="h-7 rounded-md text-[10px] font-semibold text-rose-600 border-rose-200 ml-auto"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Name
                                    </Label>
                                    <Input
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, name: e.target.value }))
                                        }
                                        className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Type
                                    </Label>
                                    <Select
                                        value={form.type}
                                        onValueChange={(v) =>
                                            setForm((f) => ({ ...f, type: v as OfferTemplateType }))
                                        }
                                    >
                                        <SelectTrigger className="mt-1.5 h-9 rounded-lg border-slate-200 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(
                                                [
                                                    "Permanent",
                                                    "Contract",
                                                    "Internship",
                                                    "Part-Time",
                                                    "Remote",
                                                    "Custom",
                                                ] as OfferTemplateType[]
                                            ).map((t) => (
                                                <SelectItem key={t} value={t} className="text-xs">
                                                    {t}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                    Description
                                </Label>
                                <Textarea
                                    value={form.description || ""}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, description: e.target.value }))
                                    }
                                    className="mt-1.5 min-h-[60px] rounded-lg border-slate-200 text-xs"
                                />
                            </div>

                            {/* Salary structure */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Salary structure
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-6 px-2 text-[10px] font-semibold text-violet-600"
                                        onClick={() =>
                                            setForm((f) => ({
                                                ...f,
                                                salaryStructure: [
                                                    ...f.salaryStructure,
                                                    { component: "", percentOfCtc: 0, isTaxable: true },
                                                ],
                                            }))
                                        }
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add component
                                    </Button>
                                </div>
                                <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                                    <div className="grid grid-cols-[1fr_100px_100px_70px_40px] gap-2 px-2 py-1.5 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                        <span>Component</span>
                                        <span>% CTC</span>
                                        <span>Fixed (₹)</span>
                                        <span className="text-center">Tax</span>
                                        <span />
                                    </div>
                                    {form.salaryStructure.map((s, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-[1fr_100px_100px_70px_40px] gap-2 px-2 py-1.5 items-center"
                                        >
                                            <Input
                                                value={s.component}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setForm((f) => ({
                                                        ...f,
                                                        salaryStructure: f.salaryStructure.map((x, j) =>
                                                            j === i ? { ...x, component: v } : x
                                                        ),
                                                    }));
                                                }}
                                                className="h-8 rounded-md border-slate-200 text-xs"
                                            />
                                            <Input
                                                type="number"
                                                value={s.percentOfCtc ?? ""}
                                                onChange={(e) => {
                                                    const v = Number(e.target.value);
                                                    setForm((f) => ({
                                                        ...f,
                                                        salaryStructure: f.salaryStructure.map((x, j) =>
                                                            j === i ? { ...x, percentOfCtc: v } : x
                                                        ),
                                                    }));
                                                }}
                                                className="h-8 rounded-md border-slate-200 text-xs tabular-nums"
                                            />
                                            <Input
                                                type="number"
                                                value={s.fixedAmount ?? ""}
                                                onChange={(e) => {
                                                    const v = Number(e.target.value);
                                                    setForm((f) => ({
                                                        ...f,
                                                        salaryStructure: f.salaryStructure.map((x, j) =>
                                                            j === i ? { ...x, fixedAmount: v } : x
                                                        ),
                                                    }));
                                                }}
                                                className="h-8 rounded-md border-slate-200 text-xs tabular-nums"
                                            />
                                            <div className="flex justify-center">
                                                <Checkbox
                                                    checked={s.isTaxable}
                                                    onCheckedChange={(c) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            salaryStructure: f.salaryStructure.map((x, j) =>
                                                                j === i ? { ...x, isTaxable: !!c } : x
                                                            ),
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
                                                onClick={() =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        salaryStructure: f.salaryStructure.filter(
                                                            (_, j) => j !== i
                                                        ),
                                                    }))
                                                }
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Benefits */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Default benefits
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-6 px-2 text-[10px] font-semibold text-violet-600"
                                        onClick={() =>
                                            setForm((f) => ({
                                                ...f,
                                                defaultBenefits: [...f.defaultBenefits, ""],
                                            }))
                                        }
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-1.5">
                                    {form.defaultBenefits.map((b, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <Input
                                                value={b}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setForm((f) => ({
                                                        ...f,
                                                        defaultBenefits: f.defaultBenefits.map((x, j) =>
                                                            j === i ? v : x
                                                        ),
                                                    }));
                                                }}
                                                className="h-8 rounded-md border-slate-200 text-xs"
                                            />
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
                                                onClick={() =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        defaultBenefits: f.defaultBenefits.filter(
                                                            (_, j) => j !== i
                                                        ),
                                                    }))
                                                }
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Clauses */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                                        Default clauses
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-6 px-2 text-[10px] font-semibold text-violet-600"
                                        onClick={() =>
                                            setForm((f) => ({
                                                ...f,
                                                defaultClauses: [
                                                    ...f.defaultClauses,
                                                    { title: "", body: "" },
                                                ],
                                            }))
                                        }
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add clause
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {form.defaultClauses.map((c, i) => (
                                        <div
                                            key={i}
                                            className="rounded-lg border border-slate-200 p-2 space-y-1.5"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={c.title}
                                                    placeholder="Title"
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setForm((f) => ({
                                                            ...f,
                                                            defaultClauses: f.defaultClauses.map((x, j) =>
                                                                j === i ? { ...x, title: v } : x
                                                            ),
                                                        }));
                                                    }}
                                                    className="h-8 rounded-md border-slate-200 text-xs font-semibold"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
                                                    onClick={() =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            defaultClauses: f.defaultClauses.filter(
                                                                (_, j) => j !== i
                                                            ),
                                                        }))
                                                    }
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                            <Textarea
                                                value={c.body}
                                                placeholder="Body"
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setForm((f) => ({
                                                        ...f,
                                                        defaultClauses: f.defaultClauses.map((x, j) =>
                                                            j === i ? { ...x, body: v } : x
                                                        ),
                                                    }));
                                                }}
                                                className="min-h-[50px] rounded-md border-slate-200 text-xs"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {mode === "edit" ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setMode("list")}
                                className="h-9 rounded-lg text-[11px] font-semibold"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={save}
                                disabled={!form.name.trim()}
                                className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                            >
                                {editId ? "Save changes" : "Create template"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-9 rounded-lg text-[11px] font-semibold"
                        >
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* Bulk Send Dialog                                                    */
/* ------------------------------------------------------------------ */

const BulkSendDialog: React.FC<{
    open: boolean;
    onOpenChange: (o: boolean) => void;
    offers: Offer[];
    onConfirm: () => void;
}> = ({ open, onOpenChange, offers, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-2xl border border-slate-200 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold tracking-tight flex items-center gap-2">
                        <Send className="h-4 w-4 text-violet-600" />
                        Bulk send offers
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-slate-500 font-medium">
                        Send {offers.length} offer{offers.length !== 1 ? "s" : ""} to
                        candidates
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[40vh] overflow-y-auto py-2 space-y-1.5">
                    {offers.map((o) => (
                        <div
                            key={o.id}
                            className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-xs"
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-[9px] font-bold">
                                    {o.candidateName
                                        .split(" ")
                                        .map((s) => s[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">
                                        {o.candidateName}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">
                                        {o.candidateEmail || "No email"}
                                    </p>
                                </div>
                            </div>
                            <span className="font-semibold text-slate-700 tabular-nums">
                                {formatINR(o.totalCtc)}
                            </span>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-lg text-[11px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold"
                    >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Send all
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ------------------------------------------------------------------ */
/* PDF HTML Builder                                                    */
/* ------------------------------------------------------------------ */

function buildOfferHTML(o: Offer): string {
    const rows = (o.salaryBreakdown || [])
        .map(
            (s) =>
                `<tr><td>${s.component}</td><td class="amt">${formatINRFull(
                    s.amount
                )}</td><td class="tax">${s.isTaxable ? "Taxable" : "Non-taxable"
                }</td></tr>`
        )
        .join("");
    const benefits = (o.benefits || [])
        .map((b) => `<li>${b}</li>`)
        .join("");
    const clauses = (o.customClauses || [])
        .map(
            (c, i) =>
                `<div class="clause"><h4>${i + 1}. ${c.title}</h4><p>${c.body}</p></div>`
        )
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Offer Letter — ${o.candidateName}</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;max-width:780px;margin:40px auto;padding:40px;color:#1e293b;line-height:1.55;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #8b5cf6;padding-bottom:16px;}
  .logo{display:flex;align-items:center;gap:12px;}
  .logo-box{height:56px;width:56px;background:#8b5cf6;color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;}
  h1{font-size:20px;margin:0;color:#0f172a;}
  .muted{font-size:10px;color:#64748b;margin:2px 0;}
  .meta{text-align:right;font-size:11px;}
  h3{color:#8b5cf6;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-top:24px;margin-bottom:10px;}
  table{width:100%;border-collapse:collapse;font-size:12px;border:1px solid #e2e8f0;}
  th,td{border-bottom:1px solid #f1f5f9;padding:8px 12px;}
  th{background:#ede9fe;text-align:left;font-weight:600;color:#475569;}
  td.amt{text-align:right;font-weight:600;font-variant-numeric:tabular-nums;}
  td.tax{text-align:center;color:#64748b;}
  .total td{background:#f8fafc;font-weight:bold;}
  ul{font-size:12px;padding-left:20px;}
  .clause{margin:10px 0;font-size:12px;}
  .clause h4{margin:0 0 4px 0;font-size:12px;color:#1e293b;}
  .signatures{margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:32px;padding-top:20px;border-top:1px solid #e2e8f0;}
  .sig-line{border-bottom:1px solid #94a3b8;padding-bottom:4px;font-style:italic;}
  .sig-label{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:600;margin-top:4px;}
  .greeting{margin:22px 0;font-size:13px;}
  .greeting strong{color:#0f172a;}
</style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <div class="logo-box">F</div>
      <div>
        <h1>Fixl Solutions Pvt Ltd</h1>
        <p class="muted">Building the next-gen CRM</p>
        <p class="muted">hr@fixlsolutions.com</p>
      </div>
    </div>
    <div class="meta">
      <p class="muted" style="text-transform:uppercase;letter-spacing:1px;font-weight:600;">Date</p>
      <p><strong>${formatDate(o.createdAt)}</strong></p>
      <p class="muted" style="text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-top:6px;">Version</p>
      <p><strong>v${o.version}</strong></p>
    </div>
  </div>

  <div class="greeting">
    <p>Dear <strong>${o.candidateName}</strong>,</p>
    <p>We are pleased to extend this offer of employment to join <strong>Fixl Solutions Pvt Ltd</strong> as <strong>${o.role}</strong> in our <strong>${o.department}</strong> team. This letter outlines the terms and conditions of your employment with us.</p>
  </div>

  <h3>Position Details</h3>
  <table>
    <tr><td style="background:#f8fafc;font-weight:600;width:180px;">Position</td><td>${o.role}</td></tr>
    <tr><td style="background:#f8fafc;font-weight:600;">Department</td><td>${o.department}</td></tr>
    <tr><td style="background:#f8fafc;font-weight:600;">Joining Date</td><td>${formatDate(o.joiningDate)}</td></tr>
    <tr><td style="background:#f8fafc;font-weight:600;">Offer Expiry</td><td>${formatDate(o.expiryDate)}</td></tr>
    <tr><td style="background:#f8fafc;font-weight:600;">Notice Period</td><td>${o.noticePeriod || "60 days"}</td></tr>
  </table>

  <h3>Compensation Structure</h3>
  <table>
    <thead><tr><th>Component</th><th style="text-align:right;">Annual (₹)</th><th style="text-align:center;">Taxability</th></tr></thead>
    <tbody>
      ${rows}
      <tr class="total"><td>Total CTC</td><td class="amt">${formatINRFull(o.totalCtc)}</td><td class="tax">—</td></tr>
    </tbody>
  </table>

  ${benefits
            ? `<h3>Benefits</h3><ul>${benefits}</ul>`
            : ""
        }

  ${clauses
            ? `<h3>Terms &amp; Conditions</h3>${clauses}`
            : ""
        }

  <div class="signatures">
    <div>
      <p style="font-size:12px;">For <strong>Fixl Solutions Pvt Ltd</strong></p>
      <div class="sig-line" style="margin-top:40px;">Priya Verma</div>
      <p class="sig-label">Head of Human Resources</p>
    </div>
    <div>
      <p style="font-size:12px;">Accepted by candidate</p>
      <div class="sig-line" style="margin-top:40px;">${o.signatureStatus === "Signed"
            ? `✓ Digitally signed • ${formatDate(o.signedAt)}`
            : "[Awaiting signature]"
        }</div>
      <p class="sig-label">${o.candidateName}</p>
    </div>
  </div>
</body>
</html>`;
}
