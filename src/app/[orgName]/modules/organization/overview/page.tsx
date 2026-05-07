"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Users,
    Building2,
    Activity,
    CreditCard,
    Mail,
    UserPlus,
    Clock,
    Briefcase,
    MapPin,
    Calendar,
    TrendingUp,
    Sparkles,
    Send,
    Crown,
    AlertCircle,
    Settings,
    BarChart3,
    Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { Badge } from "@/components/ui/badge";

import { CustomButton } from "@/shared/components/custom/CustomButton";
import { axiosInstance } from "@/lib/axios";
import { getOrgDetails, getAllOrgInvites } from "@/hooks/orgHooks";
import Loader from "@/shared/components/custom/Loader";

type ActivityKind = "firm" | "invite_pending" | "invite_accepted" | "invite_expired" | "invite_rejected";

type ActivityEvent = {
    id: string;
    kind: ActivityKind;
    title: string;
    subtitle: string;
    timestamp: number;
    entityId?: string;
};

const formatRelativeTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    if (diff < 0) return "just now";
    const min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

const formatShortDate = (input: string | number | undefined): string => {
    if (!input) return "—";
    const t = typeof input === "string" ? new Date(input).getTime() : input;
    if (!Number.isFinite(t)) return "—";
    return new Date(t).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const computeExpiry = (expiresAt: string | undefined): { label: string; expired: boolean; soon: boolean } => {
    if (!expiresAt) return { label: "no expiry", expired: false, soon: false };
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (Number.isNaN(diff)) return { label: "invalid", expired: false, soon: false };
    if (diff <= 0) return { label: "expired", expired: true, soon: false };
    const min = Math.floor(diff / 60000);
    const hr = Math.floor(min / 60);
    const days = Math.floor(hr / 24);
    const soon = diff < 24 * 60 * 60 * 1000;
    if (min < 60) return { label: `${Math.max(1, min)}m left`, expired: false, soon };
    if (hr < 24) return { label: `${hr}h left`, expired: false, soon };
    return { label: `${days}d left`, expired: false, soon };
};

export default function OrgOverviewPage() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "default";

    const [org, setOrg] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [firms, setFirms] = useState<any[]>([]);
    const [billingPlan, setBillingPlan] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadedRef = useRef(false);
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const safety = window.setTimeout(() => setLoading(false), 20000);

        ;(async () => {
            try {
                const [orgRes, usersRes, invitesRes, firmsRes, billingRes] = await Promise.allSettled([
                    getOrgDetails(),
                    axiosInstance.get("/organization/users/all"),
                    getAllOrgInvites(),
                    axiosInstance.get("/firm/getAllFirm"),
                    axiosInstance.get("/OrgBilling/current-plan"),
                ]);

                if (orgRes.status === "fulfilled") {
                    setOrg(orgRes.value?.data?.organization ?? null);
                }
                if (usersRes.status === "fulfilled") {
                    const d: any = usersRes.value?.data || {};
                    const arr: any[] = Array.isArray(d) ? d : d.users || d.data || [];
                    setUsers(Array.isArray(arr) ? arr : []);
                }
                if (invitesRes.status === "fulfilled") {
                    const d: any = invitesRes.value?.data || {};
                    const arr: any[] = Array.isArray(d) ? d : d.invitations || d.invites || d.data || [];
                    setInvites(Array.isArray(arr) ? arr : []);
                }
                if (firmsRes.status === "fulfilled") {
                    const arr = firmsRes.value?.data?.firms ?? [];
                    setFirms(Array.isArray(arr) ? arr : []);
                }
                if (billingRes.status === "fulfilled") {
                    setBillingPlan(billingRes.value?.data?.currentPlan ?? null);
                }
            } finally {
                window.clearTimeout(safety);
                setLoading(false);
            }
        })();
    }, []);

    const totalUsers = users.length;
    const activeFirmsList = useMemo(() => firms.filter((f: any) => !f.isDeleted), [firms]);
    const activeFirmsCount = activeFirmsList.length;

    const pendingInvitesList = useMemo(
        () => invites.filter((inv: any) => String(inv?.status || "").toLowerCase() === "pending"),
        [invites]
    );
    const pendingInvitesCount = pendingInvitesList.length;

    const userStatus = useMemo(() => {
        let active = 0, suspended = 0, mfaEnabled = 0;
        users.forEach((u: any) => {
            const s = (u.status || u.memberStatus || "active").toString().toLowerCase();
            if (s === "inactive" || s === "suspended") suspended++;
            else active++;
            if (u.twoFAEnabled) mfaEnabled++;
        });
        return { active, suspended, mfaEnabled };
    }, [users]);

    const roleCounts = useMemo(() => {
        const counts = new Map<string, number>();
        users.forEach((u: any) => {
            const role = u.role || "Member";
            counts.set(role, (counts.get(role) || 0) + 1);
        });
        return Array.from(counts, ([role, count]) => ({ role, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [users]);
    const maxRoleCount = roleCounts[0]?.count || 1;

    const recentFirms = useMemo(() => {
        return [...activeFirmsList]
            .sort((a, b) => {
                const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
                const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
                return tb - ta;
            })
            .slice(0, 5);
    }, [activeFirmsList]);

    const expiringInvites = useMemo(() => {
        return pendingInvitesList
            .map((inv: any) => ({
                ...inv,
                _exp: inv?.expiresAt ? new Date(inv.expiresAt).getTime() : Number.POSITIVE_INFINITY,
            }))
            .sort((a, b) => a._exp - b._exp)
            .slice(0, 5);
    }, [pendingInvitesList]);

    const activityFeed: ActivityEvent[] = useMemo(() => {
        const events: ActivityEvent[] = [];

        activeFirmsList.forEach((f: any) => {
            const t = f?.createdAt ? new Date(f.createdAt).getTime() : 0;
            if (!t) return;
            const city = f?.add?.city ? `${f.add.city}${f.add.state ? `, ${f.add.state}` : ""}` : "Business unit";
            events.push({
                id: `firm-${f._id}`,
                kind: "firm",
                title: `Firm "${f.FirmName || "Unnamed"}" registered`,
                subtitle: city,
                timestamp: t,
                entityId: String(f._id),
            });
        });

        invites.forEach((inv: any) => {
            const t = inv?.createdAt ? new Date(inv.createdAt).getTime() : 0;
            if (!t) return;
            const status = String(inv?.status || "").toLowerCase();
            const email = inv.email || "user";
            const role = inv.role || "Member";
            let kind: ActivityKind = "invite_pending";
            let title = "";
            if (status === "accepted") {
                kind = "invite_accepted";
                title = `${email} joined the organisation`;
            } else if (status === "expired") {
                kind = "invite_expired";
                title = `Invitation expired for ${email}`;
            } else if (status === "rejected") {
                kind = "invite_rejected";
                title = `Invitation declined by ${email}`;
            } else {
                kind = "invite_pending";
                title = `Invitation sent to ${email}`;
            }
            events.push({
                id: `invite-${inv._id || inv.token || t}`,
                kind,
                title,
                subtitle: `Role: ${role}`,
                timestamp: t,
            });
        });

        return events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
    }, [activeFirmsList, invites]);

    const seatsAllocated: number | null =
        (billingPlan?.planSnapshot?.maxUsers ??
            billingPlan?.planSnapshot?.seats ??
            billingPlan?.maxUsers ??
            null) as number | null;
    const seatsUsage = seatsAllocated && seatsAllocated > 0
        ? Math.min(100, Math.round((totalUsers / seatsAllocated) * 100))
        : null;
    const planName = billingPlan?.planSnapshot?.name || "Free Plan";
    const planPrice = billingPlan?.planSnapshot?.price;
    const nextBill = billingPlan?.nextPaymentDate ? new Date(billingPlan.nextPaymentDate) : null;
    const daysToRenewal = nextBill
        ? Math.max(0, Math.ceil((nextBill.getTime() - Date.now()) / 86400000))
        : null;

    const mfaPercent = totalUsers > 0 ? Math.round((userStatus.mfaEnabled / totalUsers) * 100) : 0;

    const uniqueRegions = useMemo(() => {
        const regions = new Set<string>();
        activeFirmsList.forEach((f: any) => {
            const c = f?.add?.state || f?.add?.country;
            if (c) regions.add(String(c));
        });
        return regions.size;
    }, [activeFirmsList]);

    const statusSegments = [
        { label: "Active Members", value: userStatus.active, color: "bg-emerald-500", ring: "#10b981" },
        { label: "Pending Invites", value: pendingInvitesCount, color: "bg-amber-500", ring: "#f59e0b" },
        { label: "Suspended", value: userStatus.suspended, color: "bg-red-500", ring: "#ef4444" },
    ];
    const statusTotal = statusSegments.reduce((s, x) => s + x.value, 0) || 1;

    const conicGradient = useMemo(() => {
        let acc = 0;
        const stops: string[] = [];
        statusSegments.forEach((seg) => {
            const start = (acc / statusTotal) * 360;
            acc += seg.value;
            const end = (acc / statusTotal) * 360;
            stops.push(`${seg.ring} ${start}deg ${end}deg`);
        });
        if (statusSegments.every((s) => s.value === 0)) return "#e5e7eb 0deg 360deg";
        return stops.join(", ");
    }, [statusSegments, statusTotal]);

    if (loading) {
        return (
            <div className="relative flex flex-col h-full w-full bg-slate-50/50 font-sans">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 space-y-6 overflow-y-auto font-sans pb-8">
            {/* HERO */}
            <div className="relative w-full h-52 shadow-2xl overflow-hidden flex flex-col justify-center px-8 border-b-4 border-indigo-200">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900" />
                <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
                    style={{ backgroundImage: "url('/images/blue-header.png')" }}
                />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl shadow-2xl" />

                <div className="relative z-10 space-y-6">
                    <div className="space-y-1">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Enterprise Management</p>
                        <h1
                            className="text-4xl font-black tracking-tight text-white drop-shadow-xl min-h-[40px]"
                            suppressHydrationWarning
                        >
                            {org?.name ?? orgName}
                        </h1>
                        {org?.createdAt && (
                            <p className="text-white/70 text-xs font-medium">
                                Member since {formatShortDate(org.createdAt)}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm font-semibold">
                        <button
                            onClick={() => router.push(`/${orgName}/modules/organization/subscription`)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/25 transition-all"
                        >
                            <CreditCard className="w-4 h-4 text-blue-300" /> {planName}
                        </button>
                        {uniqueRegions > 0 && (
                            <button
                                onClick={() => router.push(`/${orgName}/modules/firm-management/firms`)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/25 transition-all"
                            >
                                <MapPin className="w-4 h-4 text-pink-300" /> {uniqueRegions} {uniqueRegions === 1 ? "Region" : "Regions"}
                            </button>
                        )}
                        {org?.contactEmail && (
                            <span className="flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-lg rounded-xl border border-white/20">
                                <Mail className="w-4 h-4 text-emerald-300" /> {org.contactEmail}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* TOP STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Users</p>
                                <p className="text-white text-2xl font-bold mt-1" suppressHydrationWarning>
                                    {totalUsers.toLocaleString()}
                                </p>
                                <p className="text-white text-[10px] mt-1 opacity-90">
                                    {userStatus.active} active · {userStatus.suspended} suspended
                                </p>
                            </div>
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Firms</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1" suppressHydrationWarning>
                                    {activeFirmsCount}
                                </p>
                                <p className="text-gray-600 text-[10px] mt-1">
                                    {uniqueRegions > 0 ? `Across ${uniqueRegions} ${uniqueRegions === 1 ? "region" : "regions"}` : "No regions yet"}
                                </p>
                            </div>
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Pending Invites</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1" suppressHydrationWarning>
                                    {pendingInvitesCount}
                                </p>
                                <p className="text-amber-600 text-[10px] mt-1 font-medium">
                                    {expiringInvites.filter((i: any) => {
                                        const e = computeExpiry(i.expiresAt);
                                        return e.soon || e.expired;
                                    }).length} need attention
                                </p>
                            </div>
                            <Mail className="w-6 h-6 text-amber-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Monthly Spend</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {typeof planPrice === "number" ? `$${planPrice.toLocaleString()}` : "—"}
                                </p>
                                <p className="text-gray-600 text-[10px] mt-1">
                                    {nextBill
                                        ? `Next bill: ${nextBill.toLocaleDateString("en-US", { month: "short", day: "2-digit" })}`
                                        : "No upcoming bill"}
                                </p>
                            </div>
                            <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* ACTIVITY FEED + STATUS DONUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
                <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-600" /> Recent Org Activity
                                </CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">Latest events across firms, members and invitations</p>
                            </div>
                            <CustomButton
                                variant="ghost"
                                className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 h-8 rounded-lg"
                                onClick={() => router.push(`/${orgName}/audit-logs`)}
                            >
                                View Audit Log
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-zinc-900 max-h-[420px] overflow-y-auto">
                        {activityFeed.length === 0 ? (
                            <div className="p-10 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
                                <Activity className="w-8 h-8 text-zinc-300" />
                                <p>No activity recorded yet</p>
                                <p className="text-xs text-zinc-400">Events will appear here as you add firms and invite users</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {activityFeed.map((ev) => {
                                    const Icon =
                                        ev.kind === "firm" ? Building2 :
                                        ev.kind === "invite_accepted" ? UserPlus :
                                        ev.kind === "invite_expired" ? Clock :
                                        ev.kind === "invite_rejected" ? AlertCircle :
                                        Send;
                                    const tone =
                                        ev.kind === "firm" ? "bg-blue-100 text-blue-600" :
                                        ev.kind === "invite_accepted" ? "bg-emerald-100 text-emerald-600" :
                                        ev.kind === "invite_expired" ? "bg-red-100 text-red-600" :
                                        ev.kind === "invite_rejected" ? "bg-rose-100 text-rose-600" :
                                        "bg-amber-100 text-amber-600";
                                    const handleEventClick = () => {
                                        if (ev.kind === "firm" && ev.entityId) {
                                            router.push(`/${orgName}/modules/firm-management/firms/${ev.entityId}`);
                                        } else {
                                            router.push(`/${orgName}/modules/organization/users/invites`);
                                        }
                                    };
                                    return (
                                        <button
                                            key={ev.id}
                                            type="button"
                                            onClick={handleEventClick}
                                            className="w-full p-4 flex items-start gap-3 hover:bg-zinc-50/50 transition-all text-left"
                                        >
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tone}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                                    {ev.title}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-0.5">{ev.subtitle}</p>
                                            </div>
                                            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest whitespace-nowrap mt-1">
                                                {formatRelativeTime(ev.timestamp)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" /> User Status
                        </CardTitle>
                        <p className="text-xs text-zinc-500 mt-1">Distribution across the org</p>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="flex items-center justify-center mb-4">
                            <div
                                className="relative w-36 h-36 rounded-full"
                                style={{ background: `conic-gradient(${conicGradient})` }}
                            >
                                <div className="absolute inset-3 rounded-full bg-white dark:bg-zinc-900 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{statusTotal}</span>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">total</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {statusSegments.map((seg) => {
                                const pct = Math.round((seg.value / statusTotal) * 100);
                                return (
                                    <div key={seg.label} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-sm ${seg.color}`} />
                                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{seg.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-zinc-900 dark:text-white font-bold">{seg.value}</span>
                                            <span className="text-[10px] text-zinc-400 font-mono">{pct}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RECENT FIRMS + PENDING INVITES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-indigo-600" /> Recent Firms
                                </CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">Latest registered business units</p>
                            </div>
                            <CustomButton
                                variant="ghost"
                                className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 h-8 rounded-lg"
                                onClick={() => router.push(`/${orgName}/modules/firm-management/firms`)}
                            >
                                View all
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentFirms.length === 0 ? (
                            <div className="p-10 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
                                <Building2 className="w-8 h-8 text-zinc-300" />
                                <p>No firms registered yet</p>
                                <CustomButton
                                    className="mt-2 h-8 text-xs"
                                    onClick={() => router.push(`/${orgName}/modules/firm-management/firms/add`)}
                                >
                                    Add Firm
                                </CustomButton>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-50">
                                {recentFirms.map((f: any) => {
                                    const isActive = !f.status || f.status === "Active";
                                    const city = f?.add?.city || "—";
                                    const region = f?.add?.state || f?.add?.country || "";
                                    return (
                                        <div
                                            key={f._id}
                                            className="p-4 flex items-center gap-3 hover:bg-zinc-50/50 transition-all cursor-pointer"
                                            onClick={() => router.push(`/${orgName}/modules/firm-management/firms/${f._id}`)}
                                        >
                                            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                                                {(f.FirmName || "?").charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 truncate">{f.FirmName || "Unnamed firm"}</p>
                                                <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3" /> {city}{region ? `, ${region}` : ""}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge
                                                    className={isActive
                                                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold uppercase"
                                                        : "bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] font-bold uppercase"}
                                                >
                                                    {f.status || "Active"}
                                                </Badge>
                                                <span className="text-[10px] text-zinc-400 font-mono">
                                                    {f.createdAt ? formatRelativeTime(new Date(f.createdAt).getTime()) : "—"}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-amber-500" /> Pending Invitations
                                </CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">Awaiting acceptance</p>
                            </div>
                            <CustomButton
                                variant="ghost"
                                className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 h-8 rounded-lg"
                                onClick={() => router.push(`/${orgName}/modules/organization/users/invites`)}
                            >
                                Manage
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {expiringInvites.length === 0 ? (
                            <div className="p-10 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
                                <Mail className="w-8 h-8 text-zinc-300" />
                                <p>No pending invitations</p>
                                <CustomButton
                                    className="mt-2 h-8 text-xs"
                                    onClick={() => router.push(`/${orgName}/modules/organization/users/invites`)}
                                >
                                    Invite User
                                </CustomButton>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-50">
                                {expiringInvites.map((inv: any) => {
                                    const exp = computeExpiry(inv.expiresAt);
                                    const tone = exp.expired
                                        ? "bg-red-100 text-red-700"
                                        : exp.soon
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-zinc-100 text-zinc-600";
                                    return (
                                        <button
                                            key={inv._id || inv.token}
                                            type="button"
                                            onClick={() => router.push(`/${orgName}/modules/organization/users/invites`)}
                                            className="w-full p-4 flex items-center gap-3 hover:bg-zinc-50/50 transition-all text-left"
                                        >
                                            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                                                <Send className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 truncate">{inv.email}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    {inv.role || "Member"} · sent {inv.createdAt ? formatRelativeTime(new Date(inv.createdAt).getTime()) : "—"}
                                                </p>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${tone}`}>
                                                {exp.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ROLES DISTRIBUTION + SUBSCRIPTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-indigo-600" /> Roles Distribution
                                </CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">Members grouped by role</p>
                            </div>
                            <CustomButton
                                variant="ghost"
                                className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 h-8 rounded-lg"
                                onClick={() => router.push(`/${orgName}/modules/organization/users/roles`)}
                            >
                                Manage roles
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {roleCounts.length === 0 ? (
                            <div className="text-center text-sm text-zinc-500 py-6">No members yet</div>
                        ) : (
                            <div className="space-y-3">
                                {roleCounts.map((r) => {
                                    const pct = Math.round((r.count / maxRoleCount) * 100);
                                    return (
                                        <div key={r.role}>
                                            <div className="flex items-center justify-between text-sm mb-1.5">
                                                <span className="font-semibold text-zinc-800">{r.role}</span>
                                                <span className="text-zinc-500 text-xs">{r.count} {r.count === 1 ? "user" : "users"}</span>
                                            </div>
                                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">MFA Enabled</p>
                                    <p className="text-lg font-bold text-zinc-900">{mfaPercent}%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Unique Roles</p>
                                    <p className="text-lg font-bold text-zinc-900">{roleCounts.length}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-indigo-600" /> Subscription
                                </CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">Current plan & usage</p>
                            </div>
                            <CustomButton
                                variant="ghost"
                                className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 h-8 rounded-lg"
                                onClick={() => router.push(`/${orgName}/modules/organization/subscription`)}
                            >
                                Details
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-5 shadow-lg">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Active Plan</p>
                                    <p className="text-2xl font-black mt-1 text-white">{planName}</p>
                                </div>
                                <Sparkles className="w-6 h-6 text-amber-300" />
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <div>
                                    <p className="text-3xl font-black text-white">
                                        {typeof planPrice === "number" ? `$${planPrice.toLocaleString()}` : "—"}
                                    </p>
                                    <p className="text-white/70 text-xs">per month</p>
                                </div>
                                {nextBill && (
                                    <div className="text-right">
                                        <p className="text-white/70 text-[10px] uppercase tracking-widest">Renews in</p>
                                        <p className="text-xl font-bold text-white">{daysToRenewal}d</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {seatsAllocated !== null && (
                            <div>
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="font-semibold text-zinc-800">Seats Used</span>
                                    <span className="text-zinc-500 text-xs">{totalUsers} / {seatsAllocated}</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            (seatsUsage ?? 0) >= 90
                                                ? "bg-red-500"
                                                : (seatsUsage ?? 0) >= 70
                                                    ? "bg-amber-500"
                                                    : "bg-emerald-500"
                                        }`}
                                        style={{ width: `${seatsUsage ?? 0}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Next Bill</p>
                                    <p className="text-sm font-bold text-zinc-900">
                                        {nextBill ? nextBill.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Status</p>
                                    <p className="text-sm font-bold text-zinc-900">
                                        {billingPlan?.status === "active" || billingPlan?.isActive ? "Active" : billingPlan ? "Pending" : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* QUICK ACTIONS */}
            <div className="px-4">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600" /> Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <CustomButton
                            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-xl justify-start px-4 h-12 shadow-lg border-0 transition-all active:scale-[0.98]"
                            onClick={() => router.push(`/${orgName}/modules/organization/users/invites`)}
                        >
                            <UserPlus className="w-4 h-4 mr-2" /> Invite New Users
                        </CustomButton>
                        <CustomButton
                            variant="outline"
                            className="bg-white border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold rounded-xl justify-start px-4 h-12 border transition-all active:scale-[0.98]"
                            onClick={() => router.push(`/${orgName}/modules/firm-management/firms/add`)}
                        >
                            <Building2 className="w-4 h-4 mr-2" /> Register New Firm
                        </CustomButton>
                        <CustomButton
                            variant="outline"
                            className="bg-white border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold rounded-xl justify-start px-4 h-12 border transition-all active:scale-[0.98]"
                            onClick={() => router.push(`/${orgName}/modules/organization/users/roles`)}
                        >
                            <Crown className="w-4 h-4 mr-2" /> Manage Roles
                        </CustomButton>
                        <CustomButton
                            variant="outline"
                            className="bg-white border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold rounded-xl justify-start px-4 h-12 border transition-all active:scale-[0.98]"
                            onClick={() => router.push(`/${orgName}/modules/organization/subscription`)}
                        >
                            <Settings className="w-4 h-4 mr-2" /> Subscription
                        </CustomButton>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
