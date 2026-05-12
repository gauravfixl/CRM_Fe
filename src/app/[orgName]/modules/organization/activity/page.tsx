"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    History,
    Search,
    Filter,
    User,
    Building2,
    Settings,
    Shield,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Briefcase,
    Receipt,
    Trash2,
    Eye,
    Plus,
    Pencil,
    Share2,
    UserCheck,
    RotateCcw,
    Ban,
    Activity as ActivityIcon,
    Users,
    Calculator,
} from "lucide-react";
import { CustomButton } from "@/shared/components/custom/CustomButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import Loader from "@/shared/components/custom/Loader";

const MODULES = ["organization", "firm", "lead", "invoice", "client", "tax", "user"] as const;

const MODULE_META: Record<string, { label: string; icon: typeof Shield; tone: string }> = {
    organization: { label: "Organization", icon: Building2, tone: "bg-indigo-100 text-indigo-700" },
    firm: { label: "Business Unit", icon: Briefcase, tone: "bg-blue-100 text-blue-700" },
    lead: { label: "Lead", icon: ActivityIcon, tone: "bg-amber-100 text-amber-700" },
    invoice: { label: "Invoice", icon: Receipt, tone: "bg-emerald-100 text-emerald-700" },
    client: { label: "Client", icon: Users, tone: "bg-purple-100 text-purple-700" },
    tax: { label: "Tax", icon: Calculator, tone: "bg-rose-100 text-rose-700" },
    user: { label: "User", icon: User, tone: "bg-cyan-100 text-cyan-700" },
};

const ACTIVITY_META: Record<string, { icon: typeof Plus; tone: string }> = {
    create: { icon: Plus, tone: "bg-emerald-500 text-white" },
    update: { icon: Pencil, tone: "bg-amber-500 text-white" },
    delete: { icon: Trash2, tone: "bg-red-500 text-white" },
    view: { icon: Eye, tone: "bg-zinc-500 text-white" },
    assign: { icon: UserCheck, tone: "bg-indigo-500 text-white" },
    share: { icon: Share2, tone: "bg-blue-500 text-white" },
    restore: { icon: RotateCcw, tone: "bg-purple-500 text-white" },
    cancel: { icon: Ban, tone: "bg-rose-500 text-white" },
};

type ActivityRow = {
    id: string;
    module: string;
    activity: string;
    activityDesc: string;
    userId: any;
    createdAt: string;
};

const formatRelative = (iso: string): string => {
    if (!iso) return "—";
    const t = new Date(iso).getTime();
    if (!Number.isFinite(t)) return "—";
    const diff = Date.now() - t;
    const min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(t).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const formatExact = (iso: string): string => {
    if (!iso) return "—";
    const t = new Date(iso);
    if (!Number.isFinite(t.getTime())) return "—";
    return t.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const actorName = (userId: any): string => {
    if (!userId) return "System";
    if (typeof userId === "string") return "Admin";
    const first = userId.firstName || "";
    const last = userId.lastName || "";
    const name = `${first} ${last}`.trim();
    return name || userId.email || "Admin";
};

export default function OrgActivityPage() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "default";

    const [activities, setActivities] = useState<ActivityRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [moduleFilter, setModuleFilter] = useState<string>("all");
    const [activityFilter, setActivityFilter] = useState<string>("all");
    const [detail, setDetail] = useState<ActivityRow | null>(null);

    const loadedRef = useRef(false);
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const safety = window.setTimeout(() => setLoading(false), 20000);

        ;(async () => {
            try {
                const responses = await Promise.allSettled(
                    MODULES.map((mod) => axiosInstance.get(`/activities/module/${mod}?page=1&limit=100`))
                );

                const merged: ActivityRow[] = [];
                responses.forEach((res, idx) => {
                    if (res.status === "fulfilled") {
                        const arr: any[] = res.value?.data?.data ?? res.value?.data?.activities ?? [];
                        if (Array.isArray(arr)) {
                            arr.forEach((item) => {
                                merged.push({
                                    id: String(item._id || `${idx}-${Math.random()}`),
                                    module: item.module || MODULES[idx],
                                    activity: item.activity || "view",
                                    activityDesc: item.activityDesc || "",
                                    userId: item.userId || null,
                                    createdAt: item.createdAt || "",
                                });
                            });
                        }
                    }
                });

                merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setActivities(merged);
            } finally {
                window.clearTimeout(safety);
                setLoading(false);
            }
        })();
    }, []);

    const moduleCounts = useMemo(() => {
        const counts = new Map<string, number>();
        activities.forEach((a) => counts.set(a.module, (counts.get(a.module) || 0) + 1));
        return counts;
    }, [activities]);

    const activityCounts = useMemo(() => {
        const counts = new Map<string, number>();
        activities.forEach((a) => counts.set(a.activity, (counts.get(a.activity) || 0) + 1));
        return counts;
    }, [activities]);

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return activities.filter((a) => {
            if (moduleFilter !== "all" && a.module !== moduleFilter) return false;
            if (activityFilter !== "all" && a.activity !== activityFilter) return false;
            if (!q) return true;
            const haystack = `${a.module} ${a.activity} ${a.activityDesc} ${actorName(a.userId)}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [activities, searchQuery, moduleFilter, activityFilter]);

    const todayCount = useMemo(() => {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const t0 = startOfDay.getTime();
        return activities.filter((a) => new Date(a.createdAt).getTime() >= t0).length;
    }, [activities]);

    const weekCount = useMemo(() => {
        const t0 = Date.now() - 7 * 86400000;
        return activities.filter((a) => new Date(a.createdAt).getTime() >= t0).length;
    }, [activities]);

    if (loading) {
        return (
            <div className="relative flex flex-col h-full w-full bg-slate-50/50 font-sans">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recent Admin Activity</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Audit trail of actions performed across your organization
                    </p>
                </div>
                <CustomButton
                    variant="outline"
                    className="h-9 px-4 gap-2 rounded-xl"
                    onClick={() => router.push(`/${orgName}/audit-logs`)}
                >
                    <Shield className="w-4 h-4" /> Full Audit Log
                </CustomButton>
            </div>

            {/* TOP STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Events</p>
                                <p className="text-white text-2xl font-bold mt-1">{activities.length}</p>
                                <p className="text-white text-[10px] mt-1 opacity-90">Across all modules</p>
                            </div>
                            <History className="w-6 h-6 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
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
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
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
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Modules</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{moduleCounts.size}</p>
                                <p className="text-[10px] mt-1 text-gray-600">With recorded activity</p>
                            </div>
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTERS */}
            <Card className="border-zinc-200 shadow-md rounded-none bg-white">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by module, action or description..."
                            className="pl-10 rounded-md"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-zinc-400" />
                        <select
                            value={moduleFilter}
                            onChange={(e) => setModuleFilter(e.target.value)}
                            className="h-9 rounded-md border border-zinc-200 bg-white text-sm px-3 font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All modules</option>
                            {MODULES.map((m) => (
                                <option key={m} value={m}>
                                    {MODULE_META[m]?.label || m} ({moduleCounts.get(m) || 0})
                                </option>
                            ))}
                        </select>
                        <select
                            value={activityFilter}
                            onChange={(e) => setActivityFilter(e.target.value)}
                            className="h-9 rounded-md border border-zinc-200 bg-white text-sm px-3 font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All actions</option>
                            {Object.keys(ACTIVITY_META).map((a) => (
                                <option key={a} value={a}>
                                    {a.charAt(0).toUpperCase() + a.slice(1)} ({activityCounts.get(a) || 0})
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* ACTIVITY TIMELINE */}
            <Card className="border-zinc-200 shadow-xl rounded-none bg-white">
                <CardHeader className="border-b border-zinc-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                <History className="w-5 h-5 text-indigo-600" /> Activity Timeline
                            </CardTitle>
                            <p className="text-xs text-zinc-500 mt-1">
                                {filtered.length} of {activities.length} events
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filtered.length === 0 ? (
                        <div className="p-12 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
                            <History className="w-10 h-10 text-zinc-300" />
                            {activities.length === 0 ? (
                                <>
                                    <p className="font-medium">No activity recorded yet</p>
                                    <p className="text-xs text-zinc-400">Actions across modules will appear here</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-medium">No matches</p>
                                    <p className="text-xs text-zinc-400">Try adjusting your search or filters</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-50">
                            {filtered.map((a) => {
                                const mMeta = MODULE_META[a.module] || { label: a.module, icon: History, tone: "bg-zinc-100 text-zinc-700" };
                                const aMeta = ACTIVITY_META[a.activity] || { icon: ActivityIcon, tone: "bg-zinc-500 text-white" };
                                const ModuleIcon = mMeta.icon;
                                const ActionIcon = aMeta.icon;
                                return (
                                    <div
                                        key={a.id}
                                        className="p-4 flex items-start gap-4 hover:bg-zinc-50/60 transition-all cursor-pointer"
                                        onClick={() => setDetail(a)}
                                    >
                                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${aMeta.tone}`}>
                                            <ActionIcon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${mMeta.tone}`}>
                                                    <ModuleIcon className="w-3 h-3 inline mr-1" />
                                                    {mMeta.label}
                                                </span>
                                                <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100 text-[10px] font-bold uppercase border-0">
                                                    {a.activity}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-semibold text-zinc-900 mt-1 truncate">
                                                {a.activityDesc || `${a.activity} action on ${mMeta.label.toLowerCase()}`}
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                by <span className="font-medium text-zinc-700">{actorName(a.userId)}</span>
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest whitespace-nowrap">
                                            {formatRelative(a.createdAt)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* DETAIL DIALOG */}
            <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Activity Detail
                        </DialogTitle>
                        <DialogDescription>
                            Full details of the recorded activity event
                        </DialogDescription>
                    </DialogHeader>
                    {detail && (() => {
                        const mMeta = MODULE_META[detail.module] || { label: detail.module, icon: History, tone: "bg-zinc-100 text-zinc-700" };
                        return (
                            <div className="space-y-3 pt-2">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Module</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">{mMeta.label}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Action</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5 capitalize">{detail.activity}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Performed By</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">{actorName(detail.userId)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">When</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">{formatExact(detail.createdAt)}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Description</p>
                                    <p className="text-sm text-zinc-800 mt-0.5 p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                                        {detail.activityDesc || `${detail.activity} action on ${mMeta.label.toLowerCase()}`}
                                    </p>
                                </div>
                                <p className="text-[10px] text-zinc-400 font-mono">
                                    Event ID: {detail.id}
                                </p>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
