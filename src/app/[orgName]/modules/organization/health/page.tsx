"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Activity,
    Users,
    Building2,
    ShieldCheck,
    Lock,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Mail,
    UserCheck,
    UserX,
    Briefcase,
    Sparkles,
    PieChart,
    BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { CustomButton } from "@/shared/components/custom/CustomButton";
import { axiosInstance } from "@/lib/axios";
import { getOrgDetails, getAllOrgInvites } from "@/hooks/orgHooks";
import Loader from "@/shared/components/custom/Loader";

const formatDateLong = (input: string | undefined): string => {
    if (!input) return "—";
    const t = new Date(input).getTime();
    if (!Number.isFinite(t)) return "—";
    return new Date(t).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
};

export default function OrgHealthPage() {
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
    const pendingInvitesCount = useMemo(
        () => invites.filter((i: any) => String(i?.status || "").toLowerCase() === "pending").length,
        [invites]
    );

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

    const seatsAllocated: number | null =
        (billingPlan?.planSnapshot?.maxUsers ??
            billingPlan?.planSnapshot?.seats ??
            billingPlan?.maxUsers ??
            null) as number | null;
    const seatsUsage = seatsAllocated && seatsAllocated > 0
        ? Math.min(100, Math.round((totalUsers / seatsAllocated) * 100))
        : null;

    const mfaPercent = totalUsers > 0 ? Math.round((userStatus.mfaEnabled / totalUsers) * 100) : 0;
    const mfaPending = totalUsers - userStatus.mfaEnabled;

    const inviteStats = useMemo(() => {
        const total = invites.length;
        let accepted = 0, pending = 0, expired = 0, rejected = 0;
        invites.forEach((inv: any) => {
            const s = String(inv?.status || "").toLowerCase();
            if (s === "accepted") accepted++;
            else if (s === "pending") pending++;
            else if (s === "expired") expired++;
            else if (s === "rejected") rejected++;
        });
        const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
        return { total, accepted, pending, expired, rejected, acceptanceRate };
    }, [invites]);

    const firmDistribution = useMemo(() => {
        const memberCountByFirm = new Map<string, number>();
        users.forEach((u: any) => {
            const ids: string[] = Array.isArray(u.firmIds)
                ? u.firmIds.map(String)
                : Array.isArray(u.firms)
                    ? u.firms.map((f: any) => String(f?._id || f))
                    : [];
            ids.forEach((id) => {
                memberCountByFirm.set(id, (memberCountByFirm.get(id) || 0) + 1);
            });
        });
        return activeFirmsList
            .map((f: any) => ({
                _id: String(f._id),
                name: f.FirmName || "Unnamed",
                city: f?.add?.city || "",
                state: f?.add?.state || f?.add?.country || "",
                memberCount: memberCountByFirm.get(String(f._id)) || 0,
                employeeCount: f.employeeCount || 0,
                status: f.status || "Active",
            }))
            .sort((a, b) => b.memberCount - a.memberCount);
    }, [users, activeFirmsList]);

    const totalEmployees = firmDistribution.reduce((s, f) => s + f.employeeCount, 0);
    const maxFirmMembers = firmDistribution[0]?.memberCount || 1;

    const memberGrowth = useMemo(() => {
        const now = Date.now();
        const buckets = { d7: 0, d30: 0, d90: 0 };
        users.forEach((u: any) => {
            const t = u.joinedAt || u.createdAt;
            if (!t) return;
            const diff = now - new Date(t).getTime();
            const days = diff / 86400000;
            if (days <= 7) buckets.d7++;
            if (days <= 30) buckets.d30++;
            if (days <= 90) buckets.d90++;
        });
        return buckets;
    }, [users]);

    const firmGrowth = useMemo(() => {
        const now = Date.now();
        const buckets = { d7: 0, d30: 0, d90: 0 };
        activeFirmsList.forEach((f: any) => {
            if (!f.createdAt) return;
            const days = (now - new Date(f.createdAt).getTime()) / 86400000;
            if (days <= 7) buckets.d7++;
            if (days <= 30) buckets.d30++;
            if (days <= 90) buckets.d90++;
        });
        return buckets;
    }, [activeFirmsList]);

    const planName = billingPlan?.planSnapshot?.name || "Free Plan";
    const orgCreatedAt = org?.createdAt;
    const orgAgeDays = orgCreatedAt
        ? Math.max(0, Math.floor((Date.now() - new Date(orgCreatedAt).getTime()) / 86400000))
        : null;

    const healthScore = useMemo(() => {
        let score = 0, max = 0;
        max += 25;
        if (totalUsers > 0) score += 25;
        max += 25;
        if (mfaPercent >= 80) score += 25;
        else if (mfaPercent >= 50) score += 15;
        else if (mfaPercent >= 25) score += 8;
        max += 25;
        if (seatsUsage === null) score += 15;
        else if (seatsUsage < 70) score += 25;
        else if (seatsUsage < 90) score += 15;
        else score += 5;
        max += 25;
        if (activeFirmsList.length > 0) score += 25;
        return { score, max, pct: Math.round((score / max) * 100) };
    }, [totalUsers, mfaPercent, seatsUsage, activeFirmsList.length]);

    const healthGrade =
        healthScore.pct >= 90 ? { grade: "A+", tone: "text-emerald-600", label: "Excellent" } :
        healthScore.pct >= 75 ? { grade: "A", tone: "text-emerald-600", label: "Healthy" } :
        healthScore.pct >= 60 ? { grade: "B", tone: "text-amber-600", label: "Fair" } :
        healthScore.pct >= 40 ? { grade: "C", tone: "text-amber-600", label: "Needs attention" } :
        { grade: "D", tone: "text-red-600", label: "At risk" };

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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Org Health & Usage</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Org-scoped status of members, firms, security, and plan usage{orgAgeDays !== null && ` · ${orgAgeDays} days old`}
                    </p>
                </div>
                <CustomButton
                    variant="outline"
                    className="h-9 px-4 gap-2 rounded-xl"
                    onClick={() => router.push(`/${orgName}/modules/organization/subscription`)}
                >
                    <Sparkles className="w-4 h-4" /> Manage Plan
                </CustomButton>
            </div>

            {/* TOP METRICS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Health Score</p>
                                <p className="text-white text-2xl font-bold mt-1">{healthScore.pct}%</p>
                                <p className="text-white text-[10px] mt-1 opacity-90">{healthGrade.label} · Grade {healthGrade.grade}</p>
                            </div>
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Seat Usage</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {seatsAllocated !== null ? `${totalUsers}/${seatsAllocated}` : `${totalUsers}`}
                                </p>
                                <p className={`text-[10px] mt-1 font-medium ${
                                    (seatsUsage ?? 0) >= 90 ? "text-red-600" :
                                    (seatsUsage ?? 0) >= 70 ? "text-amber-600" :
                                    "text-emerald-600"
                                }`}>
                                    {seatsAllocated !== null ? `${seatsUsage}% used` : "No plan limit"}
                                </p>
                            </div>
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        {seatsAllocated !== null && (
                            <div className="mt-3 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        (seatsUsage ?? 0) >= 90 ? "bg-red-500" :
                                        (seatsUsage ?? 0) >= 70 ? "bg-amber-500" : "bg-emerald-500"
                                    }`}
                                    style={{ width: `${seatsUsage ?? 0}%` }}
                                />
                            </div>
                        )}
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">MFA Enrollment</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{mfaPercent}%</p>
                                <p className="text-[10px] mt-1 font-medium text-gray-600">
                                    {userStatus.mfaEnabled} enrolled · {mfaPending} pending
                                </p>
                            </div>
                            <Lock className={`w-6 h-6 ${mfaPercent >= 80 ? "text-emerald-500" : mfaPercent >= 50 ? "text-amber-500" : "text-red-500"}`} />
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    mfaPercent >= 80 ? "bg-emerald-500" :
                                    mfaPercent >= 50 ? "bg-amber-500" : "bg-red-500"
                                }`}
                                style={{ width: `${mfaPercent}%` }}
                            />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Invite Acceptance</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{inviteStats.acceptanceRate}%</p>
                                <p className="text-[10px] mt-1 font-medium text-gray-600">
                                    {inviteStats.accepted} of {inviteStats.total} accepted
                                </p>
                            </div>
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                                style={{ width: `${inviteStats.acceptanceRate}%` }}
                            />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MEMBER STATUS + GROWTH */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-none overflow-hidden bg-white">
                    <CardHeader className="border-b border-zinc-100 p-6">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-600" /> Members per Firm
                        </CardTitle>
                        <p className="text-xs text-zinc-500 mt-1">Distribution of org members across business units</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        {firmDistribution.length === 0 ? (
                            <div className="text-center text-sm text-zinc-500 py-8">
                                <Building2 className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                                No firms registered yet
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {firmDistribution.slice(0, 8).map((f) => {
                                    const pct = Math.round((f.memberCount / maxFirmMembers) * 100);
                                    const isActive = f.status === "Active" || !f.status;
                                    return (
                                        <button
                                            key={f._id}
                                            type="button"
                                            onClick={() => router.push(`/${orgName}/modules/firm-management/firms/${f._id}`)}
                                            className="w-full text-left p-2 -m-2 rounded-lg hover:bg-zinc-50 transition-all"
                                        >
                                            <div className="flex items-center justify-between text-sm mb-1.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-semibold text-zinc-800 truncate">{f.name}</span>
                                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                        isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                                    }`}>
                                                        {f.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs flex-shrink-0">
                                                    <span className="text-zinc-500">{f.memberCount} {f.memberCount === 1 ? "member" : "members"}</span>
                                                    {f.employeeCount > 0 && (
                                                        <span className="text-zinc-400">· {f.employeeCount} emp</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {firmDistribution.length > 8 && (
                            <p className="text-xs text-center text-zinc-400 mt-3">
                                Showing top 8 of {firmDistribution.length} firms
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-none overflow-hidden bg-white">
                    <CardHeader className="border-b border-zinc-100 p-6">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-indigo-600" /> Member Health
                        </CardTitle>
                        <p className="text-xs text-zinc-500 mt-1">Status snapshot</p>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="rounded-none bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                                <UserCheck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-emerald-700 font-medium">Active Members</p>
                                <p className="text-xl font-black text-emerald-900">{userStatus.active}</p>
                            </div>
                        </div>

                        <div className="rounded-none bg-amber-50 border border-amber-100 p-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-amber-700 font-medium">Pending Invites</p>
                                <p className="text-xl font-black text-amber-900">{pendingInvitesCount}</p>
                            </div>
                        </div>

                        <div className="rounded-none bg-red-50 border border-red-100 p-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
                                <UserX className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-red-700 font-medium">Suspended</p>
                                <p className="text-xl font-black text-red-900">{userStatus.suspended}</p>
                            </div>
                        </div>

                        <CustomButton
                            variant="outline"
                            className="w-full h-9 text-xs"
                            onClick={() => router.push(`/${orgName}/modules/organization/users`)}
                        >
                            Manage Users
                        </CustomButton>
                    </CardContent>
                </Card>
            </div>

            {/* GROWTH + COMPLIANCE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-none overflow-hidden bg-white">
                    <CardHeader className="border-b border-zinc-100 p-6">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-600" /> Recent Growth
                        </CardTitle>
                        <p className="text-xs text-zinc-500 mt-1">New members & firms over time</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Last 7 days", users: memberGrowth.d7, firms: firmGrowth.d7 },
                                { label: "Last 30 days", users: memberGrowth.d30, firms: firmGrowth.d30 },
                                { label: "Last 90 days", users: memberGrowth.d90, firms: firmGrowth.d90 },
                            ].map((g) => (
                                <div key={g.label} className="rounded-none border border-zinc-100 p-4 bg-gradient-to-br from-zinc-50 to-white">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{g.label}</p>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-600 flex items-center gap-1">
                                                <Users className="w-3 h-3" /> Users
                                            </span>
                                            <span className="text-lg font-black text-indigo-700">+{g.users}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-600 flex items-center gap-1">
                                                <Building2 className="w-3 h-3" /> Firms
                                            </span>
                                            <span className="text-lg font-black text-emerald-700">+{g.firms}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Total Employees</p>
                                    <p className="text-lg font-bold text-zinc-900">{totalEmployees}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Active Firms</p>
                                    <p className="text-lg font-bold text-zinc-900">{activeFirmsList.length}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-none overflow-hidden bg-white">
                    <CardHeader className="border-b border-zinc-100 p-6">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-600" /> Compliance & Status
                        </CardTitle>
                        <p className="text-xs text-zinc-500 mt-1">Org-level checks</p>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        {[
                            // Only include the active-status check if the backend actually returns isActive.
                            // getOrganizationBYId currently strips this field, so showing a misleading
                            // "Suspended or inactive" warning would be wrong.
                            ...(typeof org?.isActive !== "undefined" ? [{
                                label: "Organization is active",
                                ok: !!org.isActive,
                                hint: org.isActive ? "Operational" : "Suspended or inactive",
                            }] : []),
                            {
                                label: "Active billing plan",
                                ok: !!billingPlan,
                                hint: billingPlan ? `Subscribed to ${planName}` : "No plan attached",
                            },
                            {
                                label: "Seat capacity healthy",
                                ok: seatsAllocated === null || (seatsUsage ?? 0) < 90,
                                hint: seatsAllocated === null
                                    ? "No seat limit on plan"
                                    : (seatsUsage ?? 0) < 90
                                        ? `${seatsUsage}% of seats used`
                                        : "Approaching seat limit — upgrade plan",
                            },
                            {
                                label: "MFA adoption above 50%",
                                ok: mfaPercent >= 50,
                                hint: mfaPercent >= 50
                                    ? `${mfaPercent}% of members enrolled`
                                    : `Only ${mfaPercent}% enrolled — encourage 2FA`,
                            },
                            {
                                label: "At least one business unit",
                                ok: activeFirmsList.length > 0,
                                hint: activeFirmsList.length > 0
                                    ? `${activeFirmsList.length} active`
                                    : "Register your first firm",
                            },
                            {
                                label: "Pending invites under 10",
                                ok: pendingInvitesCount < 10,
                                hint: pendingInvitesCount < 10
                                    ? `${pendingInvitesCount} pending`
                                    : `${pendingInvitesCount} pending — review or resend`,
                            },
                        ].map((c) => (
                            <div key={c.label} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50">
                                <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    c.ok ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                }`}>
                                    {c.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900">{c.label}</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{c.hint}</p>
                                </div>
                            </div>
                        ))}

                        {orgCreatedAt && (
                            <p className="text-xs text-zinc-400 pt-2 text-center">
                                Org founded on {formatDateLong(orgCreatedAt)}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
