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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import { axiosInstance } from "@/lib/axios";
import { getOrgDetails } from "@/hooks/orgHooks";
import { getAllFirms } from "@/hooks/firmHooks";

export default function OrgOverviewPage() {
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
                setTotalUsers(usersRes?.data?.pagination?.total ?? null);
            } catch (e) {
                setTotalUsers(null);
            }

            try {
                const firmsRes = await getAllFirms();
                const firms = firmsRes?.data?.data ?? [];
                const active = Array.isArray(firms) ? firms.filter((f: any) => !f.isDeleted).length : 0;
                setActiveFirms(active);
            } catch (e) {
                setActiveFirms(null);
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
            <div className="bg-blue-600 text-white px-6 py-7 rounded-none shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Building2 className="w-64 h-64" />
                </div>
                <div className="relative z-10 space-y-4">
                    <h1 className="text-3xl font-black tracking-tight">{org?.name ?? "Acme Corporation"}</h1>
                    <div className="flex items-center gap-4 text-blue-100 text-sm font-medium">
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                            <Globe className="w-4 h-4" /> US-East
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                            <CreditCard className="w-4 h-4" /> {billingPlan?.planSnapshot?.name ?? "Enterprise Plan"}
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                            <ShieldCheck className="w-4 h-4" /> SOC2 Compliant
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
                <Card className="lg:col-span-2 border-none shadow-md rounded-none">
                    <CardHeader className="border-b border-slate-100 p-6 bg-white">
                        <CardTitle className="text-lg font-bold text-slate-900">System Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Scheduled Maintenance Completed</h4>
                                        <p className="text-xs text-slate-500 mt-1">The US-East database cluster was successfully patched.</p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase">Dec 12, 10:00 AM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* QUICK ACTIONS */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-none bg-indigo-50/50">
                        <CardHeader className="p-6">
                            <CardTitle className="text-base font-bold text-indigo-900">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-3">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none justify-start px-4">
                                <Users className="w-4 h-4 mr-2" /> Invite New Users
                            </Button>
                            <Button variant="outline" className="w-full bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold rounded-none justify-start px-4">
                                <Building2 className="w-4 h-4 mr-2" /> Register New Firm
                            </Button>
                            <Button variant="outline" className="w-full bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold rounded-none justify-start px-4">
                                <CreditCard className="w-4 h-4 mr-2" /> Update Billing
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
