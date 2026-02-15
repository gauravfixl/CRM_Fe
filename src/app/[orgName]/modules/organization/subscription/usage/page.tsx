"use client";

import React from "react";
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

export default function UsagePage() {
    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Usage & Limits</h1>
                    <p className="text-sm text-slate-500 mt-1">Monitor your organization's resource consumption against plan limits.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-none shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-700">Real-time Metrics</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* STORAGE */}
                <Card className="border-none shadow-md rounded-none overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-slate-900 text-white p-6">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <HardDrive className="w-5 h-5 text-blue-400" /> Storage
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Cloud file storage space.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-3xl font-black text-slate-900">452<span className="text-lg text-slate-400 font-bold ml-1">GB</span></span>
                            <span className="text-sm font-bold text-slate-500">of 1TB</span>
                        </div>
                        <Progress value={45} className="h-3 rounded-none bg-slate-100" indicatorClassName="bg-blue-600" />
                        <p className="text-xs text-slate-400 pt-2">Includes media, documents, and backups.</p>
                    </CardContent>
                </Card>

                {/* USERS */}
                <Card className="border-none shadow-md rounded-none overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-slate-900 text-white p-6">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <Users className="w-5 h-5 text-emerald-400" /> Active Seats
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Licensed user accounts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-3xl font-black text-slate-900">18<span className="text-lg text-slate-400 font-bold ml-1">Users</span></span>
                            <span className="text-sm font-bold text-slate-500">of 25 Seats</span>
                        </div>
                        <Progress value={72} className="h-3 rounded-none bg-slate-100" indicatorClassName="bg-emerald-600" />
                        <p className="text-xs text-slate-400 pt-2">Includes Admins, Editors, and Standard users.</p>
                    </CardContent>
                </Card>

                {/* API CALLS */}
                <Card className="border-none shadow-md rounded-none overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-slate-900 text-white p-6">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <Zap className="w-5 h-5 text-amber-400" /> API Requests
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Monthly integration traffic.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-3xl font-black text-slate-900">850<span className="text-lg text-slate-400 font-bold ml-1">k</span></span>
                            <span className="text-sm font-bold text-slate-500">of 1M /mo</span>
                        </div>
                        <Progress value={85} className="h-3 rounded-none bg-slate-100" indicatorClassName="bg-amber-500" />
                        <p className="text-xs text-slate-400 pt-2">Resets in 12 days.</p>
                    </CardContent>
                </Card>
            </div>

            {/* DETAILED STATS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm rounded-none">
                    <CardHeader className="border-b border-slate-100 p-5 bg-slate-50/50">
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-600" />
                            Email Transmissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 py-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-700">Transactional</span>
                                    <span className="font-mono font-medium text-slate-500">12,405 / 50,000</span>
                                </div>
                                <Progress value={24} className="h-2 rounded-none" indicatorClassName="bg-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-700">Marketing / Bulk</span>
                                    <span className="font-mono font-medium text-slate-500">5,000 / 10,000</span>
                                </div>
                                <Progress value={50} className="h-2 rounded-none" indicatorClassName="bg-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm rounded-none">
                    <CardHeader className="border-b border-slate-100 p-5 bg-slate-50/50">
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Database className="w-4 h-4 text-slate-600" />
                            Database Rows
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 py-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-700">CRM Contacts</span>
                                    <span className="font-mono font-medium text-slate-500">45,100 / 100,000</span>
                                </div>
                                <Progress value={45} className="h-2 rounded-none" indicatorClassName="bg-cyan-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-700">Custom Objects</span>
                                    <span className="font-mono font-medium text-slate-500">120 / 500</span>
                                </div>
                                <Progress value={24} className="h-2 rounded-none" indicatorClassName="bg-teal-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ALERT BANNER */}
            <div className="p-4 bg-amber-50 border border-amber-200 flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-900 uppercase">Approaching Limits</h4>
                    <p className="text-xs text-amber-800">
                        Your <strong>API Requests</strong> usage is at 85%. Consider upgrading to the High-Performance API Add-on to avoid rate limiting during peak hours.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-amber-900 font-bold underline text-xs">
                        View Add-ons
                    </Button>
                </div>
            </div>
        </div>
    );
}
