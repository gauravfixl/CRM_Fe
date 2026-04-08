"use client";

import React, { useEffect, useState } from "react";
import {
    Users,
    Building2,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    ShieldCheck,
    Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import { CustomButton } from "@/shared/components/custom/CustomButton"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios";
import { getOrgDetails } from "@/hooks/orgHooks";
import { getAllFirms } from "@/hooks/firmHooks";

export default function OrgOverviewPage() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "default";
    const [org, setOrg] = useState<any>(null);
    const [totalUsers, setTotalUsers] = useState<number | null>(null);
    const [activeFirms, setActiveFirms] = useState<number | null>(null);
    const [billingPlan, setBillingPlan] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const orgRes = await getOrgDetails();
                setOrg(orgRes?.data?.organization ?? null);
            } catch (e) {
                // ignore, keep placeholders
            }

            try {
                // backend returns pagination.total for org users
                const usersRes = await axiosInstance.get(
                    "/organization/users/all?page=1&limit=1"
                );
                setTotalUsers(usersRes?.data?.pagination?.total ?? 0);
            } catch (e) {
                setTotalUsers(0);
            }

            try {
                const firmsRes = await axiosInstance.get("/firm/getAllFirm");
                const firms = firmsRes?.data?.firms ?? [];
                setActiveFirms(Array.isArray(firms) ? firms.length : 0);
            } catch (e) {
                setActiveFirms(0);
            }

            try {
                const billingRes = await axiosInstance.get("/OrgBilling/current-plan");
                setBillingPlan(billingRes?.data?.currentPlan ?? null);
            } catch (e) {
                setBillingPlan(null);
            }
        };

        load();
    }, []);

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 space-y-4 overflow-y-auto font-sans">
            {/* WELCOME HEADER */}
            {/* WELCOME HEADER */}
            {/* PREMIUM HERO SECTION */}
            <div className="relative w-full h-48 shadow-2xl overflow-hidden flex flex-col justify-center px-8 border-b-4 border-indigo-200">
                {/* Background gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900" />
                
                {/* Decorative background image/pattern */}
                <div 
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30" 
                    style={{ backgroundImage: "url('/images/blue-header.png')" }} 
                />
                
                {/* Abstract shape for depth */}
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl shadow-2xl" />
                
                <div className="relative z-10 space-y-6">
                    <div className="space-y-1">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Enterprise Management</p>
                        <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-xl">
                            {org?.name ?? "Acme Corporation"}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4 text-white/90 text-sm font-semibold">
                        <span className="flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/25 transition-all cursor-pointer">
                            <Globe className="w-4 h-4 text-emerald-400" /> US-East
                        </span>
                        <span className="flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/25 transition-all cursor-pointer">
                            <CreditCard className="w-4 h-4 text-blue-300" /> {billingPlan?.planSnapshot?.name ?? "Enterprise Plan"}
                        </span>
                        <span className="flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/25 transition-all cursor-pointer">
                            <ShieldCheck className="w-4 h-4 text-orange-400" /> SOC2 Compliant
                        </span>
                    </div>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Users</p>
                                <p className="text-white text-xl font-semibold mt-1">
                                    {totalUsers !== null ? totalUsers.toLocaleString() : "—"}
                                </p>
                                <p className="text-white text-[10px] mt-1">+12.5% growth</p>
                            </div>
                            <Users className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Firms</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">
                                    {activeFirms !== null ? activeFirms : "—"}
                                </p>
                                <p className="text-gray-600 text-[10px] mt-1">Across 3 regions</p>
                            </div>
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">System Uptime</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">99.99%</p>
                                <p className="text-green-600 text-[10px] mt-1">Healthy</p>
                            </div>
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Monthly Spend</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{billingPlan?.planSnapshot?.price != null ? `$${billingPlan.planSnapshot.price.toLocaleString()}` : "$1,389"}</p>
                                <p className="text-gray-600 text-[10px] mt-1">{billingPlan?.nextPaymentDate ? `Next bill: ${new Date(billingPlan.nextPaymentDate).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}` : "Next bill: Feb 01"}</p>
                            </div>
                            <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-6">

                {/* RECENT ALERTS */}
                <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">System Notifications</CardTitle>
                            <CustomButton variant="ghost" className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 h-8 rounded-lg" onClick={() => toast.info("Clearing all notifications...")}>Clear All</CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-zinc-900">
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group">
                                    <div className="flex gap-4 items-start">
                                        <div className="h-2 w-2 rounded-full bg-indigo-600 mt-2 shrink-0 animate-pulse" />
                                        <div>
                                            <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Scheduled Maintenance Completed</h4>
                                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">The US-East database cluster was successfully patched.</p>
                                            <p className="text-[10px] text-zinc-400 mt-2 font-mono uppercase tracking-widest">Dec 12, 10:00 AM</p>
                                        </div>
                                    </div>
                                    <CustomButton variant="outline" className="h-8 text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toast.info("Opening full incident report...")}>Details</CustomButton>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* QUICK ACTIONS */}
                <div className="space-y-6">
                    <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-3">
                            <CustomButton 
                                className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-xl justify-start px-4 h-11 shadow-lg border-0 transition-all active:scale-[0.98]" 
                                onClick={() => router.push(`/${orgName}/modules/organization/users/invites`)}
                            >
                                <Users className="w-4 h-4 mr-2" /> Invite New Users
                            </CustomButton>
                            <CustomButton 
                                variant="outline" 
                                className="w-full bg-white dark:bg-zinc-900 border-indigo-100 dark:border-zinc-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-700 font-bold rounded-xl justify-start px-4 h-11 border transition-all active:scale-[0.98]" 
                                onClick={() => router.push(`/${orgName}/modules/organization/units`)}
                            >
                                <Building2 className="w-4 h-4 mr-2" /> Register New Firm
                            </CustomButton>
                            <CustomButton 
                                variant="outline" 
                                className="w-full bg-white dark:bg-zinc-900 border-indigo-100 dark:border-zinc-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-700 font-bold rounded-xl justify-start px-4 h-11 border transition-all active:scale-[0.98]" 
                                onClick={() => router.push(`/${orgName}/modules/organization/subscription`)}
                            >
                                <CreditCard className="w-4 h-4 mr-2" /> Update Billing
                            </CustomButton>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
