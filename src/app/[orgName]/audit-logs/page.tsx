"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Search,
    Download,
    Shield,
    Activity as ActivityIcon,
    LogIn,
    Settings,
    Database,
    Building2,
    UserCog,
    ChevronLeft,
    ChevronRight,
    Trash2,
    History,
    Clock,
    FileText,
    Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { CustomButton } from "@/shared/components/custom/CustomButton";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { showSuccess } from "@/shared/utils/toast";
import { toast } from "sonner";
import { getAllModuleActivities, deleteActivity } from "@/hooks/activityHooks";
import Loader from "@/shared/components/custom/Loader";

type Category = "Authentication" | "Configuration" | "Security" | "Data" | "Admin Action" | "Firm Event";
type Status = "Success" | "Warning" | "Failed" | "Alert";

type AuditEvent = {
    id: string;
    rawCreatedAt: string;
    timestamp: string;
    activity: string;
    category: Category;
    user: string;
    ip: string;
    status: Status;
    module: string;
    rawActivity: string;
    description: string;
};

const CATEGORIES: ("All" | Category)[] = ["All", "Authentication", "Configuration", "Security", "Data", "Admin Action", "Firm Event"];

const activityToCategory = (activity: string, module: string): Category => {
    if (module === "user") {
        if (activity === "delete" || activity === "cancel") return "Security";
        return "Authentication";
    }
    if (module === "firm") return "Firm Event";
    switch (activity) {
        case "create": return "Data";
        case "update": return "Configuration";
        case "delete": return "Admin Action";
        case "view": return "Data";
        case "assign": return "Admin Action";
        case "share": return "Data";
        case "restore": return "Admin Action";
        case "cancel": return "Admin Action";
        default: return "Data";
    }
};

const activityToStatus = (activity: string): Status => {
    if (activity === "delete") return "Warning";
    if (activity === "cancel") return "Warning";
    return "Success";
};

const titleCase = (s: string): string => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const activityToLabel = (activity: string, module: string): string => {
    const mod = titleCase(module);
    switch (activity) {
        case "create": return `${mod} created`;
        case "update": return `${mod} updated`;
        case "delete": return `${mod} deleted`;
        case "view": return `${mod} viewed`;
        case "assign": return `${mod} assignment changed`;
        case "share": return `${mod} shared`;
        case "restore": return `${mod} restored`;
        case "cancel": return `${mod} cancelled`;
        default: return `${mod} ${activity}`;
    }
};

const formatRelative = (iso: string): string => {
    if (!iso) return "â€”";
    const t = new Date(iso).getTime();
    if (!Number.isFinite(t)) return "â€”";
    const diff = Date.now() - t;
    const min = Math.floor(diff / 60000);
    if (min < 1) return "Just now";
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(t).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const formatExact = (iso: string): string => {
    if (!iso) return "â€”";
    const t = new Date(iso);
    if (!Number.isFinite(t.getTime())) return "â€”";
    return t.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const actorName = (userId: any): string => {
    if (!userId) return "System";
    if (typeof userId === "string") return "Admin";
    const first = userId.firstName || "";
    const last = userId.lastName || "";
    const name = `${first} ${last}`.trim();
    return name || userId.email || userId.name || "Admin";
};

const actorIp = (userId: any): string => {
    if (!userId || typeof userId === "string") return "â€”";
    return userId.lastLoginIp || "â€”";
};

const mapApiActivity = (item: any): AuditEvent => {
    const activity = (item.activity || "view").toLowerCase();
    const module = item.module || "unknown";
    return {
        id: String(item._id || `${Date.now()}-${Math.random()}`),
        rawCreatedAt: item.createdAt || "",
        timestamp: formatRelative(item.createdAt),
        activity: activityToLabel(activity, module),
        category: activityToCategory(activity, module),
        user: actorName(item.userId),
        ip: actorIp(item.userId),
        status: activityToStatus(activity),
        module: titleCase(module),
        rawActivity: activity,
        description: item.activityDesc || activityToLabel(activity, module),
    };
};

const categoryIconMap: Record<Category, typeof Shield> = {
    Authentication: LogIn,
    Configuration: Settings,
    Security: Shield,
    Data: Database,
    "Admin Action": UserCog,
    "Firm Event": Building2,
};

const categoryToneMap: Record<Category, string> = {
    Authentication: "bg-indigo-100 text-indigo-700",
    Configuration: "bg-purple-100 text-purple-700",
    Security: "bg-red-100 text-red-700",
    Data: "bg-amber-100 text-amber-700",
    "Admin Action": "bg-blue-100 text-blue-700",
    "Firm Event": "bg-teal-100 text-teal-700",
};

const statusToneMap: Record<Status, string> = {
    Success: "text-emerald-600",
    Warning: "text-amber-600",
    Failed: "text-red-600",
    Alert: "text-red-600",
};

const ITEMS_PER_PAGE = 10;

export default function AuditLogsPage() {
    const router = useRouter();
    const params = useParams();
    const orgName = (params?.orgName as string) || "";

    const [allEvents, setAllEvents] = useState<AuditEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [detail, setDetail] = useState<AuditEvent | null>(null);

    const loadedRef = useRef(false);
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const safety = window.setTimeout(() => setLoading(false), 20000);

        ;(async () => {
            try {
                const data = await getAllModuleActivities(1, 100);
                if (Array.isArray(data)) {
                    setAllEvents(data.map(mapApiActivity));
                }
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Failed to fetch audit logs");
            } finally {
                window.clearTimeout(safety);
                setLoading(false);
            }
        })();
    }, []);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteActivity(id);
            setAllEvents((prev) => prev.filter((e) => e.id !== id));
            showSuccess("Audit event deleted");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete event");
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return allEvents.filter((e) => {
            if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
            if (!q) return true;
            const haystack = `${e.activity} ${e.user} ${e.ip} ${e.module} ${e.description}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [allEvents, searchQuery, categoryFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const todayCount = useMemo(() => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const t0 = startOfDay.getTime();
        return allEvents.filter((a) => new Date(a.rawCreatedAt).getTime() >= t0).length;
    }, [allEvents]);

    const weekCount = useMemo(() => {
        const t0 = Date.now() - 7 * 86400000;
        return allEvents.filter((a) => new Date(a.rawCreatedAt).getTime() >= t0).length;
    }, [allEvents]);

    const moduleCount = useMemo(() => {
        const set = new Set<string>();
        allEvents.forEach((a) => set.add(a.module));
        return set.size;
    }, [allEvents]);

    const categoryCounts: Record<string, number> = useMemo(() => {
        const counts: Record<string, number> = { All: allEvents.length };
        for (const cat of CATEGORIES) {
            if (cat !== "All") counts[cat] = allEvents.filter((e) => e.category === cat).length;
        }
        return counts;
    }, [allEvents]);

    const handleExport = () => {
        if (allEvents.length === 0) {
            toast.info("No audit events to export");
            return;
        }
        const headers = ["Timestamp", "Activity", "Category", "User", "IP", "Status", "Module", "Description"];
        const rows = allEvents.map((e) => [
            formatExact(e.rawCreatedAt),
            e.activity,
            e.category,
            e.user,
            e.ip,
            e.status,
            e.module,
            e.description,
        ]);
        const csv = [headers, ...rows]
            .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess("Audit logs exported");
    };

    const handleCategoryChange = (cat: "All" | Category) => {
        setCategoryFilter(cat);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="relative flex flex-col h-full w-full bg-slate-50/50 font-sans">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitor all activities, user actions and security events across your organization
                    </p>
                </div>
                <CustomButton
                    variant="outline"
                    className="h-9 px-4 gap-2 rounded-xl"
                    onClick={handleExport}
                >
                    <Download className="w-4 h-4" /> Export CSV
                </CustomButton>
            </div>

            {/* TOP STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard
                    onClick={() => handleCategoryChange("All")}
                    className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Events</p>
                                <p className="text-white text-2xl font-bold mt-1">{allEvents.length}</p>
                                <p className="text-white text-[10px] mt-1 opacity-90">All recorded activities</p>
                            </div>
                            <History className="w-6 h-6 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${orgName}/activity-logs`)}
                    className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Today</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{todayCount}</p>
                                <p className="text-[10px] mt-1 text-gray-600">Events since midnight</p>
                            </div>
                            <Clock className="w-6 h-6 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${orgName}/usage-analytics`)}
                    className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Last 7 Days</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{weekCount}</p>
                                <p className="text-[10px] mt-1 text-gray-600">Weekly activity</p>
                            </div>
                            <ActivityIcon className="w-6 h-6 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${orgName}/modules/settings/modules`)}
                    className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Modules</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{moduleCount}</p>
                                <p className="text-[10px] mt-1 text-gray-600">With recorded activity</p>
                            </div>
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* CATEGORY TABS */}
            <Card className="border-zinc-200 shadow-md rounded-none bg-white">
                <CardContent className="p-2 overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-max">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-lg transition-colors ${
                                    categoryFilter === cat
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "text-zinc-600 hover:bg-zinc-100"
                                }`}
                            >
                                {cat}
                                <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                        categoryFilter === cat
                                            ? "bg-white/20 text-white"
                                            : "bg-zinc-100 text-zinc-500"
                                    }`}
                                >
                                    {categoryCounts[cat] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SEARCH */}
            <Card className="border-zinc-200 shadow-md rounded-none bg-white">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search by activity, user, IP, module..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10 rounded-md"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Filter className="w-4 h-4" />
                        <span>{filtered.length} of {allEvents.length} events</span>
                    </div>
                </CardContent>
            </Card>

            {/* TABLE */}
            <Card className="border-zinc-200 shadow-xl rounded-none bg-white overflow-hidden">
                <CardHeader className="border-b border-zinc-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                <History className="w-5 h-5 text-indigo-600" /> Audit Ledger
                            </CardTitle>
                            <p className="text-xs text-zinc-500 mt-1">Detailed action history with full traceability</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {paginated.length === 0 ? (
                        <div className="p-12 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
                            <History className="w-10 h-10 text-zinc-300" />
                            {allEvents.length === 0 ? (
                                <>
                                    <p className="font-medium">No audit events recorded yet</p>
                                    <p className="text-xs text-zinc-400">Actions across modules will appear here</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-medium">No matches</p>
                                    <p className="text-xs text-zinc-400">Try adjusting your search or filter</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 border-zinc-100">
                                    <TableHead className="w-[160px] text-xs font-semibold text-zinc-600">Timestamp</TableHead>
                                    <TableHead className="text-xs font-semibold text-zinc-600">Activity</TableHead>
                                    <TableHead className="text-xs font-semibold text-zinc-600">Category</TableHead>
                                    <TableHead className="text-xs font-semibold text-zinc-600">Initiated by</TableHead>
                                    <TableHead className="text-xs font-semibold text-zinc-600">IP address</TableHead>
                                    <TableHead className="text-xs font-semibold text-zinc-600">Status</TableHead>
                                    <TableHead className="w-[80px] text-xs font-semibold text-zinc-600 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map((event) => {
                                    const Icon = categoryIconMap[event.category];
                                    const tone = categoryToneMap[event.category];
                                    return (
                                        <TableRow
                                            key={event.id}
                                            className="hover:bg-zinc-50/50 border-zinc-100 cursor-pointer"
                                            onClick={() => setDetail(event)}
                                        >
                                            <TableCell className="font-mono text-xs text-zinc-500">
                                                {event.timestamp}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tone}`}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-semibold text-zinc-900 truncate">{event.activity}</span>
                                                        <span className="text-[11px] text-zinc-400">{event.module}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-md text-[10px] font-semibold px-2 py-0.5 border-0 ${tone}`}
                                                >
                                                    {event.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-zinc-700">
                                                {event.user}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-zinc-500">
                                                {event.ip}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`text-sm font-semibold ${statusToneMap[event.status]}`}>
                                                    {event.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <CustomButton
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation();
                                                        handleDelete(event.id);
                                                    }}
                                                    disabled={deletingId === event.id}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </CustomButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}

                    {paginated.length > 0 && (
                        <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                            <p className="text-xs text-zinc-500">
                                Showing {paginated.length} of {filtered.length} events
                                {categoryFilter !== "All" && (
                                    <span className="ml-1">(filtered from {allEvents.length} total)</span>
                                )}
                            </p>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-1">
                                    <CustomButton
                                        variant="outline"
                                        className="h-8 w-8 p-0 rounded-lg"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </CustomButton>
                                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                        const start = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
                                        const page = start + i;
                                        if (page > totalPages) return null;
                                        return (
                                            <CustomButton
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                className={`h-8 w-8 p-0 rounded-lg text-xs font-semibold ${
                                                    currentPage === page ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""
                                                }`}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </CustomButton>
                                        );
                                    })}
                                    <CustomButton
                                        variant="outline"
                                        className="h-8 w-8 p-0 rounded-lg"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </CustomButton>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* DETAIL DIALOG */}
            <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="w-5 h-5 text-indigo-600" /> Audit Event Detail
                        </DialogTitle>
                        <DialogDescription>
                            Full details of the recorded event
                        </DialogDescription>
                    </DialogHeader>
                    {detail && (
                        <div className="space-y-3 pt-2">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Module</p>
                                    <p className="font-semibold text-zinc-900 mt-0.5">{detail.module}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Category</p>
                                    <p className="font-semibold text-zinc-900 mt-0.5">{detail.category}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Performed by</p>
                                    <p className="font-semibold text-zinc-900 mt-0.5">{detail.user}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Status</p>
                                    <p className={`font-semibold mt-0.5 ${statusToneMap[detail.status]}`}>{detail.status}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">When</p>
                                    <p className="font-semibold text-zinc-900 mt-0.5">{formatExact(detail.rawCreatedAt)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">IP address</p>
                                    <p className="font-semibold text-zinc-900 mt-0.5 font-mono">{detail.ip}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Description</p>
                                <p className="text-sm text-zinc-800 mt-0.5 p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                                    {detail.description}
                                </p>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-mono">Event ID: {detail.id}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
