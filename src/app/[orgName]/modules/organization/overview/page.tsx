"use client";

import React from "react";
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

export default function OrgOverviewPage() {
    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* WELCOME HEADER */}
            {/* WELCOME HEADER */}
            <div className="bg-blue-600 text-white p-8 rounded-none shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Building2 className="w-64 h-64" />
                </div>
                <div className="relative z-10 space-y-4">
                    <h1 className="text-3xl font-black tracking-tight">Acme Corporation</h1>
                    <div className="flex items-center gap-4 text-blue-100 text-sm font-medium">
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                            <Globe className="w-4 h-4" /> US-East
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                            <CreditCard className="w-4 h-4" /> Enterprise Plan
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                            <ShieldCheck className="w-4 h-4" /> SOC2 Compliant
                        </span>
                    </div>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SmallCard className="shadow-sm border-slate-200">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                        <Users className="w-4 h-4 text-blue-600" />
                    </SmallCardHeader>
                    <SmallCardContent>
                        <div className="text-2xl font-bold text-slate-900">2,543</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center font-bold">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
                        </p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="shadow-sm border-slate-200">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Firms</CardTitle>
                        <Building2 className="w-4 h-4 text-indigo-600" />
                    </SmallCardHeader>
                    <SmallCardContent>
                        <div className="text-2xl font-bold text-slate-900">12</div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center">
                            Across 3 regions
                        </p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="shadow-sm border-slate-200">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">System Uptime</CardTitle>
                        <Activity className="w-4 h-4 text-emerald-600" />
                    </SmallCardHeader>
                    <SmallCardContent>
                        <div className="text-2xl font-bold text-slate-900">99.99%</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center font-bold">
                            Healthy
                        </p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="shadow-sm border-slate-200">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Monthly Spend</CardTitle>
                        <CreditCard className="w-4 h-4 text-amber-600" />
                    </SmallCardHeader>
                    <SmallCardContent>
                        <div className="text-2xl font-bold text-slate-900">$1,389</div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center">
                            Next bill: Feb 01
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

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
