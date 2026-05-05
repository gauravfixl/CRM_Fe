"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    Building2,
    Mail,
    Crown,
    Activity,
    Calendar,
    PieChart,
    Trophy,
    Sparkles,
    UserCheck,
    Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { CustomButton } from "@/shared/components/custom/CustomButton";
import { axiosInstance } from "@/lib/axios";
import { getOrgDetails, getAllOrgInvites } from "@/hooks/orgHooks";
import Loader from "@/shared/components/custom/Loader";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthKey = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

type FunnelStage = {
    label: string;
    value: number;
    color: string;
    pct: number;
};

export default function OrgInsightsPage() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "default";

    const [org, setOrg] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [firms, setFirms] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadedRef = useRef(false);
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const safety = window.setTimeout(() => setLoading(false), 20000);

        ;(async () => {
            try {
                const [orgRes, usersRes, invitesRes, firmsRes] = await Promise.allSettled([
                    getOrgDetails(),
                    axiosInstance.get("/organization/users/all"),
                    getAllOrgInvites(),
                    axiosInstance.get("/firm/getAllFirm"),
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
            } finally {
                window.clearTimeout(safety);
                setLoading(false);
            }
        })();
    }, []);

    const totalUsers = users.length;
    const activeFirmsList = useMemo(() => firms.filter((f: any) => !f.isDeleted), [firms]);
    const activeFirmsCount = activeFirmsList.length;

    const monthlyData = useMemo(() => {
        const now = new Date();
        const months: { key: string; label: string; users: number; firms: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                key: monthKey(d),
                label: `${MONTH_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
                users: 0,
                firms: 0,
            });
        }
        const idx = new Map(months.map((m, i) => [m.key, i]));

        users.forEach((u: any) => {
            const t = u.joinedAt || u.createdAt;
            if (!t) return;
            const k = monthKey(new Date(t));
            const i = idx.get(k);
            if (i !== undefined) months[i].users++;
        });
        activeFirmsList.forEach((f: any) => {
            if (!f.createdAt) return;
            const k = monthKey(new Date(f.createdAt));
            const i = idx.get(k);
            if (i !== undefined) months[i].firms++;
        });

        return months;
    }, [users, activeFirmsList]);

    const monthMaxValue = Math.max(
        1,
        ...monthlyData.map((m) => Math.max(m.users, m.firms))
    );

    const inviteFunnel: FunnelStage[] = useMemo(() => {
        const total = invites.length;
        let accepted = 0, pending = 0, expired = 0, rejected = 0;
        invites.forEach((i: any) => {
            const s = String(i?.status || "").toLowerCase();
            if (s === "accepted") accepted++;
            else if (s === "pending") pending++;
            else if (s === "expired") expired++;
            else if (s === "rejected") rejected++;
        });
        const denom = total || 1;
        return [
            { label: "Total Sent", value: total, color: "bg-indigo-500", pct: 100 },
            { label: "Accepted", value: accepted, color: "bg-emerald-500", pct: Math.round((accepted / denom) * 100) },
            { label: "Pending", value: pending, color: "bg-amber-500", pct: Math.round((pending / denom) * 100) },
            { label: "Expired", value: expired, color: "bg-zinc-400", pct: Math.round((expired / denom) * 100) },
            { label: "Rejected", value: rejected, color: "bg-red-500", pct: Math.round((rejected / denom) * 100) },
        ];
    }, [invites]);

    const acceptanceRate = inviteFunnel[0].value > 0
        ? Math.round((inviteFunnel[1].value / inviteFunnel[0].value) * 100)
        : 0;

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
    const mfaPercent = totalUsers > 0 ? Math.round((userStatus.mfaEnabled / totalUsers) * 100) : 0;

    const roleCounts = useMemo(() => {
        const counts = new Map<string, number>();
        users.forEach((u: any) => {
            const role = u.role || "Member";
            counts.set(role, (counts.get(role) || 0) + 1);
        });
        return Array.from(counts, ([role, count]) => ({ role, count }))
            .sort((a, b) => b.count - a.count);
    }, [users]);
    const maxRoleCount = roleCounts[0]?.count || 1;

    const topFirms = useMemo(() => {
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
                memberCount: memberCountByFirm.get(String(f._id)) || 0,
                employeeCount: f.employeeCount || 0,
            }))
            .sort((a, b) => b.memberCount + b.employeeCount - (a.memberCount + a.employeeCount))
            .slice(0, 5);
    }, [users, activeFirmsList]);

    const avgMembersPerFirm = activeFirmsCount > 0
        ? (totalUsers / activeFirmsCount).toFixed(1)
        : "0";

    const orgAgeDays: number | null = org?.createdAt
        ? Math.max(0, Math.floor((Date.now() - new Date(org.createdAt).getTime()) / 86400000))
        : null;

    const enabledModules: string[] = Array.isArray(org?.modules) ? org.modules : [];

    const statusSegments = [
        { label: "Active", value: userStatus.active, color: "#10b981" },
        { label: "Suspended", value: userStatus.suspended, color: "#ef4444" },
    ];
    const statusTotal = statusSegments.reduce((s, x) => s + x.value, 0) || 1;
    const statusGradient = useMemo(() => {
        let acc = 0;
        const stops: string[] = [];
        statusSegments.forEach((seg) => {
            const start = (acc / statusTotal) * 360;
            acc += seg.value;
            const end = (acc / statusTotal) * 360;
            stops.push(`${seg.color} ${start}deg ${end}deg`);
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
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports & Insights</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Analytics and trends derived from real organization data
                    </p>
                </div>
                <CustomButton
                    variant="outline"
                    className="h-9 px-4 gap-2 rounded-xl"
                    onClick={() => router.push(`/${orgName}/modules/organization/overview`)}
                >
                    <Activity className="w-4 h-4" /> Back to Dashboard
                </CustomButton>
            </div>

            {/* KPI CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Invite Acceptance</p>
                                <p className="text-white text-2xl font-bold mt-1">{acceptanceRate}%</p>
                                <p className="text-white text-[10px] mt-1 opacity-90">
                                    {inviteFunnel[1].value} of {inviteFunnel[0].value} accepted
                                </p>
                            </div>
                            <Target className="w-6 h-6 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">MFA Enrollment</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{mfaPercent}%</p>
                                <p className="text-[10px] mt-1 text-gray-600">{userStatus.mfaEnabled} of {totalUsers} users</p>
                            </div>
                            <UserCheck className={`w-6 h-6 ${mfaPercent >= 80 ? "text-emerald-500" : mfaPercent >= 50 ? "text-amber-500" : "text-red-500"}`} />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Avg Members / Firm</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{avgMembersPerFirm}</p>
                                <p className="text-[10px] mt-1 text-gray-600">
                                    {totalUsers} users · {activeFirmsCount} firms
                                </p>
                            </div>
                            <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">{orgAgeDays !== null ? "Org Age" : "Total Members"}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {orgAgeDays !== null ? orgAgeDays : totalUsers}
                                </p>
                                <p className="text-[10px] mt-1 text-gray-600">
                                    {orgAgeDays !== null ? "days since founding" : "across the organization"}
                                </p>
                            </div>
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* GROWTH CHART */}
            <Card className="border-zinc-200 shadow-xl rounded-3xl bg-white">
                <CardHeader className="border-b border-zinc-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" /> Growth Trend
                            </CardTitle>
                            <p className="text-xs text-zinc-500 mt-1">New members and firms over the last 6 months</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-indigo-500" /> Users
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm bg-emerald-500" /> Firms
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-6 gap-3 items-end h-56">
                        {monthlyData.map((m) => {
                            const userH = Math.round((m.users / monthMaxValue) * 100);
                            const firmH = Math.round((m.firms / monthMaxValue) * 100);
                            return (
                                <div key={m.key} className="flex flex-col items-center gap-2 h-full">
                                    <div className="flex items-end justify-center gap-1.5 flex-1 w-full">
                                        <div
                                            className="flex-1 bg-gradient-to-t from-indigo-700 to-indigo-400 rounded-t-md transition-all duration-500 relative group"
                                            style={{ height: `${userH}%`, minHeight: m.users > 0 ? "8px" : "2px" }}
                                        >
                                            {m.users > 0 && (
                                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-700">
                                                    {m.users}
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            className="flex-1 bg-gradient-to-t from-emerald-700 to-emerald-400 rounded-t-md transition-all duration-500 relative"
                                            style={{ height: `${firmH}%`, minHeight: m.firms > 0 ? "8px" : "2px" }}
                                        >
                                            {m.firms > 0 && (
                                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-700">
                                                    {m.firms}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{m.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* INVITE FUNNEL + STATUS DONUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-zinc-200 shadow-xl rounded-3xl bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-amber-500" /> Invitation Funnel
                        </CardTitle>
                        <p className="text-xs text-zinc-500 mt-1">Where invitations end up in their lifecycle</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        {inviteFunnel[0].value === 0 ? (
                            <div className="text-center py-8 text-sm text-zinc-500">
                                <Mail className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                                No invitations sent yet
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {inviteFunnel.map((stage) => (
                                    <div key={stage.label}>
                                        <div className="flex items-center justify-between text-sm mb-1.5">
                                            <span className="font-semibold text-zinc-800">{stage.label}</span>
                                            <span className="text-zinc-500 text-xs flex items-center gap-2">
                                                <span className="font-bold text-zinc-900">{stage.value}</span>
                                                <span className="text-[10px] font-mono">{stage.pct}%</span>
                                            </span>
                                        </div>
                                        <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                                                style={{ width: `${stage.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-xl rounded-3xl bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-indigo-600" /> Active vs Suspended
                        </CardTitle>
                        <p className="text-xs text-zinc-500 mt-1">Member account status</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center mb-4">
                            <div
                                className="relative w-36 h-36 rounded-full"
                                style={{ background: `conic-gradient(${statusGradient})` }}
                            >
                                <div className="absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-zinc-900">{totalUsers}</span>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">members</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {statusSegments.map((seg) => {
                                const pct = Math.round((seg.value / statusTotal) * 100);
                                return (
                                    <div key={seg.label} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-sm" style={{ background: seg.color }} />
                                            <span className="text-zinc-700 font-medium">{seg.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-zinc-900 font-bold">{seg.value}</span>
                                            <span className="text-[10px] text-zinc-400 font-mono">{pct}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ROLE DISTRIBUTION + TOP FIRMS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-zinc-200 shadow-xl rounded-3xl bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-indigo-600" /> Role Distribution
                                </CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">All roles assigned in the org</p>
                            </div>
                            <CustomButton
                                variant="ghost"
                                className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 h-8 rounded-lg"
                                onClick={() => router.push(`/${orgName}/modules/organization/users/roles`)}
                            >
                                Manage
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {roleCounts.length === 0 ? (
                            <div className="text-center py-8 text-sm text-zinc-500">
                                <Crown className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                                No members yet
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {roleCounts.map((r) => {
                                    const pct = Math.round((r.count / maxRoleCount) * 100);
                                    return (
                                        <div key={r.role}>
                                            <div className="flex items-center justify-between text-sm mb-1.5">
                                                <span className="font-semibold text-zinc-800">{r.role}</span>
                                                <span className="text-zinc-500 text-xs">
                                                    {r.count} {r.count === 1 ? "user" : "users"}
                                                </span>
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
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-xl rounded-3xl bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-500" /> Top Firms
                                </CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">Ranked by members + employees</p>
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
                    <CardContent className="p-6">
                        {topFirms.length === 0 ? (
                            <div className="text-center py-8 text-sm text-zinc-500">
                                <Building2 className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                                No firms yet
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {topFirms.map((f, idx) => (
                                    <div
                                        key={f._id}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-all"
                                        onClick={() => router.push(`/${orgName}/modules/firm-management/firms/${f._id}`)}
                                    >
                                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0 ${
                                            idx === 0 ? "bg-amber-500" :
                                            idx === 1 ? "bg-zinc-400" :
                                            idx === 2 ? "bg-orange-600" :
                                            "bg-indigo-500"
                                        }`}>
                                            #{idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-900 truncate">{f.name}</p>
                                            <p className="text-xs text-zinc-500">{f.city || "—"}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-bold text-zinc-900">
                                                {f.memberCount} <span className="text-xs font-normal text-zinc-500">m</span>
                                            </p>
                                            <p className="text-[10px] text-zinc-500">
                                                {f.employeeCount} emp
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* MODULES USAGE */}
            <Card className="border-zinc-200 shadow-xl rounded-3xl bg-white">
                <CardHeader className="border-b border-zinc-100">
                    <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-600" /> Module Activation
                    </CardTitle>
                    <p className="text-xs text-zinc-500 mt-1">Modules currently enabled at the organization level</p>
                </CardHeader>
                <CardContent className="p-6">
                    {enabledModules.length === 0 ? (
                        <div className="text-center py-8 text-sm text-zinc-500">
                            <Sparkles className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                            No modules activated yet
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {enabledModules.map((mod) => {
                                const moduleRoutes: Record<string, string> = {
                                    firm: `/${orgName}/modules/firm-management/firms`,
                                    lead: `/${orgName}/modules/crm/leads`,
                                    client: `/${orgName}/modules/crm/clients`,
                                    invoice: `/${orgName}/modules/accounting/invoices`,
                                    user: `/${orgName}/modules/organization/users`,
                                    organization: `/${orgName}/modules/organization/overview`,
                                };
                                const target = moduleRoutes[mod.toLowerCase()];
                                const baseClass = "rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 flex items-center gap-3 transition-all";
                                const cardContent = (
                                    <>
                                        <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-zinc-900 capitalize truncate">{mod}</p>
                                            <p className="text-[10px] text-emerald-600 font-medium">Active</p>
                                        </div>
                                    </>
                                );
                                return target ? (
                                    <button
                                        key={mod}
                                        type="button"
                                        onClick={() => router.push(target)}
                                        className={`${baseClass} text-left hover:shadow-md hover:border-indigo-300`}
                                    >
                                        {cardContent}
                                    </button>
                                ) : (
                                    <div key={mod} className={baseClass}>
                                        {cardContent}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
