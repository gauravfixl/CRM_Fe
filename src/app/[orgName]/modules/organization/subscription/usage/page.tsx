"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    BarChart3,
    HardDrive,
    Users,
    Mail,
    Zap,
    AlertTriangle,
    Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCurrentPlan } from "@/modules/crm/invoices/hooks/billingHooks";
import { fetchUsersApi } from "@/modules/crm/organizations/hooks/orgHooks";

export default function UsagePage() {
    const router = useRouter();
    const params = useParams() as { orgName: string };

    const [seatLimit, setSeatLimit] = useState<number>(25);
    const [seatUsed, setSeatUsed] = useState<number>(18);

    useEffect(() => {
        (async () => {
            try {
                const [planRes, usersRes] = await Promise.allSettled([
                    getCurrentPlan(),
                    fetchUsersApi(),
                ]);

                if (planRes.status === "fulfilled") {
                    const data: any = planRes.value?.data || planRes.value || {};
                    const plan = data.currentPlan || data.plan || {};
                    const tpl = data.billingPlanTemplate || plan.billingPlanId || {};
                    const limit =
                        plan.userLimit ?? plan.seatsLimit ?? plan.maxUsers ??
                        tpl.userLimit ?? tpl.seatsLimit ?? tpl.maxUsers;
                    if (typeof limit === "number" && limit > 0) setSeatLimit(limit);
                }

                if (usersRes.status === "fulfilled") {
                    const d: any = usersRes.value?.data || usersRes.value || {};
                    const arr: any[] = Array.isArray(d) ? d : d.users ? d.users : [];
                    const activeCount = arr.filter((u: any) => u.orgActive !== false).length;
                    if (activeCount > 0) setSeatUsed(activeCount);
                }
            } catch {
                // Silent fallback to defaults
            }
        })();
    }, []);

    const seatPercent = seatLimit > 0 ? Math.min(100, Math.round((seatUsed / seatLimit) * 100)) : 0;

    const navigateToAddons = () => {
        router.push(`/${params.orgName}/modules/organization/subscription/addons`);
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-semibold tracking-tight text-slate-900">Usage & Limits</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Monitor your organization's resource consumption against plan limits.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-slate-200 rounded-lg shadow-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-slate-700">Real-time Metrics</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Storage */}
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-slate-900 text-white p-4">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                            <HardDrive className="w-4 h-4 text-blue-400" /> Storage
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-[10px]">
                            Cloud file storage space.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-semibold text-slate-900">452<span className="text-xs text-slate-400 font-normal ml-0.5">Gb</span></span>
                            <span className="text-[10px] font-medium text-slate-500">of 1Tb</span>
                        </div>
                        <Progress value={45} className="h-1.5 rounded-full bg-slate-100" indicatorClassName="bg-blue-600" />
                        <p className="text-[10px] text-slate-400">Includes media, documents, and backups.</p>
                    </CardContent>
                </Card>

                {/* Users */}
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-slate-900 text-white p-4">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                            <Users className="w-4 h-4 text-emerald-400" /> Active Seats
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-[10px]">
                            Licensed user accounts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-semibold text-slate-900">{seatUsed}<span className="text-xs text-slate-400 font-normal ml-0.5">Users</span></span>
                            <span className="text-[10px] font-medium text-slate-500">of {seatLimit} Seats</span>
                        </div>
                        <Progress value={seatPercent} className="h-1.5 rounded-full bg-slate-100" indicatorClassName="bg-emerald-600" />
                        <p className="text-[10px] text-slate-400">Includes Admins, Editors, and Standard users.</p>
                    </CardContent>
                </Card>

                {/* Api Calls */}
                <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-slate-900 text-white p-4">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                            <Zap className="w-4 h-4 text-amber-400" /> Api Requests
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-[10px]">
                            Monthly integration traffic.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-semibold text-slate-900">850<span className="text-xs text-slate-400 font-normal ml-0.5">k</span></span>
                            <span className="text-[10px] font-medium text-slate-500">of 1M /mo</span>
                        </div>
                        <Progress value={85} className="h-1.5 rounded-full bg-slate-100" indicatorClassName="bg-amber-500" />
                        <p className="text-[10px] text-slate-400">Resets in 12 days.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-slate-200 shadow-sm rounded-xl">
                    <CardHeader className="border-b border-slate-100 p-4 bg-slate-50/50">
                        <CardTitle className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-600" />
                            Email Transmissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 py-5">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="font-medium text-slate-700">Transactional</span>
                                    <span className="font-mono text-slate-500 text-[10px]">12,405 / 50,000</span>
                                </div>
                                <Progress value={24} className="h-1.5 rounded-full" indicatorClassName="bg-indigo-500" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="font-medium text-slate-700">Marketing / Bulk</span>
                                    <span className="font-mono text-slate-500 text-[10px]">5,000 / 10,000</span>
                                </div>
                                <Progress value={50} className="h-1.5 rounded-full" indicatorClassName="bg-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm rounded-xl">
                    <CardHeader className="border-b border-slate-100 p-4 bg-slate-50/50">
                        <CardTitle className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                            <Database className="w-3.5 h-3.5 text-slate-600" />
                            Database Rows
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 py-5">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="font-medium text-slate-700">Crm Contacts</span>
                                    <span className="font-mono text-slate-500 text-[10px]">45,100 / 100,000</span>
                                </div>
                                <Progress value={45} className="h-1.5 rounded-full" indicatorClassName="bg-cyan-500" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="font-medium text-slate-700">Custom Objects</span>
                                    <span className="font-mono text-slate-500 text-[10px]">120 / 500</span>
                                </div>
                                <Progress value={24} className="h-1.5 rounded-full" indicatorClassName="bg-teal-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alert Banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="space-y-0.5">
                    <h4 className="text-xs font-medium text-amber-900">Approaching Limits</h4>
                    <p className="text-[10px] text-amber-800">
                        Your <strong>Api Requests</strong> usage is at 85%. Consider upgrading to the High-Performance Api Add-on to avoid rate limiting during peak hours.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-amber-900 font-medium underline text-[10px]" onClick={navigateToAddons}>
                        View Add-ons
                    </Button>
                </div>
            </div>
        </div>
    );
}
